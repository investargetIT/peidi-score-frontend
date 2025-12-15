<script setup lang="ts">
import { type getExchangeListItem } from "@/api/pmApi";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const IMAGE_BASE_URL =
  "https://api.peidigroup.cn/ui/common/download?objectName=";

const props = defineProps({
  source: {
    type: Array<getExchangeListItem>,
    required: true
  },
  redeemablePoints: {
    type: Number,
    required: true
  },
  handleRedeem: {
    type: Function,
    required: true
  }
});

// 构建图片 URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  // 对路径进行 URL 编码
  const encodedPath = encodeURIComponent(imagePath);
  return `${IMAGE_BASE_URL}${encodedPath}`;
};
</script>

<template>
  <div>
    <el-space size="large" wrap>
      <el-card
        style="max-width: 360px"
        v-for="item in props.source"
        :key="item.id"
        shadow="hover"
      >
        <el-image
          style="width: 320px; height: 320px"
          :src="getImageUrl(item.imageUrl)"
          :fit="'cover'"
        />
        <div class="text-[14px] font-[500] text-[#0a0a0a] mb-[8px]">
          {{ item.title }}
        </div>
        <div class="mb-[16px]">
          <el-tag effect="plain" round>{{ item.category }}</el-tag>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-[14px] font-[500] text-[#0a0a0a]">
            {{ -item.pointsChange }} {{ t("redeem.points") }}
          </div>
          <el-button
            type="primary"
            color="#000"
            @click="handleRedeem(item)"
            :disabled="props.redeemablePoints < -item.pointsChange"
          >
            <span class="font-[700]">{{ t("redeem.redeem") }}</span>
          </el-button>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  font-size: 12px;
  font-weight: 600;
  color: #0a0a0a;
  border-color: #0a0a0a20;
}
</style>
