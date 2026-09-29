<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import LaySearch from "../lay-search/index.vue";
import LayNotice from "../lay-notice/index.vue";
import LayNavMix from "../lay-sidebar/NavMix.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";
import LaySidebarBreadCrumb from "../lay-sidebar/components/SidebarBreadCrumb.vue";
import LaySidebarTopCollapse from "../lay-sidebar/components/SidebarTopCollapse.vue";

import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import RiEditBoxLine from "@iconify-icons/ri/edit-box-line";
import TranslateIcon from "@iconify-icons/ri/translate";
import { emitter } from "@/utils/mitt.ts";
import { storageLocal } from "@pureadmin/utils";
import { ref, reactive, watch, computed } from "vue";
import { getToken, formatToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import {
  newMiddleCheck,
  updateMiddleCheck,
  getFileDownLoadPath
} from "@/api/pmApi.ts";
import { getUserInfoData, updateUserInfo } from "@/api/pmApi";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { updateUserPassword } from "../../../api/user";

const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  userAvatar,
  avatarsStyle,
  toggleSideBar
} = useNav();

const {
  id,
  username: nameFromDataSource,
  userEmail: emailFromDataSource
} = storageLocal()?.getItem("dataSource") || {};

const { hired_date, name, email } = storageLocal()?.getItem("ddUserInfo") || {};

emitter.on("logout", () => {
  logout();
});
const showModifyDialog = ref(false); // 是否展示修改资料弹窗
const form = reactive({
  avatarUrlList: []
});
const formLabelWidth = "140px";
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const formRef = ref(null);
const curUserInfo = ref({});
const curUserAvatar = ref("");
const { t, locale } = useI18n();
const modify = () => {
  showModifyDialog.value = true;
  fetchCurUserInfo();
};
const handleExceed = () => {
  ElMessage.warning("超过文件数量限制");
};
const beforeUpload = file => {
  const isImage = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isImage) {
    ElMessage.error("上传图片支持jpg、png、jpeg、gif格式");
  }
  if (!isLt10M) {
    ElMessage.error("上传图片大小不超过10M");
  }
  return isImage && isLt10M;
};

const handlePreview = file => {
  getFileDownLoadPath({
    objectName: "ui/user/" + file.name
  })
    .then(res => {
      const { code, msg, data } = res;
      if (code === 200) {
        dialogImageUrl.value = res.data;
        dialogVisible.value = true;
      } else {
        message("图片预览失败--" + msg, { type: "error" });
      }
    })
    .catch(err => {
      message("图片预览失败", { type: "error" });
    });
};
const handleUpdate = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log("form表单数据==", form);
      updateUserInfo({
        userId: id,
        avatarUrl:
          JSON.stringify(form.avatarUrlList) === "[]"
            ? ""
            : JSON.stringify(form.avatarUrlList)
      }).then(res => {
        if (res?.code === 200) {
          showModifyDialog.value = false;
          ElMessage.success("修改成功");
          showModifyDialog.value = false;
          fetchCurUserInfo();
        }
      });
    }
  });
};

const initUserInfo = () => {
  const tempUserInfo = storageLocal()?.getItem("ddUserInfo") || {};
  updateUserInfo({
    // 传入的userid需要为user-check的id，不能是钉钉的
    userId: id,
    avatarUrl: tempUserInfo?.avatar,
    email: tempUserInfo?.email,
    fullName: tempUserInfo?.name,
    mobilePhone: tempUserInfo?.mobile,
    hireDateStr: tempUserInfo?.hired_date
  }).then(res => {
    if (res?.code === 200) {
      showModifyDialog.value = false;
      ElMessage.success("修改成功");
      showModifyDialog.value = false;
    }
  });
};

