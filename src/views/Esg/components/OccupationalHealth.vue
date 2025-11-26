<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="管理体系" name="management-system">
        <template #title>
          <div class="collapse-title">
            <span>
              管理体系
              <EsgTooltip content="交易所可持续发展指引、GRI2-25" />
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item label="信息与隐私安全保护组织架构">
              <template #label>
                <div>
                  <span> 信息与隐私安全保护组织架构 </span>
                  <EsgTooltip
                    content="公司信息与隐私安全保护组织架构及各层级职责。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.infoPrivacyOrgStructure"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="2023年，伊利集团更新发布了《伊利集团数据管理办法》，确立了包含决策、管理、执行、技术支持、审核五个层次的数据安全组织架构及各层级数据安全职责。此外，为确保安全管理制度与流程的有效性，公司不定期对安全管理制度进行检查和修订，并结合ISO27001信息安全管理体系认证的要求，识别现有安全工作的优化点并对制度及流程进行优化，提升系统安全管理能力。——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="信息与隐私安全保护制度体系">
              <template #label>
                <div>
                  <span> 信息与隐私安全保护制度体系 </span>
                  <EsgTooltip
                    content="公司信息与隐私安全保护核心制度、是否有获得信息安全管理体系或安全等保认证证书"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.infoPrivacyPolicySystem"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="为了加强信息安全管理，我们制定并不断更新内部信息安全制度，以确保公司在网络、数据、系统、运维和机房等关键领域的信息得到有效管理。我们的信息安全团队秉持着预防为主、防治结合的原则，定期进行制度检查和修订工作，以确保信息安全制度体系的时效性和适应性。海天已建立了健全的信息安全政策体系，包括《文档安全管理规定》、《信息安全审计管理制度》、《员工信息安全行为审查规定》、《信息系统业务连续性管理规范》、《互联网应用系统安全管理规范》和《IT项目实施管理办法》等，并在全集团范围内推广和执行，为公司的信息安全筑起了坚固的防线。 ——《海天味业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="信息安全相关事件">
              <template #label>
                <div>
                  <span> 信息安全相关事件 </span>
                  <EsgTooltip
                    content="描述公司是否有数据安全事件的相关情形，包括造成的影响、涉及的金额、采取的应对措施及进展（如有）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.infoSecurityIncidents"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="同时，我们从升级技术和管理软件、加强内部监管等多个方面入手，维护双汇发展网络与数据 的安全。2023年，我们在网络总出口的位置新增双机热备式防火墙，所有横向、纵向网络流量 均需经过防火墙，通过引进WAF(Web应用防护系统)、IPS(入侵防御系统)、安全态势感知、 数据审计、漏洞扫描等信息安全工具，为整个网络以及应用系统提供了全方位的安全防护。此外，双汇发展还定期进行局域网终端的扫描与检测，升级内部安全监测与防护体系，并聘请外 部安全专业机构进行安全性分析，以全面提升网络的安全性。报告期内，我们全方位立体化保 护网络与数据安全，共开展内网漏洞扫描9次、成功修复漏洞11个，每日有效拦截各类网络攻击 300余次。 2023年，本公司未发生数据与隐私泄露事故。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="信息与隐私安全保护防范与应对措施">
              <template #label>
                <div>
                  <span> 信息与隐私安全保护防范与应对措施 </span>
                  <EsgTooltip
                    content="公司为应对信息安全侵犯行为和隐私泄露风险而建立的应急处理机制、专项预案管理及演习情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.infoPrivacyProtectionMeasures"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>资金投入</span>
                  <EsgTooltip
                    content="公司在信息安全与隐私保护方面投入的资金总额"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.infoPrivacyInvestment"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.infoPrivacyInvestment"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="客户隐私" name="customer-privacy">
        <template #title>
          <div class="collapse-title">
            <span
              >客户隐私
              <EsgTooltip content="交易所可持续发展报告指引、GRI 418" />
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item label="泄漏事件">
              <template #label>
                <div>
                  <span> 泄漏事件 </span>
                  <EsgTooltip
                    content="描述公司是否有侵犯客户隐私或丢失客户资料的相关情形，包括造成的影响、涉及的金额、采取的应对措施及进展（如有）。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.privacyLeakIncidents"
                type="textarea"
                :rows="4"
                placeholder="数字化技术高速发展的当下，上海梅林高度重视客户信息和隐私保护，公司严格遵守国家及有关部门颁布的《中华人民共和国网络安全法》《个人信息保护法》《数据安全法》《中华人民共和国消费者权益保护法》等隐私保护的相关 规定，打造相应的安全可信的服务体系，保障用户隐私。报告期内，本公司未接获有关客户隐私泄漏的投诉。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item title="数字化建设" name="digital-construction">
        <template #title>
          <div class="collapse-title">
            <span>数字化建设 </span>
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="内部数字化建设">
              <template #label>
                <div>
                  <span>内部数字化建设</span>
                  <EsgTooltip
                    content="公司内部数字化建设的情况介绍（ERP/PRM/SRM/HR等），包括举措总结、取得的成果与价值、典型项目案例"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.internalDigitalConstruction"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="宣传与培训" name="publicity-training">
        <template #title>
          <div class="collapse-title">
            <span>宣传与培训 </span>
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="信息安全与隐私保护意识培训场次">
              <template #label>
                <div>
                  <span> 信息安全与隐私保护意识培训场次 </span>
                  <EsgTooltip
                    content="公司为提升信息安全与隐私保护意识而开展的培训。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.infoPrivacyTrainingDescription"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="publicityTrainingAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.publicityTrainingAttachmentFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  () => {
                    // 遍历替换一边文件名
                    formData.publicityTrainingAttachmentFileList =
                      formData.publicityTrainingAttachmentFileList.map(
                        item => ({
                          ...item,
                          name: item.response.data.split('/').pop()
                        })
                      );
                    handleSave('autoSave');
                  }
                "
                :on-remove="() => $nextTick(() => handleSave('autoSave'))"
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
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 信息安全与隐私保护意识培训场次 </span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.infoPrivacyTrainingSessions"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.infoPrivacyTrainingSessions"
                  type="textarea"
                  :rows="2"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 信息安全与隐私保护意识培训人次 </span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.infoPrivacyTrainingParticipants"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.infoPrivacyTrainingParticipants"
                  type="textarea"
                  :rows="2"
                />
                <span>人次</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 45px">
              <template #label>
                <div>
                  <span>信息安全与隐私保护意识培训总时长 </span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.infoPrivacyTrainingTotalHours"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.infoPrivacyTrainingTotalHours"
                  type="textarea"
                  :rows="2"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 45px">
              <template #label>
                <div>
                  <span>信息安全与隐私保护意识培训人均时长 </span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.infoPrivacyTrainingAvgHours"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.infoPrivacyTrainingAvgHours"
                  type="textarea"
                  :rows="2"
                />
                <span>小时</span>
              </div>
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
      :isEdit="isEdit"
    />
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, toRef } from "vue";
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
import { onlyPositiveInteger, onlyPositiveNumber } from "../utils";
import { useEsgAutoSave } from "@/utils/autoSave";

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

