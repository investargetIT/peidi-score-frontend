<template>
  <div>
    <div class="employee-task-container">
      <!-- 页面头部 -->
      <div class="task-header">
        <h1 class="task-title">{{ `员工任务 - ${employeeName}` }}</h1>
        <div class="task-meta" v-if="!shouldShowEmptyState">
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>截止时间: {{ formatDate(dueDate) }}</span>
          </div>
          <div class="meta-item">
            <el-tag :type="getStatusType(computedTaskStatus)" size="large">
              {{ getStatusText(computedTaskStatus) }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 完成提示 -->
      <el-alert
        v-if="isAllQuestionsCompleted"
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

      <div style="margin-bottom: 25px">
        <div class="question-card">
          <el-card
            :class="{
              'answered-card': true,
              'current-card': true
            }"
            shadow="hover"
          >
            <template #header>
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ `信息完善` }}</span>
                </div>
                <el-icon
                  v-if="educationAnswer"
                  color="#67C23A"
                  size="20"
                  class="completed-icon"
                >
                  <Check />
                </el-icon>
              </div>
              <p class="question-title">完善学历信息，奖励学历积分</p>
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
                    <el-select
                      v-model="educationAnswer"
                      placeholder="请选择您的学历"
                      style="width: 240px"
                      :disabled="isTaskOverdue"
                      @change="handleEducationChange"
                    >
                      <el-option
                        v-for="item in validEducation"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 任务问题列表 -->
      <div class="questions-container">
        <!-- 难度级别统计卡片 -->
        <div class="difficulty-stats-cards" v-if="!shouldShowEmptyState">
          <div class="stats-card beginner-card">
            <div class="stats-header">
              <div class="stats-icon">
                <el-icon size="24"><Trophy /></el-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-title">初级题目</h3>
                <div class="stats-meta">
                  <el-tag type="success" size="small">简单</el-tag>
                </div>
              </div>
            </div>
            <div class="stats-content">
              <div class="stats-number">
                {{ beginnerStats.completed }}/{{ beginnerStats.total }}
              </div>
              <div class="stats-description">
                已完成 {{ beginnerStats.completed }} 道，共
                {{ beginnerStats.total }} 道
              </div>
            </div>
            <div class="stats-progress">
              <el-progress
                :percentage="beginnerStats.percentage"
                :stroke-width="6"
                :show-text="false"
                color="#67C23A"
              />
            </div>
            <!-- 题目列表 -->
            <div class="question-list">
              <div
                v-for="(question, index) in beginnerQuestions"
                :key="question.id"
                class="question-item"
                :class="{ completed: isQuestionAnswered(question.id) }"
              >
                <div class="question-item-header">
                  <span class="question-index">{{ index + 1 }}</span>
                  <span class="question-title-short">{{ question.title }}</span>
                  <el-icon
                    v-if="isQuestionAnswered(question.id)"
                    class="completed-icon"
                    color="#67C23A"
                    size="16"
                  >
                    <Check />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="stats-card intermediate-card">
            <div class="stats-header">
              <div class="stats-icon">
                <el-icon size="24"><Star /></el-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-title">中级题目</h3>
                <div class="stats-meta">
                  <el-tag type="warning" size="small">中等</el-tag>
                </div>
              </div>
            </div>
            <div class="stats-content">
              <div class="stats-number">
                {{ intermediateStats.completed }}/{{ intermediateStats.total }}
              </div>
              <div class="stats-description">
                已完成 {{ intermediateStats.completed }} 道，共
                {{ intermediateStats.total }} 道
              </div>
            </div>
            <div class="stats-progress">
              <el-progress
                :percentage="intermediateStats.percentage"
                :stroke-width="6"
                :show-text="false"
                color="#E6A23C"
              />
            </div>
            <!-- 题目列表 -->
            <div class="question-list">
              <div
                v-for="(question, index) in intermediateQuestions"
                :key="question.id"
                class="question-item"
                :class="{ completed: isQuestionAnswered(question.id) }"
              >
                <div class="question-item-header">
                  <span class="question-index">{{ index + 1 }}</span>
                  <span class="question-title-short">{{ question.title }}</span>
                  <el-icon
                    v-if="isQuestionAnswered(question.id)"
                    class="completed-icon"
                    color="#E6A23C"
                    size="16"
                  >
                    <Check />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="stats-card advanced-card">
            <div class="stats-header">
              <div class="stats-icon">
                <el-icon size="24"><Medal /></el-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-title">高级题目</h3>
                <div class="stats-meta">
                  <el-tag type="danger" size="small">困难</el-tag>
                </div>
              </div>
            </div>
            <div class="stats-content">
              <div class="stats-number">
                {{ advancedStats.completed }}/{{ advancedStats.total }}
              </div>
              <div class="stats-description">
                已完成 {{ advancedStats.completed }} 道，共
                {{ advancedStats.total }} 道
              </div>
            </div>
            <div class="stats-progress">
              <el-progress
                :percentage="advancedStats.percentage"
                :stroke-width="6"
                :show-text="false"
                color="#F56C6C"
              />
            </div>
            <!-- 题目列表 -->
            <div class="question-list">
              <div
                v-for="(question, index) in advancedQuestions"
                :key="question.id"
                class="question-item"
                :class="{ completed: isQuestionAnswered(question.id) }"
              >
                <div class="question-item-header">
                  <span class="question-index">{{ index + 1 }}</span>
                  <span class="question-title-short">{{ question.title }}</span>
                  <el-icon
                    v-if="isQuestionAnswered(question.id)"
                    class="completed-icon"
                    color="#F56C6C"
                    size="16"
                  >
                    <Check />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                      placeholder="你的回答"
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
                          {{
                            getAnswerStatusText(getAnswerStatus(question.id))
                          }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Calendar,
  Check,
  Upload,
  Paperclip,
  Document,
  Trophy,
  Star,
  Medal
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
const taskStatus = ref("进行中"); // '进行中', '已完成', '已审核', '已过期'
const currentQuestionId = ref(null);
const completingTask = ref(false);
const uploadUrl = baseUrlApi("/qa/upload");
const { id } = storageLocal()?.getItem("dataSource") || {};
const { hired_date, name: employeeName } =
  storageLocal()?.getItem("ddUserInfo") || {};
const curQaInfo = ref({});
const validDate = ref("");
const validPeriod = ref("");
const validEducation = ref("");
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const educationAnswer = ref("");

const beforeUpload = file => {
  const isLt10M = file.size / 1024 / 1024 < 2;

  if (!isLt10M) {
    ElMessage.error("上传文件大小不超过10M");
  }
  return isLt10M;
};

const fetchDataConfig = () => {
  return getQaDetail({
    userId: id
  }).then(res => {
    console.log(res);
    if (res?.code === 200) {
      curQaInfo.value = res?.data;
      educationAnswer.value = res?.data?.education || "";
    }
    initializeQuestions();
  });
};

const fetchEnumTypeList = async () => {
  try {
    // 并行获取三个配置
    const [dateRes, periodRes, educationRes] = await Promise.all([
      getEnumTypeList({ type: "qaDate" }),
      getEnumTypeList({ type: "qaPeriod" }),
      getEnumTypeList({ type: "education" })
    ]);

    if (dateRes?.code === 200) {
      validDate.value = dateRes?.data?.[0]?.value || "";
    }

    if (periodRes?.code === 200) {
      validPeriod.value = periodRes?.data?.[0]?.value || "";
    }

    if (educationRes?.code === 200) {
      console.log("educationRes", educationRes);
      validEducation.value = educationRes?.data || "";
    }
  } catch (error) {
    console.error("获取配置数据失败:", error);
    throw error;
  }
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

// 初始化逻辑：先获取配置数据，再根据shouldShowEmptyState决定是否获取问答数据
const initializeApp = async () => {
  try {
    // 首先获取配置数据（validDate 和 validPeriod）
    await fetchEnumTypeList();

    // 等待一个tick确保响应式数据更新完成
    await nextTick();

    // 检查是否需要显示空状态
    if (!shouldShowEmptyState.value) {
      // 只有在不显示空状态时才获取问答数据
      await fetchDataConfig();
    } else {
      console.log("显示空状态，跳过问答数据获取");
    }
  } catch (error) {
    console.error("初始化失败:", error);
    ElMessage.error("页面初始化失败，请刷新重试");
  }
};

// 启动初始化
initializeApp();

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
    hasReview: false,
    education: educationAnswer.value || ""
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

// 难度级别统计
const beginnerStats = computed(() => {
  const beginnerQuestions = questions.value.filter(
    q => q.difficulty === "beginner"
  );
  const completedBeginner = beginnerQuestions.filter(q =>
    isQuestionAnswered(q.id)
  ).length;
  const total = beginnerQuestions.length;
  return {
    total,
    completed: completedBeginner,
    percentage: total > 0 ? Math.round((completedBeginner / total) * 100) : 0
  };
});

const intermediateStats = computed(() => {
  const intermediateQuestions = questions.value.filter(
    q => q.difficulty === "intermediate"
  );
  const completedIntermediate = intermediateQuestions.filter(q =>
    isQuestionAnswered(q.id)
  ).length;
  const total = intermediateQuestions.length;
  return {
    total,
    completed: completedIntermediate,
    percentage:
      total > 0 ? Math.round((completedIntermediate / total) * 100) : 0
  };
});

const advancedStats = computed(() => {
  const advancedQuestions = questions.value.filter(
    q => q.difficulty === "advanced"
  );
  const completedAdvanced = advancedQuestions.filter(q =>
    isQuestionAnswered(q.id)
  ).length;
  const total = advancedQuestions.length;
  return {
    total,
    completed: completedAdvanced,
    percentage: total > 0 ? Math.round((completedAdvanced / total) * 100) : 0
  };
});

// 按难度级别分组的题目列表
const beginnerQuestions = computed(() => {
  return questions.value.filter(q => q.difficulty === "beginner");
});

const intermediateQuestions = computed(() => {
  return questions.value.filter(q => q.difficulty === "intermediate");
});

const advancedQuestions = computed(() => {
  return questions.value.filter(q => q.difficulty === "advanced");
});

// 计算截止日期：hired_date + validPeriod
const dueDate = computed(() => {
  if (!hired_date || !validPeriod.value) {
    return new Date(); // 如果没有有效数据，返回当前日期
  }

  // 将hired_date时间戳转换为Date对象
  // 检查是否为秒级时间戳（长度为10位），如果是则转换为毫秒
  let hiredTimestamp = hired_date;

  // 确保时间戳是数字类型
  if (typeof hiredTimestamp === "string") {
    hiredTimestamp = parseInt(hiredTimestamp, 10);
  }

  // 检查是否为秒级时间戳（长度为10位），如果是则转换为毫秒
  if (hiredTimestamp.toString().length === 10) {
    hiredTimestamp = hiredTimestamp * 1000;
  }

  const hiredDateObj = new Date(hiredTimestamp);
  const periodDays = parseInt(validPeriod.value, 10);

  if (isNaN(periodDays)) {
    console.log("Invalid validPeriod, using hired date");
    return hiredDateObj; // 如果周期不是有效数字，返回入职日期
  }

  // 检查日期对象是否有效
  if (isNaN(hiredDateObj.getTime())) {
    console.error("Invalid hired date object:", hiredDateObj);
    return new Date(); // 如果入职日期无效，返回当前日期
  }

  // 计算截止日期 = hired_date + validPeriod天
  const calculatedDueDate = new Date(hiredDateObj);
  // 使用 setTime() 方法添加毫秒数，避免 setDate() 的问题
  calculatedDueDate.setTime(
    calculatedDueDate.getTime() + periodDays * 24 * 60 * 60 * 1000
  );

  console.log("hired_date:", hired_date);
  console.log("处理后 hiredTimestamp:", hiredTimestamp);
  console.log("hiredDateObj:", hiredDateObj);
  console.log("periodDays:", periodDays, "天");
  console.log("添加的毫秒数:", periodDays * 24 * 60 * 60 * 1000);
  console.log("calculatedDueDate:", calculatedDueDate);

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

  if (
    totalQuestions.value > 0 &&
    completedQuestions.value === totalQuestions.value
  ) {
    taskStatus.value = "已完成";
  }

  return taskStatus.value;
});

// 日期比较逻辑
const shouldShowEmptyState = computed(() => {
  console.log("hired_date", hired_date);
  console.log("validDate.value", validDate.value);
  if (!hired_date || !validDate.value) {
    return false; // 如果任一日期不存在，不显示空状态
  }

  // 将hired_date时间戳转换为Date对象
  // 检查是否为秒级时间戳（长度为10位），如果是则转换为毫秒
  let hiredTimestamp = hired_date;

  // 确保时间戳是数字类型
  if (typeof hiredTimestamp === "string") {
    hiredTimestamp = parseInt(hiredTimestamp, 10);
  }

  // 检查是否为秒级时间戳（长度为10位），如果是则转换为毫秒
  if (hiredTimestamp.toString().length === 10) {
    hiredTimestamp = hiredTimestamp * 1000;
  }

  const hiredDateObj = new Date(hiredTimestamp);

  // 将validDate字符串转换为Date对象
  const validDateObj = new Date(validDate.value);

  console.log("原始 hired_date:", hired_date, "类型:", typeof hired_date);
  console.log(
    "处理后 hiredTimestamp:",
    hiredTimestamp,
    "类型:",
    typeof hiredTimestamp
  );
  console.log("hiredDateObj:", hiredDateObj);
  console.log("validDateObj:", validDateObj);
  console.log("hiredDateObj.getTime():", hiredDateObj.getTime());
  console.log("validDateObj.getTime():", validDateObj.getTime());
  console.log("hiredDateObj < validDateObj:", hiredDateObj < validDateObj);

  // 检查日期对象是否有效
  if (isNaN(hiredDateObj.getTime()) || isNaN(validDateObj.getTime())) {
    console.error("Invalid date objects:", { hiredDateObj, validDateObj });
    return false;
  }

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

// 检查是否所有问题都已完成
const isAllQuestionsCompleted = computed(() => {
  return (
    totalQuestions.value > 0 &&
    completedQuestions.value === totalQuestions.value
  );
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
      hasReview: false,
      education: educationAnswer.value
    };

    console.log("Saving all answers data:", saveData);
    console.log(allAnswersData);

    // 调用API保存所有数据
    await updateQaConfig(saveData);

    // 更新所有问题的本地答案数据，确保统计卡片能够正确更新
    allAnswersData.forEach(item => {
      const questionKey = item.questionKey;
      const hasContent = item.content && item.content.trim().length > 0;
      const hasAttachments = item.attachments && item.attachments.length > 0;

      if (hasContent || hasAttachments) {
        // 更新answers数据，用于统计卡片计算
        answers.value[questionKey] = {
          content: item.content,
          attachments: item.attachments,
          submittedAt: new Date(item.submittedAt),
          reviewStatus: item.reviewStatus,
          reviewedAt: null,
          reviewComment: null
        };
      } else {
        // 如果没有内容和附件，则清除答案数据
        delete answers.value[questionKey];
      }
    });

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
    console.log("Updated difficulty stats:", {
      beginner: beginnerStats.value,
      intermediate: intermediateStats.value,
      advanced: advancedStats.value
    });

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

const handleEducationChange = () => {
  updateQaConfig({
    userId: id,
    education: educationAnswer.value
  });
};

// 生命周期
</script>

<style scoped>
/* 移动端适配 */
@media screen and (width <= 768px) {
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

  .difficulty-stats-cards {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    margin-bottom: 24px !important;
  }

  .stats-card {
    flex: none !important;
    width: 100% !important;
    padding: 16px;
  }

  .stats-header {
    gap: 8px;
    margin-bottom: 12px;
  }

  .stats-icon {
    width: 40px;
    height: 40px;
  }

  .stats-title {
    font-size: 14px;
  }

  .stats-number {
    font-size: 24px;
  }

  .stats-description {
    font-size: 12px;
  }

  .question-list {
    padding-top: 12px;
    margin-top: 12px;
  }

  .question-item {
    padding: 6px 8px;
    margin-bottom: 6px;
  }

  .question-index {
    width: 18px;
    height: 18px;
    font-size: 11px;
  }

  .question-title-short {
    font-size: 12px;
  }
}

/* 额外的移动端适配 - 平板和小屏幕 */
@media screen and (width <= 1024px) {
  .difficulty-stats-cards {
    flex-direction: column !important;
    gap: 16px !important;
  }

  .stats-card {
    flex: none !important;
    width: 100% !important;
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

.completion-alert {
  margin-bottom: 32px;
}

.overdue-alert {
  margin-bottom: 32px;
}

/* 难度级别统计卡片样式 */
.difficulty-stats-cards {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.stats-card {
  flex: 1;
  min-width: 0;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stats-card:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.beginner-card {
  border-left: 4px solid #67c23a;
}

.intermediate-card {
  border-left: 4px solid #e6a23c;
}

.advanced-card {
  border-left: 4px solid #f56c6c;
}

.stats-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.stats-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.beginner-card .stats-icon {
  color: #67c23a;
  background: rgb(103 194 58 / 10%);
}

.intermediate-card .stats-icon {
  color: #e6a23c;
  background: rgb(230 162 60 / 10%);
}

.advanced-card .stats-icon {
  color: #f56c6c;
  background: rgb(245 108 108 / 10%);
}

.stats-info {
  flex: 1;
}

.stats-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.stats-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stats-content {
  margin-bottom: 16px;
}

.stats-number {
  margin-bottom: 4px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stats-description {
  font-size: 14px;
  color: #6b7280;
}

.stats-progress {
  margin-top: 12px;
}

/* 题目列表样式 */
.question-list {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.question-item {
  min-height: 40px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #fafafa;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.question-item:hover {
  background: #f5f5f5;
}

.question-item.completed {
  background: rgb(103 194 58 / 8%);
  border-left: 3px solid #67c23a;
}

.beginner-card .question-item.completed {
  background: rgb(103 194 58 / 8%);
  border-left: 3px solid #67c23a;
}

.intermediate-card .question-item.completed {
  background: rgb(230 162 60 / 8%);
  border-left: 3px solid #e6a23c;
}

.advanced-card .question-item.completed {
  background: rgb(245 108 108 / 8%);
  border-left: 3px solid #f56c6c;
}

.question-item-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.question-index {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  background: #e5e7eb;
  border-radius: 50%;
}

.question-item.completed .question-index {
  color: #fff;
  background: #67c23a;
}

.intermediate-card .question-item.completed .question-index {
  background: #e6a23c;
}

.advanced-card .question-item.completed .question-index {
  background: #f56c6c;
}

.question-title-short {
  flex: 1;
  font-size: 13px;
  line-height: 1.4;
  color: #374151;
  word-break: break-all;
  word-wrap: break-word;
}

.question-item.completed .question-title-short {
  color: #059669;
}

.intermediate-card .question-item.completed .question-title-short {
  color: #d97706;
}

.advanced-card .question-item.completed .question-title-short {
  color: #dc2626;
}

.question-item .completed-icon {
  flex-shrink: 0;
  margin-top: 2px;
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