const fetchCurUserInfo = () => {
  getUserInfoData({
    userId: id
  }).then(res => {
    if (res?.code === 200) {
      // 初始化用户配置信息
      if (!res?.data) {
        initUserInfo();
        return;
      }
      curUserInfo.value = res.data;

      // 优化avatarUrl处理逻辑，支持两种格式
      let avatarList = [];
      if (res?.data?.avatarUrl) {
        try {
          // 尝试作为JSON字符串解析
          const parsed = JSON.parse(res.data.avatarUrl);
          // 确保解析后是数组格式
          if (Array.isArray(parsed)) {
            avatarList = parsed;
          } else {
            console.warn("avatarUrl解析后不是数组格式:", parsed);
          }
        } catch (error) {
          // 如果JSON.parse失败，说明是单纯的字符串
          // console.log("avatarUrl是单纯字符串，直接使用:", res.data.avatarUrl);
          // 直接使用字符串作为头像URL
          curUserAvatar.value = res.data.avatarUrl;
          storageLocal().setItem("curUserAvatar", res.data.avatarUrl);
          return; // 直接返回，不需要处理数组逻辑
        }
      }

      // 处理数组格式的avatarList
      if (avatarList.length > 0) {
        form.avatarUrlList = avatarList;
        getFileDownLoadPath({
          objectName: "ui/user/" + avatarList[0].name
        })
          .then(previewRes => {
            if (previewRes?.code === 200) {
              curUserAvatar.value = previewRes.data;
              storageLocal().setItem("curUserAvatar", curUserAvatar.value);
            }
          })
          .catch(err => {
            console.warn("获取头像预览地址失败:", err);
          });
      } else {
        // 如果数组为空，清空头像
        form.avatarUrlList = [];
      }
    }
  });
};

const currentLangLabel = computed(() =>
  locale.value === "en" ? "EN" : "中文"
);
function changeLang(lang: string) {
  locale.value = lang;
  localStorage.setItem("lang", lang);
  window.location.reload(); // 为了解决切换语言后，菜单标题没有更新的问题
}
fetchCurUserInfo();

const showPasswordDialog = ref(false);
const changePassword = () => {
  showPasswordDialog.value = true;
};
const passwordFormRef = ref(null);
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error(t("navbar.passwordNotMatch")));
  } else {
    callback();
  }
};
const passwordRules = reactive({
  oldPassword: [
    {
      required: true,
      message: t("navbar.pleaseEnterOldPassword"),
      trigger: "blur"
    }
  ],
  // 新密码还需要和确认密码一致
  newPassword: [
    {
      required: true,
      message: t("navbar.pleaseEnterNewPassword"),
      trigger: "blur"
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: t("navbar.confirmPasswordTip"),
      trigger: "blur"
    },
    { required: true, validator: validateConfirmPassword, trigger: "blur" }
  ]
});
const handlePasswordUpdate = () => {
  passwordFormRef.value.validate(valid => {
    if (valid) {
      console.log("passwordForm表单数据==", passwordForm);
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        ElMessage.error(t("navbar.passwordNotMatch"));
        return;
      }
      updateUserPassword({
        identifier: storageLocal().getItem("dataSource")?.id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }).then(res => {
        if (res?.code === 200) {
          ElMessage.success(t("navbar.updateSuccess"));
          passwordFormRef.value.resetFields();
          showPasswordDialog.value = false;
        } else {
          ElMessage.error(t("navbar.updateFailed") + res?.msg);
        }
      });
    }
  });
};

