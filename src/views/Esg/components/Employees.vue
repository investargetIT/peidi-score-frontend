<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="员工组成" name="employee-composition">
        <template #title>
          <div class="collapse-title">
            <span
              >员工组成
              <EsgTooltip
                content="对应GRI标准: GRI 2-7, GRI 2-8, GRI 405<br/>
对应MSCI ESG指标: 劳工管理<br/>
对应港交所ESG指引: B1.1, B1.2<br/>
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 年末长期员工总数 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.permanentEmployeeCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 年末临时员工总数 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.temporaryEmployeeCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 年末全职员工总数 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.fullTimeEmployeeCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 年末兼职员工总数 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.partTimeEmployeeCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="按民族划分的员工数量及比例">
              <template #label>
                <div>
                  <span> 按民族划分的员工数量及比例 </span>
                  <EsgTooltip
                    content="按民族划分的员工雇佣情况，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeByEthnicity"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="按职级划分的员工数量及比例">
              <template #label>
                <div>
                  <span> 按职级划分的员工数量及比例 </span>
                  <EsgTooltip
                    content="按职级划分的员工雇佣情况，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeByPosition"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="按用工模式划分的员工数量及比例">
              <template #label>
                <div>
                  <span> 按用工模式划分的员工数量及比例 </span>
                  <EsgTooltip
                    content="按正式员工、劳务派遣、实习等用工模式划分的员工数量及比例，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeByEmploymentType"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="科研人才结构">
              <template #label>
                <div>
                  <span> 科研人才结构 </span>
                  <EsgTooltip
                    content="公司科研/研发人才数量及占比、培养机制等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.researchTalentStructure"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="按民族划分的新员工组数和比例">
              <template #label>
                <div>
                  <span> 按民族划分的新员工组数和比例 </span>
                  <EsgTooltip
                    content="按民族划分的新员工入职情况，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.newEmployeeByEthnicity"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="按年龄组别划分的新员工总数和比例">
              <template #label>
                <div>
                  <span> 按年龄组别划分的新员工总数和比例 </span>
                  <EsgTooltip
                    content="可使用的年龄组别：30 岁以下、30-50 岁、50 岁以上。或按公司自身情况进行划分，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.newEmployeeByAgeGroup"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="按性别划分的新员工总数和比例">
              <template #label>
                <div>
                  <span> 按性别划分的新员工总数和比例 </span>
                  <EsgTooltip
                    content="按男、女性别划分的新员工入职情况，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.newEmployeeByGender"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="按地区划分的新员工总数和比例">
              <template #label>
                <div>
                  <span> 按地区划分的新员工总数和比例 </span>
                  <EsgTooltip
                    content="按国籍或中国地区（如华东、华北、华南、华西）划分的新员工入职情况，口径与年报保持一致。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.newEmployeeByRegion"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="员工招聘" name="employee-recruitment">
        <template #title>
          <div class="collapse-title">
            <span
              >员工招聘
              <EsgTooltip content="交易所可持续发展报告指引" />
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
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 校园招聘的新员工数量 </span>
                  <EsgTooltip content="报告期内公司校园招聘的员工数量" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.campusRecruitmentCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span> 社会招聘的新员工数量 </span>
                  <EsgTooltip content="报告期内公司社会招聘的员工数量" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.socialRecruitmentCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="岗位情况">
              <template #label>
                <div>
                  <span> 岗位情况 </span>
                  <EsgTooltip
                    content="报告期内吸纳就业、创造灵活就业岗位的情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.jobPositionInfo"
                type="textarea"
                :rows="6"
                placeholder="在校园招聘方面，双汇发展积极推进校企合作，推行管理培训生计划，给予优秀在校学生实习机会，并为表现突出者提供留用机会。我们依据《大学生引进培养管理制度》对校园招聘的薪酬待遇、培养措施、培养周期等内容进行系统性的规范和优化，以确保招聘流程的公正、公平和透明。我们开展'领英汇'和'群英汇'校园招聘项目，通过'领英汇'项目面向国内外高校的优秀 应届毕业生招收项目管培生，通过'群英汇'项目招收本科及以上的管培学员。 校企合作 •我们与58家高校签订校企合作协议，稳定重点渠道人才输送，增设与大学生面对面交流 的机会，稳步搭建高校人才蓄水池。 本地招聘 •立足本地发展，我们携手专业招聘机构，与河南省内招聘机构合作开展专业化的大学生 校招工作，全面提升校园招聘的效率和水平。 线上招聘 •我们与多个国内知名招聘服务机构合作，为大学生人才招聘打造专属互联网平台。  在社会招聘方面，双汇发展积极通过当地劳动局或人才市场开展本土化招聘，并通过扩大内部推荐和举办专项招聘等形式不断助力公司丰富人才储备。 ——《双汇发展2023ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item title="员工流动率" name="employee-turnover">
        <template #title>
          <div class="collapse-title">
            <span
              >员工流动率
              <EsgTooltip content="GRI 401" />
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item
              label="按年龄组别划分的离职员工总数和流动率"
              style="margin-bottom: 35px"
            >
              <template #label>
                <div>
                  <span>按年龄组别划分的离职员工总数和流动率</span>
                  <EsgTooltip
                    content="描述公司为提高供应商 ESG 可使用的年龄组别：30 岁以下、30-50 岁、50 岁以上，或按公司自身情况进行划分，口径与年报保持一致。 员工离职率计算方法：年度员工流失率=年度离职人员总数/(年初员工总数+年度入职总数)，或年度员工流失率=年度离职人员总数/[ (年初员工总数+年末员工总数) /2]。"
                  />
                </div>
              </template>
              <!-- <div class="textContainer">
                <div class="textAlignStyle">
                  <span>离职员工总数</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.turnoverCountByAgeGroup"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>人</span>
                </div>
                <div class="textAlignStyle">
                  <span>流动率</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.turnoverCountByAgeGroupResolution"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>%</span>
                </div>
              </div> -->
              <el-input
                v-model="formData.turnoverCountByAgeGroupTextarea"
                type="textarea"
                :rows="6"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>按性别划分的离职员工总数和流动率</span>
                  <EsgTooltip
                    content="按男、女性别划分的员工离职情况，口径与年报保持一致。 员工离职率计算方法：年度员工流失率=年度离职人员总数/(年初员工总数+年度入职总数)，或年度员工流失率=年度离职人员总数/[ (年初员工总数+年末员工总数) /2]。"
                  />
                </div>
              </template>
              <!-- <div class="textContainer">
                <div class="textAlignStyle">
                  <span>离职员工总数</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.turnoverCountByGender"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>人</span>
                </div>
                <div class="textAlignStyle">
                  <span>流动率</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.turnoverCountByGenderResolution"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>%</span>
                </div>
              </div> -->
              <el-input
                v-model="formData.turnoverCountByGenderTextarea"
                type="textarea"
                :rows="6"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>按地区划分的离职员工总数和流动率</span>
                  <EsgTooltip
                    content="按国籍或中国地区（如华东、华北、华南、华西）划分的员工离职情况，口径与年报保持一致。 员工离职率计算方法：年度员工流失率=年度离职人员总数/(年初员工总数+年度入职总数)，或年度员工流失率=年度离职人员总数/[ (年初员工总数+年末员工总数) /2]。"
                  />
                </div>
              </template>
              <!-- <div class="textContainer">
                <div class="textAlignStyle">
                  <span>离职员工总数</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.turnoverCountByRegion"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>人</span>
                </div>
                <div class="textAlignStyle">
                  <span>流动率</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.turnoverCountByRegionResolution"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>%</span>
                </div>
              </div> -->
              <el-input
                v-model="formData.turnoverCountByRegionTextarea"
                type="textarea"
                :rows="6"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="荣誉或认可" name="honors-recognition">
        <template #title>
          <div class="collapse-title">
            <span>荣誉或认可 </span>
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
            <el-form-item label="雇主品牌荣誉">
              <template #label>
                <div>
                  <span> 雇主品牌荣誉 </span>
                  <EsgTooltip
                    content="公司因雇主品牌经营良好而获得的荣誉或肯定"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.esgReviewAssessment"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="本年度，本集团在国内中高端人才职业发展知 名平台「猎聘」主办的2023年度「客户成功奖」 评选活动中，凭借本集团多元化人才沟通桥梁、重视人才互动与求职体验，人才吸引指数及增长率，团队招聘行为数据等评审维度，从 数百家活跃企业中脱颖而出，荣获猎聘华北区「社会责任奖」殊荣。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="honorCertificateAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.honorCertificateAttachments"
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

      <el-collapse-item title="基本权益保障" name="basic-rights-protection">
        <template #title>
          <div class="collapse-title">
            <span
              >基本权益保障
              <EsgTooltip
                content="GRI 40, GRI 409, GRI 410<br/>
