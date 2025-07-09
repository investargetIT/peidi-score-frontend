<template>
  <div class="employee-task-container">
    <!-- 页面头部 -->
    <div class="task-header">
      <h1 class="task-title">{{ `员工任务 - ${employeeName}` }}</h1>
      <div class="task-meta">
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>截止时间: {{ formatDate(dueDate) }}</span>
        </div>
        <div class="meta-item">
          <el-tag :type="getStatusType(computedTaskStatus)" size="large">
            {{ getStatusText(computedTaskStatus) }}
          </el-tag>
        </div>
        <div class="meta-item">
          <span
            >进度: 已完成 {{ completedQuestions }}/{{ totalQuestions }} 道题目
          </span>
        </div>
      </div>
    </div>

    <!-- 完成提示 -->
    <el-alert
      v-if="computedTaskStatus === 'completed'"
      title="恭喜! 您已完成所有任务。"
      type="success"
      :closable="false"
      show-icon
      class="completion-alert"
    />

    <!-- 过期提示 -->
    <el-alert
      v-if="isTaskOverdue"
      title="任务已过期"
      description="任务已过期，无法编辑。"
      type="warning"
      :closable="false"
      show-icon
      class="overdue-alert"
    />

    <!-- 任务问题列表 -->
    <div class="questions-container">
      <!-- 空状态展示 -->
      <div v-if="shouldShowEmptyState" class="empty-state">
        <div class="empty-content">
          <el-icon class="empty-icon">
            <Calendar v-if="shouldShowEmptyState" />
            <Document v-else />
          </el-icon>
          <h3 class="empty-title">
            {{
              "此功能专供“萌新”使用，职场“大佬”们请绕行~ 您已毕业，无需回新手村啦！"
            }}
          </h3>
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
                <span class="question-number">{{ `题目${index + 1}` }}</span>
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
              <div class="answer-form">
                <div class="answer-label">
                  <label class="form-label">您的回答</label>
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
                    :disabled="isTaskOverdue"
                    class="answer-textarea"
                  />
                </div>

                <!-- 附件上传 -->
                <div class="attachments-section">
                  <div class="answer-label">
                    <label class="form-label">附件</label>
                  </div>
                  <el-upload
                    accept=".jpg,.png,.jpeg,.gif,.pdf"
                    class="upload-demo"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
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
                    :disabled="isTaskOverdue"
                    :headers="{
                      Authorization: formatToken(getToken().accessToken)
                    }"
                    :before-upload="beforeUpload"
                  >
                    <div class="upload-dragger-content">
                      <el-icon class="upload-icon">
                        <Upload />
                      </el-icon>
                      <div class="upload-text">
                        <p>拖拽文件到此处，或点击选择文件</p>
                      </div>
                      <el-button
                        type="default"
                        size="small"
                        class="select-files-btn"
                      >
                        选择文件
                      </el-button>
                    </div>
                  </el-upload>
                </div>

                <!-- 提交信息 -->
                <div
                  v-if="isQuestionAnswered(question.id)"
                  class="submission-info-card"
                >
                  <div class="submission-inline-grid">
                    <div class="submission-inline-item">
                      <p class="submission-label">提交时间:</p>
                      <p class="submission-value">
                        {{ formatDateTime(getSubmissionTime(question.id)) }}
                      </p>
                    </div>
                    <div class="submission-inline-item">
                      <p class="submission-label">审核状态:</p>
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

                <!-- 提交按钮 -->
                <div class="submit-section">
                  <el-button
                    type="primary"
                    @click="submitAnswer(question.id)"
                    :loading="submittingAnswers[question.id]"
                    :disabled="isTaskOverdue"
                    class="save-answer-btn"
                  >
                    保存答案
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
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
import { formatToken, getToken } from "@/utils/auth.ts";
import { getQaList, updateQaConfig, getQaDetail } from "@/api/task";
import { getEnumTypeList } from "@/api/pmApi.ts";
import {
  getEsgRuleDetail,
  updateEsgConfig,
  baseUrlApi,
  getFileDownLoadPath
} from "@/api/esg";

const { t } = useI18n();

// 基础数据
const taskStatus = ref("in_progress"); // 'in_progress', 'completed', 'approved', 'overdue'
const currentQuestionId = ref(null);
const completingTask = ref(false);
const uploadUrl = baseUrlApi("/qa/upload");
const { id } = storageLocal()?.getItem("dataSource") || {};
const { hired_date, name: employeeName } =
  storageLocal()?.getItem("ddUserInfo") || {};
