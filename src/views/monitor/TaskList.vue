<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">员工任务</div>
    <el-table
      :data="exchangeList"
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
          暂无数据
        </div>
      </template>
      <el-table-column prop="fullName" label="员工">
        <template #default="scope">
          <div class="flex gap-2 items-center">
            <el-avatar
              :size="32"
              :src="scope.row.avatarUrl"
              style="margin-right: 12px"
            />
            <span>{{ scope.row.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="截止时间">
        <template #default="scope">
          <div class="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-gray-500"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            <span>{{ getDueDate(scope.row.remark) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <!-- 已完成状态使用自定义样式 -->
          <div
            v-if="getStatusText(scope.row.remark) === '已完成'"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-blue-100 text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="ml-1">已完成</span>
          </div>
          <!-- 进行中状态使用自定义样式 -->
          <div
            v-else-if="getStatusText(scope.row.remark) === '进行中'"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-yellow-100 text-yellow-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="ml-1">进行中</span>
          </div>
          <!-- 待开始状态使用自定义样式 -->
          <div
            v-else-if="getStatusText(scope.row.remark) === '待开始'"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-gray-100 text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="ml-1">待开始</span>
          </div>
          <!-- 其他状态使用原有的 el-tag -->
          <el-tag v-else :type="getStatusType(scope.row.remark)" effect="dark">
            {{ getStatusText(scope.row.remark) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进度">
        <template #default="scope">
          <div class="progress-container">
            <el-progress
              :percentage="getProgressPercentage(scope.row.remark)"
              :status="getProgressStatus(scope.row.remark)"
              :stroke-width="8"
              :show-text="false"
            />
            <div class="progress-text">
              {{ getProgressText(scope.row.remark) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <div class="flex items-center gap-2">
            <button
              @click="handleShowDetails(scope.row)"
              class="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input hover:bg-accent hover:text-accent-foreground border h-9 rounded-md px-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-eye h-4 w-4"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              查看详情
            </button>
            <button
              @click="handleApprove(scope.row)"
              class="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-white h-9 rounded-md px-3 bg-green-600 hover:bg-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-check h-4 w-4"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              审核通过
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { getQaList } from "@/api/task";
import { ref } from "vue";

const exchangeList = ref([]);

const handleShowDetails = row => {
  console.log("查看", row);
  console.log(row);
};

const getQaListData = () => {
  getQaList().then(res => {
    if (res.code === 200) {
      exchangeList.value = res.data;
    }
  });
};

// 解析remark数据获取截止时间
const getDueDate = remark => {
  try {
    const remarkData = JSON.parse(remark);
    return remarkData.dueDate || "未设置";
  } catch (error) {
    return "未设置";
  }
};

// 获取任务状态文本
const getStatusText = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;

    if (completedQuestions === 0) {
      return "待开始";
    } else if (completedQuestions < totalQuestions) {
      return "进行中";
    } else if (completedQuestions === totalQuestions) {
      return "已完成";
    }
    return "未知状态";
  } catch (error) {
    return "未知状态";
  }
};

// 获取状态标签类型
const getStatusType = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;

    if (completedQuestions === 0) {
      return "info"; // 待开始 - 灰色
    } else if (completedQuestions < totalQuestions) {
      return "warning"; // 进行中 - 橙色
    } else if (completedQuestions === totalQuestions) {
      return "success"; // 已完成 - 绿色
    }
    return "info";
  } catch (error) {
    return "info";
  }
};

// 查看操作
const handleView = row => {
  console.log("查看", row);
  // TODO: 实现查看详情功能
};

// 审核通过操作
const handleApprove = row => {
  console.log("审核通过", row);
  // TODO: 实现审核通过功能
};

// 获取进度百分比
const getProgressPercentage = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;

    if (totalQuestions === 0) return 0;
    return Math.round((completedQuestions / totalQuestions) * 100);
  } catch (error) {
    return 0;
  }
};

// 获取进度状态
const getProgressStatus = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;

    if (completedQuestions === 0) {
      return ""; // 待开始 - 默认灰色
    } else if (completedQuestions < totalQuestions) {
      return ""; // 进行中 - 默认蓝色
    } else if (completedQuestions === totalQuestions) {
      return "success"; // 已完成 - 绿色
    }
    return "";
  } catch (error) {
    return "";
  }
};

// 获取进度文本
const getProgressText = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;
    return `${completedQuestions}/${totalQuestions}`;
  } catch (error) {
    return "0/0";
  }
};

getQaListData();
</script>

<style scoped>
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

/* 自定义状态样式 */
.inline-flex {
  display: inline-flex;
}

.items-center {
  align-items: center;
}

.rounded-full {
  border-radius: 9999px;
}

.border {
  border-width: 1px;
}

.px-2\.5 {
  padding-right: 0.625rem;
  padding-left: 0.625rem;
}

.py-0\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-semibold {
  font-weight: 600;
}

.transition-colors {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
}

.border-transparent {
  border-color: transparent;
}

.bg-blue-100 {
  background-color: rgb(219 234 254);
}

.text-blue-800 {
  color: rgb(30 64 175);
}

.bg-yellow-100 {
  background-color: rgb(254 249 195);
}

.text-yellow-800 {
  color: rgb(133 77 14);
}

.bg-gray-100 {
  background-color: rgb(243 244 246);
}

.text-gray-800 {
  color: rgb(31 41 55);
}

.h-4 {
  height: 1rem;
}

.w-4 {
  width: 1rem;
}

.ml-1 {
  margin-left: 0.25rem;
}

/* 进度条样式 */
.progress-container {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 250px;
}

.progress-container :deep(.el-progress) {
  flex: 1;
}

.progress-text {
  min-width: 30px;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}
</style>
