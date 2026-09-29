<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">{{ t("redeemMonitor.title") }}</div>

    <!-- 说明条：说明本页用途 -->
    <div class="history-sub-bar">
      <div class="bar-tip">{{ t("redeemMonitor.titleTip") }}</div>
    </div>

    <!-- 筛选 + 批量操作 工具栏 -->
    <div class="filter-bar">
      <el-form :model="searchForm" inline class="filter-form">
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

      <div class="filter-actions">
        <Space>
          <el-button color="#059669" @click="handleBatchPass">
            <el-icon class="el-icon--right"><Check /></el-icon>
            {{ t("redeemMonitor.batchPass") }}
          </el-button>
          <ExHistoryExport />
        </Space>
      </div>
    </div>

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
        min-width="180"
      >
        <template #default="scope">
          <div class="item-cell">
            <el-avatar :size="28" :src="scope.row.avatarUrl || Avatar" />
            <div class="user-info">
              <div class="user-name">{{ scope.row.userName }}</div>
              <div class="user-points">
                <span class="points-item points-long">
                  <span class="dot dot-long"></span
                  >{{ t("redeemMonitor.longTermShort")
                  }}{{ scope.row.lifeTimePoints }}
                </span>
                <span class="points-sep">/</span>
                <span class="points-item points-redeem">
                  <span class="dot dot-redeem"></span
                  >{{ t("redeemMonitor.redeemableShort")
                  }}{{ scope.row.redeemablePoints }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="t('redeemMonitor.itemName')"
        min-width="250"
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
        align="center"
      >
        <template #default="scope">
          <!-- 已审核状态 -->
          <span
            v-if="scope.row.redeemReview"
            class="status-pill status-approved"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{{ t("redeemMonitor.approved") }}</span>
          </span>
          <!-- 待审核状态 -->
          <span v-else class="status-pill status-pending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{{ t("redeemMonitor.pending") }}</span>
          </span>
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
        width="230"
        align="center"
      >
        <template #default="scope">
          <div class="op-actions">
            <button
              v-if="!scope.row.redeemReview"
              class="btn-action btn-reject"
              @click="handleReview(scope.row, 'reject')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              {{ t("redeemMonitor.reject") }}
            </button>

            <button
              v-if="!scope.row.redeemReview"
              class="btn-action btn-pass"
              @click="handleReview(scope.row, 'approvePass')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17 4 12"></path>
              </svg>
              {{ t("redeemMonitor.pass") }}
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end items-center mt-[14px]">
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
import Avatar from "@/assets/user.jpg";
import { storageLocal } from "@pureadmin/utils";
import ExHistoryExport from "./components/exHistoryExport.vue";

const { t } = useI18n();

const exchangeList = ref([]);

// 解析用户信息
const parseDataSource = () => {
  let dataSource: { id?: string | number; username?: string } = {};
  try {
    dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  } catch (e) {
    console.warn("解析用户信息失败:", e);
  }

  if (!dataSource?.id) {
    ElMessage.warning(t("redeemMonitor.parseUserInfoFailed"));
    return null;
  }

  return dataSource;
};

// 点击审核
const handleReview = (row: any, status: "approvePass" | "reject") => {
  // 获取当前用户信息
  // const dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  // console.log("审核兑换记录", row, dataSource?.id);

  const dataSource = parseDataSource();
  if (!dataSource) {
    return;
  }

  if (status === "approvePass") {
    ElMessageBox.confirm(
      `${t("redeemMonitor.confirmPassExchangeRecord")} 【${row.userName} - ${row.remark}】`,
      t("redeemMonitor.pass"),
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
  } else if (status === "reject") {
    ElMessageBox.confirm(
      `${t("redeemMonitor.confirmRejectExchangeRecord")} 【${row.userName} - ${row.remark}】？`,
      t("redeemMonitor.reject"),
      {
        confirmButtonText: t("redeemMonitor.confirm"),
        cancelButtonText: t("redeemMonitor.cancel"),
        type: "warning"
      }
    )
      .then(() => {
        fetchUpdateRecord({
          id: row.id,
          redeemReview: 2,
          redeemReviewUserId: dataSource?.id
        });
      })
      .catch(() => {});
  }
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
  const dataSource = (storageLocal().getItem("dataSource") as any)?.dataSource;
  const searchStr = [
    {
      searchName: "pointTypeId",
      searchType: "equals",
      searchValue: '"97"'
    },
    {
      searchName: "dataSource",
      searchType: "equals",
      searchValue: `"${dataSource}"`
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
      ElMessage.error(
        err.message || t("redeemMonitor.fetchExchangeRecordFailed")
      );
    });
};
// 审核兑换记录
const fetchUpdateRecord = (data: any) => {
  updateRecord(data)
    .then((res: any) => {
      if (res.code === 200) {
        // console.log("审核兑换记录", res.data || []);
        ElMessage.success(t("redeemMonitor.operationSuccess"));
        fetchRecordPage();
      } else {
        ElMessage.error(
          res.msg || t("redeemMonitor.approveExchangeRecordFailed")
        );
      }
    })
    .catch((err: any) => {
      ElMessage.error(
        err.message || t("redeemMonitor.approveExchangeRecordFailed")
      );
    });
};
//#endregion

onMounted(() => {
  fetchRecordPage();
});

// 监听分页参数变化
watch(() => [pagination.pageNo, pagination.pageSize], fetchRecordPage);

// 批量通过
const handleBatchPass = () => {
  const dataSource = parseDataSource();
  if (!dataSource) {
    return;
  }

  ElMessageBox.confirm(
    `${t("redeemMonitor.confirmBatchPass")}`,
    t("redeemMonitor.pass"),
    {
      confirmButtonText: t("redeemMonitor.confirm"),
      cancelButtonText: t("redeemMonitor.cancel"),
      type: "warning"
    }
  )
    .then(async () => {
      // 获取所有待审核的记录
      const pendingItems = exchangeList.value.filter(
        (item: any) => item.redeemReview === 0
      );

      if (pendingItems.length === 0) {
        ElMessage.warning(t("redeemMonitor.noPendingRecords"));
        return;
      }

      try {
        // 创建所有请求的Promise数组
        const requests = pendingItems.map((item: any) => {
          return updateRecord({
            id: item.id,
            redeemReview: 1,
            redeemReviewUserId: dataSource?.id
          });
        });

        // 使用 Promise.allSettled 等待所有请求完成（无论成功或失败）
        const results = await Promise.allSettled(requests);

        const succeeded = results.filter(r => r.status === "fulfilled").length;
        const failed = results.filter(r => r.status === "rejected").length;

        // 根据结果情况显示不同的消息
        if (succeeded > 0 && failed === 0) {
          // 全部成功
          ElMessage.success(
            t("redeemMonitor.batchPassSuccess", { count: succeeded })
          );
        } else if (succeeded > 0 && failed > 0) {
          // 部分成功
          ElMessage.warning(
            t("redeemMonitor.batchPassPartial", { succeeded, failed })
          );
        } else if (succeeded === 0 && failed > 0) {
          // 全部失败
          ElMessage.error(t("redeemMonitor.batchPassFailed"));
        }

        // 刷新列表
        fetchRecordPage();
      } catch (error) {
        // 如果有请求失败，显示错误提示
        ElMessage.error(t("redeemMonitor.batchPassFailed"));
      }
    })
    .catch(() => {});
};
</script>

<style scoped>


/* ===== 移动端适配 ===== */
@media screen and (width <= 768px) {
  .exchange-history-card {
    padding: 16px 12px 12px;
  }

  .exchange-title {
    margin-bottom: 16px;
    font-size: 20px;
  }

  .history-sub-bar {
    padding: 12px 14px;
  }

  /* 筛选表单纵向堆叠 */
  .filter-bar {
    align-items: stretch;
    padding: 12px;
  }

  .filter-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    min-width: 0;
  }

  .filter-form :deep(.el-form-item) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
    width: 100%;
    margin-right: 0;
  }

  .filter-form :deep(.el-form-item__content) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }

  .filter-form :deep(.el-input),
  .filter-form :deep(.el-select) {
    width: 100% !important;
  }

  .filter-form :deep(.el-button) {
    flex: 1;
    margin-left: 0;
  }

  /* 右侧批量操作区换行适配 */
  .filter-actions {
    width: 100%;
  }

  .filter-actions :deep(.el-space) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-actions :deep(.el-space__item) {
    flex: 1;
  }

  /* 分页区域换行居中，避免横向撑破 */
  .flex.justify-end {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    overflow-x: auto;
  }

  .flex.justify-end :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}

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

