const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");
import cateIcon from "../../assets/png/cateIcon.png";
import i18n from "@/plugins/i18n";
const { t } = i18n.global;
export default {
  path: "/",
  name: "Home",
  redirect: "/index",
  component: Layout,
  meta: {
    icon: "prime:box",
    title: t("menu.dashboard"),
    rank: 0
  },
  children: [
    {
      path: "/index",
      name: "dashboard",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        title: t("menu.dashboard"),
        showParent: false
      }
    }
  ]
} satisfies RouteConfigsTable;
