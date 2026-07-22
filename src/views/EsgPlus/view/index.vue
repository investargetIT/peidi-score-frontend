<template>
  <div class="esg-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="title-text">
            <h1>ESG 填报总览</h1>
            <p>整体查看所有填报用户的同一项数据，方便对比分析</p>
          </div>
        </div>
        <div class="action-buttons">
          <el-button :icon="Back" @click="handleBack">
            <span>返回首页</span>
          </el-button>
          <span class="label">选择年份</span>
          <el-select
            v-model="selectedYear"
            placeholder="请选择年份"
            @change="handleYearChange"
            style="width: 140px"
          >
            <el-option
              v-for="yearConfig in formConfig"
              :key="yearConfig.year"
              :label="yearConfig.year + ' 年'"
              :value="yearConfig.year"
            />
          </el-select>
          <el-button type="primary" :icon="Refresh" @click="loadUserData">
            <span>刷新数据</span>
          </el-button>
          <el-button style="background-color: #217346; border-color: #217346; color: #fff" :icon="Download" @click="handleExportExcel" :loading="exporting">
            <span>导出 Excel</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="content-wrapper" :style="{ gridTemplateColumns: gridColumns }">
        <!-- 左侧：进度条导航 -->
        <div class="progress-section">
          <div class="progress-bar-wrapper" v-if="currentYearConfig && activeTabId && userDataList.length > 0">
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

        <!-- 右侧：统一表单展示区 -->
        <div class="view-section">
          <div class="section-header">
            <h3>{{ selectedYear }} 年 ESG 填报总览</h3>
          </div>

          <!-- Tabs -->
          <el-tabs v-if="currentYearConfig" v-model="activeTabId" class="view-tabs">
            <el-tab-pane
              v-for="tab in currentYearConfig.tabs"
              :key="tab.tabId"
              :label="tab.tabName"
              :name="String(tab.tabId)"
            >
              <!-- 卡片列表 -->
              <div class="cards-container" ref="cardsContainerRef">
                <div
                  v-for="card in tab.cards"
                  :key="card.cardId"
                  :ref="el => setCardRef(card.cardId, el)"
                  class="view-card"
                >
                  <div class="card-title">
                    <h4>{{ card.cardName }}</h4>
                    <p v-if="card.cardDescription">{{ card.cardDescription }}</p>
                  </div>
                  <div class="card-fields">
                    <!-- 每个字段 -->
                    <div
                      v-for="field in card.fields"
                      :key="field.fieldId"
                      class="field-item"
                    >
                      <div class="field-label">
                        <span class="label-text">{{ field.label }}</span>
                        <span v-if="field.unit" class="field-unit"
                          >({{ field.unit }})</span
                        >
                      </div>
                      <div class="field-values-grid">
                        <!-- 每个选中用户对应一个值，只展示有数据的 -->
                        <div
                          v-for="cachedUser in getVisibleUsersWithData(
                            tab.tabId,
                            card.cardId,
                            field.fieldId
                          )"
                          :key="cachedUser.user.userId"
                          class="user-value-item"
                        >
                          <div class="user-badge">
                            <span class="avatar-mini">{{
                              (cachedUser.user.userName || "U").charAt(0)
                            }}</span>
                            <span class="user-name">{{
                              cachedUser.user.userName || `用户 ${cachedUser.user.userId}`
                            }}</span>
                          </div>
                          <!-- 普通文本输入 -->
                          <template v-if="!getCachedFieldInfo(cachedUser, tab.tabId, card.cardId, field.fieldId).hasFile">
                            <el-input
                              v-bind:value="
                                getCachedFieldValue(
                                  cachedUser,
                                  tab.tabId,
                                  card.cardId,
                                  field.fieldId
                                )
                              "
                              type="textarea"
                              :autosize="{ minRows: 1, maxRows: 999 }"
                              readonly
                              placeholder="暂无数据"
                              class="readonly-input"
                              resize="none"
                            />
                          </template>
                          <!-- 附件上传：展示附件列表 -->
                          <template v-else>
                            <div class="attachment-list">
                              <div
                                v-for="file in getCachedFieldInfo(cachedUser, tab.tabId, card.cardId, field.fieldId).fileList"
                                :key="file.uid || file.name"
                                class="attachment-item"
                              >
                                <el-icon><Document /></el-icon>
                                <a @click="handleFilePreview(file)" class="file-link">{{ file.name }}</a>
                                <el-icon
                                  class="download-icon"
                                  @click="handleFileDownload(file)"
                                  title="下载"
                                ><Download /></el-icon>
                              </div>
                            </div>
                          </template>
                        </div>
                        <!-- 如果所有人都没数据 -->
                        <div
                          v-if="
                            getVisibleUsersWithData(
                              tab.tabId,
                              card.cardId,
                              field.fieldId
                            ).length === 0
                          "
                          class="no-data-tip"
                        >
                          暂无用户填报此数据
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-empty
            v-else
            description="该年度暂无配置信息"
          />
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="图片预览"
      width="90vw"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :modal-append-to-body="false"
      custom-class="image-preview-dialog"
    >
      <div class="preview-container">
        <img v-if="previewImageUrl" :src="previewImageUrl" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { Back, Document, Refresh, Loading, Download } from "@element-plus/icons-vue";
