<template>
  <el-tooltip
    :content="content"
    :placement="placement"
    :effect="effect"
    :raw-content="rawContent"
  >
    <el-icon :style="iconStyle"
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
    default: true
  },
  iconStyle: {
    type: String,
    default: "font-size: 15px"
  }
});
</script>
