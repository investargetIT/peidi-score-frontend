<template>
  <div class="esg-survey" ref="rootRef">
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
            {{ showReference ? "关闭参考" : "参考数据" }}
          </el-button>
          <span class="label">填报年份</span>
          <el-select
            :model-value="currentYear"
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
          <el-button
            type="primary"
            @click="handleSaveData"
            title="点击保存，会把当前填报年份的所有数据都上传"
          >
            <el-icon style="margin-right: 4px"><Upload /></el-icon>
            保存填报
          </el-button>
          <!-- 开发者切换用户 -->
          <div class="user-switcher">
            <span class="label">切换用户</span>
            <el-select
              v-model="selectedUserId"
              placeholder="选择用户（开发者功能）"
              clearable
              filterable
              @change="handleUserChange"
              style="width: 260px"
            >
              <el-option
                v-for="user in userList"
                :key="user.userId"
                :label="
                  user.fullName
                    ? `${String(user.userId)} - ${user.fullName}`
                    : String(user.userId)
                "
                :value="String(user.userId)"
              />
            </el-select>
          </div>
          <span v-if="username" class="user-info">
            <span class="user-avatar">{{ username.charAt(0) }}</span>
            <span class="user-detail">
              <span class="user-role">{{
                selectedUserId ? "代填报人" : "填报人"
              }}</span>
              <span class="user-name">{{ username }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div
        class="content-wrapper"
        :style="{ gridTemplateColumns: gridColumns }"
      >
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
              <div
                class="progress-line"
                v-if="index < currentTabCards.length - 1"
              ></div>
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
          <el-tabs
            v-if="currentYearConfig && visibleTabs.length"
            v-model="activeTab"
            class="survey-tabs"
          >
            <el-tab-pane
              v-for="tab in visibleTabs"
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
                    <p v-if="card.cardDescription">
                      {{ card.cardDescription }}
                    </p>
                  </div>
                  <div class="card-fields">
                    <!-- 字段列表 -->
                    <div
                      v-for="field in card.fields"
                      :key="field.fieldId"
                      class="field-item"
                    >
                      <div class="field-label">
                        <span>{{ field.label }}</span>
                        <el-tooltip
                          v-if="field.description"
                          :content="field.description"
                          placement="top"
                        >
                          <el-icon class="desc-icon"
                            ><QuestionFilled
                          /></el-icon>
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
                          :auto-upload="true"
                          :show-file-list="false"
                          multiple
                          :before-upload="beforeUpload"
                          :http-request="
                            options => handleFileUpload(options, field)
                          "
                        >
                          <el-button type="primary">选择文件</el-button>
                          <template #tip>
                            <div class="el-upload__tip">支持多个文件上传</div>
                          </template>
                        </el-upload>

                        <!-- 已上传文件列表 -->
                        <div
                          v-if="field.fileList && field.fileList.length > 0"
                          class="uploaded-files"
                        >
                          <div
                            v-for="(file, index) in field.fileList"
                            :key="index"
                            class="uploaded-file-item"
                          >
                            <el-icon><Document /></el-icon>
                            <a
                              @click="handleFilePreview(file)"
                              class="file-link"
                              >{{ file.name }}</a
                            >
                            <el-icon
                              class="download-icon"
                              @click="handleFileDownload(file)"
                              title="下载"
                              ><Download
                            /></el-icon>
                            <el-icon
                              class="delete-icon"
                              @click="removeFile(field, index)"
                              title="删除"
                              ><Delete
                            /></el-icon>
                          </div>
                        </div>
                        <!-- 混合类型 -->
                        <div
                          v-else-if="field.type === 'mixed'"
                          class="mixed-controls"
                        >
                          <div
                            v-for="control in field.controls || []"
                            :key="control.controlId"
                            class="control-item"
                          >
                            <span class="control-label">{{
                              control.label
                            }}</span>
                            <el-input
                              v-if="control.controlType === 'input'"
                              v-model="control.value"
                              :placeholder="control.placeholder"
                              style="flex: 1"
                            >
                              <template #suffix v-if="control.suffix">{{
                                control.suffix
                              }}</template>
                            </el-input>
                            <el-select
                              v-else-if="control.controlType === 'select'"
                              v-model="control.value"
                              placeholder="请选择"
                              style="flex: 1"
                            >
                              <el-option
                                v-for="(option, idx) in control.options || []"
                                :key="idx"
                                :label="option"
                                :value="option"
                              />
                            </el-select>
                          </div>
                        </div>
                      </div>
                      <div v-if="field.example" class="field-example">
                        <el-tag type="info" size="small"
                          >示例：{{ field.example }}</el-tag
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-empty v-else :description="emptyDescription" />
        </div>

        <!-- 右侧：参考区 -->
        <div v-if="showReference" class="reference-section">
          <div class="section-header">
            <h3>参考数据</h3>
            <el-select
              v-model="referenceYear"
              placeholder="选择参考年份"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="yearConfig in formConfig.filter(
                  y => y.year !== currentYear
                )"
                :key="yearConfig.year"
                :label="yearConfig.year + ' 年'"
                :value="yearConfig.year"
              />
            </el-select>
          </div>

          <div v-if="referenceYearConfig" class="reference-content">
            <!-- 参考区自己的TAB切换，和填报区无关，用户自由切换想看的TAB -->
            <el-tabs v-model="referenceActiveTab" class="survey-tabs">
              <el-tab-pane
                v-for="tab in referenceYearConfig.tabs"
                :key="tab.tabId"
                :label="tab.tabName"
                :name="tab.tabId"
              >
                <!-- 卡片列表 -->
                <div class="cards-container">
                  <div
                    v-for="card in tab.cards"
                    :key="card.cardId"
                    class="survey-card reference-card"
                  >
                    <div class="card-title">
                      <h4>{{ card.cardName }}</h4>
                      <p v-if="card.cardDescription">
                        {{ card.cardDescription }}
                      </p>
                    </div>
                    <div class="card-fields">
                      <div
                        v-for="field in card.fields"
                        :key="field.fieldId"
                        class="field-item"
                      >
                        <div class="field-label">
                          <span>{{ field.label }}</span>
                        </div>
                        <div class="field-value reference-value">
                          <!-- 文本类型 -->
                          <div v-if="field.type === 'text'" class="text-value">
                            {{ field.value || "-" }}
                          </div>
                          <!-- 文件类型 -->
                          <div
                            v-else-if="field.type === 'file'"
                            class="file-value"
                          >
                            <div
                              v-if="field.fileList && field.fileList.length > 0"
                            >
                              <div
                                v-for="(file, idx) in field.fileList"
                                :key="idx"
                                class="file-item"
                              >
                                <el-icon><Document /></el-icon>
                                <span>{{ file.name }}</span>
                              </div>
                            </div>
                            <span v-else>-</span>
                          </div>
                          <!-- 混合类型 -->
                          <div
                            v-else-if="field.type === 'mixed'"
                            class="mixed-controls"
                          >
                            <div
                              v-for="control in field.controls || []"
                              :key="control.controlId"
                              class="control-item"
                            >
                              <span class="control-label">{{
                                control.label
                              }}</span>
                              <span class="control-value">{{
                                control.value || "-"
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-empty v-else description="请选择参考年份" />
        </div>
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
      <img
        v-if="previewImageUrl"
        :src="previewImageUrl"
        class="preview-image"
      />
    </div>
  </el-dialog>
</template>

<script setup>
/**
 * 开发者切换用户功能 说明文档
 *
 * 功能说明：
 * 允许开发者/管理员在页面上切换任意用户，代替该用户完成 ESG 数据填报，
 * 所有保存和加载逻辑都会以选中用户身份进行。
 *
 * 核心逻辑流程：
 * 1. 初始化顺序：页面加载 → 先拉取全部用户列表 → 再加载填报配置 → 用户列表加载完自动设置默认选中
 * 2. 默认选中规则：默认选中从 localStorage.dataSource 中获取当前登录用户的 id，自动匹配用户列表中 userId 等于该 id 的用户，显示格式 `${userId} - ${fullName}`
 * 3. 切换用户后行为：
 *    - 先调用 resetCurrentYearConfig() → 清空当前年份所有字段内容，避免残留上一个用户的数据
 *    - 再调用 loadSavedData() → 根据 currentUserId 拉取并回填该用户已保存的数据
 *    - 自动切回第一个可填报 TAB，重置卡片索引
 * 4. 保存填报规则：保存时始终使用 currentUserId（选中用户ID）和 username（选中用户姓名）
 *
 * 关键变量说明：
 * | 变量            | 作用                                                                 |
 * |----------------|----------------------------------------------------------------------|
 * | defaultUserId  | 从 localStorage 获取的当前登录用户ID（字符串）                       |
 * | defaultUsername| 从 localStorage 获取的当前登录用户名                                 |
 * | userList       | getEsgUserList 接口返回的全部用户列表数据                            |
 * | selectedUserId | 当前开发者选中的切换用户ID（空表示不切换，使用默认）                 |
 * | currentUserId  | 计算属性：实际使用的 userId → selectedUserId.value || defaultUserId.value |
 * | username       | 计算属性：实际显示的用户名 → 优先取选中用户的 fullName               |
 *
 * 接口对应关系：
 * | 来源                | 字段名   | 对应关系                     |
 * |--------------------|---------|------------------------------|
 * | localStorage       | id      | 等于 用户接口返回的 userId   |
 * | getEsgUserList     | userId  | 等于 localStorage 的 id      |
 * | getEsgUserList     | fullName| 用户中文名，用于下拉框显示   |
 *
 * 交互特性：
 * - 下拉框支持 filterable 搜索，可以输入用户名/ID快速定位用户
 * - 支持 clearable 清空选择，清空后自动切回当前登录用户
 * - 右上角显示角色：selectedUserId 不为空时显示「代填报人」，否则显示「填报人」
 * - 所有ID统一转字符串匹配，避免数字/字符串类型不匹配问题
 */

import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  getCurrentInstance
} from "vue";
import {
  Tickets,
  QuestionFilled,
  Document,
  DataAnalysis,
  Back,
  Upload,
  Delete,
  Download
} from "@element-plus/icons-vue";
import { getEsgConfigList } from "@/api/esgConfig";
import {
  updateEsgConfig,
  getEsgInfo,
  uploadEsgFile,
  getFileDownLoadPath,
  getEsgUserList
} from "@/api/esg";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
// 返回首页
const handleBack = () => {
  router.push("/pdesg/home");
};

// 用户列表
const userList = ref([]);

// 当前登录用户名（默认）
const defaultUsername = computed(() => {
  try {
    const info = JSON.parse(localStorage.getItem("dataSource") || "{}");
    return info.username || "";
  } catch {
    return "";
  }
});

// 默认登录用户 userId
const defaultUserId = computed(() => {
  try {
    const info = JSON.parse(localStorage.getItem("dataSource") || "{}");
    return info.id != null ? String(info.id) : "";
  } catch {
    return "";
  }
});

// 当前选中的用户（默认选中当前登录用户，开发者可切换）
const selectedUserId = ref("");

// 当前用户名：优先使用选中的切换用户，否则用默认登录用户
const username = computed(() => {
  if (selectedUserId.value && userList.value.length > 0) {
    const user = userList.value.find(
      u => String(u.userId) === selectedUserId.value
    );
    return user?.fullName || defaultUsername.value;
  }
  return defaultUsername.value;
});

// 当前用户 userId：优先使用选中的切换用户，否则用默认登录用户
const currentUserId = computed(() => {
  return selectedUserId.value || defaultUserId.value;
});

// 加载用户列表
const loadUserList = async () => {
  try {
    const res = await getEsgUserList();
    if (res.success && res.data && res.data.records) {
      // 直接使用接口返回，userId就是正确的用户ID，统一转为字符串
      userList.value = res.data.records;
    }
  } catch (error) {
    console.error("加载用户列表失败", error);
  }
};

// 配置数据
const formConfig = ref([]);
// 当前选中的填报年份
const currentYear = ref("");
// 参考年份
const referenceYear = ref("");
// 参考区域当前激活的TAB（参考区自己独立切换）
const referenceActiveTab = ref("");
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

// 根元素引用
const rootRef = (ref < HTMLElement) | (null > null);

// 图片预览相关
const previewDialogVisible = ref(false);
const previewImageUrl = ref("");

// 当前年份配置
const currentYearConfig = computed(() => {
  return formConfig.value.find(y => y.year === currentYear.value);
});

// 当前用户可填报的 TAB（只展示 writers 中包含当前 userId 的模块）
const visibleTabs = computed(() => {
  if (!currentYearConfig.value) return [];
  const uid = currentUserId.value;
  // 无法识别用户时，安全起见不展示任何模块
  if (!uid) return [];
  return currentYearConfig.value.tabs.filter(
    tab => Array.isArray(tab.writers) && tab.writers.map(String).includes(uid)
  );
});

// 当前 TAB 的卡片列表
const currentTabCards = computed(() => {
  if (!currentYearConfig.value || !activeTab.value) return [];
  const tab = visibleTabs.value.find(t => t.tabId === activeTab.value);
  return tab ? tab.cards : [];
});

// 空状态文案（区分：未选年份 / 无分配模块）
const emptyDescription = computed(() => {
  if (!currentYearConfig.value) return "暂无数据，请先选择年份";
  if (!currentUserId.value) return "未获取到用户信息，请重新登录后再试";
  return "当前账号暂无可填报的模块，请联系管理员分配填写人";
});

// 参考年份配置（存储深度克隆后的配置，回填已保存数据）
const referenceYearConfig = ref(null);

// 监听参考年份变化，加载对应数据
watch(referenceYear, async () => {
  if (referenceYear.value) {
    await loadReferenceData();
  } else {
    referenceYearConfig.value = null;
    referenceActiveTab.value = "";
  }
});

// activeTab变化时，不需要重新加载，但确保模板能正确渲染
// 因为参考数据依赖当前激活的TAB显示对应内容
watch(activeTab, () => {
  console.log(
    `参考数据：activeTab 变化为 ${activeTab.value}，当前referenceYearConfig存在=${!!referenceYearConfig.value}`
  );
});

// 深度克隆配置对象（避免污染原配置）
function deepCloneConfig(sourceConfig) {
  if (!sourceConfig) return null;
  return JSON.parse(JSON.stringify(sourceConfig));
}

// 加载参考年份的已保存数据
const loadReferenceData = async () => {
  if (!referenceYear.value || !currentUserId.value) {
    referenceYearConfig.value = null;
    console.log("参考数据：年份或userId为空，跳过加载");
    return;
  }

  console.log(
    `参考数据：开始加载 ${referenceYear.value} 年，用户ID: ${currentUserId.value}`
  );

  try {
    // 先克隆原始配置结构
    const sourceConfig = formConfig.value.find(
      y => y.year === referenceYear.value
    );
    if (!sourceConfig) {
      referenceYearConfig.value = null;
      console.log("参考数据：formConfig中未找到该年份配置");
      return;
    }
    // 克隆到临时变量，填充完成后一次性赋值（确保响应式一次触发）
    const clonedConfig = deepCloneConfig(sourceConfig);
    console.log(
      `参考数据：克隆配置完成，共有 ${clonedConfig.tabs.length} 个TAB`
    );

    // 从后端加载已保存数据
    const params = {
      type: referenceYear.value,
      userId: currentUserId.value,
      year: referenceYear.value
    };
    console.log("参考数据：请求参数", params);

    const res = await getEsgInfo(params);
    console.log("参考数据：接口返回", res);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      console.log(`参考数据：接口返回共 ${res.data.length} 条记录`);

      // 找到对应用户对应年份的数据
      const savedItem =
        res.data.find(
          item =>
            item.userId === currentUserId.value &&
            String(item.type) === referenceYear.value
        ) || res.data[0];

      console.log("参考数据：找到的保存项", savedItem);

      if (!savedItem.content) {
        console.log("参考数据：未找到保存的内容（content为空）");
        referenceYearConfig.value = clonedConfig;
        return;
      }

      // 解析已保存的内容
      let savedContent;
      try {
        savedContent =
          typeof savedItem.content === "string"
            ? JSON.parse(savedItem.content)
            : savedItem.content;
      } catch (e) {
        console.error("解析参考年份内容失败", e);
        referenceYearConfig.value = clonedConfig;
        return;
      }

      console.log("参考数据：解析后内容", savedContent);

      if (!savedContent || !savedContent.tabs) {
        console.log("参考数据：解析后无tabs数据");
        referenceYearConfig.value = clonedConfig;
        return;
      }

      console.log(
        `参考数据：解析后共有 ${savedContent.tabs.length} 个保存的TAB`
      );

      // 用已保存的数据填充克隆的配置
      let filledTabs = 0;
      let filledCards = 0;
      let filledFields = 0;

      clonedConfig.tabs.forEach(configTab => {
        const savedTab = savedContent.tabs.find(
          t => t.tabId === configTab.tabId
        );
        if (!savedTab || !savedTab.cards) {
          console.log(
            `参考数据：TAB ${configTab.tabId}(${configTab.tabName}) 在保存数据中未找到，跳过`
          );
          return;
        }

        filledTabs++;
        console.log(
          `参考数据：填充TAB ${configTab.tabId}(${configTab.tabName})，共有 ${savedTab.cards.length} 个卡片`
        );

        savedTab.cards.forEach(savedCard => {
          const configCard = configTab.cards.find(
            c => c.cardId === savedCard.cardId
          );
          if (!configCard || !savedCard.fields) return;

          filledCards++;
          console.log(
            `参考数据：填充卡片 ${savedCard.cardId}(${savedCard.cardName})，共有 ${savedCard.fields.length} 个字段`
          );

          savedCard.fields.forEach(savedField => {
            const configField = configCard.fields.find(
              f => f.fieldId === savedField.fieldId
            );
            if (!configField) return;

            filledFields++;
            // 回填value
            if (savedField.value !== undefined) {
              configField.value = savedField.value;
              console.log(
                `  字段 ${savedField.fieldId}(${savedField.label}): 回填值="${savedField.value}"`
              );
            }
            // 回填fileList
            if (savedField.type === "file" && savedField.fileList) {
              configField.fileList = savedField.fileList;
              console.log(
                `  字段 ${savedField.fieldId}(${savedField.label}): 回填文件列表，共${savedField.fileList.length}个文件`
              );
            }
            // 回填mixed类型的controls
            if (
              savedField.type === "mixed" &&
              savedField.controls &&
              Array.isArray(configField.controls)
            ) {
              savedField.controls.forEach(savedControl => {
                const configControl = configField.controls.find(
                  c => c.controlId === savedControl.controlId
                );
                if (configControl && savedControl.value !== undefined) {
                  configControl.value = savedControl.value;
                  console.log(
                    `    mixed控件 ${savedControl.controlId}(${savedControl.label}): 回填值="${savedControl.value}"`
                  );
                }
              });
            }
          });
        });
      });

      console.log(
        `参考数据 ${referenceYear.value} 加载完成，共填充 ${filledTabs} TAB / ${filledCards} 卡片 / ${filledFields} 字段`
      );
      console.log("最终赋值给referenceYearConfig:", clonedConfig);

      // 填充完成后一次性赋值，触发响应式更新
      referenceYearConfig.value = clonedConfig;
      // 默认选中第一个TAB
      if (clonedConfig.tabs && clonedConfig.tabs.length > 0) {
        referenceActiveTab.value = clonedConfig.tabs[0].tabId;
      }
      console.log(
        "赋值后referenceYearConfig.value:",
        referenceYearConfig.value
      );
      console.log("默认选中参考TAB:", referenceActiveTab.value);
    } else {
      console.log("参考数据：接口返回数据为空或格式不正确", res);
      referenceYearConfig.value = clonedConfig;
      console.log("使用空克隆配置赋值");
    }
  } catch (error) {
    console.error("加载参考数据失败", error);
    const fallbackConfig = deepCloneConfig(
      formConfig.value.find(y => y.year === referenceYear.value)
    );
    referenceYearConfig.value = fallbackConfig;
    console.log("加载失败，使用回退配置赋值");
  }
};

