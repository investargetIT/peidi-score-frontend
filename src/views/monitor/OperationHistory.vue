<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">{{ t("monitor.operationHistory") }}</div>
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
          {{ t("table.emptyText") }}
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
        prop="userName"
        :label="t('monitor.updateUserName')"
        align="center"
      />
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
      <el-table-column
        prop="operation"
        :label="t('history.operation')"
        width="250"
      >
        <template #default="scope">
          <button
            @click="handleRollback(scope.row)"
            class="mr-[10px] ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-white h-9 rounded-md px-3 bg-red-600 hover:bg-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x h-4 w-4"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
            {{ t("history.rollback") }}
          </button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { storageLocal } from "@pureadmin/utils";
import { getScoreHistoryList, rollbackScoreHistory } from "@/api/pmApi.ts";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const scoreHistoryList = ref([]);
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
  }
});

const updateUserId = storageLocal().getItem("dataSource")?.id || "";

const fetchHistoryList = () => {
  if (!updateUserId) {
    return;
  }
  const commonInfo = {
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize
  };
  const searchArr = [];
  searchArr.push(
    {
      searchName: "update_user_id",
      searchType: "equals",
      searchValue: updateUserId
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
    scoreHistoryList.value = products;
    pagination.value.total = res.data.total;
  });
};

watch(
  () => [props.activeTab],
  ([tab]) => {
    if (tab === "operation") {
      fetchHistoryList();
    }
  },
  { immediate: true }
);

const handleRollback = row => {
  console.log(row);
  ElMessageBox.confirm(
    `${t("history.confirmRollback")}`,
    t("history.confirm"),
    {
      confirmButtonText: t("history.confirm"),
      cancelButtonText: t("history.cancel"),
      type: "warning"
    }
  )
    .then(() => {
      rollbackScoreHistory({
        id: row.id
      })
        .then(res => {
          if (res.code === 200) {
            ElMessage.success(t("history.rollbackSuccess"));
            fetchHistoryList();
          } else {
            ElMessage.error(t("history.rollbackFailed"));
          }
        })
        .catch(() => {
          ElMessage.error(t("history.rollbackFailed"));
        });
    })
    .catch(() => {});
};
// fetchHistoryList();
</script>

<style scoped>
.exchange-history-card {
  padding: 32px 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.exchange-title {
  margin-bottom: 32px;
  font-size: 28px;
  font-weight: bold;
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
