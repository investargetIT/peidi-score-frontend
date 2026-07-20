<template>
  <div class="esg-survey">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <el-icon :size="32"><Tickets /></el-icon>
          </div>
          <div class="title-text">
            <h1>ESG 数据填报</h1>
            <p>填写 ESG 数据，可同时查看历史年份数据作为参考</p>
          </div>
        </div>
        <div class="year-selector">
          <el-button plain @click="handleBack">
            <el-icon style="margin-right: 4px"><Back /></el-icon>
            返回
          </el-button>
          <el-button
            :type="showReference ? 'primary' : 'default'"
            :plain="!showReference"
            @click="toggleReference"
          >
            <el-icon style="margin-right: 4px"><DataAnalysis /></el-icon>
            {{ showReference ? '关闭参考' : '参考数据' }}
          </el-button>
          <span class="label">填报年份</span>
          <el-select v-model="currentYear" placeholder="请选择年份" @change="handleYearChange" style="width: 140px">
            <el-option
              v-for="yearConfig in formConfig"
              :key="yearConfig.year"
              :label="yearConfig.year + ' 年'"
              :value="yearConfig.year"
            />
          </el-select>
          <span v-if="username" class="user-info">
            <span class="user-avatar">{{ username.charAt(0) }}</span>
            <span class="user-detail">
              <span class="user-role">填报人</span>
              <span class="user-name">{{ username }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="content-wrapper" :style="{ gridTemplateColumns: gridColumns }">
        <!-- 左侧：进度条 -->
        <div v-if="currentYearConfig && activeTab" class="progress-section">
          <div class="progress-bar-wrapper">
            <div
              v-for="(card, index) in currentTabCards"
              :key="card.cardId"
              class="progress-item"
              :class="{ active: activeCardIndex === index }"
              @click="jumpToCard(card.cardId, index)"
            >
              <div class="progress-dot"></div>
              <div class="progress-line" v-if="index < currentTabCards.length - 1"></div>
              <div class="progress-label">{{ card.cardName }}</div>
            </div>
          </div>
        </div>
        <!-- 中间：填报区 -->
        <div class="fill-section">
          <div class="section-header">
            <h3>{{ currentYear }} 年数据填报</h3>
          </div>

          <!-- TAB 栏 -->
          <el-tabs v-if="currentYearConfig" v-model="activeTab" class="survey-tabs">
            <el-tab-pane
              v-for="tab in currentYearConfig.tabs"
              :key="tab.tabId"
              :label="tab.tabName"
              :name="tab.tabId"
            >
              <!-- 卡片列表 -->
              <div class="cards-container">
                <div
                  v-for="card in tab.cards"
                  :key="card.cardId"
                  :ref="el => setCardRef(card.cardId, el)"
                  class="survey-card"
                  :data-card-id="card.cardId"
                >
                  <div class="card-title">
                    <h4>{{ card.cardName }}</h4>
                    <p v-if="card.cardDescription">{{ card.cardDescription }}</p>
                  </div>
                  <div class="card-fields">
                    <!-- 字段列表 -->
                    <div v-for="field in card.fields" :key="field.fieldId" class="field-item">
                      <div class="field-label">
                        <span>{{ field.label }}</span>
                        <el-tooltip v-if="field.description" :content="field.description" placement="top">
                          <el-icon class="desc-icon"><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                      <div class="field-input">
                        <!-- 文本类型 -->
                        <el-input
                          v-if="field.type === 'text'"
                          v-model="field.value"
                          type="textarea"
                          :rows="3"
                          :placeholder="field.example || '请输入内容'"
                        />
                        <!-- 文件类型 -->
                        <el-upload
                          v-else-if="field.type === 'file'"
                          v-model:file-list="field.fileList"
                          action="#"
                          :auto-upload="false"
                          multiple
                        >
                          <el-button type="primary">选择文件</el-button>
                          <template #tip>
                            <div class="el-upload__tip">支持多个文件上传</div>
                          </template>
                        </el-upload>
                        <!-- 混合类型 -->
                        <div v-else-if="field.type === 'mixed'" class="mixed-controls">
                          <div v-for="control in (field.controls || [])" :key="control.controlId" class="control-item">
                            <span class="control-label">{{ control.label }}</span>
                            <el-input
                              v-if="control.controlType === 'input'"
                              v-model="control.value"
                              :placeholder="control.placeholder"
                              style="flex: 1"
                            >
                              <template #suffix v-if="control.suffix">{{ control.suffix }}</template>
                            </el-input>
                            <el-select
                              v-else-if="control.controlType === 'select'"
                              v-model="control.value"
                              placeholder="请选择"
                              style="flex: 1"
                            >
                              <el-option
                                v-for="(option, idx) in (control.options || [])"
                                :key="idx"
                                :label="option"
                                :value="option"
                              />
                            </el-select>
                          </div>
                        </div>
                      </div>
                      <div v-if="field.example" class="field-example">
                        <el-tag type="info" size="small">示例：{{ field.example }}</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-empty v-else description="暂无数据，请先选择年份" />
        </div>

        <!-- 右侧：参考区 -->
        <div v-if="showReference" class="reference-section">
          <div class="section-header">
            <h3>参考数据</h3>
            <el-select v-model="referenceYear" placeholder="选择参考年份" clearable style="width: 140px">
              <el-option
                v-for="yearConfig in formConfig.filter(y => y.year !== currentYear)"
                :key="yearConfig.year"
                :label="yearConfig.year + ' 年'"
                :value="yearConfig.year"
              />
            </el-select>
          </div>
          
          <div v-if="referenceYearConfig && activeTab" class="reference-content">
            <h4 class="reference-tab-name">{{ referenceYearConfig.tabs.find(t => t.tabId === activeTab)?.tabName }}</h4>
            <div class="cards-container">
              <div
                v-for="card in (referenceYearConfig.tabs.find(t => t.tabId === activeTab)?.cards || [])"
                :key="card.cardId"
                class="survey-card reference-card"
              >
                <div class="card-title">
                  <h4>{{ card.cardName }}</h4>
                  <p v-if="card.cardDescription">{{ card.cardDescription }}</p>
                </div>
                <div class="card-fields">
                  <div v-for="field in card.fields" :key="field.fieldId" class="field-item">
                    <div class="field-label">
                      <span>{{ field.label }}</span>
                    </div>
                    <div class="field-value reference-value">
                      <!-- 文本类型 -->
                      <div v-if="field.type === 'text'" class="text-value">{{ field.value || '-' }}</div>
                      <!-- 文件类型 -->
                      <div v-else-if="field.type === 'file'" class="file-value">
                        <div v-if="field.fileList && field.fileList.length > 0">
                          <div v-for="(file, idx) in field.fileList" :key="idx" class="file-item">
                            <el-icon><Document /></el-icon>
                            <span>{{ file.name }}</span>
                          </div>
                        </div>
                        <span v-else>-</span>
                      </div>
                      <!-- 混合类型 -->
                      <div v-else-if="field.type === 'mixed'" class="mixed-controls">
                        <div v-for="control in (field.controls || [])" :key="control.controlId" class="control-item">
                          <span class="control-label">{{ control.label }}</span>
                          <span class="control-value">{{ control.value || '-' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="请选择参考年份" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, getCurrentInstance } from "vue";
import { Tickets, QuestionFilled, Document, DataAnalysis, Back } from "@element-plus/icons-vue";
import { getEsgConfigList } from "@/api/esgConfig";
import { ElMessage, ElLoading } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
// 返回首页
const handleBack = () => {
  router.push("/pdesg/home");
};

// 当前登录用户名
const username = computed(() => {
  try {
    const info = JSON.parse(localStorage.getItem("dataSource") || "{}");
    return info.username || "";
  } catch {
    return "";
  }
});

// 配置数据
const formConfig = ref([]);
// 当前选中的填报年份
const currentYear = ref("");
// 参考年份
const referenceYear = ref("");
// 是否显示参考数据栏（默认关闭，用的时候再打开）
const showReference = ref(false);
// 当前激活的 TAB
const activeTab = ref("");
// 当前激活的卡片索引
const activeCardIndex = ref(0);
// 卡片 DOM 引用映射
const cardRefs = ref(new Map());
// 存储滚动事件监听函数的引用，以便移除
const scrollHandlerRef = ref(null);
// 获取组件实例
const instance = getCurrentInstance();

// 当前年份配置
const currentYearConfig = computed(() => {
  return formConfig.value.find(y => y.year === currentYear.value);
});

// 当前 TAB 的卡片列表
const currentTabCards = computed(() => {
  if (!currentYearConfig.value || !activeTab.value) return [];
  const tab = currentYearConfig.value.tabs.find(t => t.tabId === activeTab.value);
  return tab ? tab.cards : [];
});

// 参考年份配置
const referenceYearConfig = computed(() => {
  return formConfig.value.find(y => y.year === referenceYear.value);
});

// 是否显示左侧进度条（与模板 v-if 条件一致）
const showProgress = computed(() => !!(currentYearConfig.value && activeTab.value));

// 动态计算主内容区的网格列
const gridColumns = computed(() => {
  const cols = [];
  if (showProgress.value) cols.push("200px");
  cols.push("1fr");
  if (showReference.value) cols.push("480px");
  return cols.join(" ");
});

// 获取当前激活的 tab-pane 的滚动容器
const getScrollContainer = () => {
  if (!instance?.proxy?.$el) return null;
  const surveyTabs = instance.proxy.$el.querySelector(".survey-tabs");
  if (!surveyTabs) return null;
  return surveyTabs.querySelector(".el-tab-pane:not(.is-hidden)");
};

// 设置卡片 DOM 引用
const setCardRef = (cardId, el) => {
  if (el) {
    cardRefs.value.set(cardId, el);
  } else {
    cardRefs.value.delete(cardId);
  }
};

// 跳转到指定卡片
const jumpToCard = (cardId, index) => {
  activeCardIndex.value = index;
  nextTick(() => {
    const cardEl = cardRefs.value.get(cardId);
    const scrollContainer = getScrollContainer();
    if (cardEl && scrollContainer) {
      scrollContainer.scrollTo({
        top: cardEl.offsetTop - 20,
        behavior: "smooth"
      });
    }
  });
};

// 监听滚动，更新当前激活的卡片
const handleScroll = () => {
  const scrollContainer = getScrollContainer();
  if (!scrollContainer || currentTabCards.value.length === 0) return;
  const scrollTop = scrollContainer.scrollTop;
  let currentIndex = 0;

  for (let i = 0; i < currentTabCards.value.length; i++) {
    const cardId = currentTabCards.value[i].cardId;
    const cardEl = cardRefs.value.get(cardId);
    if (cardEl && cardEl.offsetTop - 40 <= scrollTop) {
      currentIndex = i;
    }
  }

  activeCardIndex.value = currentIndex;
};

// 初始化
const init = async () => {
  const loading = ElLoading.service({
    lock: false,
    text: "加载中...",
    background: "transparent"
  });

  try {
    const res = await getEsgConfigList({
      pageNo: 1,
      pageSize: 100
    });

    if (res && res.data && res.data.records) {
      formConfig.value = res.data.records
        .filter(record => record.isDel !== 1)
        .map(record => {
          try {
            if (record.config) {
              const parsed = JSON.parse(record.config);
              // 初始化 field.value 和 field.fileList
              parsed.tabs.forEach(tab => {
                tab.cards.forEach(card => {
                  card.fields.forEach(field => {
                    if (!field.value) field.value = "";
                    if (!field.fileList) field.fileList = [];
                    if (field.type === "mixed" && field.controls) {
                      field.controls.forEach(control => {
                        if (!control.value) control.value = "";
                      });
                    }
                  });
                });
              });
              return {
                ...parsed,
                year: record.year?.toString() || parsed.year
              };
            }
          } catch (e) {
            console.error("解析配置失败", e);
          }
          return {
            year: record.year?.toString() || "",
            tabs: []
          };
        });
    }
  } catch (error) {
    console.error("加载配置失败", error);
    ElMessage.error("加载配置失败");
  } finally {
    loading.close();
  }
};

onMounted(() => {
  init();
});

// 年份变化处理
const handleYearChange = (year) => {
  if (currentYearConfig.value && currentYearConfig.value.tabs.length > 0) {
    activeTab.value = currentYearConfig.value.tabs[0].tabId;
    activeCardIndex.value = 0;
  }
  // 若参考年份与新选的填报年份相同，重新选一个不同的年份
  if (referenceYear.value === currentYear.value) {
    const other = formConfig.value.find(y => y.year !== currentYear.value);
    referenceYear.value = other ? other.year : "";
  }
};

// 切换参考数据栏的显示/隐藏
const toggleReference = () => {
  showReference.value = !showReference.value;
};

// 监听 activeTab 变化，重置 activeCardIndex 并重新绑定滚动事件
watch(activeTab, () => {
  activeCardIndex.value = 0;
  // 先移除之前的滚动监听
  const oldScrollContainer = getScrollContainer();
  if (oldScrollContainer && scrollHandlerRef.value) {
    oldScrollContainer.removeEventListener("scroll", scrollHandlerRef.value);
  }
  // 等待 DOM 更新
  nextTick(() => {
    const newScrollContainer = getScrollContainer();
    if (newScrollContainer) {
      newScrollContainer.scrollTop = 0;
      // 保存处理函数的引用
      scrollHandlerRef.value = handleScroll;
      newScrollContainer.addEventListener("scroll", scrollHandlerRef.value);
    }
  });
});

// 当组件挂载后，绑定滚动事件
onMounted(() => {
  nextTick(() => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollHandlerRef.value = handleScroll;
      scrollContainer.addEventListener("scroll", scrollHandlerRef.value);
    }
  });
});
</script>

