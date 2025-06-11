<template>
  <div class="esg-content">
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="员工权益保障" name="employee-rights">
        <template #title>
          <div class="collapse-title">
            <span
              >员工权益保障
              <el-tooltip content="对应GRI标准: 401-1" placement="top">
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
              >员工薪酬福利、权益保障、培训发展等相关措施。</span
            >
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="权益保障">
              <el-input
                v-model="formData.employeeRights"
                type="textarea"
                :rows="6"
                placeholder="请输入员工权益保障详情"
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Upload, InfoFilled, QuestionFilled } from "@element-plus/icons-vue";
import EsgActionButtons from "./EsgActionButtons.vue";
import { getEsgRuleDetail, updateEsgConfig } from "@/api/esg";

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "employees"
  }
});

const activeCollapse = ref(["employee-rights"]);
const formData = ref({ employeeRights: "" });

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
