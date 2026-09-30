<template>
  <div
    class="monitor-container"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- 移动端自绘 Tab 栏：原生滚动、粘顶、可左右滑动切换 -->
    <nav ref="mobileTabsRef" class="mobile-tab-nav" aria-label="tabs">
      <button
        v-for="tab in mobileTabs"
        :key="tab.name"
        type="button"
        class="mobile-tab-item"
        :class="{ 'is-active': activeTab === tab.name }"
        @click="switchMobileTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </nav>
    <el-tabs
      v-model="activeTab"
      class="monitor-tabs"
      @tab-click="handleTabClick"
    >
      <el-tab-pane :label="t('monitor.manage')" name="manage">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'manage'" key="manage">
            <div class="main-content">
              <EmployeeList
                v-loading="loading"
                :loading="loading"
                :element-loading-text="t('monitor.dataLoading')"
                :employees="employees"
                :avatarUrls="avatarUrls"
                v-model:search="search"
                :selected="selectedEmployee"
                v-model="selectedEmployeeIds"
                @select="selectEmployee"
                @resign="resignEmployee"
                @update:showFundSquares="showFundSquares = $event"
              />
              <ManageScore
                :employee="selectedEmployee"
                :avatarUrls="avatarUrls"
                :fetchUserListData="fetchUserListData"
                @setSelectedEmployee="selectEmployee"
                v-model="selectedEmployeeIds"
                :backEmployees="backEmployees"
                :showFundSquares="showFundSquares"
              />
            </div>
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="t('monitor.history')" name="history">
        <HistoryScore
          v-if="activeTab === 'history'"
          :selected="selectedEmployee"
          :t="t"
          :activeTab="activeTab"
          :selectedEmployeeIds="selectedEmployeeIds"
          :avatarUrls="avatarUrls"
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
      <el-tab-pane :label="t('redeemMonitor.title')" name="exchange">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'exchange'" key="exchange">
            <ExchangeHistory />
          </div>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
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
  getEnumTypeList,
  deleteUser
} from "@/api/pmApi.ts";
import { getTeamBuildingExpenses } from "@/api/user.ts";
import { getFundMonthsWithHireDate } from "@/utils/fund";
import { storageLocal } from "@pureadmin/utils";
import OperationHistory from "./OperationHistory.vue";
import { isSiteHangzhou } from "@/router/index";
import { ElMessageBox, ElMessage } from "element-plus";

const loading = ref(true);

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
// 左侧"团建经费"开关状态，联动右侧管理积分卡片是否展示经费方块
const showFundSquares = ref(false);

//#region 移动端自绘 Tab 栏
const mobileTabsRef = ref(null);
const mobileTabs = computed(() => {
  const list = [
    { name: "manage", label: t("monitor.manage") },
    { name: "history", label: t("monitor.history") },
    { name: "operation", label: t("monitor.operationHistory") }
  ];
  if (isSiteHangzhou()) {
    list.push({ name: "task", label: t("monitor.task") });
  }
  list.push({ name: "exchange", label: t("redeemMonitor.title") });
  return list;
});

// 点击移动端 Tab：切换并把当前胶囊滚到可视区中间
const switchMobileTab = name => {
  activeTab.value = name;
  nextTick(() => {
    const nav = mobileTabsRef.value;
    const el = nav?.querySelector(".mobile-tab-item.is-active");
    if (nav && el) {
      const left = el.offsetLeft - (nav.clientWidth - el.clientWidth) / 2;
      nav.scrollTo({ left: Math.max(left, 0), behavior: "smooth" });
    }
  });
};

// 移动端内容区左右滑动切换 Tab（表格/下拉/自绘 Tab 栏内不劫持）
const touchX = ref(0);
const touchY = ref(0);
const onTouchStart = e => {
  if (window.matchMedia("(max-width: 768px)").matches === false) return;
  const t = e.changedTouches?.[0] || e.touches?.[0];
  if (!t) return;
  if (e.target?.closest?.(".el-scrollbar, .mobile-tab-nav")) {
    touchX.value = 0;
    return;
  }
  touchX.value = t.clientX;
  touchY.value = t.clientY;
};
const onTouchEnd = e => {
  if (!touchX.value) return;
  const t = e.changedTouches?.[0];
  if (!t) return;
  const dx = t.clientX - touchX.value;
  const dy = t.clientY - touchY.value;
  touchX.value = 0;
  // 横向滑动距离足够，且明显比纵向滑动大
  if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
  const order = mobileTabs.value.map(x => x.name);
  const cur = order.indexOf(activeTab.value);
  const next = dx < 0 ? cur + 1 : cur - 1;
  if (next < 0 || next >= order.length) return;
  switchMobileTab(order[next]);
};
//#endregion

