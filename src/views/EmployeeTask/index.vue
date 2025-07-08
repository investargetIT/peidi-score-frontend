<template>
  <div>
    <!-- 页面头部 -->
    <div class="task-header">
      <h1 class="task-title">{{ `Employee Task - ${employeeName}` }}</h1>
      <div class="task-meta">
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>Due Date: {{ formatDate(dueDate) }}</span>
        </div>
        <div class="meta-item">
          <el-tag :type="getStatusType(taskStatus)" size="large">
            {{ getStatusText(taskStatus) }}
          </el-tag>
        </div>
        <div class="meta-item">
          <span
            >Progress: {{ completedQuestions }}/{{ totalQuestions }} questions
            completed</span
          >
        </div>
      </div>
    </div>

    <!-- 完成提示 -->
    <el-alert
      v-if="taskStatus === 'completed'"
      title="Congratulations! You have completed all tasks."
      type="success"
      :closable="false"
      show-icon
      class="completion-alert"
    />

    <!-- 任务问题列表 -->
    <div class="questions-container">
      <!-- 空状态展示 -->
      <div v-if="questions.length === 0" class="empty-state">
        <div class="empty-content">
          <el-icon class="empty-icon">
            <Document />
          </el-icon>
          <h3 class="empty-title">No Questions Available</h3>
          <p class="empty-description">
            There are currently no questions assigned to this task. Please check
            back later or contact your administrator.
          </p>
        </div>
      </div>

      <!-- 问题卡片列表 -->
      <div
        v-else
        v-for="(question, index) in questions"
        :key="question.id"
        class="question-card"
      >
        <el-card
          :class="{
            'answered-card': isQuestionAnswered(question.id),
            'current-card': currentQuestionId === question.id
          }"
          shadow="hover"
        >
          <template #header>
            <div class="question-header">
              <div class="question-info">
                <span class="question-number">Question {{ index + 1 }}</span>
                <el-tag
                  :type="getDifficultyType(question.difficulty)"
                  size="small"
                  class="difficulty-tag"
                >
                  {{ getDifficultyText(question.difficulty) }}
                </el-tag>
                <el-tag
                  v-if="getAnswerStatus(question.id)"
                  :type="getAnswerStatusType(getAnswerStatus(question.id))"
                  size="small"
                  class="status-tag"
                >
                  {{ getAnswerStatusText(getAnswerStatus(question.id)) }}
                </el-tag>
              </div>
              <el-icon
                v-if="isQuestionAnswered(question.id)"
                color="#67C23A"
                size="20"
                class="completed-icon"
              >
                <Check />
              </el-icon>
            </div>
            <p class="question-title">{{ question.title }}</p>
          </template>

          <!-- 问题内容 -->
          <div class="question-content">
            <!-- 答案区域 -->
            <div class="answer-section">
              <div v-if="!isQuestionAnswered(question.id)" class="answer-form">
                <div class="answer-label">
                  <label class="form-label">Your Answer</label>
                </div>

                <!-- 答案输入框 -->
                <div class="answer-input-container">
                  <el-input
                    v-model="tempAnswers[question.id]"
                    type="textarea"
                    :rows="6"
                    placeholder="Your Answer"
                    resize="vertical"
                    show-word-limit
                    maxlength="2000"
                    class="answer-textarea"
                  />
                </div>

                <!-- 附件上传 -->
                <div class="attachments-section">
                  <div class="answer-label">
                    <label class="form-label">Attachments</label>
                  </div>
                  <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :on-success="
                      (response, file) =>
                        handleAttachmentSuccess(question.id, response, file)
                    "
                    :on-remove="
                      file => handleAttachmentRemove(question.id, file)
                    "
                    :file-list="getAttachments(question.id)"
                    multiple
                    :show-file-list="true"
                    drag
                  >
                    <div class="upload-dragger-content">
                      <el-icon class="upload-icon">
                        <Upload />
                      </el-icon>
                      <div class="upload-text">
                        <p>Drag and drop files here, or click to select</p>
                        <p class="upload-hint">Max files: 3, Max size: 5MB</p>
                      </div>
                      <el-button
                        type="default"
                        size="small"
                        class="select-files-btn"
                      >
                        Select Files
                      </el-button>
                    </div>
                  </el-upload>
                </div>

                <!-- 提交按钮 -->
                <div class="submit-section">
                  <el-button
                    type="primary"
                    @click="submitAnswer(question.id)"
                    :disabled="!canSubmitAnswer(question.id)"
                    :loading="submittingAnswers[question.id]"
                    class="save-answer-btn"
                  >
                    Save Answer
                  </el-button>
                </div>
              </div>

              <!-- 已提交的答案显示 -->
              <div v-else class="submitted-answer">
                <div class="answer-label">
                  <label class="form-label">Your Answer</label>
                </div>

                <!-- 已提交的答案内容 -->
                <div class="submitted-answer-content">
                  <div
                    class="answer-display"
                    v-html="getAnswerContent(question.id)"
                  ></div>
                </div>

                <!-- 附件列表 -->
                <div
                  v-if="getSubmittedAttachments(question.id).length > 0"
                  class="submitted-attachments"
                >
                  <div class="answer-label">
                    <label class="form-label">Attachments</label>
                  </div>
                  <div class="attachment-list">
                    <div
                      v-for="attachment in getSubmittedAttachments(question.id)"
                      :key="attachment.id"
                      class="attachment-item"
                    >
                      <el-icon><Paperclip /></el-icon>
                      <el-link
                        :href="attachment.url"
                        target="_blank"
                        type="primary"
                      >
                        {{ attachment.name }}
                      </el-link>
                    </div>
                  </div>
                </div>

                <!-- 提交信息 -->
                <div class="submission-info-card">
                  <div class="submission-inline-grid">
                    <div class="submission-inline-item">
                      <p class="submission-label">Submitted at:</p>
                      <p class="submission-value">
                        {{ formatDateTime(getSubmissionTime(question.id)) }}
                      </p>
                    </div>
                    <div class="submission-inline-item">
                      <p class="submission-label">Review Status:</p>
                      <el-tag
                        :type="
                          getAnswerStatusType(getAnswerStatus(question.id))
                        "
                        size="small"
                        class="status-tag"
                      >
                        {{ getAnswerStatusText(getAnswerStatus(question.id)) }}
                      </el-tag>
                    </div>
                  </div>
                </div>

                <!-- 已提交答案的操作栏 -->
                <div class="submitted-answer-actions">
                  <el-button
                    type="primary"
                    size="default"
                    class="save-answer-btn"
                  >
                    Save Answer
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 完成任务按钮 -->
    <div
      v-if="taskStatus !== 'completed' && allQuestionsAnswered"
      class="complete-task-section"
    >
      <h3>Ready to Complete Task</h3>
      <p>You have answered all questions. Click below to complete the task.</p>
      <el-button
        type="success"
        size="large"
        @click="completeTask"
        :loading="completingTask"
      >
        Complete Task
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Calendar,
  Check,
  Upload,
  Paperclip,
  Document
} from "@element-plus/icons-vue";
import { storageLocal } from "@pureadmin/utils";
import { useI18n } from "vue-i18n";
import { TaskLevelList } from "./constant";

