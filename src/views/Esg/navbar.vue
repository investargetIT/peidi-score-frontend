<script setup lang="ts">
import { onMounted, ref } from "vue";

const username = ref("");

const handleExit = () => {
  // 暴力退出 清空cookie
  localStorage.setItem("pridi-unLoginUrl", "/pdesg");
  document.cookie.split(";").forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  window.location.href = window.location.origin + "/#/pdesg";
};

onMounted(() => {
  // 从localStorage中获取用户名 dataSource对象里的username
  const dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  if (dataSource.username) {
    username.value = dataSource.username;
  }
});
</script>

<template>
  <div class="peidi-esg-navbar">
    <div class="mr-[20px]">
      <el-dropdown>
        <span class="el-dropdown-link">
          <div
            class="peidi-esg-navbar-user text-[16px] h-[50px] flex items-center justify-center px-[20px]"
          >
            {{ username }}
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleExit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.peidi-esg-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  // 底部阴影
  box-shadow: 0 -2px 4px rgb(0 0 0 / 50%);

  .peidi-esg-navbar-user {
    &:hover {
      background-color: #f5f7fa;
    }
  }
}

.el-tooltip__trigger:focus-visible {
  outline: unset;
}
</style>
