<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">{{ t("monitor.history") }}</div>
    <div class="history-sub-bar">
      <template
        v-if="
          props?.selected?.userId && props?.selectedEmployeeIds?.length === 1
        "
      >
        <el-avatar :size="40" :src="avatarUrls[props.selected.id] || Avatar" />
        <div class="bar-main">
          <div class="bar-name">{{ props.selected.name }}</div>
          <div class="bar-tip">{{ t("monitor.historyFollowTip") }}</div>
        </div>
      </template>
      <div v-else-if="props?.selectedEmployeeIds?.length > 1" class="bar-empty">
        {{ t("monitor.selectSingleEmployeeForHistory") }}
      </div>
      <div v-else class="bar-empty">{{ t("monitor.selectEmployeeFirst") }}</div>
    </div>
    <el-table
      :data="scoreHistoryList"
      class="exchange-table no-border-table"
      header-row-class-name="exchange-header"
      max-height="65vh"
      style="width: 100%"
    >
      <template #empty>
        <div
          style="
            padding: 40px 0;
            font-size: 18px;
            color: #888;
            text-align: center;
          "
        >
          {{
            !(
              props?.selected?.userId &&
              props?.selectedEmployeeIds?.length === 1
            )
              ? props?.selectedEmployeeIds?.length > 1
                ? t("monitor.selectSingleEmployeeForHistory")
                : t("monitor.selectEmployeeFirst")
              : t("table.emptyText")
          }}
        </div>
      </template>
      <el-table-column
        prop="createdAt"
        :label="t('history.date')"
        width="180"
        align="center"
      >
        <template #default="scope">
          <span>
            {{
              scope.row.createdAt
                ? dayjs(scope.row.createdAt).format("YYYY-MM-DD")
                : "-"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="recordTypeName"
        :label="t('history.type')"
        align="center"
      />
      <el-table-column
        :label="t('history.points')"
        prop="pointsChange"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="t('history.description')"
        min-width="180"
        align="center"
      />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { getScoreHistoryList } from "@/api/pmApi.ts";
import Avatar from "@/assets/user.jpg";
const scoreHistoryList = ref([]);
import dayjs from "dayjs";
const pagination = ref({
  pageNo: 1,
  pageSize: 500,
  total: 0
});
const props = defineProps({
  t: {
    type: Function,
    required: true
  },
  selected: {
    type: Object,
    default: () => ({})
  },
  activeTab: {
    type: String,
    required: true
  },
  selectedEmployeeIds: {
    type: Array,
    default: () => []
  },
  avatarUrls: {
    type: Object,
    default: () => ({})
  }
});

const fetchHistoryList = () => {
  if (!props?.selected?.userId) {
    return;
  }
  if (props?.selectedEmployeeIds?.length !== 1) {
    return;
  }
  const commonInfo = {
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize
  };
  const searchArr = [];
  searchArr.push(
    {
      searchName: "userId",
      searchType: "equals",
      searchValue: props.selected.userId
    },
    {
      searchName: "show_flag",
      searchType: "equals",
      searchValue: 1
    }
  );
  commonInfo.searchStr = JSON.stringify(searchArr);
  getScoreHistoryList(commonInfo).then(res => {
    // 为每个产品添加默认状态
    const products = res.data.records.map(product => ({
      ...product
    }));
    scoreHistoryList.value = products.reverse();
    pagination.value.total = res.data.total;
  });
};

watch(
  () => [props.activeTab, props.selected && props.selected.userId],
  ([tab, userId]) => {
    if (tab === "history" && userId) {
      fetchHistoryList();
    }
  },
  { immediate: true }
);

fetchHistoryList();
</script>

<style scoped>
.exchange-history-card {
  padding: 32px 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.exchange-title {
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: bold;
}

/* 所选员工信息条：头像 + 姓名 + 联动说明 */
.history-sub-bar {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 18px;
  margin-bottom: 20px;
  background: #f7f8fa;
  border-radius: 10px;
}

.bar-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-name {
  font-size: 20px;
  font-weight: bold;
  color: #222;
}

.bar-tip {
  font-size: 13px;
  color: #909399;
}

.bar-empty {
  font-size: 15px;
  color: #b6b6bd;
}

.exchange-table {
  width: 100%;
  font-size: 18px;
}

.exchange-header th {
  font-size: 18px;
  font-weight: bold !important;
  background: #fff !important;
}

.no-border-table ::v-deep .el-table__cell,
.no-border-table ::v-deep th,
.no-border-table ::v-deep td {
  border-right: none !important;
  border-bottom: none !important;
}

.no-border-table ::v-deep tr {
  background: #fff;
}
</style>