交易所可持续发展报告指引<br/>
Wind评级"
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
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="平等、多元的合规雇佣政策">
              <template #label>
                <div>
                  <span> 平等、多元的合规雇佣政策 </span>
                  <EsgTooltip
                    content="描述公司招聘与用人的价值理念，说明公司招聘与用人过程中遵守的法律法规、原则，强调公司在雇佣方面的平等性。多元性。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.fairEmploymentPolicy"
                type="textarea"
                :rows="4"
                placeholder="双汇发展坚持公平、多元、包容的理念，实行男女同工同酬，确保在雇佣环节不存在任何因种族、肤色、宗教、民族、性别、年龄、残疾等原因所导致的歧视行为。本公司坚定践行多元化雇佣政策，积极为包括退役军人、残疾人和女性员工在内的潜在候选人提供全方位的支持与关怀。
 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="员工手册与制度">
              <template #label>
                <div>
                  <span> 员工手册与制度 </span>
                  <EsgTooltip content="公司员工守则、招聘管理制度等文件。" />
                </div>
              </template>
              <el-input
                v-model="formData.employeeHandbookDescription"
                type="textarea"
                :rows="4"
                placeholder="双汇发展严格遵守《中华人民共和国劳动法》《中华人民共和国劳动合同法》等国家法律法规的要求，遵循国际劳工组织的核心公约和劳工标准，并积极发挥职工代表大会的作用，使所有员工的合法权益得到充分保障和尊重。 双汇发展坚持'公平、公正、公开'的雇佣原则，制定了《人力资源管理标准化》等规章制度，合法合规雇佣，广泛吸引人才。
 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="反童工及强制劳动管理体系与制度">
              <template #label>
                <div>
                  <span> 反童工及强制劳动管理体系与制度 </span>
                  <EsgTooltip
                    content="收集并披露有关禁止雇佣童工或强制劳动的政策及相关管理办法，列举发现雇佣童工及强制劳工事件的处理政策及管理办法。 童工：中华人民共和国境内年龄小于 16 的未成年人被视为童工，境外业务以当地劳动法为准。 强迫劳动包括: 限制员工人身自由、扣押身份证件、要求强制押金、以解聘相威胁，强迫工人进行非自愿的劳动等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiChildLaborPolicy"
                type="textarea"
                :rows="4"
                placeholder="我们明确禁止任何雇佣童工及强制劳动行为，为确保本公司聘用的员工均达到法定年龄，我们在雇佣环节开展入职身份证件查验和信息化系统登记等工作，保障员工及潜在候选人知悉公司相关规定，一旦发生违规事件，以零容忍态度严肃处理。报告期内，公司未发生任何违反与雇佣童工和强迫劳动法律法规相关的事件。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="非法用工违规事件披露">
              <template #label>
                <div>
                  <span> 非法用工违规事件披露 </span>
                  <EsgTooltip
                    content="劳工纠纷；非法用工事件包括但不仅限于强制工作、使用童工等违反劳动法律法规的行为。公司应对其发生次数进行披露。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.illegalEmploymentDisclosure"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="员工工资与社保">
              <template #label>
                <div>
                  <span> 员工工资与社保 </span>
                  <EsgTooltip
                    content="公司支付员工工资与缴纳员工社保的情况，统计员工社保缴纳百分比。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeSalarySocialSecurity"
                type="textarea"
                :rows="4"
                placeholder="同时，公司建立健全综合福利保障体系，为员工提供补充医疗保险和意外保险，不断提高员工重特大疾病保障水平。社会保险覆盖率100%，员工平均带薪年休假12天。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="工作时间与休假方式">
              <template #label>
                <div>
                  <span> 工作时间与休假方式 </span>
                  <EsgTooltip
                    content="公司关于员工工作时间、加班及休假的规定性描述。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.workingHoursLeavePolicy"
                type="textarea"
                :rows="4"
                placeholder="在依法签订劳动合同、缴纳五险一金的基础上，我们积极维护员工的休息休假权利，并确保病假、产休假、陪产看护、哺乳期关怀等各项福利措施得到有效执行。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="安保人员人权培训">
              <template #label>
                <div>
                  <span> 安保人员人权培训 </span>
                  <EsgTooltip
                    content="为确保安保人员行为适当，公司对安保人员开展人权培训的情况，以及接受人权培训的安保人员百分比。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.securityHumanRightsTraining"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="employeeHandbookAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.employeeHandbookAttachments"
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
            <el-form-item label="第三方审核与认证">
              <template #label>
                <div>
                  <span> 第三方审核与认证 </span>
                  <EsgTooltip
                    content="公司对生产基地、办公区域员工及人员权益和人权保障情况展开的外部审计。劳工权益导向的社会责任审核包括但不仅限于BSCI、SAI SA8000等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.thirdPartyAudit"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="thirdPartyAuditAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.thirdPartyAuditAttachments"
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
      <el-collapse-item title="薪酬与激励" name="compensation-incentives">
        <template #title>
          <div class="collapse-title">
            <span>
              薪酬与激励
              <EsgTooltip content="GRI 202, GRI 405<br/>Wind评级" />
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="薪酬与激励政策">
              <template #label>
                <div>
                  <span> 薪酬与激励政策 </span>
                  <EsgTooltip
                    content="为规范公司各部门、各岗位员工薪资标准及计算、发放管理，增强激励和考核功能，充分发挥薪酬体系的激励作用，根据公司的实际情况结合管理需要，制定的薪酬与激励政策。该指标也关注公司特色的薪酬或激励机制，具体信息参见右侧案例。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.compensationIncentivePolicy"
                type="textarea"
                :rows="4"
                placeholder="本公司制定了《员工薪酬管理规定》，使薪酬标准对内具有公平性、对外具有竞争性，充分调动员工的工作热情。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="薪酬与激励措施">
              <template #label>
                <div>
                  <span> 薪酬与激励措施 </span>
                  <EsgTooltip
                    content="公司薪酬与激励政策中的主要措施及其分类，如短期激励与长期激励、固定薪酬与可变薪酬等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.compensationIncentiveMeasures"
                type="textarea"
                :rows="4"
                placeholder="业务、研发岗位员工薪酬奖励机制 报告期内，为助力'十四五'规划的顺利落实，我们针对业务、研发岗位的员工实施奖励机制， 并对收入提取办法进一步优化，按阶梯式提取标准确定部门总收入，以'多销多得'的方式增加员工收入，进一步激励他们发挥更高的工作热情，坚持与员工共创、共享、共赢。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="绩效反馈与申诉情况">
              <template #label>
                <div>
                  <span> 绩效反馈与申诉情况 </span>
                  <EsgTooltip
                    content="公司处理员工绩效反馈与申诉的渠道、流程机制、制度文件等，以及报告期内公司处理绩效反馈与申诉的数量、完成率。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.performanceFeedbackAppeal"
                type="textarea"
                :rows="4"
                placeholder="当员工认为个人权益受到侵害，或对公司的经营管理 措施有不同意见时，可选择适当的申诉渠道向公司申 诉，并由公司相应人员接待记录并处理。申诉首先应 本着逐级反映的原则在本部门内进行反映，在本部门 反映未果的情况下可以通过工会组织、人力资源部、 安保信访等部门向公司申诉。 申诉方式可选用面谈或书面两种形式;如选用书面方式，申诉书须具实名，否则不予受理。 公司在接到员工申诉后，应认真负责、及时公正地对申 诉事件涉及的相关人事进行调查，根据调查结果尽快 作出处理决定。处理决定将 通过书面、电子邮件、电话或当面反馈的形式通报给申诉者。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="男女员工薪酬比例">
              <template #label>
                <div>
                  <span> 男女员工薪酬比例 </span>
                  <EsgTooltip
                    content="公司各员工类别的男女员工基本薪酬的比例"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.genderSalaryRatio"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="起薪水平与当地最低工资之比">
              <template #label>
                <div>
                  <span> 起薪水平与当地最低工资之比 </span>
                  <EsgTooltip
                    content="公司起薪水平工资与当地最低工资的相关比率，并按性别区分"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.startingSalaryVsLocalMinimum"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="股权激励与员工持股">
              <template #label>
                <div>
                  <span> 股权激励与员工持股 </span>
                  <EsgTooltip
                    content="公司本年度员工持股计划的具体数据和参与度统计"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.equityIncentive"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="薪酬与激励投入">
              <template #label>
                <div>
                  <span> 薪酬与激励投入 </span>
                  <EsgTooltip
                    content="列举公司全年支付员工的各项薪酬与激励价值，及其总和。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.compensationIncentiveInvestment"
                type="textarea"
                :rows="4"
                placeholder="本公司制定了《员工薪酬管理规定》，使薪酬标准对内具有公平性、对外具有竞争性，充分调动员工的工作热情。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="福利与关怀" name="welfare-care">
        <template #title>
          <div class="collapse-title">
            <span
              >福利与关怀
              <EsgTooltip content="GRI 201, GRI 401" />
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="福利与关怀政策">
              <template #label>
                <div>
                  <span> 福利与关怀政策 </span>
                  <EsgTooltip
                    content="汇总公司全体系有关员工福利与关怀的相关政策及其更新情况，政策信息包括：公司员工福利与关怀战略，员工福利政策、对员工关怀活动的制定计划，如主题，活动展开日期，活动需要达到的效果等内容。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.welfareCarePolicy"
                type="textarea"
                :rows="4"
                placeholder="旺旺坚信员工是企业发展的重要基石。报告期内，我们持续修订了11个内部招聘流程，着力优化编制及薪资内容。我 们开展人资组织优化，调整集团分公司人 资团队结构， 提升共享人力资源服务覆 盖比，打造有温度、有责任的僱主品牌形 象。报告期内，旺旺已提升共享人力资源 服务比至1:550。旺旺坚持「以人为本」的发展策略， 为员工创造幸福有爱的工作环境，培养忠 于旺旺事业、志同道合的员工队伍。我们建立了完善的员工福利体系，包括年节福 利、常规福利和其他福利等，从健康、经 济、家庭与个人、工作生活平衡等多方面 提供保障，激励员工实现长足发展。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="福利措施与关怀活动">
              <template #label>
                <div>
                  <span> 福利措施与关怀活动 </span>
                  <EsgTooltip
                    content="福利措施包括但不仅限于：保险、保健医疗（如体检）、心理支持与疏导（EAP）、育儿假、退休金、办公区域或楼宇设施等。公司设置的关怀与福利，应考虑到员工工作的实际环境，具体实践详见右侧。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.welfareCareActivity"
                type="textarea"
                :rows="4"
                placeholder="双汇发展关心员工生活，组织各种暖心活动以提升员工在双汇工作的满意度。我们持续多年开展'夏送清凉'活动，为酷暑中坚守一线作业的员工送去防暑降温用品。报告期内，我们已对总部、异地61家单位11,948名高温岗位人员，发放降温物品34.7 万元。我们还持续关注困难员工的生活情况，帮助他们度过生活上的难关。此外，我们关心员工子女的教育情况，鼓励员工子女均接受高等教育，已连续13年为12,378名考取大学的职工子女设立'金秋奖学金'，累计发放 3,200万元，助力他们梦想启航。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="welfareCareAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.welfareCareAttachments"
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
            <el-form-item label="育儿假">
              <template #label>
                <div>
                  <span> 育儿假 </span>
                  <EsgTooltip
                    content="公司应披露以下信息： 1.按性别划分，有权享受育儿假的员工总数。 2.按性别划分，休育儿假的员工总数。 3.按性别划分，育儿假结束后在报告期内返岗的员工总数。 4.按性别划分，在育儿假结束后返岗且 12 个月后仍在职的员工总数。 5.按性别划分，休育儿假的员工的返岗率和留任率。 返岗率=（育儿假结束后返岗的员工总数/育儿假结束后应返岗的员工总数）× 100 留任率=（育儿假返岗后 12 个月仍在职的员工总数/报告期内育儿假结束后返岗的员工总数）× 100"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.parentalLeaveWelfareDescription"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="员工活动">
              <template #label>
                <div>
                  <span> 员工活动 </span>
                  <EsgTooltip
                    content="为提升员工幸福感和对企业认同感而开展的员工活动的举办情况，如举办次数等。亮点活动应提供图文案例。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.welfareCareEmployeeEvent"
                type="textarea"
                :rows="4"
                placeholder="公司开展形式多样的文体活动，组织参加集团职工线上健步走活动、职工篮球足球赛和急救培训活动等，进一步丰富员工精神文化生活，帮助员工平衡生活与工作。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="employeeEventAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.employeeEventAttachments"
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
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>
                    福利与关怀支出
                    <EsgTooltip
                      content="公司每年用于员工福利及关怀措施的投入价值总和"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.welfareCareExpenditurePolicy"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>万元</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="管理体系" name="management-system">
        <template #title>
          <div class="collapse-title">
            <span
              >管理体系
              <EsgTooltip
                content="GRI 406<br/>
