<template>
  <div>
    <!-- 桌面端：表格 -->
    <el-table
      v-if="!isMobile"
      :data="tableData"
      class="points-history-table"
      stripe
      style="width: 100%"
      header-row-class-name="points-history-header"
    >
      <template #empty>
        <div class="history-empty">{{ t("table.emptyText") }}</div>
      </template>
      <el-table-column prop="createdAt" :label="t('history.date')" width="160">
        <template #default="scope">
          <div class="activity-time">
            {{ formatDate(scope.row.createdAt) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="t('history.description')"
        min-width="220"
      ></el-table-column>
      <el-table-column
        prop="recordTypeName"
        :label="t('history.type')"
        min-width="140"
      ></el-table-column>
      <el-table-column
        prop="pointsChange"
        :label="t('history.points')"
        width="120"
        align="right"
      >
        <template #default="scope">
          <span
            class="points-change"
            :class="pointsClass(scope.row.pointsChange)"
          >
            {{ pointsText(scope.row.pointsChange) }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 移动端：卡片式列表 -->
    <div v-else class="mobile-list">
      <template v-if="tableData.length > 0">
        <div v-for="(row, idx) in tableData" :key="idx" class="mobile-card">
          <div class="mobile-card-head">
            <span class="mobile-type">{{ row.recordTypeName || "-" }}</span>
            <span class="points-change" :class="pointsClass(row.pointsChange)">
              {{ pointsText(row.pointsChange) }}
            </span>
          </div>
          <div class="mobile-remark">{{ row.remark || "-" }}</div>
          <div class="mobile-date">
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ formatDate(row.createdAt) }}
          </div>
        </div>
      </template>
      <div v-else class="history-empty">{{ t("table.emptyText") }}</div>
    </div>

    <div class="pagination-row">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="pagination.pageNo"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        background
        :layout="
          isMobile ? 'prev, pager, next' : 'total, prev, pager, next, jumper'
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { getScoreHistoryList } from "@/api/pmApi.ts";
import { debounce, storageLocal } from "@pureadmin/utils";
import dayjs from "dayjs";

const { t, locale } = useI18n();
const tableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});

// 移动端检测：<768px 时切换为卡片列表
const isMobile = ref(false);
let mobileMediaQuery: MediaQueryList | null = null;
const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = e.matches;
};
onMounted(() => {
  mobileMediaQuery = window.matchMedia("(max-width: 768px)");
  isMobile.value = mobileMediaQuery.matches;
  mobileMediaQuery.addEventListener("change", handleMobileChange);
});
onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener("change", handleMobileChange);
});

const formatDate = (val: string) =>
  val ? dayjs(val).format("YYYY-MM-DD") : "-";
const pointsClass = (val: number | string) =>
  Number(val) > 0
    ? "points-plus"
    : Number(val) < 0
      ? "points-minus"
      : "points-zero";
const pointsText = (val: number | string) =>
  Number(val) > 0 ? `+${val}` : val;

const props = defineProps({
  searchInfo: {
    type: Object,
    default: () => ({
      sStatus: "",
      productNo: "",
      productName: ""
    })
  }
});

interface IQueryParams {
  pageNo: number;
  pageSize: number;
  searchStr?: string;
}

const debouncedFetch = debounce(() => {
  fetchProductList();
}, 500);

watch(
  () => props.searchInfo,
  newVal => {
    debouncedFetch();
  },
  { immediate: true, deep: true }
);

const fetchProductList = () => {
  const searchStr: any = [];
  const commonInfo: IQueryParams = {
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize
  };
  const searchArr = [] as any;
  searchArr.push(
    {
      searchName: "userId",
      searchType: "equals",
      searchValue: storageLocal().getItem("dataSource")?.id
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
    tableData.value = products;
    pagination.value.total = res.data.total;
  });
};

const handlePageChange = (pageNo: number) => {
  pagination.value.pageNo = pageNo;
  fetchProductList();
};

defineExpose({
  fetchProductList
});
</script>
<style scoped>
.history-empty {
  padding: 40px 0;
  font-size: 18px;
  color: #888;
  text-align: center;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 14px;
}

/* 紧凑行高与单元格内边距 */
.points-history-table {
  width: 100%;
  font-size: 14px;
}

.points-history-table :deep(th.el-table__cell),
.points-history-table :deep(td.el-table__cell) {
  padding: 10px 0;
}

.points-history-table :deep(.el-table__row) {
  height: 48px;
}

/* 斑马纹 */
.points-history-table :deep(.el-table__row--striped td.el-table__cell) {
  background: #f7f8fa;
}

.points-history-header th {
  font-size: 15px;
  font-weight: bold !important;
  color: #303133;
  background: #fff !important;
}

/* 积分列：加分绿、扣分红、零值灰 */
.points-change {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}

.points-plus {
  color: #16a34a;
}

.points-minus {
  color: #dc2626;
}

.points-zero {
  color: #909399;
}

/* ===== 移动端卡片列表 ===== */
.mobile-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-card {
  padding: 12px 14px;
  background: #f7f8fa;
  border: 1px solid #eceff2;
  border-radius: 10px;
}

.mobile-card-head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.mobile-type {
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-card-head .points-change {
  flex-shrink: 0;
  font-size: 17px;
}

.mobile-remark {
  margin-bottom: 6px;
  font-size: 15px;
  line-height: 1.5;
  color: #303133;
  overflow-wrap: anywhere;
}

.mobile-date {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 12px;
  color: #888;
}
</style>
