<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="环境影响管理" name="environmental-impact">
        <template #title>
          <div class="collapse-title">
            <span
              >环境影响管理
              <el-tooltip content="对应GRI标准: 301-1" placement="top">
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
              >环境保护措施、节能减排、废物处理等环境管理方案。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="环境管理">
              <el-input
                v-model="formData.environmentalManagement"
                type="textarea"
                :rows="6"
                placeholder="请输入环境影响管理详情"
              />
            </el-form-item>

            <el-form-item label="附件上传">
              <el-upload class="upload-area" drag :auto-upload="false" multiple>
                <el-button type="primary" :icon="Upload">上传附件</el-button>
              </el-upload>
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

const activeCollapse = ref(["environmental-impact"]);
const formData = ref({ environmentalManagement: "" });

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
