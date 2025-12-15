<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import CardList from "./components/cardList/index.vue";
import { redeemItems } from "./data/redeemItems.js";
import {
  getExchangeList,
  type getExchangeListItem,
  getUserInfoData,
  updateUseScore
} from "@/api/pmApi.js";
import { message } from "@/utils/message";
import { storageLocal } from "@pureadmin/utils";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const points = ref([0, 0]);

const sourceData = ref<Record<string, getExchangeListItem[]>>({});
const activeName = ref("");
const sourceTabs = ref<any>([]);

// 计算属性 -根据activeName获取对应的source
const source = computed(() => {
  // 筛选出category等于activeName的项
  return sourceData.value[activeName.value] || [];
});

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event, tab.props.name);
};

//#region 请求逻辑
// 获取兑换列表
const fetchExchangeList = () => {
  getExchangeList()
    .then((res: any) => {
      if (res.code === 200) {
        // console.log("兑换列表", res.data);
        // sourceList.value = res.data;

        // 遍历数据，根据category分类
        const temp: Record<string, getExchangeListItem[]> = {};
        // 往最前面添加一个所有分类
        temp["所有"] = res.data;
        res.data.forEach((item: getExchangeListItem) => {
          if (!temp[item.category]) {
            temp[item.category] = [];
          }
          temp[item.category].push(item);
        });
        sourceData.value = temp;

        // 设置默认激活的标签页为第一个分类
        const categories = Object.keys(temp);
        if (categories.length > 0) {
          activeName.value = categories[0];
          sourceTabs.value = categories;
        }

        // console.log("分类后的兑换列表", sourceData);
      } else {
        message(res.msg || t("redeem.redeemListFailed"), { type: "error" });
      }
    })
    .catch((err: any) => {
      message(err.message || t("redeem.redeemListFailed"), { type: "error" });
    });
};
// 获取用户信息
const fetchUserInfo = () => {
  getUserInfoData({
    userId: storageLocal().getItem("dataSource")?.id || ""
  })
    .then((res: any) => {
      if (res.code === 200) {
        // console.log("用户信息", res.data);
        points.value = [res.data.lifeTimePoints, res.data.redeemablePoints];
      } else {
        message(res.msg || t("redeem.getUserInfoFailed"), { type: "error" });
      }
    })
    .catch((err: any) => {
      message(err.message || t("redeem.getUserInfoFailed"), { type: "error" });
    });
};
// 调整用户积分
const updateUserPoints = (ruleId: number | string) => {
  const id_temp = storageLocal().getItem("dataSource")?.id;
  if (!id_temp) {
    message(t("redeem.userNotFound"), { type: "error" });
    return;
  }
  updateUseScore({
    userIds: [id_temp],
    updateUserId: id_temp,
    ruleId
  })
    .then((res: any) => {
      if (res.code === 200) {
        message(t("redeem.redeemSuccess"), { type: "success" });
        fetchUserInfo();
        fetchExchangeList();
      } else {
        message(res.msg || t("redeem.redeemFailed"), { type: "error" });
      }
    })
    .catch((err: any) => {
      message(err.message || t("redeem.redeemFailed"), { type: "error" });
    });
};
//#endregion

// 兑换商品
const handleRedeem = (item: getExchangeListItem) => {
  // 检查用户积分是否足够
  if (points.value[1] < -item.pointsChange) {
    message(t("redeem.pointsNotEnough"), { type: "error" });
    return;
  }

  // console.log("兑换商品", item);
  ElMessageBox.confirm(
    `【${item.title} - ${-item.pointsChange} ${t("redeem.points")}】${t("redeem.confirmRedeemTip")}`,
    t("redeem.confirmRedeem"),
    {
      confirmButtonText: t("redeem.confirmRedeem"),
      cancelButtonText: t("redeem.cancel"),
      type: "warning"
    }
  )
    .then(() => {
      // ElMessage({
      //   type: "success",
      //   message: "Delete completed"
      // });
      updateUserPoints(item.ruleId);
    })
    .catch(() => {
      // ElMessage({
      //   type: "info",
      //   message: "Delete canceled"
      // });
    });
};

onMounted(() => {
  fetchUserInfo();
  fetchExchangeList();
});
</script>

<template>
  <div>
    <div class="mb-[24px] flex justify-start items-end">
      <h2 class="text-2xl font-bold mr-[24px]">
        {{ t("redeem.redeemTitle") }}
      </h2>
      <span class="w-[480px]">
        <span class="peidi-redeem-title">{{ t("redeem.longTermPoints") }}</span>
        <span class="peidi-redeem-points mr-[16px]">{{ points[0] }}</span>
        <span class="peidi-redeem-title">{{
          t("redeem.exchangeablePoints")
        }}</span>
        <span class="peidi-redeem-points">{{ points[1] }}</span>
      </span>
    </div>
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      class="peidi-el-tabs-modern-tabs"
    >
      <el-tab-pane
        v-if="sourceTabs.length > 0"
        v-for="category in sourceTabs"
        :label="category"
        :name="category"
      >
        <CardList
          :source="source"
          :redeemablePoints="points[1]"
          :handleRedeem="handleRedeem"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.peidi-redeem-title {
  font-size: 14px;
  font-weight: 500;
  color: #0a0a0a;
}

.peidi-redeem-points {
  margin-left: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0a0a0a;
}
</style>
