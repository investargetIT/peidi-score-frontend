<template>
  <el-card class="employee-list">
    <div class="employee-title">{{ t("employee.title") }}</div>
    <div class="employee-toolbar">
      <el-checkbox
        v-model="allChecked"
        :indeterminate="isIndeterminate"
        @change="handleCheckAll"
        >{{ t("table.selectAll") }}</el-checkbox
      >
      <el-input
        v-model="searchValue"
        :placeholder="t('employee.searchPlaceholder')"
        class="employee-search"
        clearable
      />
    </div>
    <div class="employee-items">
      <div
        v-for="(emp, idx) in filteredEmployees"
        :key="idx"
        :class="[
          'employee-item',
          checkedIds.includes(emp.id) ? 'selected' : ''
        ]"
        @click="handleRowClick(emp)"
      >
        <el-checkbox
          v-model="checkedIds"
          :label="emp.id"
          @change.stop="handleCheck(emp.id)"
          style="margin-right: 8px"
        >
          <!-- 不显示 label 内容 -->
        </el-checkbox>
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
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import defaultAvatar from "@/assets/login/avatar.svg";

const { t } = useI18n();
const props = defineProps({
  employees: Array,
  selected: Object,
  avatarUrls: Object,
  search: String,
  modelValue: Array // 选中id数组
});
const emit = defineEmits(["update:search", "select", "update:modelValue"]);
const searchValue = ref(props.search || "");
const checkedIds = ref(props.modelValue ? [...props.modelValue] : []);

watch(searchValue, val => emit("update:search", val));
watch(
  () => props.modelValue,
  val => {
    checkedIds.value = val ? [...val] : [];
  }
);

const filteredEmployees = computed(() => {
  if (!searchValue.value) return props.employees || [];
  return (props.employees || []).filter(emp =>
    emp.name?.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});

const allChecked = computed({
  get() {
    return (
      filteredEmployees.value.length > 0 &&
      filteredEmployees.value.every(emp => checkedIds.value.includes(emp.id))
    );
  },
  set(val) {
    if (val) {
      checkedIds.value = filteredEmployees.value.map(emp => emp.id);
    } else {
      checkedIds.value = checkedIds.value.filter(
        id => !filteredEmployees.value.some(emp => emp.id === id)
      );
    }
    emit("update:modelValue", checkedIds.value);
  }
});

const isIndeterminate = computed(() => {
  const checkedCount = filteredEmployees.value.filter(emp =>
    checkedIds.value.includes(emp.id)
  ).length;
  return checkedCount > 0 && checkedCount < filteredEmployees.value.length;
});

function handleCheckAll(val) {
  allChecked.value = val;
}
function handleCheck(id) {
  emit("update:modelValue", checkedIds.value);
}
function handleRowClick(emp) {
  emit("select", emp);
  if (!checkedIds.value.includes(emp.id)) {
    checkedIds.value.push(emp.id);
    emit("update:modelValue", checkedIds.value);
  }
}
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

.employee-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.employee-search {
  flex: 1;
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
