<template>
  <div class="file-uploader">
    <el-upload
      :limit="1"
      :auto-upload="false"
      :on-change="handleFileChange"
      :show-file-list="false"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
    <el-text v-if="value" type="success" style="margin-left: 10px;">
      当前文件: {{ value }}
    </el-text>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:value'])

const handleFileChange = (file) => {
  if (file) {
    // 简单模拟文件上传成功，生成一个假路径
    const fakePath = `/uploads/${Date.now()}/${file.name}`
    emit('update:value', fakePath)
  }
}
</script>
