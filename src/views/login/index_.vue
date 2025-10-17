<script setup lang="ts">
import { onMounted } from "vue";
import { initRouter, getTopMenu } from "@/router/utils";
import { useRoute, useRouter } from "vue-router";
import { message } from "@/utils/message";
import { useUserStoreHook } from "../../store/modules/user";
import { storageLocal } from "@pureadmin/utils";
import { getUserCheck, getUserDataSourceApi } from "../../api/user";
import { getEnumTypeList } from "@/api/pmApi";
import { CrossStorageClient } from "cross-storage";
import { decrypt } from "./utils/cryptojs";

const route = useRoute();
const router = useRouter();

const getKeyFromUrl = () => {
  const url = window.location.href;
  const k1Match = url.match(/k1=([^&]+)/);
  const k2Match = url.match(/k2=([^&]+)/);
  const k1 = k1Match ? k1Match[1] : null;
  const k2 = k2Match ? k2Match[1] : null;
  console.log("k1", k1);
  console.log("k2", k2);
  return { k1, k2 };
};
const queryKey = getKeyFromUrl();

onMounted(() => {
  let userInfo = storageLocal().getItem("peidi-userInfo");
  console.log("userInfo", userInfo);

  if (queryKey.k1 && queryKey.k2) {
    const username = decrypt(queryKey.k1);
    const password = decrypt(queryKey.k2);
    userInfo = { username, password };
  }
  console.log("userInfo", userInfo);

  if (userInfo) {
    const tempInfo = localStorage.getItem("ddUserInfo");

    // 从 ddUserInfo 中获取 mobile 数据
    let mobile = "";
    if (tempInfo) {
      try {
        const ddUserInfo = JSON.parse(tempInfo);
        mobile = ddUserInfo.mobile || "";
        console.log("mobile from ddUserInfo:", mobile);
      } catch (error) {
        console.error("解析 ddUserInfo 失败:", error);
      }
    }

    useUserStoreHook()
      .loginByUsername({
        username: userInfo?.username,
        password: userInfo?.password,
        site: userInfo?.site
      })
      .then(res => {
        if (res.success) {
          // 先获取用户数据源信息
          getUserDataSourceApi({ token: res.data }).then(userRes => {
            console.log("res", userRes);
            if (userRes.success) {
              const { data } = userRes;
              localStorage.setItem(
                "dataSource",
                JSON.stringify({ ...data, userEmail: userInfo?.username })
              );

              // 使用 Promise.all 并行获取多个枚举类型列表
              Promise.all([
                getEnumTypeList({ type: "adminUser" }),
                getEnumTypeList({ type: "esg" })
              ])
                .then(([adminUserRes, esgRes]) => {
                  // 处理 adminUser 枚举结果
                  if (adminUserRes.success) {
                    localStorage.setItem(
                      "adminUserEnum",
                      JSON.stringify(adminUserRes.data)
                    );
                  } else {
                    message("获取管理员列表失败", { type: "error" });
                    return;
                  }

                  // 处理 esg 枚举结果
                  if (esgRes.success) {
                    localStorage.setItem(
                      "esgEnum",
                      JSON.stringify(esgRes.data)
                    );
                  } else {
                    message("获取ESG枚举列表失败", { type: "error" });
                    return;
                  }

                  // 所有枚举数据获取成功后，进行路由跳转
                  if (route.query.tabName == "worker") {
                    return initRouter().then(() => {
                      router.push({
                        path: "/my/index",
                        query: { tabName: "worker" }
                      });
                    });
                  } else {
                    return initRouter().then(() => {
                      router.push(getTopMenu(true).path).then(() => {
                        message("登录成功", { type: "success" });
                      });
                    });
                  }
                })
                .catch(error => {
                  console.error("获取枚举类型列表失败:", error);
                  message("获取枚举类型列表失败", { type: "error" });
                });
            } else {
              message("获取用户数据失败", { type: "error" });
            }
          });

          //#region ESG权限逻辑
          getUserCheck(res?.data).then(res =>
            localStorage.setItem(
              "esgUserInfo",
              JSON.stringify({
                userid: res?.data?.id,
                site: res?.data?.dataSource
              })
            )
          );
          //#endregion
        } else {
          message("登录失败", { type: "error" });
        }
      });
  } else {
    const storage = new CrossStorageClient(
      `http://login.peidigroup.cn/hub.html`
    );

    storage
      .onConnect()
      .then(() => {
        return storage.get("peidi-userInfo");
      })
      .then(res => {
        console.log("peidi-userInfo", res); // 输出: value
      })
      .catch(err => {
        console.error(err);
      });

    if (process.env.NODE_ENV === "development") {
      // window.location.href = `http://localhost:8849/#/login?source=${window.location.href}`;
      window.location.href = `http://login.peidigroup.cn/#/login?source=${window.location.href}`;
    } else {
      window.location.href = `http://login.peidigroup.cn/#/login?source=${window.location.href}`;
    }
  }
});
</script>

<template>
  <div></div>
</template>
