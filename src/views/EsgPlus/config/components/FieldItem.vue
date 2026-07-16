<template>
  <el-form-item :label="field.label" style="margin-bottom: 20px;">
    <!-- 文字类型 -->
    <template v-if="field.type === 'text'">
      <el-input
        :model-value="field.value"
        @update:model-value="handleValue"
        style="width: 400px;"
      />
    </template>

    <!-- 文件类型 -->
    <template v-else-if="field.type === 'file'">
      <FileUploader :value="field.value" @update:value="handleValue" />
    </template>

    <!-- 混合类型 -->
    <template v-else-if="field.type === 'mixed'">
      <MixedControl :controls="field.controls" @update:controls="handleMixedUpdate" />
    </template>

    <!-- 描述和示例 -->
    <div class="field-meta" style="margin-top: 8px;">
      <el-text v-if="field.description" type="info" size="small" style="display: block;">{{ field.description }}</el-text>
      <el-text v-if="field.example" type="secondary" size="small" style="display: block; margin-top: 4px;">{{ field.example }}</el-text>
    </div>
  </el-form-item>
</template>

<script setup>
import FileUploader from './FileUploader.vue'
import MixedControl from './MixedControl.vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:value'])

const handleValue = (newValue) => {
  emit('update:value', newValue)
}

const handleMixedUpdate = (newControls) => {
  // 对于 mixed 类型，更新整个 controls 数组
  emit('update:value', newControls)
}
</script>
