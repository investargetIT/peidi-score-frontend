<template>
  <div class="fund-squares">
    <el-tooltip
      v-for="month in 12"
      :key="month"
      :content="`${month}${t('fund.monthSuffix')} ${t('fund.expense')}：${
        (monthsUsed || [])[month - 1] ? t('fund.used') : t('fund.unused')
      }`"
      placement="top"
      effect="dark"
      :show-after="300"
    >
      <el-tag
        class="fund-square"
        :class="{ used: (monthsUsed || [])[month - 1] }"
        :type="(monthsUsed || [])[month - 1] ? 'info' : 'success'"
        size="small"
        effect="dark"
        disable-transitions
        >{{ month }}</el-tag
      >
    </el-tooltip>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  monthsUsed: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
/* 12 个月度经费方块：width:100% 保证容器宽度确定；
   宽度够 → 14px×12 单行；缩进过深放不下 → flex-wrap 按实际可用宽度自动换行，不会横向挤出
   （el-tag 去除默认边距，压成 14px 小方块） */
.fund-squares {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0 4px 0 0;
}

/* 未使用：绿色方块 */
.fund-square.el-tag {
  --el-tag-bg-color: #67c23a;
  --el-tag-border-color: #67c23a;
  --el-tag-text-color: #fff;
  --el-tag-height: 14px;

  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  min-width: 14px;
  height: 14px;
  padding: 0 1px;
  margin: 0;
  font-size: 10px;
  line-height: 1;
  border-radius: 3px;
}

/* 已使用：浅灰色方块（数字用深色，与未用的绿色区分开） */
.fund-square.el-tag.used {
  --el-tag-bg-color: #e4e7ed;
  --el-tag-border-color: #cfd3d9;
  --el-tag-text-color: #303133;
}
</style>
