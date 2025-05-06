<template>
  <el-card class="score-card">
    <div class="card-title">{{ title }}</div>
    <div class="card-score">{{ score }}</div>
  </el-card>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  title: String,
  score: Number,
  type: String
});
</script>

<style scoped>
.score-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  min-height: 120px;
}

.card-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.card-score {
  margin-bottom: 4px;
  font-size: 32px;
  font-weight: bold;
  color: #222;
}

.card-type {
  font-size: 14px;
  color: #888;
}
</style>
