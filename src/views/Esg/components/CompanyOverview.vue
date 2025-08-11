<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item
        title="公司名称与组织架构"
        name="company-name-structure"
      >
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
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司全称与简称、公司组织架构图。</span>
          </div>
          -->

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item label="公司全称">
              <el-input
                v-model="formData.companyFullName"
                type="textarea"
                :rows="6"
                placeholder="请输入公司全称"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="总部所在地">
              <el-input
                v-model="formData.headquartersLocation"
                type="textarea"
                :rows="6"
                placeholder="请输入总部详细地址"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="纳入组织可持续发展报告的实体"
        name="reporting-entities"
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
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司全称与简称、公司组织架构图。</span>
          </div>
          -->

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item label="公司组织架构图">
              <el-input
                v-model="formData.reportingEntitiesDescription"
                type="textarea"
                :rows="6"
                placeholder="列出将在ESG报告中纳入的所有实体（包含中文全称、简写、英文名称）"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传" prop="reportingEntitiesFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.reportingEntitiesFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                :headers="{
                  Authorization: formatToken(getToken().accessToken)
                }"
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
      <el-collapse-item
        title="活动、品牌、产品和服务"
        name="activities-products-services"
      >
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
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description"
              >企业主要活动、品牌介绍、产品和服务详情。</span
            >
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item
              label="说明：组织的活动、产品、服务 ，以及所服务的市场"
            >
              <el-input
                v-model="formData.activitiesAndServicesDescription"
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
                v-model="formData.activitiesChangesDescription"
                type="textarea"
                :rows="8"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="主要产品功能与用途">
              <template #label>
                <div>
                  <span> 主要产品功能与用途</span>

                  <EsgTooltip content="包括产品名称，功能及用途" />
                </div>
              </template>
              <el-input
                v-model="formData.productFunctionDescription"
                type="textarea"
                :rows="6"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传" prop="activitiesAndServicesFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.activitiesAndServicesFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                multiple
                :headers="{
                  Authorization: formatToken(getToken().accessToken)
                }"
                accept=".jpg,.jpeg,.png,.webp"
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

      <el-collapse-item title="经营位置" name="business-locations">
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
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">公司总部详细地址及地理位置信息。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="生产基地所在国家">
              <el-input
                v-model="formData.productionBaseCountries"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="提供产品和服务的国家">
              <el-input
                v-model="formData.serviceCountries"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="服务的市场与行业" name="markets-industries">
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
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="提供产品和服务所在的地理位置">
              <el-input
                v-model="formData.serviceGeographicLocations"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="服务的行业">
              <el-input
                v-model="formData.serviceIndustries"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="客户和受益人的类型">
              <el-input
                v-model="formData.customerBeneficiaryTypes"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item
        title="公司文化与行为规范"
        name="corporate-culture-ethics"
      >
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
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">企业所有权结构和法律组织形式。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="战略愿景">
              <el-input
                v-model="formData.strategicVision"
                type="textarea"
                :rows="4"
                placeholder="成为人宠和谐健康生态的卓越建设者
Love Pets, Love Life."
              />
            </el-form-item>
            <el-form-item label="使命">
              <el-input
                v-model="formData.mission"
                type="textarea"
                :rows="4"
                placeholder="用全球好产品推动宠物健康标准升级
To provide the finest products and services, to bring you and your pets health and joy."
              />
            </el-form-item>
            <el-form-item label="核心价值观">
              <el-input
                v-model="formData.coreValues"
                type="textarea"
                :rows="6"
                placeholder="阳光、保鲜、担当、靠谱
