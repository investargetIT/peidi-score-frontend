<template>
  <el-card class="employee-list">
    <div class="employee-title">
      <div class="title-row">
        <div class="title-left">
          <p class="title-text">{{ t("employee.title") }}</p>
          <div class="fund-toggle">
            <span class="fund-toggle-label">{{
              t("employee.fundToggle")
            }}</span>
            <el-tooltip
              :content="t('fundDialog.toggleTip')"
              placement="top"
              effect="dark"
              :show-after="300"
            >
              <el-icon
                class="fund-toggle-icon"
                :size="14"
                @click.stop="fundDialogVisible = true"
                ><QuestionFilled
              /></el-icon>
            </el-tooltip>
            <el-switch v-model="showFundSquares" size="small" />
          </div>
        </div>
        <el-tooltip
          :content="t('monitor.leave')"
          placement="top"
          :disabled="checkedIds.length === 0"
          :show-after="400"
        >
          <span
            class="btn-resign"
            :class="{ disabled: checkedIds.length === 0 }"
            @click="handleResign"
          >
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
        </el-tooltip>
      </div>
    </div>
    <div class="employee-toolbar">
      <!-- <el-checkbox
        v-model="treeAllChecked"
        :indeterminate="treeIsIndeterminate"
        @change="treeHandleCheckAll"
        >{{ t("table.selectAll") }}</el-checkbox
      > -->
      <el-input
        v-model="searchValue"
        :placeholder="t('employee.searchPlaceholder')"
        class="employee-search"
        clearable
      />
    </div>

    <div ref="treeContainerRef" class="employee-items">
      <!-- <div
        v-for="(emp, idx) in filteredEmployees"
        :key="idx"
        :class="[
          'employee-item',
          checkedIds.includes(emp.id) ? 'selected' : ''
        ]"
        @click="handleClick(emp)"
      >
        <el-checkbox
          v-model="checkedIds"
          :label="emp.id"
          @change="handleCheck(emp.id)"
          style="margin-right: 8px"
          :show-label="false"
        />
        <el-avatar
          :size="40"
          :src="avatarUrls[emp.id] || Avatar"
          style="margin-right: 12px"
        />
        <div>
          <div class="employee-name">{{ emp.name }}</div>
          <div class="employee-dept">
            {{ t("employee.department") }}: {{ emp.dept }}
          </div>
        </div>
      </div> -->

      <el-tree-v2
        :height="treeHeight"
        :item-size="nodeHeight"
        :data="treeFilteredEmployees"
        :props="treeDefaultProps"
        show-checkbox
        @check="treeHandleClick"
        ref="treeRef"
        :default-checked-keys="checkedIds"
        :default-expanded-keys="expandedOrgIds"
        @node-expand="treeHandleExpand"
        @node-collapse="treeHandleCollapse"
        class="employee-tree-v2"
      >
        <template #default="{ node, data }">
          <div class="employee-tree-node">
            <el-tooltip
              :content="`${node.label} (${data.lifeTimePoints} / ${data.redeemablePoints})`"
              placement="top-start"
              effect="dark"
              :disabled="!isEmployeeNode(data.id)"
              :show-after="800"
            >
              <div class="custom-tree-node">
                <img
                  v-if="isEmployeeNode(data.id)"
                  :src="data.avatarUrl || Avatar"
                  style="width: 20px; height: 20px; margin-right: 5px"
                />
                <span>{{ node.label }}</span>
                <p
                  v-if="isEmployeeNode(data.id)"
                  class="ml-[5px] text-[#9b9a9a] text-[12px] flex"
                >
                  {{ `(${data.lifeTimePoints} / ${data.redeemablePoints})` }}
                </p>

                <ScoreHistoryExport
                  v-if="isCompanyNode(data.id)"
                  @click="handleExport(data)"
                  ref="scoreHistoryExportRef"
                />
              </div>
            </el-tooltip>

            <!-- 月度经费方块：仅杭州基地员工显示，绿色=未用，浅灰=已用；由“团建经费”开关控制 -->
            <FundSquares
              v-if="showFundSquares && isHangzhouEmployee(data)"
              class="fund-squares-wrap"
              :monthsUsed="data.monthsUsed"
              @click.stop
            />
          </div>
        </template>
      </el-tree-v2>
    </div>
  </el-card>

  <!-- 团建经费规则弹窗 -->
  <el-dialog
    v-model="fundDialogVisible"
    :title="t('fundDialog.title')"
    width="min(560px, 92vw)"
    :append-to-body="true"
    class="fund-dialog"
  >
    <div class="fund-scope-note">{{ t("employee.fundToggleTip") }}</div>
    <div class="fund-legend-row">
      <span class="fund-legend-item">
        <span class="fund-legend-square fund-legend-green"></span>
        <span>{{ t("fundDialog.legendGreen") }}</span>
      </span>
      <span class="fund-legend-item">
        <span class="fund-legend-square fund-legend-gray"></span>
        <span>{{ t("fundDialog.legendGray") }}</span>
      </span>
    </div>

    <div class="fund-rule-list">
      <div v-for="(rule, i) in fundRules" :key="i" class="fund-rule">
        <span class="fund-rule-index">{{ i + 1 }}</span>
        <span class="fund-rule-text">{{ rule }}</span>
      </div>
    </div>

    <template #footer>
      <div class="fund-dialog-footer">
        <el-button type="primary" @click="fundDialogVisible = false">
          {{ t("fundDialog.confirm") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import Avatar from "@/assets/user.jpg";
import { QuestionFilled } from "@element-plus/icons-vue";
import ScoreHistoryExport from "./components/scoreHistoryExport/index.vue";
import FundSquares from "./components/fundSquares/index.vue";
const { t } = useI18n();
const props = defineProps({
  employees: Array,
  selected: Object,
  avatarUrls: Object,
  search: String,
  modelValue: Array // 选中id数组
});
const emit = defineEmits([
  "update:search",
  "select",
  "update:modelValue",
  "resign",
  "update:showFundSquares"
]);
const searchValue = ref(props.search || "");
const checkedIds = ref(props.modelValue || []);

// 团建经费方块显示开关，默认不显示；状态同步给父组件（联动右侧管理积分卡片）
const showFundSquares = ref(false);
watch(showFundSquares, val => {
  emit("update:showFundSquares", val);
});

// 团建经费规则弹窗
const fundDialogVisible = ref(false);
const fundRules = computed(() => [
  t("fundDialog.ruleHireBefore15"),
  t("fundDialog.ruleHireAfter15"),
  t("fundDialog.ruleSameYear"),
  t("fundDialog.rulePrevYear")
]);

//#region 新列表逻辑
const treeRef = ref(null);

const treeDefaultProps = {
  children: "children",
  label: "label",
  value: "id"
};

// 虚拟滚动容器：测量可用高度，只渲染视口内节点
const treeContainerRef = ref(null);
const treeHeight = ref(300);
const nodeHeight = computed(() => (showFundSquares.value ? 48 : 30));
let treeResizeObserver = null;
onMounted(() => {
  const el = treeContainerRef.value;
  if (!el) return;
  const update = () => {
    treeHeight.value = Math.max(150, el.clientHeight);
  };
  update();
  treeResizeObserver = new ResizeObserver(update);
  treeResizeObserver.observe(el);
});
onBeforeUnmount(() => {
  treeResizeObserver?.disconnect();
});

// 节点类型判断：员工树 = 基地(company_) → 员工(无前缀)
const isCompanyNode = id => !!id && String(id).startsWith("company_");
const isEmployeeNode = id => !!id && !isCompanyNode(id);

// 是否杭州基地员工：只有该基地的员工显示月度经费方块
const isHangzhouEmployee = data =>
  !!data && isEmployeeNode(data.id) && data.site === HANGZHOU_SITE;

// 基地缺失时的兜底分组名称
const DEFAULT_SITE_LABEL = "未设置基地";

// 按拼音首字母排序，label 为空时放最后
const compareByLabelPinyin = (a, b) => {
  if (!a.label) return 1;
  if (!b.label) return -1;
  const nameA = a.label.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const nameB = b.label.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return nameA.localeCompare(nameB);
};

// 基地排序：佩蒂智创（杭州）宠物科技有限公司 固定放首个，其余按拼音排序
const HANGZHOU_SITE = "佩蒂智创（杭州）宠物科技有限公司";
const compareBySitePriority = (a, b) => {
  const aFirst = a.label === HANGZHOU_SITE ? 0 : 1;
  const bFirst = b.label === HANGZHOU_SITE ? 0 : 1;
  if (aFirst !== bFirst) return aFirst - bFirst;
  return compareByLabelPinyin(a, b);
};

const treeData = [
  {
    label: "基地",
    children: [
      {
        label: "姓名",
        avatarUrl:
          "https://static-legacy.dingtalk.com/media/lQLPD3DkL2wiKqHNAXDNAXCwKvib1pgej0sGW_2GH3o8AA_368_368.png",
        userId: "1926449443739598852"
      }
    ]
  }
];

// 记录已经展开的基地节点
const expandedOrgIds = ref([]);

// 监听 props.employees 变化，遍历源数据，构造成 基地→员工 的员工树
const treeEmployees = ref([]);
watch(
  () => props.employees,
  newVal => {
    if (newVal) {
      const siteMap = {};
      newVal.forEach(emp => {
        const site = emp.site || DEFAULT_SITE_LABEL;
        if (!siteMap[site]) siteMap[site] = [];
        siteMap[site].push({
          label: emp.name,
          avatarUrl: emp.avatarUrl,
          userId: emp.userId,
          id: emp.id,
          empdata: emp,
          site: emp.site,
          monthsUsed: emp.monthsUsed || [],
          redeemablePoints: emp.redeemablePoints,
          lifeTimePoints: emp.lifeTimePoints
        });
      });
      //{佩蒂智创（杭州）宠物科技有限公司: Array(118)} 转换成 [{label: "佩蒂智创（杭州）宠物科技有限公司", id:"company_...", children: Array(118)}]
      const temTreeEmployees = Object.entries(siteMap)
        .map(([site, children]) => ({
          label: site,
          // 基地节点 id 带 company_ 前缀，用于标识节点类型
          id: "company_" + site,
          children: [...children].sort(compareByLabelPinyin)
        }))
        .sort(compareBySitePriority);
      treeEmployees.value = temTreeEmployees;
    }
  },
  { immediate: true }
);

const treeFilteredEmployees = computed(() => {
  // 支持中英文逗号分割多人模糊搜索，如 "张三,李四"
  const terms = (searchValue.value || "")
    .split(/[,，;；]/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  // 搜索内容为空时返回完整员工树（基地→员工，节点 id 在构建时已生成）
  if (terms.length === 0) return treeEmployees.value || [];
  // 搜索时保留命中的员工及其所属基地（任一关键词命中即保留）
  const tem = [];
  treeEmployees.value.forEach(siteNode => {
    const matchedEmployees = (siteNode.children || []).filter(child =>
      terms.some(
        term => child.label && child.label.toLowerCase().includes(term)
      )
    );
    if (matchedEmployees.length > 0) {
      tem.push({ ...siteNode, children: matchedEmployees });
    }
  });
  return tem;
});

const treeAllChecked = computed({
  get() {
    return treeFilteredEmployees.value.every(siteNode =>
      (siteNode.children || []).every(child =>
        checkedIds.value.includes(child.userId)
      )
    );
  },
  set(val) {
    // console.log("treeAllChecked:", val);
    // return;
    if (val) {
      // true
      const checkedKeys = treeRef.value
        .getCheckedKeys()
        .filter(element => element !== undefined && !isCompanyNode(element));
      checkedIds.value = checkedKeys;
    } else {
      // checkedIds.value = checkedIds.value.filter(
      //   id => !filteredEmployees.value.some(emp => emp.id === id)
      // );
    }
    emit("update:modelValue", checkedIds.value);
  }
});

function treeHandleCheckAll(val) {
  // console.log("treeHandleCheckAll:", val);
  treeAllChecked.value = val;
}

function treeHandleClick() {
  // 加入了公司id，需要对这些节点id做特殊处理，排除掉后只保留员工id
  // console.log("treeHandleClick:", emp, treeRef.value.getCheckedKeys());
  const checkedKeys = treeRef.value
    .getCheckedKeys()
    .filter(element => element !== undefined && !isCompanyNode(element));
  // console.log("===========================================");
  // console.log("checkedKeys:", checkedKeys);

  // 遍历当前 checkedIds.value，如果在当前筛选结果里匹配不到，说明是先前选中但被筛选掉的人，需要保留
  const currentFilteredIds = treeFilteredEmployees.value.flatMap(siteNode =>
    (siteNode.children || []).map(emp => emp.id)
  );
  const keepIds = checkedIds.value.filter(
    id => !currentFilteredIds.includes(id)
  );
  // console.log("keepIds:", keepIds);

  checkedIds.value = [...checkedKeys, ...keepIds];

  // 通知父组件更新
  emit("update:modelValue", checkedIds.value);
  // console.log("checkedIds.value:", checkedIds.value);
}

const treeIsIndeterminate = computed(() => {
  return;
  const checkedCount = filteredEmployees.value.filter(emp =>
    checkedIds.value.includes(emp.id)
  ).length;
  return checkedCount > 0 && checkedCount < filteredEmployees.value.length;
});

watch(searchValue, val => {
  emit("update:search", val);
  // 当搜索框清空时，清空选中数据
  if (!val || val.trim() === "") {
    // checkedIds.value = [];
    // emit("update:modelValue", []);
    // emit("select", null);
  }
});
watch(
  () => props.modelValue,
  val => {
    if (val && !Array.isArray(val)) {
      console.warn("modelValue should be an array");
      return;
    }
    const ids = val || [];
    checkedIds.value = ids;
    // 与左侧树勾选状态联动（例如从右侧卡片点“移除”时同步取消勾选）
    if (treeRef.value) {
      treeRef.value.setCheckedKeys([...ids]);
    }
  }
);
//#endregion

const filteredEmployees = computed(() => {
  // 支持中英文逗号分割多人模糊搜索
  const terms = (searchValue.value || "")
    .split(/[,，;；]/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  if (terms.length === 0) return props.employees || [];
  return (props.employees || []).filter(
    emp => emp.name && terms.some(term => emp.name.toLowerCase().includes(term))
  );
});

const allChecked = computed({
  get() {
    return (
      filteredEmployees.value.length > 0 &&
      filteredEmployees.value.every(emp => checkedIds.value.includes(emp.id))
    );
  },
  set(val) {
    if (val) {
      checkedIds.value = filteredEmployees.value.map(emp => emp.id);
    } else {
      checkedIds.value = checkedIds.value.filter(
        id => !filteredEmployees.value.some(emp => emp.id === id)
      );
    }
    emit("update:modelValue", checkedIds.value);
  }
});

const isIndeterminate = computed(() => {
  const checkedCount = filteredEmployees.value.filter(emp =>
    checkedIds.value.includes(emp.id)
  ).length;
  return checkedCount > 0 && checkedCount < filteredEmployees.value.length;
});

function handleCheckAll(val) {
  allChecked.value = val;
}
function handleCheck(id) {
  // 确保checkedIds.value是一个数组
  if (!Array.isArray(checkedIds.value)) {
    checkedIds.value = [];
  }

  // 切换选中状态
  const index = checkedIds.value.indexOf(id);
  if (index === -1) {
    // 如果未选中，则添加到选中列表
    checkedIds.value = [...checkedIds.value, id];
  } else {
    // 如果已选中，则从选中列表中移除
    checkedIds.value = checkedIds.value.filter(item => item !== id);
  }

  // 通知父组件更新
  emit("update:modelValue", checkedIds.value);

  // 处理高亮逻辑
  if (checkedIds.value.includes(id)) {
    const emp = filteredEmployees.value.find(emp => emp.id === id);
    if (emp) emit("select", emp);
  } else if (checkedIds.value.length > 0) {
    const emp = filteredEmployees.value.find(
      emp => emp.id === checkedIds.value[0]
    );
    if (emp) emit("select", emp);
  } else {
    emit("select", null);
  }
}

function handleClick(emp) {
  emit("select", emp);
  // 如果未勾选则勾选，如果已勾选则取消勾选
  const index = checkedIds.value.indexOf(emp.id);
  if (index === -1) {
    checkedIds.value = [...checkedIds.value, emp.id];
  } else {
    checkedIds.value = checkedIds.value.filter(id => id !== emp.id);
  }
  // 通知父组件更新
  emit("update:modelValue", checkedIds.value);
}

// 处理离职逻辑
function handleResign() {
  if (checkedIds.value.length === 0) return;
  emit("resign");
}

// treeHandleExpand 处理展开事件（tree-v2 事件参数为 data, node）
function treeHandleExpand(dataNode) {
  // console.log("展开节点:", dataNode);
  if (dataNode?.id && isCompanyNode(dataNode.id)) {
    // 记录展开的基地节点
    expandedOrgIds.value = [...expandedOrgIds.value, dataNode.id];
    // console.log("已经展开的基地节点:", expandedOrgIds.value);
  }
}

// treeHandleCollapse 处理折叠事件
function treeHandleCollapse(dataNode) {
  if (dataNode?.id && isCompanyNode(dataNode.id)) {
    // 从展开的基地节点列表中移除
    expandedOrgIds.value = expandedOrgIds.value.filter(
      id => id !== dataNode.id
    );
    console.log("已经折叠的基地节点:", expandedOrgIds.value);
  }
}

//#region 导出逻辑
const scoreHistoryExportRef = ref(null);
const handleExport = data => {
  // 阻止冒泡事件
  event.stopPropagation();
  scoreHistoryExportRef.value.handleExport(data);
};
//#endregion
</script>

<style scoped>
.employee-list {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  min-height: 500px;
  max-height: 100vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #e5e6eb;
}

.employee-list :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  overflow: hidden;
  border-radius: 12px;
}

/* 隐藏复选框的label但保持交互 */
:deep(.el-checkbox__label) {
  width: 0;
  overflow: hidden;
  visibility: hidden;
}

.employee-title {
  margin-bottom: 18px;
  font-size: 24px;
  font-weight: bold;
}

/* 标题行：英文等长文案放不下时自动换行，离职按钮始终右上角 */
.title-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.title-row :deep(.el-tooltip__trigger) {
  flex-shrink: 0;
}

.title-left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  min-width: 0;
}

.title-text {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

/* 团建经费开关组：整体作为一个单元，空间不足时整块换行，不拆行 */
.fund-toggle {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  white-space: nowrap;
}

/* 标题栏“团建经费”开关 */
.fund-toggle-label {
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  color: #666;
  white-space: nowrap;
}

.fund-toggle-icon {
  color: #b6b6bd;
  cursor: pointer;
}

/* ===== 团建经费规则弹窗 ===== */
.fund-legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  align-items: center;
  margin-bottom: 16px;
}

.fund-legend-item {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.fund-legend-square {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.fund-legend-green {
  background: #67c23a;
}

.fund-legend-gray {
  background: #e4e7ed;
  box-shadow: inset 0 0 0 1px #dcdfe6;
}

.fund-rule-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fund-rule {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.7;
  color: #303133;
}

.fund-rule-index {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 3px;
  font-size: 12px;
  font-weight: 700;
  color: #409eff;
  background: #ecf5ff;
  border-radius: 50%;
}

.fund-rule-text {
  flex: 1;
  min-width: 0;
}

.fund-dialog-footer {
  text-align: right;
}

/* 弹窗顶部适用范围提示 */
.fund-scope-note {
  padding: 8px 12px;
  margin-bottom: 14px;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
  background: #f7f8fa;
  border-radius: 8px;
}

/* 离职图标按钮（右上角） */
.btn-resign {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: #d94a4a;
  cursor: pointer;
  background: #fff;
  border: 1px solid #f0c1c1;
  border-radius: 50%;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s,
    transform 0.15s;
}

.btn-resign:hover {
  color: #fff;
  background: #f56c6c;
  border-color: #f56c6c;
  transform: scale(1.08);
}

.btn-resign.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background: #f5f5f5;
  border-color: #e4e7ed;
  transform: none;
}

.btn-resign.disabled:hover {
  color: #c0c4cc;
  background: #f5f5f5;
  border-color: #e4e7ed;
  transform: none;
}

.employee-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.employee-search {
  flex: 1;
}

.employee-items {
  position: relative;
  flex: 1 1 calc(100vh - 210px);
  min-height: 0;
  overflow: hidden;
}

/* 虚拟滚动树：宽度撑满，内部滚动 */
.employee-tree-v2 {
  width: 100%;
}

.employee-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.2s;
}

.employee-item.selected,
.employee-item:hover {
  background: #f5f6fa;
}

.employee-name {
  font-size: 18px;
  font-weight: 600;
}

.employee-dept {
  font-size: 14px;
  color: #888;
}
</style>

<style scoped>
.custom-tree-node {
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  height: 26px;
  padding-right: 8px;
  font-size: 14px;
}

/* 员工节点整体：姓名行 + 月度经费方块行，垂直居中于固定行高内 */
.employee-tree-node {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  min-width: 0;
  height: 100%;
}

/* 经费方块样式统一由 fundSquares 子组件维护，这里只留树内间距 */
.fund-squares-wrap {
  margin-top: 3px;
}
</style>
