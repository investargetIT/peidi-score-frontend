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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Upload, InfoFilled, QuestionFilled } from "@element-plus/icons-vue";
import EsgActionButtons from "./EsgActionButtons.vue";
import { getEsgRuleDetail, updateEsgConfig } from "@/api/esg";

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "supplier-management"
  }
});

const activeCollapse = ref(["supplier-management"]);
const formData = ref({ supplierManagement: "" });

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
  console.log("取消操作");
};
const handleSave = () => {
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
  console.log("提交数据:", formData.value);
};
</script>

<style scoped>
@import url("./styles/common.css");
</style>
