<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '修改记录' : '新增记录'"
    @close="close"
  >
    <div>
      <!-- 新增记录的表单内容 -->
      <form @submit.prevent="submitRecord">
        <el-form :model="form">
          <el-form-item label="批次号">
            <el-input v-model="form.batchNo" placeholder="输入批次号" />
          </el-form-item>
          <el-form-item label="数据交付日期">
            <el-date-picker
              v-model="form.dataDeliveryDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="成分">
            <el-input v-model="form.ingredients" placeholder="输入成分" />
          </el-form-item>
          <el-form-item label="订单ID">
            <el-input v-model="form.orderId" placeholder="输入订单ID" />
          </el-form-item>
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="form.productionDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="检疫证书日期">
            <el-date-picker
              v-model="form.quarantineCertificateDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="原料生产商">
            <el-input
              v-model="form.rawMaterialProducer"
              placeholder="输入原料生产商"
            />
          </el-form-item>
          <el-form-item label="最大溯源码">
            <el-input
              v-model="form.traceCodeMax"
              placeholder="输入最大溯源码"
            />
          </el-form-item>
          <el-form-item label="最小溯源码">
            <el-input
              v-model="form.traceCodeMin"
              placeholder="输入最小溯源码"
            />
          </el-form-item>
          <el-form-item label="三方检验日期">
            <el-date-picker
              v-model="form.tripartiteInspectionDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="唯一编码">
            <el-input v-model="form.uniqueCode" placeholder="输入唯一编码" />
          </el-form-item>
        </el-form>
        <el-button type="primary" v-if="!isEdit" @click="submitRecord"
          >提交</el-button
        >
        <el-button type="primary" v-if="isEdit" @click="updateRecord"
          >更新</el-button
        >
      </form>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { newMiddleCheck, updateMiddleCheck } from "@/api/pmApi.ts";
import { ElMessage } from "element-plus";
const emit = defineEmits(["close", "add-record"]);
const visible = ref(true);

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
  }
});
console.log("record details:", details);
const form = ref({
  batchNo: "",
  dataDeliveryDate: "",
  flowId: details.id,
  ingredients: "",
  orderId: "",
  productionDate: "",
  quarantineCertificateDate: "",
  rawMaterialProducer: "",
  traceCodeMax: 0,
  traceCodeMin: 0,
  tripartiteInspectionDate: "",
  uniqueCode: ""
});

if (isEdit) {
  console.log("selectedRecord:", selectedRecord);
  form.value = selectedRecord;
}

const close = () => {
  emit("close");
};

const submitRecord = () => {
  newMiddleCheck(form.value).then(res => {
    if (res.code === 200) {
      ElMessage.success("新增成功");
      close();
    } else {
      ElMessage.error("新增失败---" + res.msg);
    }
  });
};

const updateRecord = () => {
  console.log("form:", form.value);
  updateMiddleCheck(form.value).then(res => {
    if (res.code === 200) {
      ElMessage.success("更新成功");
      close();
    } else {
      ElMessage.error("更新失败---" + res.msg);
    }
  });
};
</script>

<style scoped>
/* 你可以根据需要添加样式 */
</style>
