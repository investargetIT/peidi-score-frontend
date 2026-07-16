<template>
  <div class="field-config">
    <div class="field-header">
      <div class="field-title">
        <el-icon class="title-icon"><Edit /></el-icon>
        <span class="title-text">字段配置</span>
      </div>
      <div class="field-actions">
        <el-button size="small" type="danger" :icon="Delete" @click="$emit('delete')" title="删除字段" />
      </div>
    </div>

    <el-form label-width="90px" size="small" class="field-form">
      <el-form-item label="字段类型">
        <el-select v-model="field.type" class="field-type-select">
          <el-option label="文本" value="text" />
          <el-option label="文件" value="file" />
          <el-option label="混合" value="mixed" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称">
        <el-input v-model="field.label" placeholder="字段标签" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="field.description" type="textarea" placeholder="字段描述" autosize />
      </el-form-item>
      <el-form-item label="示例">
        <el-input v-model="field.example" placeholder="填写示例" />
      </el-form-item>

      <!-- 混合类型的子控件配置 -->
      <template v-if="field.type === 'mixed'">
        <el-divider class="control-divider">子控件配置</el-divider>
        <div class="add-control-wrapper">
          <el-button size="small" type="primary" :icon="Plus" @click="addControl" title="添加子控件" />
        </div>
        <div v-for="(control, index) in (field.controls || [])" :key="control.controlId" class="control-item">
          <div class="control-header">
            <span class="control-title">
              <el-icon class="control-icon"><Grid /></el-icon>
              子控件 {{ index + 1 }}
            </span>
            <el-button size="small" type="danger" :icon="Delete" @click="deleteControl(index)" title="删除子控件" />
          </div>
          <el-form label-width="90px" size="small" class="control-form">
            <el-form-item label="控件ID">
              <el-input v-model="control.controlId" />
            </el-form-item>
            <el-form-item label="控件类型">
              <el-select v-model="control.controlType" class="control-type-select">
                <el-option label="下拉框" value="select" />
                <el-option label="输入框" value="input" />
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-input v-model="control.label" />
            </el-form-item>
            <el-form-item v-if="control.controlType === 'input'" label="输入类型">
              <el-select v-model="control.inputType" class="input-type-select">
                <el-option label="文本" value="text" />
                <el-option label="数字" value="number" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="control.controlType === 'input'" label="后缀">
              <el-input v-model="control.suffix" placeholder="如 %、人 等" />
            </el-form-item>
            <el-form-item v-if="control.controlType === 'select'" label="选项">
              <div class="options-wrapper">
                <el-tag
                  v-for="(opt, idx) in (control.options || [])"
                  :key="idx"
                  class="option-tag"
                  closable
                  @close="removeOption(control, idx)"
                >
                  {{ opt }}
                </el-tag>
              </div>
              <div class="add-option-wrapper">
                <el-input v-model="localNewOption" placeholder="添加选项" class="option-input" />
                <el-button size="small" type="primary" :icon="Plus" @click="addOption(control)" title="添加选项" />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Delete, Plus, Grid } from '@element-plus/icons-vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'update:field'])

// 本地新选项临时变量
const localNewOption = ref('')

// 生成唯一ID
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// 添加子控件
const addControl = () => {
  if (!props.field.controls) {
    props.field.controls = []
  }
  props.field.controls.push({
    controlId: generateId('ctrl'),
    controlType: 'input',
    label: '新控件',
    placeholder: '',
    options: [],
    value: ''
  })
}

// 删除子控件
const deleteControl = (index) => {
  props.field.controls.splice(index, 1)
}

// 添加选项
const addOption = (control) => {
  if (localNewOption.value.trim()) {
    if (!control.options) {
      control.options = []
    }
    control.options.push(localNewOption.value.trim())
    localNewOption.value = ''
  }
}

// 删除选项
const removeOption = (control, index) => {
  control.options.splice(index, 1)
}
</script>

<style lang="scss" scoped>
// 主题色变量
$primary-color: #4065F7;
$success-color: #67c23a;
$danger-color: #f56c6c;
$warning-color: #e6a23c;
$border-color: #e4e7ed;
$border-dashed: #c0c4cc;
$bg-color: #f5f7fa;
$text-color: #303133;
$text-secondary: #606266;
$text-placeholder: #909399;

.field-config {
  border: 1px solid $border-color;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial,
               "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑",
               "Source Han Sans CN", "Noto Sans CJK SC", sans-serif;
  font-size: 14px;
  line-height: 1.6;

  .field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid $border-color;
  }

  .field-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .title-icon {
      font-size: 18px;
      color: $primary-color;
    }

    .title-text {
      font-weight: 600;
      color: $text-color;
      font-size: 15px;
    }
  }

  .field-actions {
    display: flex;
    gap: 8px;
  }

  .field-form {
    :deep(.el-form-item) {
      margin-bottom: 14px;
    }

    :deep(.el-form-item__label) {
      color: $text-secondary;
      font-weight: 500;
    }
  }


  .field-type-select,
  .control-type-select,
  .input-type-select {
    width: 180px;
  }

  .control-divider {
    margin: 20px 0;
    --el-border-color: $border-color;

    :deep(.el-divider__text) {
      color: $text-secondary;
      font-weight: 500;
      background: #fff;
    }
  }

  .add-control-wrapper {
    margin-bottom: 12px;
  }

  .control-item {
    border: 1px dashed $border-dashed;
    border-radius: 6px;
    padding: 14px;
    margin-bottom: 12px;
    background: $bg-color;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .control-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    color: $text-color;

    .control-icon {
      color: $primary-color;
      font-size: 14px;
    }
  }

  .control-form {
    :deep(.el-form-item) {
      margin-bottom: 12px;
    }

    :deep(.el-form-item:last-child) {
      margin-bottom: 0;
    }
  }

  .options-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .option-tag {
    margin: 0;
  }

  .add-option-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .option-input {
    width: 200px;
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

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px $primary-color inset;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px $primary-color inset;
}

:deep(.el-tag) {
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  border-color: rgba($primary-color, 0.2);
}
</style>
