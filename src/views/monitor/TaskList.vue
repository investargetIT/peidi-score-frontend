<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">员工任务</div>
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
          暂无数据
        </div>
      </template>
      <el-table-column prop="fullName" label="员工">
        <template #default="scope">
          <div class="flex gap-2 items-center">
            <el-avatar
              :size="32"
              :src="scope.row.avatarUrl"
              style="margin-right: 12px"
            />
            <span>{{ scope.row.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="截止时间">
        <template #default="scope">
          <span>{{ getDueDate(scope.row.remark) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.remark)" effect="dark">
            {{ getStatusText(scope.row.remark) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-space>
            <el-button type="primary" @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button
              type="success"
              @click="handleApprove(scope.row)"
              :disabled="getStatusText(scope.row.remark) !== '已完成'"
            >
              审核通过
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { getQaList } from "@/api/task";
import { ref } from "vue";

const exchangeList = ref([]);

const getQaListData = () => {
  getQaList().then(res => {
    if (res.code === 200) {
      exchangeList.value = res.data;
    }
  });
};

// 解析remark数据获取截止时间
const getDueDate = remark => {
  try {
    const remarkData = JSON.parse(remark);
    return remarkData.dueDate || "未设置";
  } catch (error) {
    return "未设置";
  }
};

// 获取任务状态文本
const getStatusText = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;

    if (completedQuestions === 0) {
      return "待开始";
    } else if (completedQuestions < totalQuestions) {
      return "进行中";
    } else if (completedQuestions === totalQuestions) {
      return "已完成";
    }
    return "未知状态";
  } catch (error) {
    return "未知状态";
  }
};

// 获取状态标签类型
const getStatusType = remark => {
  try {
    const remarkData = JSON.parse(remark);
    const { totalQuestions = 0, completedQuestions = 0 } = remarkData;

    if (completedQuestions === 0) {
      return "info"; // 待开始 - 灰色
    } else if (completedQuestions < totalQuestions) {
      return "warning"; // 进行中 - 橙色
    } else if (completedQuestions === totalQuestions) {
      return "success"; // 已完成 - 绿色
    }
    return "info";
  } catch (error) {
    return "info";
  }
};

// 查看操作
const handleView = row => {
  console.log("查看", row);
  // TODO: 实现查看详情功能
};

// 审核通过操作
const handleApprove = row => {
  console.log("审核通过", row);
  // TODO: 实现审核通过功能
};

getQaListData();
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
