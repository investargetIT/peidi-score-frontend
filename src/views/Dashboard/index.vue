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
import { ref } from "vue";
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

const { name } = storageLocal()?.getItem("ddUserInfo") || {};
const avatar = storageLocal()?.getItem("curUserAvatar") || userAvatar;
const activities = ref([]);

const fetchHistoryList = () => {
  const commonInfo = {
    pageNo: 1,
    pageSize: 5,
    sortStr: JSON.stringify([{ sortName: "createdAt", sortType: "desc" }])
  };
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
  }).then(res => {
    if (res?.code === 200) {
      curUserInfo.value = res.data;
      const avatarList = res?.data?.avatarUrl
        ? JSON.parse(curUserInfo.value.avatarUrl)
        : [];

      // 获取头像预览地址
      if (avatarList.length > 0) {
        getFileDownLoadPath({
          objectName: "ui/user/" + avatarList[0].name
        }).then(previewRes => {
          if (previewRes?.code === 200) {
            curUserAvatar.value = previewRes.data;
            storageLocal().setItem("curUserAvatar", curUserAvatar.value);
          }
        });
      }
    }
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
