<template>
  <div class="esg-config">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <el-icon :size="32"><Tickets /></el-icon>
          </div>
          <div class="title-text">
            <h1>ESG 表单配置</h1>
            <p>管理各年度的表单模板配置</p>
          </div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" :icon="Plus" @click="showAddYearDialog = true">
            <span>添加年份</span>
          </el-button>
          <el-button type="success" :icon="Check" @click="saveConfig">
            <span>保存配置</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 统计信息 -->
      <div class="stats-cards" v-if="formConfig.length > 0">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <el-icon><Tickets /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formConfig.length }}</div>
            <div class="stat-label">已配置年份</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalCards }}</div>
            <div class="stat-label">总卡片数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">
            <el-icon><List /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalFields }}</div>
            <div class="stat-label">总字段数</div>
          </div>
        </div>
      </div>

      <!-- 年份卡片列表 -->
      <div class="section-header">
        <h3>年度配置列表</h3>
      </div>

      <div class="years-grid">
        <!-- 年份卡片 -->
        <div
          v-for="yearConfig in formConfig"
          :key="yearConfig.year"
          class="year-card"
          @click="openYearDetail(yearConfig)"
        >
          <div class="year-card-gradient"></div>
          <div class="year-card-content">
            <div class="year-card-header">
              <div class="year-badge">{{ yearConfig.year }}</div>
              <div class="year-tag">年度配置</div>
            </div>
            <div class="year-card-stats">
              <div class="stat-item">
                <div class="stat-number">{{ yearConfig.tabs.length }}</div>
                <div class="stat-unit">TAB</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-number">{{ countCards(yearConfig) }}</div>
                <div class="stat-unit">卡片</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-number">{{ countFields(yearConfig) }}</div>
                <div class="stat-unit">字段</div>
              </div>
            </div>
            <div class="year-card-footer">
              <span class="enter-text">进入配置</span>
              <el-icon class="enter-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 添加年份卡片 -->
        <div class="year-card add-year-card" @click="showAddYearDialog = true">
          <div class="add-year-content">
            <div class="add-icon-wrapper">
              <el-icon class="add-icon"><Plus /></el-icon>
            </div>
            <div class="add-text">添加新年度</div>
            <div class="add-desc">创建新的年度配置</div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="formConfig.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon :size="80"><Tickets /></el-icon>
        </div>
        <h3>暂无年度配置</h3>
        <p>点击下方按钮开始创建第一个年度配置</p>
        <el-button type="primary" size="large" :icon="Plus" @click="showAddYearDialog = true">
          创建年度配置
        </el-button>
      </div>
    </div>

    <!-- 添加年份对话框 -->
    <el-dialog v-model="showAddYearDialog" title="添加年份" width="500px">
      <el-form label-width="120px">
        <el-form-item label="选择年份">
          <el-date-picker
            v-model="newYearValue"
            type="year"
            placeholder="选择年份"
            format="YYYY"
            value-format="YYYY"
          />
        </el-form-item>
        <el-form-item label="复制配置（可选）">
          <el-select v-model="copyFromYear" placeholder="选择要复制的年份" clearable style="width: 100%;">
            <el-option v-for="yearConfig in formConfig" :key="yearConfig.year" :label="yearConfig.year + ' 年'" :value="yearConfig.year" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddYearDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddYear">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 年份详情对话框 -->
    <el-dialog
      v-model="showYearDetailDialog"
      :title="currentYearConfig ? currentYearConfig.year + ' 年配置' : '年份配置'"
      width="90%"
      :fullscreen="isFullscreen"
      class="year-detail-dialog"
    >
      <template #header>
        <div class="year-detail-header">
          <span>{{ currentYearConfig ? currentYearConfig.year + ' 年配置' : '年份配置' }}</span>
          <div class="year-detail-header-actions">
            <el-button size="small" @click="isFullscreen = !isFullscreen" :icon="isFullscreen ? Aim : FullScreen" />
            <el-button size="small" type="primary" :icon="Plus" @click="addTab(currentYearConfig)" title="添加TAB" />
            <el-button size="small" type="danger" :icon="Delete" @click="deleteYear(currentYearConfig.year)" title="删除年份" />
          </div>
        </div>
      </template>

      <div v-if="currentYearConfig" class="year-detail-content">
        <!-- TAB 卡片网格 -->
        <div class="tabs-grid">
          <div v-for="tab in currentYearConfig.tabs" :key="tab.tabId" class="tab-card">
            <div class="tab-card-header">
              <div class="tab-card-title">
                <el-input v-model="tab.tabName" placeholder="TAB名称" class="tab-title-input" size="small" />
              </div>
              <div class="tab-card-actions">
                <el-button size="small" type="primary" :icon="Plus" @click="addCard(tab)" title="添加卡片" />
                <el-button size="small" type="danger" :icon="Delete" @click="deleteTab(currentYearConfig, tab.tabId)" title="删除TAB" />
              </div>
            </div>

            <!-- 卡片列表 -->
            <div class="cards-list">
              <div
                v-for="card in tab.cards"
                :key="card.cardId"
                class="mini-card"
                @click="openCardDetail(card, tab)"
              >
                <div class="mini-card-content">
                  <div class="mini-card-left">
                    <div class="mini-card-name">{{ card.cardName || '未命名卡片' }}</div>
                    <div v-if="card.cardDescription" class="mini-card-desc">{{ card.cardDescription }}</div>
                  </div>
                  <div class="mini-card-right">
                    <span class="field-count-badge">{{ card.fields.length }}字段</span>
                    <div class="mini-card-actions" @click.stop>
                      <el-button size="small" type="danger" :icon="Delete" @click="deleteCard(tab, card.cardId)" title="删除卡片" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 添加 TAB 按钮 -->
          <div class="add-tab-card" @click="addTab(currentYearConfig)">
            <el-icon class="add-icon"><Plus /></el-icon>
            <span>添加 TAB</span>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="!currentYearConfig.tabs.length" description="暂无 TAB，点击下方或右上角添加" />
      </div>
    </el-dialog>

    <!-- 卡片详情弹窗 -->
    <el-dialog
      v-model="showCardDetailDialog"
      :title="currentCard ? '编辑卡片' : '卡片'"
      width="80%"
      class="card-detail-dialog"
    >
      <div v-if="currentCard" class="card-detail-content">
        <el-form label-width="100px">
          <el-form-item label="卡片名称">
            <el-input v-model="currentCard.cardName" placeholder="卡片名称" />
          </el-form-item>
          <el-form-item label="卡片描述">
            <el-input v-model="currentCard.cardDescription" type="textarea" placeholder="卡片描述" autosize />
          </el-form-item>
        </el-form>

        <el-divider>字段配置</el-divider>

        <div class="add-field-wrapper">
          <el-button type="primary" :icon="Plus" @click="addField(currentCard)">添加字段</el-button>
        </div>

        <div class="fields-editor">
          <div v-for="(field, index) in currentCard.fields" :key="index" class="field-editor">
            <div class="field-editor-header">
              <el-input v-model="field.label" placeholder="字段标签" size="small" class="field-label-input" />
              <el-select v-model="field.type" size="small" style="width: 120px;">
                <el-option label="文本" value="text" />
                <el-option label="文件" value="file" />
                <el-option label="混合" value="mixed" />
              </el-select>
              <el-button size="small" type="danger" :icon="Delete" @click="deleteField(currentCard, field.fieldId)" title="删除字段" />
            </div>
            <div class="field-editor-body">
              <el-input v-model="field.description" placeholder="字段描述" size="small" class="field-desc-input" />
              <el-input v-model="field.example" placeholder="示例" size="small" class="field-example-input" />
            </div>
            <!-- 混合类型的子控件 -->
            <div v-if="field.type === 'mixed'" class="controls-editor">
              <el-divider content-position="left" style="margin: 10px 0;">子控件</el-divider>
              <el-button size="small" type="primary" :icon="Plus" @click="addControlToField(field)">添加子控件</el-button>
              <div v-for="(control, ctrlIndex) in (field.controls || [])" :key="ctrlIndex" class="control-editor">
                <div class="control-editor-header">
                  <el-input v-model="control.label" placeholder="控件标签" size="small" class="control-label" />
                  <el-button size="small" type="danger" :icon="Delete" @click="removeControlFromField(field, ctrlIndex)" title="删除子控件" />
                </div>
                <div class="control-editor-body">
                  <el-select v-model="control.controlType" size="small" style="width: 120px;">
                    <el-option label="下拉框" value="select" />
                    <el-option label="输入框" value="input" />
                  </el-select>
                  <template v-if="control.controlType === 'input'">
                    <el-select v-model="control.inputType" size="small" style="width: 100px;">
                      <el-option label="文本" value="text" />
                      <el-option label="数字" value="number" />
                    </el-select>
                    <el-input v-model="control.suffix" placeholder="后缀" size="small" style="width: 80px;" />
                  </template>
                  <template v-if="control.controlType === 'select'">
                    <div class="options-editor">
                      <el-tag v-for="(opt, optIdx) in (control.options || [])" :key="optIdx" closable @close="removeOptionFromControl(control, optIdx)">
                        {{ opt }}
                      </el-tag>
                      <el-input v-model="control._tempOption" placeholder="添加选项" size="small" style="width: 150px;" />
                      <el-button size="small" @click="addOptionToControl(control)">添加</el-button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus, Delete, Check, Tickets, Document, List, FullScreen, Aim, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getEsgConfigList, createEsgConfig } from '@/api/esgConfig'