/* 筛选 + 批量操作 工具栏 */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 20px;
  background: #fafbfc;
  border: 1px solid #f0f1f3;
  border-radius: 12px;
}

.filter-form {
  flex: 1;
  min-width: 320px;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.filter-actions {
  flex-shrink: 0;
}

/* 员工列：头像 + 姓名 + 积分 */
.item-cell {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.user-points {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 11px;
}

.points-item {
  display: inline-flex;
  gap: 3px;
  align-items: center;
}

.points-long {
  font-weight: 600;
  color: #e6a23c;
}

.points-redeem {
  font-weight: 600;
  color: #67c23a;
}

.points-sep {
  color: #c0c4cc;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-long {
  background: #e6a23c;
}

.dot-redeem {
  background: #67c23a;
}

/* 状态徽章 */
.status-pill {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  border-radius: 999px;
}

.status-approved {
  color: #16a34a;
  background: #dcfce7;
}

.status-pending {
  color: #d97706;
  background: #ffedd5;
}

/* 操作按钮 */
.op-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.btn-action {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
}

.btn-action:hover {
  transform: translateY(-1px);
}

.btn-pass {
  color: #fff;
  background: #059669;
  border-color: #059669;
}

.btn-pass:hover {
  background: #047857;
  border-color: #047857;
  box-shadow: 0 2px 6px rgb(5 150 105 / 40%);
}

.btn-reject {
  color: #fff;
  background: #dc2626;
  border-color: #dc2626;
}

.btn-reject:hover {
  background: #b91c1c;
  border-color: #b91c1c;
  box-shadow: 0 2px 6px rgb(220 38 38 / 40%);
}

.exchange-table {
  width: 100%;
  font-size: 14px;
}

/* 紧凑行高与单元格内边距 */
.exchange-table :deep(th.el-table__cell),
.exchange-table :deep(td.el-table__cell) {
  padding: 7px 0;
}

.exchange-table :deep(.el-table__row) {
  height: 52px;
}

.exchange-header th {
  font-size: 15px;
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
