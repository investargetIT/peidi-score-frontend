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
      <!-- 虚拟滚动树 el-tree-v2：行高全区一致（经费开关时 58px），性能优先 -->
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
        :empty-text="emptyTreeText"
        @node-expand="treeHandleExpand"
        @node-collapse="treeHandleCollapse"
        class="employee-tree-v2"
      >
        <template #default="{ node, data }">
          <div class="employee-tree-node">
            <el-tooltip
              :content="
                isEmployeeNode(data.id)
                  ? `${node.label} ${employeePointsText(data)}`
                  : ''
              "
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
                <el-icon
                  v-else-if="isCompanyNode(data.id)"
                  class="company-node-icon"
                  :size="16"
                  ><OfficeBuilding
                /></el-icon>
                <el-icon
                  v-else-if="isDeptNode(data.id)"
                  class="dept-node-icon"
                  :size="14"
                  ><Folder
                /></el-icon>
                <span
                  class="tree-node-label"
                  :class="{
                    'dept-label': isDeptNode(data.id),
                    'company-label': isCompanyNode(data.id)
                  }"
                  >{{ node.label }}</span
                >
                <p
                  v-if="isEmployeeNode(data.id)"
                  class="ml-[5px] text-[#9b9a9a] text-[12px] flex"
                >
                  {{ employeePointsText(data) }}
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
import {
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount
} from "vue";
import { useI18n } from "vue-i18n";
import Avatar from "@/assets/user.jpg";
import { getDeptTree } from "@/api/pmApi";
import {
  QuestionFilled,
  OfficeBuilding,
  Folder
} from "@element-plus/icons-vue";
import ScoreHistoryExport from "./components/scoreHistoryExport/index.vue";
import FundSquares from "./components/fundSquares/index.vue";
const { t } = useI18n();
const props = defineProps({
  employees: Array,
  selected: Object,
  avatarUrls: Object,
  search: String,
  loading: Boolean, // 员工列表正在加载（空态显示加载中文案而非“暂无数据”）
  modelValue: Array // 选中id数组
});

// 树空态文案：加载中提示加载，加载完成且确实无人才提示“暂无数据”
const emptyTreeText = computed(() =>
  props.loading ? t("monitor.dataLoading") : t("table.emptyText")
);
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
  value: "id",
  // 未注册员工节点 disabled:true → 复选框禁用（不会出现在勾选结果中）
  disabled: "disabled",
  // 缩进收窄（16→12→8）：佩蒂深部门少吃横向宽度，14px 经费方块在更深层级仍能单行放下
  indent: 8
};

