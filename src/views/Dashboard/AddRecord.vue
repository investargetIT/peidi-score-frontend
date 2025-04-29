<template>
  <el-dialog v-model="visible" :title="isEdit ? '修改记录' : '新增记录'">
    <div>
      <!-- 新增记录的表单内容 -->
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="批号">
          <el-input
            :disabled="true"
            v-model="form.batchNo"
            placeholder="输入批次号"
          />
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="输入订单号" />
        </el-form-item>
        <el-form-item label="生产日期" prop="productionDate">
          <el-date-picker
            v-model="form.productionDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            @change="setBatchNoAndUniqueCode"
          />
        </el-form-item>
        <el-form-item label="记录状态" prop="status">
          <el-select
            style="width: 240px"
            v-model="form.status"
            placeholder="选择任务状态"
          >
            <el-option
              v-for="item in statusList"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="新增追溯码组">
          <el-button
            type="primary"
            @click="addTraceCodeGroup"
            :disabled="form.traceCodeList.length >= 5"
            :icon="Plus"
          >
          </el-button>
        </el-form-item>
        <div
          class="border-stone-200 border p-2 rounded-md mb-2"
          v-for="(traceCode, index) in form.traceCodeList"
          :key="index"
        >
          <el-row :col="24">
            <el-col :span="10">
              <el-form-item :label="'组 ' + (index + 1) + ' - 最小追溯码编号'">
                <el-input
                  v-model="traceCode.traceCodeMin"
                  placeholder="输入最小追溯码"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="'组 ' + (index + 1) + ' - 最大追溯码编号'">
                <el-input
                  v-model="traceCode.traceCodeMax"
                  placeholder="输入最大追溯码"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button
                type="danger"
                @click="removeTraceCodeGroup(index)"
                :icon="Delete"
                circle
              />
            </el-col>
          </el-row>
        </div>
        <el-form-item label="原料分组">
          <el-button
            type="primary"
            @click="addIngredientGroup"
            :disabled="form.ingredientList.length >= 5"
            :icon="Plus"
          >
          </el-button>
        </el-form-item>
        <div
          class="border-stone-200 border p-2 rounded-md mb-2 relative"
          v-for="(ingredient, index) in form.ingredientList"
          :key="index"
        >
          <el-row :col="24" class="ingredient-group">
            <el-col :span="10">
              <el-form-item :label="'组 ' + (index + 1) + ' - 原料名'">
                <el-input
                  v-model="ingredient.ingredient"
                  placeholder="输入原料名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="'组 ' + (index + 1) + ' - 原料生产商'">
                <el-input
                  v-model="ingredient.rawMaterialProducer"
                  placeholder="输入原料生产商"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="'组 ' + (index + 1) + ' - 检疫证日期'">
                <el-date-picker
                  v-model="ingredient.quarantineCertificateDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="'组 ' + (index + 1) + ' - 三方检验日期'">
                <el-date-picker
                  v-model="ingredient.tripartiteInspectionDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                :label="'组 ' + (index + 1) + ' - 检疫证/出厂检验报告'"
              >
                <el-upload
                  v-model:file-list="ingredient.quarantineCertificateRecords"
                  :headers="{
                    Authorization: formatToken(getToken().accessToken)
                  }"
                  action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
                  :limit="1"
                  list-type="text"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload"
                  :on-preview="handlePreview"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      上传图片支持jpg、png、jpeg、gif格式,大小不超过10M，且最多上传1张。
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item :label="'组 ' + (index + 1) + ' - 三方检测报告'">
                <el-upload
                  v-model:file-list="ingredient.tripartiteInspectionRecords"
                  :headers="{
                    Authorization: formatToken(getToken().accessToken)
                  }"
                  action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
                  :limit="1"
                  list-type="text"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload"
                  :on-preview="handlePreview"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      上传图片支持jpg、png、jpeg、gif格式,大小不超过10M，且最多上传1张。
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button
                type="danger"
                @click="removeIngredientGroup(index)"
                :icon="Delete"
                class="absolute right-0 bottom-0"
                circle
              />
            </el-col>
          </el-row>
        </div>
        <el-form-item label="唯一码">
          <el-input
            :disabled="true"
            v-model="form.uniqueCode"
            placeholder="输入唯一码"
          />
        </el-form-item>
        <el-form-item label="终检单" prop="finalInspectionReports">
          <el-upload
            v-model:file-list="form.finalInspectionReports"
            :limit="5"
            :headers="{
              Authorization: formatToken(getToken().accessToken)
            }"
            action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
            list-type="text"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                上传图片支持jpg、png、jpeg、gif格式,大小不超过10M，且最多上传5张。
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="出厂检验报告" prop="factoryInspectionReports">
          <el-upload
            v-model:file-list="form.factoryInspectionReports"
            :limit="5"
            :headers="{
              Authorization: formatToken(getToken().accessToken)
            }"
            action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
            list-type="text"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                上传图片支持jpg、png、jpeg、gif格式,大小不超过10M，且最多上传5张。
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="primary" v-if="!isEdit" @click="submitRecord"
        >提交</el-button
      >
      <el-button type="primary" v-if="isEdit" @click="updateRecord"
        >更新</el-button
      >
    </div>
  </el-dialog>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
