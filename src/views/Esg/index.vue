<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const handleClickFillIn = () => {
  router.push("/pdesg/fillin");
};
const handleClickReport = () => {
  window.open(" https://www.peidibrand.com/sustainable-development", "_blank");
};
</script>

<template>
  <div class="pd-esg-container">
    <div class="pd-esg-bg"></div>
    <div class="pd-esg-overlay"></div>
    <div class="pd-esg-content">佩蒂股份可持续发展数据管理平台</div>
    <div class="pd-esg-button-container">
      <el-button
        color="#A6B7DE"
        class="pd-esg-button"
        @click="handleClickFillIn"
        >开始填报</el-button
      >
      <el-button
        color="#E2F1EE"
        class="pd-esg-button"
        @click="handleClickReport"
        >历年报告</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pd-esg-bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-image: url("./imgs/bg.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}

.pd-esg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 20%); // 黑色半透明遮罩
  backdrop-filter: blur(5px);
  backdrop-filter: blur(5px); // 模糊效果 // Safari兼容
}

.pd-esg-content {
  position: relative;
  z-index: 1;
  padding-top: 20vh;
  font-size: 48px;
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 50%); // 文字阴影增强可读性
}

.pd-esg-button-container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 15vh;
}

.pd-esg-button {
  width: 250px;
  height: 150px;
  margin: 0 100px;
  font-size: 32px;
  color: #0a0a0a;
  border-radius: 12px;
}
</style>
