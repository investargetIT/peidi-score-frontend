<template>
  <div class="mt-3 rounded-sm">
    <el-table
      :data="tableData"
      style="width: 100%"
      :empty-text="t('table.emptyText')"
    >
      <el-table-column prop="createdAt" :label="t('history.date')">
        <template #default="scope">
          <div class="activity-time">
            {{
              scope.row.createdAt
                ? dayjs(scope.row.createdAt).format("YYYY-MM-DD")
                : "-"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="t('history.description')"
      ></el-table-column>
      <el-table-column prop="recordTypeName" :label="t('history.type')">
      </el-table-column>
      <el-table-column
        prop="pointsChange"
        :label="t('history.points')"
      ></el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePageChange"
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :locale="paginationLocale"
      layout="total, prev, pager, next"
      style="width: 100%; margin-top: 20px; text-align: center"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
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

const paginationLocale = computed(() => {
  return {
    total: t("pagination.total", { total: pagination.value.total })
  };
});

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
  Object.keys(props.searchInfo)?.forEach(key => {
    const searchParams = {} as any;
    if (props.searchInfo[key] && props.searchInfo[key] !== "all") {
      searchParams.searchName = key;
      searchParams.searchType = "like";
      searchParams.searchValue = props.searchInfo[key];
      searchArr.push(searchParams);
    }
  });
  searchArr.push({
    searchName: "userId",
    searchType: "equals",
    searchValue: storageLocal().getItem("dataSource")?.id
  });
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
<style>
.hhh {
  color: red;
}
</style>
