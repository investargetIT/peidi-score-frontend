<template>
  <div>
    <DashboardHeader :username="name" :avatar="avatar" />
    <div class="score-cards">
      <ScoreCard
        :title="t('dashboard.longTermPoints')"
        :score="curUserInfo?.lifeTimePoints"
        :type="t('dashboard.longTermPoints')"
      />
      <ScoreCard
        :title="t('dashboard.exchangeablePoints')"
        :score="curUserInfo?.redeemablePoints"
        :type="t('dashboard.exchangeablePoints')"
      />
    </div>

    <!-- 个人团建经费：仅杭州基地员工展示（数据/规则与管理页一致） -->
    <el-card v-if="SHOW_HOME_FUND && isHangzhouFundUser" class="fund-card">
      <div class="fund-card-header">
        <span class="fund-card-title">{{ t("dashboard.fundTitle") }}</span>
        <span class="fund-card-year">{{ curYear }}</span>
      </div>
      <div class="fund-squares-row">
        <FundSquares :monthsUsed="myFundMonths" />
      </div>
      <div class="fund-legend-row">
        <span class="fund-legend-item">
          <i class="fund-sample green"></i>{{ t("fundDialog.legendGreen") }}
        </span>
        <span class="fund-legend-item">
          <i class="fund-sample gray"></i>{{ t("fundDialog.legendGray") }}
        </span>
      </div>
      <div class="fund-rule-list">
        <div v-for="(rule, i) in fundRules" :key="i" class="fund-rule">
          <span class="fund-rule-index">{{ i + 1 }}</span>
          <span class="fund-rule-text">{{ rule }}</span>
        </div>
      </div>
      <div class="fund-scope-note">{{ t("employee.fundToggleTip") }}</div>
    </el-card>

    <RecentActivity :activities="activities" />
  </div>
</template>

<script setup>
import DashboardHeader from "./DashboardHeader.vue";
import ScoreCard from "./ScoreCard.vue";
import RecentActivity from "./RecentActivity.vue";
import { ref, computed } from "vue";
import { storageLocal } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useI18n } from "vue-i18n";
import {
  getUserInfoData,
  getFileDownLoadPath,
  getScoreHistoryList
} from "@/api/pmApi";
import { getMonthlyFundUsage } from "@/api/user";
import { getFundMonthsWithHireDate } from "@/utils/fund";
import FundSquares from "@/views/monitor/components/fundSquares/index.vue";

const { t } = useI18n();
const { id } = storageLocal()?.getItem("dataSource") || {};

const { userAvatar } = useNav();
const curUserInfo = ref({});
const curUserAvatar = ref("");
const curYear = new Date().getFullYear();

//#region 个人团建经费（数据驱动：仅在经费接口返回了当前用户记录时展示）
// 首页是否展示团建经费卡片：当前暂隐藏，需要恢复时改为 true 即可
const SHOW_HOME_FUND = false;
const isHangzhouFundUser = ref(false);
const myFundMonths = ref(Array.from({ length: 12 }, () => false));
const fundRules = computed(() => [
  t("fundDialog.ruleHireBefore15"),
  t("fundDialog.ruleHireAfter15"),
  t("fundDialog.ruleSameYear"),
  t("fundDialog.rulePrevYear")
]);

// 拉取当前用户当月经费使用情况，叠加入职日期规则；
// 接口失败 / 无该用户记录 → 不展示卡片；成功但接口挂掉也不影响首页其余内容
const loadMyFundUsage = async userData => {
  const userId = String(userData?.userId ?? id);
  const defaultMonths = Array.from({ length: 12 }, () => false);
  let monthsUsedMap = {};
  try {
    monthsUsedMap = await getMonthlyFundUsage(
      [userId],
      new Date().getFullYear()
    );
  } catch (error) {
    console.warn("获取个人团建经费失败，首页不展示该卡片:", error);
    return;
  }
  const raw = monthsUsedMap[userId];
  if (!raw) return; // 该用户暂无团建经费记录（非杭州基地等）
  isHangzhouFundUser.value = true;
  myFundMonths.value = getFundMonthsWithHireDate(
    userData?.hireDate,
    raw || defaultMonths
  );
};
//#endregion