// 配置数据
const formConfig = ref([])
// 保存所有从后端加载的配置记录，包含 id 等信息
const allConfigRecords = ref([])

// 添加年份对话框显示状态
const showAddYearDialog = ref(false)
// 年份详情对话框显示状态
const showYearDetailDialog = ref(false)
// 卡片详情对话框显示状态
const showCardDetailDialog = ref(false)
// 当前选中的年份配置
const currentYearConfig = ref(null)
// 当前选中的卡片
const currentCard = ref(null)
// 当前选中的卡片所属的 tab
const currentTab = ref(null)
// 是否全屏
const isFullscreen = ref(false)
// 新选的年份
const newYearValue = ref('')
// 要复制的年份
const copyFromYear = ref('')

// 初始化
const init = async () => {
  const loading = ElLoading.service({
    lock: false,
    text: '加载中...',
    background: 'transparent'
  })

  try {
    const res = await getEsgConfigList({
      pageNo: 1,
      pageSize: 100
    })

    if (res && res.records) {
      allConfigRecords.value = res.records
      // 解析 config 字段为我们需要的格式
      formConfig.value = res.records.map(record => {
        try {
          if (record.config) {
            const parsed = JSON.parse(record.config)
            return {
              ...parsed,
              id: record.id,
              year: record.year?.toString() || parsed.year
            }
          }
        } catch (e) {
          console.error('解析配置失败', e)
        }
        return {
          id: record.id,
          year: record.year?.toString() || '',
          tabs: []
        }
      })
    }
  } catch (error) {
    console.error('加载配置失败', error)
    ElMessage.error('加载配置失败')
  } finally {
    loading.close()
  }
}

