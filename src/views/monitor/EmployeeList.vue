<template>
  <el-card class="employee-list">
    <div class="employee-title">{{ t("employee.title") }}</div>
    <div class="employee-toolbar">
      <!-- <el-checkbox
        v-model="treeAllChecked"
        :indeterminate="treeIsIndeterminate"
        @change="treeHandleCheckAll"
        >{{ t("table.selectAll") }}</el-checkbox
      > -->
      <el-input
        v-model="searchValue"
        :placeholder="t('employee.searchPlaceholder')"
        class="employee-search"
        clearable
      />
    </div>

    <div class="employee-items">
      <!-- <div
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
          :src="avatarUrls[emp.id] || Avatar"
          style="margin-right: 12px"
        />
        <div>
          <div class="employee-name">{{ emp.name }}</div>
          <div class="employee-dept">
            {{ t("employee.department") }}: {{ emp.dept }}
          </div>
        </div>
      </div> -->

      <el-tree
        style="max-width: 600px"
        :data="treeFilteredEmployees"
        :props="treeDefaultProps"
        show-checkbox
        @check="treeHandleClick"
        ref="treeRef"
        node-key="id"
        :default-checked-keys="checkedIds"
        check-on-click-leaf
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <img
              v-if="data.id"
              :src="data.avatarUrl || Avatar"
              style="width: 20px; height: 20px; margin-right: 5px"
            />
            <span>{{ node.label }}</span>
            <p v-if="data.id" class="ml-[5px] text-[#9b9a9a] text-[12px] flex">
              {{ `(${data.lifeTimePoints} / ${data.redeemablePoints})` }}
            </p>
          </div>
        </template>
      </el-tree>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import Avatar from "@/assets/user.jpg";
import { da } from "element-plus/es/locale/index.mjs";
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

//#region 新列表逻辑
const treeRef = ref(null);

const treeDefaultProps = {
  children: "children",
  label: "label"
};
const treeData = [
  {
    label: "基地",
    children: [
      {
        label: "姓名",
        avatarUrl:
          "https://static-legacy.dingtalk.com/media/lQLPD3DkL2wiKqHNAXDNAXCwKvib1pgej0sGW_2GH3o8AA_368_368.png",
        userId: "1926449443739598852"
      }
    ]
  }
];

// 监听 props.employees 变化，遍历源数据，转换成 treeData 格式
const treeEmployees = ref([]);
watch(
  () => props.employees,
  (newVal, oldVal) => {
    if (newVal) {
      // newVal.push({
      //   avatarUrl: "",
      //   name: "测试Name",
      //   site: "测试Site",
      //   userId: "1926449443739598852"
      // });
      const siteEmployees = newVal.reduce((acc, emp) => {
        acc[emp.site] = acc[emp.site] || [];
        acc[emp.site].push({
          label: emp.name,
          avatarUrl: emp.avatarUrl,
          userId: emp.userId,
          id: emp.id,
          empdata: emp,
          redeemablePoints: emp.redeemablePoints,
          lifeTimePoints: emp.lifeTimePoints
        });
        return acc;
      }, {});
      //{佩蒂智创（杭州）宠物科技有限公司: Array(118), 测试Site: Array(1)} 转换成 [{label: "佩蒂智创（杭州）宠物科技有限公司", children: Array(118)}, {label: "测试Site", children: Array(1)}]
      treeEmployees.value = Object.entries(siteEmployees).map(
        ([site, children]) => ({
          label: site,
          children
        })
      );
    }
  },
  { immediate: true }
);

const treeFilteredEmployees = computed(() => {
  const searchTerm = searchValue.value?.toLowerCase() || "";
  if (!searchTerm) return treeEmployees.value || [];
  // 筛选 treeEmployees.value 中每个对象children数字里是否有label匹配到搜索内容, 如果有, 则留下
  const tem = [];
  treeEmployees.value.forEach(item => {
    if (item.children && item.children.length > 0) {
      const tem2 = item.children.filter(
        child => child.label && child.label.toLowerCase().includes(searchTerm)
      );
      if (tem2.length > 0) {
        tem.push({ ...item, children: tem2 });
      }
    }
  });
  return tem;
});

