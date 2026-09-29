<template>
  <div>
    <!-- 桌面端：表格 -->
    <el-table
      v-if="!isMobile"
      v-loading="loading"
      :element-loading-text="t('monitor.dataLoading')"
      :data="tableData"
      class="rank-table"
      stripe
      style="width: 100%"
      header-row-class-name="rank-header-row"
    >
      <template #empty>
        <div class="rank-empty">{{ t("table.emptyText") }}</div>
      </template>
      <el-table-column :label="t('leaderboard.rank')" width="90" align="center">
        <template #default="scope">
          <span
            v-if="globalRank(scope.$index) <= 3"
            class="rank-medal"
            :class="'rank-medal-' + globalRank(scope.$index)"
            >{{ globalRank(scope.$index) }}</span
          >
          <span v-else class="rank-normal">{{ globalRank(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullName" :label="t('leaderboard.user')">
        <template #default="scope">
          <div class="rank-user">
            <el-avatar
              :size="34"
              :src="avatarUrls[scope.row.id] || Avatar"
              class="rank-avatar"
            />
            <span class="rank-name">{{ scope.row.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :prop="pointColumnProp"
        :label="pointColumnLabel"
        width="160"
        align="right"
      >
        <template #default="scope">
          <span class="rank-points">{{
            changeNumberFormat(scope.row[pointColumnProp])
          }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 移动端：卡片式排行榜 -->
    <div v-else v-loading="loading" class="mobile-rank-list">
      <template v-if="tableData.length > 0">
        <div
          v-for="(row, idx) in tableData"
          :key="idx"
          class="mobile-rank-card"
        >
          <span
            v-if="globalRank(idx) <= 3"
            class="rank-medal"
            :class="'rank-medal-' + globalRank(idx)"
            >{{ globalRank(idx) }}</span
          >
          <span v-else class="mobile-rank-normal">#{{ globalRank(idx) }}</span>
          <el-avatar
            :size="38"
            :src="avatarUrls[row.id] || Avatar"
            class="mobile-rank-avatar"
          />
          <span class="mobile-rank-name">{{ row.fullName }}</span>
          <span class="mobile-rank-points">{{
            changeNumberFormat(row[pointColumnProp])
          }}</span>
        </div>
      </template>
      <div v-else class="rank-empty">{{ t("table.emptyText") }}</div>
    </div>
    <div class="pagination-row">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="pagination.pageNo"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        background
        :small="isMobile"
        :pager-count="isMobile ? 5 : 7"
        :layout="
          isMobile ? 'prev, pager, next' : 'total, prev, pager, next, jumper'
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeNumberFormat } from "@/utils/common";
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { getScoreRankList, getFileDownLoadPath } from "@/api/pmApi.ts";
import Avatar from "@/assets/user.jpg";

const props = defineProps({
  pointType: {
    type: String,
    default: "lifeTimePoints"
  },
  pointTypeMap: {
    type: Object,
    default: () => ({})
  }
});

const loading = ref(true);
const { t } = useI18n();
const tableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});
const avatarUrls = ref({});

// 移动端检测：<768px 时切换分页布局
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

// 缓存两类数据
const cache = ref({
  lifeTimePoints: { records: [], total: 0, avatars: {} },
  exchangeablePoints: { records: [], total: 0, avatars: {} }
});

const fetchAndCache = async (type: string) => {
  const res = await getScoreRankList({
    pageNo: 1,
    pageSize: 100000, // 拉全量，分页在前端做
    sortStr: JSON.stringify([{ sortName: type, sortType: "desc" }])
  });
  if (res?.data?.records) {
    const avatars: Record<string, string> = {};
    for (const record of res.data.records) {
      if (record.avatarUrl) {
        avatars[record.id] = await getPreviewUrl(record.avatarUrl, record.id);
      }
    }
    cache.value[type] = {
      records: res.data.records,
      total: res.data.total || 0,
      avatars
    };
  }
};

const getPreviewUrl = async (file, userId) => {
  if (!file) return "";

  try {
    // 尝试作为JSON字符串解析
    const parsed = JSON.parse(file);

    // 如果解析成功且是数组格式
    if (Array.isArray(parsed) && parsed.length > 0) {
      const objectName = parsed[0]?.response?.data || parsed[0]?.name;
      if (objectName) {
        const res = await getFileDownLoadPath({
          objectName: objectName
        });
        if (res.code === 200) {
          return res.data;
        }
      }
    }
    return "";
  } catch (error) {
    // 如果JSON.parse失败，说明是单纯的字符串，直接返回使用
    // console.log(`用户${userId}的avatarUrl是单纯字符串，直接使用:`, file);
    return file;
  }
};

const updateTableData = () => {
  const type = props.pointType;
  tableData.value = cache.value[type].records.slice(
    (pagination.value.pageNo - 1) * pagination.value.pageSize,
    pagination.value.pageNo * pagination.value.pageSize
  );
  pagination.value.total = cache.value[type].total;
  avatarUrls.value = cache.value[type].avatars;
};

const handlePageChange = (pageNo: number) => {
  pagination.value.pageNo = pageNo;
  updateTableData();
};

// 全局排名：跨页统一计算，保证只有真正的前三名显示奖牌
const globalRank = (rowIndex: number) =>
  rowIndex + 1 + (pagination.value.pageNo - 1) * pagination.value.pageSize;

watch(
  () => props.pointType,
  () => {
    pagination.value.pageNo = 1;
    updateTableData();
  }
);

onMounted(async () => {
  await fetchAndCache(props.pointTypeMap["exchangeablePoints"]);
  await fetchAndCache(props.pointTypeMap["lifeTimePoints"]);
  updateTableData();
  loading.value = false;
});

const pointColumnLabel = computed(() => {
  return props.pointType === props.pointTypeMap["exchangeablePoints"]
    ? t("dashboard.exchangeablePoints")
    : t("dashboard.longTermPoints");
});

const pointColumnProp = computed(() => {
  return props.pointType === props.pointTypeMap["exchangeablePoints"]
    ? props.pointTypeMap["exchangeablePoints"]
    : props.pointTypeMap["lifeTimePoints"];
});

defineExpose({
  fetchProductList: updateTableData
});
</script>
<style scoped>


/* 移动端：分页整体居中并允许换行，避免窄屏横向溢出 */
@media (width <= 768px) {
  .pagination-row {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 12px;
  }
}

.rank-empty {
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
.rank-table {
  width: 100%;
  font-size: 14px;
}

.rank-table :deep(th.el-table__cell),
.rank-table :deep(td.el-table__cell) {
  padding: 9px 0;
}

.rank-table :deep(.el-table__row) {
  height: 50px;
}

/* 斑马纹 */
.rank-table :deep(.el-table__row--striped td.el-table__cell) {
  background: #f7f8fa;
}

.rank-header-row th {
  font-size: 15px;
  font-weight: bold !important;
  color: #303133;
  background: #fff !important;
}

/* ===== 前三名徽章（金/银/铜） ===== */
.rank-medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 13px;
  font-weight: bold;
  line-height: 1;
  color: #fff;
  border-radius: 50%;
}

.rank-medal-1 {
  background: linear-gradient(135deg, #f6d365, #fda085);
  box-shadow: 0 2px 6px rgb(253 160 133 / 45%);
}

.rank-medal-2 {
  background: linear-gradient(135deg, #c0c6cc, #9aa2ab);
  box-shadow: 0 2px 6px rgb(154 162 171 / 40%);
}

.rank-medal-3 {
  background: linear-gradient(135deg, #e6b574, #c98a4b);
  box-shadow: 0 2px 6px rgb(201 138 75 / 40%);
}

.rank-normal {
  color: #606266;
}

/* 用户列：头像 + 姓名 */
.rank-user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.rank-avatar {
  flex-shrink: 0;
}

.rank-name {
  overflow: hidden;
  font-weight: 500;
  color: #303133;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 积分值 */
.rank-points {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
}

/* ===== 移动端卡片式排行榜 ===== */
.mobile-rank-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-rank-card {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 14px;
  background: #f7f8fa;
  border: 1px solid #eceff2;
  border-radius: 10px;
}

.mobile-rank-normal {
  flex-shrink: 0;
  width: 28px;
  font-size: 14px;
  font-weight: 600;
  color: #909399;
  text-align: center;
}

.mobile-rank-avatar {
  flex-shrink: 0;
}

.mobile-rank-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-rank-points {
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
}
</style>
