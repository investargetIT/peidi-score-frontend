<template>
  <el-card class="manage-score">
    <div class="manage-title">{{ t("monitor.manageTitle") }}</div>
    <div class="score-employee-box">
      <template v-if="modelValue?.length === 1 && employee">
        <div class="employee-info-card">
          <el-avatar
            :size="64"
            :src="avatarUrls[employee.id] || Avatar"
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
                <div class="score-label">{{ t("monitor.longTerm") }}</div>
                <div class="score-value">
                  {{ changeNumberFormat(employee.lifeTimePoints) }}
                </div>
              </div>
              <div class="score-block">
                <div class="score-label">{{ t("monitor.exchangeable") }}</div>
                <div class="score-value">
                  {{ changeNumberFormat(employee.redeemablePoints) }}
                </div>
              </div>
              <div class="score-block">
                <div class="score-label">{{ t("monitor.education") }}</div>
                <div class="score-value">{{ employee.education }}</div>
              </div>
              <div class="score-block">
                <div class="score-label">{{ t("monitor.hiredDate") }}</div>
                <div class="score-value">{{ employee.hireDate }}</div>
              </div>
            </div>
          </div>
          <div class="self-baseline">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('monitor.adjustEmployeeInfo')"
              placement="top-start"
            >
              <el-button type="primary" @click="showInfoDialog">{{
                t("monitor.adjustInfo")
              }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </template>
      <template v-else-if="modelValue?.length > 1">
        <div class="multi-employee-info">
          <div class="selected-count">
            {{ t("monitor.selectedCount") }} {{ `(${modelValue.length})` }}
          </div>
          <div class="selected-names">{{ selectedEmployeeNames }}</div>
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
        filterable
        clearable
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
        {{ t("monitor.confirmChangeDesc", { selectedEmployeeNames }) }}
      </div>
      <template v-if="otherRuleMap[form.reason]">
        <el-form :model="ohterForm" class="score-form">
          <el-form-item :label="t('monitor.otherReason')" :error="reasonError">
            <el-input
              style="width: 240px"
              v-model="ohterForm.reasonValue"
              :placeholder="t('monitor.enterReason')"
              @input="validateReason"
            />
          </el-form-item>

          <el-form-item
            :label="t('monitor.remark')"
            :error="reasonError"
            style="margin-top: 16px"
          >
            <el-input
              style="width: 240px"
              v-model="ohterForm.remark"
              :placeholder="t('monitor.remark')"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
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
      </template>
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
  <el-dialog
    v-model="infoDialogVisible"
    :title="t('monitor.adjustInfo')"
    width="420px"
    :close-on-click-modal="false"
  >
    <el-form :model="infoDialogForm" label-width="100px">
      <el-form-item
        :label="t('monitor.education')"
        prop="education"
        :rules="[
          {
            required: true,
            message: t('monitor.pleaseSelectEducation'),
            trigger: 'blur'
          }
        ]"
      >
        <el-select
          v-model="infoDialogForm.education"
          :placeholder="t('monitor.pleaseSelectEducation')"
          style="max-width: 220px"
        >
          <el-option
            v-for="item in validEducation"
            :key="item.id"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('monitor.hiredDate')"
        prop="employment"
        :rules="[
          {
            required: true,
            message: t('monitor.pleaseSelectHiredDate'),
            trigger: 'blur'
          }
        ]"
      >
        <el-date-picker
          v-model="infoDialogForm.employment"
          type="date"
          :placeholder="t('monitor.pleaseSelectHiredDate')"
          :clearable="false"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="handleInfoDialogSubmit"
          :loading="infoLoading"
        >
          {{ t("monitor.updateInfo") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { changeNumberFormat } from "@/utils/common";
import {
  updateUseScore,
  getPointRuleList,
  addScoreAction,
  getEnumTypeList,
  updateUserInfo
} from "@/api/pmApi";
import { ElMessage } from "element-plus";
import Avatar from "@/assets/user.jpg";
import { storageLocal } from "@pureadmin/utils";
import dayjs from "dayjs";

const { t } = useI18n();
const pointRuleList = ref([]);

const emit = defineEmits(["setSelectedEmployee", "update:modelValue"]);
const props = defineProps({
  employee: Object,
  avatarUrls: {
    type: Object,
    default: () => ({})
  },
  fetchUserListData: Function,
  setSelectedEmployee: Function,
  modelValue: Array,
  backEmployees: Array
});
const checkedIds = ref(props.modelValue ? [...props.modelValue] : []);

const form = ref({
  reason: ""
});

const ohterForm = ref({
  reasonValue: "",
  remark: ""
});

const dialogVisible = ref(false);
const reasonError = ref("");
const otherRuleMap = {
  chairman: "【业绩突破类】-【重大贡献】-董事长特别提名奖",
  manager: "【业绩突破类】-【重大贡献】-总经理特别提名奖",
  company: "【业绩突破类】-【重大贡献】-公司重大贡献",
  personal: "【日常管理类】-【年度评优】-评优个人奖",
  team: "【日常管理类】-【年度评优】-评优团队奖",
  certificate: "【日常管理类】-【技能提升】-岗位专业证书考取",
  special: "【日常管理类】-【技能提升】-公司需要特种证照考取",
  teacher: "【日常管理类】-【技能提升】-技能传授/带教",
  other: "【其他】"
};

watch(
  () => props.modelValue,
  val => {
    checkedIds.value = val ? [...val] : [];
  }
);

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

const validateReason = () => {
  // 只允许整数
  if (!/^[-]?\d+$/.test(ohterForm.value.reasonValue)) {
    reasonError.value = t("monitor.onlyInteger");
  } else {
    reasonError.value = "";
  }
};

const onDialogConfirm = async () => {
  // 校验整数
  if (
    otherRuleMap[form.value.reason] &&
    !/^[-]?\d+$/.test(ohterForm.value.reasonValue)
  ) {
    reasonError.value = t("monitor.onlyInteger");
    return;
  }
  let curRuleId = form.value.reason;
  // 当选择类型为其他时，新增规则
  if (otherRuleMap[form.value.reason]) {
    const res = await addScoreAction({
      actionName: otherRuleMap[form.value.reason] + ohterForm.value.remark,
      pointsChange: ohterForm.value.reasonValue
    });
    if (res?.code === 200) {
      curRuleId = res?.data;
    }
  }

  const tempArr =
    props.backEmployees
      ?.filter(item => props.modelValue?.includes(item?.id))
      ?.map(item => item.userId) || [];
  // 获取所有选中用户的userId
  const userIds =
    props.modelValue?.length === 1 ? [props.employee.userId] : tempArr;
  const res = await updateUseScore({
    userIds,
    ruleId: curRuleId,
    updateUserId: storageLocal().getItem("dataSource")?.id || ""
  });

  if (res?.code === 200) {
    ElMessage.success(t("monitor.updateSuccess"));
    const list = await props.fetchUserListData();
    if (Array.isArray(list) && list.length > 0) {
      if (props.modelValue?.length === 1) {
        // 单个用户时，保持原有逻辑
        const prevId = props.employee?.id;
        const newEmp = list.find(e => e && e.id === prevId);
        // emit("setSelectedEmployee", { ...newEmp });
        // emit("update:modelValue", []);
      } else {
        // 多个用户时，清空选择
        // emit("setSelectedEmployee", null);
        emit("update:modelValue", []);
      }
    } else {
      // 找不到时清空状态
      emit("setSelectedEmployee", null);
      emit("update:modelValue", []);
    }
    dialogVisible.value = false;
    form.value.reason = ""; // 重置选择
  } else {
    ElMessage.error(t("monitor.updateFailed"));
  }
};

const fetchPointRuleList = () => {
  getPointRuleList({ pageNo: 1, pageSize: 1000 }).then(res => {
    if (res?.code === 200) {
      const tempArr = res?.data?.records?.map(item => {
        return {
          ...item,
          label: `${item.actionName} (${item?.pointsChange > 0 ? "+" : ""}${item?.pointsChange})`,
          value: item.id
        };
      });
      Object.keys(otherRuleMap).forEach(key => {
        tempArr.push({
          label: otherRuleMap[key],
          value: key
        });
      });
      pointRuleList.value = tempArr;
      pointRuleList.value = tempArr;
    }
  });
};

const selectedEmployeeNames = computed(() => {
  if (!props.modelValue || !Array.isArray(props.modelValue)) return "";
  return props.backEmployees
    .filter(item => props.modelValue.includes(item.id))
    .map(item => item.name)
    .join(", ");
});

fetchPointRuleList();

//#region 调整学历或入职日期逻辑
const infoLoading = ref(false);
const validEducation = ref(""); // 有效学历
const infoDialogVisible = ref(false);
const infoDialogForm = reactive({
  education: "",
  employment: ""
});
watch(
  () => props.employee,
  val => {
    if (val) {
      infoDialogForm.education = val.education || "";
      infoDialogForm.employment = val.hireDate || "";
    }
  },
  { immediate: true }
);
const showInfoDialog = () => {
  infoDialogVisible.value = true;
};
const handleInfoDialogSubmit = () => {
  infoLoading.value = true;
  updateUserInfo({
    ...props.employee,
    education: infoDialogForm.education,
    hireDate: dayjs(infoDialogForm.employment).format("YYYY-MM-DD")
  })
    .then(async res => {
      if (res?.code === 200) {
        ElMessage.success(t("monitor.updateUserInfoSuccess"));
        infoDialogVisible.value = false;
        const list = await props.fetchUserListData();
      } else {
        ElMessage.error(res?.msg || t("monitor.updateUserInfoFailed"));
      }
    })
    .catch(err => {
      ElMessage.error(err?.msg || t("monitor.updateUserInfoFailed"));
    })
    .finally(() => {
      infoLoading.value = false;
    });
};
// 获取学历枚举方法
const fetchEducationEnum = () => {
  getEnumTypeList({ type: "education" })
    .then(res => {
      if (res?.code === 200) {
        validEducation.value = res?.data || "";
      } else {
        ElMessage.error(res?.msg || t("monitor.fetchEducationEnumFailed"));
      }
    })
    .catch(err => {
      ElMessage.error(err?.msg || t("monitor.fetchEducationEnumFailed"));
    });
};
fetchEducationEnum();
//#endregion
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

.multi-employee-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 0 24px;
}

.selected-count {
  font-size: 20px;
  font-weight: bold;
  color: #222;
}

.selected-names {
  max-height: 465px;
  overflow-y: auto;
  font-size: 16px;
  color: #666;
  text-align: center;
  word-break: break-all;
}
</style>
