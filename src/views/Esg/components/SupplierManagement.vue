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

const activeCollapse = ref(["supplier-management"]);
const formData = ref({ supplierManagement: "" });

const handleCancel = () => ElMessage.info("已取消操作");
const handleSave = () => ElMessage.success("保存成功");
const handleSubmit = () => ElMessage.success("提交成功");
</script>

<style scoped>
@import url("./styles/common.css");
</style>
