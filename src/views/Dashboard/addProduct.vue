<template>
  <el-dialog
    class="relative"
    v-model="visible"
    :title="isEdit ? '更新产品' : '新增产品'"
  >
    <el-button
      class="absolute left-20 top-3"
      @click="showDefaultInfo = !showDefaultInfo"
      >{{ showDefaultInfo ? "收起信息" : "展开信息" }}</el-button
    >
    <el-form
      v-if="newProduct.onSiteEvaluation"
      :model="newProduct"
      :rules="rules"
      ref="productForm"
    >
      <!-- 工厂名称选择 -->
      <el-form-item
        prop="onSiteEvaluation.factoryName"
        label="工厂名称/生产企业"
      >
        <el-select
          :disabled="isEdit"
          v-model="newProduct.onSiteEvaluation.factoryName"
          placeholder="请选择工厂名称/生产企业"
          @change="fillFactoryInfo"
        >
          <el-option
            v-for="factory in factories"
            :key="factory.onSiteEvaluation.factoryName"
            :label="factory.onSiteEvaluation.factoryName"
            :value="factory.onSiteEvaluation.factoryName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="productNo" label="产品号/货号">
        <el-input :disabled="isEdit" v-model="newProduct.productNo"></el-input>
      </el-form-item>
      <el-form-item prop="productName" label="产品名称">
        <el-input
          :disabled="isEdit"
          v-model="newProduct.productName"
        ></el-input>
      </el-form-item>
      <el-tag v-show="showDefaultInfo" type="info" class="mb-3">登陆</el-tag>
      <el-form-item v-show="showDefaultInfo" label="登录网站">
        <el-input
          :disabled="true"
          v-model="newProduct.login.website"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="登录用户名">
        <el-input
          :disabled="true"
          v-model="newProduct.login.username"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="登录密码">
        <el-input
          v-model="newProduct.login.password"
          :disabled="true"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="入口页面步骤">
        <el-input
          :disabled="true"
          type="textarea"
          v-model="newProduct.entryPage"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">实地评价</el-tag>
      <el-form-item v-show="showDefaultInfo" label="新增">
        <el-input
          :disabled="true"
          v-model="newProduct.onSiteEvaluation.add"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="批次编号描述">
        <el-input
          :disabled="true"
          v-model="newProduct.onSiteEvaluation.batchNumber.description"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="批次编号规则">
        <el-input
          :disabled="true"
          v-model="newProduct.onSiteEvaluation.batchNumber.rules"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="批次编号示例">
        <el-input
          :disabled="true"
          v-model="newProduct.onSiteEvaluation.batchNumber.examples"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="当前已选择产品">
        <el-input
          :disabled="true"
          v-model="newProduct.onSiteEvaluation.selectedProduct"
        ></el-input>
      </el-form-item>
      <el-form-item prop="onSiteEvaluation.address" label="地址">
        <el-input v-model="newProduct.onSiteEvaluation.address"></el-input>
      </el-form-item>
      <el-form-item
        prop="onSiteEvaluation.factoryIntroduction"
        label="工厂简介"
      >
        <el-input
          v-model="newProduct.onSiteEvaluation.factoryIntroduction"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="工厂展示">
        <el-input
          v-model="newProduct.onSiteEvaluation.factoryDisplay"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="保存">
        <el-input
          v-model="newProduct.onSiteEvaluation.save"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-tag v-show="showDefaultInfo" type="info" class="mb-3"
        >原料采购</el-tag
      >
      <el-form-item v-show="showDefaultInfo" label="录入">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.entry"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="原料名称">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.materialName"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="原料来源">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.materialSource"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="供应商">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.supplier"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="出厂检验报告">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.inspectionReport"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="采购批号">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.purchaseBatchNumber"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="保存">
        <el-input
          :disabled="true"
          v-model="newProduct.rawMaterialPurchase.save"
        ></el-input>
      </el-form-item>
      <el-tag type="info" v-show="showDefaultInfo" class="mb-3"
        >产品生产</el-tag
      >
      <el-form-item v-show="showDefaultInfo" label="录入">
        <el-input
          :disabled="true"
          v-model="newProduct.productProduction.entry"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item prop="productProduction.productionDate" label="生产日期">
        <el-date-picker
          v-model="newProduct.productProduction.productionDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="生产批次编号">
        <el-input
          v-model="newProduct.productProduction.productionBatchNumber"
        ></el-input>
      </el-form-item> -->
      <el-tag type="info" class="mb-3">成品控制</el-tag>
      <el-form-item v-show="showDefaultInfo" label="录入">
        <el-input
          :disabled="true"
          v-model="newProduct.finishedProductControl.entry"
        ></el-input>
      </el-form-item>
      <el-form-item label="检验结果">
        <el-input
          v-model="newProduct.finishedProductControl.inspectionResult"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="检验报告">
        <el-input
          :disabled="true"
          v-model="newProduct.finishedProductControl.inspectionReport"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="保存">
        <el-input
          :disabled="true"
          v-model="newProduct.finishedProductControl.save"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">售后服务</el-tag>
      <el-form-item v-show="showDefaultInfo" label="录入">
        <el-input
          :disabled="true"
          v-model="newProduct.afterSalesService.entry"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input
          v-model="newProduct.afterSalesService.contactAddress"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="咨询热线">
        <el-input
          v-model="newProduct.afterSalesService.hotline"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="保存">
        <el-input
          :disabled="true"
          v-model="newProduct.afterSalesService.save"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">溯源标识</el-tag>
      <el-form-item :disabled="true" v-show="showDefaultInfo" label="录入">
        <el-input
          v-model="newProduct.traceabilityIdentification.entry"
        ></el-input>
      </el-form-item>
      <el-form-item label="溯源类型">
        <el-input
          :disabled="true"
          v-model="newProduct.traceabilityIdentification.traceabilityType"
        ></el-input>
      </el-form-item>
      <el-form-item label="标识类型">
        <el-input
          :disabled="true"
          v-model="newProduct.traceabilityIdentification.identificationType"
        ></el-input>
      </el-form-item>
      <el-form-item label="标识功能">
        <el-input
          :disabled="true"
          v-model="newProduct.traceabilityIdentification.identificationFunction"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证方法">
        <el-input
          :disabled="true"
          v-model="newProduct.traceabilityIdentification.verificationMode"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="保存">
        <el-input
          :disabled="true"
          v-model="newProduct.traceabilityIdentification.save"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">中检声明</el-tag>
      <el-form-item v-show="showDefaultInfo" label="录入">
        <el-input
          :disabled="true"
          v-model="newProduct.cciStatement.entry"
        ></el-input>
      </el-form-item>
      <el-form-item label="溯源类型">
        <el-input
          :disabled="true"
          v-model="newProduct.cciStatement.traceabilityType"
        ></el-input>
      </el-form-item>
      <el-form-item label="消费者服务">
        <el-input
          :disabled="true"
          v-model="newProduct.cciStatement.consumerService"
        ></el-input>
      </el-form-item>
      <el-form-item label="真实性声明">
        <el-input
          :disabled="true"
          v-model="newProduct.cciStatement.authenticityStatement"
        ></el-input>
      </el-form-item>
      <el-form-item label="侵权声明">
        <el-input
          :disabled="true"
          v-model="newProduct.cciStatement.infringementStatement"
        ></el-input>
      </el-form-item>
      <el-form-item v-show="showDefaultInfo" label="保存">
        <el-input
          :disabled="true"
          v-model="newProduct.cciStatement.save"
        ></el-input>
      </el-form-item>
      <el-tag type="info" v-show="showDefaultInfo" class="mb-3"
        >溯源批次编码</el-tag
      >
      <el-form-item v-show="showDefaultInfo" label="录入">
        <el-input
          :disabled="true"
          v-model="newProduct.traceabilityBatchCoding.entry"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">溯源信息表</el-tag>
      <!-- 
      <el-form-item label="生产企业">
        <el-input v-model="newProduct.productionEnterprise"></el-input>
      </el-form-item> -->
      <el-form-item label="产品品牌">
        <el-input v-model="newProduct.productBrand"></el-input>
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="newProduct.specificationModel"></el-input>
      </el-form-item>
      <el-form-item label="条形码">
        <el-input v-model="newProduct.barCode"></el-input>
      </el-form-item>
      <el-form-item label="原产地">
        <el-input v-model="newProduct.origin"></el-input>
      </el-form-item>
      <el-form-item label="产品分类">
        <el-input v-model="newProduct.productClassification"></el-input>
      </el-form-item>
      <el-form-item label="保质期">
        <el-input v-model="newProduct.shelfLife"></el-input>
      </el-form-item>
      <el-form-item label="存储环境">
        <el-input v-model="newProduct.storageEnvironment"></el-input>
      </el-form-item>
      <el-form-item label="配料信息">
        <el-input v-model="newProduct.ingredientInformation"></el-input>
      </el-form-item>
      <el-form-item
        prop="productProduction.productionTechnology"
        label="生产工艺"
      >
        <el-input
          v-model="newProduct.productProduction.productionTechnology"
        ></el-input>
      </el-form-item>
      <el-form-item prop="productProduction.productionProcess" label="工艺说明">
        <el-input
          v-model="newProduct.productProduction.productionProcess"
        ></el-input>
        <div style="margin-top: 4px">
          <el-tag
            type="primary"
            @click="setProductionProcess('低温风干')"
            style="cursor: pointer"
          >
            低温风干
          </el-tag>
          <el-tag
            type="primary"
            @click="setProductionProcess('冻干工艺')"
            style="margin-left: 10px; cursor: pointer"
          >
            冻干工艺
          </el-tag>
        </div>
      </el-form-item>
      <!-- 新增核心卖点 -->
      <el-form-item prop="sellingPoint" label="核心卖点">
        <el-input type="textarea" v-model="newProduct.sellingPoint"></el-input>
      </el-form-item>
      <!-- 新增核心卖点附件 -->
      <el-form-item prop="sellingPointFile" label="核心卖点附件">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="5"
          v-model:file-list="newProduct.sellingPointFile"
          type="primary"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
        >
          <el-button>选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              上传文件支持jpg、png、jpeg、gif格式,大小不超过2M，且最多上传5张。
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item prop="productPicture" label="产品图片">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="5"
          type="primary"
          v-model:file-list="newProduct.productPicture"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
        >
          <el-button>选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              上传图片支持jpg、png、jpeg、gif格式,大小不超过2M，且最多上传5张。
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item prop="productDetails" label="产品详情">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="5"
          v-model:file-list="newProduct.productDetails"
          type="primary"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
        >
          <el-button>选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              上传图片支持jpg、png、jpeg、gif格式,大小不超过2M，且最多上传5张。
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item prop="factoryPicture" label="工厂照片">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="5"
          v-model:file-list="newProduct.factoryPicture"
          type="primary"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
        >
          <el-button>选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              上传图片支持jpg、png、jpeg、gif格式,大小不超过2M，且最多上传5张。
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item prop="productionProcessDrawing" label="生产工艺图">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="5"
          v-model:file-list="newProduct.productionProcessDrawing"
          type="primary"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
        >
          <el-button>选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              上传图片支持jpg、png、jpeg、gif格式,大小不超过2M，且最多上传5张。
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showModal = false">取消</el-button>
      <el-button type="primary" @click="saveProduct">保存</el-button>
    </span>
  </el-dialog>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import factories from "./const";
