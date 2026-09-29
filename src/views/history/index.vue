<template>
  <div class="history-page">
    <el-card class="history-card">
      <div class="history-title">{{ t("history.pointshistory") }}</div>

      <!-- 说明条：说明本页用途 -->
      <div class="history-sub-bar">
        <div class="bar-tip">{{ t("history.titleTip") }}</div>
      </div>

      <!-- 积分历史列表 -->
      <productList
        ref="listRef"
        :searchInfo="searchInfo"
        :statusList="statusList"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEnumTypeList } from "@/api/pmApi.ts";
import productList from "./productList.vue";

const { t } = useI18n();
const statusList = ref([]);
const listRef = ref(null);
const searchInfo = ref({
  recordTypeId: "all",
  productNo: "",
  productName: ""
});
const enumTypeList = ref([]);

const getLocalizedLabel = label => {
  if (label === "全部") return t("common.all");
  const [zh, en] = label.split("&");
  return t("common.currentLang") === "zh" ? zh : en;
};

const fetchEnumTypeList = () => {
  getEnumTypeList({ type: "pointType" }).then(res => {
    if (res?.code === 200) {
      const tempArr = res.data?.map(item => {
        return {
          label: item.value,
          value: item.id
        };
      });
      tempArr.unshift({
        label: "全部",
        value: "all"
      });
      enumTypeList.value = tempArr;
    }
  });
};

fetchEnumTypeList();
</script>

<style scoped>


/* ===== 移动端适配 ===== */
@media (width <= 768px) {
  .history-card {
    padding: 18px 14px 16px;
    border-radius: 12px;
  }

  .history-title {
    margin-bottom: 16px;
    font-size: 22px;
  }

  .history-sub-bar {
    padding: 10px 12px;
    margin-bottom: 14px;
  }

  .bar-tip {
    font-size: 13px;
  }
}

.history-page {
  box-sizing: border-box;
  width: auto;
}

.history-card {
  width: 100%;
  padding: 32px 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.history-title {
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: bold;
}

/* 说明条 */
.history-sub-bar {
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
