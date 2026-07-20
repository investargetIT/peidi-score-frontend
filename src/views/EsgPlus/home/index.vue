<template>
  <div class="pd-esg-container">
    <div class="pd-esg-bg" />
    <div class="pd-esg-overlay" />

    <!-- 顶部品牌栏 -->
    <header class="pd-esg-topbar">
      <div class="pd-esg-brand">
        <div class="pd-esg-brand-mark">P</div>
        <div class="pd-esg-brand-text">
          <span class="brand-name">佩蒂股份</span>
          <span class="brand-en">PEIDI</span>
        </div>
      </div>
      <div class="pd-esg-topbar-right">
        <div class="pd-esg-topbar-tag">Environmental · Social · Governance</div>
        <div v-if="username" class="pd-esg-welcome">
          <el-icon><UserFilled /></el-icon>
          <span>欢迎回来，<b>{{ username }}</b></span>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="pd-esg-main">
      <div class="pd-esg-content">
        <div class="pd-esg-badge">
          <span class="dot" />
          可持续发展数据平台
        </div>
        <h1 class="pd-esg-title">ESG 数据管理平台</h1>
        <p class="pd-esg-subtitle">
          汇聚环境、社会与公司治理数据，助力企业透明披露与可持续发展决策
        </p>
        <p class="pd-esg-english">ESG Data Management Platform</p>

        <div class="pd-esg-button-container">
          <button class="pd-esg-button primary" @click="handleClickFillIn">
            <span class="btn-icon">
              <el-icon><EditPen /></el-icon>
            </span>
            <span class="btn-text">
              <span class="btn-main">开始填报</span>
              <span class="btn-sub">录入年度 ESG 数据</span>
            </span>
            <el-icon class="btn-arrow"><Right /></el-icon>
          </button>

          <button class="pd-esg-button ghost" @click="handleClickReport">
            <span class="btn-icon">
              <el-icon><Document /></el-icon>
            </span>
            <span class="btn-text">
              <span class="btn-main">历年报告</span>
              <span class="btn-sub">查看可持续发展报告</span>
            </span>
            <el-icon class="btn-arrow"><Right /></el-icon>
          </button>

          <button
            v-if="showConfig"
            class="pd-esg-button ghost"
            @click="handleClickConfig"
          >
            <span class="btn-icon">
              <el-icon><Setting /></el-icon>
            </span>
            <span class="btn-text">
              <span class="btn-main">配置管理</span>
              <span class="btn-sub">维护表单模板配置</span>
            </span>
            <el-icon class="btn-arrow"><Right /></el-icon>
          </button>
        </div>
      </div>

      <!-- 右下角三大支柱 -->
      <div class="pd-esg-pillars">
        <div class="pillar">
          <div class="pillar-letter">E</div>
          <div class="pillar-name">环境</div>
          <div class="pillar-en">Environmental</div>
        </div>
        <div class="pillar">
          <div class="pillar-letter">S</div>
          <div class="pillar-name">社会</div>
          <div class="pillar-en">Social</div>
        </div>
        <div class="pillar">
          <div class="pillar-letter">G</div>
          <div class="pillar-name">治理</div>
          <div class="pillar-en">Governance</div>
        </div>
      </div>
    </main>

    <footer class="pd-esg-footer">
      {{ new Date().getFullYear() }} 佩蒂股份 · ESG 数据管理平台
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  EditPen,
  Document,
  Setting,
  Right,
  UserFilled
} from "@element-plus/icons-vue";
const router = useRouter();

// 当前登录用户名
const username = computed(() => {
  try {
    const info = JSON.parse(localStorage.getItem("dataSource") || "{}");
    return info.username || "";
  } catch {
    return "";
  }
});

// 仅指定 userid 可看到配置入口
const showConfig = computed(() => {
  try {
    const info = JSON.parse(localStorage.getItem("esgUserInfo") || "{}");
    return info.userid === "1926449443739600965";
  } catch {
    return false;
  }
});

const handleClickFillIn = () => {
  router.push("/pdesg/survey");
};
const handleClickReport = () => {
  window.open("https://www.peidibrand.com/sustainable-development", "_blank");
};
const handleClickConfig = () => {
  router.push("/pdesg/config");
};
</script>

<style lang="scss" scoped>
.pd-esg-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.pd-esg-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url("./imgs/bg.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  transform: scale(1.02);
}

.pd-esg-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;

  // 深色渐变 + 品牌蓝点缀，更显正式沉稳
  background:
    linear-gradient(
      120deg,
      rgb(10 18 40 / 82%) 0%,
      rgb(14 26 58 / 62%) 42%,
      rgb(8 16 34 / 35%) 100%
    ),
    radial-gradient(
      circle at 78% 82%,
      rgb(66 104 249 / 25%) 0%,
      transparent 55%
    );
}

/* 顶部品牌栏 */
.pd-esg-topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 56px;
}

.pd-esg-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pd-esg-brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #4268f9, #2d49c9);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgb(66 104 249 / 45%);
}

