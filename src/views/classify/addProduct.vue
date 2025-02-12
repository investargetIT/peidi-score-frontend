<template>
  <el-dialog v-model="visible" :title="isEdit ? '更新产品' : '新增产品'">
    <el-form v-if="newProduct.onSiteEvaluation" :model="newProduct">
      <!-- 工厂名称选择 -->
      <el-form-item label="工厂名称">
        <el-select
          v-model="newProduct.onSiteEvaluation.factoryName"
          placeholder="请选择工厂"
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
      <el-form-item label="产品号">
        <el-input v-model="newProduct.productNo"></el-input>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="newProduct.productName"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">登陆</el-tag>
      <el-form-item label="登录网站">
        <el-input v-model="newProduct.login.website"></el-input>
      </el-form-item>
      <el-form-item label="登录用户名">
        <el-input v-model="newProduct.login.username"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input
          v-model="newProduct.login.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="入口页面步骤">
        <el-input type="textarea" v-model="newProduct.entryPage"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">实地评价</el-tag>
      <el-form-item label="现场评估添加">
        <el-input v-model="newProduct.onSiteEvaluation.add"></el-input>
      </el-form-item>
      <el-form-item label="批次编号描述">
        <el-input
          v-model="newProduct.onSiteEvaluation.batchNumber.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="批次编号规则">
        <el-input
          v-model="newProduct.onSiteEvaluation.batchNumber.rules"
        ></el-input>
      </el-form-item>
      <el-form-item label="批次编号示例">
        <el-input
          v-model="newProduct.onSiteEvaluation.batchNumber.examples"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择的产品步骤">
        <el-input
          v-model="newProduct.onSiteEvaluation.selectedProduct"
        ></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="newProduct.onSiteEvaluation.address"></el-input>
      </el-form-item>
      <el-form-item label="工厂介绍">
        <el-input
          v-model="newProduct.onSiteEvaluation.factoryIntroduction"
        ></el-input>
      </el-form-item>
      <el-form-item label="工厂展示">
        <el-input
          v-model="newProduct.onSiteEvaluation.factoryDisplay"
        ></el-input>
      </el-form-item>
      <el-form-item label="保存">
        <el-input v-model="newProduct.onSiteEvaluation.save"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">原料采购</el-tag>
      <el-form-item label="录入">
        <el-input v-model="newProduct.rawMaterialPurchase.entry"></el-input>
      </el-form-item>
      <el-form-item label="材料名称">
        <el-input
          v-model="newProduct.rawMaterialPurchase.materialName"
        ></el-input>
      </el-form-item>
      <el-form-item label="材料来源">
        <el-input
          v-model="newProduct.rawMaterialPurchase.materialSource"
        ></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="newProduct.rawMaterialPurchase.supplier"></el-input>
      </el-form-item>
      <el-form-item label="检验报告">
        <el-input
          v-model="newProduct.rawMaterialPurchase.inspectionReport"
        ></el-input>
      </el-form-item>
      <el-form-item label="采购批次编号">
        <el-input
          v-model="newProduct.rawMaterialPurchase.purchaseBatchNumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="保存">
        <el-input v-model="newProduct.rawMaterialPurchase.save"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">产品生产</el-tag>
      <el-form-item label="录入">
        <el-input v-model="newProduct.productProduction.entry"></el-input>
      </el-form-item>
      <el-form-item label="生产过程">
        <el-input
          v-model="newProduct.productProduction.productionProcess"
        ></el-input>
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="newProduct.productProduction.productionDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="生产批次编号">
        <el-input
          v-model="newProduct.productProduction.productionBatchNumber"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">成品控制</el-tag>
      <el-form-item label="录入">
        <el-input v-model="newProduct.finishedProductControl.entry"></el-input>
      </el-form-item>
      <el-form-item label="检验结果">
        <el-input
          v-model="newProduct.finishedProductControl.inspectionResult"
        ></el-input>
      </el-form-item>
      <el-form-item label="检验报告">
        <el-input
          v-model="newProduct.finishedProductControl.inspectionReport"
        ></el-input>
      </el-form-item>
      <el-form-item label="保存">
        <el-input v-model="newProduct.finishedProductControl.save"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">售后服务</el-tag>
      <el-form-item label="录入">
        <el-input v-model="newProduct.afterSalesService.entry"></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input
          v-model="newProduct.afterSalesService.contactAddress"
        ></el-input>
      </el-form-item>
      <el-form-item label="热线">
        <el-input v-model="newProduct.afterSalesService.hotline"></el-input>
      </el-form-item>
      <el-form-item label="保存">
        <el-input v-model="newProduct.afterSalesService.save"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">溯源标识</el-tag>
      <el-form-item label="录入">
        <el-input
          v-model="newProduct.traceabilityIdentification.entry"
        ></el-input>
      </el-form-item>
      <el-form-item label="溯源类型">
        <el-input
          v-model="newProduct.traceabilityIdentification.traceabilityType"
        ></el-input>
      </el-form-item>
      <el-form-item label="标识类型">
        <el-input
          v-model="newProduct.traceabilityIdentification.identificationType"
        ></el-input>
      </el-form-item>
      <el-form-item label="标识功能">
        <el-input
          v-model="newProduct.traceabilityIdentification.identificationFunction"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证方法">
        <el-input
          v-model="newProduct.traceabilityIdentification.verificationMethod"
        ></el-input>
      </el-form-item>
      <el-form-item label="保存">
        <el-input
          v-model="newProduct.traceabilityIdentification.save"
        ></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">CCI声明</el-tag>
      <el-form-item label="录入">
        <el-input v-model="newProduct.cciStatement.entry"></el-input>
      </el-form-item>
      <el-form-item label="溯源类型">
        <el-input v-model="newProduct.cciStatement.traceabilityType"></el-input>
      </el-form-item>
      <el-form-item label="消费者服务">
        <el-input v-model="newProduct.cciStatement.consumerService"></el-input>
      </el-form-item>
      <el-form-item label="真实性声明">
        <el-input
          v-model="newProduct.cciStatement.authenticityStatement"
        ></el-input>
      </el-form-item>
      <el-form-item label="侵权声明">
        <el-input
          v-model="newProduct.cciStatement.infringementStatement"
        ></el-input>
      </el-form-item>
      <el-form-item label="保存">
        <el-input v-model="newProduct.cciStatement.save"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">溯源批次编码</el-tag>
      <el-form-item label="录入">
        <el-input v-model="newProduct.traceabilityBatchCoding.entry"></el-input>
      </el-form-item>
      <el-tag type="info" class="mb-3">溯源信息表</el-tag>

      <el-form-item label="生产企业">
        <el-input v-model="newProduct.productionEnterprise"></el-input>
      </el-form-item>
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
      <el-form-item label="产品图片(oss)">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="1"
          type="primary"
          v-model:file-list="newProduct.productPicture"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
        >
          <el-button>选择文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品详情(oss)">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://api.peidigroup.cn/prm/traceability-flow/upload-oss"
          :limit="1"
          v-model:file-list="newProduct.productDetails"
          type="primary"
          :headers="{
            Authorization: formatToken(getToken().accessToken)
          }"
        >
          <el-button>选择文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showModal = false">取消</el-button>
      <el-button type="primary" @click="saveProduct">保存</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import factories from "./const";
