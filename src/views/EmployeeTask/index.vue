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
      <div
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
            <div v-if="question.description" class="question-description">
              <p>{{ question.description }}</p>
            </div>

            <!-- 答案区域 -->
            <div class="answer-section">
              <div v-if="!isQuestionAnswered(question.id)" class="answer-form">
                <h4>Your Answer</h4>

                <!-- 答案输入框 -->
                <div class="answer-input-container">
                  <el-input
                    v-model="tempAnswers[question.id]"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入您的答案..."
                    resize="vertical"
                    show-word-limit
                    maxlength="2000"
                  />
                </div>

                <!-- 附件上传 -->
                <div class="attachments-section">
                  <h4>Attachments</h4>
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
                        type="primary"
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
                  >
                    Submit Answer
                  </el-button>
                </div>
              </div>

              <!-- 已提交的答案显示 -->
              <div v-else class="submitted-answer">
                <h4>Your Answer</h4>
                <div
                  class="answer-content"
                  v-html="getAnswerContent(question.id)"
                ></div>

                <!-- 附件列表 -->
                <div
                  v-if="getSubmittedAttachments(question.id).length > 0"
                  class="submitted-attachments"
                >
                  <h4>Attachments</h4>
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
                <div class="submission-info">
                  <el-descriptions :column="2" size="small" border>
                    <el-descriptions-item label="Submitted At">
                      {{ formatDateTime(getSubmissionTime(question.id)) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Status">
                      <el-tag
                        :type="
                          getAnswerStatusType(getAnswerStatus(question.id))
                        "
                        size="small"
                      >
                        {{ getAnswerStatusText(getAnswerStatus(question.id)) }}
                      </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item
                      v-if="getReviewComments(question.id)"
                      label="Review Comments"
                      :span="2"
                    >
                      {{ getReviewComments(question.id) }}
                    </el-descriptions-item>
                  </el-descriptions>
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
import { Calendar, Check, Upload, Paperclip } from "@element-plus/icons-vue";
import { storageLocal } from "@pureadmin/utils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 基础数据
const employeeName = ref("John Doe");
const dueDate = ref(new Date("2024-02-10"));
const taskStatus = ref("in_progress"); // 'in_progress', 'completed', 'approved', 'overdue'
const currentQuestionId = ref(null);
const completingTask = ref(false);
const uploadUrl = ref("/api/upload");

// 问题数据
const questions = ref([
  {
    id: "q1",
    title:
      "Company Introduction: Please introduce yourself and explain why you chose to join our company",
    description:
      "This is a beginner level question to help us understand your background and motivation.",
    difficulty: "beginner"
  },
  {
    id: "q2",
    title:
      "Project Experience: Describe a challenging project you have worked on",
    description:
      "Please provide details about the project, your role, and the challenges you faced.",
    difficulty: "intermediate"
  },
  {
    id: "q3",
    title: "Technical Skills: Explain your expertise in your field",
    description:
      "This is an advanced question to assess your technical knowledge.",
    difficulty: "advanced"
  },
  {
    id: "q4",
    title: "Future Goals: What are your career aspirations?",
    description:
      "Tell us about your long-term career goals and how this role fits into your plans.",
    difficulty: "intermediate"
  },
  {
    id: "q5",
    title: "Team Collaboration: How do you handle conflicts in a team?",
    description:
      "Describe your approach to resolving conflicts and working effectively with others.",
    difficulty: "beginner"
  }
]);

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
});
</script>

<style scoped>
.task-header {
  padding: 32px 40px;
  margin-bottom: 32px;
  color: white;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
}

.task-title {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: bold;
  color: white;
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
  color: rgb(255 255 255 / 90%);
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
  border-radius: 8px;
}

.question-card .el-card__header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.question-card .el-card__body {
  padding: 16px 20px;
}

.answered-card {
  background-color: #f0f9ff;
  border-color: #67c23a;
}

.current-card {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgb(64 158 255 / 20%);
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

.status-tag {
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

.answer-section h4 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.answer-input-container {
  margin-bottom: 12px;
}

.answer-input-container .el-textarea__inner {
  font-size: 14px;
  line-height: 1.5;
  border-radius: 4px;
}

.attachments-section {
  margin-bottom: 12px;
}

.attachments-section h4 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.submit-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.submitted-answer {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.answer-content {
  min-height: 60px;
  padding: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.submitted-attachments {
  margin-bottom: 12px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.attachment-item {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 8px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.submission-info {
  margin-top: 12px;
}

.complete-task-section {
  padding: 32px 40px;
  margin-top: 32px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 16px;
}

.upload-demo {
  margin-bottom: 0;
}

.upload-demo .el-upload {
  width: 100%;
}

.upload-demo .el-upload-dragger {
  width: 100%;
  height: auto;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  transition: all 0.3s;
}

.upload-demo .el-upload-dragger:hover {
  background-color: #f5f7fa;
  border-color: #409eff;
}

.upload-demo .el-upload__tip {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.upload-dragger-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
}

.upload-icon {
  margin-bottom: 16px;
  font-size: 48px;
  color: #c0c4cc;
}

.upload-text {
  margin-bottom: 16px;
  color: #606266;
  text-align: center;
}

.upload-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.upload-text p:first-child {
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
}

.select-files-btn {
  margin-top: 0;
}

@media (width <= 768px) {
  .task-header {
    padding: 24px 20px;
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
    padding: 20px 15px;
  }

  .upload-icon {
    margin-bottom: 12px;
    font-size: 36px;
  }

  .upload-text {
    margin-bottom: 12px;
  }

  .upload-text p {
    font-size: 13px;
  }

  .upload-hint {
    font-size: 11px;
  }

  .complete-task-section {
    padding: 24px 20px;
  }
}
</style>