const curQaInfo = ref({});
const validDate = ref("");
const validPeriod = ref("");
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const beforeUpload = file => {
  const isLt10M = file.size / 1024 / 1024 < 2;

  if (!isLt10M) {
    ElMessage.error("上传文件大小不超过10M");
  }
  return isLt10M;
};

const fetchDataConfig = () => {
  getQaDetail({
    userId: id
  }).then(res => {
    console.log(res);
    if (res?.code === 200) {
      curQaInfo.value = res?.data;
    }
    initializeQuestions();
  });
};
const fetchEnumTypeList = () => {
  getEnumTypeList({ type: "qaDate" }).then(res => {
    if (res?.code === 200) {
      validDate.value = res?.data?.[0]?.value || "";
    }
  });
  getEnumTypeList({ type: "qaPeriod" }).then(res => {
    if (res?.code === 200) {
      validPeriod.value = res?.data?.[0]?.value || "";
    }
  });
};

const handlePreview = file => {
  if (file.response?.code !== 200) return;
  getFileDownLoadPath({
    objectName: file.response.data
  })
    .then(res => {
      const { code, msg, data } = res;
      if (code === 200) {
        if (file.raw.type.includes("image")) {
          dialogImageUrl.value = res.data;
          dialogVisible.value = true;
        } else {
          window.open(res.data, "_blank");
        }
      } else {
        message("图片预览失败--" + msg, { type: "error" });
      }
    })
    .catch(err => {
      message("图片预览失败", { type: "error" });
    });
};

fetchDataConfig();
fetchEnumTypeList();

// 随机抽取问题的逻辑
const generateRandomQuestions = () => {
  let questionsToGenerate = [];

  // 定义每个难度级别的抽取数量
  const levelConfig = [
    { level: "Beginner", count: 3 },
    { level: "Intermediate", count: 1 },
    { level: "Advanced", count: 1 }
  ];

  // 遍历每个难度级别，按要求抽取题目
  levelConfig.forEach(({ level, count }) => {
    const availableQuestions = TaskLevelList[level];

    if (availableQuestions && availableQuestions.length > 0) {
      // 随机打乱题目顺序
      const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());

      // 抽取指定数量的题目（如果可用题目少于需要数量，则全部抽取）
      const selectedQuestions = shuffled.slice(
        0,
        Math.min(count, shuffled.length)
      );

      // 生成问题对象并添加到结果数组
      const levelQuestions = selectedQuestions.map((question, index) => ({
        id: question.key,
        title: question.text,
        difficulty: level.toLowerCase(),
        key: question.key
      }));

      questionsToGenerate.push(...levelQuestions);
    }
  });

  // 保持题目按难度级别顺序排列（初级 -> 中级 -> 高级）
  return questionsToGenerate;
};

// 初始化问题数据
const initializeQuestions = async () => {
  if (!curQaInfo.value || Object.keys(curQaInfo.value).length === 0) {
    // 当 curQaInfo 为空时，生成随机问题并进行初始化保存
    const randomQuestions = generateRandomQuestions();
    questions.value = randomQuestions;

    // 调用 submitAnswer 进行初始化保存
    try {
      await initializeSaveQuestions(randomQuestions);
    } catch (error) {
      console.error("初始化保存失败:", error);
    }
  } else {
    // 当 curQaInfo 不为空时，从中获取问题数据
    try {
      const qaData = JSON.parse(curQaInfo.value.qa || "[]");
      questions.value = qaData.map(item => ({
        id: item.questionId,
        title: item.questionTitle,
        difficulty: item.difficulty,
        key: item.questionKey
      }));

      // 恢复答案数据
      qaData.forEach(item => {
        // 检查是否有内容或附件
        const hasContent = item.content && item.content.trim().length > 0;
        const hasAttachments = item.attachments && item.attachments.length > 0;

        if (item.isAnswered && (hasContent || hasAttachments)) {
          answers.value[item.questionKey] = {
            content: item.content || "",
            attachments: item.attachments || [],
            submittedAt: item.submittedAt
              ? new Date(item.submittedAt)
              : new Date(),
            reviewStatus: item.reviewStatus || "pending",
            reviewedAt: null,
            reviewComment: null
          };

          // 回填到临时编辑数据中
          tempAnswers.value[item.questionKey] = item.content || "";
          tempAttachments.value[item.questionKey] = item.attachments || [];
        }
      });
    } catch (error) {
      console.error("解析问题数据失败:", error);
      // 如果解析失败，回退到随机生成
      questions.value = generateRandomQuestions();
    }
  }
};

