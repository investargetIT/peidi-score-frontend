<template>
  <div>
    <DashboardHeader :username="name" :avatar="avatar" />
    <div class="score-cards">
      <ScoreCard
        :title="t('dashboard.exchangeablePoints')"
        :score="curUserInfo?.redeemablePoints"
        :type="t('dashboard.exchangeablePoints')"
      />
      <ScoreCard
        :title="t('dashboard.longTermPoints')"
        :score="curUserInfo?.lifeTimePoints"
        :type="t('dashboard.longTermPoints')"
      />
    </div>
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

const { t } = useI18n();
const { id } = storageLocal()?.getItem("dataSource") || {};

const { userAvatar } = useNav();
const curUserInfo = ref({});
const curUserAvatar = ref("");

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
  searchArr.push({
    searchName: "userId",
    searchType: "equals",
    searchValue: storageLocal().getItem("dataSource")?.id
  });
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

.recent-activity {
  width: 100%;
}
</style>