import { ElLoading, ElMessage } from "element-plus";
import { getEsgInfo } from "@/api/esg";
import { getFileDownLoadPath } from "@/api/esg";
import { getEsgConfigList } from "@/api/esgConfig";
import type { UiEsgConfig } from "@/api/esgConfig";
import type { Response as EsgInfoResponse } from "./types";

// 预解析用户数据结构：缓存解析后的字段值
export interface CachedFieldInfo {
  value: string;
  hasFile: boolean;
  fileList: any[];
}

export interface CachedUserData {
  user: EsgInfoResponse;
  parsedContent: any;
  // 缓存 fieldKey -> value
  valueCache: Map<string, CachedFieldInfo>;
}

const router = useRouter();

// 状态
const selectedYear = ref<number | null>(null);
const formConfig = ref<UiEsgConfig[]>([]);
const loading = ref(false);
const rawUserDataList = ref<EsgInfoResponse[]>([]);
const activeTabId = ref("");
const activeCardIndex = ref(0);
const cardRefs = ref<Map<string, HTMLElement>>(new Map());
const cardsContainerRef = ref<HTMLElement | null>(null);

// 图片预览
const previewDialogVisible = ref(false);
const previewImageUrl = ref("");

// 导出状态
const exporting = ref(false);

// 导入导出函数
import { exportEsgToExcel } from './export';
import type { CachedUserData, CachedFieldInfo } from './export';

// 预解析并缓存用户数据（只在数据变化时解析一次）
const cachedUserDataList = computed(() => {
  return rawUserDataList.value
    .filter(user => user && user.userId)
    .map(user => {
      const cached: CachedUserData = {
        user,
        parsedContent: null,
        valueCache: new Map()
      };
      // 一次性解析JSON
      try {
        cached.parsedContent = JSON.parse(user.content || "{}");
      } catch (e) {
        console.error("解析content失败", e);
        cached.parsedContent = {};
      }
      return cached;
    });
});

// 当前选中年份的配置
const currentYearConfig = computed(() => {
  if (!selectedYear.value) return null;
  const yearConfig = formConfig.value.find(
    item => item.year === selectedYear.value
  );
  if (!yearConfig || !yearConfig.config) return null;
  try {
    return JSON.parse(yearConfig.config);
  } catch (e) {
    console.error("解析配置JSON失败", e);
    return null;
  }
});

// 所有用户都展示，直接返回全部缓存数据
const selectedCachedUsers = computed(() => {
  return cachedUserDataList.value;
});

// 获取所有用户数据列表
const userDataList = computed(() => {
  return cachedUserDataList.value.map(item => item.user);
});

// 获取缓存的字段信息，包含value和fileList
interface CachedFieldInfo {
  value: string;
  hasFile: boolean;
  fileList: any[];
}

