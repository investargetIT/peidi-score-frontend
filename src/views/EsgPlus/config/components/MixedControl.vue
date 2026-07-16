<template>
  <div class="mixed-control" style="display: flex; gap: 16px; align-items: center;">
    <div v-for="control in localControls" :key="control.controlId" class="control-item">
      <el-form-item :label="control.label" style="margin-bottom: 0;">
        <!-- 下拉框 -->
        <el-select
          v-if="control.controlType === 'select'"
          :model-value="control.value"
          :placeholder="control.placeholder || '请选择'"
          @update:model-value="(val) => handleControlChange(control.controlId, val)"
          style="width: 150px;"
        >
          <el-option v-for="option in control.options" :key="option" :label="option" :value="option" />
        </el-select>

        <!-- 输入框 -->
        <el-input
          v-else-if="control.controlType === 'input'"
          :type="control.inputType || 'text'"
          :model-value="control.value"
          :placeholder="control.placeholder"
          @update:model-value="(val) => handleControlChange(control.controlId, val)"
          style="width: 150px;"
        >
          <template v-if="control.suffix" #append>{{ control.suffix }}</template>
        </el-input>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  controls: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:controls'])

const localControls = ref([...props.controls])

// 监听 props 变化
watch(() => props.controls, (newVal) => {
  localControls.value = [...newVal]
}, { deep: true })

const handleControlChange = (controlId, value) => {
  const control = localControls.value.find(c => c.controlId === controlId)
  if (control) {
    control.value = value
    emit('update:controls', [...localControls.value])
  }
}
</script>
