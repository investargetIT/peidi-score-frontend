const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/login_",
    name: "login_",
    component: () => import("@/views/login/index_.vue"),
    hidden: true,
    meta: {
      rank: 103,
      showLink: false // 方式4：自定义hideInMenu属性
    }
  },
  {
    path: "/pdesg",
    name: "Pdesg",
    meta: {
      rank: 104,
      showLink: false
    },
    redirect: "/pdesg/home",
    children: [
      {
        path: "/pdesg/home",
        name: "PdesgHome",
        component: () => import("@/views/EsgPlus/home/index.vue")
      },
      {
        path: "/pdesg/fillIn",
        name: "PdesgFillIn",
        component: () => import("@/views/Esg/fillIn.vue")
      },
      {
        path: "/pdesg/config",
        name: "PdesgConfig",
        component: () => import("@/views/EsgPlus/config/index.vue")
      },
      {
        path: "/pdesg/survey",
        name: "PdesgSurvey",
        component: () => import("@/views/EsgPlus/survey/index.vue")
      },
      {
        path: "/pdesg/view",
        name: "PdesgView",
        component: () => import("@/views/EsgPlus/view/index.vue")
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