.pd-esg-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  .brand-name {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 2px;
  }

  .brand-en {
    font-size: 12px;
    color: rgb(255 255 255 / 65%);
    letter-spacing: 3px;
  }
}

.pd-esg-topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pd-esg-welcome {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  font-size: 14px;
  color: rgb(255 255 255 / 88%);
  letter-spacing: 0.5px;
  background: rgb(66 104 249 / 22%);
  border: 1px solid rgb(66 104 249 / 42%);
  border-radius: 20px;
  backdrop-filter: blur(6px);

  b {
    font-weight: 600;
    color: #fff;
  }
}

.pd-esg-topbar-tag {
  padding: 8px 18px;
  font-size: 13px;
  color: rgb(255 255 255 / 82%);
  letter-spacing: 1px;
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 20px;
  backdrop-filter: blur(6px);
}

/* 主体 */
.pd-esg-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 96px;
}

.pd-esg-content {
  max-width: 640px;
}

.pd-esg-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  margin-bottom: 28px;
  font-size: 14px;
  color: #dbe3ff;
  letter-spacing: 1px;
  background: rgb(66 104 249 / 18%);
  border: 1px solid rgb(66 104 249 / 40%);
  border-radius: 20px;

  .dot {
    width: 8px;
    height: 8px;
    background: #7d96ff;
    border-radius: 50%;
    box-shadow: 0 0 8px #7d96ff;
  }
}

.pd-esg-title {
  margin: 0 0 20px;
  font-size: 60px;
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 4px 20px rgb(0 0 0 / 45%);
}

.pd-esg-subtitle {
  max-width: 540px;
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 400;
  line-height: 1.7;
  color: rgb(255 255 255 / 88%);
}

.pd-esg-english {
  margin: 0 0 48px;
  font-size: 15px;
  color: rgb(255 255 255 / 55%);
  letter-spacing: 3px;
  text-transform: uppercase;
}

.pd-esg-button-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 420px;
}

.pd-esg-button {
  display: flex;
  gap: 18px;
  align-items: center;
  width: 100%;
  padding: 18px 24px;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.28s ease;

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    font-size: 22px;
    border-radius: 12px;
  }

  .btn-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.35;

    .btn-main {
      font-size: 19px;
      font-weight: 600;
    }

    .btn-sub {
      font-size: 13px;
      opacity: 0.7;
    }
  }

  .btn-arrow {
    font-size: 18px;
    opacity: 0.6;
    transition: transform 0.28s ease;
  }

  &:hover .btn-arrow {
    transform: translateX(4px);
    opacity: 1;
  }
}

.pd-esg-button.primary {
  color: #fff;
  background: linear-gradient(135deg, #4268f9, #2d49c9);
  border: 1px solid rgb(255 255 255 / 15%);
  box-shadow: 0 12px 30px rgb(66 104 249 / 45%);

  .btn-icon {
    color: #fff;
    background: rgb(255 255 255 / 20%);
  }

  &:hover {
    box-shadow: 0 16px 40px rgb(66 104 249 / 60%);
    transform: translateY(-3px);
  }
}

.pd-esg-button.ghost {
  color: #fff;
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 22%);
  backdrop-filter: blur(8px);

  .btn-icon {
    color: #dbe3ff;
    background: rgb(66 104 249 / 22%);
  }

  &:hover {
    background: rgb(255 255 255 / 15%);
    border-color: rgb(255 255 255 / 40%);
    transform: translateY(-3px);
  }
}

/* 三大支柱 */
.pd-esg-pillars {
  display: flex;
  gap: 18px;
  align-self: flex-end;
  margin-bottom: 80px;
}

.pillar {
  width: 120px;
  padding: 24px 18px;
  text-align: center;
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  transition: all 0.28s ease;

  .pillar-letter {
    margin-bottom: 8px;
    font-size: 40px;
    font-weight: 700;
    color: #7d96ff;
    text-shadow: 0 2px 10px rgb(125 150 255 / 40%);
  }

  .pillar-name {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }

  .pillar-en {
    margin-top: 2px;
    font-size: 11px;
    color: rgb(255 255 255 / 55%);
    letter-spacing: 1px;
  }

  &:hover {
    background: rgb(255 255 255 / 14%);
    transform: translateY(-4px);
  }
}

/* 页脚 */
.pd-esg-footer {
  position: relative;
  z-index: 1;
  padding: 20px 56px;
  font-size: 13px;
  color: rgb(255 255 255 / 50%);
  letter-spacing: 1px;
}

/* 响应式 */
@media (width <= 1200px) {
  .pd-esg-pillars {
    display: none;
  }
}

@media (width <= 768px) {
  .pd-esg-topbar {
    padding: 20px 24px;
  }

  .pd-esg-topbar-tag {
    display: none;
  }

  .pd-esg-main {
    padding: 0 24px;
  }

  .pd-esg-title {
    font-size: 40px;
  }

  .pd-esg-subtitle {
    font-size: 16px;
  }
}
</style>
