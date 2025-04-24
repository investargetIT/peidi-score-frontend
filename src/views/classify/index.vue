<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">产品维护列表</h2>
        <el-select
          style="width: 240px"
          v-model="searchInfo.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchInfo.productNo"
          style="width: 240px"
          placeholder="请输入产品编号"
          clearable
        />
        <el-input
          v-model="searchInfo.productName"
          style="width: 240px"
          placeholder="请输入产品名称"
          clearable
        />
      </div>
      <el-button type="primary" color="#161718" @click="handleAddProduct"
        >新增产品</el-button
      >
    </div>
    <!-- 产品列表 -->
    <productList
      ref="listRef"
      :searchInfo="searchInfo"
      :statusList="statusList"
    />
    <!-- 新增产品弹窗 -->
    <addProduct
      v-if="showModal"
      v-model:visible="showModal"
      :factories="factories"
      @refresh="refreshList"
      :saveProduct="saveProduct"
    ></addProduct>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { fetchStatusList } from "@/api/pmApi.ts";
import { ElMessage } from "element-plus";
import factories from "./const";
import addProduct from "./addProduct.vue";
import productList from "./productList.vue";
const showModal = ref(false);
const statusList = ref([]);
const listRef = ref(null);
const searchInfo = ref({
  status: "",
  productNo: "",
  productName: ""
});

const handleAddProduct = () => {
  showModal.value = true;
  searchInfo.value = {
    status: "",
    productNo: "",
    productName: ""
  };
};

const getStatusList = () => {
  fetchStatusList().then(res => {
    if (res.code === 200) {
      statusList.value = res.data?.map(item => {
        return {
          label: item.value,
          value: item.id
        };
      });
    }
  });
};
getStatusList();
const saveProduct = () => {
  // 保存产品逻辑
  console.log("保存产品:", newProduct.value);
  ElMessage.success("产品保存成功");
  showModal.value = false;
};

const refreshList = () => {
  listRef.value.fetchProductList();
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.container {
  display: flex;
  gap: 20px;

  .el-select {
    margin-left: 10px;
  }
}
</style>
