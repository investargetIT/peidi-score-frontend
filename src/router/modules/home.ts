const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");
import cateIcon from "../../assets/png/cateIcon.png";
export default {
  path: "/",
  name: "Home",
  redirect: "/index",
  component: Layout,
  meta: {
    icon: "prime:box",
    title: "menu.dashboard",
    rank: 0
  },
  children: [
    {
      path: "/index",
      name: "task",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        title: "menu.dashboard",
        showParent: false
      }
    }
  ]
} satisfies RouteConfigsTable;
