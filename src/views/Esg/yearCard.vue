<script setup lang="ts">
import { reactive } from "vue";
import RiCalendarLine from "@iconify-icons/ri/calendar-line";
import dayjs from "dayjs";

// props
const props = defineProps({
  yearOptions: {
    type: Array<{ value: string; label: string }>,
    required: true
  },
  submit: {
    type: Function,
    required: true
  }
});

// 默认年份处理函数
const getDefaultYear = () => {
  // 获取当前年份
  const currentYear = dayjs().year();
  // 获取当年月份
  const currentMonth = dayjs().month() + 1;
  // 获取当前日期
  const currentDate = dayjs().date();
  // console.log("默认年份", currentYear, currentMonth, currentDate);
  if (currentMonth < 4 || (currentMonth === 4 && currentDate < 17)) {
    return dayjs()
      .year(currentYear - 1)
      .format("YYYY");
  }
  return dayjs().format("YYYY");
};

const form = reactive({
  // 默认年份：每年4月17日前为上一年年，4月17日后为当前年
  esgYear: getDefaultYear()
});

const handleSubmit = () => {
  props.submit(form.esgYear);
  console.log(form.esgYear);
};
</script>

<template>
  <div class="w-[100%] h-[100%] flex items-center justify-center">
    <el-card
      style="width: 500px; border-radius: 15px"
      class="flex justify-center"
    >
      <!-- 图标 -->
      <div class="flex items-center justify-center">
        <div
          class="w-[64px] h-[64px] flex items-center justify-center bg-[#dbeafe] rounded-[64px]"
        >
          <IconifyIconOffline
            :icon="RiCalendarLine"
            class="text-[#155dfc] text-[32px]"
          />
        </div>
      </div>
      <!-- 标题 -->
      <div class="text-[#0a0a0a] text-[24px] font-bold text-center mt-[24px]">
        选择ESG报告年份
      </div>
      <div class="text-[#737373] text-[16px] text-center mt-[16px]">
        请选择你要填写的ESG信息所属年份
      </div>
      <!-- 表单 -->
      <el-form label-position="top" class="w-[450px] mt-[24px]">
        <el-form-item label="报告年份" prop="esgYear" class="text-[#000]">
          <el-select v-model="form.esgYear" placeholder="请选择报告年份">
            <el-option
              v-for="year in yearOptions"
              :key="year.value"
              :label="year.label + '年'"
              :value="year.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            color="#0a0a0a"
            type="primary"
            class="w-[100%]"
            style="height: 40px; font-size: 14px; border-radius: 5px"
            @click="handleSubmit"
            >进入填写</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  margin-bottom: 4px;
  font-size: 14px;
  color: #0a0a0a;
}

:deep(.el-select__wrapper) {
  height: 36px;
}

:deep(.el-select__selected-item) {
  font-size: 14px;
  color: #0a0a0a;
}
</style>
