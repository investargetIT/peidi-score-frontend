<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { storageLocal } from "@pureadmin/utils";
import { getParentDepartmentByUser, getDepartmentDetail } from "@/api/user";
import { getRecordPage } from "@/api/pmApi";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

interface ExchangeItem {
  id?: string;
  createdAt?: string;
  userName?: string;
  lifeTimePoints?: number;
  redeemablePoints?: number;
  avatarUrl?: string;
  remark?: string;
  pointsChange?: number;
  redeemReview?: number | string;
  redeemReviewUserName?: string;
  // 根据实际数据结构添加更多字段
  [key: string]: any;
}

const loading = ref(false);
const exchangeList = ref<ExchangeItem[]>([]);

const fetchRecordPage = () => {
  return getRecordPage({
    pageNo: 1,
    pageSize: 9999,
    searchStr: JSON.stringify([
      {
        searchName: "pointTypeId",
        searchType: "equals",
        searchValue: '"97"'
      }
    ])
  })
    .then((res: any) => {
      if (res.code === 200) {
        exchangeList.value = res.data?.records || [];
      } else {
        ElMessage.error(res.msg);
        loading.value = false;
      }
    })
    .catch((err: any) => {
      ElMessage.error(err.message);
      loading.value = false;
    });
};

// 导出Excel函数
const handleExport = async () => {
  loading.value = true;
  // 先获取最新数据
  await fetchRecordPage();

  // 等待格式化数据完成
  const formattedData = await formatData();

  // 使用格式化后的数据（如果存在）
  const dataToExport: any = formattedData || exchangeList.value;

  // console.log("dataToExport", dataToExport);

  try {
    if (!dataToExport || dataToExport.length === 0) {
      ElMessage.warning(t("redeemMonitor.noDataToExport"));
      loading.value = false;
      return;
    }

    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Peidi Score System";
    workbook.created = new Date();

    // 添加工作表
    const worksheet = workbook.addWorksheet("兑换记录");

    // 设置表头 - 与ExchangeHistory.vue表格列保持一致
    const headers = [
      { header: "兑换日期", key: "createdAt", width: 20 },
      { header: "用户名", key: "userName", width: 25 },
      { header: "上级部门", key: "upperDepartment", width: 25 },
      { header: "物品名称", key: "remark", width: 30 },
      { header: "积分变动", key: "pointsChange", width: 15 },
      { header: "状态", key: "redeemReview", width: 15 },
      { header: "审核人", key: "redeemReviewUserName", width: 20 }
    ];

    // 添加表头
    worksheet.columns = headers;

    // 添加数据行
    dataToExport.forEach((item: ExchangeItem) => {
      // 格式化日期
      const formattedDate = item.createdAt
        ? dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
        : "";

      // 格式化状态
      let statusText: string | number = "";
      if (item.redeemReview === 1 || item.redeemReview === "1") {
        statusText = "已审核";
      } else if (item.redeemReview === 0 || item.redeemReview === "0") {
        statusText = "待审核";
      } else if (item.redeemReview === 2 || item.redeemReview === "2") {
        statusText = "已拒绝";
      } else {
        statusText = item.redeemReview || "";
      }

      worksheet.addRow({
        createdAt: formattedDate,
        userName: item.userName || "",
        upperDepartment: item.upperDepartment || "",
        remark: item.remark || "",
        pointsChange: item.pointsChange || 0,
        redeemReview: statusText,
        redeemReviewUserName: item.redeemReviewUserName || ""
      });
    });

    // 设置表头样式
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" }
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    // 设置数据行样式
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      row.alignment = { vertical: "middle", horizontal: "left" };
      row.font = { size: 11 };
      row.height = 20;

      // 交替行颜色
      if (i % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF2F2F2" }
        };
      }

      // 设置积分变动列的数值格式
      const pointsChangeCell = row.getCell("pointsChange");
      if (typeof pointsChangeCell.value === "number") {
        pointsChangeCell.numFmt = "0";
        pointsChangeCell.alignment = {
          vertical: "middle",
          horizontal: "right"
        };
      }
    }

    // 自动调整列宽
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, column.width || 0), 50);
    });

    // 生成Excel文件
    const buffer = await workbook.xlsx.writeBuffer();

    // 创建下载链接
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `兑换记录_${new Date().toISOString().split("T")[0]}.xlsx`;

    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ElMessage.success(t("redeemMonitor.exportSuccess"));
    loading.value = false;
  } catch (error) {
    console.error(t("redeemMonitor.exportFailed"), error);
    ElMessage.error(t("redeemMonitor.exportFailed") + ": " + error);
    loading.value = false;
  }
};

// 格式化数据
const formatData = async () => {
  const site = (storageLocal().getItem("dataSource") as any)?.dataSource;

  // 如果不是杭州佩蒂站点，直接返回原数据
  if (site !== "3") {
    return exchangeList.value;
  }

  const message = ElMessage({
    message: t("redeemMonitor.exportLoading"),
    type: "info",
    duration: 0
  });

  const department = {};

  // 分批处理函数 - 控制并发数量
  const processBatch = async (batch: any[], batchSize: number = 10) => {
    const results = [];

    for (let i = 0; i < batch.length; i += batchSize) {
      const currentBatch = batch.slice(i, i + batchSize);

      // 处理当前批次
      const batchPromises = currentBatch.map(async item => {
        let upperDepartment = ""; // 默认空字符串

        if (!item.dingId) {
          // 如果没有dingId，返回带空部门的项目
          return {
            ...item,
            upperDepartment: ""
          };
        }

        try {
          // 获取用户部门
          const parentRes: any = await getParentDepartmentByUser({
            userId: item.dingId
          });

          if (parentRes.data?.parent_list?.length) {
            const deptId =
              parentRes.data.parent_list[0]?.parent_dept_id_list?.[0];

            if (department[deptId]) {
              // 如果部门信息已缓存，直接使用
              upperDepartment = department[deptId];
            } else {
              // 获取部门详情
              const deptRes: any = await getDepartmentDetail({ deptId });

              if (deptRes.data) {
                // 缓存部门信息
                department[deptId] = deptRes.data.name;
                upperDepartment = deptRes.data.name;
              }
            }
          }

          // 返回带部门信息的项目
          return {
            ...item,
            upperDepartment: upperDepartment
          };
        } catch (error) {
          console.error(`获取用户 ${item.userName} 部门信息失败:`, error);
          // 出错时返回带空部门的项目
          return {
            ...item,
            upperDepartment: ""
          };
        }
      });

      // 等待当前批次完成，并添加延迟避免请求过快
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // 批次间延迟，避免对服务器造成过大压力
      if (i + batchSize < batch.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  };

  try {
    const results = await processBatch(exchangeList.value, 10); // 每批10个请求
    message.close();
    return results;
  } catch (error) {
    console.error("格式化数据失败:", error);
    message.close();
    // 出错时返回带空部门信息的原数据
    return exchangeList.value.map(item => ({
      ...item,
      upperDepartment: ""
    }));
  }
};
</script>

<template>
  <el-button type="primary" @click="handleExport" :loading="loading">
    <el-icon class="el-icon--right"><Upload /></el-icon>
    {{ t("redeemMonitor.exportExcel") }}
  </el-button>
</template>
