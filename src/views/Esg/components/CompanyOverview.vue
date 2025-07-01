<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="公司名称与组织架构" name="company-structure">
        <template #title>
          <div class="collapse-title">
            <span
              >公司名称与组织架构
              <EsgTooltip content="对应GRI标准: 102-1" />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司全称与简称、公司组织架构图。</span>
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item label="公司全称">
              <el-input
                v-model="formData.companyName"
                type="textarea"
                :rows="6"
                placeholder="请输入文档描述"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="总部所在地">
              <el-input
                v-model="formData.headquartersLocation"
                type="textarea"
                :rows="6"
                placeholder="请输入文档描述"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="纳入组织可持续发展报告的实体"
        name="company-structure"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >纳入组织可持续发展报告的实体
              <EsgTooltip content="对应GRI标准: 102-2" />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>

        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司全称与简称、公司组织架构图。</span>
          </div>

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item label="定性描述">
              <el-input
                v-model="formData.qualitativeDescription"
                type="textarea"
                :rows="6"
                placeholder="列出将在ESG报告中纳入的所有实体（包含中文全称、简写、英文名称）"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传">
              <el-upload
                class="upload-area"
                drag
                :auto-upload="false"
                multiple
                :on-change="handleFileChange"
                :file-list="fileList"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
                <template #tip>
                  <div class="el-upload__tip">附件上传集团架构</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item title="活动、品牌、产品和服务" name="activities-brands">
        <template #title>
          <div class="collapse-title">
            <span
              >活动、品牌、产品和服务
              <EsgTooltip
                content="对应GRI标准: 102-6<br/>对应MSCI ESG指标: 无<br/>对应港交所ESG指引: 无"
              />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description"
              >企业主要活动、品牌介绍、产品和服务详情。</span
            >
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item
              label="说明：组织的活动、产品、服务 ，以及所服务的市场"
            >
              <el-input
                v-model="formData.activitiesDescription"
                type="textarea"
                :rows="8"
                placeholder="主营业务
佩蒂股份作为中国宠物食品行业的领军企业之一，已于 2023 年荣获国家高新技术企业认证。公司主营业务涵盖宠物食品全赛道，集研发、智能制造、全球销售及多品牌运营于一体，构建了完整的宠物食品产业链，致力于为全球宠物提供 多元化、高品质的营养解决方案。
公司产品线丰富，包括：宠物营养肉质零食，甄选优质肉源，科学配比，提供宠物所需的蛋白质和微量元素；宠物主粮， 涵盖全价干粮、湿粮及功能性主粮，满足宠物不同生命阶段的营养需求；以及其他满足多元化市场需求的宠物食品。公司产品主要面向犬猫等家庭宠物，以科学配方、严格品控，为宠物健康保驾护航。
——《佩蒂股份2024年ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="与先前报告期相比，组织的活动、产品、服务 ，以及所服务的市场是否有重大变化"
            >
              <template #label>
                <div>
                  <span>
                    与先前报告期相比，组织的活动、产品、服务
                    ，以及所服务的市场是否有重大变化</span
                  >

                  <EsgTooltip
                    content="可包括：活动的变化，如设施的开设、关闭或扩大；组织的供应链结构或与供应商关系的变化，包括选择和终止；或供应商位置的变化。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.activitiesDescription"
                type="textarea"
                :rows="8"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="主要产品功能与用途">
              <el-input
                v-model="formData.qualitativeDescription"
                type="textarea"
                :rows="6"
                placeholder="包括产品名称，功能及用途"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传">
              <el-upload
                class="upload-area"
                drag
                :auto-upload="false"
                multiple
                :on-change="handleFileChange"
                :file-list="fileList"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    上传提到的所有产品图片（高清，白底）
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="经营位置" name="headquarters-location">
        <template #title>
          <div class="collapse-title">
            <span
              >经营位置
              <EsgTooltip content="对应GRI标准: 102-6" />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司总部详细地址及地理位置信息。</span>
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="生产基地所在国家">
              <el-input
                v-model="formData.qualitativeDescription"
                type="textarea"
                :rows="3"
                placeholder="包括产品名称，功能及用途"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="提供产品和服务的国家">
              <el-input
                v-model="formData.headquartersAddress"
                type="textarea"
                :rows="3"
                placeholder=""
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="服务的市场与行业" name="business-locations">
        <template #title>
          <div class="collapse-title">
            <span
              >服务的市场与行业
              <EsgTooltip
                content="对应GRI标准: 102-6<br/>对应MSCI ESG指标: 环境机会, 社区机会"
              />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="提供产品和服务所在的地理位置">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="3"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="服务的行业">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="3"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="客户和受益人的类型">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="3"
                placeholder=""
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="公司文化与行为规范" name="ownership-legal">
        <template #title>
          <div class="collapse-title">
            <span
              >公司文化与行为规范
              <EsgTooltip
                content="对应GRI标准: 102-16<br/>对应MSCI ESG指标: 商业道德"
              />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">企业所有权结构和法律组织形式。</span>
          </div>
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="战略愿景">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="4"
                placeholder="成为人宠和谐健康生态的卓越建设者