onMounted(() => {
  init()
})

// 统计卡片数量
const countCards = (yearConfig) => {
  return yearConfig.tabs.reduce((total, tab) => total + tab.cards.length, 0)
}

// 统计字段数量
const countFields = (yearConfig) => {
  return yearConfig.tabs.reduce((total, tab) => {
    return total + tab.cards.reduce((tabTotal, card) => tabTotal + card.fields.length, 0)
  }, 0)
}

// 计算总卡片数
const totalCards = computed(() => {
  return formConfig.value.reduce((total, config) => total + countCards(config), 0)
})

// 计算总字段数
const totalFields = computed(() => {
  return formConfig.value.reduce((total, config) => total + countFields(config), 0)
})

// 打开年份详情
const openYearDetail = (yearConfig) => {
  currentYearConfig.value = yearConfig
  showYearDetailDialog.value = true
}

// 打开卡片详情
const openCardDetail = (card, tab) => {
  currentCard.value = card
  currentTab.value = tab
  showCardDetailDialog.value = true
}

// 添加子控件到字段
const addControlToField = (field) => {
  if (!field.controls) {
    field.controls = []
  }
  field.controls.push({
    controlId: generateId('ctrl'),
    controlType: 'input',
    label: '新控件',
    placeholder: '',
    options: [],
    value: ''
  })
}