// 移除重复的过滤逻辑，让子组件自己处理过滤
function selectEmployee(emp) {
  // 只高亮，不影响多选
  // console.log("selectEmployee", emp);
  selectedEmployee.value = emp;
}
function handleTabClick() {
  // 可扩展tab切换逻辑
}

//#region 离职逻辑
function resignEmployee() {
  // 处理离职逻辑
  console.log("resignEmployee", selectedEmployeeIds.value);
  // console.log(
  //   "selectedEmployeeIds",
  //   // 将selectedEmployeeIds数组里的id转换成employees对应id数据的userId
  //   selectedEmployeeIds.value.map(id => {
  //     const emp = employees.value.find(emp => emp.id === id);
  //     return emp?.userId || null;
  //   })
  // );
  ElMessageBox.confirm(
    `<div>
      <div>${t("monitor.confirmLeave")}<br/>${t("monitor.selectedCount")}：${selectedEmployeeIds.value.length}</div>
      <div style="margin-top:10px;color:#e6a23c;font-weight:600;line-height:1.6">⚠️ ${t("monitor.confirmLeaveCaution")}</div>
    </div>`,
    `❗${t("monitor.confirmLeaveTitle")} `,
    {
      type: "warning",
      showCancelButton: true,
      confirmButtonText: t("monitor.confirm"),
      cancelButtonText: t("monitor.cancel"),
      confirmButtonClass: "el-button--danger",
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    // const temp = selectedEmployeeIds.value.map(id => {
    //   const emp = employees.value.find(emp => emp.id === id);
    //   return emp?.userId || null;
    // });
    // console.log("离职用户userId数组", temp);
    // return;
    deleteUser(
      // 将selectedEmployeeIds数组里的id转换成employees对应id数据的userId
      selectedEmployeeIds.value.map(id => {
        const emp = employees.value.find(emp => emp.id === id);
        return emp?.userId || null;
      })
    )
      .then(res => {
        if (res?.code === 200) {
          ElMessage({
            type: "success",
            message: t("monitor.leaveSuccess")
          });
          // 刷新员工列表
          fetchUserListData();
        } else {
          ElMessage({
            type: "error",
            message: t("monitor.leaveFailed")
          });
        }
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: t("monitor.leaveFailed")
        });
      });
  });
}
//#endregion

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

// 团建经费（月度经费方块）仅智创（杭州）基地员工可享，未注册员工也归入该基地
const HANGZHOU_SITE = "佩蒂智创（杭州）宠物科技有限公司";

// 是否把「未注册员工」（经费接口返回但无系统账号）展示进员工树；置 true 恢复展示
const SHOW_UNREGISTERED = false;

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
      const records = res?.data?.records || [];
      // 团建经费接口失败不阻塞员工列表，未注册员工与经费方块暂不展示
      let fundList = [];
      try {
        fundList = await getTeamBuildingExpenses();
      } catch (error) {
        console.warn("获取团建经费列表失败，未注册员工暂不展示:", error);
      }
      const monthsUsedMap = {};
      fundList.forEach(item => {
        if (item.userId != null) monthsUsedMap[item.userId] = item.months;
      });
      const defaultMonths = Array.from({ length: 12 }, () => false);

      // 已注册员工：照常映射
      const registeredEmps = records.map(item => ({
        ...item,
        name: item.fullName,
        monthsUsed: getFundMonthsWithHireDate(
          item.hireDate,
          monthsUsedMap[String(item.userId)] || defaultMonths
        )
      }));

      // 未注册员工：经费接口返回但员工列表查不到（或直接没有 userId）→ 补进智创基地树，
      // 按接口 deptId 归入真实部门，只展示不可勾选
      const registeredIds = new Set(records.map(item => String(item.userId)));
      let unregIdx = 0;
      const unregisteredEmps = fundList
        .filter(item => item.userId == null || !registeredIds.has(item.userId))
        .map(item => {
          unregIdx++;
          const hasUserId = item.userId != null;
          return {
            // 有 userId 用 unreg_ 前缀、无 userId（未注册）用序号，均保证节点 id 唯一
            id: hasUserId ? `unreg_${item.userId}` : `unreg_null_${unregIdx}`,
            userId: item.userId,
            fullName: item.userName || "未注册员工",
            name: item.userName || "未注册员工",
            site: HANGZHOU_SITE,
            deptId: item.deptId != null ? String(item.deptId) : null,
            avatarUrl: "",
            email: "",
            education: "",
            lifeTimePoints: null,
            redeemablePoints: null,
            monthsUsed: getFundMonthsWithHireDate(null, item.months),
            isRegistered: false
          };
        });

      // 合并员工列表：未注册员工仅在开关打开时追加
      employees.value = SHOW_UNREGISTERED
        ? [...registeredEmps, ...unregisteredEmps]
        : registeredEmps;

      // 根据当前选中的员工ID更新选中状态
      selectedEmployee.value = employees.value.find(
        emp => emp.id === selectedEmployee.value?.id
      );

      backEmployees.value = employees.value;
      // 并行预加载所有头像（未注册员工无头像，自动跳过）
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
  loading.value = false;
});