const treeAllChecked = computed({
  get() {
    return (
      // 遍历 treeFilteredEmployees 判断 checkedIds.value 里是否包含 treeFilteredEmployees 里的每个 children 里的每个对象的 userId
      // treeFilteredEmployees.value =  [{label: "佩蒂智创（杭州）宠物科技有限公司", children: Array(118)}, {label: "测试Site", children: Array(1)}]
      treeFilteredEmployees.value.every(
        item =>
          item.children &&
          item.children.every(child => checkedIds.value.includes(child.userId))
      )
    );
  },
  set(val) {
    // console.log("treeAllChecked:", val);
    // return;
    if (val) {
      // true
      const checkedKeys = treeRef.value
        .getCheckedKeys()
        .filter(element => element !== undefined);
      checkedIds.value = checkedKeys;
    } else {
      // checkedIds.value = checkedIds.value.filter(
      //   id => !filteredEmployees.value.some(emp => emp.id === id)
      // );
    }
    emit("update:modelValue", checkedIds.value);
  }
});

function treeHandleCheckAll(val) {
  // console.log("treeHandleCheckAll:", val);
  treeAllChecked.value = val;
}

function treeHandleClick(emp) {
  // console.log(emp);
  const checkedKeys = treeRef.value
    .getCheckedKeys()
    .filter(element => element !== undefined);
  // console.log("===========================================");
  // console.log("checkedKeys:", checkedKeys);

  // 会有问题，如果筛选后选了人，则不符合筛选条件的人但是已经选择的人也会被取消选择
  // 遍历当前 checkedIds.value，如果在 treeFilteredEmployees.value 里的每个对象的children里都匹配不到，说明当前id是需要被保留的
  // console.log("checkedIds.value:", checkedIds.value);
  const keepIds = checkedIds.value.filter(
    id =>
      !treeFilteredEmployees.value.some(
        item => item.children && item.children.some(child => child.id === id)
      )
  );
  // console.log("keepIds:", keepIds);

  checkedIds.value = [...checkedKeys, ...keepIds];

  // return;
  // emit("select", emp);
  // 如果未勾选则勾选，如果已勾选则取消勾选
  // const index = checkedIds.value.indexOf(emp.id);
  // if (index === -1) {
  //   checkedIds.value = [...checkedIds.value, emp.id];
  // } else {
  //   checkedIds.value = checkedIds.value.filter(id => id !== emp.id);
  // }
  // 通知父组件更新
  emit("update:modelValue", checkedIds.value);
  // console.log("checkedIds.value:", checkedIds.value);
}

const treeIsIndeterminate = computed(() => {
  return;
  const checkedCount = filteredEmployees.value.filter(emp =>
    checkedIds.value.includes(emp.id)
  ).length;
  return checkedCount > 0 && checkedCount < filteredEmployees.value.length;
});

watch(searchValue, val => {
  emit("update:search", val);
  // 当搜索框清空时，清空选中数据
  if (!val || val.trim() === "") {
    // checkedIds.value = [];
    // emit("update:modelValue", []);
    // emit("select", null);
  }
});
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
//#endregion

const filteredEmployees = computed(() => {
  const searchTerm = searchValue.value?.toLowerCase() || "";
  if (!searchTerm) return props.employees || [];
  return (props.employees || []).filter(
    emp => emp.name && emp.name.toLowerCase().includes(searchTerm)
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
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.employee-list :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
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
  max-height: calc(100vh - 210px);
  padding-bottom: 60px;
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

<style scoped>
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  padding-right: 8px;
  font-size: 14px;
}
</style>
