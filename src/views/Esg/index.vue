<template>
  <div class="w-[100%] h-[100%] px-[20px] py-[20px]">
    <YearCard
      :yearOptions="yearOptions"
      :submit="handleYearSubmit"
      v-show="showYearCard"
    />
    <div class="esg-management" v-show="!showYearCard">
      <!-- 顶部导航标签 -->
      <div class="flex items-center justify-between">
        <div class="mr-[10px]">
          <el-select
            v-model="yearValue"
            placeholder="请选择年度"
            style="width: 200px"
            size="large"
          >
            <template #label="{ label, value }">
              <span class="text-[14px]">年度: </span>
              <span class="text-[16px] font-bold">{{ value }}</span>
            </template>
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex-1">
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
      <!-- :isEdit="hasEditPermission(activeTab)" -->
      <component
        :is="currentComponent"
        :active-tab="activeTab"
        :isEdit="hasEditPermission(activeTab)"
        :year="yearValue"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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

const { t } = useI18n();

// 活动标签页
const activeTab = ref("company-overview");

// 组件映射
const componentMap = {
  "company-overview": CompanyOverview,
  "esg-management": EsgManagement,
  "corporate-governance": CorporateGovernance,
  "business-operations": BusinessOperations,
  "quality-food-safety": ProductsServices,
  "supplier-management": SupplierManagement,
  "information-security-privacy": OccupationalHealth,
  employees: Employees,
  "environmental-impact": EnvironmentalImpact,
  "community-welfare": CommunityWelfare
};

// 当前组件
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || CompanyOverview;
});

//#region 年份选择
// 默认为今年
const yearValue = ref(new Date().getFullYear().toString());
// const yearOptions = [
//   {
//     value: "2026",
//     label: "2026"
//   },
//   {
//     value: "2025",
//     label: "2025"
//   },
//   {
//     value: "2024",
//     label: "2024"
//   },
//   {
//     value: "2023",
//     label: "2023"
//   }
// ];
// 2025年之后10年 2025是写死的
const yearOptions = [];
for (let i = 0; i < 10; i++) {
  yearOptions.push({
    value: (2025 + i).toString(),
    label: (2025 + i).toString()
  });
}
//#endregion

//#region 首次选择年份
// 首次遮罩层
const showYearCard = ref(true);
const handleYearSubmit = year => {
  yearValue.value = year;
  // 隐藏遮罩层
  showYearCard.value = false;
};
//#endregion
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
  padding: 0;
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
</style>
