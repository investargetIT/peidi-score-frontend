<template>
  <div class="w-[100%] h-[100%] relative">
    <Navbar />
    <YearCard
      :yearOptions="yearOptions"
      :submit="handleYearSubmit"
      v-show="showYearCard"
    />
    <div
      class="esg-management px-[20px] py-[20px] pt-[60px]"
      v-show="!showYearCard"
    >
      <!-- 顶部导航标签 -->
      <div class="flex items-center justify-between">
        <div class="mr-[10px] flex-shrink-0">
          <el-select
            v-model="yearValue"
            placeholder="请选择年份"
            style="width: 200px"
            size="large"
          >
            <template #label="{ label, value }">
              <span class="text-[14px] text-[#0a0a0a] font-bold"
                >报告年份:
              </span>
              <span class="text-[16px] text-[#0a0a0a]">{{ value }}</span>
            </template>
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex-1 min-w-0">
          <el-tabs v-model="activeTab" class="esg-tabs">
            <el-tab-pane name="company-overview">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>公司概况</span>
                  <el-icon v-if="hasEditPermission('company-overview')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="corporate-governance">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>公司治理</span>
                  <el-icon v-if="hasEditPermission('corporate-governance')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="esg-management">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>ESG管理</span>
                  <el-icon v-if="hasEditPermission('esg-management')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="business-operations">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>产业发展与运营</span>
                  <el-icon v-if="hasEditPermission('business-operations')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="quality-food-safety">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>质量与食品安全管理</span>
                  <el-icon v-if="hasEditPermission('quality-food-safety')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="supplier-management">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>供应链管理</span>
                  <el-icon v-if="hasEditPermission('supplier-management')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="information-security-privacy">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>信息安全与隐私保护</span>
                  <el-icon
                    v-if="hasEditPermission('information-security-privacy')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="employees">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>员工</span>
                  <el-icon v-if="hasEditPermission('employees')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="environmental-impact">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>环境影响</span>
                  <el-icon v-if="hasEditPermission('environmental-impact')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="community-welfare">
              <template #label>
                <span
                  class="custom-tabs-label flex justify-center items-center"
                >
                  <span>回馈社会</span>
                  <el-icon v-if="hasEditPermission('community-welfare')"
                    ><Edit />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 动态组件内容区域 -->
      <component
        ref="currentComponentRef"
        :is="currentComponent"
        :active-tab="activeTab"
        :isEdit="hasEditPermission(activeTab)"
        :year="yearValue"
        :curDDUserInfo="curDDUserInfo"
        @show-image-preview="handleShowImagePreview"
      />
    </div>

    <!-- 图片预览对话框 - 抽离到父组件 -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>

    <!-- 操作按钮 - 统一在父组件中管理 -->
    <EsgActionButtons
      :show-submit="false"
      @cancel="handleCancel"
      @save="handleSave"
      :isEdit="hasEditPermission(activeTab)"
    />
  </div>
</template>

<script setup>
import { ref, computed, provide } from "vue";
import { useI18n } from "vue-i18n";
import CompanyOverview from "./components/CompanyOverview.vue";
import CorporateGovernance from "./components/CorporateGovernance.vue";
import EsgManagement from "./components/EsgManagement.vue";
import BusinessOperations from "./components/BusinessOperations.vue";
import Employees from "./components/Employees.vue";
import EnvironmentalImpact from "./components/EnvironmentalImpact.vue";
import OccupationalHealth from "./components/OccupationalHealth.vue";
import SupplierManagement from "./components/SupplierManagement.vue";
import CommunityWelfare from "./components/CommunityWelfare.vue";
import ProductsServices from "./components/ProductsServices.vue";
import { hasEditPermission } from "./utils";
import YearCard from "./yearCard.vue";
import Navbar from "./navbar.vue";
import { storageLocal } from "@pureadmin/utils";
import EsgActionButtons from "./components/EsgActionButtons.vue";

const { t } = useI18n();

// 图片预览相关状态
const dialogVisible = ref(false);
const dialogImageUrl = ref("");

// 依赖注入 - 提供图片预览相关参数
provide("dialogVisible", dialogVisible);
provide("dialogImageUrl", dialogImageUrl);

// 活动标签页
const activeTab = ref("company-overview");

// 组件映射
// 将标签页名称映射到对应的Vue组件
// 用于动态加载不同ESG模块的组件
const componentMap = {
  "company-overview": CompanyOverview, // 公司概览组件
  "corporate-governance": CorporateGovernance, // 公司治理组件
  "esg-management": EsgManagement, // ESG管理组件
  "business-operations": BusinessOperations, // 产业发展与运营组件
  "quality-food-safety": ProductsServices, // 质量与食品安全组件（使用产品服务组件）
  "supplier-management": SupplierManagement, // 供应链管理组件
  "information-security-privacy": OccupationalHealth, // 信息安全与隐私保护组件（使用职业健康组件）
  employees: Employees, // 员工组件
  "environmental-impact": EnvironmentalImpact, // 环境影响组件
  "community-welfare": CommunityWelfare // 回馈社会组件
};

// 当前组件
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || CompanyOverview;
});

//#region 保存按钮逻辑
// 当前激活组件的引用
const currentComponentRef = ref(null);

// 处理保存按钮点击
const handleSave = () => {
  if (currentComponentRef.value && currentComponentRef.value.handleSave) {
    // 调用当前激活组件的保存方法
    currentComponentRef.value.handleSave();
  } else {
    console.warn(`当前激活的组件 ${activeTab.value} 没有 handleSave 方法`);
  }
};

// 处理取消按钮点击
const handleCancel = () => {
  if (currentComponentRef.value && currentComponentRef.value.handleCancel) {
    // 调用当前激活组件的取消方法
    currentComponentRef.value.handleCancel();
  } else {
    // 如果没有取消方法，使用默认的取消逻辑
    window.location.reload();
  }
};
//#endregion

//#region 年份相关逻辑
// 默认为今年
const yearValue = ref(new Date().getFullYear().toString());
// const yearOptions = [
//   {
//     value: "2026",
//     label: "2026"
//   },
// ];
// 2025年之后10年 2025是写死的
const yearOptions = [];
for (let i = 0; i < 10; i++) {
  yearOptions.push({
    value: (2025 + i).toString(),
    label: (2025 + i).toString()
  });
}

// 遮罩层显示控制
const showYearCard = ref(true);
const handleYearSubmit = year => {
  yearValue.value = year;
  showYearCard.value = false;
};
//#endregion

// 获取用户信息
const curDDUserInfo = storageLocal().getItem("dataSource");
</script>

<style scoped>
/* 响应式设计 */
@media (width <= 768px) {
  .esg-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 13px;
  }
}

.esg-management {
  min-height: 100vh;

  /* padding: 0; */
  background: #f5f7fa;
}

.esg-tabs {
  padding: 0 20px;
  margin-bottom: 0;
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.esg-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.esg-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.esg-tabs :deep(.el-tabs__item) {
  height: 50px;
  padding: 0 20px;
  font-size: 14px;
  line-height: 50px;
  color: #606266;
}

.esg-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 600;
  color: #409eff;
}

:deep(.el-select__wrapper) {
  height: 50px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
</style>
