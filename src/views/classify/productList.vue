<template>
  <div class="mt-3 rounded-sm">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="productNo" label="产品编号">
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
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="statusName" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="showDetails(scope.row)">详情</el-button>
          <el-button @click="deleteProductFun(scope.row)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePageChange"
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next"
      :total="pagination.total"
      style="width: 100%; margin-top: 20px; text-align: center"
    ></el-pagination>
    <addProduct
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :details="selectedDetails"
      :isEdit="true"
      @refresh="fetchProductList"
    ></addProduct>
    <recordList
      v-if="recordDialogVisible"
      v-model:visible="recordDialogVisible"
      :details="selectedDetails"
      :statusList="props.statusList"
    ></recordList>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { getProductList, deleteProduct } from "@/api/pmApi.ts";
import UpdateDialog from "./UpdateDialog.vue";
import { reverseMapping, mapping } from "./utils";
import { debounce, storageLocal } from "@pureadmin/utils";
import addProduct from "./addProduct.vue";
import recordList from "./recordList.vue";
import { status } from "nprogress";
const tableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});
const dialogVisible = ref(false);
const recordDialogVisible = ref(false);
const selectedDetails = ref({});

const props = defineProps({
  taskStatus: {
    type: String,
    default: ""
  },
  statusList: {
    type: Array,
    default: () => []
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
  () => props.taskStatus,
  newVal => {
    console.log("taskStatus changed:", newVal);
    debouncedFetch();
  },
  { immediate: true }
);

const fetchProductList = () => {
  const searchStr: any = [];
  const commonInfo: IQueryParams = {
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize
  };
  if (props.taskStatus) {
    searchStr.push({
      searchName: "status",
      searchType: "equals",
      searchValue: props.taskStatus
    });
    commonInfo.searchStr = JSON.stringify(searchStr);
  }
  getProductList(commonInfo).then(res => {
    // 为每个产品添加默认状态
    const products = res.data.records.map(product => ({
      ...product,
      status: "活跃"
    }));
    tableData.value = products.map(product => reverseMapping(product));
    pagination.value.total = res.data.total;
  });
};

const handlePageChange = (pageNo: number) => {
  pagination.value.pageNo = pageNo;
  fetchProductList();
};

const showDetails = row => {
  selectedDetails.value = { ...row };
  console.log("selectedDetails:", selectedDetails.value);

  dialogVisible.value = true;
};

const deleteProductFun = row => {
  deleteProduct(mapping(row)).then(res => {
    if (res.code === 200) {
      ElMessage.success("删除成功");
      fetchProductList();
    }
  });
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
