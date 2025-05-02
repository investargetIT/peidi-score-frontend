<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">Dashboard</h2>
      </div>
    </div>
    <el-descriptions title="User Info" column="3">
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
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
