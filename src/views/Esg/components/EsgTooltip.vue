<template>
  <el-tooltip
    :content="content"
    :placement="placement"
    :effect="effect"
    :raw-content="rawContent"
  >
    <el-icon
      ><slot><QuestionFilled /></slot
    ></el-icon>
  </el-tooltip>
</template>

<script setup>
import { QuestionFilled } from "@element-plus/icons-vue";
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  placement: {
    type: String,
    default: "top"
  },
  effect: {
    type: String,
    default: "light"
  },
  rawContent: {
    type: Boolean,
    default: false
  }
});
</script>
