<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="管治架构和组成" name="company-name-structure">
        <template #title>
          <div class="collapse-title">
            <span
              >管治架构和组成
              <EsgTooltip
                content="对应GRI标准: 2-9<br/>对应MSCI ESG指标: 公司治理"
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

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item
              label="公司的组织架构，并说明公司最高管治机构及其委员会的构成"
            >
              <el-input
                v-model="formData.companyStructureDescription"
                type="textarea"
                :rows="6"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传" prop="companyStructureFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.companyStructureFileList"
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
      <el-collapse-item title="公司董事会构成名单" name="reporting-entities">
        <template #title>
          <div class="collapse-title">
            <span
              >公司董事会构成名单
              <EsgTooltip
                content="对应GRI标准: GRI2-9、GRI2-17<br/>对应的MSCI ESG指标: 公司治理"
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

          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="公司董事会构成名单" prop="companyBoardList">
              <template #label>
                <div>
                  <span> 公司董事会构成名单 </span>
                  <EsgTooltip content="参考2024年表格" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.companyBoardList"
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
              </el-upload>
            </el-form-item>
            <!-- 定性描述 -->
            <el-form-item label="董事会成员数量">
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.companyBoardCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="董事会专门委员会成员数量">
              <template #label>
                <div>
                  <span> 董事会专门委员会成员数量 </span>
                  <EsgTooltip content="董事会下设之各专门委员会人数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.companyBoardCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="职工董事数量">
              <template #label>
                <div>
                  <span> 职工董事数量 </span>
                  <EsgTooltip content="职工董事人数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.employeeDirectorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="职工监事占比">
              <template #label>
                <div>
                  <span> 职工监事占比 </span>
                  <EsgTooltip content="职工董事在董事会中所占比例" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.employeeSupervisorCount"
                  @input="handleBoardCountInput"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item label="监事会成员数量">
              <template #label>
                <div>
                  <span> 监事会成员数量 </span>
                  <EsgTooltip content="监事会成员总数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.supervisorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="职工监事数量">
              <template #label>
                <div>
                  <span> 职工监事数量 </span>
                  <EsgTooltip content="职工监事人数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.employeeSupervisorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="职工监事占比">
              <template #label>
                <div>
                  <span> 职工监事占比 </span>
                  <EsgTooltip content="职工监事在监事会中的占比" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.employeeSupervisorRatio"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item
        title="董事会多元化声明"
        name="activities-products-services"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >董事会多元化声明
              <EsgTooltip content="对应GRI标准: GRI2-9, GRI2-10, GRI2-17" />
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
            <el-form-item label="董事会多元化声明">
              <template #label>
                <div>
                  <span> 董事会多元化声明 </span>
                  <EsgTooltip
                    content="董事会关于提升其成员构成多元化的声明。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.activitiesAndServicesDescription"
                type="textarea"
                :rows="8"
                placeholder="公司在规划董事会成员时,充分考虑董事会成员的多元化,包括但不限于性别、年龄、文化及教育背景、专业经验、技能等。
 ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="董事会成员背景">
              <template #label>
                <div>
                  <span> 董事会成员背景</span>
                  <EsgTooltip content="董事会成员的专业背景。" />
                </div>
              </template>
              <el-input
                v-model="formData.activitiesChangesDescription"
                type="textarea"
                :rows="4"
                placeholder="公司现有董事会成员具有经济管理、财务、生物工程以及食品营养研究等多领域专业背景和工作经验,为公司决策提供坚实的支撑和保障。
 ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="女性董事数量">
              <template #label>
                <div>
                  <span> 女性董事数量 </span>
                  <EsgTooltip
                    content="女性董事人数及其在董事会中的占比，最佳实践为保持女性董事的比例不低于30%。"
                  />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.femaleDirectorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="女性董事占比">
              <template #label>
                <div>
                  <span> 女性董事占比 </span>
                  <EsgTooltip
                    content="女性董事人数及其在董事会中的占比，最佳实践为保持女性董事的比例不低于30%。"
                  />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.femaleDirectorRatio"
                  @input="handleBoardCountInput"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="董事培训" name="business-locations">
        <template #title>
          <div class="collapse-title">
            <span>董事培训 </span>
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
            <el-form-item label="董事培训">
              <template #label>
                <div>
                  <span> 董事培训</span>
                  <EsgTooltip
                    content="为提升董事专业知识及技能而开展的培训，及培训类型。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productionBaseCountries"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="2023年，董事办组织公司董事、监事、高管参加中国上市公司协会和四川上市公司关于独董制度改革、关键人培训、注册制解读、信息披露相关培训共计5次。确保董监高学习了解最新的上市监管法律法规，以更好的开展公司经营管理及决策工作。
 ——《水井坊2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="directorTrainingFileList">
              <el-upload
                class="upload-area"
                v-model:file-list="formData.directorTrainingFileList"
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
                  <div class="el-upload__tip">如有图片请上传</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="董事培训次数">
              <template #label>
                <div>
                  <span> 董事培训次数 </span>
                  <EsgTooltip content="各类型董事培训的开展次数。" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.directorTrainingCount"
                  @input="handleBoardCountInput"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item label="董事培训覆盖面">
              <template #label>
                <div>
                  <span> 董事培训覆盖面 </span>
                  <EsgTooltip content="各项培训覆盖董事百分比。" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.directorTrainingCoverage"
                  @input="handleBoardCountInput"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="董事会独立性" name="markets-industries">
        <template #title>
          <div class="collapse-title">
            <span
              >董事会独立性
              <EsgTooltip
                content="对应GRI标准: GRI2-9, GRI2-10<br/>