// 虚拟滚动容器：测量可用高度，只渲染视口内节点
// 经费方块开关开启时：姓名行 24 + 间距 4 + 方块行高（单行 14 / 深缩进换行后两行 30）= 58，取 60 留缓冲，
// 保证包裹后两行方块不被裁切（el-tree-v2 行高全区一致）。
// 缩进已收到 8（见 treeDefaultProps.indent），佩蒂深部门少占宽度，
// 员工叶子行箭头也不再占位（expand-icon.is-leaf display:none），
// 换行仅在 8 层以上部门才会出现；若实测确认不会换行，后续可将此处回落到 44。
const treeContainerRef = ref(null);
const treeHeight = ref(300);
const nodeHeight = computed(() => (showFundSquares.value ? 60 : 30));
let treeResizeObserver = null;
onMounted(() => {
  loadDeptTree();
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

// 节点类型判断：员工树 = 基地(company_) → 部门(dept_) → 员工(无前缀)
const isCompanyNode = id => !!id && String(id).startsWith("company_");
const isDeptNode = id => !!id && String(id).startsWith("dept_");
const isEmployeeNode = id => !!id && !isCompanyNode(id) && !isDeptNode(id);

// 是否杭州基地员工：只有该基地的员工显示月度经费方块
const isHangzhouEmployee = data =>
  !!data && isEmployeeNode(data.id) && data.site === HANGZHOU_SITE;

// 员工节点右侧积分括号文案：未注册员工固定显示“没有注册”
const employeePointsText = data => {
  if (data?.isRegistered === false) return `（${t("monitor.notRegistered")}）`;
  return `(${data.lifeTimePoints ?? "-"} / ${data.redeemablePoints ?? "-"})`;
};

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

// 记录已经展开的基地/部门节点
const expandedOrgIds = ref([]);

// 部门组织架构树（来自 user.peidigroup.cn/attendance/dept/tree）
// 加载成功 → 基地 → 部门 → 员工 三层结构；失败/为空 → 回退 基地 → 员工 两层结构
const deptTreeData = ref(null);

// 未分配部门员工的兜底节点名
const UNASSIGNED_DEPT_LABEL = "未分配部门";

// 部门组织架构树仅挂载到佩蒂智创基地，其他基地保持「基地→员工」平铺展示
const deptTreeForSite = siteLabel =>
  siteLabel === HANGZHOU_SITE ? deptTreeData.value : null;

// 收集部门树（或子树）中所有部门 id
function collectDeptIds(nodes, set = new Set()) {
  (nodes || []).forEach(node => {
    if (node && node.deptId !== undefined && node.deptId !== null) {
      set.add(String(node.deptId));
    }
    collectDeptIds(node && node.children, set);
  });
  return set;
}

// 收集一棵子树内全部员工节点（跳过基地/部门节点，递归下钻）
function collectEmployeeNodes(treeNodes, list = []) {
  (treeNodes || []).forEach(node => {
    if (isEmployeeNode(node.id)) {
      list.push(node);
    } else if (node && Array.isArray(node.children)) {
      collectEmployeeNodes(node.children, list);
    }
  });
  return list;
}

// 构建单个基地节点：基地 → 已裁剪的部门树 → 员工；部门树不可用时直接放员工
function buildSiteNode(siteLabel, empNodes, deptTree) {
  const empTree = empNodes || [];
  const children = [];
  if (deptTree && deptTree.length > 0) {
    // 按部门分组：命中部门树的员工挂到对应部门，其余进"未分配部门"
    const deptIds = collectDeptIds(deptTree);
    const empByDept = new Map();
    const unassigned = [];
    empTree.forEach(empNode => {
      const dId =
        empNode.deptId !== undefined && empNode.deptId !== null
          ? String(empNode.deptId)
          : "";
      if (dId && deptIds.has(dId)) {
        if (!empByDept.has(dId)) empByDept.set(dId, []);
        empByDept.get(dId).push(empNode);
      } else {
        unassigned.push(empNode);
      }
    });
    // 递归裁剪部门树：只保留「本部门」或「后代部门」有员工的节点
    const pruneDept = node => {
      const deptKey = String(node.deptId);
      const hasHere = empByDept.has(deptKey);
      const prunedChildren = (node.children || [])
        .map(pruneDept)
        .filter(Boolean);
      if (!hasHere && prunedChildren.length === 0) return null;
      const deptNode = {
        label: node.deptName || deptKey,
        // 部门节点 id 带基地前缀，避免多基地下相同 deptId 在新树内 key 冲突
        id: "dept_" + siteLabel + "_" + deptKey,
        deptId: node.deptId,
        children: prunedChildren
      };
      if (hasHere) {
        // 员工挂在部门节点末尾，部门子节点保持部门树的原有顺序
        deptNode.children = [
          ...prunedChildren,
          ...[...empByDept.get(deptKey)].sort(compareByLabelPinyin)
        ];
      }
      return deptNode;
    };
    deptTree.forEach(top => {
      const pruned = pruneDept(top);
      if (pruned) children.push(pruned);
    });
    if (unassigned.length > 0) {
      children.push({
        label: UNASSIGNED_DEPT_LABEL,
        id: "dept_unassigned_" + siteLabel,
        children: [...unassigned].sort(compareByLabelPinyin)
      });
    }
  } else {
    children.push(...[...empTree].sort(compareByLabelPinyin));
  }
  return {
    label: siteLabel,
    id: "company_" + siteLabel,
    children
  };
}

// 安全地重放展开状态：
// el-tree-v2 内部 `setData` 经 `nextTick(() => tree.value = createTree(data))` 异步建树，
// 数据更新后 treeNodeMap 尚未就绪时直接 setExpandedKeys 会抛
// "Cannot read properties of undefined (reading 'treeNodeMap')"。
// 因此先用 getNode（内部带 ?. 保护，不抛错）探测树就绪，未就绪则延迟重试。
const applyExpandedKeys = (keys = []) => {
  const tree = treeRef.value;
  if (!tree || !keys.length) return;
  if (!tree.getNode(keys[0])) {
    setTimeout(() => applyExpandedKeys(keys), 50);
    return;
  }
  tree.setExpandedKeys(keys);
};

// 监听 props.employees 与部门树变化，构造成 基地 → 部门 → 员工 的员工树
const treeEmployees = ref([]);
watch(
  [() => props.employees, deptTreeData],
  ([newVal]) => {
    if (!Array.isArray(newVal)) return;
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
        deptId: emp.deptId,
        monthsUsed: emp.monthsUsed || [],
        redeemablePoints: emp.redeemablePoints,
        lifeTimePoints: emp.lifeTimePoints,
        isRegistered: emp.isRegistered !== false,
        disabled: emp.isRegistered === false
      });
    });
    // 基地 → 员工 数组构造成员工树（佩蒂智创挂部门树，其他基地平铺员工）
    treeEmployees.value = Object.entries(siteMap)
      .map(([site, emps]) => buildSiteNode(site, emps, deptTreeForSite(site)))
      .sort(compareBySitePriority);
    // 默认展开：仅展开“挂了部门树的基地”，部门/员工保持折叠。
    // 没有部门树（回退「基地→员工」扁平结构）的基地保持完全折叠，避免一进来全员平铺。
    // setExpandedKeys 会补全祖先链；el-tree-v2 在数据重建后需手动重放展开
    nextTick(() => {
      const needExpand = treeEmployees.value
        .filter(siteNode => deptTreeForSite(siteNode.label)?.length)
        .map(siteNode => siteNode.id);
      if (needExpand.length) {
        expandedOrgIds.value = Array.from(
          new Set([...expandedOrgIds.value, ...needExpand])
        );
        applyExpandedKeys(expandedOrgIds.value);
      }
    });
  },
  { immediate: true }
);

