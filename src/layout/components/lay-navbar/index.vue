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
        <span class="el-dropdown-link">
          <el-icon style="margin-right: 4px; vertical-align: middle">
            <i class="el-icon-translate"></i>
          </el-icon>
          {{ locale === "en" ? "EN" : "中文" }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="'zh'" :disabled="locale === 'zh'"
              >中文</el-dropdown-item
            >
            <el-dropdown-item :command="'en'" :disabled="locale === 'en'"
              >EN</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 头像及用户信息 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="curUserAvatar || userAvatar" :style="avatarsStyle" />
          <div v-if="name || nameFromDataSource" class="userContainer">
            <p class="dark:text-white">{{ name || nameFromDataSource }}</p>
            <p class="dark:text-white">{{ email || emailFromDataSource }}</p>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu
            class="logout"
            :style="{ width: locale === 'en' ? '150px' : '' }"
          >
            <el-dropdown-item @click="changePassword">
              <IconifyIconOffline :icon="RiEditBoxLine" style="margin: 5px" />
              {{ t("navbar.updatePassword") }}
            </el-dropdown-item>
            <el-dropdown-item @click="modify">
              <IconifyIconOffline :icon="Setting" style="margin: 5px" />
              {{ t("navbar.updateProfile") }}
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              {{ t("navbar.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog
        v-model="showModifyDialog"
        :title="t('navbar.userProfile')"
        width="500"
      >
        <el-form :model="form" ref="formRef">
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
        width="500"
      >
        <el-form
          :model="passwordForm"
          ref="passwordFormRef"
          :label-width="locale === 'en' ? '150px' : '100px'"
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

.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}

.lang-switch {
  margin-right: 16px;
}

.lang-switch .el-dropdown-link {
  outline: none !important;
  box-shadow: none !important;
}

.lang-switch .el-dropdown-link:focus {
  outline: none !important;
  box-shadow: none !important;
}

.lang-switch .el-dropdown-link:active {
  outline: none !important;
  box-shadow: none !important;
}
</style>