Be positive,
Be exploring,
To lead,
To carry out."
              />
            </el-form-item>
            <el-form-item label="发展战略">
              <el-input
                v-model="formData.developmentStrategy"
                type="textarea"
                :rows="4"
                placeholder="六个全球化企业发展战略： “研发、标准、制造、供应链、市场和组织”"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="外部倡议" name="external-initiatives">
        <template #title>
          <div class="collapse-title">
            <span
              >外部倡议
              <EsgTooltip content="对应GRI标准: 102-12" />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item>
              <template #label>
                <div>
                  <span
                    >组织参与或支持的外界发起的经济、环境、社会章程、原则或其他倡议。</span
                  >
                  <EsgTooltip content="文本后可附新闻链接" />
                </div>
              </template>
              <el-input
                v-model="formData.externalInitiativesDescription"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="新闻链接">
              <el-input v-model="formData.externalInitiativesNewsLink" />
            </el-form-item>
            <el-form-item label="附件上传" prop="externalInitiativesFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.externalInitiativesFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                multiple
                :headers="{
                  Authorization: formatToken(getToken().accessToken)
                }"
                accept=".jpg,.jpeg,.png,.webp"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
                <template #tip>
                  <div class="el-upload__tip">如有活动图片请上传</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="协会成员资格" name="association-membership">
        <template #title>
          <div class="collapse-title">
            <span
              >协会成员资格
              <EsgTooltip content="对应GRI标准: 102-13" />
            </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item>
              <template #label>
                <div>
                  <span>主要协会成员资格清单。</span>
                  <EsgTooltip content="文本后可附新闻链接" />
                </div>
              </template>
              <el-input
                v-model="formData.associationMembershipDescription"
                type="textarea"
                :rows="4"
                placeholder="请列出组织的主要协会成员资格"
              />
            </el-form-item>
            <el-form-item label="新闻链接">
              <el-input
                v-model="formData.associationMembershipNewsLink"
                placeholder="请输入相关新闻链接"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="associationMembershipFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.associationMembershipFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                multiple
                :headers="{
                  Authorization: formatToken(getToken().accessToken)
                }"
                accept=".jpg,.jpeg,.png,.webp"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
                <template #tip>
                  <div class="el-upload__tip">如有活动图片请上传</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="荣誉认可" name="honors-recognition">
        <template #title>
          <div class="collapse-title">
            <span>荣誉认可 </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item>
              <template #label>
                <div>
                  <span>公司及其子公司获得的重要荣誉奖项与颁奖单位。</span>
                  <EsgTooltip content="文本后可附新闻链接" />
                </div>
              </template>
              <el-input
                v-model="formData.honorsAndRecognitionDescription"
                type="textarea"
                :rows="4"
                placeholder="请描述公司及其子公司获得的重要荣誉奖项与颁奖单位"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="honorsAndRecognitionFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.honorsAndRecognitionFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                multiple
                :headers="{
                  Authorization: formatToken(getToken().accessToken)
                }"
                accept=".jpg,.jpeg,.png,.webp"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
                <template #tip>
                  <div class="el-upload__tip">请上传奖项图片</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="公司年度重大事件" name="annual-major-events">
        <template #title>
          <div class="collapse-title">
            <span>公司年度重大事件 </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item>
              <template #label>
                <div>
                  <span>公司本年度发生的重大事件。</span>
                  <EsgTooltip content="文本后可附新闻链接" />
                </div>
              </template>
              <el-input
                v-model="formData.annualMajorEventsDescription"
                type="textarea"
                :rows="4"
                placeholder="请描述公司本年度发生的重大事件"
              />
            </el-form-item>
            <el-form-item label="新闻链接">
              <el-input
                v-model="formData.annualMajorEventsNewsLink"
                placeholder="请输入相关新闻链接"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="annualMajorEventsFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.annualMajorEventsFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                multiple
                :headers="{
                  Authorization: formatToken(getToken().accessToken)
                }"
                accept=".jpg,.jpeg,.png,.webp"
              >
                <el-button type="primary" :icon="Upload">上传附件</el-button>
              </el-upload>
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
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Upload, QuestionFilled } from "@element-plus/icons-vue";
import EsgActionButtons from "./EsgActionButtons.vue";
import {
  getEsgRuleDetail,
  updateEsgConfig,
  baseUrlApi,
  getFileDownLoadPath
} from "@/api/esg";
import EsgTooltip from "@/components/EsgTooltip/index.vue";
import { formatToken, getToken } from "@/utils/auth.ts";
const uploadUrl = baseUrlApi("/esg/upload");

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "company-overview"
  }
});

// 折叠面板
const activeCollapse = ref(["company-name-structure"]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  // 公司名称与组织架构
  companyFullName: "", // 公司全称
  headquartersLocation: "", // 总部所在地

  // 纳入组织可持续发展报告的实体
  reportingEntitiesDescription: "", // 定性描述
  reportingEntitiesFileList: [], // 附件列表

  // 活动、品牌、产品和服务
  activitiesAndServicesDescription: "", // 组织的活动、产品、服务说明
  activitiesChangesDescription: "", // 与先前报告期相比的重大变化
  productFunctionDescription: "", // 主要产品功能与用途
  activitiesAndServicesFileList: [], // 附件列表

  // 经营位置
  productionBaseCountries: "", // 生产基地所在国家
  serviceCountries: "", // 提供产品和服务的国家
  // 服务的市场与行业
  serviceGeographicLocations: "", // 提供产品和服务所在的地理位置
  serviceIndustries: "", // 服务的行业
  customerBeneficiaryTypes: "", // 客户和受益人的类型

  // 公司文化与行为规范
  strategicVision: "", // 战略愿景
  mission: "", // 使命
  coreValues: "", // 核心价值观
  developmentStrategy: "", // 发展战略

  // 外部倡议
  externalInitiativesDescription: "", // 外部倡议描述
  externalInitiativesNewsLink: "", // 新闻链接
  externalInitiativesFileList: [], // 附件列表
  // 协会成员资格
  associationMembershipDescription: "", // 协会成员资格描述
  associationMembershipNewsLink: "", // 新闻链接
  associationMembershipFileList: [], // 附件列表
  // 荣誉认可
  honorsAndRecognitionDescription: "", // 荣誉认可描述
  honorsAndRecognitionFileList: [], // 附件列表
  // 公司年度重大事件
  annualMajorEventsDescription: "", // 年度重大事件描述
  annualMajorEventsNewsLink: "", // 新闻链接
  annualMajorEventsFileList: [] // 附件列表
});

// 文件上传处理
const handleFileChange = (file, fileList) => {
  console.log("文件变化:", file, fileList);
};

const handlePictureCardPreview = uploadFile => {
  if (uploadFile.response?.code !== 200) return;
  getFileDownLoadPath({
    objectName: uploadFile.response.data
  })
    .then(res => {
      const { code, msg, data } = res;
      if (code === 200) {
        dialogImageUrl.value = res.data;
        dialogVisible.value = true;
      } else {
        ElMessage.error("图片预览失败--" + msg);
      }
    })
    .catch(err => {
      ElMessage.error("图片预览失败");
    });
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
            // 检查是否有字段映射
            const targetKey = key;

            if (formData.value.hasOwnProperty(targetKey)) {
              formData.value[targetKey] = contentData[key];
            } else {
              console.warn(
                `字段 ${key} (映射为 ${targetKey}) 在formData中不存在，跳过回填`
              );
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
    type: props.activeTab,
    year: new Date().getFullYear()
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
  line-height: 1.3;
}
</style>