// 部门组织架构树：加载成功存入 deptTreeData，失败置空触发回退两层结构
const loadDeptTree = async () => {
  try {
    const res = await getDeptTree();
    // 兼容 {code,data:[...]} 与直接返回数组两种响应形态
    deptTreeData.value = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];
  } catch (error) {
    console.error("加载部门组织架构失败，已回退为「基地→员工」结构:", error);
    deptTreeData.value = [];
  }
};

const treeFilteredEmployees = computed(() => {
  // 支持中英文逗号分割多人模糊搜索，如 "张三,李四"
  const terms = (searchValue.value || "")
    .split(/[,，;；]/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  // 搜索内容为空时返回完整员工树（基地→部门→员工，节点 id 在构建时已生成）
  if (terms.length === 0) return treeEmployees.value || [];
  // 搜索时保留命中的员工及其所属基地/部门（任一关键词命中即保留）
  const tem = [];
  treeEmployees.value.forEach(siteNode => {
    const matchedEmployees = collectEmployeeNodes([siteNode]).filter(child =>
      terms.some(
        term => child.label && child.label.toLowerCase().includes(term)
      )
    );
    if (matchedEmployees.length > 0) {
      tem.push(
        buildSiteNode(
          siteNode.label,
          matchedEmployees,
          deptTreeForSite(siteNode.label)
        )
      );
    }
  });
  return tem;
});

const treeAllChecked = computed({
  get() {
    return treeFilteredEmployees.value.every(siteNode =>
      collectEmployeeNodes([siteNode]).every(child =>
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
        .filter(
          element =>
            element !== undefined &&
            !isCompanyNode(element) &&
            !isDeptNode(element)
        );
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
  // 加入了公司id、部门id，需要对这些节点id做特殊处理，排除掉后只保留员工id
  // console.log("treeHandleClick:", emp, treeRef.value.getCheckedKeys());
  const checkedKeys = treeRef.value
    .getCheckedKeys()
    .filter(
      element =>
        element !== undefined && !isCompanyNode(element) && !isDeptNode(element)
    );
  // console.log("===========================================");
  // console.log("checkedKeys:", checkedKeys);

  // 遍历当前 checkedIds.value，如果在当前筛选结果里匹配不到，说明是先前选中但被筛选掉的人，需要保留
  const currentFilteredIds = collectEmployeeNodes(
    treeFilteredEmployees.value
  ).map(emp => emp.id);
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

// treeHandleExpand 处理展开事件（el-tree 事件参数为 data, node）
function treeHandleExpand(dataNode) {
  // console.log("展开节点:", dataNode);
  // 基地、部门节点都要记录展开状态（部门树重建时需要补全用户的展开偏好）
  if (dataNode?.id && !isEmployeeNode(dataNode.id)) {
    if (!expandedOrgIds.value.includes(dataNode.id)) {
      expandedOrgIds.value = [...expandedOrgIds.value, dataNode.id];
    }
  }
}

// treeHandleCollapse 处理折叠事件
function treeHandleCollapse(dataNode) {
  if (dataNode?.id && !isEmployeeNode(dataNode.id)) {
    // 从展开节点列表中移除
    expandedOrgIds.value = expandedOrgIds.value.filter(
      id => id !== dataNode.id
    );
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

/* 树自身横向占用压缩，把宽度尽量让给经费方块：
   1) 员工叶子行的展开箭头 `visibility:hidden` 仍占位，直接 display:none 收回 ~20px；
   2) 展开箭头内边距 6px→3px，省 ~6px；
   3) 勾选框右边距 8px→4px，省 4px。 */
.employee-tree-v2 :deep(.el-tree-node__expand-icon.is-leaf) {
  display: none;
}

.employee-tree-v2 :deep(.el-tree-node__expand-icon) {
  padding: 3px;
}

.employee-tree-v2 :deep(.el-tree-node__content > label.el-checkbox) {
  margin-right: 4px;
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
/* 移动端：员工列表占满整宽，去掉固定高度约束 */
@media screen and (width <= 768px) {
  .employee-list {
    width: 100%;
    height: auto;
    min-height: 420px;
    max-height: none;
  }

  .employee-list :deep(.el-card__body) {
    padding: 16px 12px;
  }
}

.custom-tree-node {
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  height: 24px;
  padding-right: 8px;
  font-size: 14px;
}

/* 基地（公司）节点图标：主色深蓝，突出顶层公司节点 */
.company-node-icon {
  flex-shrink: 0;
  margin-right: 5px;
  color: #2563eb;
}

/* 部门节点图标：弱化处理，与员工头像区分开 */
.dept-node-icon {
  flex-shrink: 0;
  margin-right: 3px;
  color: #7b8aa0;
}

/* 节点文字：统一防溢出截断 */
.tree-node-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 部门节点：浅灰蓝胶囊底，紧凑区分于员工行，不撑高 */
.dept-label {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 190px;
  padding: 1px 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: #4a5a74;
  background: #f4f6fa;
  border: 1px solid #e6eaf2;
  border-radius: 8px;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

/* 部门胶囊悬停反馈：整行 hover 时胶囊高亮为主色系，传达“可点击展开/折叠” */
.employee-tree-v2 :deep(.el-tree-node__content:hover) .dept-label {
  color: #2563eb;
  background: #e3ebfb;
  border-color: #b9cdea;
}

/* 基地（公司）节点：加粗深色，与部门/员工区分 */
.company-label {
  flex-shrink: 0;
  font-weight: 700;
  color: #1f2d3d;
}

/* 员工节点整体：姓名行 + 月度经费方块行，垂直居中于固定行高内 */
.employee-tree-node {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  min-width: 0;
  height: 100%;
}

/* 经费方块样式统一由 fundSquares 子组件维护，这里只留树内间距 */
.fund-squares-wrap {
  margin-top: 2px;
}
</style>
