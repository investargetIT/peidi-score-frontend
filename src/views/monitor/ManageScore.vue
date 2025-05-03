<template>
  <el-card class="manage-score">
    <div class="manage-title">管理积分</div>
    <div class="score-employee-box">
      <template v-if="employee">
        <div class="employee-info-card">
          <el-avatar
            :size="64"
            :src="employee.avatar || avatarImg"
            class="employee-avatar"
          />
          <div class="employee-info-main">
            <div class="employee-name">{{ employee.name }}</div>
            <div class="employee-email">
              {{ employee.email || "john.doe@example.com" }}
            </div>
            <div class="employee-dept">{{ employee.dept }}</div>
            <div class="employee-scores">
              <div class="score-block">
                <div class="score-label">可兑换</div>
                <div class="score-value">2,500</div>
              </div>
              <div class="score-block">
                <div class="score-label">长期</div>
                <div class="score-value">2,500</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="score-employee placeholder">选择员工</div>
    </div>
    <div class="score-form-row">
      <div class="score-label">调整选项</div>
      <el-select v-model="reason" placeholder="选择原因" class="score-select">
        <el-option label="业绩奖励" value="reward" />
        <el-option label="违规扣分" value="penalty" />
        <el-option label="其他" value="other" />
      </el-select>
    </div>
    <el-button
      class="score-btn"
      type="primary"
      :disabled="!employee || !reason"
      style="width: 100%"
      >调整积分</el-button
    >
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue";
import avatarImg from "@/assets/login/avatar.svg";
const props = defineProps({
  employee: Object
});
const reason = ref("");
watch(
  () => props.employee,
  () => {
    reason.value = "";
  }
);
</script>

<style scoped>
.manage-score {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 24px 32px 32px;
}

.manage-title {
  margin-bottom: 18px;
  font-size: 24px;
  font-weight: bold;
}

.score-employee-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 32px 0 24px;
  margin-bottom: 28px;
  font-size: 22px;
  color: #888;
  background: #fafcfb;
  border-radius: 8px;
}

.employee-info-card {
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.employee-avatar {
  flex-shrink: 0;
}

.employee-info-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.employee-name {
  margin-bottom: 4px;
  font-size: 26px;
  font-weight: bold;
  color: #222;
}

.employee-email {
  margin-bottom: 2px;
  font-size: 16px;
  color: #888;
}

.employee-dept {
  margin-bottom: 12px;
  font-size: 16px;
  color: #888;
}

.employee-scores {
  display: flex;
  gap: 48px;
  margin-top: 8px;
}

.score-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  margin-bottom: 2px;
  font-size: 15px;
  color: #888;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  color: #222;
}

.placeholder {
  color: #bbb;
}

.score-form-row {
  margin-bottom: 24px;
}

.score-select {
  width: 100%;
}

.score-btn {
  height: 48px;
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
}
</style>