defineExpose({
  fetchUserListData
});
</script>

<style scoped>
/* 移动端：原生滚动胶囊 Tab 栏，隐藏 el-tabs 自带头部 */
@media screen and (width <= 768px) {
  .monitor-container {
    min-width: 0;
    padding: 12px;
    overflow-x: hidden;
  }

  .monitor-tabs {
    padding: 0;
    margin-bottom: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  /* el-tabs 自带头部（translateX 模拟滚动）在移动端隐藏，改用自定义胶囊栏 */
  .monitor-tabs :deep(.el-tabs__header) {
    display: none;
  }

  .monitor-tabs :deep(.el-tabs__content) {
    padding-top: 6px;
  }

  /* 自定义移动端 Tab 栏：粘顶 + 原生横向滚动 + 隐藏滚动条 */
  .mobile-tab-nav {
    position: sticky;
    top: 8px;
    z-index: 40;
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    padding: 4px;
    margin-bottom: 0;
    overflow-x: auto;
    background: #f1f5f9;
    border: 1px solid #eef0f3;
    border-radius: 14px;
    box-shadow: 0 4px 16px rgb(15 23 42 / 4%);
    scrollbar-width: none;
    scroll-snap-type: x proximity;
  }

  .mobile-tab-nav::-webkit-scrollbar {
    display: none;
  }

  .mobile-tab-item {
    flex: 1 0 auto;
    min-width: max-content;
    height: 38px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    line-height: 38px;
    color: #64748b;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 10px;
    transition:
      color 0.25s,
      background-color 0.25s,
      box-shadow 0.25s;
    scroll-snap-align: start;
  }

  .mobile-tab-item.is-active {
    color: #2563eb;
    background: #fff;
    box-shadow: 0 2px 10px rgb(37 99 235 / 12%);
  }

  .main-content {
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .employee-list {
    max-width: none;
  }

  /* 各 Tab 下的卡片统一收窄内边距 + 防止子元素把卡片撑破 */
  .exchange-history-card {
    width: 100%;
    min-width: 0;
    padding: 16px 12px 12px;
  }

  .exchange-title {
    margin-bottom: 20px;
    font-size: 20px;
  }
}

.monitor-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px;
  overflow-y: auto;
}

.monitor-tabs {
  flex-shrink: 0;
  padding: 6px;
  margin-bottom: 24px;
  background: #f1f5f9;
  border: 1px solid #eef0f3;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgb(15 23 42 / 4%);
}

/* 分段式 tab：浅灰底座 + 白色圆角胶囊高亮（:deep 需平铺，不能嵌在 .monitor-tabs 内） */
.monitor-tabs :deep(.el-tabs__header) {
  height: auto;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
}

.monitor-tabs :deep(.el-tabs__nav) {
  display: flex;
  width: 100%;
  height: 44px;
  background: transparent;
}

.monitor-tabs :deep(.el-tabs__item) {
  flex: 1 1 0;
  min-width: 0;
  height: 44px;
  margin: 0 4px;
  font-size: 15px;
  font-weight: 500;
  line-height: 44px;
  color: #64748b;
  text-align: center;
  background: transparent;
  border: none !important;
  border-radius: 10px;
  transition:
    color 0.25s,
    background-color 0.25s,
    box-shadow 0.25s;
}

.monitor-tabs :deep(.el-tabs__item:hover) {
  color: #2563eb;
  background: rgb(255 255 255 / 70%);
}

.monitor-tabs :deep(.el-tabs__item.is-active) {
  color: #2563eb;
  background: #fff;
  box-shadow: 0 2px 10px rgb(37 99 235 / 12%);
}

.monitor-tabs :deep(.el-tabs__active-bar),
.monitor-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none !important;
}

.monitor-tabs :deep(.el-tabs__content) {
  padding-top: 24px;
  overflow: visible !important;
}

.monitor-tabs :deep(.el-tab-pane) {
  overflow: visible !important;
}

/* 移动端自绘 Tab 栏：桌面端隐藏，仅移动端显示 */
.mobile-tab-nav {
  display: none;
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