<style lang="scss" scoped>
// 主题色变量（与 config 页面保持一致）
$primary-color: #4268F9;
$success-color: #36D399;
$warning-color: #F59E0B;
$danger-color: #f56c6c;
$border-color: #e4e7ed;
$border-light: #ebeef5;
$bg-color: #f5f7fa;
$text-color: #1f2937;
$text-secondary: #6b7280;
$text-placeholder: #9ca3af;

.esg-survey {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial,
               "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑",
               "Source Han Sans CN", "Noto Sans CJK SC", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "tnum" on, "lnum" on;
  padding-top: 24px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  // 页面头部
  .page-header {
    background: #fff;
    padding: 24px 32px;
    border-radius: 16px;
    margin: 0 24px 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    width: calc(100% - 48px);
    box-sizing: border-box;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .title-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, $primary-color 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 8px 16px -4px rgba(66, 104, 249, 0.3);
  }

  .title-text {
    h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: $text-color;
      line-height: 1.3;
    }

    p {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: $text-secondary;
    }
  }

  .year-selector {
    display: flex;
    align-items: center;
    gap: 12px;

    .label {
      font-size: 14px;
      color: $text-color;
      font-weight: 500;
    }

    .user-info {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 14px 4px 4px;
      background: rgba(66, 104, 249, 0.08);
      border: 1px solid rgba(66, 104, 249, 0.2);
      border-radius: 20px;

      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #4268f9, #2d49c9);
        border-radius: 50%;
      }

      .user-detail {
        display: flex;
        flex-direction: column;
        line-height: 1.25;

        .user-role {
          font-size: 11px;
          color: #9aa4c0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: $text-color;
        }
      }
    }
  }

  // 主内容区
  .main-content {
    padding: 0 24px 24px;
    width: 100%;
    box-sizing: border-box;
  }

  .content-wrapper {
    display: grid;
    gap: 24px;
    height: calc(100vh - 200px);
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    transition: grid-template-columns 0.3s ease;
  }

  // 进度条区域
  .progress-section {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    padding: 24px 16px;
    overflow-y: auto;
    flex-shrink: 0;

    .progress-bar-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .progress-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      cursor: pointer;
      padding: 8px 0 8px 24px;
      transition: all 0.2s;

      .progress-dot {
        position: absolute;
        left: 0;
        top: 12px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: $border-color;
        transition: all 0.2s;
        z-index: 1;
      }

      .progress-line {
        position: absolute;
        left: 5px;
        top: 24px;
        width: 2px;
        height: calc(100% - 16px);
        background: $border-color;
        z-index: 0;
      }

      .progress-label {
        font-size: 13px;
        color: $text-secondary;
        line-height: 1.5;
        transition: all 0.2s;
        overflow-wrap: break-word;
        word-break: break-word;
      }

      &.active {
        .progress-dot {
          background: $primary-color;
          transform: scale(1.2);
          box-shadow: 0 0 0 4px rgba(66, 104, 249, 0.15);
        }

        .progress-label {
          color: $primary-color;
          font-weight: 600;
        }
      }

      &:hover:not(.active) {
        .progress-dot {
          background: $text-secondary;
        }

        .progress-label {
          color: $text-color;
        }
      }
    }
  }

  // 通用区域样式
  .fill-section, .reference-section {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    padding: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-shrink: 0;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: $text-color;
      padding-left: 12px;
      border-left: 4px solid $primary-color;
    }
  }

  // 填报区样式
  .fill-section {
    .survey-tabs {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      :deep(.el-tabs__content) {
        flex: 1;
        overflow: hidden;
      }

      :deep(.el-tab-pane) {
        height: 100%;
        overflow-y: auto;
        padding-right: 8px;
      }
    }
  }

  // 参考区样式
  .reference-section {
    .reference-tab-name {
      font-size: 16px;
      font-weight: 600;
      color: $text-color;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid $border-light;
    }

    .reference-content {
      flex: 1;
      overflow-y: auto;
      padding-right: 8px;
    }
  }

  // 卡片容器
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  // 卡片样式
  .survey-card {
    background: #fff;
    border: 1px solid $border-light;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .card-title {
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid $border-light;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: $text-color;
        margin-bottom: 6px;
        overflow-wrap: break-word;
        word-break: break-word;
      }

      p {
        margin: 0;
        font-size: 13px;
        color: $text-secondary;
        overflow-wrap: break-word;
        word-break: break-word;
      }
    }

    .card-fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  .reference-card {
    background: $bg-color;
    border: 1px dashed $border-color;
  }

  // 字段项
  .field-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: $text-color;
    width: 100%;
    box-sizing: border-box;
    overflow-wrap: break-word;
    word-break: break-word;

    .desc-icon {
      color: $text-placeholder;
      font-size: 14px;
      cursor: help;
      flex-shrink: 0;
    }
  }

  .field-example {
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-top: 4px;

    :deep(.el-tag) {
      max-width: 100%;
      white-space: normal;
      word-break: break-word;
      line-height: 1.6;
      padding: 6px 10px;
      height: auto;
    }
  }

  // 混合类型控件
  .mixed-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .control-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    .control-label {
      font-size: 14px;
      color: $text-secondary;
      white-space: nowrap;
    }
  }

  // 参考值样式
  .reference-value {
    width: 100%;
    box-sizing: border-box;

    .text-value {
      padding: 10px 12px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid $border-light;
      color: $text-color;
      min-height: 60px;
      word-break: break-word;
      overflow-wrap: break-word;
      width: 100%;
      box-sizing: border-box;
    }

    .file-value {
      .file-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #fff;
        border-radius: 6px;
        margin-bottom: 8px;
        color: $text-secondary;
        font-size: 13px;
      }
    }

    .control-value {
      flex: 1;
      padding: 8px 12px;
      background: #fff;
      border-radius: 6px;
      color: $text-color;
      font-size: 14px;
    }
  }
}

// Element Plus 主题色覆盖（与 config 页面保持一致）
:deep(.el-button--primary) {
  background-color: $primary-color;
  border-color: $primary-color;
}

// 图标按钮样式优化
:deep(.el-button--small) {
  padding: 8px;
}

:deep(.el-button:not(.el-button--small)) {
  padding: 10px 12px;
}

:deep(.el-button .el-icon) {
  font-size: 14px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px $primary-color inset;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px $primary-color inset;
}
</style>
