<template>
  <el-card class="exchange-history-card">
    <div class="exchange-title">兑换历史</div>
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
          请先选择一名员工以查看其兑换历史
        </div>
      </template>
      <el-table-column prop="date" label="兑换日期" width="180" />
      <el-table-column label="物品名称" min-width="220">
        <template #default="scope">
          <div class="item-cell">
            <el-avatar
              :size="48"
              :src="scope.row.img"
              style="margin-right: 16px"
            />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="points" label="积分花费" width="120" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === '已完成'"
            type="success"
            effect="dark"
            >已完成</el-tag
          >
          <el-tag v-else type="info" effect="dark">已发货</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
const props = defineProps({
  exchangeList: {
    type: Array,
    default: () => []
  }
});
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