const isDingUser = computed(() => {
  if (navigator.userAgent.includes("DingTalk")) return true;
  const esgUserInfo = JSON.parse(localStorage.getItem("esgUserInfo"));
  if (!!esgUserInfo?.dingId) return true;
  return false;
});
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
    <LaySidebarTopCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <LaySidebarBreadCrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <LayNavMix v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 语言切换 -->
      <el-dropdown @command="changeLang" class="lang-switch">
        <span class="el-dropdown-link lang-link">
          <span class="lang-icon"
            ><IconifyIconOffline :icon="TranslateIcon"
          /></span>
          <span class="lang-text">{{ locale === "en" ? "EN" : "中文" }}</span>
          <span class="lang-caret"></span>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="lang-menu">
            <el-dropdown-item
              :command="'zh'"
              :disabled="locale === 'zh'"
              class="lang-item"
              >中文</el-dropdown-item
            >
            <el-dropdown-item
              :command="'en'"
              :disabled="locale === 'en'"
              class="lang-item"
              >EN</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 头像及用户信息 -->
      <el-dropdown trigger="click" class="user-dropdown">
        <span class="el-dropdown-link user-trigger navbar-bg-hover select-none">
          <span class="user-avatar-wrap">
            <img :src="curUserAvatar || userAvatar" :style="avatarsStyle" />
          </span>
          <div v-if="name || nameFromDataSource" class="userContainer">
            <p class="user-name dark:text-white">
              {{ name || nameFromDataSource }}
            </p>
            <p class="user-email dark:text-white">
              {{ email || emailFromDataSource }}
            </p>
          </div>
          <span class="user-caret"></span>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item
              @click="changePassword"
              class="menu-item menu-password"
            >
              <span class="menu-icon"
                ><IconifyIconOffline :icon="RiEditBoxLine"
              /></span>
              <span class="menu-text">{{ t("navbar.updatePassword") }}</span>
            </el-dropdown-item>
            <el-dropdown-item @click="modify" class="menu-item menu-profile">
              <span class="menu-icon"
                ><IconifyIconOffline :icon="Setting"
              /></span>
              <span class="menu-text">{{ t("navbar.updateProfile") }}</span>
            </el-dropdown-item>
            <el-dropdown-item @click="logout" class="menu-item menu-logout">
              <span class="menu-icon"
                ><IconifyIconOffline :icon="LogoutCircleRLine"
              /></span>
              <span class="menu-text">{{ t("navbar.logout") }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog
        v-model="showModifyDialog"
        :title="t('navbar.userProfile')"
        width="min(560px, 92vw)"
        class="profile-dialog"
        :close-on-click-modal="false"
      >
        <el-form
          :model="form"
          ref="formRef"
          :label-width="locale === 'en' ? '140px' : '80px'"
          :label-position="'left'"
        >
          <el-form-item :label="t('navbar.avatar')">
            <el-upload
              v-model:file-list="form.avatarUrlList"
              :headers="{
                Authorization: formatToken(getToken().accessToken)
              }"
              action="https://api.peidigroup.cn/ui/user/upload"
              :limit="1"
              list-type="text"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-preview="handlePreview"
            >
              <el-button size="small" type="primary">{{
                t("navbar.upload")
              }}</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  {{ t("navbar.uploadTip") }}
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item :label="t('navbar.name')">
            <span>{{ name || nameFromDataSource }}</span>
          </el-form-item>
          <el-form-item :label="t('navbar.email')">
            <span>{{ email }}</span>
          </el-form-item>
          <el-form-item :label="t('navbar.hiredDate')">
            <span>{{
              hired_date ? dayjs(Number(hired_date)).format("YYYY-MM-DD") : "-"
            }}</span>
          </el-form-item>
          <el-form-item :label="t('navbar.longTermPoints')">
            <span>{{ curUserInfo?.lifeTimePoints ?? "" }}</span>
          </el-form-item>
          <el-form-item :label="t('navbar.redeemablePoints')">
            <span>{{ curUserInfo?.redeemablePoints ?? "" }}</span>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleUpdate">
              {{ t("navbar.updateProfile") }}
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>

      <el-dialog
        v-model="showPasswordDialog"
        :title="t('navbar.updatePassword')"
        width="min(560px, 92vw)"
        class="password-dialog"
        @closed="passwordFormRef?.resetFields()"
        :close-on-click-modal="false"
      >
        <el-form
          :model="passwordForm"
          :rules="passwordRules"
          ref="passwordFormRef"
          :label-width="locale === 'en' ? '130px' : '80px'"
          :label-position="'left'"
        >
          <el-form-item :label="t('navbar.oldPassword')" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item :label="t('navbar.newPassword')" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item
            :label="t('navbar.confirmPassword')"
            prop="confirmPassword"
          >
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handlePasswordUpdate">
              {{ t("navbar.confirm") }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>


/* 移动端：隐藏邮箱副标题，压缩尺寸保证不溢出 */
@media screen and (width <= 768px) {
  .user-email {
    display: none;
  }

  .user-trigger {
    padding: 0 6px;
  }
}

.navbar {
  width: 100%;
  height: 50px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }

  .userContainer {
    margin-left: 10px;

    p {
      margin-bottom: 2px;
      font-size: 14px;

      &:last-child {
        color: #909399;
      }
    }
  }
}

