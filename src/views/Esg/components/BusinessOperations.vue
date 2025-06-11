<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="业务运营管理" name="business-operations">
        <template #title>
          <div class="collapse-title">
            <span
              >业务运营管理
              <el-tooltip content="对应GRI标准: 102-6" placement="top">
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
              >主营业务运营情况、业务流程管理及优化措施。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="运营详情">
              <el-input
                v-model="formData.operationsDetail"
                type="textarea"
                :rows="6"
                placeholder="请输入业务运营详情"
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

    <div class="action-buttons">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="success" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Upload, InfoFilled, QuestionFilled } from "@element-plus/icons-vue";

const activeCollapse = ref(["business-operations"]);
const formData = ref({ operationsDetail: "" });

const handleCancel = () => ElMessage.info("已取消操作");
const handleSave = () => ElMessage.success("保存成功");
const handleSubmit = () => ElMessage.success("提交成功");
</script>

<style scoped>
@import url("./styles/common.css");
</style>
