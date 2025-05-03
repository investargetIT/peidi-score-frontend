<template>
  <div class="monitor-container">
    <el-tabs
      v-model="activeTab"
      class="monitor-tabs"
      type="card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="管理积分" name="manage">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'manage'" key="manage">
            <div class="main-content">
              <EmployeeList
                :employees="filteredEmployees"
                v-model:search="search"
                :selected="selectedEmployee"
                @select="selectEmployee"
              />
              <ManageScore :employee="selectedEmployee" />
            </div>
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="兑换历史" name="exchange">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'exchange'" key="exchange">
            <ExchangeHistory :exchangeList="exchangeList" />
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="积分历史" name="history">
        <transition name="fade-transform" mode="out-in">
          <div v-if="activeTab === 'history'" key="history">
            <el-card class="exchange-history-card">
              <div class="exchange-title">积分历史</div>
              <el-table
                :data="scoreHistoryList"
                class="exchange-table no-border-table"
                header-row-class-name="exchange-header"
              >
                <template #empty>
                  <div
                    style="
                      padding: 40px 0;
                      font-size: 18px;
                      color: #888;
                      text-align: center;
                    "
                  >
                    请先选择一名员工以查看其积分历史
                  </div>
                </template>
                <el-table-column
                  prop="date"
                  label="日期"
                  width="180"
                  align="center"
                />
                <el-table-column prop="type" label="类型" align="center" />
                <el-table-column prop="change" label="积分变动" align="center">
                  <template #default="scope">
                    <span
                      :style="{
                        color: scope.row.change > 0 ? '#21ba45' : '#db2828',
                        fontWeight: 'bold'
                      }"
                    >
                      {{ scope.row.change > 0 ? "+" : ""
                      }}{{ scope.row.change }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  min-width="180"
                  align="center"
                />
              </el-table>
            </el-card>
          </div>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import EmployeeList from "./EmployeeList.vue";
import ManageScore from "./ManageScore.vue";
import ExchangeHistory from "./ExchangeHistory.vue";
import avatarImg from "@/assets/login/avatar.svg";

const activeTab = ref("manage");
const search = ref("");
const selectedEmployee = ref(null);
const employees = ref([
  { name: "John Doe", dept: "Marketing" },
  { name: "Emma Johnson", dept: "Sales" },
  { name: "Michael Chen", dept: "Engineering" },
  { name: "Sophia Rodriguez", dept: "Customer Support" },
  { name: "William Taylor", dept: "Finance" },
  { name: "Olivia Brown", dept: "Human Resources" }
]);
const filteredEmployees = computed(() => {
  if (!search.value) return employees.value;
  return employees.value.filter(e =>
    e.name.toLowerCase().includes(search.value.toLowerCase())
  );
});
function selectEmployee(emp) {
  selectedEmployee.value = emp;
}
function handleTabClick() {
  // 可扩展tab切换逻辑
}
const exchangeList = [
  {
    date: "2023年6月15日",
    name: "无线耳机",
    img: avatarImg,
    points: "2,000",
    status: "已完成"
  },
  {
    date: "2023年7月10日",
    name: "礼品卡（$25）",
    img: avatarImg,
    points: "1,000",
    status: "已完成"
  },
  {
    date: "2023年8月5日",
    name: "托特包",
    img: avatarImg,
    points: "300",
    status: "已发货"
  }
];
const scoreHistoryList = [
  { date: "2023年6月10日", type: "奖励", change: 500, remark: "业绩奖励" },
  {
    date: "2023年6月20日",
    type: "兑换",
    change: -2000,
    remark: "兑换无线耳机"
  },
  { date: "2023年7月5日", type: "奖励", change: 300, remark: "团队协作" },
  { date: "2023年7月10日", type: "兑换", change: -1000, remark: "兑换礼品卡" },
  { date: "2023年8月1日", type: "奖励", change: 200, remark: "月度之星" },
  { date: "2023年8月5日", type: "兑换", change: -300, remark: "兑换托特包" }
];
</script>

<style scoped>
.monitor-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
}

.monitor-tabs {
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

.main-content {
  display: flex;
  gap: 32px;
  align-items: stretch;
  min-height: 0;
  margin-top: 24px;
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