// 折叠面板
const activeCollapse = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  infoPrivacyOrgStructure: "", // 信息与隐私安全保护组织架构
  infoPrivacyPolicySystem: "", // 信息与隐私安全保护制度体系
  infoSecurityIncidents: "", // 信息安全相关事件
  infoPrivacyProtectionMeasures: "", // 信息与隐私安全保护防范与应对措施
  infoPrivacyInvestment: "", // 资金投入
  privacyLeakIncidents: "", // 泄漏事件
  internalDigitalConstruction: "", // 内部数字化建设
  infoPrivacyTrainingDescription: "", // 信息安全与隐私保护意识培训场次（描述）
  publicityTrainingAttachmentFileList: [], // 附件上传 (宣传与培训)
  infoPrivacyTrainingSessions: "", // 信息安全与隐私保护意识培训场次（数值）
  infoPrivacyTrainingParticipants: "", // 信息安全与隐私保护意识培训人次
  infoPrivacyTrainingTotalHours: "", // 信息安全与隐私保护意识培训总时长
  infoPrivacyTrainingAvgHours: "" // 信息安全与隐私保护意识培训人均时长
});
const emptyFormData = JSON.parse(JSON.stringify(formData.value));

// 文件上传处理
const handleFileChange = (file, fileList) => {
  console.log("文件变化:", file, fileList);
};

