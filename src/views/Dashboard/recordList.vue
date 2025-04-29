<template>
  <div>
    <!-- 溯源记录弹窗 -->
    <el-dialog v-model="visible" title="溯源记录" @close="handleClose">
      <div class="container">
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
        <el-date-picker
          clearable
          v-model="searchInfo.productionDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择生产日期"
        />
      </div>
      <div class="h-[70vh] overflow-auto">
        <!-- 使用卡片展示 recordList 的内容 -->
        <div
          v-if="recordList.length"
          v-for="record in recordList"
          :key="record.id"
          class="record-card"
        >
          <el-card @click="openDetail(record)" class="hover-card">
            <div class="relative">
              <p><strong>产品编号:</strong> {{ record.productNo }}</p>
              <p><strong>产品名称:</strong> {{ record.productName }}</p>
              <p>
                <strong>生产日期:</strong>
                {{ dayjs(record.productionDate).format("YYYY-MM-DD") }}
              </p>
              <p>
                <strong>产品状态:</strong>
                <el-tag
                  class="mx-1"
                  :type="record.status === 22 ? 'success' : 'info'"
                >
                  {{ record.statusName }}
                </el-tag>
              </p>
              <el-button
                type="danger"
                class="absolute right-0 top-0"
                @click.stop="deleteRecord(record)"
                >删除</el-button
              >
            </div>
          </el-card>
        </div>
        <div class="w-full h-full flex justify-center items-center" v-else>
          暂无记录
        </div>
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="pagination.pageNo"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="
          justify-content: center;
          width: 100%;
          margin-top: 20px;
          text-align: center;
        "
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openAddRecord">新增记录</el-button>
      </span>
    </el-dialog>
    <!-- 新增记录弹窗 -->

    <AddRecord
      v-if="showAddRecord"
      v-model:visible="showAddRecord"
      @close="closeAddRecord"
      :selectedRecord="selectedRecord"
      :details="details"
      :isEdit="isEdit"
      :statusList="statusList"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import AddRecord from "./AddRecord.vue";
import { getMiddleCheck, deleteMiddleCheck } from "@/api/pmApi.ts";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { debounce, storageLocal } from "@pureadmin/utils";
import { reverseMappingRecord } from "./utils";
const emits = defineEmits(["refresh"]);

const searchInfo = ref({
  status: "",
  productionDate: ""
});
const { details, statusList } = defineProps({
  details: {
    // 产品维护列表，选中行数据
    type: Object,
    required: true
  },
  statusList: {
    type: Array,
    default: () => []
  }
});

const visible = defineModel("visible");
const showAddRecord = ref(false);
const recordList = ref([]);
const isEdit = ref(false);
const selectedRecord = ref({});
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});

watch(
  [searchInfo],
  () => {
    debounce(() => {
      getData();
    }, 500)();
  },
  { deep: true }
);

const handleClose = () => {
  visible.value = false;
  emits("refresh");
};

const deleteRecord = record => {
  // 这里可以处理删除记录的逻辑
  console.log("删除记录:", record);
  deleteMiddleCheck(record).then(res => {
    console.log("删除结果:", res);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};

const openDetail = record => {
  // 这里可以处理打开详情的逻辑
  selectedRecord.value = record;
  isEdit.value = true;
  showAddRecord.value = true;
};

const openAddRecord = () => {
  isEdit.value = false;

  showAddRecord.value = true;
};

const closeAddRecord = () => {
  console.log("closeAddRecord");
  showAddRecord.value = false;
  searchInfo.value = {
    status: "",
    productionDate: ""
  };
  getData();
};

const addRecord = newRecord => {
  // 这里可以处理新增记录的逻辑，例如将新记录添加到 details 中
  console.log("新增记录:", newRecord);
  closeAddRecord();
};

const getData = () => {
  const flowId = details.id;
  const searchArr = [];
  searchArr.push({
    searchName: "flowId",
    searchType: "equals",
    searchValue: flowId
  });
  Object.keys(searchInfo.value).forEach(key => {
    const searchParams = {};
    if (searchInfo.value[key]) {
      searchParams.searchName = key;
      searchParams.searchType = "equals";
      searchParams.searchValue = searchInfo.value[key];
      searchArr.push(searchParams);
    }
  });
  getMiddleCheck({
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize,
    searchStr: JSON.stringify(searchArr)
  }).then(res => {
    console.log("中间检查记录:", res);
    recordList.value = reverseMappingRecord(res.data.records);
    pagination.value.total = res.data.total;
  });
};

const handlePageChange = pageNo => {
  pagination.value.pageNo = pageNo;
  getData();
};

getData();
</script>

<style scoped>
.record-card {
  margin-bottom: 20px;
}

.hover-card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.hover-card:hover {
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: translateY(-5px);
}

.container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}
</style>
