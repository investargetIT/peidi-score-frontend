<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="公司名称与组织架构" name="company-structure">
        <template #title>
          <div class="collapse-title">
            <span
              >公司名称与组织架构
              <el-tooltip content="对应GRI标准: 102-1" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司全称与简称、公司组织架构图。</span>
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item label="定性描述">
              <el-input
                v-model="formData.qualitativeDescription"
                type="textarea"
                :rows="6"
                placeholder="请输入文档描述"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传">
              <el-upload
                class="upload-area"
                drag
                :auto-upload="false"
                multiple
                :on-change="handleFileChange"
                :file-list="fileList"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持多种文件格式，单个文件不超过10MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>

            <!-- 相关内容链接 -->
            <el-form-item label="相关内容链接">
              <el-input
                v-model="formData.relatedLinks"
                type="textarea"
                :rows="4"
                placeholder="请输入相关文档目录"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <!-- 其他折叠项 -->
      <el-collapse-item title="活动、品牌、产品和服务" name="activities-brands">
        <template #title>
          <div class="collapse-title">
            <span
              >活动、品牌、产品和服务
              <el-tooltip content="对应GRI标准: 102-2" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description"
              >企业主要活动、品牌介绍、产品和服务详情。</span
            >
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="详细描述">
              <el-input
                v-model="formData.activitiesDescription"
                type="textarea"
                :rows="4"
                placeholder="请输入活动、品牌、产品和服务相关信息"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="公司总部的位置" name="headquarters-location">
        <template #title>
          <div class="collapse-title">
            <span
              >公司总部的位置
              <el-tooltip content="对应GRI标准: 102-3" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司总部详细地址及地理位置信息。</span>
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="总部地址">
              <el-input
                v-model="formData.headquartersAddress"
                placeholder="请输入公司总部详细地址"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="经营位置" name="business-locations">
        <template #title>
          <div class="collapse-title">
            <span
              >经营位置
              <el-tooltip content="对应GRI标准: 102-4" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="经营地址">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="3"
                placeholder="请输入各经营地址"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="所有权的性质及法律形式" name="ownership-legal">
        <template #title>
          <div class="collapse-title">
            <span
              >所有权的性质及法律形式
              <el-tooltip content="对应GRI标准: 102-5" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">企业所有权结构和法律组织形式。</span>
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="所有权性质">
              <el-input
                v-model="formData.ownershipNature"
                placeholder="请输入所有权性质"
              />
            </el-form-item>
            <el-form-item label="法律形式">
              <el-input
                v-model="formData.legalForm"
                placeholder="请输入法律形式"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 操作按钮 -->
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
import { Upload, QuestionFilled } from "@element-plus/icons-vue";

// 折叠面板
const activeCollapse = ref(["company-structure"]);

// 表单数据
const formData = ref({
  qualitativeDescription: "",
  relatedLinks: "",
  activitiesDescription: "",
  headquartersAddress: "",
  businessLocations: "",
  ownershipNature: "",
  legalForm: ""
});

// 文件列表
const fileList = ref([]);

// 文件上传处理
const handleFileChange = (file, fileList) => {
  console.log("文件变化:", file, fileList);
};

// 操作处理函数
const handleCancel = () => {
  ElMessage.info("已取消操作");
};

const handleSave = () => {
  console.log("保存数据:", formData.value);
  ElMessage.success("保存成功");
};

const handleSubmit = () => {
  console.log("提交数据:", formData.value);
  ElMessage.success("提交成功");
};
</script>

<style scoped>
@import url("./styles/common.css");

/* tooltip图标垂直位置调整 */
.collapse-title span :deep(.el-tooltip__trigger) {
  position: relative;
  top: 3px;
}
</style>
