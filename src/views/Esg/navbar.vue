<script setup lang="ts">
import { storageLocal } from "@pureadmin/utils";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { updateUserPassword } from "../../api/user";
import { useNav } from "@/layout/hooks/useNav";

const { getLogo } = useNav();

const username = ref("");

const handleExit = () => {
  // 暴力退出 清空cookie
  localStorage.setItem("pridi-unLoginUrl", "/pdesg");
  document.cookie.split(";").forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  window.location.href = window.location.origin + "/#/pdesg";
};

onMounted(() => {
  // 从localStorage中获取用户名 dataSource对象里的username
  const dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");
  if (dataSource.username) {
    username.value = dataSource.username;
  }
});

const showPasswordDialog = ref(false);
const changePassword = () => {
  showPasswordDialog.value = true;
};
const passwordFormRef = ref<any>(null);
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};
const passwordRules = reactive({
  oldPassword: [
    {
      required: true,
      message: "请输入旧密码",
      trigger: "blur"
    }
  ],
  // 新密码还需要和确认密码一致
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur"
    }
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    { required: true, validator: validateConfirmPassword, trigger: "blur" }
  ]
});
const handlePasswordUpdate = () => {
  passwordFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log("passwordForm表单数据==", passwordForm);
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        ElMessage.error("两次输入密码不一致");
        return;
      }
      updateUserPassword({
        identifier: (storageLocal().getItem("dataSource") as any)?.id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }).then((res: any) => {
        if (res?.code === 200) {
          ElMessage.success("修改密码成功");
          passwordFormRef.value.resetFields();
          showPasswordDialog.value = false;
        } else {
          ElMessage.error("修改密码失败" + res?.msg);
        }
      });
    }
  });
};
</script>

<template>
  <div class="peidi-esg-navbar">
    <div>
      <img class="h-[32px] ml-[20px]" :src="getLogo()" alt="logo" />
    </div>

    <div class="mr-[20px]">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <div
            class="peidi-esg-navbar-user text-[16px] h-[50px] flex items-center justify-center px-[20px]"
          >
            {{ username }}
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changePassword">
              <span class="text-[14px] py-[5px]">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item @click="handleExit">
              <span class="text-[14px] py-[5px]">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <el-dialog
    v-model="showPasswordDialog"
    title="修改密码"
    width="500"
    @closed="passwordFormRef?.resetFields()"
    :close-on-click-modal="false"
  >
    <el-form
      :model="passwordForm"
      :rules="passwordRules"
      ref="passwordFormRef"
      :label-width="'100px'"
      :label-position="'left'"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
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
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.peidi-esg-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  // 底部阴影
  box-shadow: 0 -2px 4px rgb(0 0 0 / 50%);

  .peidi-esg-navbar-user {
    &:hover {
      background-color: #f5f7fa;
    }
  }
}

.el-tooltip__trigger:focus-visible {
  outline: unset;
}
</style>
