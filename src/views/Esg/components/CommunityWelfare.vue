<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="社区公益活动" name="community-welfare">
        <template #title>
          <div class="collapse-title">
            <span>社区公益活动</span>
            <el-icon class="collapse-icon"><InfoFilled /></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description"
              >社区参与、公益活动、慈善捐赠等社会责任履行情况。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="公益活动">
              <el-input
                v-model="formData.communityWelfare"
                type="textarea"
                :rows="6"
                placeholder="请输入社区公益详情"
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
import { Upload, InfoFilled } from "@element-plus/icons-vue";

const activeCollapse = ref(["community-welfare"]);
const formData = ref({ communityWelfare: "" });

const handleCancel = () => ElMessage.info("已取消操作");
const handleSave = () => ElMessage.success("保存成功");
const handleSubmit = () => ElMessage.success("提交成功");
</script>

<style scoped>
@import url("./styles/common.css");
</style>
