<template>
  <el-card class="recent-activity">
    <div class="activity-title">
      <el-icon style="margin-right: 8px; vertical-align: middle"
        ><Clock
      /></el-icon>
      最近活动
    </div>
    <div class="activity-list">
      <div
        v-for="(item, idx) in pagedActivities"
        :key="idx"
        class="activity-row"
      >
        <div class="activity-info">
          <div class="activity-name">{{ item.name }}</div>
          <div class="activity-time">{{ item.time }}</div>
        </div>
        <div class="activity-extra">
          <span :class="item.score > 0 ? 'score-plus' : 'score-minus'">
            {{ item.score > 0 ? "+" : "" }}{{ item.score }}
          </span>
          <el-tag size="small" effect="plain" style="margin-left: 8px">{{
            item.type
          }}</el-tag>
        </div>
      </div>
    </div>
    <div class="activity-pagination">
      <el-pagination
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :total="activities.length"
        v-model:current-page="currentPage"
      />
    </div>
  </el-card>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import { Clock } from "@element-plus/icons-vue";
const props = defineProps({
  activities: { type: Array, default: () => [] }
});

const pageSize = 5;
const currentPage = ref(1);
const pagedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return props.activities.slice(start, start + pageSize);
});
</script>

<style scoped>
.recent-activity {
  margin-top: 32px;
}

.activity-title {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  font-size: 22px;
  font-weight: bold;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0 10px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-row:last-child {
  border-bottom: none;
}

.activity-info {
  display: flex;
  flex-direction: column;
}

.activity-name {
  font-size: 17px;
  font-weight: 500;
  color: #222;
}

.activity-time {
  margin-top: 2px;
  font-size: 13px;
  color: #888;
}

.activity-extra {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 120px;
}

.score-plus {
  font-size: 17px;
  font-weight: bold;
  color: #21ba45;
}

.score-minus {
  font-size: 17px;
  font-weight: bold;
  color: #db2828;
}

.activity-pagination {
  display: flex;
  justify-content: start;
  margin-top: 24px;
  margin-bottom: 8px;
}
</style>
