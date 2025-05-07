<template>
  <div class="mt-3 rounded-sm">
    <el-table
      :data="tableData"
      style="width: 100%"
      :empty-text="t('table.emptyText')"
    >
      <el-table-column :label="t('leaderboard.rank')">
        <template #default="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullName" :label="t('leaderboard.user')">
        <template #default="scope">
          <div class="flex gap-2">
            <span>
              <img :src="avatarUrls[scope.row.id]" alt="" />
            </span>
            <span>{{ scope.row.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="bothPoints"
        :label="t('leaderboard.totalpoints')"
      ></el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePageChange"
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next"
      :total="pagination.total"
      style="width: 100%; margin-top: 20px; text-align: center"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { getScoreRankList, getFileDownLoadPath } from "@/api/pmApi.ts";
const tableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});
const { t } = useI18n();
const dialogImageUrl = ref("");
const avatarUrls = ref({});

const getPreviewUrl = async (file, userId) => {
  if (!file) return "";
  try {
    const fileInfo = JSON.parse(file) || [];
    const res = await getFileDownLoadPath({
      objectName: "ui/user/" + fileInfo?.[0]?.response?.data
    });
    if (res.code === 200) {
      avatarUrls.value[userId] = res.data;
      return res.data;
    }
    return "";
  } catch (err) {
    console.log(err);
    return "";
  }
};

interface IQueryParams {
  pageNo: number;
  pageSize: number;
  sortStr?: string;
}

const fetchProductList = async () => {
  const commonInfo: IQueryParams = {
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize
  };
  commonInfo.sortStr = JSON.stringify([
    { sortName: "bothPoints", sortType: "desc" }
  ]);
  const res = await getScoreRankList(commonInfo);
  if (res?.data?.records) {
    tableData.value = res.data.records;
    pagination.value.total = res.data.total || 0;

    // 预加载所有头像
    for (const record of res.data.records) {
      if (record.avatarUrl) {
        await getPreviewUrl(record.avatarUrl, record.id);
      }
    }
  }
};

const handlePageChange = (pageNo: number) => {
  pagination.value.pageNo = pageNo;
  fetchProductList();
};

fetchProductList();

defineExpose({
  fetchProductList
});
</script>
<style>
.hhh {
  color: red;
}
</style>
