<template>
  <div>
    <!-- 新增产品按钮 -->
    <div class="flex justify-between items-center">
      <div class="container">
        <h2 class="text-2xl font-bold">{{ $t("history.pointshistory") }}</h2>
        <el-select
          style="width: 240px"
          v-model="searchInfo.recordTypeId"
          :placeholder="$t('history.pointplaceholder')"
          clearable
        >
          <el-option
            v-for="item in enumTypeList"
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
import { getEnumTypeList } from "@/api/pmApi.ts";
import productList from "./productList.vue";
const statusList = ref([]);
const listRef = ref(null);
const searchInfo = ref({
  recordTypeId: "all",
  productNo: "",
  productName: ""
});
const enumTypeList = ref([]);

const fetchEnumTypeList = () => {
  getEnumTypeList({ type: "pointType" }).then(res => {
    if (res?.code === 200) {
      const tempArr = res.data?.map(item => {
        return {
          label: item.value,
          value: item.id
        };
      });
      tempArr.unshift({
        label: "全部",
        value: "all"
      });
      enumTypeList.value = tempArr;
    }
  });
};

fetchEnumTypeList();
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