对应MSCI ESG指标: 公司治理<br/>
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
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="董事会独立性声明">
              <template #label>
                <div>
                  <span> 董事会独立性声明 </span>
                  <EsgTooltip content="董事会关于保障其独立性的声明" />
                </div>
              </template>
              <el-input
                v-model="formData.serviceGeographicLocations"
                type="textarea"
                :rows="4"
                placeholder="伊利制定《公司独立董事制度》，并严格按照《公司独立董事制度》中规定的任职条件和选举程序选聘符合要求的专家、权威人士为独立董事，独立董事4名，占董事会人数的1/3以上。 ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="审计委员会独立性">
              <template #label>
                <div>
                  <span> 董事会独立性声明 </span>
                  <EsgTooltip
                    content="1.声明或计划建立完全由非执行董事或独立董事组成的董事会审计委员会<br> 2.当前审计委员会非执行董事或独立董事数量及占比"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.serviceIndustries"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="战略与ESG委员会独立性">
              <template #label>
                <div>
                  <span> 战略与ESG委员会独立性 </span>
                  <EsgTooltip
                    content="1.声明或计划建立完全由非执行董事或独立董事组成的董事会战略与社会责任委员会<br/> 2.当前战略与社会责任委员会非执行董事或独立董事数量及占比"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.customerBeneficiaryTypes"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="薪酬与提名委员会独立性">
              <template #label>
                <div>
                  <span> 薪酬与提名委员会独立性 </span>
                  <EsgTooltip
                    content="1.声明或计划建立完全由非执行董事或独立董事组成的董事会薪酬与提名委员会<br/> 2.当前薪酬与提名委员会非执行董事或独立董事数量及占比"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.customerBeneficiaryTypes"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="独立董事数量">
              <template #label>
                <div>
                  <span> 独立董事数量 </span>
                  <EsgTooltip content="独立董事人数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.independentDirectorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="独立董事占比">
              <template #label>
                <div>
                  <span> 独立董事占比 </span>
                  <EsgTooltip content="独立董事人数在董事会中的占比" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.independentDirectorRatio"
                  @input="handleBoardCountInput"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item label="非执行董事数量">
              <template #label>
                <div>
                  <span> 非执行董事数量 </span>
                  <EsgTooltip content="非执行董事人数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.nonExecutiveDirectorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="非执行董事占比">
              <template #label>
                <div>
                  <span> 非执行董事占比 </span>
                  <EsgTooltip content="非执行董事在董事会中的占比" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.nonExecutiveDirectorRatio"
                  @input="handleBoardCountInput"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item label="独立非执行董事数量">
              <template #label>
                <div>
                  <span> 独立非执行董事数量 </span>
                  <EsgTooltip content="独立非执行董事人数" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.independentNonExecutiveDirectorCount"
                  @input="handleBoardCountInput"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="独立非执行董事占比">
              <template #label>
                <div>
                  <span> 独立非执行董事占比 </span>
                  <EsgTooltip content="独立非执行董事在董事会中的占比" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.independentNonExecutiveDirectorRatio"
                  @input="handleBoardCountInput"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item
        title="董事会提名与遴选"
        name="corporate-culture-ethics"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >董事会提名与遴选
              <EsgTooltip
                content="对应GRI标准: GRI2-10<br/>
