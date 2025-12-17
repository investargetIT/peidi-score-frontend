<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">{{ t("redeemMonitor.title") }}</div>

    <el-form :model="searchForm" inline>
      <el-form-item :label="t('redeemMonitor.userName')" prop="userName">
        <el-input
          style="width: 240px"
          v-model="searchForm.userName"
          clearable
          :placeholder="t('redeemMonitor.pleaseEnterUserName')"
        />
      </el-form-item>
      <el-form-item
        :label="t('redeemMonitor.redeemStatus')"
        prop="redeemReview"
      >
        <el-select
          style="width: 240px"
          v-model="searchForm.redeemReview"
          clearable
          :placeholder="t('redeemMonitor.pleaseSelectStatus')"
        >
          <el-option :label="t('redeemMonitor.approved')" value="1" />
          <el-option :label="t('redeemMonitor.pending')" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          {{ t("redeemMonitor.query") }}
        </el-button>
        <el-button @click="handleReset">{{
          t("redeemMonitor.reset")
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="exchangeList"
      class="exchange-table no-border-table"
      header-row-class-name="exchange-header"
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
          {{ t("redeemMonitor.noExchangeRecords") }}
        </div>
      </template>
      <el-table-column
        prop="createdAt"
        :label="t('redeemMonitor.exchangeDate')"
        width="150"
      >
        <template #default="scope">
          {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        :label="t('redeemMonitor.userName')"
        min-width="220"
      >
        <template #default="scope">
          <div class="item-cell">
            <el-avatar
              :size="32"
              :src="scope.row.avatarUrl"
              style="margin-right: 16px"
            />
            <span
              >{{ scope.row.userName }} ({{ scope.row.lifeTimePoints }} /
              {{ scope.row.redeemablePoints }})</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="t('redeemMonitor.itemName')"
        min-width="300"
      />
      <el-table-column
        prop="pointsChange"
        :label="t('redeemMonitor.pointsChange')"
        width="120"
      />
      <el-table-column
        prop="redeemReview"
        :label="t('redeemMonitor.status')"
        width="150"
      >
        <template #default="scope">
          <!-- 已审核状态 -->
          <div
            v-if="scope.row.redeemReview"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span class="ml-1">{{ t("redeemMonitor.approved") }}</span>
          </div>
          <!-- 待审核状态 -->
          <div
            v-else
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-orange-100 text-orange-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="ml-1">{{ t("redeemMonitor.pending") }}</span>
          </div>

          <!-- <el-tag v-if="scope.row.redeemReview" type="success" effect="dark">{{
            t("redeemMonitor.approved")
          }}</el-tag>
          <el-tag v-else type="info" effect="dark">
            {{ t("redeemMonitor.pending") }}
          </el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="redeemReviewUserName"
        :label="t('redeemMonitor.redeemReviewUserName')"
        width="120"
      />
      <el-table-column
        prop="operation"
        :label="t('redeemMonitor.operation')"
        width="120"
      >
        <template #default="scope">
          <button
            v-if="!scope.row.redeemReview"
            @click="handleReview(scope.row)"
            class="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-white h-9 rounded-md px-3 bg-green-600 hover:bg-green-700"
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
              class="lucide lucide-check h-4 w-4"
            >
              <path d="M20 6 9 17 4 12"></path>
            </svg>
            {{ t("redeemMonitor.approve") }}
          </button>

          <!-- <el-button
            v-if="!scope.row.redeemReview"
            type="primary"
            @click="handleReview(scope.row)"
            >{{ t("redeemMonitor.approve") }}</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end items-center mt-[20px]">
      <el-pagination
        v-model:current-page="pagination.pageNo"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[30, 50, 100]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { getRecordPage, updateRecord } from "@/api/pmApi";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const { t } = useI18n();

const exchangeList = ref([]);

// 点击审核
const handleReview = (row: any) => {
  // 获取当前用户信息
  // const dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  // console.log("审核兑换记录", row, dataSource?.id);
  let dataSource: { id?: string | number; username?: string } = {};
  try {
    dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  } catch (e) {
    console.warn("解析用户信息失败:", e);
  }

  if (!dataSource?.id) {
    ElMessage.warning(t("redeemMonitor.parseUserInfoFailed"));
    return;
  }

  ElMessageBox.confirm(
    `${t("redeemMonitor.confirmApproveExchangeRecord")} 【${row.userName} - ${row.remark}】？`,
    t("redeemMonitor.approvePass"),
    {
      confirmButtonText: t("redeemMonitor.confirm"),
      cancelButtonText: t("redeemMonitor.cancel"),
      type: "warning"
    }
  )
    .then(() => {
      fetchUpdateRecord({
        id: row.id,
        redeemReview: 1,
        redeemReviewUserId: dataSource?.id
      });
    })
    .catch(() => {});
};

//#region 分页逻辑
const pagination = reactive({
  total: 0,
  pageSize: 30,
  pageNo: 1
});
// // 分页大小改变
// const handleSizeChange = (val: number) => {
//   pagination.pageSize = val;
//   // fetchRecordPage();
// };
// // 分页当前页改变
// const handleCurrentChange = (val: number) => {
//   pagination.pageNo = val;
//   // fetchRecordPage();
// };
//#endregion

//#region 搜索逻辑
const searchForm = reactive({
  userName: "",
  redeemReview: ""
});
const handleSearch = () => {
  fetchRecordPage();
};
const handleSearchStr = () => {
  const searchStr = [
    {
      searchName: "pointTypeId",
      searchType: "equals",
      searchValue: '"97"'
    }
  ];
  if (searchForm.userName) {
    searchStr.push({
      searchName: "username",
      searchType: "like",
      searchValue: searchForm.userName
    });
  }
  if (searchForm.redeemReview) {
    searchStr.push({
      searchName: "redeemReview",
      searchType: "equals",
      searchValue: `"${searchForm.redeemReview}"`
    });
  }
  return JSON.stringify(searchStr);
};
// 重置搜索
const handleReset = () => {
  searchForm.userName = "";
  searchForm.redeemReview = "";
  fetchRecordPage();
};
//#endregion

//#region 请求逻辑
// 获取兑换记录
const fetchRecordPage = () => {
  getRecordPage({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    searchStr: handleSearchStr(),
    sortStr: ""
  })
    .then((res: any) => {
      if (res.code === 200) {
        // console.log("兑换记录", res.data || []);

        // 如果当前页大于总页数，重置为最后一页 排除总页数为0的情况
        if (res.data?.current > res.data?.pages && res.data?.total !== 0) {
          pagination.pageNo = res.data?.pages;
          return;
        }

        // 更新总页数
        pagination.total = res.data?.total || 0;

        exchangeList.value = res.data?.records || [];
      } else {
        ElMessage.error(
          res.msg || t("redeemMonitor.fetchExchangeRecordFailed")
        );
      }
    })
    .catch((err: any) => {
      ElMessage.error(err.msg || t("redeemMonitor.fetchExchangeRecordFailed"));
    });
};
// 审核兑换记录
const fetchUpdateRecord = (data: any) => {
  updateRecord(data)
    .then((res: any) => {
      if (res.code === 200) {
        // console.log("审核兑换记录", res.data || []);
        ElMessage.success(t("redeemMonitor.approveSuccess"));
        fetchRecordPage();
      } else {
        ElMessage.error(
          res.msg || t("redeemMonitor.approveExchangeRecordFailed")
        );
      }
    })
    .catch((err: any) => {
      ElMessage.error(
        err.msg || t("redeemMonitor.approveExchangeRecordFailed")
      );
    });
};
//#endregion

onMounted(() => {
  fetchRecordPage();
});

// 监听分页参数变化
watch(() => [pagination.pageNo, pagination.pageSize], fetchRecordPage);
</script>

<style scoped>
.exchange-history-card {
  padding: 32px 32px 24px;
  border-radius: 16px;
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

.item-cell {
  display: flex;
  align-items: center;
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

.bg-green-600 {
  background-color: #059669;
}
</style>
