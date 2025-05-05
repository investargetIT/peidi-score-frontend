<template>
  <div>
    <DashboardHeader :username="name" :avatar="avatar" />
    <div class="score-cards">
      <ScoreCard title="可兑换积分" :score="2500" type="可兑换积分" />
      <ScoreCard title="长期积分" :score="2500" type="长期积分" />
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

const { userAvatar } = useNav();

const { name } = storageLocal()?.getItem("ddUserInfo") || {};
const avatar = storageLocal()?.getItem("curUserAvatar") || userAvatar;

const activities = [
  { name: "Purchase reward", time: "大约 2 年前", score: 500, type: "可兑换" },
  { name: "Loyalty bonus", time: "大约 2 年前", score: 500, type: "长期" },
  { name: "Referral bonus", time: "将近 2 年前", score: 750, type: "可兑换" },
  { name: "Anniversary bonus", time: "将近 2 年前", score: 750, type: "长期" },
  {
    name: "Points redemption",
    time: "将近 2 年前",
    score: -1000,
    type: "可兑换"
  }
];
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
