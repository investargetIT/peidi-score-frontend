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
import { decryptMessage, encryptMessage } from "./utils/cryptojs";
import { getUserInfoData } from "../../api/pmApi";

const route = useRoute();
const router = useRouter();

const getKeyFromUrl = () => {
  const url = window.location.href;
  const key1Match = url.match(/key1=([^&]+)/);
  const key2Match = url.match(/key2=([^&]+)/);
  const key3Match = url.match(/key3=([^&]+)/);
  const key1 = key1Match ? key1Match[1] : null;
  const key2 = key2Match ? key2Match[1] : null;
  const key3 = key3Match ? key3Match[1] : null;
  console.log("key1", key1);
  console.log("key2", key2);
  console.log("key3", key3);
  return { key1, key2, key3 };
};
const queryKey = getKeyFromUrl();

onMounted(() => {
  // let userInfo = storageLocal().getItem("peidi-userInfo");
  // console.log("userInfo", userInfo);
  let userInfo: { username: string; password: string; site?: string } | null =
    storageLocal().getItem("peidi-userInfo") || null;

  console.log("queryKey", queryKey);

  if (queryKey.key3) {
    const isRemember = decryptMessage(queryKey.key3);
    console.log("isRemember", isRemember);
    if (isRemember === "true") {
      storageLocal().setItem("peidi-userInfo", {
        username: decryptMessage(queryKey.key1 || ""),
        password: decryptMessage(queryKey.key2 || ""),
        site: null
      });
    } else {
      storageLocal().removeItem("peidi-userInfo");
    }
  }

  if (queryKey.key1 && queryKey.key2) {
    const username = decryptMessage(queryKey.key1);
    const password = decryptMessage(queryKey.key2);
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
        site: userInfo?.site || null
      })
      .then(res => {
        if (res.success) {
          // 先获取用户数据源信息
          getUserDataSourceApi({ token: res.data }).then(userRes => {
            //#region 非钉钉端参数
            getUserInfoData({
              userId: userRes?.data?.id
            }).then(res => {
              console.log("1111", res);
              if (res?.code === 200) {
                // 初始化用户配置信息 ddUserInfo
                if (res?.data) {
                  const { hireDate, email } = res?.data;
                  storageLocal().setItem("ddUserInfo", {
                    ...(storageLocal().getItem("ddUserInfo") || {}),
                    hired_date: new Date(hireDate).getTime().toString(),
                    email: email
                  });
                }
              }
            });
            //#endregion

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
                getEnumTypeList({ type: "esg" }),
                getUserCheck(res?.data)
              ])
                .then(([adminUserRes, esgRes, userCheckRes]) => {
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
                  // ESG权限逻辑
                  if (userCheckRes.success) {
                    // 因为动态路由暂时无效，先检查是否存在esgUserInfo，如果不存在则在存入后刷新一次页面，因为权限配置基本不会变
                    const isExist =
                      localStorage.getItem("esgUserInfo") !== null;
                    localStorage.setItem(
                      "esgUserInfo",
                      JSON.stringify({
                        userid: userCheckRes?.data?.id,
                        site: userCheckRes?.data?.dataSource,
                        dingId: userCheckRes?.data?.dingId
                      })
                    );
                    if (!isExist) window.location.reload();
                  } else {
                    message("获取用户检查失败", { type: "error" });
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
          // getUserCheck(res?.data).then(res =>
          //   localStorage.setItem(
          //     "esgUserInfo",
          //     JSON.stringify({
          //       userid: res?.data?.id,
          //       site: res?.data?.dataSource,
          //       dingId: res?.data?.dingId
          //     })
          //   )
          // );
          //#endregion
        } else {
          message("登录失败", { type: "error" });
        }
      })
      .catch(error => {
        console.error("登录失败:", error);
        message("登录失败", { type: "error" });
        window.location.href = `http://login.peidigroup.cn/#/login?source=${encryptMessage(window.location.href)}`;
      });
  } else {
    // const storage = new CrossStorageClient(
    //   `http://login.peidigroup.cn/hub.html`
    // );
    // storage
    //   .onConnect()
    //   .then(() => {
    //     return storage.get("peidi-userInfo");
    //   })
    //   .then(res => {
    //     console.log("peidi-userInfo", res); // 输出: value
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    if (process.env.NODE_ENV === "development") {
      // window.location.href = `http://localhost:8848/#/login?source=${encryptMessage(window.location.href)}`;
      window.location.href = `http://login.peidigroup.cn/#/login?source=${encryptMessage(window.location.href)}`;
    } else {
      window.location.href = `http://login.peidigroup.cn/#/login?source=${encryptMessage(window.location.href)}`;
    }
  }
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

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

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
