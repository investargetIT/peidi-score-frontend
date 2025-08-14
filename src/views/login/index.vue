<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import { ElMessage, type FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { initDingH5RemoteDebug } from "dingtalk-h5-remote-debug";
import { getUserInfo, register, registerMobile } from "../../api/user";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import * as dd from "dingtalk-jsapi";
import { useRoute } from "vue-router";
import { getUserDataSourceApi } from "@/api/user";
import { updateUserInfo, getEnumTypeList } from "@/api/pmApi";
import { storageLocal } from "@pureadmin/utils";
const route = useRoute();

const DINGTALK_CORP_ID = "dingfc722e531a4125b735c2f4657eb6378f";
const DINGTALK_LOGIN_FREE_DEFAULT_PASSWORD = "Aa123456";
defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();
initDingH5RemoteDebug();
const ruleForm = reactive({
  // username: "taijp@peidibrand.com",
  // password: "Aa123456"
  username: "",
  password: ""
});
const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
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
          username: ruleForm.username,
          password: ruleForm.password
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
                  JSON.stringify({ ...data, userEmail: ruleForm.username })
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
          } else {
            message("登录失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};
const ddLogin = () => {
  let ddUserEmail = "";
  dd.runtime.permission.requestAuthCode({
    corpId: DINGTALK_CORP_ID, // 企业id
    onSuccess: function (info) {
      console.log(info);
      const { code } = info;

      // 通过该免登授权码可以获取用户身份
      getUserInfo(code)
        .then(res => {
          console.log(res);
          if (res.success) {
            const { data: ddUserInfo } = res;
            console.log("ddUserInfo", ddUserInfo);
            localStorage.setItem("ddUserInfo", JSON.stringify(ddUserInfo));
            const { org_email, name, userid, mobile } = ddUserInfo;

            // 判断是否存在邮箱，决定使用邮箱注册还是手机号注册
            if (org_email) {
              console.log("使用邮箱注册，ddEmail:", org_email);
              ddUserEmail = org_email;
              ruleForm.username = `${ddUserEmail}&${mobile}`;
              ruleForm.password = DINGTALK_LOGIN_FREE_DEFAULT_PASSWORD;

              // 使用邮箱注册，添加标识
              return register({
                email: org_email,
                emailCode: "",
                password: DINGTALK_LOGIN_FREE_DEFAULT_PASSWORD,
                username: name,
                dingId: userid
              });
            } else if (mobile) {
              console.log("使用手机号注册，mobile:", mobile);
              ruleForm.username = `&${mobile}`;
              ruleForm.password = DINGTALK_LOGIN_FREE_DEFAULT_PASSWORD;

              // 使用手机号注册，添加标识
              return registerMobile({
                mobile,
                mobileCode: "",
                password: DINGTALK_LOGIN_FREE_DEFAULT_PASSWORD,
                username: name,
                dingId: userid
              });
            } else {
              message(
                "获取钉钉用户邮箱和手机号都失败：" + JSON.stringify(res),
                {
                  type: "error"
                }
              );
            }
          } else {
            message("用户注册失败：" + JSON.stringify(res), { type: "error" });
          }
        })
        .then(res => {
          if (res) {
            // 获取当前用户信息来判断注册类型
            const ddUserInfo = JSON.parse(
              localStorage.getItem("ddUserInfo") || "{}"
            );
            const isEmailRegistration = !!ddUserInfo.org_email;

            let registrationSuccess = false;

            if (isEmailRegistration) {
              // 邮箱注册的判断条件
              registrationSuccess =
                res.success ||
                (res.code === 100100002 &&
                  res.msg === "EMAIL_ACCOUNT_ALREADY_EXIST");
              console.log("邮箱注册结果:", res);
            } else {
              // 手机号注册的判断条件
              registrationSuccess =
                res.success ||
                (res.code === 100100003 &&
                  res.msg === "PHONE_ACCOUNT_ALREADY_EXIST");
              console.log("手机号注册结果:", res);
            }

            if (registrationSuccess) {
              // 注册成功，调用登录接口
              console.log("注册成功，开始登录");
              onLogin(ruleFormRef.value);
            } else {
              const registrationType = isEmailRegistration ? "邮箱" : "手机号";
              message(`${registrationType}注册失败：` + JSON.stringify(res), {
                type: "error"
              });
            }
          }
        })
        .then(res => {
          if (res) {
            if (res.success) {
              localStorage.setItem("token", res.data);
              // 初始化用户配置
              updateUserInfo({
                userId: storageLocal()?.getItem("dataSource")?.id,
                fullName: storageLocal()?.getItem("ddUserInfo")?.name,
                email: storageLocal()?.getItem("ddUserInfo")?.org_email,
                hireDateStr: storageLocal()?.getItem("ddUserInfo")?.hired_date,
                avatarUrl: storageLocal()?.getItem("ddUserInfo")?.avatar
              }).then(res => {
                if (res?.success) {
                  localStorage.setItem(
                    "userInfo",
                    JSON.stringify({
                      ...res?.data
                    })
                  );
                }
              });
              // 登录成功，跳转到指定页面
              const urlParams = new URL(window.location.href).searchParams;
              window.location.href = urlParams.get("redirect") || "/";
            } else {
              setErrMsg("用户登录失败：" + JSON.stringify(res));
            }
          }
        });
    },
    onFail: function (err) {
      // setErrMsg('获取钉钉免登授权码失败：' + JSON.stringify(err))
      message(JSON.stringify(err), { type: "error" });
    }
  });
};

ddLogin();

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <!-- <avatar class="avatar" /> -->
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
