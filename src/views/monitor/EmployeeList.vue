<template>
  <el-card class="employee-list">
    <div class="employee-title">员工</div>
    <el-input
      v-model="searchValue"
      placeholder="搜索员工..."
      class="employee-search"
      clearable
    />
    <div class="employee-items">
      <div
        v-for="(emp, idx) in employees"
        :key="idx"
        :class="['employee-item', emp === selected ? 'selected' : '']"
        @click="$emit('select', emp)"
      >
        <el-avatar
          :size="40"
          src="emp.avatar || require('@/assets/login/avatar.svg')"
          style="margin-right: 12px"
        />
        <div>
          <div class="employee-name">{{ emp.name }}</div>
          <div class="employee-dept">{{ emp.dept }}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  employees: Array,
  selected: Object,
  search: String
});
const emit = defineEmits(["update:search", "select"]);
const searchValue = ref(props.search || "");
watch(searchValue, val => emit("update:search", val));
</script>

<style scoped>
.employee-list {
  width: 340px;
  min-width: 260px;
  height: 100%;
  padding: 24px 16px 16px;
}

.employee-title {
  margin-bottom: 18px;
  font-size: 24px;
  font-weight: bold;
}

.employee-search {
  margin-bottom: 18px;
}

.employee-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.employee-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.2s;
}

.employee-item.selected,
.employee-item:hover {
  background: #f5f6fa;
}

.employee-name {
  font-size: 18px;
  font-weight: 600;
}

.employee-dept {
  font-size: 14px;
  color: #888;
}
</style>
