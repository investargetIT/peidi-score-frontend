<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="职业健康安全" name="occupational-health">
        <template #title>
          <div class="collapse-title">
            <span
              >职业健康安全
              <el-tooltip content="对应GRI标准: 403-1" placement="top">
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
              >员工职业健康保障、安全生产管理、事故预防等措施。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="健康安全">
              <el-input
                v-model="formData.healthSafety"
                type="textarea"
                :rows="6"
                placeholder="请输入职业健康安全详情"
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

const activeCollapse = ref(["occupational-health"]);
const formData = ref({ healthSafety: "" });

const handleCancel = () => {
  // 自定义取消逻辑
  console.log("取消操作");
};
const handleSave = () => {
  // 自定义保存逻辑
  console.log("保存数据:", formData.value);
};
const handleSubmit = () => {
  // 自定义提交逻辑
  console.log("提交数据:", formData.value);
};
</script>

<style scoped>
@import url("./styles/common.css");
</style>
