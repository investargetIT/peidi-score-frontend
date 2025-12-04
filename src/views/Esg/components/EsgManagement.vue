<template>
  <div class="esg-content">
    <!-- ESG管理组件 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <!-- ESG治理架构 -->
      <el-collapse-item title="ESG治理架构" name="company-name-structure">
        <template #title>
          <div class="collapse-title">
            <span
              >ESG治理架构
              <EsgTooltip content="Wind评级" />
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

          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item label="ESG治理架构">
              <el-input
                v-model="formData.companyFullName"
                type="textarea"
                :rows="6"
                placeholder="【提示】为适应公司战略与可持续发展需要，进一步增强公司核心竞争力与可持续发展能力，伊利在董事会层面设立董事会战略与可持续发展委员会。董事会战略与可持续发展委员会下设可持续发展管理办公室，负责伊利集团可持续发展工作的战略监督及管理、跨部门协调及能力建设等工作，以支撑战略有效落地。在“执行层”共设立8个可持续发展关键议题工作组，覆盖碳中和、水资源管理、责任采购、可持续农业、包装与废弃物、营养与健康、商业道德与ESG信息披露，关键议题工作组由总部职能部门、各产品事业部可持续发展联络员组成，负责具体工作推进。 ——《伊利股份2023年可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- ESG管理战略与方针 -->
      <el-collapse-item title="ESG管理战略与方针" name="reporting-entities">
        <template #title>
          <div class="collapse-title">
            <span
              >ESG管理战略与方针
              <EsgTooltip content="对应GRI标准: GRI2-22" />
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

          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item label="ESG管理战略与方针">
              <template #label>
                <div>
                  <span> ESG管理战略与方针 </span>
                  <EsgTooltip
                    content="公司董事会对ESG工作的管理战略、方针、策略及目标设定；董事会对ESG目标设定的考量因素并检讨目标实现情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.managementStrategyAndPolicy"
                type="textarea"
                :rows="6"
                placeholder="【提示】中粮糖业结合自身行业特点与实际运营情况，在“打造世界领先大糖商，酿造甜蜜美好生活”战略愿景指引下，坚定“甜蜜有你，未来有你”的ESG战略目标，确立“SWEET”五大战略支柱，一是安全支撑（Safety），二是温暖社区（Warm），三是绿色低碳（Eco-friendly），四是赋能谋远（Enabling），五是科技创新（Tech-innovative）。围绕五大战略支柱，开展支撑安全、聚焦新质、公益项目、服务社区、双碳行动、绿色运营、强本固基、扎根三农、优质产品、技术创新十项重点行动，建立符合公司发展需求的ESG指标体系，完善ESG工作机制，分步骤推进ESG管理提升计划的实施与落地，将ESG理念融入公司日常运营管理中，实现治理与日常运营的有机结合，为公司可持续发展奠定坚实基础。 ——《中粮糖业2023年度ESG报告》"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- ESG工作领导细则 -->
      <el-collapse-item
        title="ESG工作领导细则"
        name="activities-products-services"
      >
        <template #title>
          <div class="collapse-title">
            <span>ESG工作领导细则 </span>
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="ESG工作领导细则">
              <template #label>
                <div>
                  <span> ESG工作领导细则 </span>
                  <EsgTooltip
                    content="公司董事会ESG领导工作人员组成、职责权限、决策程序、议事规则等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.reportingEntitiesDescription"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- ESG目标制定与审核 -->
      <el-collapse-item title="ESG目标制定与审核" name="business-locations">
        <template #title>
          <div class="collapse-title">
            <span>ESG目标制定与审核 </span>
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="ESG目标制定与审核">
              <template #label>
                <div>
                  <span> ESG目标制定与审核 </span>
                  <EsgTooltip
                    content="描述公司董事会就ESG相关目标设定，定期审查公司ESG表现的行动。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.targetSetAndReview"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- ESG风险与机遇识别 -->
      <el-collapse-item title="ESG风险与机遇识别" name="markets-industries">
        <template #title>
          <div class="collapse-title">
            <span>ESG风险与机遇识别 </span>
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="ESG风险与机遇识别">
              <template #label>
                <div>
                  <span> ESG目标制定与审核 </span>
                  <EsgTooltip
                    content="描述董事会对于公司ESG相关风险与机遇的识别流程。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.serviceGeographicLocations"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 利益相关方沟通制度及建议渠道 -->
      <el-collapse-item
        title="利益相关方沟通制度及建议渠道"
        name="corporate-culture-ethics"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >利益相关方沟通制度及建议渠道
              <EsgTooltip content="交易所可持续性发展指引" />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="利益相关方沟通制度及建议渠道">
              <template #label>
                <div>
                  <span> 利益相关方沟通制度及建议渠道 </span>
                  <EsgTooltip
                    content="1.利益相关方沟通制度的建设、执行情况 <br/>2.听取、反馈利益相关方意见建议的渠道及执行情况，如沟通方式、沟通频率、沟通内容等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.strategicVision"
                type="textarea"
                :rows="4"
                placeholder="【提示】伊利建立可持续发展议题重要性分析的基本流程，通过利益相关方识别、议题识别、重要性评估和议题分析与验证四大步骤，从“对伊利集团可持续发展的重要性”和“利益相关方关注程度”两个维度，确定对自身可持续发展影响重大、利益相关方普遍关注的关键性议题。根据实质性议题分析结果，制定议题管理与披露策略，针对性在全集团范围内收集信息并系统整理，形成报告内容对外披露。 具体内容详见《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 尽职调查 -->
      <el-collapse-item title="尽职调查" name="external-initiatives">
        <template #title>
          <div class="collapse-title">
            <span
              >尽职调查
              <EsgTooltip content="交易所可持续性发展指引" />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item>
              <template #label>
                <div>
                  <span>尽职调查</span>
                  <EsgTooltip
                    content="结合实际情况披露报告期内识别和应对可持续发展相关负面影响或风险的尽职调查情况，包括但不限于负责尽职调查的机构或人员、尽职调查的范围、识别可持续发展相关负面影响或风险的程序及应对相关负面影响和风险的具体情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.externalInitiativesDescription"
                type="textarea"
                :rows="4"
                placeholder="【提示】公司每年开展风险管理和内部控制自评价，在内部环境评估方面，涉及治理结构、社会责任、企业文化、人力资源等与ESG相关的风险。公司基于全面风险管理体系对相关风险建立管控流程，并监督其执行情况，有效管理相关风险对公司的影响。 ——— 《中信证券股份有限公司2023年度社会责任报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- ESG相关的国际组织或者行业组织 -->
      <el-collapse-item
        title="ESG相关的国际组织或者行业组织"
        name="association-membership"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >ESG相关的国际组织或者行业组织
              <EsgTooltip content="Wind评级" />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item>
              <template #label>
                <div>
                  <span>ESG相关的国际组织或者行业组织 </span>
                  <EsgTooltip
                    content="公司参与UNGC、SBTi等ESG相关的国际组织或行业协会"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.associationMembershipDescription"
                type="textarea"
                :rows="4"
                placeholder="【提示】水井坊已正式签署并加入了科学碳目标倡议（SBTi），以推动实现《巴黎协定》中“将全球平均温度升幅控制在1.5摄氏度以内”的目标情景。2023年9月，水井坊正式加入联合国全球契约组织(UNGlobalCompact)，承诺履行以联合国公约为基础的，涵盖劳工标准、环境和反腐败领域的《全球契约十项原则》，积极推动全球可持续发展和社会公正实现的同时，通过原则的执行进一步自我规范运营行为，防范合规风险。——《水井坊2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="associationMembershipFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.associationMembershipFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  handleUploadSuccess('associationMembershipFileList')
                "
                :on-remove="handleUploadRemove"
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
      <!-- ESG履责成果 -->
      <el-collapse-item title="ESG履责成果" name="honors-recognition">
        <template #title>
          <div class="collapse-title">
            <span>ESG履责成果 </span>
          </div>
        </template>
        <div class="form-section">
          <!--
          <div class="section-description">
            <span class="label">内容详解：</span>
            <span class="description">各经营场所的地址及业务范围。</span>
          </div>
          -->
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item>
              <template #label>
                <div>
                  <span>ESG履责成果</span>
                  <EsgTooltip
                    content="描述公司在履行社会责任、开展ESG工作方面取得的奖项及荣誉情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.honorsAndRecognitionDescription"
                type="textarea"
                :rows="4"
                placeholder="【提示】伊利双碳案例入选了《中国落实2030年可持续发展议程进展报告（2023）》，是唯一一家入选的食品企业,也是伊利第三次入选该报告；伊利成功入选“中国ESG上市公司先锋100”榜单，ESG指数排名位于中国食品行业第一，ESG表现处于五星级水平，是上市公司ESG发展的卓越者；伊利荣获“乳制品行业社会责任发展指数（2023）第一；伊利入选中国上市公司协会2023年“上市公司ESG最佳实践案例。——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- ESG报告审验 -->
      <el-collapse-item title="ESG报告审验" name="annual-major-events">
        <template #title>
          <div class="collapse-title">
            <span
              >ESG报告审验
              <EsgTooltip content="对应GRI标准: GRI2-5<br/>Wind评级" />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="ESG报告审验" prop="annualMajorEventsFileList">
              <template #label>
                <div>
                  <span> ESG报告审验 </span>
                  <EsgTooltip content="第三方审验报告" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.annualMajorEventsFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="handleUploadSuccess('annualMajorEventsFileList')"
                :on-remove="handleUploadRemove"
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, toRef, inject } from "vue";
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
import { useEsgAutoSave } from "@/utils/autoSave";
import {
  FORM_LABEL_WIDTH,
  useEsgSave,
  useEsgCancel,
  useEsgLoadData,
  useEsgFileUpload
} from "@/views/Esg/components/utils/index.ts";
const uploadUrl = baseUrlApi("/esg/upload");

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "company-overview"
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  year: {
    type: String,
    default: "",
    required: true
  },
  curDDUserInfo: {
    type: Object,
    default: () => ({})
  }
});
// 依赖注入 - 接收图片预览相关参数
const dialogVisible = inject("dialogVisible");
const dialogImageUrl = inject("dialogImageUrl");