import { newTask, updateProduct } from "@/api/pmApi.ts";
import { getToken, formatToken } from "@/utils/auth";
import { de } from "element-plus/es/locale/index.mjs";

// import { getTaskUnassigned } from "@/api/task";
const visible = defineModel("visible");

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

const selectedFactory = ref("");
const selectedFactoryInfo = ref(null);
const handleProductPictureUploadSuccess = (res, file) => {
  newProduct.value.productPicture = res.data;
};

const handleProductDetailsUploadSuccess = (res, file) => {
  newProduct.value.productDetails = res.data;
};
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
    productionProcess: "",
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
    verificationMethod: "",
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
  productBrand: "",
  // 规格型号
  specificationModel: "",
  // 条形码
  barCode: "",
  // 原产地
  origin: "",
  // 产品分类
  productClassification: "",
  // 保质期
  shelfLife: "",
  // 存储环境
  storageEnvironment: "",
  // 配料信息
  ingredientInformation: "",
  // 产品图片(oss)
  productPicture: [],
  // 产品详情(oss)
  productDetails: []
};
const newProduct = ref(emptyValue);

if (isEdit) {
  newProduct.value = details;
  console.log("details:", details);
}

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

// 重制产品信息
const resetNewProduct = () => {
  newProduct.value = emptyValue;
};