对应MSCI ESG指标: 公司治理"
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
            <el-form-item label="董事会与委员会的提名与遴选">
              <template #label>
                <div>
                  <span> 董事会与委员会的提名与遴选 </span>
                  <EsgTooltip
                    content="说明用于提名和遴选最高管治机构成员的标准，包括是否以及如何考虑以下因素：<br/>
1.利益相关方（包括股东）的意见；<br/>
2.多样性；<br/>
3.独立性；<br/>
4.与组织的影响相关的胜任能力。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.strategicVision"
                type="textarea"
                :rows="4"
                placeholder="公司在规划董事会成员时,充分考虑董事会成员的多元化,包括但不限于性别、年龄、文化及教育背景、专业经验、技等。公司董事会由7名董事组成，其中女性董事2名,占比29%。公司现有董事会成员具有经济管理、财务、生物工程以及食品营养研究等多领域专业背景和工作经验,为公司决策提供坚实的支撑和保障。——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="三会运作" name="external-initiatives">
        <template #title>
          <div class="collapse-title">
            <span
              >三会运作
              <EsgTooltip
                content="对应2021 GRI标准:GRI2-10, GRI2-9, GRI2-12, GRI2-17<br/>
对应MSCI ESG指标: 公司治理<br/>
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
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item>
              <template #label>
                <div>
                  <span>股东大会职责</span>
                  <EsgTooltip content="按最新年报统计更新公司股东大会职责。" />
                </div>
              </template>
              <el-input
                v-model="formData.externalInitiativesDescription"
                type="textarea"
                :rows="4"
                placeholder="公司聘请执业律师出席股东大会，进行确认和见证，保证股东大会的合法有效性，股东大会切实维护全体股东、特别是中小股东的合法权益。按照股东大会决议及授权，本着对全体股东负责的态度，公司对股东大会审议通过的各项议案和事项及时办理，确保股东大会各项决议顺利执行。——《中粮糖业2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>董事会职责</span>
                  <EsgTooltip
                    content="按最新年报统计更新公司董事会职责。
需说明董事会在制定、批准、更新及监督公司可持续发展（ESG）相关目标和程序方面的作用。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.externalInitiativesDescription"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>董事会专门委员会职责</span>
                  <EsgTooltip
                    content="按最新年报统计更新公司董事会专门委员会职责"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.externalInitiativesDescription"
                type="textarea"
                :rows="4"
                placeholder="公司董事会专门委员会充分发挥专门委员会职责，对提交董事会议题进行事先讨论和审议，协助董事会做好专业决策，更高效地行使董事会职权。——《中粮糖业2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>监事会职责</span>
                  <EsgTooltip content="按最新年报统计更新公司监事会职责。" />
                </div>
              </template>
              <el-input
                v-model="formData.externalInitiativesDescription"
                type="textarea"
                :rows="4"
                placeholder="对董事会的决议是否符合有关法律法规以及对公司日常经营、财务管理等方面认真开展监督工作，促进公司依法合规运行，维护公司和全体股东的合法权益。——《中粮糖业2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>股东大会召开情况</span>
                  <EsgTooltip content="公司召开股东大会4次，审议通过32项议案" />
                </div>
              </template>
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>召开</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>项议案</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div class="textAlignStyle">
                  <span>董事会召开情况</span>
                  <EsgTooltip content="召开董事会10次，审议通过52项议案" />
                </div>
              </template>
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>召开</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>项议案</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>董事会专门委员会召开情况</span>
                </div>
              </template>
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>召开</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>项议案</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>监事会召开情况</span>
                  <EsgTooltip content="召开监事会8次，审议通过31项议案" />
                </div>
              </template>
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>召开</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.meetingCount"
                  />
                  <span>项议案</span>
                </div>
              </div>
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
                <template #tip>
                  <div class="el-upload__tip">如有图片请上传</div>
                </template>
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
  companyStructureFileList: [], // 附件列表

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
  line-height: 1.3;
}

.textContainer {
  display: flex;
  gap: 30px;
  align-items: center;
}

.textAlignStyle {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}
</style>