// 折叠面板
const activeCollapse = ref([]);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  // 公司名称与组织架构
  companyFullName: "", // 公司全称

  // 纳入组织可持续发展报告的实体
  reportingEntitiesDescription: "", // 定性描述

  targetSetAndReview: "", // ESG目标制定与审核
  managementStrategyAndPolicy: "", // 管理战略与方针

  // 服务的市场与行业
  serviceGeographicLocations: "", // 提供产品和服务所在的地理位置

  // 公司文化与行为规范
  strategicVision: "", // 战略愿景

  // 外部倡议
  externalInitiativesDescription: "", // 外部倡议描述
  // 协会成员资格
  associationMembershipDescription: "", // 协会成员资格描述
  associationMembershipFileList: [], // 附件列表
  // 荣誉认可
  honorsAndRecognitionDescription: "", // 荣誉认可描述
  // 公司年度重大事件
  annualMajorEventsFileList: [] // 附件列表
});
const emptyFormData = JSON.parse(JSON.stringify(formData.value));

//#region 文件上传处理，使用封装后的公共函数
const {
  handleFileChange,
  handleFileBeforeUpload,
  handlePictureCardPreview,
  handleUploadSuccess,
  handleUploadRemove
} = useEsgFileUpload(
  dialogImageUrl,
  dialogVisible,
  toRef(props, "curDDUserInfo"),
  formData,
  () => handleSave("autoSave")
);
//#endregion

//#region 数据加载逻辑，使用封装后的公共函数
const { loadData } = useEsgLoadData(
  formData,
  emptyFormData,
  toRef(props, "activeTab"),
  toRef(props, "year"),
  toRef(props, "curDDUserInfo"),
  toRef(props, "isEdit")
);
//#endregion

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});
watch(() => props.year, loadData);

// 操作处理函数
const { handleCancel } = useEsgCancel();

//#region 保存逻辑，使用封装后的公共函数
const { handleSave } = useEsgSave(
  formData,
  toRef(props, "activeTab"),
  toRef(props, "year"),
  toRef(props, "curDDUserInfo")
);
//#endregion

//#region 自动保存逻辑，使用抽象后的工具函数
useEsgAutoSave(
  () => handleSave("autoSave"),
  toRef(props, "activeTab"),
  toRef(props, "isEdit"),
  "esg-management"
);
//#endregion

// ref暴露方法
defineExpose({
  handleSave,
  handleCancel
});
</script>

<style lang="scss" scoped>
@import url("./styles/common.css");
@import url("./styles/optimize.scss");
</style>