const { t } = useI18n();

// 基础数据
const employeeName = ref("John Doe");
const dueDate = ref(new Date("2024-02-10"));
const taskStatus = ref("in_progress"); // 'in_progress', 'completed', 'approved', 'overdue'
const currentQuestionId = ref(null);
const completingTask = ref(false);
const uploadUrl = ref("/api/upload");

// 随机抽取问题的逻辑
const generateRandomQuestions = () => {
  // 随机选择一个难度级别
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const selectedLevel = levels[Math.floor(Math.random() * levels.length)];

  let questionsToGenerate = [];
  let questionCount = 0;

  // 根据选择的级别确定抽取数量
  switch (selectedLevel) {
    case "Beginner":
      questionCount = 3;
      break;
    case "Intermediate":
      questionCount = 1;
      break;
    case "Advanced":
      questionCount = 1;
      break;
  }

  // 从对应级别的问题列表中随机抽取
  const availableQuestions = TaskLevelList[selectedLevel];
  const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, questionCount);

  // 生成问题对象
  questionsToGenerate = selectedQuestions.map((question, index) => ({
    id: `q${index + 1}`,
    title: question.text,
    difficulty: selectedLevel.toLowerCase()
  }));

  return questionsToGenerate;
};

// 问题数据
const questions = ref(generateRandomQuestions());

// 答案数据
const answers = ref({
  q1: {
    content: "我是John Doe，很高兴加入佩带股份。我选择加入这家公司是因为...",
    attachments: [],
    submittedAt: new Date("2024-01-10T10:30:00"),
    reviewStatus: "pending", // 'pending', 'approved', 'rejected'
    reviewedAt: null,
    reviewComment: null
  }
});

// 临时答案数据（编辑中）
const tempAnswers = ref({});
const tempAttachments = ref({});
const submittingAnswers = ref({});

// 计算属性
const totalQuestions = computed(() => questions.value.length);
const completedQuestions = computed(() => Object.keys(answers.value).length);
const allQuestionsAnswered = computed(
  () => completedQuestions.value === totalQuestions.value
);
const canCompleteTask = computed(
  () =>
    completedQuestions.value === totalQuestions.value &&
    taskStatus.value !== "completed"
);

