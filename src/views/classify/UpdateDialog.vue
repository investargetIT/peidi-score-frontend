<template>
  <el-dialog v-model="visible" title="更新详情">
    <el-form :model="form">
      <el-form-item label="网站">
        <el-input v-model="form.website"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updateDetails">更新</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineModel, watch } from "vue";

const props = defineProps({
  details: Object
});

const visible = defineModel("visible", {
  type: Boolean,
  required: true
});

const form = ref({
  website: "",
  username: "",
  password: ""
});

watch(
  () => props.details,
  newDetails => {
    form.value = { ...newDetails };
  }
);

const updateDetails = () => {
  // 这里可以添加更新逻辑
  console.log("更新的详情:", form.value);
  visible.value = false;
};
</script>