Wind评级"
            /></span>
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
            <el-form-item label="多元与包容管理政策">
              <template #label>
                <div>
                  <span> 多元与包容管理政策 </span>
                  <EsgTooltip
                    content="公司为保证聘用与工作环境中的包容性和多元性而制定的政策和指引性文件"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.diversityInclusionPolicy"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="旺旺坚持以人为本，以《联合国世界人权宣言(Universal Declaration of Human Rights, UDHR)》等国际人权公约和劳工标准为指引，坚持男女同工同酬， 严格杜绝在招聘、薪酬、福利、晋升等 过程中发生任何因性别、年龄、民族、宗教、伤残等因素导致的歧视行为。 集团提倡多元与包容，贯彻机会均等的标准与方针，确保每位员工得到公平公正的对待与尊重，为员工打造安心、尊重、多元的工作环境。同时，我们尊重和保障员工知情权、参与权、表达权和监督 权，建立了举报处理机制，通过电话专线 及邮箱、微信企业号、微信公众号、官网 等方式畅通申诉渠道，受理包含职场歧视、骚扰、强迫劳动、工作不作为等多类问题，切实保障员工合法权益。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="歧视事件及应对机制">
              <template #label>
                <div>
                  <span> 歧视事件及应对机制 </span>
                  <EsgTooltip
                    content="报告期内发生的歧视事件总数、具体情况、以及公司采取的应对措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.discriminationResponseMechanism"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="报告期内，旺旺未发生任何歧视或骚扰相关的投诉事件。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="女性员工" name="female-employees">
        <template #title>
          <div class="collapse-title">
            <span>女性员工 <EsgTooltip content="GRI 404, GRI 405" /></span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>女性管理人员比例</span>
                  <EsgTooltip content="公司女性管理人员占管理人员总数的比例" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.femaleManagerRatio"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>女性职业赋能及领导力培训的员工占比</span>
                  <EsgTooltip
                    content="参与公司女性职业赋能或领导力培养计划的女性员工占比"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.femaleEmpowermentTrainingRatio"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>女性职业赋能及领导力培训的总培训时长</span>
                  <EsgTooltip
                    content="公司女性职业赋能或领导力培养计划的开展总时长"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.femaleEmpowermentTrainingHours"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item label="女性设施与培训课程">
              <template #label>
                <div>
                  <span> 女性设施与培训课程 </span>
                  <EsgTooltip
                    content="公司为保障母婴健康和女性健康而建设的设施与开设的课程。公司应定期以图片的形式保留母婴和育儿设施的建设情况以及课程的开设情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.femaleFacilitiesAndCourses"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="我们致力于保障女性员工的劳动权益，制定并发布了《女工劳动保护规定》，明确规定尊重女性工作的权利，并在各级管理职位中对能力突出、表现优异的女性进行优先培养及录用。 •三期(孕期、产期、哺乳期)女工工作安排避免重体力劳动 为孕期、哺乳期女职工提供爱心母婴室，双汇总部大楼爱心母婴室荣获漯河市'五星级爱心母婴室'。同时，我们在三八妇女节发放关爱物资，合计发放慰问品16,060份，金额 89.7万元。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="femaleFacilitiesAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.femaleFacilitiesAttachments"
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
      <el-collapse-item title="残障人士雇佣" name="disabled-employment">
        <template #title>
          <div class="collapse-title">
            <span
              >残障人士雇佣
              <EsgTooltip content="GRI 405" />
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
            <el-form-item>
              <template #label>
                <div>
                  <span>残障人士雇佣总数</span>
                  <EsgTooltip content="公司每年残障人士雇佣数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.disabledEmployeeCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>残障人士雇佣比例</span>
                  <EsgTooltip content="残障员工占总员工的比例" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.disabledEmployeeRatio"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item label="无障碍设施的设置">
              <template #label>
                <div>
                  <span> 无障碍设施的设置 </span>
                  <EsgTooltip
                    content="职场中为方便残障人士而设置的无障碍设施，如坡道、直梯、盲文标识、无障碍扶手等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.accessibilityFacilityDescription"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="accessibilityFacilityAttachments"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.accessibilityFacilityAttachments"
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
      <el-collapse-item title="培训" name="training">
        <template #title>
          <div class="collapse-title">
            <span
              >培训
              <EsgTooltip content="GRI 405" />
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
            <el-form-item label="反骚扰、反歧视培训">
              <template #label>
                <div>
                  <span> 反骚扰、反歧视培训 </span>
                  <EsgTooltip
                    content="说明反骚扰、反歧视培训的目的、开展方式，并收集最佳图文案例。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiHarassmentTrainingDescription"
                type="textarea"
                :rows="4"
                placeholder="集团内，P.A.C.E.项目的持续推进效果显著，我们不断深化项目，从赋能女性员工转而提倡两性融合，开放男性员工加入培训中，促进包容与公平的环境。项目推行至今，已有教练级讲师3位，优秀讲师181位，从试点运行截止2022年12月31日已有 5,224位员工受惠(其中女性占5,004位，男性220位)，活动覆盖20家工厂。根据2022财年年度评价，主管对员工的满意度训 前为70.1%，训后为81.1%;受训员工幸福度从92.9%提升至97.5%。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="antiHarassmentTrainingAttachments"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.antiHarassmentTrainingAttachments"
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
            <el-form-item>
              <template #label>
                <div>
                  <span>反骚扰、反歧视培训开展次数</span>
                  <EsgTooltip
                    content="公司所有员工均应接受反骚扰、反歧视培训，培训内容包括但不仅限于对骚扰行为与歧视行为的识别、案例解析等。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiHarassmentTrainingCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>反骚扰、反歧视培训覆盖率</span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiHarassmentTrainingCoverageRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="员工培训与考核"
        name="employee-training-assessment"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >员工培训与考核
              <EsgTooltip
                content="GRI 404<br/>
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item label="人才培养理念与目标">
              <template #label>
                <div>
                  <span> 人才培养理念与目标 </span>
                  <EsgTooltip
                    content="公司依据自身文化、定位和人才需求设置的人才培养目标和理念。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.talentDevelopmentConcept"
                type="textarea"
                :rows="4"
                placeholder="本集团以向全体员工提供理想之终身职业为己任，重视员工个人技能提升和职业发展，秉承 「诚信、谦和、前瞻」的企业文化理念，构建完 善的学习发展体系。本集团涉足多领域专业，并基于各事业群为单位进行项目制培训。本集团还根据各事业群发展需求、员工岗位和职级，以及员工个人培训意愿，设计有针对性的 培训课程并开展对应的培训计划，持续提升员工的管理及专业技巧和晋陞机会。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="人才培养体系与项目">
              <template #label>
                <div>
                  <span> 人才培养体系与项目 </span>
                  <EsgTooltip
                    content="公司已建立的人才培养体系和对应的具体项目"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.talentDevelopmentSystem"
                type="textarea"
                :rows="4"
                placeholder="我们建立了三级培训体系，为不同职业发展需求的员工打造定制化的培养计划，将人才培养与梯队建设并举，为每一位员工提供全职业周期的培训资源。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="talentDevelopmentAttachments">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.talentDevelopmentAttachments"
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
            <el-form-item label="人才培养项目类别划分">
              <template #label>
                <div>
                  <span> 人才培养项目类别划分 </span>
                  <EsgTooltip
                    content="公司各类人才培养项目的开展形式及项目类别的划分，项目类别的划分可使用百分比形式展示。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.talentDevelopmentCategory"
                type="textarea"
                :rows="4"
                placeholder="公司以'34885'教育培训体系为抓手，采用名师课堂、团队学习、外部对标、线上学习、实践锻炼等多种方式开展广泛而精准的人才培育，打造学习型组织，帮助员工实现与公司的共同发展。同时，持续推进网络学习平台建设。截至 2023 年末，平台账号共激活 6977 个，开设课程共计 1496 门，其中内部课程占比 58%，外部课程占比 42%，覆盖政治、 党建、战略、市场、销售、供应链、生产、安全、财务等 12 大类，以丰富的学习资源满足广大经理人和员工学习发展需要。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="人才培养管理组织架构">
              <template #label>
                <div>
                  <span> 人才培养管理组织架构 </span>
                  <EsgTooltip
                    content="公司为保证人才培养体系顺利运行而搭建的管理组织架构，请介绍组织架构各层级的管理职责。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.talentDevelopmentOrganization"
                type="textarea"
                :rows="4"
                placeholder="双汇发展为加强人才梯队建设，推动企业转型升级，积极完善培训体系、丰富培训内容。我们遵照《项目公司新入职员工三级培训管理规定》《内训师制度》《'领英汇'管培生培养实施方案》《培训管理制度》等内部培训制度，于2023年编制了《数字化学习平台课程管理规范》， 结合数字化学习平台的推广运用情况，提升线上培训课程使用频率，提升全方位培训能力。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>全年培训总场次</span>
                  <EsgTooltip content="公司年度开展培训的总次数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.annualTrainingSessionCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>年度培训支出金额</span>
                  <EsgTooltip content="公司年度培训支出的总金额" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.annualTrainingExpenditureAmount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>按性别分类的员工平均培训小时数</span>
                  <EsgTooltip
                    content="每名女性的平均培训小时数=提供给女性员工的培训总小时数/女性员工总数 每名男性的平均培训小时数=提供给男性员工的培训总小时数/男性员工总数"
                  />
                </div>
              </template>
              <!-- <div class="textContainer">
                <el-input
                  v-model="formData.avgTrainingHoursByGender"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>小时</span>
              </div> -->
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>女性</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.avgTrainingHoursByGenderFemale"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>小时</span>
                </div>
                <div class="textAlignStyle">
                  <span>男性</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.avgTrainingHoursByGenderMale"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>小时</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>中层管理人员平均培训小时数</span>
                  <EsgTooltip
                    content="每个员工类别的平均培训小时数=提供给每个员工类别的培训总小时数/该类别的员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.avgTrainingHoursByMiddleManager"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>高级管理人员/决策层平均培训小时数</span>
                  <EsgTooltip
                    content="每个员工类别的平均培训小时数=提供给每个员工类别的培训总小时数/该类别的员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.avgTrainingHoursBySeniorManager"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>其他劳务关系人员平均培训小时数</span>
                  <EsgTooltip
                    content="每个员工类别的平均培训小时数=提供给每个员工类别的培训总小时数/该类别的员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.avgTrainingHoursByOther"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>员工培训覆盖率</span>
                  <EsgTooltip
                    content="员工培训覆盖率=受培训的员工数/员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.trainingCoverageRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>按性别分类的员工培训人数百分比</span>
                  <EsgTooltip
                    content="男性员工接受培训比例=接受培训的男性员工数/男性员工总数 女性员工接受培训比例=接受培训的女性员工数/女性员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.trainingRateByGender"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>中层管理人员培训人数百分比</span>
                  <EsgTooltip
                    content="每个员工类别接受培训比例=该类别中受培训的员工数/该类别员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.trainingRateByMiddleManager"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>高级管理人员/决策层人员培训人数百分比</span>
                  <EsgTooltip
                    content="每个员工类别接受培训比例=该类别中受培训的员工数/该类别员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.trainingRateBySeniorManager"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>其他劳务关系人员培训人数百分比</span>
                  <EsgTooltip
                    content="每个员工类别接受培训比例=该类别中受培训的员工数/该类别员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.trainingRateByOther"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>培训考核总体通过率</span>
                  <EsgTooltip
                    content="考核通过率=考核合格的员工/接受考核的员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.overallTrainingPassRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>按性别划分培训考核通过率</span>
                  <EsgTooltip
                    content="男性员工考核通过率=考核合格的男性员工/接受考核的男性员工总数 女性员工考核通过率=考核合格的女性员工/接受考核的女性员工总数"
                  />
                </div>
              </template>
              <!-- <div class="textContainer">
                <el-input
                  v-model="formData.trainingPassRateByGender"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div> -->
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>女性</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.trainingPassRateByGenderFemale"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>小时</span>
                </div>
                <div class="textAlignStyle">
                  <span>男性</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.trainingPassRateByGenderMale"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>小时</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>按职级划分的培训考核通过率</span>
                  <EsgTooltip
                    content="每个职级员工的考核通过率=该职级中考核合格的员工/该职级中接受考核的员工总数"
                  />
                </div>
              </template>
              <!-- <div class="textContainer">
                <el-input
                  v-model="formData.trainingPassRateByPosition"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div> -->
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>中层管理人员</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.trainingPassRateByPositionMiddle"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>%</span>
                </div>
                <div class="textAlignStyle">
                  <span>高级管理人员</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.trainingPassRateByPositionSenior"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>%</span>
                </div>
                <div class="textAlignStyle">
                  <span>其他劳务关系人员</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.trainingPassRateByPositionOther"
                    :formatter="onlyPositiveNumber"
                    :parser="onlyPositiveNumber"
                  />
                  <span>%</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="人才晋升" name="talent-promotion">
        <template #title>
          <div class="collapse-title">
            <span
              >人才晋升
              <EsgTooltip
                content="GRI 404<br/>
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item label="人才晋升理念、政策与路径">
              <template #label>
                <div>
                  <span> 人才晋升理念、政策与路径 </span>
                  <EsgTooltip
                    content="公司制定的晋升政策、已设立的理念以及实现晋升的路径。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.promotionDevelopmentPath"
                type="textarea"
                :rows="6"
                placeholder="双汇发展贯彻'公开竞聘、逐级提名、分层任命'的用人原则，明确晋升标准和晋升路径，实现 人尽其才的选拔机制，促进企业内部人员正常流动和人才梯队建设。本年度，我们修订《人力资源标准化》制度，完善管理人员竞聘原则，明确后备管理人员竞聘为正式管理人员后分别进行任职满3个月和满6个月的考评，着力推动公平竞争的用人氛围。 我们秉承'能者上、平者让、庸者下'的核心理念，引导管理职位员工从事财务、技术、人事、生 产、质量、设备、法务、营销、新电商等领域，通过垂直管理通道，深耕领域技能，进而提升领导力和综合素质。 针对由'领英汇'和'群英汇'招聘项目进入公司的员工，我们制定了全方位的管培生晋升发展路 径，'领英汇'管培生将晋升为业务骨干，并成长至中层管理人员，并以成为公司高层为培养目标;'群英汇'管培学员则由一线员工晋升至班长、调度等基层管理人员，再至车间主任、各系统部长等中层管理人员，培养目标为项目公司、集团或事业部中高层。通过公开、透明的晋升路径，充分发挥员工潜能，并鼓励优秀管培生可以在培养过程中根据部门需求参与竞聘。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="接受定期绩效与职业发展考核的员工占比">
              <template #label>
                <div>
                  <span> 接受定期绩效与职业发展考核的员工占比 </span>
                  <EsgTooltip
                    content="公司定期评估员工绩效及职业发展考核的比例，按性别和员工类别划分。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.regularPerformanceAssessment"
                type="textarea"
                :rows="6"
              />
            </el-form-item>
            <el-form-item label="人才储备与盘点">
              <template #label>
                <div>
                  <span> 人才储备与盘点 </span>
                  <EsgTooltip
                    content="企业应对每一位员工各项能力进行评估后，并建立人才管理库，按技术序列、突出能力等因素进行归类和排序，为未来人才职业需要提供辅助。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.talentReserveInventory"
                type="textarea"
                :rows="6"
                placeholder="本集团会通过系统的人才盘点工作，对该年度员工工作和发展进行综合评价，结合员工的工作经历和能力，提供符合员工个人工 作愿望的发展机会，实现'专业通道'和'管理通道'的双通道晋陞路线。未来，我们会给予员工更多工作轮调、岗位轮岗等机会，知人善任、人尽其才，组织实现人才效能。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="政策与沟通渠道"
        name="policy-communication-channels"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >政策与沟通渠道
              <EsgTooltip content="Wind评级、GRI 407" />
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
            <el-form-item label="员工沟通政策">
              <template #label>
                <div>
                  <span> 员工沟通政策 </span>
                  <EsgTooltip
                    content="公司为保证员工民主权益，鼓励员工就公司发展和运营提出合理化建议而制定的沟通政策。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeCommunicationPolicy"
                type="textarea"
                :rows="4"
                placeholder="双汇发展严格遵循《中华人民共和国工会法》《集体合同规定》及所在地相关法律法规，成立运营地的各级工会组织，与员工开展建设性的对话，双汇发展尊重并充分听取来自员工的意见和反馈，不仅提高员工在公司发展进程中的参与度， 还有效增强团队凝聚力，进一步促进公司发展。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="员工沟通渠道">
              <template #label>
                <div>
                  <span> 员工沟通渠道 </span>
                  <EsgTooltip
                    content="公司为收集员工声音而建立的员工沟通渠道，沟通渠道包括但不仅限于电子邮箱、信箱、电话、专岗办公室等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeCommunicationChannel"
                type="textarea"
                :rows="4"
                placeholder="我们积极搭建包括举报热线、人力资源热线、 员工座谈会、职工代表大会在内的信息反馈渠道，确保员工申诉有途径、权益有保障。2023年， 本公司召开大学生见面会、职工座谈会和年度职工代表大会及时获取并解决员工诉求。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="员工沟通" name="employee-communication">
        <template #title>
          <div class="collapse-title">
            <span
              >员工沟通
              <EsgTooltip
                content="GRI 2-30、GRI 407<br/>