import { newTask, updateProduct, getFileDownLoadPath } from "@/api/pmApi.ts";
import { getToken, formatToken } from "@/utils/auth";
import { mapping, downloadFileFun } from "./utils";
// import { getTaskUnassigned } from "@/api/task";
const visible = defineModel("visible");
const productForm = ref(null);
// 接受props的isEdit，默认是false
const { isEdit, details } = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  details: {
    type: Object,
    default: () => ({})
  }
});

const emits = defineEmits(["refresh"]);

const isFlod = ref(false);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const selectedFactory = ref("");
const selectedFactoryInfo = ref(null);
const handleProductPictureUploadSuccess = (res, file) => {
  newProduct.value.productPicture = res.data;
};

const handleProductDetailsUploadSuccess = (res, file) => {
  newProduct.value.productDetails = res.data;
};

const rules = {
  productNo: [{ required: true, message: "请输入产品号", trigger: "blur" }],
  productName: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
  "productProduction.productionTechnology": [
    { required: true, message: "请输入生产工艺", trigger: "blur" }
  ],
  "productProduction.productionProcess": [
    { required: true, message: "请输入工艺说明", trigger: "blur" }
  ],
  "onSiteEvaluation.factoryName": [
    { required: true, message: "请选择工厂名称", trigger: "change" }
  ],
  "onSiteEvaluation.address": [
    { required: true, message: "请输入地址", trigger: "blur" }
  ],
  "onSiteEvaluation.factoryIntroduction": [
    { required: true, message: "请输入工厂简介", trigger: "blur" }
  ],
  productPicture: [
    { required: true, message: "请上传产品图片", trigger: "change" }
  ],
  productDetails: [
    { required: true, message: "请上传产品详情", trigger: "change" }
  ],
  factoryPicture: [
    { required: true, message: "请上传工厂照片", trigger: "change" }
  ],
  productionProcessDrawing: [
    { required: true, message: "请上传生产工艺图", trigger: "change" }
  ],
  sellingPoint: [{ required: true, message: "请输入核心卖点", trigger: "blur" }]
};

