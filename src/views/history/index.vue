<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">{{ $t("pointshistory") }}</h2>
        <el-select
          style="width: 240px"
          v-model="searchInfo.status"
          :placeholder="$t('pointplaceholder')"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <!-- 产品列表 -->
    <productList
      ref="listRef"
      :searchInfo="searchInfo"
      :statusList="statusList"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { fetchStatusList } from "@/api/pmApi.ts";
import productList from "./productList.vue";
const statusList = ref([]);
const listRef = ref(null);
const searchInfo = ref({
  status: "",
  productNo: "",
  productName: ""
});

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
