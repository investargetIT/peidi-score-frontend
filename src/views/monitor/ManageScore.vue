<template>
  <el-card class="manage-score">
    <div class="manage-title">{{ t("monitor.manageTitle") }}</div>
    <div class="score-employee-box">
      <template v-if="modelValue?.length > 0">
        <div class="multi-employee-area">
          <div class="selected-count">
            {{ t("monitor.selectedCount") }}（{{ modelValue.length }}）
          </div>
          <div class="info-grid">
            <div
              v-for="emp in selectedEmployeeList"
              :key="emp.id"
              class="employee-info-card info-card"
            >
              <!-- 移除：放在卡片右上角，与加分/编辑分离，防止误操作 -->
              <el-tooltip
                :content="t('monitor.removeEmployee')"
                placement="top"
                :show-after="400"
              >
                <span
                  class="person-remove info-card-remove"
                  @click.stop="handleRemove(emp)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </span>
              </el-tooltip>
              <el-avatar
                :size="44"
                :src="avatarUrls[emp.id] || Avatar"
                class="employee-avatar"
              />
              <div class="employee-info-main">
                <div class="employee-name">{{ emp.name }}</div>
                <div class="employee-email">
                  {{ emp.email || "john.doe@example.com" }}
                </div>
                <div class="employee-scores">
                  <div class="score-block">
                    <div class="score-label">
                      {{ t("monitor.longTerm") }}
                    </div>
                    <div class="score-value">
                      {{ changeNumberFormat(emp.lifeTimePoints) }}
                    </div>
                  </div>
                  <div class="score-block">
                    <div class="score-label">
                      {{ t("monitor.exchangeable") }}
                    </div>
                    <div class="score-value">
                      {{ changeNumberFormat(emp.redeemablePoints) }}
                    </div>
                  </div>
                  <div class="score-block">
                    <div class="score-label">{{ t("monitor.education") }}</div>
                    <div class="score-value">{{ emp.education }}</div>
                  </div>
                  <div class="score-block">
                    <div class="score-label">{{ t("monitor.hiredDate") }}</div>
                    <div class="score-value">{{ emp.hireDate }}</div>
                  </div>
                </div>
                <!-- 月度经费方块：随左侧“团建经费”开关联动，仅杭州基地员工显示 -->
                <FundSquares
                  v-if="showFundSquares && isHangzhouEmployee(emp)"
                  class="card-fund-squares"
                  :monthsUsed="emp.monthsUsed"
                />
              </div>
              <div class="self-baseline multi-card-actions">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="t('monitor.adjustEmployeeInfo')"
                  placement="top-start"
                  :show-after="400"
                >
                  <span
                    class="person-edit"
                    @click.stop="handleSingleEditInfo(emp)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                      />
                    </svg>
                  </span>
                </el-tooltip>
                <el-tooltip
                  :content="t('monitor.singleAddPoints')"
                  placement="top"
                  :show-after="400"
                >
                  <span class="person-plus" @click.stop="handleSingleAdd(emp)">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.6"
                      stroke-linecap="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </span>
                </el-tooltip>
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
          :disabled="modelValue?.length === 0 || !form.reason"
          color="#161718"
          @click="handleSubmit"
        >
          {{
            modelValue?.length > 1
              ? t("monitor.batchAddPoints")
              : t("monitor.submit")
          }}
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
        {{
          t("monitor.confirmChangeDesc", {
            selectedEmployeeNames: dialogTargetNames
          })
        }}
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

          <el-form-item :label="t('monitor.remark')" style="margin-top: 16px">
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
    v-model="singleDialogVisible"
    :title="t('monitor.singleAddPoints')"
    width="440px"
    :close-on-click-modal="false"
  >
    <div class="single-target-line">
      <el-avatar :size="36" :src="avatarUrls[singleTarget?.id] || Avatar" />
      <span class="single-target-name">{{ singleTarget?.name }}</span>
    </div>
    <el-form :model="singleForm" label-width="90px" class="score-form">
      <el-form-item :label="t('monitor.addPointsType')">
        <el-select
          v-model="singleForm.reason"
          :placeholder="t('monitor.selectReason')"
          class="single-type-select"
          filterable
        >
          <el-option
            v-for="item in pointRuleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <template v-if="otherRuleMap[singleForm.reason]">
        <el-form-item
          :label="t('monitor.otherReason')"
          :error="singleReasonError"
        >
          <el-input
            v-model="singleOtherForm.reasonValue"
            :placeholder="t('monitor.enterReason')"
            @input="singleValidateReason"
          />
        </el-form-item>
        <el-form-item :label="t('monitor.remark')">
          <el-input
            v-model="singleOtherForm.remark"
            :placeholder="t('monitor.remark')"
          />
        </el-form-item>
      </template>
      <template v-else-if="singleForm.reason">
        <div class="single-fixed-preview">
          <div class="single-rule-name">{{ singleReasonText }}</div>
          <div
            :style="{
              color: singleReasonValue > 0 ? '#21ba45' : '#db2828',
              fontSize: '20px',
              fontWeight: 'bold'
            }"
          >
            {{ singleReasonValue > 0 ? "+" : "" }}{{ singleReasonValue }}
          </div>
        </div>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="singleDialogVisible = false">{{
        t("monitor.cancel")
      }}</el-button>
      <el-button type="primary" @click="singleOnDialogConfirm">{{
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
    <el-form
      :model="infoDialogForm"
      label-width="100px"
      ref="infoDialogFormRef"
      :rules="infoDialogRules"
    >
      <el-form-item :label="t('monitor.education')" prop="education">
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
      <el-form-item :label="t('monitor.hiredDate')" prop="employment">
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
import FundSquares from "./components/fundSquares/index.vue";

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
  backEmployees: Array,
  showFundSquares: Boolean // 左侧“团建经费”开关状态
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

// 批量加积分（针对当前全部选中）
const handleSubmit = () => {
  if (!form.value.reason) {
    ElMessage.warning(t("monitor.selectReason"));
    return;
  }
  dialogTargetIds.value = [...(props.modelValue || [])];
  dialogVisible.value = true;
};

// 单项加积分（打开独立弹窗，仅针对某个员工）
const handleSingleAdd = emp => {
  singleTarget.value = emp;
  singleForm.value.reason = "";
  singleOtherForm.value.reasonValue = "";
  singleOtherForm.value.remark = "";
  singleReasonError.value = "";
  singleDialogVisible.value = true;
};

// 单项加积分弹窗状态
const singleDialogVisible = ref(false);
const singleTarget = ref(null);
const singleForm = ref({ reason: "" });
const singleOtherForm = ref({ reasonValue: "", remark: "" });
const singleReasonError = ref("");
const singleReasonText = computed(
  () =>
    pointRuleList.value.find(item => item.value === singleForm.value.reason)
      ?.label || ""
);
const singleReasonValue = computed(
  () =>
    pointRuleList.value.find(item => item.value === singleForm.value.reason)
      ?.pointsChange || 0
);
const singleValidateReason = () => {
  // 只允许整数 并且 小于 10
  if (!/^[-]?\d+$/.test(singleOtherForm.value.reasonValue)) {
    singleReasonError.value = t("monitor.onlyInteger");
  } else if (
    Math.abs(singleOtherForm.value.reasonValue) > 10 &&
    otherRuleMap[singleForm.value.reason] === "【其他】"
  ) {
    singleReasonError.value = t("monitor.onlyLessThan10");
  } else {
    singleReasonError.value = "";
  }
};

// 从多选中移除某个员工
const handleRemove = emp => {
  emit(
    "update:modelValue",
    (props.modelValue || []).filter(id => id !== emp.id)
  );
};

const validateReason = () => {
  // 只允许整数 并且 小于 10
  if (!/^[-]?\d+$/.test(ohterForm.value.reasonValue)) {
    reasonError.value = t("monitor.onlyInteger");
  } else if (
    Math.abs(ohterForm.value.reasonValue) > 10 &&
    otherRuleMap[form.value.reason] === "【其他】"
  ) {
    reasonError.value = t("monitor.onlyLessThan10");
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
  if (
    otherRuleMap[form.value.reason] === "【其他】" &&
    Math.abs(ohterForm.value.reasonValue) > 10
  ) {
    reasonError.value = t("monitor.onlyLessThan10");
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

  const ok = await doSubmitPoints(dialogTargetIds.value, curRuleId);
  if (ok) {
    dialogVisible.value = false;
    form.value.reason = ""; // 重置选择
  }
};

// 单项加积分弹窗确认
const singleOnDialogConfirm = async () => {
  if (!singleForm.value.reason) {
    ElMessage.warning(t("monitor.selectReason"));
    return;
  }
  // 其他类型时校验自定义分值
  if (
    otherRuleMap[singleForm.value.reason] &&
    !/^[-]?\d+$/.test(singleOtherForm.value.reasonValue)
  ) {
    singleReasonError.value = t("monitor.onlyInteger");
    return;
  }
  if (
    otherRuleMap[singleForm.value.reason] === "【其他】" &&
    Math.abs(singleOtherForm.value.reasonValue) > 10
  ) {
    singleReasonError.value = t("monitor.onlyLessThan10");
    return;
  }
  let curRuleId = singleForm.value.reason;
  if (otherRuleMap[singleForm.value.reason]) {
    const res = await addScoreAction({
      actionName:
        otherRuleMap[singleForm.value.reason] + singleOtherForm.value.remark,
      pointsChange: singleOtherForm.value.reasonValue
    });
    if (res?.code === 200) {
      curRuleId = res?.data;
    }
  }

  const ok = await doSubmitPoints([singleTarget.value.id], curRuleId);
  if (ok) {
    singleDialogVisible.value = false;
    singleForm.value.reason = "";
  }
};

// 公共提交：根据目标员工 id 数组调用积分接口
const doSubmitPoints = async (targetIds, ruleId) => {
  if (!Array.isArray(targetIds) || targetIds.length === 0) {
    ElMessage.error(t("monitor.updateFailed"));
    return false;
  }
  const userIds =
    (props.backEmployees || [])
      .filter(item => targetIds.includes(item?.id))
      .map(item => item.userId) || [];
  let res;
  try {
    res = await updateUseScore({
      userIds,
      ruleId,
      updateUserId: storageLocal().getItem("dataSource")?.id || ""
    });
  } catch (error) {
    ElMessage.error(t("monitor.updateFailed"));
    return false;
  }

  if (res?.code === 200) {
    ElMessage.success(t("monitor.updateSuccess"));
    const list = await props.fetchUserListData();
    if (Array.isArray(list) && list.length > 0) {
      if (props.modelValue?.length === 1) {
        // 单个用户时，保持原有逻辑
      } else if (targetIds.length === 1) {
        // 多选下单项加积分：保持多选，不清空，方便继续操作
      } else {
        // 批量加积分：清空选择
        emit("update:modelValue", []);
      }
    } else {
      // 找不到时清空状态
      emit("setSelectedEmployee", null);
      emit("update:modelValue", []);
    }
    return true;
  }
  ElMessage.error(t("monitor.updateFailed"));
  return false;
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
    }
  });
};

// 当前弹窗要调整积分的目标员工 id（单项加积分时只含一人，批量时为全部选中）
const dialogTargetIds = ref([]);
const dialogTargetNames = computed(() => {
  if (!Array.isArray(dialogTargetIds.value)) return "";
  return (props.backEmployees || [])
    .filter(item => dialogTargetIds.value.includes(item.id))
    .map(item => item.name)
    .join(", ");
});

//#region 员工卡片排序（与左侧员工树一致：杭州基地优先 → 基地拼音 → 员工拼音）
const HANGZHOU_SITE = "佩蒂智创（杭州）宠物科技有限公司";
const DEFAULT_SITE_LABEL = "未设置基地";
// 是否杭州基地员工（月度经费方块仅该基地展示）
const isHangzhouEmployee = emp =>
  !!emp && (emp.site || DEFAULT_SITE_LABEL) === HANGZHOU_SITE;
const pinyinKey = label =>
  ((label || "") + "").normalize("NFD").replace(/[̀-ͯ]/g, "");
const compareEmployeeCards = (a, b) => {
  const siteA = a?.site || DEFAULT_SITE_LABEL;
  const siteB = b?.site || DEFAULT_SITE_LABEL;
  const aHangzhou = siteA === HANGZHOU_SITE ? 0 : 1;
  const bHangzhou = siteB === HANGZHOU_SITE ? 0 : 1;
  if (aHangzhou !== bHangzhou) return aHangzhou - bHangzhou;
  const siteDiff = pinyinKey(siteA).localeCompare(pinyinKey(siteB));
  if (siteDiff !== 0) return siteDiff;
  return pinyinKey(a?.name).localeCompare(pinyinKey(b?.name));
};
//#endregion

// 多选模式下按小方块展示的已选员工
const selectedEmployeeList = computed(() => {
  const list = (props.backEmployees || []).filter(item =>
    props.modelValue?.includes(item.id)
  );
  // 与左侧员工树的顺序保持一致：杭州基地优先 → 基地按拼音 → 员工按拼音
  return list.sort(compareEmployeeCards);
});

fetchPointRuleList();

//#region 调整学历或入职日期逻辑
const infoLoading = ref(false);
const validEducation = ref([]); // 有效学历
const infoDialogVisible = ref(false);
const infoDialogForm = reactive({
  education: "",
  employment: ""
});
const infoDialogRules = reactive({
  education: [
    {
      required: true,
      message: t("monitor.pleaseSelectEducation"),
      trigger: "blur"
    }
  ],
  employment: [
    {
      required: true,
      message: t("monitor.pleaseSelectHiredDate"),
      trigger: "blur"
    }
  ]
});
const infoDialogFormRef = ref(null);
// 实际要更新信息的员工（单选用高亮对象，多选卡片各自指定）
const singleInfoTarget = ref(null);
watch(
  () => props.employee,
  val => {
    if (val && !singleInfoTarget.value) {
      infoDialogForm.education = val.education || "";
      infoDialogForm.employment = val.hireDate || "";
    }
  },
  { immediate: true }
);
// 多选卡片上：调整当前卡片这个员工的信息（不依赖全局高亮）
const handleSingleEditInfo = emp => {
  singleInfoTarget.value = emp;
  infoDialogForm.education = emp.education || "";
  infoDialogForm.employment = emp.hireDate || "";
  infoDialogVisible.value = true;
};
const handleInfoDialogSubmit = async () => {
  if (!infoDialogFormRef.value) return;
  try {
    await infoDialogFormRef.value.validate();
  } catch (error) {
    return; // 校验未通过
  }
  infoLoading.value = true;
  const target = singleInfoTarget.value || props.employee;
  const payload = {
    education: infoDialogForm.education,
    hireDate: dayjs(infoDialogForm.employment).format("YYYY-MM-DD")
  };
  try {
    const res = await updateUserInfo({ ...target, ...payload });
    if (res?.code === 200) {
      ElMessage.success(t("monitor.updateUserInfoSuccess"));
      infoDialogVisible.value = false;
      await props.fetchUserListData();
    } else {
      ElMessage.error(res?.msg || t("monitor.updateUserInfoFailed"));
    }
  } catch (err) {
    ElMessage.error(err?.msg || t("monitor.updateUserInfoFailed"));
  } finally {
    infoLoading.value = false;
  }
};
// 获取学历枚举方法
const fetchEducationEnum = () => {
  getEnumTypeList({ type: "education" })
    .then(res => {
      if (res?.code === 200) {
        validEducation.value = res?.data || [];
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

.multi-employee-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 500px;
  padding: 0 8px;
  overflow-y: auto;
}

.selected-count {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: bold;
  color: #222;
}

/* 多选：与单选一致的完整信息卡网格（紧凑版） */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 12px;
  width: 100%;
}

.info-card {
  position: relative;
  gap: 14px;
  align-items: center;
  padding: 12px 14px;
  background: #fafcfb;
  border: 1px solid #eceff2;
  border-radius: 10px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

/* 移除按钮：固定到卡片右上角，防止误触 */
.info-card-remove {
  position: absolute;
  top: 6px;
  right: 6px;
}

.info-card:hover {
  border-color: #d9e2ec;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

/* 紧凑：字号 / 间距整体缩小 */
.info-card .employee-name {
  margin-bottom: 2px;
  font-size: 17px;
}

.info-card .employee-email {
  margin-bottom: 2px;
  font-size: 12px;
  line-height: 1.4;
}

.info-card .employee-scores {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px 12px;
  width: 100%;
  margin-top: 6px;
}

.info-card .score-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.info-card .score-label {
  margin-bottom: 0;
  font-size: 11px;
  line-height: 1.4;
  color: #888;
  text-align: center;
  white-space: nowrap;
}

.info-card .score-value {
  font-size: 15px;
  white-space: nowrap;
}

.info-card .employee-avatar {
  flex-shrink: 0;
}

/* 信息卡内的月度经费方块：顶开一行直排，随左侧开关联动 */
.info-card .card-fund-squares {
  padding: 0;
  margin-top: 8px;
}

/* 信息卡右下操作区：编辑 + 加分（移除已独立到右上角） */
.multi-card-actions {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  align-self: flex-end;
  padding-bottom: 2px;
}

/* 自绘加号按钮（避免 Element 图标变形） */
.person-plus {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #6b9bff, #2f6be8);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgb(47 107 232 / 35%);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.person-plus:hover {
  box-shadow: 0 4px 12px rgb(47 107 232 / 50%);
  transform: scale(1.12);
}

.person-plus:active {
  transform: scale(0.94);
}

/* 自绘移除按钮 */
.person-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #909399;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 50%;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s,
    transform 0.15s;
}

.person-remove:hover {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #f56c6c;
  transform: scale(1.08);
}

/* 自绘编辑（调整信息）按钮 */
.person-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #606266;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d9dbe0;
  border-radius: 50%;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s,
    transform 0.15s;
}

.person-edit:hover {
  color: #2f6be8;
  background: #f0f5ff;
  border-color: #2f6be8;
  transform: scale(1.08);
}

/* 单项加积分弹窗 */
.single-target-line {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #f7f8fa;
  border-radius: 10px;
}

.single-target-name {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.single-type-select {
  width: 100%;
}

.single-fixed-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  padding: 14px 0 6px;
}

.single-rule-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
