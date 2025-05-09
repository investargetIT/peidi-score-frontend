<template>
  <el-card class="manage-score">
    <div class="manage-title">{{ t("monitor.manageTitle") }}</div>
    <div class="score-employee-box">
      <template v-if="employee">
        <div class="employee-info-card">
          <el-avatar
            :size="64"
            :src="avatarUrls[employee.id] || defaultAvatar"
            class="employee-avatar"
          />
          <div class="employee-info-main">
            <div class="employee-name">{{ employee.name }}</div>
            <div class="employee-email">
              {{ employee.email || "john.doe@example.com" }}
            </div>
            <!-- <div class="employee-dept">{{ employee.dept }}</div> -->
            <div class="employee-scores">
              <div class="score-block">
                <div class="score-label">{{ t("monitor.exchangeable") }}</div>
                <div class="score-value">
                  {{ changeNumberFormat(employee.redeemablePoints) }}
                </div>
              </div>
              <div class="score-block">
                <div class="score-label">{{ t("monitor.longTerm") }}</div>
                <div class="score-value">
                  {{ changeNumberFormat(employee.lifeTimePoints) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="score-employee placeholder">
        {{ t("monitor.selectEmployee") }}
      </div>
    </div>
    <div class="score-form-row">
      <div class="score-label">{{ t("monitor.adjustOption") }}</div>
      <el-select
        v-model="form.reason"
        :placeholder="t('monitor.selectReason')"
        class="score-select"
      >
        <el-option
          v-for="item in pointRuleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-form :model="form" label-width="0" class="score-form">
      <el-form-item>
        <el-button
          class="score-btn"
          type="primary"
          :disabled="!employee || !form.reason"
          color="#161718"
          @click="handleSubmit"
        >
          {{ t("monitor.submit") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    :title="t('monitor.confirmChangeTitle')"
    width="420px"
    :close-on-click-modal="false"
  >
    <div>
      <div style="margin-bottom: 16px; font-size: 16px; color: #888">
        {{ t("monitor.confirmChangeDesc", { employee: employee?.name || "" }) }}
      </div>
      <div style="margin-bottom: 8px; font-size: 18px; font-weight: bold">
        {{ reasonText }}
      </div>
      <div
        :style="{
          color: reasonValue > 0 ? '#21ba45' : '#db2828',
          fontSize: '20px',
          fontWeight: 'bold'
        }"
      >
        {{ reasonValue > 0 ? "+" : "" }}{{ reasonValue }}
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">{{
        t("monitor.cancel")
      }}</el-button>
      <el-button type="primary" @click="onDialogConfirm">{{
        t("monitor.confirm")
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { changeNumberFormat } from "@/utils/common";
import { updateUseScore, getPointRuleList } from "@/api/pmApi";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const pointRuleList = ref([]);

const props = defineProps({
  employee: Object,
  avatarUrls: {
    type: Object,
    default: () => ({})
  },
  fetchUserListData: Function,
  setSelectedEmployee: Function
});

const form = ref({
  reason: "",
  points: 0
});

const dialogVisible = ref(false);

const reasonText = computed(() => {
  return (
    pointRuleList.value.find(item => item.value === form.value.reason)?.label ||
    ""
  );
});

const reasonValue = computed(() => {
  return (
    pointRuleList.value.find(item => item.value === form.value.reason)
      ?.pointsChange || 0
  );
});

const handleSubmit = () => {
  dialogVisible.value = true;
};

const onDialogConfirm = async () => {
  dialogVisible.value = false;
  const res = await updateUseScore({
    userId: props.employee.userId,
    ruleId: form.value.reason
  });
  if (res?.code === 200) {
    ElMessage.success(t("monitor.updateSuccess"));
    if (props.fetchUserListData && props.setSelectedEmployee) {
      const prevId = props.employee?.id;
      await props.fetchUserListData();
      props.setSelectedEmployee(prevId);
    }
  } else {
    ElMessage.error(t("monitor.updateFailed"));
  }
};

watch(
  () => props.employee,
  newVal => {
    console.log("employee changed:", newVal);
  }
);

const fetchPointRuleList = () => {
  getPointRuleList({ pageNo: 1, pageSize: 1000 }).then(res => {
    if (res?.code === 200) {
      pointRuleList.value = res?.data?.records?.map(item => {
        return {
          ...item,
          label: `${item.actionName} (${item?.pointsChange > 0 ? "+" : ""}${item?.pointsChange})`,
          value: item.id
        };
      });
    }
  });
};

fetchPointRuleList();
</script>

<style scoped>
.manage-score {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  padding: 24px 32px 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
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

.score-form {
  width: 100%;
}

.score-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.score-form :deep(.el-form-item__content) {
  width: 100%;
  margin-left: 0 !important;
}

.score-btn {
  width: 100%;
  height: 48px;
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
}
</style>