/* —— 语言切换：胶囊 ——
   注意：el-dropdown 的 class 会经 OnlyChild 合并到触发按钮本身，
   .lang-switch 与 .el-dropdown-link / .lang-link 是同一个元素，
   必须用「相邻类选择器 .lang-switch.lang-link」，后代写法（.lang-switch .lang-link）不生效 */
.lang-switch {
  &.el-dropdown-link,
  &.el-dropdown-link:focus,
  &.el-dropdown-link:active {
    outline: none !important;
    box-shadow: none !important;
  }

  &.lang-link {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    height: 26px;
    padding: 0 12px;
    margin: 7px 14px 7px 0;
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    transition: all 0.2s ease;

    &:hover {
      color: #2563eb;
      background: #eff6ff;
      border-color: #93c5fd;

      .lang-caret {
        border-top-color: #2563eb;
      }
    }
  }

  .lang-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #3b82f6;

    .iconify {
      width: 16px;
      height: 16px;
    }
  }

  .lang-caret {
    width: 0;
    height: 0;
    border-top: 4px solid #94a3b8;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    transition: border-top-color 0.2s ease;
  }
}

/* —— 下拉菜单内容美化（外框圆角/边框保持默认，只美化内部条目） —— */

/* 中英文下拉 */
.lang-menu {
  /* 上下留白，抵消全局 padding:0!important */
  padding: 8px 0 !important;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 108px;
    height: 32px;
    padding: 0 14px;
    margin: 0 6px;
    font-size: 13px;
    font-weight: 500;
    line-height: 32px;
    color: #4b5563;
    border-radius: 6px;
    transition:
      color 0.2s,
      background-color 0.2s;

    /* 当前语言高亮 */
    &.is-disabled {
      font-weight: 600;
      color: #2563eb;
      cursor: default;
      background: #eff6ff;
    }

    &:hover {
      color: #2563eb;
      background: #eff6ff;
    }
  }
}

/* 用户菜单 */
.logout {
  width: 200px;

  /* 抵消全局 padding:0!important */
  padding: 6px !important;

  ::v-deep(.el-dropdown-menu__item) {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 40px;
    padding: 0 8px;
    margin-bottom: 2px;
    border-radius: 8px;
    transition:
      color 0.2s,
      background-color 0.2s;

    &:hover {
      color: #2563eb;
      background: #eff6ff;
    }
  }
}

/* —— 用户触发器：头像 + 姓名 + 邮箱 —— */
.user-trigger {
  gap: 10px;
  height: 48px;
  padding: 0 10px;
  border-radius: 12px;
  transition: background 0.2s ease;

  &:hover {
    background: #f1f5f9;
  }
}

.user-avatar-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  overflow: hidden;
  background: #fff;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow:
    0 0 0 2px #dbeafe,
    0 4px 10px rgb(59 130 246 / 25%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.user-email {
  max-width: 180px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.2;
  color: #909399;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-caret {
  width: 0;
  height: 0;
  margin-left: 2px;
  border-top: 5px solid #9ca3af;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  transition: border-top-color 0.2s ease;
}

.user-trigger:hover .user-caret {
  border-top-color: #3b82f6;
}

.menu-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;

  .iconify {
    width: 14px;
    height: 14px;
  }
}

.menu-password .menu-icon {
  color: #8b5cf6;
  background: #ede9fe;
}

.menu-profile .menu-icon {
  color: #0ea5e9;
  background: #e0f2fe;
}