Love Pets, Love Life."
              />
            </el-form-item>
            <el-form-item label="使命">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="4"
                placeholder="用全球好产品推动宠物健康标准升级
To provide the finest products and services, to bring you and your pets health and joy."
              />
            </el-form-item>
            <el-form-item label="核心价值观">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="4"
                placeholder="阳光、保鲜、担当、靠谱
Be positive,
Be exploring,
To lead,
To carry out."
              />
            </el-form-item>
            <el-form-item label="发展战略">
              <el-input
                v-model="formData.businessLocations"
                type="textarea"
                :rows="4"
                placeholder="六个全球化企业发展战略： “研发、标准、制造、供应链、市场和组织”"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 操作按钮 -->
    <EsgActionButtons
      :show-submit="false"
      @cancel="handleCancel"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Upload, QuestionFilled } from "@element-plus/icons-vue";
import EsgActionButtons from "./EsgActionButtons.vue";
import { getEsgRuleDetail, updateEsgConfig } from "@/api/esg";
import EsgTooltip from "./EsgTooltip.vue";

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "company-overview"
  }
});

// 折叠面板
const activeCollapse = ref(["company-structure"]);

// 表单数据
const formData = ref({
  companyName: "",
  headquartersLocation: "",
  qualitativeDescription: "",
  activitiesDescription: "",
  headquartersAddress: "",
  businessLocations: "",
  ownershipNature: "",
  legalForm: ""
});

// 文件列表
const fileList = ref([]);

// 文件上传处理
const handleFileChange = (file, fileList) => {
  console.log("文件变化:", file, fileList);
};

// 页面加载时获取数据
const loadData = async () => {
  try {
    const res = await getEsgRuleDetail({ type: props.activeTab });
    if (res.code === 200 && res.data) {
      // 如果返回的content是JSON字符串，需要解析
      if (res.data.content) {
        try {
          const contentData = JSON.parse(res.data.content);

          // 将数据回填到表单
          Object.keys(contentData).forEach(key => {
            // 检查是否有映射关系
            const targetKey = key;

            if (formData.value.hasOwnProperty(targetKey)) {
              formData.value[targetKey] = contentData[key];
            } else if (formData.value.hasOwnProperty(key)) {
              // 如果没有映射关系，直接使用原字段名
              formData.value[key] = contentData[key];
            } else {
              console.warn(`字段 ${key} 在formData中不存在，跳过回填`);
            }
          });
        } catch (e) {
          console.warn("解析content数据失败:", e);
        }
      }
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});

// 操作处理函数
const handleCancel = () => {
  // 自定义取消逻辑
  console.log("取消操作");
};

const handleSave = () => {
  console.log("保存数据:", formData.value);
  // 自定义保存逻辑
  const sendConfig = {
    content: JSON.stringify(formData.value),
    type: props.activeTab
  };
  updateEsgConfig(sendConfig).then(res => {
    if (res.code === 200) {
      ElMessage.success("保存成功");
    } else {
      ElMessage.error("保存失败");
    }
  });
};
</script>

<style scoped>
@import url("./styles/common.css");

/* tooltip图标垂直位置调整 */

/* 为esg-content添加底部padding，避免内容被按钮遮挡 */
.esg-content {
  padding-bottom: 80px;
}

:deep(.el-form-item__label) {
  height: 20px;

  /* font-weight: bold;
  color: #222;
  font-size: 16px; */
  line-height: 2;
}
</style>
