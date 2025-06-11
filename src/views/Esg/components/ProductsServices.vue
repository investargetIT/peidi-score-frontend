<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="产品与服务责任" name="products-services">
        <template #title>
          <div class="collapse-title">
            <span>产品与服务责任</span>
            <el-icon class="collapse-icon"><InfoFilled /></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description"
              >产品质量管理、客户服务、产品安全等责任履行情况。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="产品服务">
              <el-input
                v-model="formData.productsServices"
                type="textarea"
                :rows="6"
                placeholder="请输入产品和服务详情"
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

const activeCollapse = ref(["products-services"]);
const formData = ref({ productsServices: "" });

const handleCancel = () => ElMessage.info("已取消操作");
const handleSave = () => ElMessage.success("保存成功");
const handleSubmit = () => ElMessage.success("提交成功");
</script>

<style scoped>
@import url("./styles/common.css");
</style>