// 初始化保存问题
const initializeSaveQuestions = async randomQuestions => {
  const allAnswersData = randomQuestions.map(question => ({
    questionKey: question.key,
    questionId: question.id,
    questionTitle: question.title,
    difficulty: question.difficulty,
    content: "",
    createTime: new Date().toISOString(),
    attachments: [],
    isAnswered: false,
    submittedAt: null,
    reviewStatus: "pending"
  }));

  const saveData = {
    userId: id,
    qa: JSON.stringify(allAnswersData),
    remark: JSON.stringify({
      validPeriod,
      totalQuestions: randomQuestions.length,
      completedQuestions: 0
    }),
    hasReview: false
  };

  await updateQaConfig(saveData);
};

// 问题数据
const questions = ref([]);

// 答案数据
const answers = ref({});

// 临时答案数据（编辑中）
const tempAnswers = ref({});
const tempAttachments = ref({});
const submittingAnswers = ref({});

// 计算属性
const totalQuestions = computed(() => questions.value.length);
const completedQuestions = computed(() => {
  return Object.values(answers.value).filter(answer => {
    if (!answer) return false;

    // 检查是否有内容
    const hasContent = answer.content && answer.content.trim().length > 0;

    // 检查是否有附件
    const hasAttachments = answer.attachments && answer.attachments.length > 0;

    // 有内容或有附件都算完成
    return hasContent || hasAttachments;
  }).length;
});

// 计算截止日期：validDate + validPeriod
const dueDate = computed(() => {
  if (!validDate.value || !validPeriod.value) {
    return new Date(); // 如果没有有效数据，返回当前日期
  }

  const baseDate = new Date(validDate.value);
  const periodDays = parseInt(validPeriod.value, 10);

  if (isNaN(periodDays)) {
    console.log("Invalid validPeriod, using base date");
    return baseDate; // 如果周期不是有效数字，返回基础日期
  }

  // 计算截止日期 = validDate + validPeriod天
  // const calculatedDueDate = new Date(baseDate);
  // 将hired_date时间戳转换为Date对象
  const calculatedDueDate = new Date(hired_date);
  calculatedDueDate.setDate(baseDate.getDate() + periodDays);

  return calculatedDueDate;
});

// 自动检查任务状态（是否过期）
const computedTaskStatus = computed(() => {
  const now = new Date();
  const due = dueDate.value;

  // 如果当前时间超过截止日期，且任务还未完成，则标记为过期
  if (now > due && taskStatus.value === "in_progress") {
    return "已过期";
  }

  return taskStatus.value;
});

// 日期比较逻辑
const shouldShowEmptyState = computed(() => {
  if (!hired_date || !validDate.value) {
    return false; // 如果任一日期不存在，不显示空状态
  }

  // 将hired_date时间戳转换为Date对象
  const hiredDateObj = new Date(hired_date);

  // 将validDate字符串转换为Date对象
  const validDateObj = new Date(validDate.value);

  // 比较日期：如果入职日期小于有效日期，则显示空状态
  // hireDate > qaDate， 新员工，需要填写回答
  return hiredDateObj < validDateObj;
});

