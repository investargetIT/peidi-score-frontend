<template>
  <div class="rank-page">
    <el-card class="rank-card">
      <div class="rank-header">
        <div class="rank-title">{{ $t("leaderboard.pointsrank") }}</div>
        <el-select
          class="rank-type-select"
          v-model="pointType"
          :placeholder="t('history.pointplaceholder')"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <!-- 说明条：说明本页用途 -->
      <div class="rank-sub-bar">
        <div class="bar-tip">{{ t("leaderboard.titleTip") }}</div>
      </div>

      <!-- 排行榜 -->
      <productList
        ref="listRef"
        :point-type="pointType"
        :pointTypeMap="pointTypeMap"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import productList from "./productList.vue";
const listRef = ref(null);
const { t } = useI18n();

const pointType = ref("lifeTimePoints");
// 映射枚举，针对可兑换积分，名称不同
const pointTypeMap = {
  lifeTimePoints: "lifeTimePoints",
  exchangeablePoints: "redeemablePoints"
};
const typeOptions = computed(() => [
  {
    label: t("dashboard.longTermPoints"),
    value: pointTypeMap["lifeTimePoints"]
  },
  {
    label: t("dashboard.exchangeablePoints"),
    value: pointTypeMap["exchangeablePoints"]
  }
]);
</script>

<style scoped>


/* ===== 移动端适配 ===== */
@media (width <= 768px) {
  .rank-card {
    padding: 18px 14px 16px;
    border-radius: 12px;
  }

  .rank-header {
    justify-content: flex-start;
  }

  .rank-title {
    font-size: 22px;
  }

  .rank-type-select {
    width: 100%;
  }

  .rank-sub-bar {
    padding: 10px 12px;
    margin-bottom: 14px;
  }

  .bar-tip {
    font-size: 13px;
  }
}

.rank-page {
  box-sizing: border-box;
  width: auto;
}

.rank-card {
  width: 100%;
  padding: 32px 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.rank-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.rank-title {
  font-size: 28px;
  font-weight: bold;
  white-space: nowrap;
}

.rank-type-select {
  flex-shrink: 0;
  width: 240px;
}

/* 说明条 */
.rank-sub-bar {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  margin-bottom: 20px;
  background: #f7f8fa;
  border-radius: 10px;
}

.bar-tip {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.dialog-footer {
  text-align: right;
}
</style>
