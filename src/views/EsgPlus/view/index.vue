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
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <el-row :gutter="16">
        <!-- 左侧：用户选择 -->
        <el-col :xs="24" :md="6" :lg="5">
          <div class="user-panel">
            <div class="panel-header">
              <h3>已填报用户 ({{ userDataList.length }})</h3>
              <div class="header-actions">
                <el-button size="small" text @click="selectAll">
                  全选
                </el-button>
                <el-button size="small" text @click="clearSelection">
                  清空
                </el-button>
              </div>
            </div>
            <div class="user-list">
              <label
                v-for="item in userDataList"
                :key="item.userId"
                class="user-item"
                :class="{ active: selectedUserIds.includes(item.userId!) }"
              >
                <el-checkbox
                  :model-value="selectedUserIds.includes(item.userId!)"
                  @change="toggleUser(item.userId!)"
                />
                <div class="user-avatar">
                  {{ (item.userName || "U").charAt(0) }}
                </div>
                <div class="user-info">
                  <div class="user-name">
                    {{ item.userName || `用户 ${item.userId}` }}
                  </div>
                </div>
              </label>
            </div>

            <!-- 统计信息 -->
            <div class="stats-info">
              <div class="stat-row">
                <span class="stat-label">已选择：</span>
                <span class="stat-value"
                  >{{ selectedUserIds.length }} /
                  {{ userDataList.length }}</span
                >
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：统一表单展示，每个字段显示所有选中用户的数据 -->
        <el-col :xs="24" :md="18" :lg="19">
          <div class="content-panel">
            <div v-if="!selectedYear" class="empty-state">
              <el-icon :size="64"><Document /></el-icon>
              <p>请先选择年份查看填报数据</p>
            </div>
            <div v-else-if="userDataList.length === 0" class="empty-state">
              <el-icon :size="64"><Document /></el-icon>
              <p>该年度暂无填报数据</p>
            </div>
            <div v-else-if="selectedUserIds.length === 0" class="empty-state">
              <el-icon :size="64"><Document /></el-icon>
              <p>请在左侧选择要查看的用户</p>
            </div>
            <div v-else>
              <div v-if="!currentYearConfig" class="no-config">
                <el-alert title="该年度暂无配置信息" type="warning" />
              </div>
              <div v-else>
                <!-- 按配置结构渲染一份表单 -->
                <el-tabs v-model="activeTabId" type="border-card">
                  <el-tab-pane
                    v-for="tab in currentYearConfig.tabs"
                    :key="tab.tabId"
                    :label="tab.tabName"
                    :name="String(tab.tabId)"
                  >
                    <div class="cards-container">
                      <el-card
                        v-for="card in tab.cards"
                        :key="card.cardId"
                        class="form-card"
                        shadow="hover"
                      >
                        <template #header>
                          <div class="card-header">
                            <span>{{ card.cardName }}</span>
                            <span
                              v-if="card.cardDescription"
                              class="card-description"
                              >{{ card.cardDescription }}</span
                            >
                          </div>
                        </template>
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
                                v-for="user in getVisibleUsersWithData(
                                  getSelectedUserData(),
                                  tab.tabId,
                                  card.cardId,
                                  field.fieldId
                                )"
                                :key="user.userId"
                                class="user-value-item"
                              >
                                <div class="user-badge">
                                  <span class="avatar-mini">{{
                                    (user.userName || "U").charAt(0)
                                  }}</span>
                                  <span class="user-name">{{
                                    user.userName || `用户 ${user.userId}`
                                  }}</span>
                                </div>
                                <el-input
                                  :value="
                                    getFieldValue(
                                      user.content || '{}',
                                      tab.tabId,
                                      card.cardId,
                                      field.fieldId
                                    )
                                  "
                                  readonly
                                  placeholder="暂无数据"
                                  class="readonly-input"
                                />
                              </div>
                              <!-- 如果所有人都没数据 -->
                              <div
                                v-if="
                                  getVisibleUsersWithData(
                                    getSelectedUserData(),
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
                      </el-card>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { Back, Document, Refresh, Loading } from "@element-plus/icons-vue";
import { ElLoading, ElMessage } from "element-plus";
import { getEsgInfo } from "@/api/esg";
import { getEsgConfigList } from "@/api/esgConfig";
import type { UiEsgConfig } from "@/api/esgConfig";
import type { Response as EsgInfoResponse } from "./types";

const router = useRouter();

// 状态
const selectedYear = ref<number | null>(null);
const formConfig = ref<UiEsgConfig[]>([]);
const loading = ref(false);
const userDataList = ref<EsgInfoResponse[]>([]);
const selectedUserIds = ref<string[]>([]);
const activeTabId = ref("");

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

// 获取选中用户的数据
const getSelectedUserData = () => {
  return userDataList.value.filter(
    user => user && user.userId && selectedUserIds.value.includes(user.userId)
  );
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

  selectedUserIds.value = [];

  try {
    const params = {
      type: String(selectedYear.value),
      year: String(selectedYear.value)
    };

    const res = await getEsgInfo(params);
    if (res.success && Array.isArray(res.data)) {
      userDataList.value = res.data;
    } else if (Array.isArray(res)) {
      // 如果直接返回数组
      userDataList.value = res;
    }

    // 默认全选所有用户
    if (userDataList.value.length > 0) {
      selectedUserIds.value = userDataList.value
        .filter(item => item.userId)
        .map(item => item.userId!);
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

// 切换用户选择
const toggleUser = (userId: string) => {
  const index = selectedUserIds.value.indexOf(userId);
  if (index > -1) {
    selectedUserIds.value.splice(index, 1);
  } else {
    selectedUserIds.value.push(userId);
  }
};

// 全选
const selectAll = () => {
  selectedUserIds.value = userDataList.value
    .filter(item => item.userId)
    .map(item => item.userId!);
};

// 清空
const clearSelection = () => {
  selectedUserIds.value = [];
};

// 获取字段值 - 实际存储结构: { tabs: [ { tabId, cards: [ { cardId, fields: [ { fieldId, value } ] } ] } ] }
const getFieldValue = (
  content: string,
  tabId: string,
  cardId: string,
  fieldId: string
): string => {
  try {
    const data = JSON.parse(content);
    // 找tab
    const savedTab = data.tabs?.find((t: any) => t.tabId === tabId);
    if (!savedTab) return "";
    // 找card
    const savedCard = savedTab.cards?.find((c: any) => c.cardId === cardId);
    if (!savedCard) return "";
    // 找field
    const savedField = savedCard.fields?.find(
      (f: any) => f.fieldId === fieldId
    );
    if (savedField === undefined) return "";
    // 返回value
    return savedField.value ?? "";
  } catch (e) {
    console.error("解析content失败", e);
    return "";
  }
};

// 获取有数据的用户列表（直接返回用户对象供循环）
const getVisibleUsersWithData = (
  users: EsgInfoResponse[],
  tabId: string,
  cardId: string,
  fieldId: string
) => {
  return users.filter(user => {
    if (!user || !user.userId) return false;
    const value = getFieldValue(user.content || "{}", tabId, cardId, fieldId);
    return !!value;
  });
};

// 监听年份变化，设置第一个tab
watch(currentYearConfig, newVal => {
  if (newVal?.tabs?.length > 0) {
    activeTabId.value = String(newVal.tabs[0].tabId);
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>


/* 响应式调整 */
@media (width <= 768px) {
  .page-header .header-content {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .user-panel {
    position: relative;
    top: 0;
    margin-bottom: 16px;

    .user-list {
      max-height: 300px;
    }
  }

  .cards-container {
    grid-template-columns: 1fr;
  }

  .field-values-grid {
    grid-template-columns: 1fr !important;
  }
}

.esg-view {
  min-height: 100vh;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  padding: 16px 0;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1600px;
    padding: 0 24px;
    margin: 0 auto;
  }

  .header-title {
    display: flex;
    gap: 16px;
    align-items: center;

    .title-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      color: #fff;
      background: linear-gradient(135deg, #4268f9, #2d49c9);
      border-radius: 12px;
    }

    .title-text {
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        line-height: 1.2;
        color: #1d2129;
      }

      p {
        margin: 4px 0 0;
        font-size: 14px;
        color: #86909c;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;

    .label {
      margin-left: 8px;
      font-size: 14px;
      color: #666;
    }
  }
}

/* 主内容 */
.main-content {
  max-width: 1600px;
  padding: 0 16px;
  margin: 24px auto;
}

/* 左侧用户面板 */
.user-panel {
  position: sticky;
  top: 24px;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 6%);

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #1d2129;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .user-list {
    max-height: calc(100vh - 260px);
    padding: 8px;
    overflow-y: auto;

    .user-item {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px 10px;
      margin-bottom: 4px;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: #f5f7fa;
      }

      &.active {
        background: #e8f3ff;
      }

      .user-avatar {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #4268f9, #2d49c9);
        border-radius: 50%;
      }

      .user-info {
        flex: 1;
        min-width: 0;

        .user-name {
          overflow: hidden;
          font-size: 13px;
          font-weight: 500;
          color: #1d2129;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .stats-info {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;

    .stat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .stat-label {
        font-size: 12px;
        color: #86909c;
      }

      .stat-value {
        font-size: 14px;
        font-weight: 600;
        color: #4268f9;
      }
    }
  }
}

/* 右侧内容面板 */
.content-panel {
  min-height: calc(100vh - 140px);

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: #86909c;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgb(0 0 0 / 6%);

    svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    p {
      font-size: 16px;
    }
  }

  .no-config {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgb(0 0 0 / 6%);
  }
}

/* 卡片容器 */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 16px;
  padding-top: 16px;

  @media (width <= 1200px) {
    grid-template-columns: 1fr;
  }
}

/* 表单卡片 */
.form-card {
  .card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span:first-child {
      font-size: 16px;
      font-weight: 600;
      color: #1d2129;
    }

    .card-description {
      font-size: 12px;
      font-weight: normal;
      color: #86909c;
    }
  }

  .card-fields {
    .field-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .field-label {
        margin-bottom: 8px;
        font-size: 14px;
        color: #4e5969;

        .label-text {
          font-weight: 500;
        }

        .field-unit {
          margin-left: 4px;
          color: #86909c;
        }
      }

      /* 每个用户对应一个值的栅格布局 - 全部展示不滚动 */
      .field-values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 10px;
        max-height: none;
        overflow: visible;

        .user-value-item {
          .user-badge {
            display: flex;
            gap: 6px;
            align-items: center;
            margin-bottom: 4px;

            .avatar-mini {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              font-size: 11px;
              font-weight: 600;
              color: #fff;
              background: linear-gradient(135deg, #4268f9, #2d49c9);
              border-radius: 50%;
            }

            .user-name {
              overflow: hidden;
              font-size: 12px;
              color: #666;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .readonly-input {
            :deep(.el-input__wrapper) {
              padding: 6px 8px;
              background-color: #f5f7fa;
              box-shadow: none;

              input {
                font-size: 13px;
                color: #1d2129;
                cursor: default;
              }
            }
          }

          .no-data-tip {
            width: 100%;
            padding: 8px 12px;
            font-size: 12px;
            color: #86909c;
            background: #f5f7fa;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