// 是否展示默认信息
const showDefaultInfo = ref(false);
const emptyValue = {
  productNo: "",
  productName: "",
  login: {
    website: "",
    username: "",
    password: ""
  },
  entryPage: "",
  onSiteEvaluation: {
    add: "",
    batchNumber: {
      description: "",
      rules: [],
      examples: []
    },
    selectedProduct: "",
    factoryName: "",
    address: "",
    factoryIntroduction: "",
    factoryDisplay: "",
    save: ""
  },
  rawMaterialPurchase: {
    entry: "",
    materialName: "",
    materialSource: "",
    supplier: "",
    inspectionReport: "",
    purchaseBatchNumber: "",
    save: ""
  },
  productProduction: {
    entry: "",
    productionProcess: "低温风干",
    productionDate: "",
    productionBatchNumber: ""
  },
  finishedProductControl: {
    entry: "",
    inspectionResult: "",
    inspectionReport: "",
    save: ""
  },
  afterSalesService: {
    entry: "",
    contactAddress: "",
    hotline: "",
    save: ""
  },
  traceabilityIdentification: {
    entry: "",
    traceabilityType: "",
    identificationType: "",
    identificationFunction: "",
    verificationMode: "",
    save: ""
  },
  cciStatement: {
    entry: "",
    traceabilityType: "",
    consumerService: "",
    authenticityStatement: "",
    infringementStatement: "",
    save: ""
  },
  traceabilityBatchCoding: {
    entry: ""
  },
  //生产企业
  productionEnterprise: "",
  //产品品牌
  productBrand: "Meatyway爵宴",
  // 规格型号
  specificationModel: "",
  // 条形码
  barCode: "",
  // 原产地
  origin: "中国",
  // 产品分类
  productClassification:
    "农副食品，动、植物油制品-饲料及宠物食品-宠物食品-宠物猫狗食品",
  // 保质期
  shelfLife: "",
  // 存储环境
  storageEnvironment: "请置于干爽清洁处，避免阳光直射。",
  // 配料信息
  ingredientInformation: "",
  // 产品图片
  productPicture: [],
  // 产品详情
  productDetails: [],
  // 新增核心卖点
  sellingPoint: "",
  // 新增核心卖点附件
  sellingPointFile: []
};
const newProduct = ref(emptyValue);

