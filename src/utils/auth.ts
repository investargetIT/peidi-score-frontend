import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import {
  storageLocal,
  storageSession,
  isString,
  isIncludeAllChildren
} from "@pureadmin/utils";

/**
 * 登录态作用域：
 * - persist：token 存 cookie（带过期时间），关掉浏览器再打开仍是登录态（勾选"记住我"）
 * - session：token 存 sessionStorage，关掉页面即失效（未勾选"记住我"）
 */
export type LoginScope = "persist" | "session";

export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** `accessToken`的过期时间（时间戳） */
  expires: T;
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string;
  /** 头像 */
  avatar?: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 当前登录用户的角色 */
  roles?: Array<string>;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
export const dataSourceKey = "dataSource";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token`：先读会话级（未勾选"记住我"），再读持久化（勾选"记住我"） */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  // console.log('JSON.parse(Cookies.get(TokenKey))',JSON.parse(Cookies.get(TokenKey)));
  const sessionToken = storageSession().getItem<DataInfo<number>>(TokenKey);
  if (sessionToken) return sessionToken;

  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * 获取当前登录用户的`user-info`：先读会话级（未勾选"记住我"），再读持久化（勾选"记住我"）。
 * 统一从此处读取，避免各处直接读`localStorage`导致会话级登录态取不到。
 */
export function getUserInfo<T = DataInfo<number>>(): T | null {
  return (
    storageSession().getItem<T>(userKey) ||
    storageLocal().getItem<T>(userKey) ||
    null
  );
}

/**
 * 写入`token`：两种作用域互斥，写前先清掉另一份，避免残留上一个登录态。
 * - session：只在本标签页有效，关掉页面即失效
 * - persist：写 cookie（带过期时间），关掉浏览器再打开仍是登录态
 */
export function writeAuthToken(token: string, scope: LoginScope): void {
  const currentDate = new Date();
  // 一天后登陆失效
  currentDate.setDate(currentDate.getDate() + 1);
  const expires = currentDate.getTime();
  const cookieString = JSON.stringify({ accessToken: token, expires });

  if (scope === "session") {
    Cookies.remove(TokenKey);
    try {
      storageSession().setItem(TokenKey, { accessToken: token, expires });
      return;
    } catch {
      /* sessionStorage 不可用（隐私模式等）时退化为持久化 */
    }
  }

  try {
    storageSession().removeItem(TokenKey);
  } catch {
    /* ignore */
  }
  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now()) / 86400000
      })
    : Cookies.set(TokenKey, cookieString);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`、`refreshToken`、`expires`这七条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: DataInfo<Date>, scope: LoginScope = "persist") {
  const accessToken = data as unknown as string;

  const { isRemembered, loginDay } = useUserStoreHook();
  let currentDate = new Date();
  // 一天后登陆失效
  currentDate.setDate(currentDate.getDate() + 1);
  const expires = currentDate.getTime();

  // 按「记住我」区分 token 落盘作用域：session 存 sessionStorage，persist 存 cookie
  writeAuthToken(accessToken, scope);

  Cookies.set(
    multipleTabsKey,
    "true",
    scope === "persist" && isRemembered
      ? {
          expires: loginDay
        }
      : {}
  );

  function setUserKey({ avatar, username, nickname, roles, permissions }) {
    useUserStoreHook().SET_AVATAR(avatar);
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_NICKNAME(nickname);
    useUserStoreHook().SET_ROLES(roles);
    useUserStoreHook().SET_PERMS(permissions);
    // 与 token 同作用域落盘，否则「不记住」也会持久化用户信息；
    // 两种作用域互斥，写前先清掉另一份，避免残留上一个登录态
    if (scope === "session") {
      storageLocal().removeItem(userKey);
      storageSession().setItem(userKey, {
        expires,
        avatar,
        username,
        nickname,
        roles,
        permissions
      });
    } else {
      try {
        storageSession().removeItem(userKey);
      } catch {
        /* ignore */
      }
      storageLocal().setItem(userKey, {
        expires,
        avatar,
        username,
        nickname,
        roles,
        permissions
      });
    }
  }

  if (data.username && data.roles) {
    const { username, roles } = data;
    setUserKey({
      avatar: data?.avatar ?? "",
      username,
      nickname: data?.nickname ?? "",
      roles,
      permissions: data?.permissions ?? []
    });
  } else {
    const cached = getUserInfo<DataInfo<number>>();
    const avatar = cached?.avatar ?? "";
    const username = cached?.username ?? "";
    const nickname = cached?.nickname ?? "";
    const roles = cached?.roles ?? [];
    const permissions = cached?.permissions ?? [];
    setUserKey({
      avatar,
      username,
      nickname,
      roles,
      permissions
    });
  }
}

/** 只删除`token`（保留`user-info`），token 过期静默重登前调用 */
export function clearAuthToken() {
  Cookies.remove(TokenKey);
  try {
    storageSession().removeItem(TokenKey);
  } catch {
    /* ignore */
  }
}

/** 删除`token`以及key值为`user-info`的登录信息（两个作用域都清） */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  try {
    storageSession().removeItem(TokenKey);
    storageSession().removeItem(userKey);
  } catch {
    /* ignore */
  }
  storageLocal().removeItem(userKey);
  storageLocal().removeItem(dataSourceKey);
  storageLocal().removeItem("curUserAvatar");
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return token;
};

/******************************** 「记住我」凭据 ********************************/

// "记住我"凭据（登录门户勾选"记住我"时由回跳参数 key1/key2 落盘）
export const REMEMBER_CREDS_KEY = "peidi-userInfo";

export type RememberedCreds = { username: string; password: string };

/** 读取已记住的账号密码；结构非法时视为没有 */
export function getRememberedCreds(): RememberedCreds | null {
  try {
    const parsed =
      storageLocal().getItem<Partial<RememberedCreds>>(REMEMBER_CREDS_KEY);
    if (
      typeof parsed?.username === "string" &&
      typeof parsed?.password === "string" &&
      parsed.username &&
      parsed.password
    ) {
      return { username: parsed.username, password: parsed.password };
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** 保存"记住我"凭据 */
export function saveRememberedCreds(creds: RememberedCreds): void {
  try {
    storageLocal().setItem(REMEMBER_CREDS_KEY, creds);
  } catch {
    /* ignore */
  }
}

/** 清除"记住我"凭据（退出登录、凭据失效时调用） */
export function clearRememberedCreds(): void {
  try {
    storageLocal().removeItem(REMEMBER_CREDS_KEY);
  } catch {
    /* ignore */
  }
}

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return isAuths ? true : false;
};
