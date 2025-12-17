<template>
  <div class="esg-content">
    <!-- 回馈社会组件 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <!-- 社会公益 -->
      <el-collapse-item title="社会公益" name="social-welfare">
        <template #title>
          <div class="collapse-title">
            <span>
              社会公益
              <EsgTooltip
                content="对应GRI标准:GRI 203<br/>
交易所可持续发展报告指引"
              />
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
            <el-form-item>
              <template #label>
                <div>
                  <span>社会公益投入金额</span>
                  <EsgTooltip
                    content="社会公益投入金额包括： 1向慈善机构、NGO、研究机构（与公司的商业性研发无关）的捐赠 2支持社区基础设施的资金 3社会活动（包括艺术和教育活动）的直接成本"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.socialWelfareInvestment"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.socialWelfareInvestment"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>每股社会贡献值</span>
                  <EsgTooltip
                    content="每股社会贡献值=每股收益+（纳税总额+职工费用+利息支出+公益投入总额-社会成本）÷期末总股本 社会成本是指因环境污染等造成的其他社会成本，比如环境污染造成的处罚"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.socialContributionPerShare"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.socialContributionPerShare"
                  type="textarea"
                  :rows="2"
                />
                <span>元</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 社区公益-目标与理念 -->
      <el-collapse-item
        title="社区公益-目标与理念"
        name="community-welfare-goals"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >社区公益-目标与理念
              <EsgTooltip
                content="对应GRI标准：GRI 203<br/>
交易所可持续发展报告指引"
              />
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
            <el-form-item label="战略与目标">
              <template #label>
                <div>
                  <span> 战略与目标 </span>
                  <EsgTooltip content="描述公司社会公益战略、承诺、目标等。" />
                </div>
              </template>
              <el-input
                v-model="formData.communityWelfareStrategy"
                type="textarea"
                :rows="4"
                placeholder="【提示】中粮糖业坚持发展成果与社会共享，利用自身资源优势，开展公益志愿活动，汇聚点滴力量服务社区、关爱社会，向社会传递爱与温暖。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="体系及策略">
              <template #label>
                <div>
                  <span> 体系及策略 </span>
                  <EsgTooltip
                    content="描述公司公益管理体系，包括公益理念、组织架构、制度，以及公司开展公益性活动，鼓励员工志愿服务，进行资源捐赠和投资的政策。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.communityWelfareSystem"
                type="textarea"
                :rows="4"
                placeholder="【提示】我们积极践行“关爱与分享”的公益理念，主动担当社会公益责任，鼓励员工参与志愿服务活动，努力实现自身与社区的和谐共处、共生共荣。报告期内，公司对外捐赠659.27万元，员工注册志愿者人数78人，员工累计参与志愿服务53小时，员工参与志愿服务7人次。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 社区公益-打造品牌公益项目 -->
      <el-collapse-item
        title="社区公益-打造品牌公益项目"
        name="brand-charity-projects"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >社区公益-打造品牌公益项目
              <EsgTooltip
                content="对应GRI标准：GRI 203<br/>
交易所可持续发展报告指引"
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="打造品牌公益项目">
              <template #label>
                <div>
                  <span>打造品牌公益项目</span>
                  <EsgTooltip
                    content="描述公司打造的品牌公益项目情况及个数。品牌项目指在国家、社会和公众高度关注而发展程度较低的社会、环境领域，企业开展的有一定社会影响力并且取得了显著成效的公益项目。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.brandCharityProjects"
                type="textarea"
                :rows="4"
                placeholder="【提示】“与你共飞翔”公益计划于2022年启动，通过爱心捐赠与教师培训帮扶，旨在通过向学前儿童提供科学健康的营养补给及先进的教学体系培养，助力国家学前教育高质量发展。 2023年，双汇“与你共飞翔”公益计划走进陕西汉中、山东莱芜、贵州威宁等地，向当地数十家幼儿园定向捐赠双汇儿童产品智趣多鳕鱼肠及儿童性格涵养教学体系，以全力推进学 前教育优质、均衡发展，切实保障城乡适龄儿童享受公平、高质的学前教育。 未来，“与你共飞翔”公益计划还将陆续走进安徽、湖南等地，为当地学前教育提供支持与助力，惠及更多儿童及家庭，为促进中国少年儿童健康成长贡献更多力量。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="brandCharityProjectsAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="
                  formData.brandCharityProjectsAttachmentFileList
                "
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  handleUploadSuccess('brandCharityProjectsAttachmentFileList')
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
      <!-- 社区公益与志愿活动实践 -->
      <el-collapse-item
        title="社区公益与志愿活动实践"
        name="community-volunteer-activities"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >社区公益与志愿活动实践
              <EsgTooltip
                content="对应GRI标准：GRI 203<br/>
