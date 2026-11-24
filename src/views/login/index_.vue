<script setup lang="ts">
import { onMounted } from "vue";
import { decryptMessage } from "./utils/cryptojs";
import {
  getRememberedCreds,
  saveRememberedCreds,
  clearRememberedCreds
} from "@/utils/auth";
import {
  loginWithCreds,
  loginWithRememberedCreds,
  navigateAfterLogin,
  redirectToWebLogin
} from "@/utils/portalLogin";
import { message } from "@/utils/message";

/** 取 url 上的 key1(账号) / key2(密码) / key3(记住我)，值均为 AES 加密后的字符串 */
const getKeyFromUrl = () => {
  const url = window.location.href;
  const key1Match = url.match(/key1=([^&]+)/);
  const key2Match = url.match(/key2=([^&]+)/);
  const key3Match = url.match(/key3=([^&]+)/);
  const key1 = key1Match ? key1Match[1] : null;
  const key2 = key2Match ? key2Match[1] : null;
  const key3 = key3Match ? key3Match[1] : null;
  console.log("🔐 登录门户回跳 key1/key2/key3", { key1, key2, key3 });
  return { key1, key2, key3 };
};

onMounted(async () => {
  const keys = getKeyFromUrl();

  // key3 即门户"记住我"勾选态；缺失时为 null（老门户兼容）
  const isRemember = keys.key3 ? decryptMessage(keys.key3) === "true" : null;

  const username = keys.key1 ? decryptMessage(keys.key1) : "";
  const password = keys.key2 ? decryptMessage(keys.key2) : "";

  if (isRemember !== null) {
    if (isRemember) {
      saveRememberedCreds({ username, password });
    } else {
      clearRememberedCreds();
    }
  } else {
    // 门户没带 key3：若与记住的账号不是同一个，清掉旧凭据，避免静默登录成上一个用户
    const remembered = getRememberedCreds();
    if (remembered && remembered.username !== username) {
      clearRememberedCreds();
    }
  }

  // 带回了完整账号密码：走正常登录
  if (username && password) {
    // 明确不记住 → 本次登录只在会话内有效；"true" / 未携带 → 持久化（兼容老门户）
    const scope = isRemember === false ? "session" : "persist";
    try {
      const ok = await loginWithCreds(username, password, scope);
      if (!ok) {
        clearRememberedCreds();
        redirectToWebLogin();
        return;
      }
      navigateAfterLogin();
    } catch (error) {
      console.error("登录失败:", error);
      message("登录失败" + error, { type: "error" });
      clearRememberedCreds();
      redirectToWebLogin();
    }
    return;
  }

  // 没带账号密码：先尝试用「记住我」凭据静默登录，兜底走登录门户（门户自身 SSO Cookie 会把你登进去）
  if (await loginWithRememberedCreds()) {
    navigateAfterLogin();
    return;
  }
  redirectToWebLogin();
});
</script>

<template>
  <div class="pridi-loader2-container">
    <div class="loader2"></div>
  </div>
</template>

<style lang="scss" scoped>
.pridi-loader2-container {
  @keyframes loading-shake {
    0% {
      transform: rotate(-5deg);
    }

    15% {
      transform: rotate(8deg);
    }

    30% {
      transform: rotate(-7deg);
    }

    45% {
      transform: rotate(6deg);
    }

    60% {
      transform: rotate(-4deg);
    }

    75% {
      transform: rotate(3deg);
    }

    90% {
      transform: rotate(-2deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  & {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .loader2 {
    width: 200px;
    height: 200px;
    background-image: url("@/assets/login/loading.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transform-origin: center center;
    animation: loading-shake 1.5s ease-in-out infinite;
  }
}
</style>
