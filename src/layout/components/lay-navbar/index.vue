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
import { emitter } from "@/utils/mitt.ts";
import { storageLocal } from "@pureadmin/utils";
import { ref, reactive, watch } from "vue";
import { getToken, formatToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import {
  newMiddleCheck,
  updateMiddleCheck,
  getFileDownLoadPath
} from "@/api/pmApi.ts";
import { getUserInfoData, updateUserInfo } from "@/api/pmApi";
import dayjs from "dayjs";

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

console.log("====用户信息获取==");
const { id } = storageLocal()?.getItem("dataSource") || {};

const { hired_date, name, email } = storageLocal()?.getItem("ddUserInfo") || {};

console.log("====用户信息获取==", storageLocal()?.getItem("ddUserInfo"));

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
        avatarUrl: JSON.stringify(form.avatarUrlList)
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

const fetchCurUserInfo = () => {
  getUserInfoData({
    userId: id
  }).then(res => {
    if (res?.code === 200) {
      curUserInfo.value = res.data;
      const avatarList = res?.data?.avatarUrl
        ? JSON.parse(curUserInfo.value.avatarUrl)
        : [];
      form.avatarUrlList = avatarList;

      // 获取头像预览地址
      if (avatarList.length > 0) {
        getFileDownLoadPath({
          objectName: "ui/user/" + avatarList[0].name
        }).then(previewRes => {
          if (previewRes?.code === 200) {
            curUserAvatar.value = previewRes.data;
          }
        });
      }
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
      <!-- 菜单搜索 -->
      <!-- <LaySearch id="header-search" /> -->
      <!-- 全屏 -->
      <!-- <LaySidebarFullScreen id="full-screen" /> -->
      <!-- 消息通知 -->
      <!-- <LayNotice id="header-notice" /> -->
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="curUserAvatar || userAvatar" :style="avatarsStyle" />
          <div v-if="name" class="userContainer">
            <p class="dark:text-white">{{ name }}</p>
            <p class="dark:text-white">{{ email }}</p>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="modify">
              <IconifyIconOffline :icon="Setting" style="margin: 5px" />
              修改资料
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="showModifyDialog" title="用户资料" width="500">
        <el-form :model="form" ref="formRef">
          <el-form-item label="头像">
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
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  上传图片支持jpg、png、jpeg、gif格式,大小不超过10M，且最多上传1张。
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="姓名">
            <span>{{ name }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ email }}</span>
          </el-form-item>
          <el-form-item label="入职时间">
            <span>{{
              hired_date ? dayjs(hired_date).format("YYYY-MM-DD") : "-"
            }}</span>
          </el-form-item>
          <el-form-item label="长期积分">
            <span>{{ curUserInfo?.lifeTimePoints ?? "" }}</span>
          </el-form-item>
          <el-form-item label="可兑换积分">
            <span>{{ curUserInfo?.redeemablePoints ?? "" }}</span>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleUpdate">
              更新资料
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
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
</style>