// 获取缓存的字段信息，只会计算一次
const getCachedFieldInfo = (
  cachedUser: CachedUserData,
  tabId: string,
  cardId: string,
  fieldId: string
): CachedFieldInfo => {
  const cacheKey = `${tabId}_${cardId}_${fieldId}`;
  if (cachedUser.valueCache.has(cacheKey)) {
    return cachedUser.valueCache.get(cacheKey)!;
  }

  const result: CachedFieldInfo = {
    value: "",
    hasFile: false,
    fileList: []
  };

  try {
    const data = cachedUser.parsedContent;
    // 找tab
    const savedTab = data.tabs?.find((t: any) => t.tabId === tabId);
    if (!savedTab) {
      cachedUser.valueCache.set(cacheKey, result);
      return result;
    }
    // 找card
    const savedCard = savedTab.cards?.find((c: any) => c.cardId === cardId);
    if (!savedCard) {
      cachedUser.valueCache.set(cacheKey, result);
      return result;
    }
    // 找field
    const savedField = savedCard.fields?.find(
      (f: any) => f.fieldId === fieldId
    );
    if (savedField === undefined) {
      cachedUser.valueCache.set(cacheKey, result);
      return result;
    }
    result.value = savedField.value ?? "";
    // 检查是否有附件
    if (savedField.type === "file" && Array.isArray(savedField.fileList) && savedField.fileList.length > 0) {
      result.hasFile = true;
      result.fileList = savedField.fileList;
    }
    cachedUser.valueCache.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error("获取字段信息失败", e);
    cachedUser.valueCache.set(cacheKey, result);
    return result;
  }
};

// 判断字段是否有数据（value 或 file 都算）
const hasFieldData = (info: CachedFieldInfo): boolean => {
  return !!info.value || info.hasFile;
};

// 获取纯文本值（兼容旧代码）
const getCachedFieldValue = (
  cachedUser: CachedUserData,
  tabId: string,
  cardId: string,
  fieldId: string
): string => {
  return getCachedFieldInfo(cachedUser, tabId, cardId, fieldId).value;
};

// 获取有数据的用户列表 - 使用缓存，计算一次（value或附件都算有数据）
const getVisibleUsersWithData = (
  tabId: string,
  cardId: string,
  fieldId: string
) => {
  return selectedCachedUsers.value.filter(cachedUser => {
    const info = getCachedFieldInfo(cachedUser, tabId, cardId, fieldId);
    return hasFieldData(info);
  });
};

// 返回首页
const handleBack = () => {
  router.push("/pdesg/home");
};

// 加载配置和数据
const init = async () => {
  const loadingInstance = ElLoading.service({
    lock: false,
    text: "加载中...",
    background: "transparent"
  });

  loading.value = true;
  try {
    // 先加载配置
    const res = await getEsgConfigList({
      pageNo: 1,
      pageSize: 100
    });

    if (res.success && res.data?.records) {
      formConfig.value = res.data.records
        .filter((record: UiEsgConfig) => record.isDel !== 1)
        .sort(
          (a: UiEsgConfig, b: UiEsgConfig) => (b.year || 0) - (a.year || 0)
        );

      // 默认选中最新年份
      if (formConfig.value.length > 0 && !selectedYear.value) {
        selectedYear.value = formConfig.value[0].year || null;
      }

      // 加载用户数据
      await loadUserData();
    }
  } catch (err) {
    console.error("加载失败", err);
    ElMessage.error("加载失败");
  } finally {
    loadingInstance.close();
    loading.value = false;
  }
};

// 加载用户填报数据
const loadUserData = async () => {
  if (!selectedYear.value) return;

  try {
    const params = {
      type: String(selectedYear.value),
      year: String(selectedYear.value)
    };

    const res = await getEsgInfo(params);
    if (res.success && Array.isArray(res.data)) {
      rawUserDataList.value = res.data;
    } else if (Array.isArray(res)) {
      // 如果直接返回数组
      rawUserDataList.value = res;
    }
  } catch (err) {
    console.error("加载用户数据失败", err);
    ElMessage.error("加载数据失败");
  }
};

// 年份切换
const handleYearChange = () => {
  loadUserData();
};

// 监听年份变化，设置第一个tab
watch(currentYearConfig, newVal => {
  if (newVal?.tabs?.length > 0) {
    activeTabId.value = String(newVal.tabs[0].tabId);
  }
});

// 监听 activeTab 变化，重置 activeCardIndex
watch(activeTabId, () => {
  activeCardIndex.value = 0;
  // 清空旧卡片引用，重新绑定
  cardRefs.value.clear();
  // 滚动到容器顶部
  const container = getScrollContainer();
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  // 重新绑定滚动监听
  setTimeout(() => {
    const container = getScrollContainer();
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
  }, 300);
});

// 判断是否是图片
const isImageFile = (fileName: string): boolean => {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExts.some(ext => fileName.toLowerCase().endsWith(ext));
};