const handleFileBeforeUpload = file => {
  // 生成新的文件名
  const newFileName = props.curDDUserInfo.username + "_" + file.name;

  // 使用 new File 构造新的文件对象，并设置新的文件名
  const newFile = new File([file], newFileName, {
    type: file.type,
    lastModified: file.lastModified
  });
  // 返回新的文件对象
  return newFile;
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
    // 初始化表单数据
    Object.keys(formData.value).forEach(key => {
      formData.value[key] = emptyFormData[key];
    });
    const res = await getEsgRuleDetail({
      type: props.activeTab,
      year: props.year
    });
    if (res.code === 200 && res.data) {
      // 如果返回的content是JSON字符串，需要解析
      // if (res.data?.content) {
      //   try {
      //     const contentData = JSON.parse(res.data.content);
      //     // 将数据回填到表单
      //     Object.keys(contentData).forEach(key => {
      //       // 检查是否有字段映射
      //       const targetKey = key;

      //       if (formData.value.hasOwnProperty(targetKey)) {
      //         formData.value[targetKey] = contentData[key];
      //       } else {
      //         console.warn(
      //           `字段 ${key} (映射为 ${targetKey}) 在formData中不存在，跳过回填`
      //         );
      //       }
      //     });
      //   } catch (e) {
      //     console.warn("解析content数据失败:", e);
      //   }
      // }

      //###############################################################################################
      // 如果没有编辑权限，则遍历res.data数组，把每个对象相同的字段值进行拼接，格式为res.data[x].userName: res.data.[x].content.[字段值]
      // 因为返回的res.data.[x].content是JSON字符串，所以都需要解析
      if (!props.isEdit) {
        res.data.forEach(item => {
          try {
            const contentData = JSON.parse(item.content);
            // 将数据回填到表单
            Object.keys(contentData).forEach(key => {
              // 检查是否有字段映射
              const targetKey = key;

              if (formData.value.hasOwnProperty(targetKey)) {
                // 如果是字符串类型则拼接，如果是数组则push
                if (typeof contentData[key] === "string") {
                  // 如果值为空则不做拼接
                  if (contentData[key]) {
                    formData.value[targetKey] +=
                      `${item.userName}: ${contentData[key]}\n`;
                  }
                } else if (Array.isArray(contentData[key])) {
                  formData.value[targetKey].push(...contentData[key]);
                }
              } else {
                console.warn(
                  `字段 ${key} (映射为 ${targetKey}) 在formData中不存在，跳过回填`
                );
              }
            });
          } catch (e) {
            console.warn("解析content数据失败:", e);
          }
        });
      } else {
        // 如果有编辑权限，则找到res.data里userId等于props.curDDUserInfo?.id的对象，把它的content赋值给formData.value.content
        const userItem = res.data.find(
          item => item.userId == props.curDDUserInfo?.id
        );
        // console.log("回馈社会：", userItem);
        if (userItem) {
          try {
            const contentData = JSON.parse(userItem.content);
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
      //###############################################################################################
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});
watch(() => props.year, loadData);

// 操作处理函数
const handleCancel = () => {
  // 自定义取消逻辑
  console.log("取消操作");
};

// type 可选，默认为请求，可指定自动保存类型  可选值："request" | "autoSave"
const handleSave = (type = "request") => {
  console.log("保存数据:", formData.value);
  // 自定义保存逻辑
  const sendConfig = {
    content: JSON.stringify(formData.value),
    type: props.activeTab,
    year: props.year,
    userId: props.curDDUserInfo?.id,
    userName: props.curDDUserInfo?.username
  };

  updateEsgConfig(sendConfig).then(res => {
    if (res.code === 200) {
      if (type === "request") {
        ElMessage.success("保存成功");
      }
    } else {
      ElMessage.error("保存失败");
    }
  });
};

// //#region 自动保存逻辑，一分钟自动保存一次，文件上传成功自动保存一次，页面没激活时不会保存，页面没编辑权限时也不会保存
// const autoSaveInterval = 60 * 1000; // 1分钟
// const autoSaveTimer = ref(null);
// autoSaveTimer.value = setInterval(() => {
//   if (props.activeTab === "information-security-privacy" && props.isEdit) {
//     handleSave();
//   }
// }, autoSaveInterval);
// onUnmounted(() => {
//   if (autoSaveTimer.value) {
//     clearInterval(autoSaveTimer.value);
//   }
// });
// //#endregion
//#region 自动保存逻辑，使用抽象后的工具函数
useEsgAutoSave(
  () => handleSave("autoSave"),
  toRef(props, "activeTab"),
  toRef(props, "isEdit"),
  "information-security-privacy"
);
//#endregion
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

.textContainer {
  display: flex;
  gap: 30px;
  align-items: center;
  white-space: nowrap;
}
</style>