Wind评级"
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item>
              <template #label>
                <div>
                  <span>集体谈判协议覆盖率</span>
                  <EsgTooltip
                    content="签订集体谈判协议的员工比例=已签订集体谈判协议的员工数/员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.collectiveBargainingCoverageRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>职工代表大会召开情况</span>
                  <EsgTooltip content="职工代表大会的内容和年度召开次数" />
                </div>
              </template>
              <el-input
                v-model="formData.employeeRepresentativeMeetingCount"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="员工满意度与敬业度调查">
              <template #label>
                <div>
                  <span> 员工满意度与敬业度调查 </span>
                  <EsgTooltip
                    content="以问卷等形式每年对员工开展的满意度与敬业度调查。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.employeeSatisfactionSurvey"
                type="textarea"
                :rows="4"
                placeholder="集团全力打造幸福工程，提升员工幸福感。旺旺建立了集满意度和幸福度于一 体的员工幸福指数评价体系，作为评估旺旺开展各项关怀员工措施的实际成效诊断 工具。员工幸福指数评价体系每年进行指 标优化调整，综合衡量薪酬福利、工作内 容、工作环境、职业发展等维度，帮助管 理者发现问题、找到员工的共同诉求和期望，激发员工的工作热情和积极性，促进 集团长青发展。 旺旺自2016年在全国各工厂开展员 工幸福指数评估以来，持续循环精进改善 员工反馈问题，为员工提供更加优质的工 作环境和条件。我们建立健全员工福利制 度，加强员工培训和发展，并将员工幸 福指数纳入基地最高主管的关键绩效考核中，工厂员工幸福指数分数2022财年为 88.1分。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>工会会员或员工代表人数</span>
                  <EsgTooltip content="公司工会会员或职工代表的人数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.unionMemberCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>从业人员沟通及建议事件解决率</span>
                  <EsgTooltip content="来自员工沟通渠道反馈意见的解决率" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.employeeCommunicationResolutionRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="职业病" name="occupational-disease">
        <template #title>
          <div class="collapse-title">
            <span>职业病 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>职业病新增病例</span>
                  <EsgTooltip content="公司职业病的新发病个数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.newOccupationalDiseaseCases"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>个</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>职业病发生率</span>
                  <EsgTooltip
                    content="职业病发病率=职业病发病人数/员工总数×100"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.occupationalDiseaseRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>接受职业病体检的人数</span>
                  <EsgTooltip
                    content="报告期内，参加公司组织的职业病体检的总人数。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.occupationalDiseaseExamCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>职业病体检的覆盖率</span>
                  <EsgTooltip
                    content="职业病体检覆盖率=参与职业病体检的人数/应参与职业病体检的人数×100"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.occupationalDiseaseExamCoverageRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="保障措施" name="protection-measures">
        <template #title>
          <div class="collapse-title">
            <span>保障措施 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>接受职业健康监测的人数</span>
                  <EsgTooltip content="接受公司健康监测的员工人数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.occupationalHealthMonitoringCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="心理健康">
              <template #label>
                <div>
                  <span> 心理健康 </span>
                  <EsgTooltip
                    content="心理健康服务包括但不仅限于心理健康讲座、心理咨询、心理测试、心理疏导等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.mentalHealthServiceDescription"
                type="textarea"
                :rows="4"
                placeholder="促进职工心理健康成长一直是工会关注的工作主题，结合提升职工生活品质工作部署，工会积极鼓励 各基层单位根据实际，整合外部专业力量，围绕职业成长、人际交往、婚恋交友、亲子关系、压力缓解、情绪疏导等职工关切主题，以咨询、培训、讲座等方式，开展职工心理帮助计划。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="职业健康培训"
        name="occupational-health-training"
      >
        <template #title>
          <div class="collapse-title">
            <span>职业健康培训 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>职业健康培训累计人次</span>
                  <EsgTooltip content="接受职业健康培训的总人数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.totalOccupationalHealthTraining"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>人次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>人均接受职业健康安全培训次数</span>
                  <EsgTooltip
                    content="人均接受职业健康安全培训次数=职业健康安全培训累计人次/员工总数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.avgHealthSafetyTrainingCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>职业健康安全培训总时长</span>
                  <EsgTooltip content="公司开展职业健康安全培训的时长总和" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.totalHealthSafetyTrainingHours"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>时</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>人均接受职业健康安全培训时长</span>
                  <EsgTooltip content="安全培训总时长/公司总人数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.avgHealthSafetyTrainingHours"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>时</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="伤亡情况" name="casualties">
        <template #title>
          <div class="collapse-title">
            <span>伤亡情况 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>员工伤亡人数</span>
                  <EsgTooltip
                    content="报告期内，公司员工伤亡的总数，口径与年报保持一致。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.employeeCasualtyCount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>因工伤亡率</span>
                  <EsgTooltip content="因工伤亡率=伤亡人数/员工总数×100" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.workRelatedCasualtyRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>因工伤损失工作日数</span>
                  <EsgTooltip content="公司因工伤不在岗日数" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.workInjuryLostWorkdays"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>天</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>百万工时损失工时率</span>
                  <EsgTooltip
                    content="百万工时损失工时率 = 因工伤损失工作时数 ÷ 总工时 ×1000000"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.millionWorkHourLostTimeRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>百万工时损工事故率（LTIR）</span>
                  <EsgTooltip
                    content="百万工时损工事故率 LTIR= 损工事故人数 ÷ 总工时 ×1000000"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.millionWorkHourLTIR"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>百万工时可记录事故率（TRIR）</span>
                  <EsgTooltip
                    content="百万工时可记录事故率 TRIR = 可记录事故伤害人数 ÷ 总工时 ×1000000 "
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.millionWorkHourTRIR"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>因工伤亡而赔偿的金额</span>
                  <EsgTooltip content="公司为工伤员工和工亡员工的赔款总额。 " />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.workInjuryCompensationAmount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>万元</span>
              </div>
            </el-form-item>
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
                v-model="formData.customerPrivacyLeakIncidents"
                type="textarea"
                :rows="4"
                placeholder="数字化技术高速发展的当下，上海梅林高度重视客户信息和隐私保护，公司严格遵守国家及有关部门颁布的《中华人民共和国网络安全法》《个人信息保护法》《数据安全法》《中华人民共和国消费者权益保护法》等隐私保护的相关 规定，打造相应的安全可信的服务体系，保障用户隐私。报告期内，本公司未接获有关客户隐私泄漏的投诉。 ——《上海梅林2023年ESG 暨可持续发展报告》"
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
import { onlyPositiveInteger, onlyPositiveNumber } from "../utils";