// 处理文件预览
const handleFilePreview = async (file: any) => {
  if (!file.url) {
    ElMessage.error('文件路径不存在');
    return;
  }

  if (!isImageFile(file.name)) {
    ElMessage.info('该文件类型不支持预览，请点击下载按钮下载查看');
    return;
  }

  try {
    const res = await getFileDownLoadPath({
      objectName: file.url
    });
    if (res.success && res.data) {
      previewImageUrl.value = res.data;
      previewDialogVisible.value = true;
    } else {
      ElMessage.error(res.msg || '获取预览链接失败');
    }
  } catch (error) {
    console.error('获取预览链接失败', error);
    ElMessage.error('获取预览链接失败，请重试');
  }
};

// 处理文件下载
const handleFileDownload = async (file: any) => {
  if (!file.url) {
    ElMessage.error('文件路径不存在');
    return;
  }

  try {
    const res = await getFileDownLoadPath({
      objectName: file.url
    });
    if (res.success && res.data) {
      // 新窗口打开下载链接
      window.open(res.data, '_blank');
    } else {
      ElMessage.error(res.msg || '获取下载链接失败');
    }
  } catch (error) {
    console.error('获取下载链接失败', error);
    ElMessage.error('获取下载链接失败，请重试');
  }
};

// 获取当前Tab下的所有卡片
const currentTabCards = computed(() => {
  if (!currentYearConfig.value || !activeTabId.value) return [];
  const currentTab = currentYearConfig.value.tabs.find(
    (t: any) => String(t.tabId) === activeTabId.value
  );
  if (!currentTab || !currentTab.cards) return [];
  return currentTab.cards;
});

// 始终保持左右布局，左侧固定 200px
// 动态计算主内容区的网格列
const gridColumns = computed(() => {
  return ["200px", "1fr"].join(" ");
});

// 存储滚动事件监听函数的引用，以便移除
const scrollHandlerRef = ref<((() => void) | null)>(null);

// 设置卡片 DOM 引用
const setCardRef = (cardId: string, el: any) => {
  if (el) {
    cardRefs.value.set(cardId, el);
  } else {
    cardRefs.value.delete(cardId);
  }
};

// 获取当前激活的 tab-pane 的滚动容器（和 survey 保持一致）
const getScrollContainer = () => {
  // document 查找最稳妥
  const viewTabs = document.querySelector('.view-tabs');
  if (!viewTabs) return null;

  // 获取所有 tab-pane，找到第一个可见的（就是当前激活的）
  const tabPanes = viewTabs.querySelectorAll('.el-tab-pane');
  if (tabPanes.length === 0) return null;

  // 优先找 is-active，找不到就找第一个可见的
  for (let pane of tabPanes) {
    if (pane.classList.contains('is-active')) {
      return pane;
    }
    // 检查display是否不是none
    const style = window.getComputedStyle(pane);
    if (style.display !== 'none') {
      return pane;
    }
  }

  // 兜底：返回第一个tabPane
  return tabPanes[0];
};

// 跳转到指定卡片
const jumpToCard = (cardId: string, index: number) => {
  activeCardIndex.value = index;
  setTimeout(() => {
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

// 监听 activeTab 变化，重置 activeCardIndex 并重新绑定滚动事件
watch(activeTabId, () => {
  activeCardIndex.value = 0;
  // 清空旧卡片引用，重新绑定新TAB卡片引用
  cardRefs.value.clear();
  // 先移除之前的滚动监听
  const oldScrollContainer = getScrollContainer();
  if (oldScrollContainer && scrollHandlerRef.value) {
    oldScrollContainer.removeEventListener("scroll", scrollHandlerRef.value);
  }
  // 等待足够时间让 DOM 完全更新，新卡片ref全部绑定完成
  setTimeout(() => {
    const newScrollContainer = getScrollContainer();
    if (newScrollContainer) {
      newScrollContainer.scrollTop = 0;
      // 保存处理函数的引用
      scrollHandlerRef.value = handleScroll;
      newScrollContainer.addEventListener("scroll", scrollHandlerRef.value);
    }
  }, 300);
});

// 当组件挂载后，绑定滚动事件
onMounted(() => {
  init();
  // 延迟绑定，等待所有数据和DOM都渲染完成
  setTimeout(() => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollHandlerRef.value = handleScroll;
      scrollContainer.addEventListener("scroll", scrollHandlerRef.value);
    }
  }, 500);
});

// 导出 Excel
const handleExportExcel = async () => {
  exporting.value = true;
  try {
    await exportEsgToExcel(
      selectedYear.value,
      currentYearConfig.value,
      cachedUserDataList.value,
      getCachedFieldInfo
    );
  } finally {
    exporting.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
