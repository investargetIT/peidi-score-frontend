<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="治理结构" name="governance-structure">
        <template #title>
          <div class="collapse-title">
            <span
              >治理结构
              <el-tooltip content="对应GRI标准: 102-18" placement="top">
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
              >公司董事会、监事会等治理结构及职责分工。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="治理架构">
              <el-input
                v-model="formData.governanceStructure"
                type="textarea"
                :rows="4"
                placeholder="请输入治理架构详情"
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

      <el-collapse-item title="内控制度" name="internal-control">
        <template #title>
          <div class="collapse-title">
            <span
              >内控制度
              <el-tooltip content="对应GRI标准: 102-19" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <el-icon class="collapse-icon"><InfoFilled /></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">内部控制制度建设及执行情况。</span>
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="制度详情">
              <el-input
                v-model="formData.internalControl"
                type="textarea"
                :rows="4"
                placeholder="请输入内控制度详情"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 操作按钮 -->
    <EsgActionButtons
      :show-submit="true"
      @cancel="handleCancel"
      @save="handleSave"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Upload, InfoFilled, QuestionFilled } from "@element-plus/icons-vue";
import EsgActionButtons from "./EsgActionButtons.vue";
import { getEsgRuleDetail, updateEsgConfig } from "@/api/esg";

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "corporate-governance"
  }
});

const activeCollapse = ref(["governance-structure"]);

const formData = ref({
  governanceStructure: "",
  internalControl: ""
});

// 页面加载时获取数据
const loadData = async () => {
  try {
    const res = await getEsgRuleDetail({ type: props.activeTab });
    if (res.code === 200 && res.data && res.data.content) {
      try {
        const contentData = JSON.parse(res.data.content);
        Object.keys(contentData).forEach(key => {
          if (formData.value.hasOwnProperty(key)) {
            formData.value[key] = contentData[key];
          }
        });
      } catch (e) {
        console.warn("解析content数据失败:", e);
      }
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});

const handleCancel = () => {
  // 自定义取消逻辑
  console.log("取消操作");
};
const handleSave = () => {
  // 自定义保存逻辑
  console.log("保存数据:", formData.value);
  const sendConfig = {
    content: JSON.stringify(formData.value),
    type: props.activeTab
  };
  updateEsgConfig(sendConfig).then(res => {
    if (res.code === 200) {
      ElMessage.success("保存成功");
    } else {
      ElMessage.error("保存失败");
    }
  });
};
const handleSubmit = () => {
  // 自定义提交逻辑
  console.log("提交数据:", formData.value);
};
</script>

<style scoped>
@import url("./styles/common.css");
</style>