// 从字段中移除子控件
const removeControlFromField = (field, index) => {
  field.controls.splice(index, 1)
}

// 添加选项到控件
const addOptionToControl = (control) => {
  if (control._tempOption && control._tempOption.trim()) {
    if (!control.options) {
      control.options = []
    }
    control.options.push(control._tempOption.trim())
    control._tempOption = ''
  }
}

// 从控件中移除选项
const removeOptionFromControl = (control, index) => {
  control.options.splice(index, 1)
}

// 删除当前卡片
const deleteCurrentCard = () => {
  if (currentTab.value && currentCard.value) {
    deleteCard(currentTab.value, currentCard.value.cardId)
    showCardDetailDialog.value = false
  }
}

// 生成唯一ID
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// 确认添加年份
const confirmAddYear = () => {
  if (!newYearValue.value) {
    ElMessage.warning('请选择年份')
    return
  }

  // 检查年份是否已存在
  const yearExists = formConfig.value.some(y => y.year === newYearValue.value)
  if (yearExists) {
    ElMessage.warning('该年份已存在')
    return
  }

  let newYearConfig
  if (copyFromYear.value) {
    // 复制配置
    const sourceConfig = formConfig.value.find(y => y.year === copyFromYear.value)
    if (sourceConfig) {
      newYearConfig = JSON.parse(JSON.stringify(sourceConfig))
      newYearConfig.year = newYearValue.value
      // 重新生成所有ID，避免冲突
      regenerateIds(newYearConfig)
    }
  } else {
    // 新建空配置
    newYearConfig = {
      year: newYearValue.value,
      tabs: []
    }
  }

  formConfig.value.push(newYearConfig)

  // 重置对话框
  showAddYearDialog.value = false
  newYearValue.value = ''
  copyFromYear.value = ''

  ElMessage.success(`已添加 ${newYearValue.value} 年`)
}

// 重新生成所有ID，避免复制配置时的ID冲突
const regenerateIds = (config) => {
  config.tabs.forEach(tab => {
    tab.tabId = generateId('TAB')
    tab.cards.forEach(card => {
      card.cardId = generateId('CARD')
      card.fields.forEach(field => {
        field.fieldId = generateId('field')
        if (field.controls) {
          field.controls.forEach(control => {
            control.controlId = generateId('ctrl')
          })
        }
      })
    })
  })
}

// 删除年份
const deleteYear = (year) => {
  formConfig.value = formConfig.value.filter(y => y.year !== year)
  showYearDetailDialog.value = false
  ElMessage.success(`已删除 ${year} 年`)
}

// 添加TAB
const addTab = (yearConfig) => {
  const newTabId = generateId('TAB')
  yearConfig.tabs.push({
    tabId: newTabId,
    tabName: `新TAB ${yearConfig.tabs.length + 1}`,
    cards: []
  })
  ElMessage.success('已添加 TAB')
}

// 删除TAB
const deleteTab = (yearConfig, tabId) => {
  yearConfig.tabs = yearConfig.tabs.filter(t => t.tabId !== tabId)
  ElMessage.success('已删除 TAB')
}

// 添加卡片
const addCard = (tab) => {
  const newCardId = generateId('CARD')
  tab.cards.push({
    cardId: newCardId,
    cardName: `新卡片 ${tab.cards.length + 1}`,
    cardDescription: '',
    fields: []
  })
  ElMessage.success('已添加卡片')
}

// 删除卡片
const deleteCard = (tab, cardId) => {
  tab.cards = tab.cards.filter(c => c.cardId !== cardId)
  ElMessage.success('已删除卡片')
}

// 添加字段
const addField = (card) => {
  const newFieldId = generateId('field')
  card.fields.push({
    fieldId: newFieldId,
    type: 'text',
    label: '新字段',
    value: '',
    description: '',
    example: ''
  })
  ElMessage.success('已添加字段')
}