// 工具函数
const formatDate = date => {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// 检查是否过期
const isTaskOverdue = computed(() => {
  return computedTaskStatus.value === "已过期";
});

const formatDateTime = date => {
  if (!date) return "";
  return new Date(date).toLocaleString("zh-CN", {
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
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级"
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
    pending: "待审核",
    approved: "已审核",
    rejected: "已驳回"
  };
  return texts[status] || status;
};

// 问题相关方法
const isQuestionAnswered = questionId => {
  const answer = answers.value[questionId];
  if (!answer) return false;

  // 检查是否有内容
  const hasContent = answer.content && answer.content.trim().length > 0;

  // 检查是否有附件
  const hasAttachments = answer.attachments && answer.attachments.length > 0;

  // 有内容或有附件都算完成
  return hasContent || hasAttachments;
};

const getAnswerStatus = questionId => {
  return answers.value[questionId]?.reviewStatus || null;
};

const getSubmissionTime = questionId => {
  return answers.value[questionId]?.submittedAt;
};

const getAttachments = questionId => {
  return tempAttachments.value[questionId] || [];
};

// 附件相关方法
const handleAttachmentSuccess = (questionId, response, file) => {
  if (!tempAttachments.value[questionId]) {
    tempAttachments.value[questionId] = [];
  }
  tempAttachments.value[questionId].push(file);
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
  submittingAnswers.value[questionId] = true;

  try {
    // 收集所有问题的答案数据
    const allAnswersData = questions.value.map(question => {
      const questionKey = question.key;
      const tempAnswer = tempAnswers.value[questionKey] || "";
      const tempAttachment = tempAttachments.value[questionKey] || [];
      const existingAnswer = answers.value[questionKey];

      return {
        questionKey: questionKey,
        questionId: question.id,
        questionTitle: question.title,
        difficulty: question.difficulty,
        content: tempAnswer || existingAnswer?.content || "",
        submittedAt: new Date().toISOString(),
        attachments:
          tempAttachment.length > 0
            ? tempAttachment
            : existingAnswer?.attachments || [],
        isAnswered: !!(
          (tempAnswer && tempAnswer.trim().length > 0) ||
          (existingAnswer?.content &&
            existingAnswer.content.trim().length > 0) ||
          (tempAttachment && tempAttachment.length > 0) ||
          (existingAnswer?.attachments && existingAnswer.attachments.length > 0)
        ),
        reviewStatus: existingAnswer?.reviewStatus || "pending"
      };
    });

    // 计算实际完成的问题数量
    const actualCompletedQuestions = allAnswersData.filter(item => {
      if (!item.isAnswered) return false;

      // 检查是否有内容
      const hasContent = item.content && item.content.trim().length > 0;

      // 检查是否有附件
      const hasAttachments = item.attachments && item.attachments.length > 0;

      // 有内容或有附件都算完成
      return hasContent || hasAttachments;
    }).length;

    // 准备保存的数据
    const saveData = {
      userId: id,
      qa: JSON.stringify(allAnswersData),
      remark: JSON.stringify({
        validPeriod: validPeriod.value,
        dueDate: formatDate(dueDate.value),
        totalQuestions: totalQuestions.value,
        completedQuestions: actualCompletedQuestions
      }),
      hasReview: false
    };

    console.log("Saving all answers data:", saveData);
    console.log(allAnswersData);

    // 调用API保存所有数据
    // await updateQaConfig(saveData);

    await updateQaConfig(saveData);

    // 更新本地答案数据
    const answerContent = tempAnswers.value[questionId] || "";
    answers.value[questionId] = {
      content: answerContent,
      attachments: tempAttachments.value[questionId] || [],
      submittedAt: new Date(),
      reviewStatus: "pending",
      reviewedAt: null,
      reviewComment: null
    };

    // 保持临时数据，不清空，让用户可以继续编辑
    // tempAnswers.value[questionId] = "";
    // tempAttachments.value[questionId] = [];

    ElMessage.success("答案保存成功");

    // 打印更新后的完成状态用于调试
    console.log(
      "Updated completed questions:",
      completedQuestions.value,
      "/",
      totalQuestions.value
    );
    if (!curQaInfo.value || Object.keys(curQaInfo.value).length === 0) {
      window.location.reload();
    }
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败，请重试");
  } finally {
    submittingAnswers.value[questionId] = false;
  }
};

// 生命周期
</script>

<style scoped>
/* 移动端适配 */
@media (width <= 768px) {
  .employee-task-container {
    padding: 20px 20px 0;
  }

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
    font-size: 12px;
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

  .save-answer-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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

.employee-task-container {
  padding: 24px 40px 0;
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

.overdue-alert {
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
  gap: 8px;
  align-items: center;
}

.question-number {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-family: Monaco, Menlo, "Ubuntu Mono", monospace;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: #374151;
  background: #f3f4f6;
  border-radius: 4px;
}

.difficulty-tag {
  display: inline-flex;
  align-items: center;
  margin-left: 0;
  line-height: 1;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  margin-left: 0;
  line-height: 1;
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

.answer-textarea :deep(.el-textarea__inner:disabled) {
  color: #9ca3af;
  cursor: not-allowed;
  background-color: #f5f5f5;
  border-color: #d1d5db;
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

.upload-demo :deep(.el-upload-dragger.is-disabled) {
  cursor: not-allowed;
  background: #f5f5f5;
  border-color: #d1d5db;
}

.upload-demo :deep(.el-upload-dragger.is-disabled):hover {
  background: #f5f5f5;
  border-color: #d1d5db;
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

.save-answer-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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

.date-info {
  padding: 12px;
  margin-top: 16px;
  background: #f9fafb;
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
}

.date-info p {
  margin: 4px 0;
  font-size: 13px;
  color: #374151;
}

.date-info strong {
  color: #1f2937;
}

/* 页面容器样式 */
</style>
