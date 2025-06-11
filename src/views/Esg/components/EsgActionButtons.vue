<template>
  <div class="action-buttons">
    <el-button v-if="showCancel" @click="handleCancel">取消</el-button>
    <el-button v-if="showSave" type="primary" @click="handleSave"
      >保存</el-button
    >
    <el-button v-if="showSubmit" type="success" @click="handleSubmit"
      >提交</el-button
    >
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";

// 定义props，允许父组件控制显示哪些按钮
const props = defineProps({
  showCancel: {
    type: Boolean,
    default: true
  },
  showSave: {
    type: Boolean,
    default: true
  },
  showSubmit: {
    type: Boolean,
    default: false
  }
});

// 定义emits，允许父组件监听按钮点击事件
const emit = defineEmits(["cancel", "save", "submit"]);

// 按钮处理函数
const handleCancel = () => {
  emit("cancel");
  ElMessage.info("已取消操作");
};

const handleSave = () => {
  emit("save");
};

const handleSubmit = () => {
  emit("submit");
  ElMessage.success("提交成功");
};
</script>

<style scoped>
/* 底部操作按钮sticky效果 */
.action-buttons {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 8px rgb(0 0 0 / 10%);
}
</style>