.menu-logout {
  color: #ef4444 !important;

  .menu-icon {
    color: #ef4444;
    background: #fee2e2;
  }

  &:hover {
    color: #dc2626 !important;
    background: #fef2f2 !important;
  }
}

/* —— 资料/密码弹窗 —— */

/* 注意：@vue/compiler-sfc 的 scoped 转换会丢弃「:global(.a) .b」里的 .b，必须整段选择器放进一个 :global() */
:global(.profile-dialog.el-dialog),
:global(.password-dialog.el-dialog) {
  overflow: hidden;
  border-radius: 16px !important;
  box-shadow: 0 20px 50px rgb(0 0 0 / 18%);
}

:global(.profile-dialog .el-dialog__header),
:global(.password-dialog .el-dialog__header) {
  padding: 18px 24px 14px;
  margin-right: 0;
  background: linear-gradient(135deg, #eff6ff, #f5f3ff);
  border-bottom: 1px solid #eef0f3;
}

:global(.profile-dialog .el-dialog__title),
:global(.password-dialog .el-dialog__title) {
  font-weight: 700;
  color: #1f2937;
}

:global(.profile-dialog .el-dialog__body),
:global(.password-dialog .el-dialog__body) {
  padding: 22px 24px;
}

:global(.profile-dialog .el-dialog__footer),
:global(.password-dialog .el-dialog__footer) {
  padding: 14px 24px 20px;
  border-top: 1px solid #f0f1f3;
}

:global(.profile-dialog .el-form-item__label),
:global(.password-dialog .el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

:global(.profile-dialog .el-input__wrapper),
:global(.profile-dialog .el-textarea__inner),
:global(.password-dialog .el-input__wrapper),
:global(.password-dialog .el-textarea__inner) {
  border-radius: 10px;
  transition: all 0.2s ease;
}

:global(.profile-dialog .el-input__wrapper.is-focus),
:global(.password-dialog .el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 1px #4facfe inset,
    0 0 0 3px rgb(79 172 254 / 15%);
}

:global(.profile-dialog .dialog-footer),
:global(.password-dialog .dialog-footer) {
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

:global(.profile-dialog .dialog-footer .el-button--primary),
:global(.password-dialog .dialog-footer .el-button--primary) {
  min-width: 110px;
  height: 38px;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe, #00c6fb);
  border: 0;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgb(79 172 254 / 32%);
}

:global(.profile-dialog .dialog-footer .el-button--primary:hover),
:global(.password-dialog .dialog-footer .el-button--primary:hover) {
  box-shadow: 0 8px 20px rgb(79 172 254 / 40%);
  transform: translateY(-1px);
}

/* —— 弹窗关闭按钮：圆形、柔和、悬停旋转 —— */
:global(.profile-dialog .el-dialog__headerbtn),
:global(.password-dialog .el-dialog__headerbtn) {
  top: 18px;
  right: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgb(255 255 255 / 75%);
  border: 1px solid rgb(148 163 184 / 25%);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgb(15 23 42 / 6%);
  transition:
    background-color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.25s ease;
}

:global(.profile-dialog .el-dialog__headerbtn .el-icon.el-dialog__close),
:global(.password-dialog .el-dialog__headerbtn .el-icon.el-dialog__close) {
  width: 14px;
  height: 14px;
  font-size: 14px;
  color: #64748b;
  transition: color 0.2s;
}

:global(.profile-dialog .el-dialog__headerbtn:hover),
:global(.password-dialog .el-dialog__headerbtn:hover) {
  background: #eef2ff;
  border-color: #c7d2fe;
  box-shadow: 0 3px 10px rgb(79 70 229 / 28%);
  transform: rotate(90deg);
}

:global(.profile-dialog .el-dialog__headerbtn:hover .el-icon.el-dialog__close),
:global(
    .password-dialog .el-dialog__headerbtn:hover .el-icon.el-dialog__close
  ) {
  color: #4f46e5;
}
</style>
