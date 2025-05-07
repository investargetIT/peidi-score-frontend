<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">{{ $t("leaderboard.pointsrank") }}</h2>
      </div>
    </div>
    <!-- 产品列表 -->
    <productList ref="listRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import productList from "./productList.vue";
const listRef = ref(null);
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
