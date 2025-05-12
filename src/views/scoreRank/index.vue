<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">{{ $t("leaderboard.pointsrank") }}</h2>
        <el-select
          style="width: 240px"
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
    </div>
    <!-- 产品列表 -->
    <productList
      ref="listRef"
      :point-type="pointType"
      :pointTypeMap="pointTypeMap"
    />
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
.dialog-footer {
  text-align: right;
}

.container {
  display: flex;
  gap: 20px;

  .el-select {
    margin-left: 10px;
  }
}
</style>
