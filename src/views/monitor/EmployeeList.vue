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
        @click="handleClick(emp)"
      >
        <el-checkbox
          v-model="checkedIds"
          :label="emp.id"
          @change="handleCheck(emp.id)"
          style="margin-right: 8px"
          :show-label="false"
        />
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
const checkedIds = ref(props.modelValue || []);

watch(searchValue, val => emit("update:search", val));
watch(
  () => props.modelValue,
  val => {
    if (val && !Array.isArray(val)) {
      console.warn("modelValue should be an array");
      return;
    }
    checkedIds.value = val || [];
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
  // 确保checkedIds.value是一个数组
  if (!Array.isArray(checkedIds.value)) {
    checkedIds.value = [];
  }

  // 切换选中状态
  const index = checkedIds.value.indexOf(id);
  if (index === -1) {
    // 如果未选中，则添加到选中列表
    checkedIds.value = [...checkedIds.value, id];
  } else {
    // 如果已选中，则从选中列表中移除
    checkedIds.value = checkedIds.value.filter(item => item !== id);
  }

  // 通知父组件更新
  emit("update:modelValue", checkedIds.value);

  // 处理高亮逻辑
  if (checkedIds.value.includes(id)) {
    const emp = filteredEmployees.value.find(emp => emp.id === id);
    if (emp) emit("select", emp);
  } else if (checkedIds.value.length > 0) {
    const emp = filteredEmployees.value.find(
      emp => emp.id === checkedIds.value[0]
    );
    if (emp) emit("select", emp);
  } else {
    emit("select", null);
  }
}

function handleClick(emp) {
  emit("select", emp);
  // 如果未勾选则勾选，如果已勾选则取消勾选
  const index = checkedIds.value.indexOf(emp.id);
  if (index === -1) {
    checkedIds.value = [...checkedIds.value, emp.id];
  } else {
    checkedIds.value = checkedIds.value.filter(id => id !== emp.id);
  }
  // 通知父组件更新
  emit("update:modelValue", checkedIds.value);
}
</script>

<style scoped>
.employee-list {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  min-height: 500px;
  max-height: 100vh;
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.employee-list :deep(.el-card__body) {
  overflow: hidden;
  border-radius: 12px;
}

/* 隐藏复选框的label但保持交互 */
:deep(.el-checkbox__label) {
  width: 0;
  overflow: hidden;
  visibility: hidden;
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
  flex: 1;
  min-height: 0;
  max-height: calc(100vh - 200px);
  padding-bottom: 20px;
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
