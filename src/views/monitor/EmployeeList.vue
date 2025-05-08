<template>
  <el-card class="employee-list">
    <div class="employee-title">{{ t("employee.title") }}</div>
    <el-input
      v-model="searchValue"
      :placeholder="t('employee.searchPlaceholder')"
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
          :src="avatarUrls[emp.id]"
          style="margin-right: 12px"
        />
        <div>
          <div class="employee-name">{{ emp.name }}</div>
          <!-- <div class="employee-dept">
            {{ t("employee.department") }}: {{ emp.dept }}
          </div> -->
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import defaultAvatar from "@/assets/login/avatar.svg";

const { t } = useI18n();
const props = defineProps({
  employees: Array,
  selected: Object,
  avatarUrls: Object,
  search: String
});
const emit = defineEmits(["update:search", "select"]);
const searchValue = ref(props.search || "");
watch(searchValue, val => emit("update:search", val));
</script>

<style scoped>
.employee-list {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
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
  flex: 1 1 0;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
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
