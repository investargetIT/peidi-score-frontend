import { storageLocal } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { router } from "@/router";
import { initRouter, getTopMenu } from "@/router/utils";
import { emitter } from "@/utils/mitt";
import { useUserStoreHook } from "@/store/modules/user";
import { getUserCheck, getUserDataSourceApi } from "@/api/user";
import { getEnumTypeList, getUserInfoData } from "@/api/pmApi";
import { encryptMessage } from "@/views/login/utils/cryptojs";
import {
  type LoginScope,
  clearAuthToken,
  clearRememberedCreds,
  getRememberedCreds
} from "@/utils/auth";

/** 未登录时记录的路由，登录成功后回跳 */
export const UNLOGIN_URL_KEY = "pridi-unLoginUrl";

/** 后端通用返回结构 */
type ApiResult<T = any> = {
  success: boolean;
  msg?: string;
  code?: number;
  data: T;
};

/** 跳转统一登录门户（携带当前地址作为回跳 source） */
export function redirectToWebLogin(): void {
  // 拼接时间戳，避免缓存问题
  const timestamp = new Date().getTime();
  window.location.href = `https://login.peidigroup.cn/${timestamp}/#/login?source=${encryptMessage(window.location.href)}`;
}

/**
 * 登录成功后的初始化：拉用户数据源、枚举、user-check，写入本地并初始化动态路由。
 * 与登录门户回跳页（`views/login/index_.vue`）原有流程保持一致。
 */
async function bootstrapUserSession(
  username: string,
  token: any
): Promise<boolean> {
  const userRes = (await getUserDataSourceApi({ token })) as ApiResult;
  if (!userRes?.success) {
    message("获取用户数据失败" + userRes?.msg, { type: "error" });
    return false;
  }

  // 初始化用户配置信息 ddUserInfo（非阻塞，与原流程一致）
  (getUserInfoData({ userId: userRes?.data?.id }) as Promise<ApiResult>).then(
    res => {
      if (res?.code === 200 && res?.data) {
        const { hireDate, email } = res.data;
        storageLocal().setItem("ddUserInfo", {
          ...((storageLocal().getItem("ddUserInfo") as object) || {}),
          hired_date: new Date(hireDate).getTime().toString(),
          email
        });
      }
    }
  );

  localStorage.setItem(
    "dataSource",
    JSON.stringify({ ...(userRes.data as object), userEmail: username })
  );

  const [adminUserRes, esgRes, userCheckRes] = (await Promise.all([
    getEnumTypeList({ type: "adminUser" }) as Promise<ApiResult>,
    getEnumTypeList({ type: "esg" }) as Promise<ApiResult>,
    getUserCheck(token) as Promise<ApiResult>
  ])) as ApiResult[];

  if (!adminUserRes?.success) {
    message("获取管理员列表失败" + adminUserRes?.msg, { type: "error" });
    return false;
  }
  localStorage.setItem("adminUserEnum", JSON.stringify(adminUserRes.data));

  if (!esgRes?.success) {
    message("获取ESG枚举列表失败" + esgRes?.msg, { type: "error" });
    return false;
  }
  localStorage.setItem("esgEnum", JSON.stringify(esgRes.data));

  if (!userCheckRes?.success) {
    message("user-check接口获取用户信息失败+" + userCheckRes?.msg, {
      type: "error"
    });
    return false;
  }
  localStorage.setItem(
    "esgUserInfo",
    JSON.stringify({
      userid: userCheckRes?.data?.id,
      site: userCheckRes?.data?.dataSource,
      dingId: userCheckRes?.data?.dingId
    })
  );

  return true;
}

/** 登录成功后跳转：优先回跳未登录时记录的地址 */
export function navigateAfterLogin(): void {
  const unLoginUrl = localStorage.getItem(UNLOGIN_URL_KEY);
  initRouter().then(() => {
    if (unLoginUrl) {
      router.push(unLoginUrl).then(() => {
        message("登录成功", { type: "success" });
      });
      return;
    }
    router.push(getTopMenu(true).path).then(() => {
      message("登录成功", { type: "success" });
    });
  });
}

/** 用账号密码登录并完成会话初始化 */
export async function loginWithCreds(
  username: string,
  password: string,
  scope: LoginScope
): Promise<boolean> {
  const res = await useUserStoreHook().loginByUsername(
    { username, password },
    scope
  );
  if (!res?.success) {
    message("登录失败" + (res as any)?.msg, { type: "error" });
    return false;
  }
  return bootstrapUserSession(username, res.data);
}

/** 静默登录单飞：并发守卫 / 多条请求同时 401 时只登一次（按是否需初始化会话分开） */
const rememberLoginInFlight: Record<string, Promise<boolean> | null> = {
  true: null,
  false: null
};
/** token 过期处理的单飞 */
let tokenExpiredInFlight = false;

/**
 * 用"记住我"凭据静默登录，免去跳转登录门户。
 * 凭据失效（改密 / 账号被禁用等）：清掉凭据并返回 false，由调用方回退到登录门户，
 * 避免拿着废凭据反复重试形成"登录 → 被踢 → 再登录"的循环。
 * @param bootstrap 是否同时完成会话初始化（打开页面时需要，token 过期重登时不需要）
 */
export function loginWithRememberedCreds(bootstrap = true): Promise<boolean> {
  const slot = String(bootstrap);
  const cached = rememberLoginInFlight[slot];
  if (cached) return cached;

  const task = (async () => {
    const creds = getRememberedCreds();
    if (!creds) return false;

    try {
      const ok = bootstrap
        ? await loginWithCreds(creds.username, creds.password, "persist")
        : (
            await useUserStoreHook().loginByUsername(
              { username: creds.username, password: creds.password },
              "persist"
            )
          )?.success;

      if (ok) {
        console.log("✅ 已用记住的账号密码自动登录");
        return true;
      }
    } catch (error) {
      console.error("记住的账号密码自动登录异常", error);
    }

    console.warn("⚠️ 记住的账号密码已失效，已清除，回退登录门户");
    clearRememberedCreds();
    return false;
  })();

  const inFlight = task.finally(() => {
    rememberLoginInFlight[slot] = null;
  });
  rememberLoginInFlight[slot] = inFlight;
  return inFlight;
}

/**
 * token 失效 / 被踢时的处理：先清 token（不动"记住我"凭据），
 * 有凭据则静默重登后 reload，否则清凭据并走登出流程回登录门户。
 * 重登成功会写入新 token，reload 后接口可正常重放。
 */
export async function handleTokenExpired(): Promise<void> {
  // 页面里可能同时有多个请求报过期，只处理一次
  if (tokenExpiredInFlight) return;
  tokenExpiredInFlight = true;

  // 只清 token，保留 user-info 供重登后沿用
  clearAuthToken();
  if (await loginWithRememberedCreds(false)) {
    window.location.reload();
    return;
  }
  emitter.emit("logout");
}
