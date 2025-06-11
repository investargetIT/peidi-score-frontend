<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="供应商管理" name="supplier-management">
        <template #title>
          <div class="collapse-title">
            <span
              >供应商管理
              <el-tooltip content="对应GRI标准: 308-1" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"><InfoFilled /></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description"
              >供应商选择标准、管理制度、ESG评估等供应链管理措施。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="供应商管理">
              <el-input
                v-model="formData.supplierManagement"
                type="textarea"
                :rows="6"
                placeholder="请输入供应商管理详情"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <EsgActionButtons
      :show-submit="true"
      @cancel="handleCancel"
      @save="handleSave"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Upload, InfoFilled, QuestionFilled } from "@element-plus/icons-vue";
import EsgActionButtons from "./EsgActionButtons.vue";

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "supplier-management"
  }
});

const activeCollapse = ref(["supplier-management"]);
const formData = ref({ supplierManagement: "" });

const handleCancel = () => {
  console.log("取消操作");
};
const handleSave = () => {
  console.log("保存数据:", formData.value);
};
const handleSubmit = () => {
  console.log("提交数据:", formData.value);
};
</script>

<style scoped>
@import url("./styles/common.css");
</style>