// 是否显示左侧进度条（与模板 v-if 条件一致）
const showProgress = computed(
  () => !!(currentYearConfig.value && activeTab.value)
);

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
  // document 查找最稳妥
  const surveyTabs = document.querySelector(".survey-tabs");
  if (!surveyTabs) return null;

  // 获取所有 tab-pane，找到第一个可见的（就是当前激活的）
  const tabPanes = surveyTabs.querySelectorAll(".el-tab-pane");
  if (tabPanes.length === 0) return null;

  // 优先找 is-active，找不到就找第一个可见的
  for (let pane of tabPanes) {
    if (pane.classList.contains("is-active")) {
      return pane;
    }
    // 检查display是否不是none
    const style = window.getComputedStyle(pane);
    if (style.display !== "none") {
      return pane;
    }
  }

  // 兜底：返回第一个tabPane
  return tabPanes[0];
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
    // 先加载用户列表，确保默认选中能正确显示label
    await loadUserList();

    // 等用户列表渲染完成，确保选中项正确显示
    await nextTick();

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

      // 默认选中最新年份，并定位到第一个可填报的 TAB
      if (formConfig.value.length && !currentYear.value) {
        const latest = [...formConfig.value].sort(
          (a, b) => Number(b.year) - Number(a.year)
        )[0];
        currentYear.value = latest.year;
        // visibleTabs 依赖 currentYear，此处 nextTick 后取值
        nextTick(() => {
          activeTab.value = visibleTabs.value.length
            ? visibleTabs.value[0].tabId
            : "";
        });
      }

      // 加载当前年份已保存的数据
      nextTick(async () => {
        await loadSavedData();
      });
    }
  } catch (error) {
    console.error("加载配置失败", error);
    ElMessage.error("加载配置失败");
  } finally {
    loading.close();
  }
};