// 工具函数
const formatDate = date => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatDateTime = date => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getStatusType = status => {
  const types = {
    in_progress: "warning",
    completed: "info",
    approved: "success",
    overdue: "danger"
  };
  return types[status] || "info";
};

const getStatusText = status => {
  const texts = {
    in_progress: "In Progress",
    completed: "Completed",
    approved: "Approved",
    overdue: "Overdue"
  };
  return texts[status] || status;
};

const getDifficultyType = difficulty => {
  const types = {
    beginner: "success",
    intermediate: "warning",
    advanced: "danger"
  };
  return types[difficulty] || "info";
};

const getDifficultyText = difficulty => {
  const texts = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };
  return texts[difficulty] || difficulty;
};

const getAnswerStatusType = status => {
  const types = {
    pending: "warning",
    approved: "success",
    rejected: "danger"
  };
  return types[status] || "info";
};

const getAnswerStatusText = status => {
  const texts = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected"
  };
  return texts[status] || status;
};

// 问题相关方法
const isQuestionAnswered = questionId => {
  return !!answers.value[questionId];
};

const getAnswerStatus = questionId => {
  return answers.value[questionId]?.reviewStatus || null;
};

const getAnswerContent = questionId => {
  return answers.value[questionId]?.content || "";
};

const getSubmittedAttachments = questionId => {
  return answers.value[questionId]?.attachments || [];
};

const getSubmissionTime = questionId => {
  return answers.value[questionId]?.submittedAt;
};

const getReviewTime = questionId => {
  return answers.value[questionId]?.reviewedAt;
};

const getReviewComment = questionId => {
  return answers.value[questionId]?.reviewComment;
};

const getReviewComments = questionId => {
  return answers.value[questionId]?.reviewComment;
};

const getAttachments = questionId => {
  return tempAttachments.value[questionId] || [];
};

const canSubmitAnswer = questionId => {
  const tempAnswer = tempAnswers.value[questionId];
  return tempAnswer && tempAnswer.trim().length > 0;
};

// 附件相关方法
const handleAttachmentSuccess = (questionId, response, file) => {
  if (!tempAttachments.value[questionId]) {
    tempAttachments.value[questionId] = [];
  }
  tempAttachments.value[questionId].push({
    id: Date.now(),
    name: file.name,
    url: response.url || "#"
  });
  ElMessage.success("文件上传成功");
};

const handleAttachmentRemove = (questionId, file) => {
  if (tempAttachments.value[questionId]) {
    const index = tempAttachments.value[questionId].findIndex(
      item => item.name === file.name
    );
    if (index > -1) {
      tempAttachments.value[questionId].splice(index, 1);
    }
  }
};

// 提交答案
const submitAnswer = async questionId => {
  if (!canSubmitAnswer(questionId)) {
    ElMessage.warning("请先填写答案内容");
    return;
  }

  submittingAnswers.value[questionId] = true;

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    answers.value[questionId] = {
      content: tempAnswers.value[questionId],
      attachments: tempAttachments.value[questionId] || [],
      submittedAt: new Date(),
      reviewStatus: "pending",
      reviewedAt: null,
      reviewComment: null
    };

    // 清空临时数据
    tempAnswers.value[questionId] = "";
    tempAttachments.value[questionId] = [];

    ElMessage.success("答案提交成功");

    // 检查是否所有问题都已回答
    if (completedQuestions.value === totalQuestions.value) {
      ElMessage.info("所有问题已完成，您可以提交整个任务了");
    }
  } catch (error) {
    ElMessage.error("提交失败，请重试");
  } finally {
    submittingAnswers.value[questionId] = false;
  }
};