交易所可持续发展报告指引"
              />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="社区公益与志愿活动实践">
              <template #label>
                <div>
                  <span> 社区公益与志愿活动实践 </span>
                  <EsgTooltip
                    content="描述公司参与社会公益活动的名称、举措及案例等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.communityVolunteerActivities"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="【提示】公司积极履行社会责任，奉献爱心，每年都通过山东省公安民警优抚基金会进行捐赠，并用于帮助公安系统烈士、因公牺牲和伤残民警家属。此外，公司持续完善爱心基金制度，帮扶困难职工，在2023年共计帮扶职工109人，支出帮扶资金12.08万元。同样，作为中国小动物保护协会副会长单位，中宠股份深知每一个生命都值得尊重与呵护，特别是那些无家可归、亟需救助的流浪动物，公司每年定期向流浪猫狗动物基地捐赠宠粮。在2023年9月，秉持着社会责任感和公益爱心，公司向位于安徽省巢湖市的寻爱宠物有限公司旗下的流浪犬动物保护中心进行了宠粮捐赠。此次公益活动充分展示了中宠股份对于动物福祉及社会公益事业的持续关注与鼎力支持。 ——《中宠股份2023年度社会责任报告》"
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
                  handleUploadSuccess('publicityTrainingAttachmentFileList')
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
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 员工参与公益志愿活动总人数 </span>
                  <EsgTooltip
                    content="报告期内公司员工参与公益志愿活动总人数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.volunteerTotalParticipants"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.volunteerTotalParticipants"
                  type="textarea"
                  :rows="2"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>
                    员工公益志愿活动人均时长
                    <EsgTooltip
                      content="报告期内公司员工参与公益志愿活动人均时长"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.volunteerAverageHours"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.volunteerAverageHours"
                  type="textarea"
                  :rows="2"
                />
                <span>小时</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 社区公益所获荣誉 -->
      <el-collapse-item
        title="社区公益所获荣誉"
        name="community-welfare-honors"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >社区公益所获荣誉
              <EsgTooltip content="交易所可持续发展报告指引" />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="社区公益所获荣誉">
              <template #label>
                <div>
                  <span>社区公益所获荣誉</span>
                  <EsgTooltip
                    content="报告期内公司在社会公益领域所获的荣誉奖项及数量"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.communityWelfareHonors"
                type="textarea"
                :rows="4"
                placeholder="【提示】“与你共飞翔”公益计划于2022年启动，通过爱心捐赠与教师培训帮扶，旨在通过向学前儿童提供科学健康的营养补给及先进的教学体系培养，助力国家学前教育高质量发展。 2023年，双汇“与你共飞翔”公益计划走进陕西汉中、山东莱芜、贵州威宁等地，向当地数十家幼儿园定向捐赠双汇儿童产品智趣多鳕鱼肠及儿童性格涵养教学体系，以全力推进学 前教育优质、均衡发展，切实保障城乡适龄儿童享受公平、高质的学前教育。 未来，“与你共飞翔”公益计划还将陆续走进安徽、湖南等地，为当地学前教育提供支持与助力，惠及更多儿童及家庭，为促进中国少年儿童健康成长贡献更多力量。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="communityWelfareHonorsAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="
                  formData.communityWelfareHonorsAttachmentFileList
                "
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  handleUploadSuccess(
                    'communityWelfareHonorsAttachmentFileList'
                  )
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
      <!-- 乡村振兴 -->
      <el-collapse-item title="乡村振兴" name="rural-revitalization">
        <template #title>
          <div class="collapse-title">
            <span
              >乡村振兴
              <EsgTooltip content="GRI 203、交易所可持续发展报告指引" />
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
          <el-form
            :model="formData"
            label-position="left"
            :label-width="FORM_LABEL_WIDTH"
            :disabled="!isEdit"
          >
            <el-form-item label="目标、方针及承诺；战略">
              <template #label>
                <div>
                  <span>目标、方针及承诺；战略</span>
                  <EsgTooltip
                    content="描述公司在助力乡村振兴方面的理念、目标、短期和长期计划等；结合业务开展情况披露公司将支持乡村振兴、巩固拓展脱贫攻坚成果融入公司战略的具体情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.ruralRevitalizationStrategy"
                type="textarea"
                :rows="4"
                placeholder="【提示】“与你共飞翔”公益计划于2022年启动，通过爱心捐赠与教师培训帮扶，旨在通过向学前儿童提供科学健康的营养补给及先进的教学体系培养，助力国家学前教育高质量发展。 2023年，双汇“与你共飞翔”公益计划走进陕西汉中、山东莱芜、贵州威宁等地，向当地数十家幼儿园定向捐赠双汇儿童产品智趣多鳕鱼肠及儿童性格涵养教学体系，以全力推进学 前教育优质、均衡发展，切实保障城乡适龄儿童享受公平、高质的学前教育。 未来，“与你共飞翔”公益计划还将陆续走进安徽、湖南等地，为当地学前教育提供支持与助力，惠及更多儿童及家庭，为促进中国少年儿童健康成长贡献更多力量。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="政策">
              <template #label>
                <div>
                  <span>政策</span>
                  <EsgTooltip
                    content="描述公司在助力乡村振兴方面的政策、制度。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.ruralRevitalizationPolicy"
                type="textarea"
                :rows="4"
                placeholder="【提示】中粮糖业充分发挥农业产业化龙头企业的带头作用，深入推进“种植规划+种子研发+田间管理+农机服务+数智农业” 的“五位一体”现代农业管理体系，推广智慧农业，引领产业发展，将便捷、科学的农业服务推广至千家万户，稳步 推进农业现代化转型发展。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="实践">
              <template #label>
                <div>
                  <span>实践</span>
                  <EsgTooltip
                    content="描述公司开展乡村振兴工作的具体举措与实践情况；结合在乡村和脱贫地区业务开展情况，披露支持乡村特色产业发展、支持当地就业等方面采取的具体措施，以及其他支持乡村振兴工作的具体措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.ruralRevitalizationPractice"
                type="textarea"
                :rows="4"
                placeholder="【提示】中粮糖业在全国建立了 1186 个各类农业合作社，带动 10.2 万户农民就业，为农业产业高质量发展不断注入新动能。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="ruralRevitalizationAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="
                  formData.ruralRevitalizationAttachmentFileList
                "
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  handleUploadSuccess('ruralRevitalizationAttachmentFileList')
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
            <el-form-item>
              <template #label>
                <div>
                  <span>乡村振兴总投入</span>
                  <EsgTooltip content="报告期内公司乡村振兴总投入金额。" />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.ruralRevitalizationInvestment"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.ruralRevitalizationInvestment"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>购买帮扶地区农产品总金额</span>
                  <EsgTooltip content="报告期内购买帮扶地区农副产品投入" />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.agriculturalProductPurchaseAmount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.agriculturalProductPurchaseAmount"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>帮扶产品开发数量</span>
                  <EsgTooltip
                    content="报告期内协助帮扶地区开发特色产品数量。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.supportProductDevelopmentCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.supportProductDevelopmentCount"
                  type="textarea"
                  :rows="2"
                />
                <span>种</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>创造就业岗位数量</span>
                  <EsgTooltip
                    content="在帮扶地区开发项目创造就业岗位的数量。如投资当地特色产业而创造的就业岗位；乡村振兴惠及群体范围及数量"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.jobCreationCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />  -->
                <el-input
                  v-model="formData.jobCreationCount"
                  type="textarea"
                  :rows="2"
                />
                <span>人次</span>
              </div>
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
import { onlyPositiveInteger, onlyPositiveNumber } from "../utils";
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
  // 社会公益
  socialWelfareInvestment: "", // 社会公益投入金额
  socialContributionPerShare: "", // 每股社会贡献值

  // 社区公益-目标与理念
  communityWelfareStrategy: "", // 战略与目标
  communityWelfareSystem: "", // 体系及策略

  // 社区公益-打造品牌公益项目
  brandCharityProjects: "", // 打造品牌公益项目

  // 社区公益与志愿活动实践
  communityVolunteerActivities: "", // 社区公益与志愿活动实践
  volunteerTotalParticipants: "", // 员工参与公益志愿活动总人数
  volunteerAverageHours: "", // 员工公益志愿活动人均时长

  // 社区公益所获荣誉
  communityWelfareHonors: "", // 社区公益所获荣誉

  // 乡村振兴
  ruralRevitalizationStrategy: "", // 目标、方针及承诺；战略
  ruralRevitalizationPolicy: "", // 政策
  ruralRevitalizationPractice: "", // 实践
  ruralRevitalizationInvestment: "", // 乡村振兴总投入
  agriculturalProductPurchaseAmount: "", // 购买帮扶地区农产品总金额
  supportProductDevelopmentCount: "", // 帮扶产品开发数量
  jobCreationCount: "", // 创造就业岗位数量

  // 附件上传
  publicityTrainingAttachmentFileList: [], // 附件上传 (宣传与培训)
  brandCharityProjectsAttachmentFileList: [], // 附件上传 (品牌公益项目)
  communityWelfareHonorsAttachmentFileList: [], // 附件上传 (社区公益所获荣誉)
  ruralRevitalizationAttachmentFileList: [] // 附件上传 (乡村振兴)
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
watch(() => props.isEdit, loadData);

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
  "community-welfare"
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
