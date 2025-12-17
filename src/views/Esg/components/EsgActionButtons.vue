<template>
  <div class="action-buttons flex justify-end w-full">
    <el-button v-if="false" @click="handleExit" type="danger"
      >退出登录</el-button
    >
    <el-switch
      :disabled="!isAdmin"
      style="margin-right: auto"
      :model-value="modeVal"
      @update:model-value="val => emit('update:modeVal', val)"
      size="large"
      active-text="编辑模式"
      inactive-text="查看模式"
    />
    <!-- <el-button v-if="showCancel" @click="handleCancel">取消</el-button> -->
    <el-button
      v-if="showSave"
      type="primary"
      @click="handleSave"
      :disabled="!isEdit"
      size="large"
      style="width: 120px"
      >保存</el-button
    >
    <!-- v-if="showSubmit" -->
    <el-button v-if="false" type="success" @click="handleSubmit"
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
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  modeVal: {
    type: Boolean,
    default: false
  }
});

// 定义emits，允许父组件监听按钮点击事件
const emit = defineEmits(["cancel", "save", "submit", "update:modeVal"]);

// 按钮处理函数
const handleCancel = () => {
  // emit("cancel");
  // ElMessage.info("已取消操作");
  window.location.reload();
};

const handleSave = () => {
  emit("save");
};

const handleSubmit = () => {
  emit("submit");
  ElMessage.success("提交成功");
};

const handleExit = () => {
  // 暴力退出 清空cookie
  localStorage.setItem("pridi-unLoginUrl", "/pdesg");
  document.cookie.split(";").forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  window.location.href = window.location.origin + "/#/pdesg";
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

  /* justify-content: center; */
  padding: 16px 20px;
  margin-top: 0;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  border-radius: 0;
  box-shadow: 0 -2px 8px rgb(0 0 0 / 10%);
}
</style>
