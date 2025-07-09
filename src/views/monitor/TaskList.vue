<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">员工任务</div>
    <el-form :model="searchForm" inline>
      <el-form-item label="员工" prop="fullName">
        <el-select
          style="width: 240px"
          v-model="searchForm.fullName"
          clearable
          placeholder="请选择员工"
        >
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="hasReview">
        <el-select
          style="width: 240px"
          v-model="searchForm.hasReview"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="filteredExchangeList"
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
          <!-- 已审核状态 -->
          <div
            v-if="scope.row.hasReview"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800"
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span class="ml-1">已审核</span>
          </div>
          <!-- 待审核状态 -->
          <div
            v-else
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-orange-100 text-orange-800"
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
            <span class="ml-1">待审核</span>
          </div>
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
              v-if="canApproveTask(scope.row)"
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
                <path d="M20 6 9 17 4 12"></path>
              </svg>
              审核通过
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 任务详情弹窗 -->
  <el-dialog
    v-model="isTaskDialogOpen"
    width="80%"
    :close-on-click-modal="false"
    class="task-detail-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-title-container">
          <h2 class="dialog-title">
            员工任务 - {{ selectedTask?.fullName || "" }}
          </h2>
        </div>
      </div>
    </template>
    <div v-if="selectedTask" class="task-detail-content">
      <!-- 任务信息 -->
      <div class="task-info-grid">
        <div class="info-item">
          <p class="info-label">状态</p>
          <div
            v-if="selectedTask.hasReview"
            class="status-badge-compact completed"
          >
            <svg
              class="status-icon-compact"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>已审核</span>
          </div>
          <div v-else class="status-badge-compact pending">
            <svg
              class="status-icon-compact"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>待审核</span>
          </div>
        </div>
        <div class="info-item">
          <p class="info-label">截止日期</p>
          <p class="info-value">{{ getDueDate(selectedTask.remark) }}</p>
        </div>
        <div class="info-item">
          <p class="info-label">进度</p>
          <p class="info-value">
            {{ getProgressText(selectedTask.remark) }} 已完成
          </p>
        </div>
      </div>

      <!-- 审核状态提示 -->
      <!-- <div v-if="selectedTask.hasReview" class="approval-notice">
        <div class="approval-header">
          <svg
            class="approval-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span class="approval-title">任务已审核</span>
        </div>
        <div class="approval-details">
          <p>审核人员: 管理员</p>
          <p>审核时间: {{ new Date().toLocaleString("zh-CN") }}</p>
        </div>
      </div> -->

      <!-- 题目和答案 -->
      <div class="questions-section">
        <h3 class="questions-title">题目与答案</h3>
        <div class="questions-list">
          <div
            v-for="(question, index) in getQuestions(selectedTask.qa)"
            :key="index"
            :class="['question-card', { answered: question.answered }]"
          >
            <div class="question-header">
              <div class="question-info">
                <div class="question-number-row">
                  <span class="question-number">题目 {{ index + 1 }}</span>
                  <el-tag
                    :type="getDifficultyType(question.difficulty)"
                    size="small"
                    class="difficulty-tag"
                  >
                    {{ getDifficultyText(question.difficulty) }}
                  </el-tag>
                  <svg
                    v-if="question.answered"
                    class="answered-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p class="question-title">{{ question.title }}</p>
              </div>
            </div>
            <div class="question-content">
              <div v-if="question.answered" class="answer-section">
                <div class="answer-content">
                  <p class="answer-label">答案:</p>
                  <div class="answer-text" v-html="question.content"></div>
                </div>
                <div
                  v-if="question.attachments && question.attachments.length > 0"
                  class="attachments-section"
                >
                  <p class="attachments-label">附件:</p>
                  <div class="attachments-list">
                    <div
                      v-for="attachment in question.attachments"
                      :key="attachment.uid || attachment.name"
                      class="attachment-item"
                    >
                      <span class="attachment-icon">📎</span>
                      <button
                        @click="handleAttachmentClick(attachment)"
                        class="attachment-link"
                      >
                        {{ attachment.name }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="submission-info">
                  <div class="submission-item">
                    <p class="submission-label">提交时间:</p>
                    <p class="submission-value">
                      {{ formatSubmissionTime(question.submittedAt) }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="no-answer">
                <p class="no-answer-text">尚未回答</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 整体审核按钮 -->
      <div
        class="flex justify-center pt-4 border-t"
        v-if="canApproveTask(selectedTask)"
      >
        <button
          @click="handleTaskApproval"
          class="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-11 rounded-md px-8 bg-green-600 hover:bg-green-700"
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
            class="lucide lucide-check h-5 w-5 mr-2"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          审核通过
        </button>
      </div>
    </div>
  </el-dialog>

  <!-- 附件预览弹窗 -->
  <el-dialog v-model="dialogVisible" title="图片预览">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { getQaList, updateQaConfig } from "@/api/task";
import { getFileDownLoadPath } from "@/api/esg";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";

const exchangeList = ref([]);
const filteredExchangeList = ref([]);
const isTaskDialogOpen = ref(false);
const selectedTask = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const userList = ref([]);
const statusList = ref([
  {
    label: "待审核",
    value: false
  },
  {
    label: "已审核",
    value: true
  }
]);
const searchForm = ref({
  fullName: "",
  hasReview: ""
});

const handleShowDetails = row => {
  selectedTask.value = row;
  isTaskDialogOpen.value = true;
  console.log("查看", row);
};

const getQaListData = () => {
  getQaList().then(res => {
    if (res.code === 200) {
      exchangeList.value = res.data;
      // 获取用户列表
      const users = [...new Set(res.data.map(item => item.fullName))];
      userList.value = users.map(user => ({
        label: user,
        value: user
      }));
      // 应用筛选
      applyFilters();
    }
  });
};

// 应用筛选逻辑
const applyFilters = () => {
  let filtered = [...exchangeList.value];

  // 按员工筛选
  if (searchForm.value.fullName) {
    filtered = filtered.filter(
      item => item.fullName === searchForm.value.fullName
    );
  }

  // 按审核状态筛选
  if (searchForm.value.hasReview !== "") {
    filtered = filtered.filter(
      item => item.hasReview === searchForm.value.hasReview
    );
  }

  filteredExchangeList.value = filtered;
};

// 搜索功能
const handleSearch = () => {
  applyFilters();
};

// 重置功能
const handleReset = () => {
  searchForm.value = {
    fullName: "",
    hasReview: ""
  };
  applyFilters();
};

// 解析题目数据
const getQuestions = qaString => {
  try {
    const qaArray = JSON.parse(qaString);
    return qaArray.map((item, index) => ({
      id: item.questionId,
      title: item.questionTitle,
      difficulty: item.difficulty,
      key: item.questionKey,
      answered: item.isAnswered,
      content: item.content || "",
      attachments: item.attachments || [],
      submittedAt: item.submittedAt,
      reviewStatus: item.reviewStatus || "pending"
    }));
  } catch (error) {
    console.error("解析题目数据失败:", error);
    return [];
  }
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

// 判断是否可以审核任务
const canApproveTask = task => {
  try {
    const remarkData = JSON.parse(task.remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;
    return completedQuestions === totalQuestions && !task.hasReview;
  } catch (error) {
    return false;
  }
};

// 获取难度级别文本
const getDifficultyText = difficulty => {
  const difficultyMap = {
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级"
  };
  return difficultyMap[difficulty] || difficulty;
};

// 获取难度标签类型
const getDifficultyType = difficulty => {
  const difficultyMap = {
    beginner: "success",
    intermediate: "warning",
    advanced: "danger"
  };
  return difficultyMap[difficulty] || "info";
};

// 格式化提交时间
const formatSubmissionTime = submittedAt => {
  if (!submittedAt) return "未提交";
  return new Date(submittedAt).toLocaleString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 处理任务审核
const handleTaskApproval = async () => {
  if (!selectedTask.value) return;

  try {
    // 解析当前任务的qa数据
    const qaData = JSON.parse(selectedTask.value.qa || "[]");

    // 更新所有问题的审核状态为"approved"
    const updatedQaData = qaData.map(question => ({
      ...question,
      reviewStatus: "approved",
      reviewedAt: new Date().toISOString()
    }));

    // 解析remark数据
    const remarkData = JSON.parse(selectedTask.value.remark || "{}");

    // 准备保存的数据
    const saveData = {
      userId: selectedTask.value.userId,
      qa: JSON.stringify(updatedQaData),
      remark: JSON.stringify({
        ...remarkData,
        reviewDate: new Date().toISOString()
      }),
      hasReview: true,
      id: selectedTask.value.id
    };

    // 调用API更新数据
    await updateQaConfig(saveData);

    ElMessage.success("审核通过成功");
    isTaskDialogOpen.value = false;
    getQaListData();
  } catch (error) {
    console.error("审核失败:", error);
    ElMessage.error("审核失败，请重试");
  }
};

// 查看操作
const handleView = row => {
  console.log("查看", row);
  // TODO: 实现查看详情功能
};

// 审核通过操作
const handleApprove = async row => {
  if (!row) return;

  try {
    // 解析当前任务的qa数据
    const qaData = JSON.parse(row.qa || "[]");

    // 更新所有问题的审核状态为"approved"
    const updatedQaData = qaData.map(question => ({
      ...question,
      reviewStatus: "approved",
      reviewedAt: new Date().toISOString()
    }));

    // 解析remark数据
    const remarkData = JSON.parse(row.remark || "{}");

    // 准备保存的数据
    const saveData = {
      userId: row.userId,
      qa: JSON.stringify(updatedQaData),
      remark: JSON.stringify({
        ...remarkData,
        reviewDate: new Date().toISOString()
      }),
      hasReview: true,
      id: row.id
    };

    // 调用API更新数据
    await updateQaConfig(saveData);

    ElMessage.success("审核通过成功");
    getQaListData();
  } catch (error) {
    console.error("审核失败:", error);
    ElMessage.error("审核失败，请重试");
  }
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

// 处理附件预览/下载
const handleAttachmentClick = async attachment => {
  if (attachment.response && attachment.response.code === 200) {
    try {
      const res = await getFileDownLoadPath({
        objectName: attachment.response.data
      });

      if (res.code === 200) {
        // 判断是否为图片文件
        const isImage =
          attachment.raw?.type?.includes("image") ||
          /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(attachment.name);

        if (isImage) {
          // 图片文件：在弹窗中预览
          dialogImageUrl.value = res.data;
          dialogVisible.value = true;
        } else {
          // 非图片文件：在新窗口打开
          window.open(res.data, "_blank");
        }
      } else {
        ElMessage.error("文件预览失败：" + res.msg);
      }
    } catch (error) {
      console.error("预览附件失败:", error);
      ElMessage.error("文件预览失败");
    }
  } else {
    ElMessage.error("附件信息不完整，无法预览");
  }
};

// 组件加载时初始化数据
onMounted(() => {
  getQaListData();
});
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

.el-form-item__label {
  justify-content: flex-start;
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

.border-transparent {
  border-color: transparent;
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

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-yellow-100 {
  background-color: #fef3c7;
}

.text-yellow-800 {
  color: #92400e;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.text-gray-800 {
  color: #1f2937;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-800 {
  color: #166534;
}

.bg-orange-100 {
  background-color: #fed7aa;
}

.text-orange-800 {
  color: #9a3412;
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

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgb(59 130 246 / 50%);
}

.focus\:ring-ring:focus {
  --tw-ring-color: #3b82f6;
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

.hover\:bg-primary\/80:hover {
  background-color: rgb(59 130 246 / 80%);
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

/* 任务详情弹窗样式 */
.task-detail-dialog {
  max-height: 90vh;
}

.dialog-header {
  padding: 0;
  margin: 0;
}

.dialog-title-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: #111827;
  letter-spacing: -0.025em;
}

.task-detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.task-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  margin-bottom: 24px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.status-badge {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
}

.status-badge.completed {
  color: #166534;
  background: #dcfce7;
}

.status-badge.in-progress {
  color: #92400e;
  background: #fef3c7;
}

.status-badge.pending {
  color: #374151;
  background: #f3f4f6;
}

.status-icon {
  width: 14px;
  height: 14px;
}

/* 紧凑状态标签样式 */
.status-badge-compact {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  width: fit-content;
  max-width: 100px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 10px;
}

.status-badge-compact.completed {
  color: #166534;
  background: #dcfce7;
}

.status-badge-compact.in-progress {
  color: #92400e;
  background: #fef3c7;
}

.status-badge-compact.pending {
  color: #374151;
  background: #f3f4f6;
}

.status-icon-compact {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
}

.approval-notice {
  padding: 16px;
  margin-bottom: 24px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.approval-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.approval-icon {
  width: 20px;
  height: 20px;
  color: #16a34a;
}

.approval-title {
  font-weight: 600;
  color: #166534;
}

.approval-details {
  font-size: 14px;
  color: #15803d;
}

.approval-details p {
  margin: 0;
  margin-bottom: 4px;
}

.questions-section {
  margin-bottom: 24px;
}

.questions-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.question-card.answered {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.question-header {
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-number-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.question-number {
  font-weight: 500;
  color: #374151;
}

.difficulty-tag {
  font-weight: 500;
  border-radius: 4px;
}

.answered-icon {
  width: 20px;
  height: 20px;
  color: #16a34a;
}

.question-title {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.question-content {
  padding: 16px;
}

.answer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-label {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.answer-text {
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
}

.attachments-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachments-label {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attachment-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.attachment-icon {
  font-size: 14px;
}

.attachment-link {
  padding: 0;
  font-size: 14px;
  color: #2563eb;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
}

.attachment-link:hover {
  text-decoration: underline;
}

.submission-info {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.submission-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submission-label {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.submission-value {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.review-status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
}

.review-status.pending {
  color: #92400e;
  background: #fef3c7;
}

.review-status.approved {
  color: #16a34a;
  background: #d1fae5;
}

.review-status.rejected {
  color: #991b1b;
  background: #fef2f2;
}

.no-answer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.no-answer-text {
  margin: 0;
  font-size: 14px;
  font-style: italic;
  color: #6b7280;
}

/* 审核按钮样式 */
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.pt-4 {
  padding-top: 1rem;
}

.border-t {
  border-top: 1px solid #e5e7eb;
}

.gap-2 {
  gap: 0.5rem;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-medium {
  font-weight: 500;
}

.h-11 {
  height: 2.75rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.px-8 {
  padding-right: 2rem;
  padding-left: 2rem;
}

.bg-green-600 {
  background-color: #059669;
}

.hover\:bg-green-700:hover {
  background-color: #047857;
}

.text-primary-foreground {
  color: #fff;
}

.h-5 {
  height: 1.25rem;
}

.w-5 {
  width: 1.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.focus-visible\:outline-hidden:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible\:ring-2:focus-visible {
  box-shadow: 0 0 0 2px rgb(59 130 246 / 50%);
}

.disabled\:pointer-events-none:disabled {
  pointer-events: none;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

/* 图片预览弹窗样式 */
.el-dialog img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>
