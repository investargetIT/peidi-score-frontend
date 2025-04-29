<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">Dashboard</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.container {
  display: flex;
  gap: 20px;

  .el-select {
    margin-left: 10px;
  }
}
</style>