import {
  newMiddleCheck,
  updateMiddleCheck,
  getFileDownLoadPath
} from "@/api/pmApi.ts";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { mappingRecord, downloadFileFun } from "./utils";
import { getToken, formatToken } from "@/utils/auth";

import {
  Check,
  Delete,
  Edit,
  Message,
  Plus,
  Search,
  Star
} from "@element-plus/icons-vue";
import { is } from "@pureadmin/utils";
const emit = defineEmits(["close"]);
const rules = {
  batchNo: [{ required: true, message: "批号不能为空", trigger: "blur" }],
  productionDate: [
    { required: true, message: "生产日期不能为空", trigger: "change" }
  ],
  ingredientList: [
    {
      type: "array",
      required: true,
      message: "至少需要一个原料分组",
      trigger: "change"
    },
    {
      validator: (rule, value, callback) => {
        if (
          value.some(
            item =>
              !item.ingredient ||
              !item.quarantineCertificateDate ||
              !item.tripartiteInspectionDate
          )
        ) {
          callback(new Error("原料分组的所有字段都是必填项"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  finalInspectionReports: [
    { required: false, message: "终检单不能为空", trigger: "change" }
  ],
  factoryInspectionReports: [
    { required: false, message: "出厂检验报告不能为空", trigger: "change" }
  ]
};

const visible = defineModel("visible");
const { details, isEdit, selectedRecord } = defineProps({
  details: {
    type: Array,
    required: true
  },
  selectedRecord: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: true
  },
  statusList: {
    type: Array,
    default: () => []
  }
});

console.log("details1234", details);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const form = ref({
  batchNo: details.productNo,
  dataDeliveryDate: "",
  status: "",
  flowId: details.id,
  orderId: "",
  productionDate: "",
  traceCodeList: [],
  uniqueCode: details.productNo,
  ingredientList: [
    {
      ingredient: "",
      quarantineCertificateDate: "",
      quarantineCertificateRecords: [],
      rawMaterialProducer: "",
      tripartiteInspectionDate: "",
      tripartiteInspectionRecords: []
    }
  ],
  finalInspectionReports: [],
  factoryInspectionReports: []
});
const setBatchNoAndUniqueCode = () => {
  if (!form.value.productionDate) {
    return;
  }
  if (isEdit) {
    return;
  }
  form.value.batchNo =
    details.productNo + dayjs(form.value.productionDate).format("YYYYMMDD");
  form.value.uniqueCode =
    details.productNo + dayjs(form.value.productionDate).format("YYYYMMDD");
};
const handleExceed = () => {
  ElMessage.warning("超过文件数量限制");
};
const validateDates = () => {
  for (const ingredient of form.value.ingredientList) {
    if (
      new Date(ingredient.tripartiteInspectionDate).getTime() <
      new Date(ingredient.quarantineCertificateDate).getTime()
    ) {
      ElMessage.error("三方检验日期不能早于检疫证日期");
      return false;
    }
  }
  return true;
};
const addIngredientGroup = () => {
  if (form.value.ingredientList.length < 5) {
    form.value.ingredientList.push({
      ingredient: "",
      quarantineCertificateDate: "",
      quarantineCertificateRecords: [],
      rawMaterialProducer: "",
      tripartiteInspectionDate: "",
      tripartiteInspectionRecords: []
    });
  } else {
    ElMessage.error("最多只能添加五组原料分组");
  }
};

const removeIngredientGroup = index => {
  form.value.ingredientList.splice(index, 1);
};
if (isEdit) {
  form.value = selectedRecord;
}

const isTripartiteInspectionDateInvalid = computed(() => {
  return (
    form.value.quarantineCertificateDate &&
    form.value.tripartiteInspectionDate &&
    dayjs(form.value.quarantineCertificateDate).isAfter(
      dayjs(form.value.tripartiteInspectionDate)
    )
  );
});

const close = () => {
  emit("close");
};

const submitRecord = () => {
  let uploadData = mappingRecord(form.value);
  if (!validateDates()) {
    return;
  }
  if (!canSubmit()) {
    return;
  }
  formRef.value.validate(valid => {
    if (valid && validateDates()) {
      newMiddleCheck(uploadData).then(res => {
        if (res.code === 200) {
          ElMessage.success("新增成功");
          if (res.msg !== "success") {
            ElMessage.warning(res.msg);
          }
          close();
        } else {
          ElMessage.error("新增失败---" + res.msg);
        }
      });
    } else {
      ElMessage.error("请检查表单填写是否正确");
    }
  });
};
const removeTraceCodeGroup = index => {
  form.value.traceCodeList.splice(index, 1);
};
const formRef = ref(null);
const updateRecord = () => {
  if (!validateDates()) {
    return;
  }
  let uploadData = mappingRecord(form.value);

  if (!canSubmit()) {
    return;
  }

  formRef.value.validate(valid => {
    if (valid && validateDates()) {
      updateMiddleCheck(uploadData).then(res => {
        if (res.code === 200) {
          ElMessage.success("更新成功");
          close();
        } else {
          ElMessage.error("更新失败---" + res.msg);
        }
      });
    } else {
      ElMessage.error("请检查表单填写是否正确");
    }
  });
};

const canSubmit = () => {
  if (isTripartiteInspectionDateInvalid.value) {
    ElMessage.error("三方检验到样日期不能早于检疫证日期");
    return false;
  }

  for (const traceCode of form.value.traceCodeList) {
    console.log("traceCode", traceCode);
    if (Number(traceCode.traceCodeMax) <= Number(traceCode.traceCodeMin)) {
      ElMessage.error("最大追溯码必须大于最小追溯码");
      return false;
    }
  }
  // 检查追溯码组之间是否有重叠
  const sortedTraceCodes = form.value.traceCodeList
    .slice()
    .sort((a, b) => a.traceCodeMin - b.traceCodeMin);
  for (let i = 0; i < sortedTraceCodes.length - 1; i++) {
    if (
      sortedTraceCodes[i].traceCodeMax >= sortedTraceCodes[i + 1].traceCodeMin
    ) {
      ElMessage.error("追溯码组之间不能有重叠部分");
      return false;
    }
  }
  return true;
};

const addTraceCodeGroup = () => {
  if (form.value.traceCodeList.length < 5) {
    form.value.traceCodeList.push({ traceCodeMin: 0, traceCodeMax: 0 });
  }
};

const handlePreview = file => {
  getFileDownLoadPath({
    objectName: "prm/traceability-Flow/" + file.name
  })
    .then(res => {
      const { code, msg, data } = res;
      if (code === 200) {
        dialogImageUrl.value = res.data;
        dialogVisible.value = true;
      } else {
        message("图片预览失败--" + msg, { type: "error" });
      }
    })
    .catch(err => {
      message("图片预览失败", { type: "error" });
    });
};

const beforeUpload = file => {
  const isImage = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isImage) {
    ElMessage.error("上传图片支持jpg、png、jpeg、gif格式");
  }
  if (!isLt10M) {
    ElMessage.error("上传图片大小不超过10M");
  }
  return isImage && isLt10M;
};
</script>

<style>
.invalid-date .el-input__inner {
  color: red;
}

.el-upload__tip {
  font-size: 10px;
  color: #909399;
}
</style>