// 删除字段
const deleteField = (card, fieldId) => {
  card.fields = card.fields.filter(f => f.fieldId !== fieldId)
  ElMessage.success('已删除字段')
}

// 保存配置到后端
const saveConfig = async () => {
  const loading = ElLoading.service({
    lock: false,
    text: '保存中...',
    background: 'transparent'
  })

  try {
    // 逐个保存年份配置
    for (const yearConfig of formConfig.value) {
      // 准备保存数据，去掉 id 字段（如果有的话，因为 id 是后端返回的）
      const { id, ...configToSave } = yearConfig
      await createEsgConfig({
        year: parseInt(yearConfig.year),
        config: JSON.stringify(configToSave)
      })
    }
    ElMessage.success('配置已保存')
    // 重新加载配置，获取最新的 id
    await init()
  } catch (error) {
    console.error('保存配置失败', error)
    ElMessage.error('保存配置失败')
  } finally {
    loading.close()
  }
}
</script>

<style lang="scss" scoped>
// 主题色变量
$primary-color: #4065F7;
$success-color: #36D399;
$warning-color: #F59E0B;
$danger-color: #f56c6c;
$border-color: #e4e7ed;
$border-light: #ebeef5;
$bg-color: #f5f7fa;
$text-color: #1f2937;
$text-secondary: #6b7280;
$text-placeholder: #9ca3af;

// 基础字体设置
:deep(*) {
  box-sizing: border-box;
}

