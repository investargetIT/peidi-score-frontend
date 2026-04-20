<script setup lang="ts">
import { ref } from "vue";
import { getScoreHistoryList } from "@/api/pmApi";
import { Upload } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { exportScoreHistoryToExcel } from "./export";
import dayjs from "dayjs";

const siteName = ref("");
// 正在导出对话框
const messageInfo = ref(null);

//#region 导出逻辑
const handleExport = data => {
  // console.log("导出", data);
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
const fetchHistoryList = siteName => {
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
      searchValue: `\"${siteName}\"`
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
const formatData = async data => {
  // console.log("data", data);
  const userNameAndDetais = {};
  data.forEach(item => {
    if (userNameAndDetais[item.userName]) {
      userNameAndDetais[item.userName].push(item);
    } else {
      userNameAndDetais[item.userName] = [item];
    }
  });
  // console.log("userNameAndDetais", userNameAndDetais);
  // return;
  for (const key in userNameAndDetais) {
    userNameAndDetais[key] = userNameAndDetais[key].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const temp = {
      siteName: userNameAndDetais[key][0].siteName,
      userName: userNameAndDetais[key][0].userName,
      email: userNameAndDetais[key][0].email,
      lifeTimePoints: userNameAndDetais[key][0].lifeTimePoints,
      redeemablePoints: userNameAndDetais[key][0].redeemablePoints,
      education: userNameAndDetais[key][0].education,
      hireDate: userNameAndDetais[key][0].hireDate,
      history: userNameAndDetais[key]
        .map(item => {
          return `${item.createdAt} || ${item.recordTypeName} || ${item.redeemReviewUserName || "--"} || ${item.pointsChange} || ${item.remark} `;
        })
        .join("\n")
    };
    userNameAndDetais[key] = temp;
  }
  // console.log("userNameAndDetais", userNameAndDetais);
  await exportScoreHistoryToExcel(
    Object.values(userNameAndDetais),
    `${siteName.value}_积分记录_${dayjs().format("YYYY-MM-DD")}.xlsx`
  );
  messageInfo.value?.close();
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
