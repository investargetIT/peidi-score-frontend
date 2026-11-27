<script setup lang="ts">
import { ref } from "vue";
import { getScoreHistoryList } from "@/api/pmApi";
import { Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { exportScoreHistoryToExcel } from "./export";
import dayjs from "dayjs";

// 员工花名册：导出以「基地在职员工」为基准，0 积分 0 记录的员工也要占一行
interface EmployeeRow {
  id?: string | number;
  userId?: string | number | null;
  fullName?: string;
  name?: string;
  site?: string;
  email?: string;
  education?: string;
  hireDate?: string;
  lifeTimePoints?: number | null;
  redeemablePoints?: number | null;
}

interface ScoreRecordRow {
  userId?: string | number | null;
  userName?: string;
  siteName?: string;
  email?: string;
  education?: string;
  hireDate?: string;
  lifeTimePoints?: number | null;
  redeemablePoints?: number | null;
  createdAt?: string;
  recordTypeName?: string;
  redeemReviewUserName?: string;
  pointsChange?: number;
  remark?: string;
}

const props = defineProps<{
  employees?: EmployeeRow[];
}>();

// 与 EmployeeList 保持一致：基地为空时归入该兜底分组
const DEFAULT_SITE_LABEL = "未设置基地";

const siteName = ref("");
// 正在导出对话框
const messageInfo = ref(null);

//#region 导出逻辑
const handleExport = (data: { label: string }) => {
  messageInfo.value = ElMessage({
    message: "正在导出中...",
    type: "info",
    duration: 0
  });
  siteName.value = data.label;
  fetchHistoryList(data.label);
};
//#endregion

//#region 请求逻辑
const fetchHistoryList = (site: string) => {
  const commonInfo = {
    pageNo: 1,
    pageSize: 10e4,
    searchStr: ""
  };
  const searchArr = [];
  searchArr.push(
    {
      searchName: "siteName",
      searchType: "equals",
      searchValue: `\"${site}\"`
    },
    {
      searchName: "oaDelete",
      searchType: "equals",
      searchValue: "0"
    },
    {
      searchName: "show_flag",
      searchType: "equals",
      searchValue: 1
    }
  );
  commonInfo.searchStr = JSON.stringify(searchArr);
  getScoreHistoryList(commonInfo)
    .then((res: any) => {
      if (res.code === 200) {
        formatData(res.data?.records || []);
      } else {
        ElMessage.error("获取积分记录失败:" + res?.msg);
        messageInfo.value?.close();
      }
    })
    .catch(err => {
      ElMessage.error("获取积分记录失败:" + err.message);
      messageInfo.value?.close();
    });
};
//#endregion

// 导出前的数据处理
// 以「基地在职员工花名册」为基准合并积分记录：0 积分、0 记录的员工同样输出一行，
// 保证 Excel 人数与左侧员工树人数一致。
const formatData = async (data: ScoreRecordRow[]) => {
  const siteEmployees = (props.employees || []).filter(
    emp => (emp?.site || DEFAULT_SITE_LABEL) === siteName.value
  );

  // 匹配口径（兼容性优先，保证「以前有记录的现在也有」）：
  // 1) 主键用「姓名」——与旧版导出一致，历史记录都能对上人；
  // 2) 姓名为空/对不上时，再用 userId 兜底（记录 userId 与员工档案 userId 可能不同源，
  //    不能作为唯一匹配依据，否则会出现全员「无积分记录」）；
  // 3) 同名多人时优先取 userId 命中的那几条，避免互相串数据；
  // 4) 姓名做去空白归一 + 忽略大小写，避免首尾/全角空格导致匹配失败。
  const normalizeName = (userName?: string | null) =>
    String(userName ?? "")
      .replace(/\s+/g, "")
      .trim()
      .toLowerCase();
  const nameKey = (userName?: string | null) =>
    `name:${normalizeName(userName)}`;
  const idKey = (userId: string | number) => String(userId).trim();

  // 全部记录按姓名 / 按 userId 建索引（userId 索引含全部记录，仅作兜底）
  const recordsByName = new Map<string, ScoreRecordRow[]>();
  const recordsById = new Map<string, ScoreRecordRow[]>();
  data.forEach(item => {
    const nKey = nameKey(item.userName);
    if (!recordsByName.has(nKey)) recordsByName.set(nKey, []);
    recordsByName.get(nKey)!.push(item);

    if (item.userId !== undefined && item.userId !== null) {
      const uKey = idKey(item.userId);
      if (!recordsById.has(uKey)) recordsById.set(uKey, []);
      recordsById.get(uKey)!.push(item);
    }
  });

  // 花名册人数（按姓名统计），用于判断该姓名下是否需要再用 userId 拆分
  const employeeCountByName = new Map<string, number>();
  siteEmployees.forEach(emp => {
    const key = nameKey(emp?.fullName || emp?.name);
    employeeCountByName.set(key, (employeeCountByName.get(key) || 0) + 1);
  });

  // 已被认领的记录（对象引用），避免同名场景重复计入或重复出现在「花名册外」提示里
  const consumed = new Set<ScoreRecordRow>();
  const sortDesc = (records: ScoreRecordRow[]) =>
    records
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  // 积分历史文本：空值不写 null/undefined，统一换成可读文案，便于人工核对
  const textOr = (value: unknown, fallback: string) => {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    // 后端偶发把 null 序列化成字符串 "null"，一并按缺失处理
    if (!text || text === "null" || text === "undefined") return fallback;
    return text;
  };
  const toHistoryText = (records: ScoreRecordRow[]) =>
    sortDesc(records)
      .map(item => {
        const createdAt = textOr(item.createdAt, "时间缺失");
        const typeName = textOr(item.recordTypeName, "类型缺失");
        const reviewer = textOr(item.redeemReviewUserName, "--");
        // 积分变动为 0 是有效值，只有缺失才记为 0
        const points =
          item.pointsChange === null || item.pointsChange === undefined
            ? 0
            : item.pointsChange;
        const remark = textOr(item.remark, "无备注");
        return `${createdAt} || ${typeName} || ${reviewer} || ${points} || ${remark} `;
      })
      .join("\n") || "无积分记录";

  // 1. 花名册员工：无论有无记录都生成一行，保证导出行数/人数与员工树一致
  const rows = siteEmployees.map(emp => {
    const userName = emp?.fullName || emp?.name || "";
    const key = nameKey(userName);
    const empId =
      emp?.userId !== undefined && emp?.userId !== null
        ? idKey(emp.userId)
        : "";

    // 姓名命中且未被认领的记录（主口径，与旧版导出一致）
    let records = (recordsByName.get(key) || []).filter(
      item => !consumed.has(item)
    );
    // 姓名为空或没命中时，用 userId 兜底，避免记录「明明有却导出成无」
    if (records.length === 0 && empId) {
      records = (recordsById.get(empId) || []).filter(
        item => !consumed.has(item)
      );
    }
    // 同名多人且只有一份记录时，用 userId 收窄到本人
    if (
      records.length > 0 &&
      empId &&
      (employeeCountByName.get(key) || 0) > 1
    ) {
      const idMatched = records.filter(
        item =>
          item.userId !== undefined &&
          item.userId !== null &&
          idKey(item.userId) === empId
      );
      if (idMatched.length > 0) records = idMatched;
    }
    records.forEach(item => consumed.add(item));

    // 积分等以员工档案（员工树同源，实时值）为准，缺失时回退本人最新记录，仍缺失记 0
    const latest = sortDesc(records)[0];
    return {
      siteName: emp?.site || DEFAULT_SITE_LABEL,
      userName,
      email: emp?.email ?? latest?.email ?? "",
      education: emp?.education ?? latest?.education ?? "",
      hireDate: emp?.hireDate ?? latest?.hireDate ?? "",
      lifeTimePoints: emp?.lifeTimePoints ?? latest?.lifeTimePoints ?? 0,
      redeemablePoints: emp?.redeemablePoints ?? latest?.redeemablePoints ?? 0,
      history: toHistoryText(records)
    };
  });

  // 2. 花名册外的历史记录（已离职/已删除账号等）
  // 默认不写入 Excel：导出口径是「员工列表的人数」，混入花名册外的人会导致行数对不上。
  // 但这类记录不能静默丢弃，导出后单独提示条数，需要时可把开关打开。
  const INCLUDE_UNROSTERED = false;
  const extras = [];
  const restByName = new Map<string, ScoreRecordRow[]>();
  data.forEach(item => {
    if (consumed.has(item)) return;
    const key = nameKey(item.userName);
    if (!restByName.has(key)) restByName.set(key, []);
    restByName.get(key)!.push(item);
  });
  restByName.forEach(records => {
    const latest = sortDesc(records)[0];
    if (!latest) return;
    extras.push({
      siteName: latest.siteName || siteName.value,
      userName: latest.userName || "",
      email: latest.email ?? "",
      education: latest.education ?? "",
      hireDate: latest.hireDate ?? "",
      lifeTimePoints: latest.lifeTimePoints ?? 0,
      redeemablePoints: latest.redeemablePoints ?? 0,
      history: toHistoryText(records)
    });
  });
  extras.sort((a, b) =>
    String(a.userName).localeCompare(String(b.userName), "zh-Hans-CN")
  );

  await exportScoreHistoryToExcel(
    INCLUDE_UNROSTERED ? [...rows, ...extras] : rows,
    `${siteName.value}_积分记录_${dayjs().format("YYYY-MM-DD")}.xlsx`
  );
  messageInfo.value?.close();

  if (!INCLUDE_UNROSTERED && extras.length > 0) {
    const names = extras.map(item => item.userName);
    const nameText =
      names.length <= 5
        ? names.join("、")
        : `${names.slice(0, 5).join("、")} 等`;
    ElMessage.warning(
      `另有 ${extras.length} 人（已不在员工列表，含离职）的历史记录未计入本次导出：${nameText}`
    );
  }
};

defineExpose({
  handleExport
});
</script>

<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      content="导出积分记录"
      placement="top"
      :show-after="300"
    >
      <el-button :icon="Upload" size="small" link />
    </el-tooltip>
  </div>
</template>