// 重置当前年份配置为初始空值（切换用户时清空老用户数据）
const resetCurrentYearConfig = () => {
  if (!currentYearConfig.value || !currentYearConfig.value.tabs) return;

  currentYearConfig.value.tabs.forEach(configTab => {
    if (!configTab.cards) return;

    configTab.cards.forEach(configCard => {
      if (!configCard.fields) return;

      configCard.fields.forEach(configField => {
        // 重置value为空
        configField.value = "";
        // 重置文件列表为空
        if (configField.type === "file") {
          configField.fileList = [];
        }
        // 重置mixed类型控件值为空
        if (
          configField.type === "mixed" &&
          Array.isArray(configField.controls)
        ) {
          configField.controls.forEach(control => {
            control.value = "";
          });
        }
      });
    });
  });

  console.log("已重置当前年份所有字段为空");
};

// 加载已保存的数据并回填
const loadSavedData = async () => {
  if (!currentYear.value || !currentUserId.value) return;

  try {
    // 按照要求构造请求参数
    const params = {
      type: currentYear.value,
      userId: currentUserId.value,
      year: currentYear.value
    };

    const res = await getEsgInfo(params);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      // 找到当前用户当前年份的数据（取第一个匹配项）
      const savedItem =
        res.data.find(
          item =>
            item.userId === currentUserId.value &&
            String(item.type) === currentYear.value
        ) || res.data[0];

      if (!savedItem.content) {
        console.log("未找到保存的内容");
        return;
      }

      // 解析已保存的内容
      let savedContent;
      try {
        savedContent =
          typeof savedItem.content === "string"
            ? JSON.parse(savedItem.content)
            : savedItem.content;
      } catch (e) {
        console.error("解析已保存内容失败", e);
        return;
      }

      // 如果没有保存的tabs，直接返回
      if (!savedContent || !savedContent.tabs) return;

      // 优先根据配置渲染，再用已保存的数据填充，匹配不到就不修改
      currentYearConfig.value.tabs.forEach(configTab => {
        // 匹配tab
        const savedTab = savedContent.tabs.find(
          t => t.tabId === configTab.tabId
        );
        if (!savedTab || !savedTab.cards) return;

        savedTab.cards.forEach(savedCard => {
          // 匹配card
          const configCard = configTab.cards.find(
            c => c.cardId === savedCard.cardId
          );
          if (!configCard || !savedCard.fields) return;

          savedCard.fields.forEach(savedField => {
            // 匹配field
            const configField = configCard.fields.find(
              f => f.fieldId === savedField.fieldId
            );
            if (!configField) return;

            // 回填value
            if (savedField.value !== undefined) {
              configField.value = savedField.value;
            }
            // 回填fileList
            if (savedField.type === "file" && savedField.fileList) {
              configField.fileList = savedField.fileList;
            }
            // 回填mixed类型的controls
            if (
              savedField.type === "mixed" &&
              savedField.controls &&
              Array.isArray(configField.controls)
            ) {
              savedField.controls.forEach(savedControl => {
                const configControl = configField.controls.find(
                  c => c.controlId === savedControl.controlId
                );
                if (configControl && savedControl.value !== undefined) {
                  configControl.value = savedControl.value;
                }
              });
            }
          });
        });
      });

      console.log("已加载并回填保存的数据");
      ElMessage.success("已加载历史填报数据");
    }
  } catch (error) {
    console.error("加载已保存数据失败", error);
    // 加载失败不影响正常使用，只打印日志不提示错误
  }
};

