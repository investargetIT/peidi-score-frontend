<template>
  <div class="mt-3 rounded-sm">
    <el-table
      :data="tableData"
      style="width: 100%"
      :empty-text="t('table.emptyText')"
    >
      <el-table-column prop="productNo" :label="$t('leaderboard.rank')">
        <template #default="scope">
          <span
            @click="
              selectedDetails = scope.row;
              recordDialogVisible = true;
            "
            class="cursor-pointer underline"
            >{{ scope.row.productNo }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="statusName" :label="$t('leaderboard.user')">
        <template #default="scope">
          <div class="flex gap-2">
            <el-popover
              v-for="(status, index) in getStatusTags(scope.row.statusName)"
              :key="index"
              placement="top"
              trigger="hover"
              :content="`记录数：${status?.number}`"
            >
              <template #reference>
                <el-tag
                  class="mx-1"
                  :type="status?.text === '审核通过' ? 'success' : 'info'"
                >
                  {{ status?.text }}
                </el-tag>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        :label="$t('leaderboard.totalpoints')"
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
import {
  getProductList,
  deleteProduct,
  getScoreRankList
} from "@/api/pmApi.ts";
import { reverseMapping, mapping } from "./utils";
const tableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});
const dialogVisible = ref(false);
const recordDialogVisible = ref(false);
const selectedDetails = ref({});
const { t } = useI18n();
// 在 computed 部分添加状态转换函数
const getStatusTags = computed(() => {
  return (statusName: string) => {
    if (!statusName) return [];
    return statusName
      .split(",")
      .map(item => item.trim())
      .map(item => {
        const [_, text, number] = item.match(/^([\p{Script=Han}]+)\((\d+)\)$/u);
        return {
          text,
          number
        };
      });
  };
});

interface IQueryParams {
  pageNo: number;
  pageSize: number;
  sortStr?: string;
}

const fetchProductList = () => {
  const commonInfo: IQueryParams = {
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize
  };
  commonInfo.sortStr = JSON.stringify([
    { sortName: "bothPoints", sortType: "desc" }
  ]);
  getScoreRankList(commonInfo).then(res => {
    // 为每个产品添加默认状态
    const products = res.data.records.map(product => ({
      ...product
    }));
    tableData.value = products.map(product => reverseMapping(product));
    pagination.value.total = res.data.total;
  });
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
