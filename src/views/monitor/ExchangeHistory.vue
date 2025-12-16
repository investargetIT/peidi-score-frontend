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
              :size="48"
              :src="scope.row.avatarUrl"
              style="margin-right: 16px"
            />
            <span
              >{{ scope.row.userName }}({{ scope.row.lifeTimePoints }}/{{
                scope.row.redeemablePoints
              }})</span
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
        width="120"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.redeemReview" type="success" effect="dark">{{
            t("redeemMonitor.approved")
          }}</el-tag>
          <el-tag v-else type="info" effect="dark">
            {{ t("redeemMonitor.pending") }}
          </el-tag>
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
          <el-button
            v-if="!scope.row.redeemReview"
            type="primary"
            @click="handleReview(scope.row)"
            >{{ t("redeemMonitor.approve") }}</el-button
          >
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
  const dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  // console.log("审核兑换记录", row, dataSource?.id);
  ElMessageBox.confirm(
    `${t("redeemMonitor.confirmApproveExchangeRecord")} 【${row.userName} - ${row.remark}】？`,
    "Warning",
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
// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  fetchRecordPage();
};
// 分页当前页改变
const handleCurrentChange = (val: number) => {
  pagination.pageNo = val;
  fetchRecordPage();
};
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
</style>