const fillFactoryInfo = () => {
  selectedFactoryInfo.value = factories.find(
    factory =>
      factory.onSiteEvaluation.factoryName ===
      newProduct.value.onSiteEvaluation.factoryName
  );
  if (selectedFactoryInfo.value) {
    Object.assign(newProduct.value, selectedFactoryInfo.value);
  }
};
const saveProduct = () => {
  // 保存产品逻辑
  console.log("保存产品:", newProduct.value);
  ElMessage.success("产品保存成功");
  const postData = {
    productNo: newProduct.value.productNo,
    productName: newProduct.value.productName,
    loginInfo: JSON.stringify({
      website: newProduct.value.login.website,
      username: newProduct.value.login.username,
      password: newProduct.value.login.password
    }),
    infoEntryPage: newProduct.value.entryPage,
    fieldEvaluationAdd: newProduct.value.onSiteEvaluation.add,
    batchNo: JSON.stringify(newProduct.value.onSiteEvaluation.batchNumber),
    selectedProducts: newProduct.value.onSiteEvaluation.selectedProduct,
    factoryName: newProduct.value.onSiteEvaluation.factoryName,
    detailedAddress: newProduct.value.onSiteEvaluation.address,
    factoryProfile: newProduct.value.onSiteEvaluation.factoryIntroduction,
    factoryDisplay: newProduct.value.onSiteEvaluation.factoryDisplay,
    fieldEvaluationSave: newProduct.value.onSiteEvaluation.save,
    rawMaterialPurchaseAdd: newProduct.value.rawMaterialPurchase.entry,
    rawMaterialName: newProduct.value.rawMaterialPurchase.materialName,
    rawMaterialSource: newProduct.value.rawMaterialPurchase.materialSource,
    supplier: newProduct.value.rawMaterialPurchase.supplier,
    factoryInspectionReport:
      newProduct.value.rawMaterialPurchase.inspectionReport,
    purchaseLotNumber: newProduct.value.rawMaterialPurchase.purchaseBatchNumber,
    rawMaterialPurchaseSave: newProduct.value.rawMaterialPurchase.save,
    productProductionAdd: newProduct.value.productProduction.entry,
    productionProcess: newProduct.value.productProduction.productionProcess,
    productionDate: newProduct.value.productProduction.productionDate,
    productionTechnology:
      newProduct.value.productProduction.productionTechnology,
    processSpecification:
      newProduct.value.productProduction.technologyDescription,
    productProductionSave: newProduct.value.productProduction.save,
    finishedProductControlAdd: newProduct.value.finishedProductControl.entry,
    testResult: newProduct.value.finishedProductControl.inspectionResult,
    testReport: newProduct.value.finishedProductControl.inspectionReport,
    finishedProductControlSave: newProduct.value.finishedProductControl.save,
    afterSalesServiceAdd: newProduct.value.afterSalesService.entry,
    contactAddress: newProduct.value.afterSalesService.contactAddress,
    enquiryHotline: newProduct.value.afterSalesService.hotline,
    afterSalesServiceSave: newProduct.value.afterSalesService.save,
    traceabilityIdentificationAdd:
      newProduct.value.traceabilityIdentification.entry,
    traceabilityType:
      newProduct.value.traceabilityIdentification.traceabilityType,
    identificationType:
      newProduct.value.traceabilityIdentification.identificationType,
    identificationFunction:
      newProduct.value.traceabilityIdentification.identificationFunction,
    verificationMethod:
      newProduct.value.traceabilityIdentification.verificationMethod,
    traceabilityIdentificationSave:
      newProduct.value.traceabilityIdentification.save,
    inspectionDeclarationAdd: newProduct.value.cciStatement.entry,
    inspectionTraceabilityType: newProduct.value.cciStatement.traceabilityType,
    consumerService: newProduct.value.cciStatement.consumerService,
    authenticityStatement: newProduct.value.cciStatement.authenticityStatement,
    infringementStatement: newProduct.value.cciStatement.infringementStatement,
    inspectionDeclarationSave: newProduct.value.cciStatement.save,
    traceabilityBatchCoding: newProduct.value.traceabilityBatchCoding.entry,
    productionEnterprise: newProduct.value.productionEnterprise,
    productBrand: newProduct.value.productBrand,
    specificationModel: newProduct.value.specificationModel,
    barCode: newProduct.value.barCode,
    origin: newProduct.value.origin,
    productClassification: newProduct.value.productClassification,
    shelfLife: newProduct.value.shelfLife,
    storageEnvironment: newProduct.value.storageEnvironment,
    ingredientInformation: newProduct.value.ingredientInformation,
    productPicture: JSON.stringify(newProduct.value.productPicture),
    productDetails: JSON.stringify(newProduct.value.productDetails)
  };
  console.log("postData:", postData);
  if (isEdit) {
    updateProduct({
      ...postData,
      id: newProduct.value.id
    })
      .then(res => {
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
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