// 监听details的变化,如果是编辑状态，将details赋值给newProduct
watch(
  () => details,
  () => {
    console.log("details change:", details);
    if (isEdit) {
      newProduct.value = details;
    }
  },
  {
    immediate: true,
    deep: true
  }
);

const setProductionProcess = value => {
  newProduct.value.productProduction.productionProcess = value;
};

// 重制产品信息
const resetNewProduct = () => {
  newProduct.value = emptyValue;
};

// 深度合并对象属性
const deepMerge = (target, source) => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && source[key] !== null) {
        if (!target[key]) {
          target[key] = Array.isArray(source[key]) ? [] : {};
        }
        deepMerge(target[key], source[key]);
      } else {
        if (!target[key]) {
          target[key] = source[key];
        }
      }
    }
  }
};

const fillFactoryInfo = () => {
  selectedFactoryInfo.value = factories.find(
    factory =>
      factory.onSiteEvaluation.factoryName ===
      newProduct.value.onSiteEvaluation.factoryName
  );
  if (selectedFactoryInfo.value) {
    deepMerge(newProduct.value, selectedFactoryInfo.value);
  }
};

if (isEdit) {
  newProduct.value = details;
  fillFactoryInfo();
  console.log("details:", details);
}
const saveProduct = () => {
  productForm.value.validate(valid => {
    if (valid) {
      // 保存产品逻辑
      console.log("保存产品:", newProduct.value);
      const postData = mapping(newProduct.value);
      console.log("postData:", postData);
      if (isEdit) {
        updateProduct({
          ...postData,
          id: newProduct.value.id
        })
          .then(res => {
            if (res.code !== 200) {
              ElMessage.error("产品更新失败--" + res.msg);
              return;
            }
            console.log("res:", res);
            ElMessage.success("产品更新成功");
            emits("refresh");
            resetNewProduct();
            visible.value = false;
          })
          .catch(err => {
            console.error("err:", err);
            ElMessage.error("产品更新失败");
          });
        return;
      } else {
        newTask({
          ...postData
        })
          .then(res => {
            if (res.code !== 200) {
              ElMessage.error("产品保存失败--" + res.msg);
              return;
            }
            console.log("res:", res);
            ElMessage.success("产品保存成功");
            emits("refresh");
            resetNewProduct();
            visible.value = false;
          })
          .catch(err => {
            console.error("err:", err);
            ElMessage.error("产品保存失败");
          });
      }
    } else {
      ElMessage.error("表单还有未填项");
      return false;
    }
  });
};

const beforeUpload = file => {
  const isImage = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
  const isLt10M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("上传图片支持jpg、png、jpeg、gif格式");
  }
  if (!isLt10M) {
    ElMessage.error("上传图片大小不超过10M");
  }
  return isImage && isLt10M;
};

const handleExceed = () => {
  ElMessage.warning("超过文件数量限制");
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
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