const name =
  storageLocal()?.getItem("ddUserInfo")?.name ||
  storageLocal()?.getItem("dataSource")?.username ||
  {};
const activities = ref([]);

const avatar = computed(() => {
  return curUserAvatar.value || userAvatar.value;
});

const fetchHistoryList = () => {
  const searchArr = [];
  const commonInfo = {
    pageNo: 1,
    pageSize: 5,
    sortStr: JSON.stringify([{ sortName: "createdAt", sortType: "desc" }])
  };
  searchArr.push(
    {
      searchName: "userId",
      searchType: "equals",
      searchValue: storageLocal().getItem("dataSource")?.id
    },
    {
      searchName: "show_flag",
      searchType: "equals",
      searchValue: 1
    }
  );
  commonInfo.searchStr = JSON.stringify(searchArr);
  getScoreHistoryList(commonInfo).then(res => {
    if (res.code === 200) {
      activities.value = res?.data?.records?.map(item => {
        return {
          ...item,
          name: item.remark,
          time: item.createdAt,
          score: item.pointsChange,
          type: item.recordTypeName
        };
      });
    }
  });
};

fetchHistoryList();

const fetchCurUserInfo = () => {
  getUserInfoData({
    userId: id
  })
    .then(res => {
      if (res?.code === 200) {
        curUserInfo.value = res.data;
        // 个人团建经费：隐藏时跳过接口请求，恢复展示时打开 SHOW_HOME_FUND 即可
        if (SHOW_HOME_FUND) loadMyFundUsage(res.data);

        // 优化avatarUrl处理逻辑，支持两种格式
        let avatarList = [];
        if (res?.data?.avatarUrl) {
          try {
            // 尝试作为JSON字符串解析
            const parsed = JSON.parse(res.data.avatarUrl);
            // 确保解析后是数组格式
            if (Array.isArray(parsed)) {
              avatarList = parsed;
            } else {
              console.warn("avatarUrl解析后不是数组格式:", parsed);
            }
          } catch (error) {
            // 如果JSON.parse失败，说明是单纯的字符串
            // console.log("avatarUrl是单纯字符串，直接使用:", res.data.avatarUrl);
            // 直接使用字符串作为头像URL
            curUserAvatar.value = res.data.avatarUrl;
            storageLocal().setItem("curUserAvatar", res.data.avatarUrl);
            return; // 直接返回，不需要处理数组逻辑
          }
        }

        // 处理数组格式的avatarList
        if (avatarList.length > 0) {
          getFileDownLoadPath({
            objectName: "ui/user/" + avatarList[0].name
          })
            .then(previewRes => {
              if (previewRes?.code === 200) {
                curUserAvatar.value = previewRes.data;
                storageLocal().setItem("curUserAvatar", curUserAvatar.value);
              }
            })
            .catch(err => {
              console.warn("获取头像预览地址失败:", err);
            });
        }
      }
    })
    .catch(err => {
      console.error("获取用户信息失败:", err);
    });
};

fetchCurUserInfo();
</script>

<style scoped>
.score-cards {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}

.score-card {
  flex: 1;
  min-width: 0;
}

/* 个人团建经费卡片 */
.fund-card {
  margin-bottom: 32px;
}

.fund-card :deep(.el-card__body) {
  padding: 20px 28px;
}

.fund-card-header {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 16px;
}

.fund-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.fund-card-year {
  font-size: 13px;
  color: #909399;
}

.fund-squares-row {
  margin-bottom: 14px;
}

.fund-legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 14px;
}

.fund-legend-item {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.fund-sample {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border-radius: 3px;
}

.fund-sample.green {
  background: #67c23a;
}

.fund-sample.gray {
  background: #e4e7ed;
  border: 1px solid #cfd3d9;
}

.fund-rule-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  background: #fafcfb;
  border-radius: 8px;
}

.fund-rule {
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 13px;
  line-height: 1.6;
  color: #666;
}

.fund-rule-index {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 11px;
  color: #fff;
  background: #2f6be8;
  border-radius: 50%;
}

.fund-scope-note {
  margin-top: 12px;
  font-size: 12px;
  color: #a0a0a0;
}

.recent-activity {
  width: 100%;
}
</style>