// 完成任务
const completeTask = async () => {
  try {
    await ElMessageBox.confirm(
      "确认要完成此任务吗？提交后将无法修改答案。",
      "确认提交",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    completingTask.value = true;

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    taskStatus.value = "completed";
    ElMessage.success("任务已完成！等待审核中...");
  } catch (error) {
    // 用户取消
  } finally {
    completingTask.value = false;
  }
};

// 生命周期
onMounted(() => {
  // 初始化数据
  console.log("Employee Task page loaded");
  console.log("Generated questions:", questions.value);
  console.log(
    "Selected difficulty level:",
    questions.value.length > 0 ? questions.value[0].difficulty : "none"
  );
  console.log("Question count:", questions.value.length);
});
</script>

<style scoped>
/* 移动端适配 */
@media (width <= 768px) {
  .task-header {
    padding: 0;
  }

  .task-title {
    font-size: 24px;
  }

  .task-meta {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .questions-container {
    gap: 20px;
  }

  .question-card .el-card__header {
    padding: 12px 16px;
  }

  .question-card .el-card__body {
    padding: 12px 16px;
  }

  .question-info {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .question-number {
    margin-right: 0;
    margin-bottom: 4px;
  }

  .answer-input-container .el-textarea__inner {
    font-size: 13px;
  }

  .upload-dragger-content {
    padding: 24px 16px;
  }

  .upload-icon {
    margin-bottom: 12px;
    font-size: 32px;
  }

  .save-answer-btn {
    min-width: 100px;
    padding: 8px 16px;
  }

  .submission-inline-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .empty-state {
    min-height: 160px;
    margin-top: 16px;
  }

  .empty-icon {
    margin-bottom: 12px;
    font-size: 36px;
  }

  .empty-title {
    margin-bottom: 6px;
    font-size: 16px;
  }

  .empty-description {
    padding: 0 16px;
    font-size: 13px;
  }
}

.task-header {
  padding: 0;
  margin-bottom: 32px;
  color: inherit;
  background: none;
  border-radius: 0;
}

.task-title {
  margin: 0 0 16px;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.meta-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
}

.completion-alert {
  margin-bottom: 32px;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-card {
  width: 100%;
}

.question-card .el-card {
  background-color: #fafafa;
  border: 1px solid #bbf7d0;
  border-radius: 8px;

  /* background-color: rgb(240 253 244 / 0.3); */
}

.question-card .el-card__header {
  padding: 16px 20px;
  background-color: transparent;
  border-bottom: 1px solid #f0f0f0;
}

.question-card .el-card__body {
  padding: 16px 20px;
  background-color: transparent;
}

.answered-card {
  background-color: #f0fdf4;
  border-color: #10b981;
}

.answered-card .el-card {
  background-color: #f0fdf4;
  border-color: #10b981;
  border-width: 2px;
}

.answered-card .el-card__header {
  background-color: transparent;
}

.answered-card .el-card__body {
  background-color: transparent;
}

.current-card {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 20%);
}

.current-card .el-card {
  background-color: #eff6ff;
  border-color: #3b82f6;
  border-width: 2px;
}

.question-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.question-info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.question-number {
  margin-right: 8px;
  font-size: 16px;
  font-weight: 600;
}

.difficulty-tag {
  margin-left: 0;
}

.completed-icon {
  margin-left: auto;
}

.question-title {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #6b7280;
}

.question-content {
  margin-top: 12px;
}

.question-description {
  padding: 8px 0;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
}

.answered-card .question-description {
  color: #059669;
}

/* 答案区域样式 */
.answer-section {
  margin-top: 24px;
}

.answer-label {
  margin-bottom: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.answer-input-container {
  margin-bottom: 24px;
}

.answer-textarea {
  border-radius: 8px;
}

.answer-textarea :deep(.el-textarea__inner) {
  min-height: 120px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.answer-textarea :deep(.el-textarea__inner):focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 10%);
}

.submitted-answer-content {
  margin-bottom: 24px;
}

.answer-display {
  min-height: 120px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* 附件区域样式 */
.attachments-section {
  margin-bottom: 24px;
}

.upload-demo :deep(.el-upload-dragger) {
  padding: 32px 24px;
  background: #fff;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.upload-demo :deep(.el-upload-dragger):hover {
  background: #f8fafc;
  border-color: #3b82f6;
}

.upload-dragger-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.upload-icon {
  margin-bottom: 16px;
  font-size: 40px;
  color: #9ca3af;
}

.upload-text p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.upload-text p:first-child {
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.select-files-btn {
  padding: 8px 16px;
  margin-top: 16px;
  font-size: 14px;
  color: #374151;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.select-files-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* 提交区域样式 */
.submit-section {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.save-answer-btn {
  min-width: 120px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
}

/* 已提交答案样式 */
.submitted-attachments {
  margin-bottom: 24px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.attachment-item .el-icon {
  color: #6b7280;
}

/* 提交信息卡片样式 */
.submission-info-card {
  padding: 12px;
  margin-bottom: 16px;
  background: rgb(249 250 251 / 30%);
  border-top: 1px solid #e5e7eb;
  border-radius: 6px;
}

.submission-inline-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  text-align: left;
}

.submission-inline-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submission-label {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.submission-value {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.status-tag {
  align-self: flex-start;
  margin-left: 0;
}

/* 已提交答案操作栏 */
.submitted-answer-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px; /* Adjust as needed */
  margin-top: 24px;
  background-color: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
}

.empty-content {
  color: #9ca3af;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  font-size: 48px;
  color: #9ca3af;
}

.empty-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.empty-description {
  font-size: 14px;
  line-height: 1.5;
  color: #6b7280;
}
</style>
