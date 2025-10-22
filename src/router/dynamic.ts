/**
 * 想做一个动态路由配置，但是发现添加路由后，菜单没有显示，效果没有触发，后续需要研究一下
 */

import { router } from "./index";
import { RouteRecordRaw } from "vue-router";
import i18n from "@/plugins/i18n";
import { usePermissionStoreHook } from "../store/modules/permission";
const { t } = i18n.global;

const Layout = () => import("@/layout/index.vue");

// 任务管理员路由配置
const taskAdminRoutes: RouteRecordRaw[] = [
  {
    path: "/task",
    name: "TaskLayout",
    redirect: "/task/index",
    component: () => import("@/layout/index.vue"),
    meta: {
      icon: "flowbite:address-book-outline",
      title: t("menu.task"),
      rank: 3
    },
    children: [
      {
        path: "/task/index",
        name: "task",
        component: () => import("@/views/employeeTask/index.vue"),
        meta: {
          title: t("menu.task"),
          showParent: false,
          icon: "flowbite:address-book-outline"
        }
      }
    ]
  }
];

// ESG 管理员路由配置
const esgAdminRoutes: RouteRecordRaw[] = [
  {
    path: "/esg",
    name: "EsgLayout",
    redirect: "/esg/index",
    component: Layout,
    meta: {
      icon: "ep:data-analysis",
      title: t("menu.esg"),
      rank: 4
    },
    children: [
      {
        path: "/esg/index",
        name: "esg",
        component: () => import("@/views/esg/index.vue"),
        meta: {
          title: t("menu.esg"),
          showParent: false,
          icon: "ep:data-analysis"
        }
      }
    ]
  }
];

// 系统管理员路由配置
const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/monitor",
    name: "MonitorLayout",
    redirect: "/monitor/index",
    component: Layout,
    meta: {
      icon: "ep:setting",
      title: t("menu.adminboard"),
      rank: 999 // 管理员设置 最后显示
    },
    children: [
      {
        path: "/monitor/index",
        name: "monitor",
        component: () => import("@/views/monitor/index.vue"),
        meta: {
          title: t("menu.adminboard"),
          showParent: false,
          icon: "ep:setting"
        }
      }
    ]
  }
];

// 检查路由是否已存在
function hasRoute(name: string): boolean {
  return router.hasRoute(name);
}

// 添加权限路由
export function addPermissionRoutes() {
  const { isAdmin, isEsgAdmin, isSiteHangzhou } = usePermissionCheck();

  // 添加任务管理员路由
  if (isSiteHangzhou() && !hasRoute("TaskLayout")) {
    taskAdminRoutes.forEach(route => {
      // router.addRoute(route);
    });
    // usePermissionStoreHook().handleWholeMenus(taskAdminRoutes);
  }

  // 添加ESG管理员路由
  if (isEsgAdmin() && !hasRoute("EsgLayout")) {
    esgAdminRoutes.forEach(route => {
      // router.addRoute(route);
    });
  }

  // 添加系统管理员路由
  if (isAdmin() && !hasRoute("MonitorLayout")) {
    adminRoutes.forEach(route => {
      // router.addRoute(route);
    });
  }

  console.log("*****************添加权限路由*****************");
  console.log("isAdmin:", isAdmin());
  console.log("isEsgAdmin:", isEsgAdmin());
  console.log("isSiteHangzhou:", isSiteHangzhou());
  // 查看添加后的路由表
  console.log("router:", router.options.routes);
  console.log("*****************添加权限路由*****************");
}

// 移除权限路由
export function removePermissionRoutes() {
  if (hasRoute("EsgLayout")) {
    router.removeRoute("EsgLayout");
  }
  if (hasRoute("MonitorLayout")) {
    router.removeRoute("MonitorLayout");
  }
}

// 权限检查函数（响应式）
export function usePermissionCheck() {
  const isAdmin = () => {
    const adminUserEnum = JSON.parse(
      localStorage.getItem("adminUserEnum") || "[]"
    );
    const curDDUserInfo = JSON.parse(
      localStorage.getItem("esgUserInfo") || "{}"
    );
    return adminUserEnum.some(item => item.value === curDDUserInfo?.userid);
  };

  const isEsgAdmin = () => {
    const esgEnum = JSON.parse(localStorage.getItem("esgEnum") || "[]");
    const curDDUserInfo = JSON.parse(
      localStorage.getItem("esgUserInfo") || "{}"
    );
    return esgEnum.some(item => item.value.includes(curDDUserInfo?.userid));
  };

  const isSiteHangzhou = () => {
    const esgUserInfo = JSON.parse(localStorage.getItem("esgUserInfo") || "{}");
    if (esgUserInfo?.site === "3") {
      return true;
    }
    return false;
  };

  return { isAdmin, isEsgAdmin, isSiteHangzhou };
}
