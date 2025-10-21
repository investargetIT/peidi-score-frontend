<template>
  <div class="monitor-container">
    <el-tabs
      v-model="activeTab"
      class="monitor-tabs"
      type="card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane :label="t('monitor.manage')" name="manage">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'manage'" key="manage">
            <div class="main-content">
              <EmployeeList
                :employees="employees"
                :avatarUrls="avatarUrls"
                v-model:search="search"
                :selected="selectedEmployee"
                v-model="selectedEmployeeIds"
                @select="selectEmployee"
              />
              <ManageScore
                :employee="selectedEmployee"
                :avatarUrls="avatarUrls"
                :fetchUserListData="fetchUserListData"
                @setSelectedEmployee="selectEmployee"
                v-model="selectedEmployeeIds"
                :backEmployees="backEmployees"
              />
            </div>
          </div>
        </transition>
      </el-tab-pane>
      <!-- <el-tab-pane label="兑换历史" name="exchange">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'exchange'" key="exchange">
            <ExchangeHistory :exchangeList="exchangeList" />
          </div>
        </transition>
      </el-tab-pane> -->
      <el-tab-pane :label="t('monitor.history')" name="history">
        <HistoryScore
          v-if="activeTab === 'history'"
          :selected="selectedEmployee"
          :t="t"
          :activeTab="activeTab"
          :selectedEmployeeIds="selectedEmployeeIds"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('monitor.operationHistory')" name="operation">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'operation'" key="operation">
            <OperationHistory
              v-if="activeTab === 'operation'"
              :selected="selectedEmployee"
              :t="t"
              :activeTab="activeTab"
            />
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane
        :label="t('monitor.task')"
        name="task"
        v-if="isSiteHangzhou()"
      >
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'task'" key="task">
            <TaskList />
          </div>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import EmployeeList from "./EmployeeList.vue";
import ManageScore from "./ManageScore.vue";
import ExchangeHistory from "./ExchangeHistory.vue";
import HistoryScore from "./HistoryScore.vue";
import TaskList from "./TaskList.vue";
import avatarImg from "@/assets/login/avatar.svg";
import {
  getUserList,
  getFileDownLoadPath,
  getEnumTypeList
} from "@/api/pmApi.ts";
import { storageLocal } from "@pureadmin/utils";
import OperationHistory from "./OperationHistory.vue";
import { isSiteHangzhou } from "@/router/index";

const { t } = useI18n();
const activeTab = ref("manage");
const search = ref("");
const selectedEmployee = ref(null);
const selectedEmployeeIds = ref([]);
const selectedEmployeeList = ref([]);
const employees = ref([]);
const backEmployees = ref([]);
const avatarUrls = ref({});
const selectValue = ref("");
// 移除重复的过滤逻辑，让子组件自己处理过滤
function selectEmployee(emp) {
  // 只高亮，不影响多选
  // console.log("selectEmployee", emp);
  selectedEmployee.value = emp;
}
function handleTabClick() {
  // 可扩展tab切换逻辑
}

// 多选与高亮联动
watch(selectedEmployeeIds, ids => {
  // console.log("selectedEmployeeIds", ids);
  if (ids.length === 1) {
    selectedEmployee.value = employees.value.find(emp => emp.id === ids[0]);
  } else if (ids.length > 1) {
    // 多选时高亮第一个
    const emps = employees.value.filter(emp => ids.includes(emp.id));
    selectedEmployee.value = emps[0] || null;
  } else {
    selectedEmployee.value = null;
  }
});