onMounted(() => {
  init();
});

// 切换参考数据栏的显示/隐藏
const toggleReference = () => {
  showReference.value = !showReference.value;
};

// 保存填报数据（目前仅输出到控制台，后续对接接口）
const handleSaveData = async () => {
  if (!currentYearConfig.value) {
    ElMessage.warning("请先选择填报年份");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确认要保存 ${currentYear.value} 年的所有填报数据吗？`,
      "保存确认",
      {
        confirmButtonText: "确认保存",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
  } catch {
    return;
  }

  // 按用户 id 分组整理数据
  const userDataMap = new Map();

  // 遍历当前年份所有 TAB
  currentYearConfig.value.tabs.forEach(tab => {
    // 每个 TAB 的填写人列表
    const writers = Array.isArray(tab.writers) ? tab.writers.map(String) : [];
    if (writers.length === 0) return;

    // 收集当前 TAB 的数据
    const tabData = {
      tabId: tab.tabId,
      tabName: tab.tabName,
      cards: tab.cards.map(card => ({
        cardId: card.cardId,
        cardName: card.cardName,
        fields: card.fields.map(field => {
          const fieldData = {
            fieldId: field.fieldId,
            label: field.label,
            type: field.type,
            value: field.value
          };
          if (field.type === "file") {
            fieldData.fileList = field.fileList || [];
          }
          if (field.type === "mixed" && Array.isArray(field.controls)) {
            fieldData.controls = field.controls.map(control => ({
              controlId: control.controlId,
              label: control.label,
              value: control.value
            }));
          }
          return fieldData;
        })
      }))
    };

    // 将当前 TAB 数据添加到每个填写人
    writers.forEach(userId => {
      if (!userDataMap.has(userId)) {
        userDataMap.set(userId, {
          userid: userId,
          year: currentYear.value,
          data: []
        });
      }
      userDataMap.get(userId).data.push(tabData);
    });
  });

  // 转为要求的数组格式
  const result = Array.from(userDataMap.values());

  // 输出到控制台
  console.log("当前填报年份所有数据（按填写人分组）：", result);
  console.log(JSON.stringify(result, null, 2));

  // 调用接口保存ESG信息
  const loading = ElLoading.service({
    lock: true,
    text: "保存中...",
    background: "rgba(255, 255, 255, 0.8)"
  });

  try {
    // 按照要求构造请求参数
    const requestData = {
      content: JSON.stringify(currentYearConfig.value), // 表单所有内容，包含填写的值
      type: currentYear.value, // type传年份
      userId: currentUserId.value, // 当前填写人userId
      userName: username.value, // 当前填写人userName
      year: currentYear.value // year传年份字符串
    };

    console.log("提交的参数：", requestData);
    const response = await updateEsgConfig(requestData);

    if (response.success) {
      ElMessage.success(`保存成功！${currentYear.value} 年ESG填报数据已更新`);
    } else {
      ElMessage.error(response.message || "保存失败，请重试");
    }
  } catch (error) {
    console.error("保存失败", error);
    ElMessage.error("保存失败，请检查网络连接后重试");
  } finally {
    loading.close();
  }
};

// 文件上传前检查
const beforeUpload = file => {
  // 限制文件大小不能超过 100MB
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    ElMessage.error("文件大小不能超过 100MB");
    return false;
  }
  return true;
};

// 文件选择变化处理
const handleFileChange = fileList => {
  // 文件选择变化时不需要额外处理，v-model:file-list已经自动更新
};

// 处理文件上传
const handleFileUpload = async (options, field) => {
  const { file } = options;
  const formData = new FormData();

  // 自定义文件名：填写人姓名_原文件名_唯一标识符.后缀
  // 拆分原文件名和扩展名
  const lastDotIndex = file.name.lastIndexOf(".");
  const originalName =
    lastDotIndex > 0 ? file.name.slice(0, lastDotIndex) : file.name;
  const ext = lastDotIndex > 0 ? file.name.slice(lastDotIndex) : "";
  // 唯一标识符：时间戳后6位 + 2位随机数，兼顾简短和唯一性
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const uniqueId = `${timestamp}_${randomNum}`;
  // 构造新文件名
  const newFileName = `${username.value}_${originalName}_${uniqueId}${ext}`;

  // 使用新文件名创建新的 File 对象
  const renamedFile = new File([file], newFileName, { type: file.type });
  formData.append("file", renamedFile);

  const loading = ElLoading.service({
    lock: true,
    text: "上传中...",
    background: "rgba(255, 255, 255, 0.8)"
  });

  try {
    const res = await uploadEsgFile(formData);
    if (res.success && res.data) {
      // 移除el-upload自动添加的原始文件（因为我们已经自定义列表，避免重复）
      const rawIndex = field.fileList.findIndex(
        item => item.name === file.name && item.status === "ready"
      );
      if (rawIndex !== -1) {
        field.fileList.splice(rawIndex, 1);
      }

      // 保存相对路径和文件名（显示自定义文件名）
      const fileInfo = {
        name: newFileName,
        url: res.data, // 保存返回的相对路径
        status: "success"
      };
      // 添加处理后的文件信息
      field.fileList.push(fileInfo);
      ElMessage.success(`${file.name} 上传成功`);
    } else {
      // 上传失败也要移除自动添加的文件
      const rawIndex = field.fileList.findIndex(
        item => item.name === file.name && item.status === "ready"
      );
      if (rawIndex !== -1) {
        field.fileList.splice(rawIndex, 1);
      }
      ElMessage.error(res.msg || "上传失败，请重试");
    }
  } catch (error) {
    console.error("上传文件失败", error);
    // 上传失败也要移除自动添加的文件
    const rawIndex = field.fileList.findIndex(
      item => item.name === file.name && item.status === "ready"
    );
    if (rawIndex !== -1) {
      field.fileList.splice(rawIndex, 1);
    }
    ElMessage.error("上传失败，请检查网络连接后重试");
  } finally {
    loading.close();
  }
};

// 处理文件预览
const handleFilePreview = async file => {
  if (!file.url) {
    ElMessage.error("文件路径不存在");
    return;
  }

  // 判断是否是图片格式
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const isImage = imageExts.some(ext => file.name.toLowerCase().endsWith(ext));

  if (!isImage) {
    ElMessage.info("该文件类型不支持预览，请点击下载按钮下载查看");
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
      ElMessage.error(res.msg || "获取预览链接失败");
    }
  } catch (error) {
    console.error("获取预览链接失败", error);
    ElMessage.error("获取预览链接失败，请重试");
  }
};

// 处理文件下载
const handleFileDownload = async file => {
  if (!file.url) {
    ElMessage.error("文件路径不存在");
    return;
  }

  try {
    const res = await getFileDownLoadPath({
      objectName: file.url
    });
    if (res.success && res.data) {
      // 新窗口打开下载链接
      window.open(res.data, "_blank");
    } else {
      ElMessage.error(res.msg || "获取下载链接失败");
    }
  } catch (error) {
    console.error("获取下载链接失败", error);
    ElMessage.error("获取下载链接失败，请重试");
  }
};

// 删除文件
const removeFile = async (field, index) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除该文件吗？删除后无法恢复",
      "删除确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    field.fileList.splice(index, 1);
    ElMessage.success("文件已删除");
  } catch {
    // 用户取消删除，不操作
  }
};

// 切换用户处理
const handleUserChange = async () => {
  // 切换用户后，先重置清空所有内容，再加载新用户数据
  nextTick(async () => {
    if (currentYear.value && currentYearConfig.value) {
      // 重置当前年份所有字段为初始空值
      resetCurrentYearConfig();
      // 加载新用户已保存数据
      await loadSavedData();
      // 重新加载参考数据（用户变了，参考数据也要变）
      if (referenceYear.value) {
        await loadReferenceData();
      }
    }
    // 重新选中第一个可填报TAB
    if (visibleTabs.value.length > 0) {
      activeTab.value = visibleTabs.value[0].tabId;
      activeCardIndex.value = 0;
    } else {
      activeTab.value = "";
    }
  });
};

// 年份变化处理（切换前确认：已有选中年份时提示未保存数据会丢失）
const handleYearChange = async newYear => {
  const oldYear = currentYear.value;
  // 如果已经选中了年份，切换时提醒用户
  if (currentYear.value) {
    try {
      await ElMessageBox.confirm(
        "切换年份将导致当前未保存的数据丢失，是否继续？",
        "提示",
        {
          confirmButtonText: "确定切换",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
    } catch {
      // 用户取消，恢复为原来的年份
      currentYear.value = oldYear;
      return;
    }
  }

  // 用户确认或初次选择，执行切换
  currentYear.value = newYear;
  // 只在可填报的 TAB 中选中第一个
  if (visibleTabs.value.length > 0) {
    activeTab.value = visibleTabs.value[0].tabId;
    activeCardIndex.value = 0;
  } else {
    activeTab.value = "";
  }
  // 切换填报年份后，清空参考年份
  referenceYear.value = "";
  referenceYearConfig.value = null;
  referenceActiveTab.value = "";

  // 加载新选年份的已保存数据
  nextTick(async () => {
    await loadSavedData();
  });
};

// 监听 activeTab 变化，重置 activeCardIndex 并重新绑定滚动事件
watch(activeTab, () => {
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
    nextTick(() => {
      const newScrollContainer = getScrollContainer();
      if (newScrollContainer) {
        newScrollContainer.scrollTop = 0;
        // 保存处理函数的引用
        scrollHandlerRef.value = handleScroll;
        newScrollContainer.addEventListener("scroll", scrollHandlerRef.value);
      }
    });
  }, 300);
});

// 用户列表加载完成后设置默认选中，确保匹配label
watch(userList, () => {
  if (defaultUserId.value && userList.value.length > 0) {
    nextTick(() => {
      selectedUserId.value = defaultUserId.value;
    });
  }
});

// 当组件挂载后，绑定滚动事件
onMounted(() => {
  // 延迟绑定，等待所有数据和DOM都渲染完成
  setTimeout(() => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollHandlerRef.value = handleScroll;
      scrollContainer.addEventListener("scroll", scrollHandlerRef.value);
    }
  }, 500);
});
</script>

<style lang="scss" scoped>
// 主题色变量（与 config 页面保持一致）
$primary-color: #4268f9;
$success-color: #36d399;
$warning-color: #f59e0b;
$danger-color: #f56c6c;
$border-color: #e4e7ed;
$border-light: #ebeef5;
$bg-color: #f5f7fa;
$text-color: #1f2937;
$text-secondary: #6b7280;
$text-placeholder: #9ca3af;

@use "sass:color";

.esg-survey {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding-top: 24px;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", "Source Han Sans CN", "Noto Sans CJK SC",
    sans-serif;
  font-size: 14px;
  font-feature-settings:
    "tnum" on,
    "lnum" on;
  line-height: 1.6;
  letter-spacing: 0.01em;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizelegibility;

  // 页面头部
  .page-header {
    box-sizing: border-box;
    width: calc(100% - 48px);
    padding: 24px 32px;
    margin: 0 24px 24px;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 5%),
      0 2px 4px -1px rgb(0 0 0 / 3%);
  }

  .header-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }

  .header-title {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    color: #fff;
    background: linear-gradient(135deg, $primary-color 0%, #7c3aed 100%);
    border-radius: 14px;
    box-shadow: 0 8px 16px -4px rgb(66 104 249 / 30%);
  }

  .title-text {
    h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      line-height: 1.3;
      color: $text-color;
    }

    p {
      margin: 4px 0 0;
      font-size: 14px;
      color: $text-secondary;
    }
  }

  .year-selector {
    display: flex;
    gap: 12px;
    align-items: center;

    .label {
      font-size: 14px;
      font-weight: 500;
      color: $text-color;
    }

    .user-switcher {
      display: flex;
      gap: 8px;
      align-items: center;

      .label {
        font-size: 14px;
        font-weight: 500;
        color: $text-color;
      }
    }

    .user-info {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      padding: 4px 14px 4px 4px;
      background: rgb(66 104 249 / 8%);
      border: 1px solid rgb(66 104 249 / 20%);
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
    box-sizing: border-box;
    width: 100%;
    padding: 0 24px 24px;
  }

  .content-wrapper {
    box-sizing: border-box;
    display: grid;
    gap: 24px;
    width: 100%;
    height: calc(100vh - 200px);
    overflow-x: hidden;
    transition: grid-template-columns 0.3s ease;
  }

  // 进度条区域
  .progress-section {
    flex-shrink: 0;
    padding: 24px 16px;
    overflow-y: auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 5%);

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
      padding: 8px 0 8px 24px;
      cursor: pointer;
      transition: all 0.2s;

      .progress-dot {
        position: absolute;
        top: 12px;
        left: 0;
        z-index: 1;
        width: 12px;
        height: 12px;
        background: $border-color;
        border-radius: 50%;
        transition: all 0.2s;
      }

      .progress-line {
        position: absolute;
        top: 24px;
        left: 5px;
        z-index: 0;
        width: 2px;
        height: calc(100% - 16px);
        background: $border-color;
      }

      .progress-label {
        font-size: 13px;
        line-height: 1.5;
        color: $text-secondary;
        word-break: break-word;
        overflow-wrap: break-word;
        transition: all 0.2s;
      }

      &.active {
        .progress-dot {
          background: $primary-color;
          box-shadow: 0 0 0 4px rgb(66 104 249 / 15%);
          transform: scale(1.2);
        }

        .progress-label {
          font-weight: 600;
          color: $primary-color;
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
  .fill-section,
  .reference-section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 24px;
    overflow: hidden;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 5%);
  }

  .section-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h3 {
      padding-left: 12px;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: $text-color;
      border-left: 4px solid $primary-color;
    }
  }

  // 填报区样式
  .fill-section {
    .survey-tabs {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;

      :deep(.el-tabs__content) {
        flex: 1;
        overflow: hidden;
      }

      :deep(.el-tab-pane) {
        height: 100%;
        padding-right: 8px;
        overflow-y: auto;
      }
    }
  }

  // 参考区样式（和填报区保持一致）
  .reference-section {
    .reference-content {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }

    .survey-tabs {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 100%;
      overflow: hidden;

      :deep(.el-tabs__content) {
        flex: 1;
        height: 100%;
        overflow: hidden;
      }

      :deep(.el-tab-pane) {
        height: 100%;
        padding-right: 8px;
        overflow-y: auto;
      }
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
    padding: 20px;
    background: #fff;
    border: 1px solid $border-light;
    border-radius: 12px;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
    }

    .card-title {
      box-sizing: border-box;
      width: 100%;
      padding-bottom: 12px;
      margin-bottom: 20px;
      overflow: hidden;
      border-bottom: 1px solid $border-light;

      h4 {
        margin: 0;
        margin-bottom: 6px;
        font-size: 16px;
        font-weight: 600;
        color: $text-color;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      p {
        margin: 0;
        font-size: 13px;
        color: $text-secondary;
        word-break: break-word;
        overflow-wrap: break-word;
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
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    overflow: hidden;

    .uploaded-files {
      margin-top: 12px;

      .uploaded-file-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        margin-bottom: 8px;
        background: $bg-color;
        border-radius: 4px;

        .el-icon {
          margin-right: 6px;
          color: $text-secondary;
        }

        .file-link {
          flex: 1;
          color: $primary-color;
          text-decoration: none;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }

        .download-icon {
          margin-right: 8px;
          color: $primary-color;
          cursor: pointer;

          &:hover {
            color: color.adjust($primary-color, $lightness: -10%);
          }
        }

        .delete-icon {
          color: $danger-color;
          cursor: pointer;

          &:hover {
            color: color.adjust($danger-color, $lightness: -10%);
          }
        }
      }
    }
  }

  .image-preview-dialog {
    max-width: 90vw;

    :deep(.el-dialog__body) {
      padding: 10px 20px 20px;
      text-align: center;
    }
  }

  .preview-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    padding: 10px;
    text-align: center;
    background: #1a1a1a;
    border-radius: 8px;
  }

  .preview-image {
    display: block;
    max-width: 100%;
    max-height: 75vh;
    margin: 0 auto;
  }

  .field-label {
    box-sizing: border-box;
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    color: $text-color;
    word-break: break-word;
    overflow-wrap: break-word;

    .desc-icon {
      flex-shrink: 0;
      font-size: 14px;
      color: $text-placeholder;
      cursor: help;
    }
  }

  .field-example {
    box-sizing: border-box;
    width: 100%;
    padding-top: 4px;
    overflow: hidden;
    font-size: 12px;

    :deep(.el-tag) {
      max-width: 100%;
      height: auto;
      padding: 6px 10px;
      line-height: 1.6;
      word-break: break-word;
      white-space: normal;
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
    gap: 12px;
    align-items: center;
    width: 100%;

    .control-label {
      font-size: 14px;
      color: $text-secondary;
      white-space: nowrap;
    }
  }

  // 参考值样式
  .reference-value {
    box-sizing: border-box;
    width: 100%;

    .text-value {
      box-sizing: border-box;
      width: 100%;
      min-height: 60px;
      padding: 10px 12px;
      color: $text-color;
      word-break: break-word;
      overflow-wrap: break-word;
      background: #fff;
      border: 1px solid $border-light;
      border-radius: 8px;
    }

    .file-value {
      .file-item {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 8px 12px;
        margin-bottom: 8px;
        font-size: 13px;
        color: $text-secondary;
        background: #fff;
        border-radius: 6px;
      }
    }

    .control-value {
      flex: 1;
      padding: 8px 12px;
      font-size: 14px;
      color: $text-color;
      background: #fff;
      border-radius: 6px;
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

// MessageBox 确认按钮主题色覆盖
:deep(.el-message-box .el-button--primary) {
  background-color: $primary-color;
  border-color: $primary-color;
}
</style>
