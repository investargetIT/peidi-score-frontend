<template>
  <div class="pd-esg-container">
    <div class="pd-esg-bg"></div>
    <div class="pd-esg-overlay"></div>
    <div class="pd-esg-content">
      <div class="pd-esg-title">佩蒂股份</div>
      <div class="pd-esg-subtitle">ESG数据管理平台</div>
      <div class="pd-esg-english">ESG Data Management Platform</div>
    </div>
    <div class="pd-esg-button-container">
      <el-button class="pd-esg-button" @click="handleClickFillIn"
        >开始填报</el-button
      >
      <el-button
        class="pd-esg-button"
        @click="handleClickReport"
        style="margin-left: 0"
        >历年报告</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const handleClickFillIn = () => {
  router.push("/pdesg/fillin");
};
const handleClickReport = () => {
  window.open("https://www.peidibrand.com/sustainable-development", "_blank");
};
</script>

<style lang="scss" scoped>
.pd-esg-container {
  position: relative;
  min-height: 100vh;
}

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
  background-color: rgb(0 0 0 / 25%);
}

.pd-esg-content {
  position: relative;
  z-index: 1;
  padding-top: 180px;
  padding-left: 150px;
}

.pd-esg-title {
  margin-bottom: 15px;
  font-size: 72px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 50%);
}

.pd-esg-subtitle {
  margin-bottom: 25px;
  font-size: 48px;
  color: white;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 50%);
}

.pd-esg-english {
  margin-bottom: 100px;
  font-size: 28px;
  color: white;
  text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
}

.pd-esg-button-container {
  position: relative;
  z-index: 1;
  padding-left: 150px;
}

.pd-esg-button {
  display: block;
  width: 320px;
  height: 70px;
  margin-bottom: 40px;
  font-size: 28px;
  color: white;
  cursor: pointer;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.pd-esg-button:hover {
  background-color: rgb(255 255 255 / 10%);
  box-shadow: 0 0 15px rgb(255 255 255 / 30%);
  transform: translateY(-2px);
}
</style>