const fetchUserListData = async () => {
  try {
    const res = await getUserList({
      pageNo: 1,
      pageSize: 10000,
      searchStr: JSON.stringify([
        {
          searchName: "data_source",
          searchType: "equals",
          searchValue: selectValue.value
        }
      ])
    });

    if (res?.code === 200) {
      employees.value = res?.data?.records?.map(item => ({
        ...item,
        name: item.fullName
      }));

      // 根据当前选中的员工ID更新选中状态
      selectedEmployee.value = employees.value.find(
        emp => emp.id === selectedEmployee.value?.id
      );

      backEmployees.value = employees.value;
      // 并行预加载所有头像
      const avatarPromises = res.data.records
        .filter(record => record.avatarUrl)
        .map(record => getPreviewUrl(record.avatarUrl, record.id));

      await Promise.all(avatarPromises);
      return employees.value;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch user list:", error);
    return [];
  }
};

const fetchSearchValue = async () => {
  try {
    const res = await getEnumTypeList({
      type: storageLocal().getItem("dataSource")?.id + "Manage"
    });

    if (res?.code === 200) {
      // 遍历枚举类型列表，拼接每个value值，用 &#& 分隔
      selectValue.value = res?.data?.map(item => item.value).join("&#&") || "";
    }
  } catch (error) {
    console.error("获取管理积分用户列表失败:", error);
  }
};

const getPreviewUrl = async (file, userId) => {
  if (!file) return "";

  try {
    // 尝试作为JSON字符串解析
    const parsed = JSON.parse(file);

    // 确保解析后是数组格式
    if (Array.isArray(parsed) && parsed.length > 0) {
      // 处理数组格式，提取objectName
      const objectName = parsed[0]?.response?.data || parsed[0]?.name;
      if (objectName) {
        const res = await getFileDownLoadPath({
          objectName: objectName
        });
        if (res.code === 200) {
          avatarUrls.value[userId] = res.data;
          return res.data;
        }
      }
    }

    return "";
  } catch (error) {
    // 如果JSON.parse失败，说明是单纯的字符串，直接返回使用
    // console.log(`用户${userId}的avatarUrl是单纯字符串，直接使用:`, file);
    avatarUrls.value[userId] = file;
    return file;
  }
};

onMounted(async () => {
  await fetchSearchValue();
  await fetchUserListData();
});

defineExpose({
  fetchUserListData
});
</script>

<style scoped>
.monitor-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  overflow-y: auto;
}

.monitor-tabs {
  flex-shrink: 0;
  padding: 0;
  margin-bottom: 32px;
  background: #f5f6f7;
  border-radius: 12px;
}

.el-tabs--card > .el-tabs__header {
  display: flex;
  align-items: center;
  height: 72px;
  margin: 0;
  background: transparent;
  border: none;
}

.el-tabs__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  background: transparent;
}

.el-tabs__item {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  min-width: 0;
  height: 56px;
  margin: 0 8px;
  font-size: 26px;
  font-weight: 500;
  line-height: 56px;
  color: #888;
  text-align: center;
  background: transparent;
  border: none !important;
  border-radius: 12px 12px 0 0;
  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}

.el-tabs__item.is-active {
  z-index: 2;
  color: #222;
  background: #fff;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.el-tabs__item:not(.is-active):hover {
  color: #222;
  background: #f0f1f2;
}

.el-tabs__active-bar,
.el-tabs__nav-wrap::after {
  display: none !important;
}

/* 确保tabs内容区域能够正常显示 */
.el-tabs__content {
  overflow: visible !important;
}

.el-tab-pane {
  overflow: visible !important;
}

.main-content {
  display: flex;
  gap: 32px;
  align-items: stretch;

  /* height: 600px; */
  min-height: 0;
  overflow: visible;
}

.employee-list {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  font-size: 15px;
}

.employee-list .el-card,
.manage-score {
  display: flex;
  flex-direction: column;
  padding: 24px 16px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.employee-items {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.manage-score {
  min-width: 0;
  min-height: 400px;
  font-size: 15px;
}

.employee-name {
  font-size: 18px;
}

.manage-title {
  font-size: 20px;
}

.tab-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 20px;
  color: #aaa;
}

.exchange-history-card {
  padding: 32px 32px 24px;
  border-radius: 16px;
}

.exchange-title {
  margin-bottom: 32px;
  font-size: 28px;
  font-weight: bold;
}

.exchange-table {
  width: 100%;
  font-size: 18px;
}

.exchange-header th {
  font-size: 18px;
  font-weight: bold !important;
  background: #fff !important;
}

.item-cell {
  display: flex;
  align-items: center;
}

.no-border-table ::v-deep .el-table__cell,
.no-border-table ::v-deep th,
.no-border-table ::v-deep td {
  border-right: none !important;
  border-bottom: none !important;
}

.no-border-table ::v-deep tr {
  background: #fff;
}
</style>
