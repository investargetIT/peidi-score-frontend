<template>
  <div>
    <!-- 溯源记录弹窗 -->
    <el-dialog v-model="visible" title="溯源记录">
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
import { ref } from "vue";
import AddRecord from "./AddRecord.vue";
import { getMiddleCheck, deleteMiddleCheck } from "@/api/pmApi.ts";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { reverseMappingRecord } from "./utils";
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
  getData();
};

const addRecord = newRecord => {
  // 这里可以处理新增记录的逻辑，例如将新记录添加到 details 中
  console.log("新增记录:", newRecord);
  closeAddRecord();
};

const getData = () => {
  const flowId = details.id;
  const searchParams = {
    searchName: "flowId",
    searchType: "equals",
    searchValue: flowId
  };
  getMiddleCheck({
    pageNo: 1,
    pageSize: 100,
    searchStr: JSON.stringify(searchParams)
  }).then(res => {
    console.log("中间检查记录:", res);
    recordList.value = reverseMappingRecord(res.data.records);
    // recordList.value = [
    //   ...recordList.value,
    //   ...recordList.value,
    //   ...recordList.value,
    //   ...recordList.value,
    //   ...recordList.value,
    //   ...recordList.value
    // ];
  });
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
</style>