.esg-config {
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

  // 页面头部
  .page-header {
    background: #fff;
    padding: 24px 32px;
    border-radius: 16px;
    margin: 0 24px 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
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
    box-shadow: 0 8px 16px -4px rgba(64, 101, 247, 0.3);
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

  .action-buttons {
    display: flex;
    gap: 12px;

    .el-button {
      padding: 10px 20px;
      font-weight: 500;
      border-radius: 10px;
      transition: all 0.2s;
    }
  }

  // 主内容区
  .main-content {
    padding: 0 24px 24px;
  }

  // 统计卡片
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
    }
  }

  .stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;

    &.stat-icon-primary {
      background: linear-gradient(135deg, rgba(64, 101, 247, 0.1) 0%, rgba(64, 101, 247, 0.05) 100%);
      color: $primary-color;
    }

    &.stat-icon-success {
      background: linear-gradient(135deg, rgba(54, 211, 153, 0.1) 0%, rgba(54, 211, 153, 0.05) 100%);
      color: $success-color;
    }

    &.stat-icon-warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
      color: $warning-color;
    }
  }

  .stat-content {
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: $text-color;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 13px;
      color: $text-secondary;
      margin-top: 4px;
    }
  }

  // 章节头部
  .section-header {
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: $text-color;
      padding-left: 12px;
      border-left: 4px solid $primary-color;
    }
  }

  // 年份卡片网格
  .years-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  // 年份卡片
  .year-card {
    position: relative;
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12);

      .year-card-gradient {
        transform: scale(1.1);
      }

      .enter-text {
        transform: translateX(-4px);
      }

      .enter-icon {
        transform: translateX(4px);
        opacity: 1;
      }
    }
  }

  .year-card-gradient {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 100px;
    background: linear-gradient(135deg, $primary-color 0%, #7c3aed 100%);
    transition: transform 0.5s ease;
  }

  .year-card-content {
    position: relative;
    padding: 28px 24px 24px;
  }

  .year-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .year-badge {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
  }

  .year-tag {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    backdrop-filter: blur(4px);
  }

  .year-card-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 20px 0;
    background: #f8fafc;
    border-radius: 14px;
    margin-bottom: 16px;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-size: 24px;
    font-weight: 700;
    color: $primary-color;
  }

  .stat-unit {
    font-size: 12px;
    color: $text-secondary;
    margin-top: 2px;
  }

  .stat-divider {
    width: 1px;
    height: 36px;
    background: #e2e8f0;
  }

  .year-card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    color: $primary-color;
    font-weight: 500;
  }

  .enter-text {
    font-size: 13px;
    transition: transform 0.3s;
  }

  .enter-icon {
    font-size: 14px;
    opacity: 0.7;
    transition: all 0.3s;
  }

  // 添加年份卡片
  .add-year-card {
    background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
    border: 2px dashed #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;

    &:hover {
      border-color: $primary-color;

      .add-icon-wrapper {
        transform: scale(1.1);
        background: linear-gradient(135deg, $primary-color 0%, #7c3aed 100%);
        color: #fff;
      }
    }
  }

  .add-year-content {
    text-align: center;
  }

  .add-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: #f1f5f9;
    color: $text-secondary;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    transition: all 0.3s;
  }

  .add-icon {
    font-size: 32px;
  }

  .add-text {
    font-size: 16px;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 6px;
  }

  .add-desc {
    font-size: 13px;
    color: $text-secondary;
  }

  // 空状态
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-top: 32px;
  }

  .empty-icon {
    color: #cbd5e1;
    margin-bottom: 24px;
  }

  .empty-state {
    h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: $text-color;
    }

    p {
      margin: 0 0 24px 0;
      color: $text-secondary;
    }
  }

  // 年份详情对话框
  .year-detail-dialog {
    :deep(.el-dialog__header) {
      padding: 0;
      margin: 0;
      border-bottom: 1px solid $border-color;
    }

    :deep(.el-dialog__body) {
      padding: 20px 24px;
    }
  }

  .year-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 600;
    color: $text-color;
  }

  .year-detail-header-actions {
    display: flex;
    gap: 8px;
  }

  .year-detail-content {
    min-height: 400px;
  }

  // TAB 卡片网格
  .tabs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
  }

  .tab-card {
    border: 1px solid $border-color;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .tab-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: $bg-color;
    border-bottom: 1px solid $border-color;
  }

  .tab-card-title {
    flex: 1;
  }

  .tab-title-input {
    :deep(.el-input__wrapper) {
      box-shadow: none;
      background: transparent;
      padding-inline-start: 0;
      padding-inline-end: 0;
    }

    :deep(.el-input__inner) {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .tab-card-actions {
    display: flex;
    gap: 6px;
  }

  // 卡片列表
  .cards-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .mini-card {
    border: 1px solid $border-light;
    border-radius: 8px;
    background: #fff;
  }

  .mini-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
  }

  .mini-card-left {
    flex: 1;
    min-width: 0;
  }

  .mini-card-name {
    font-weight: 500;
    color: $text-color;
    font-size: 15px;
    margin-bottom: 4px;
  }

  .mini-card-desc {
    font-size: 13px;
    color: $text-placeholder;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mini-card-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .field-count-badge {
    font-size: 12px;
    color: $primary-color;
    background: rgba($primary-color, 0.1);
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 500;
  }

  .mini-card-actions {
    display: flex;
    gap: 6px;
  }

  // 卡片详情对话框
  .card-detail-dialog {
    :deep(.el-dialog__body) {
      padding: 24px;
    }
  }

  .card-detail-content {
    min-height: 300px;
  }

  .add-field-wrapper {
    margin-bottom: 16px;
  }

  .fields-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field-editor {
    padding: 16px;
    background: $bg-color;
    border-radius: 8px;
  }

  .field-editor-header {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }

  .field-label-input {
    flex: 1;
  }

  .field-editor-body {
    display: flex;
    gap: 10px;
  }

  .field-desc-input {
    flex: 1;
  }

  .field-example-input {
    flex: 1;
  }

  .controls-editor {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed $border-color;
  }

  .control-editor {
    margin-top: 12px;
    padding: 12px;
    background: #fff;
    border-radius: 6px;
  }

  .control-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .control-label {
    flex: 1;
  }

  .control-editor-body {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .options-editor {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  // 添加 TAB 卡片
  .add-tab-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 140px;
    border: 2px dashed $border-color;
    border-radius: 10px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $primary-color;
      background: rgba($primary-color, 0.05);
      color: $primary-color;
    }
  }

  .add-icon {
    font-size: 28px;
    color: $text-placeholder;
  }
}

// Element Plus 主题色覆盖
:deep(.el-button--primary) {
  background-color: $primary-color;
  border-color: $primary-color;

  &:hover {
    background-color: lighten($primary-color, 5%);
    border-color: lighten($primary-color, 5%);
  }
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
