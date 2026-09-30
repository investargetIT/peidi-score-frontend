<template>
  <div class="dashboard-header">
    <div class="header-content">
      <div>
        <div class="welcome">{{ t("dashboard.welcome") }}</div>
        <div class="username">{{ username }}</div>
      </div>
      <el-avatar :size="64" :src="avatar" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  username: { type: String, default: "John Doe" },
  avatar: { type: String, default: "" }
});
</script>

<style scoped>
.dashboard-header {
  padding: 32px 40px;
  margin-bottom: 32px;
  background: linear-gradient(90deg, #a18cd1 0%, #6f86d6 100%);
  border-radius: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome {
  margin-bottom: 8px;
  font-size: 20px;
  color: #fff;
}

.username {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}
</style>