// 定义props，接收activeTab参数
const props = defineProps({
  activeTab: {
    type: String,
    default: "company-overview"
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

// 折叠面板
const activeCollapse = ref(["employee-composition"]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  // 基础员工信息
  permanentEmployeeCount: "",
  temporaryEmployeeCount: "",
  fullTimeEmployeeCount: "",
  partTimeEmployeeCount: "",
  employeeByEthnicity: "",
  employeeByPosition: "",
  employeeByEmploymentType: "",
  researchTalentStructure: "",
  newEmployeeByEthnicity: "",
  newEmployeeByAgeGroup: "",
  newEmployeeByGender: "",
  newEmployeeByRegion: "",
  campusRecruitmentCount: "",
  socialRecruitmentCount: "",
  jobPositionInfo: "",
  // 附件上传
  honorCertificateAttachments: [],
  employeeHandbookAttachments: [],
  thirdPartyAuditAttachments: [],
  parentalLeaveAttachments: [],
  employeeActivityAttachments: [],
  welfareCareAttachments: [],
  employeeEventAttachments: [],
  femaleFacilitiesAttachments: [],
  accessibilityFacilityAttachments: [],
  antiHarassmentTrainingAttachments: [],
  talentDevelopmentAttachments: [],
  // 基本权益保障/薪酬与激励/福利与关怀
  fairEmploymentPolicy: "",
  employeeHandbookDescription: "",
  antiChildLaborPolicy: "",
  illegalEmploymentDisclosure: "",
  employeeSalarySocialSecurity: "",
  workingHoursLeavePolicy: "",
  securityHumanRightsTraining: "",
  thirdPartyAudit: "",
  genderSalaryRatio: "",
  startingSalaryVsLocalMinimum: "",
  equityIncentive: "",
  compensationIncentivePolicy: "",
  compensationIncentiveMeasures: "",
  performanceFeedbackAppeal: "",
  compensationIncentiveInvestment: "",
  parentalLeaveRightsDescription: "",
  parentalLeaveWelfareDescription: "",
  welfareCarePolicy: "",
  welfareCareMeasuresActivity: "",
  welfareCareEmployeeEvent: "",
  welfareCareExpenditurePolicy: "", // 福利与关怀-政策支出
  welfareCareExpenditureEvent: "", // 福利与关怀-活动支出
  // 女性员工
  femaleManagerRatio: "",
  femaleEmpowermentTrainingRatio: "",
  femaleEmpowermentTrainingHours: "",
  femaleFacilitiesAndCourses: "",
  // 残障人士雇佣
  disabledEmployeeCount: "",
  disabledEmployeeRatio: "",
  accessibilityFacilityDescription: "",
  // 培训与考核
  antiHarassmentTrainingDescription: "",
  antiHarassmentTrainingCount: "",
  talentDevelopmentConcept: "",
  talentDevelopmentSystem: "",
  talentDevelopmentCategory: "",
  promotionDevelopmentPath: "",
  regularPerformanceAssessment: "",
  talentReserveInventory: "",
  talentDevelopmentOrganization: "",
  // 培训统计
  annualTrainingSessionCount: "",
  annualTrainingExpenditureAmount: "",
  avgTrainingHoursByGender: "",
  avgTrainingHoursByMiddleManager: "",
  avgTrainingHoursBySeniorManager: "",
  avgTrainingHoursByOther: "",
  trainingCoverageRate: "",
  trainingRateByGender: "",
  trainingRateByMiddleManager: "",
  trainingRateBySeniorManager: "",
  trainingRateByOther: "",
  overallTrainingPassRate: "",
  trainingPassRateByGender: "",
  trainingPassRateByPosition: "",
  // 沟通与满意度
  employeeCommunicationPolicy: "",
  employeeCommunicationChannel: "",
  employeeSatisfactionSurvey: "",
  unionMemberCount: "",
  employeeCommunicationResolutionRate: "",
  // 职业健康与安全
  newOccupationalDiseaseCases: "",
  occupationalDiseaseRate: "",
  occupationalDiseaseExamCount: "",
  occupationalDiseaseExamCoverageRate: "",
  occupationalHealthMonitoringCount: "",
  healthMonitoringCount: "",
  totalOccupationalHealthTraining: "",
  avgHealthSafetyTrainingCount: "",
  totalHealthSafetyTrainingHours: "",
  avgHealthSafetyTrainingHours: "",
  employeeCasualtyCount: "",
  workRelatedCasualtyRate: "",
  // 其他
  customerPrivacyLeakIncidents: "",
  mentalHealthServiceDescription: "",
  // 晋升与发展
  turnoverCountByAgeGroup: "",
  turnoverCountByAgeGroupResolution: "",
  turnoverCountByGender: "",
  turnoverCountByGenderResolution: "",
  turnoverCountByRegion: "",
  turnoverCountByRegionResolution: "",
  antiHarassmentTrainingCoverageRate: "",
  collectiveBargainingCoverageRate: "",
  employeeRepresentativeMeetingCount: "",
  workInjuryLostWorkdays: "",
  millionWorkHourLostTimeRate: "",
  millionWorkHourLTIR: "",
  millionWorkHourTRIR: "",
  workInjuryCompensationAmount: "",

  turnoverCountByAgeGroupTextarea: "",
  turnoverCountByGenderTextarea: "",
  turnoverCountByRegionTextarea: "",
  avgTrainingHoursByGenderFemale: "",
  avgTrainingHoursByGenderMale: "",
  trainingPassRateByGenderFemale: "",
  trainingPassRateByGenderMale: "",
  trainingPassRateByPositionMiddle: "",
  trainingPassRateByPositionSenior: "",
  trainingPassRateByPositionOther: ""
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

.textContainer {
  display: flex;
  gap: 30px;
  align-items: center;
  white-space: nowrap;
}

.textAlignStyle {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}
</style>
