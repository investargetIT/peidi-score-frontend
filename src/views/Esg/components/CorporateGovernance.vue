<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item
        title="管治架构和组成"
        name="governance-structure-composition"
      >
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

          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <!-- 定性描述 -->
            <el-form-item
              label="公司的组织架构，并说明公司最高管治机构及其委员会的构成"
            >
              <el-input
                v-model="formData.governanceStructureDescription"
                type="textarea"
                :rows="6"
                resize="vertical"
              />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item label="附件上传" prop="governanceStructureFiles">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="附件上传集团架构" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.governanceStructureFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="公司董事会构成名单"
        name="board-composition-list"
      >
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

          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item
              label="公司董事会构成名单"
              prop="boardCompositionFiles"
            >
              <template #label>
                <div>
                  <span> 公司董事会构成名单 </span>
                  <EsgTooltip content="参考2024年表格" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.boardCompositionFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
                  v-model="formData.boardMemberCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  v-model="formData.boardCommitteeMemberCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveIntege"
                />
                <span>人</span>
              </div>
            </el-form-item>
            <el-form-item label="职工董事占比">
              <template #label>
                <div>
                  <span> 职工董事占比 </span>
                  <EsgTooltip content="职工董事在董事会中所占比例" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.employeeDirectorRatio"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item
        title="董事会多元化声明"
        name="board-diversity-statement"
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
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
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
                v-model="formData.boardDiversityStatement"
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
                v-model="formData.boardMemberBackground"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="董事培训" name="board-training">
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
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
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
                v-model="formData.boardTrainingDescription"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="2023年，董事办组织公司董事、监事、高管参加中国上市公司协会和四川上市公司关于独董制度改革、关键人培训、注册制解读、信息披露相关培训共计5次。确保董监高学习了解最新的上市监管法律法规，以更好的开展公司经营管理及决策工作。
 ——《水井坊2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="boardTrainingFiles">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="如有图片请上传" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.boardTrainingFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
            <el-form-item label="董事培训次数">
              <template #label>
                <div>
                  <span> 董事培训次数 </span>
                  <EsgTooltip content="各类型董事培训的开展次数。" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input v-model="formData.boardTrainingCount" />
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
                  v-model="formData.boardTrainingCoverage"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="董事会独立性" name="board-independence">
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
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="董事会独立性声明">
              <template #label>
                <div>
                  <span> 董事会独立性声明 </span>
                  <EsgTooltip content="董事会关于保障其独立性的声明" />
                </div>
              </template>
              <el-input
                v-model="formData.boardIndependenceStatement"
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
                v-model="formData.auditCommitteeIndependence"
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
                v-model="formData.esgCommitteeIndependence"
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
                v-model="formData.remunerationCommitteeIndependence"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
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
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
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
        title="董事会提名与遴选"
        name="board-nomination-selection"
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
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
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
                v-model="formData.boardNominationSelection"
                type="textarea"
                :rows="4"
                placeholder="公司在规划董事会成员时,充分考虑董事会成员的多元化,包括但不限于性别、年龄、文化及教育背景、专业经验、技等。公司董事会由7名董事组成，其中女性董事2名,占比29%。公司现有董事会成员具有经济管理、财务、生物工程以及食品营养研究等多领域专业背景和工作经验,为公司决策提供坚实的支撑和保障。——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="三会运作" name="three-meetings-operation">
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
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item>
              <template #label>
                <div>
                  <span>股东大会职责</span>
                  <EsgTooltip content="按最新年报统计更新公司股东大会职责。" />
                </div>
              </template>
              <el-input
                v-model="formData.shareholderMeetingDuties"
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
                v-model="formData.boardMeetingDuties"
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
                v-model="formData.boardCommitteeDuties"
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
                v-model="formData.supervisorMeetingDuties"
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
                    v-model="formData.shareholderMeetingCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.shareholderMeetingResolutionCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>项议案</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>董事会召开情况</span>
                  <EsgTooltip content="召开董事会10次，审议通过52项议案" />
                </div>
              </template>
              <div class="textContainer">
                <div class="textAlignStyle">
                  <span>召开</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.boardMeetingCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.boardMeetingResolutionCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
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
                    v-model="formData.boardCommitteeMeetingCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.boardCommitteeMeetingResolutionCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
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
                    v-model="formData.supervisorMeetingCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>次</span>
                </div>
                <div class="textAlignStyle">
                  <span>审议通过</span>
                  <el-input
                    style="width: 100px"
                    v-model="formData.supervisorMeetingResolutionCount"
                    :formatter="onlyPositiveInteger"
                    :parser="onlyPositiveInteger"
                  />
                  <span>项议案</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="高管薪酬" name="executive-compensation">
        <template #title>
          <div class="collapse-title">
            <span
              >高管薪酬
              <EsgTooltip content="Wind评级、GRI2-19" />
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
            <el-form-item>
              <template #label>
                <div>
                  <span>高管薪酬政策</span>
                  <EsgTooltip
                    content="对高管薪酬及福利情况的披露，与年报口径保持一致，包括<br/> 1.固定工资和浮动工资；<br/> 2.签约奖金或招聘奖励金；<br/> 3.退休金；<br/> 4.回拨（指在没有达到某些雇佣条件或目标的情况下，需要向雇主偿还先前获得的薪酬）；<br/> 5.退休福利"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.executiveCompensationPolicy"
                type="textarea"
                :rows="4"
                placeholder="公司构建多维度的董事会成员绩效评价体系，综合公司生产经营管理情况、经营目标完成情况、财务预算执行情况及工作履职情况来决定绩效评价。其中，独立董事的薪酬经公司股东大会审议通过，职工董事的薪酬根据公司的薪酬管理制度以及个人的绩效考评结果来综合评估。 ——《贵州茅台2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="高管薪酬与ESG表现挂钩">
              <template #label>
                <div>
                  <span>高管薪酬与ESG表现挂钩</span>
                  <EsgTooltip
                    content="描述公司高管薪酬与ESG绩效挂钩的方式，以保障董事会可持续发展决策在公司运营中得到严格落实。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.executiveCompensationEsgLink"
                type="textarea"
                :rows="4"
                placeholder="为确保实现可持续发展目标承诺，伊利的可持续发展战略目标与经营战略目标一样，成为集团高级管理人员（负责可持续发展相关议题的部门负责人）（简称'高级管理人员'）的考核指标之一，并将可持续发展绩效表现与高级管理人员薪酬绩效挂钩。作为绩效考核的一部分，伊利将包含温室气体减排目标、水资源管理目标在内的可持续发展战略目标的监督纳入高级管理人员的考核计划中，促使高级管理人员对可持续发展工作进展负责，切实推进可持续发展战略目标的实现。——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="信息披露" name="information-disclosure">
        <template #title>
          <div class="collapse-title">
            <span>信息披露 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>信息披露遵循的理念或原则</span>
                  <EsgTooltip
                    content="根据公司信息披露管理办法对指标进行管理和更新。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.disclosurePrinciple"
                type="textarea"
                :rows="4"
                placeholder="在满足强制性信息披露要求的基础上，广州酒家高度重视投资者需求，主动披露环境责任、社会责任、公司治理及经营等信息，持续提升公司信息披露有效性。——《广州酒家2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>信息披露遵循的法律法规及规范性文件</span>
                  <EsgTooltip
                    content="根据公司信息披露管理办法对指标进行管理和更新。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.disclosureRegulation"
                type="textarea"
                :rows="4"
                placeholder="根据中国证监会颁布的《公开发行证券的公司信息披露内容与格式准则第2号——年度报告的内容与格式》《上海证券交易所上市公司自律监管指南第6号——定期报告》等要求，真实、准确、完整、及时、公平地披露2022年年度报告、2023年第一季度报告、2023年半年度报告、2023年第三季度报告。——《广州酒家2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="定期报告发布数">
              <template #label>
                <div>
                  <span> 定期报告发布数 </span>
                  <EsgTooltip content="公司定期报告年度发布数量" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.regularReportCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>项</span>
              </div>
            </el-form-item>
            <el-form-item label="临时报告发布数">
              <template #label>
                <div>
                  <span> 临时报告发布数 </span>
                  <EsgTooltip content="公司临时报告年度发布数量。" />
                </div>
              </template>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-input
                  v-model="formData.interimReportCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>项</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="投资者互动" name="investor-interaction">
        <template #title>
          <div class="collapse-title">
            <span>投资者互动 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>投资者沟通渠道</span>
                  <EsgTooltip
                    content="投资者沟通渠道包括但不仅限于：电话、邮件、网络会议、接待日、参观等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.investorCommunicationChannels"
                type="textarea"
                :rows="4"
                placeholder="公司不断优化投资者保护长效机制，持续完善投资者关系管理模式。公司通过投资者电话热线、邮箱、e互动、公司官网、公司官方微信公众号等多种渠道，传递公司信息，聆听投资者意见，增强投资者和公司之间的互信和理解。——《国投中鲁2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="投资者沟通活动类型">
              <template #label>
                <div>
                  <span>投资者沟通活动类型</span>
                  <EsgTooltip
                    content="按公司实际情况对投资者沟通活动进行分类。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.investorCommunicationTypes"
                placeholder="公司高度重视与投资者特别是中小股东之间沟通渠道的多元和畅通，并建立起常态和多元化的投资者沟通机制。公司高度重视投资者的调研，专人负责投资者调研接待工作；公司官网设置投资者专区，投资者可在线预约参观调研；公司充分利用上交所互动平台，对投资者的问题给予及时解答和回复；并通过电话、邮件等多种方式服务投资者，及时向投资者传递公司最新的动态、经营业绩和方针。——《海天味业2023年环境、社会及治理报告》"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="收到的投资者问询总数">
              <template #label>
                <div>
                  <span>收到的投资者问询总数</span>
                  <EsgTooltip content="按实际情况统计" />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.investorInquiryCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>项</span>
              </div>
            </el-form-item>
            <el-form-item label="年度领导重要讲话稿">
              <template #label>
                <div>
                  <span>年度领导重要讲话稿 </span>
                  <EsgTooltip content="公司本年度领导重要的内外部讲话稿" />
                </div>
              </template>
              <el-input
                v-model="formData.annualSpeech"
                placeholder=""
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="investorInteractionFiles">
              <template #label>
                <div>
                  <span>附件上传 </span>
                  <EsgTooltip content="如有相关图片请提供" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.investorInteractionFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
            <el-form-item label="优秀投资者交流活动案例">
              <template #label>
                <div>
                  <span>优秀投资者交流活动案例 </span>
                  <EsgTooltip content="优秀投资者交流活动以及的图文资料。" />
                </div>
              </template>
              <el-input
                v-model="formData.investorInteractionCase"
                placeholder="公司还会定期发起'走进上市公司'系列活动，在同投资者交流时，除了介绍公司情况业绩之外，还会实际参观公司的各个生产车间、宠物营养健康研究院、研发中心等核心区域，同时，我们也会在路演现场陈列公司产品，并对产品进行现场的讲解。投资者通过参观工厂可以了解到公司的生产情况，而触及到实际的产品才能加深对公司业务的印象，使投资者全方位的深入了解公司情况， 通过这样的直接互动，公司不仅传达了真实透明的信息，也进一步拉近了与投资者的距离，共同探讨和构筑长期共赢的合作关系。 ——《中宠股份2023年社会责任报告》"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="investorInteractionCaseFiles">
              <template #label>
                <div>
                  <span>附件上传 </span>
                  <EsgTooltip content="如有相关图片请提供" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.investorInteractionCaseFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
            <el-form-item label="投资者问询答复率">
              <template #label>
                <div>
                  <span> 投资者问询答复率 </span>
                  <EsgTooltip
                    content="按实际情况统计各个渠道回复投资者问题的答复率。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.investorReplyRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item label="各类型投资者沟通活动举办次数">
              <template #label>
                <div>
                  <span> 各类型投资者沟通活动举办次数 </span>
                  <EsgTooltip
                    content="按不同类型划分的投资者沟通活动举办次数"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.investorActivityCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item label="各类型投资者沟通活动覆盖人次">
              <template #label>
                <div>
                  <span> 各类型投资者沟通活动覆盖人次 </span>
                  <EsgTooltip
                    content="按不同类型划分的投资者沟通活动覆盖人次。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.investorActivityCoverage"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人次</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="投资者教育与保护"
        name="investor-education-protection"
      >
        <template #title>
          <div class="collapse-title">
            <span>投资者教育与保护 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>投资者教育活动与宣传</span>
                  <EsgTooltip
                    content="公司开展的投资者教育活动与宣传活动情况，如全国投资者保护宣传日活动。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.investorEducationPromotion"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="investorEducationFiles">
              <template #label>
                <div>
                  <span>附件上传 </span>
                  <EsgTooltip content="如有相关图片请提供" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.investorEducationFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
            <el-form-item label="投资者保护举措">
              <template #label>
                <div>
                  <span>投资者保护举措</span>
                  <EsgTooltip
                    content="描述公司有关投资者保护的政策、制度和实践举措。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.investorProtectionMeasures"
                placeholder="中粮糖业安排专职专岗开展投资者关系管理，重视信息披露，提高信息披露质量。严格按照《上海证券交易所股票上市规则》《信息披露事务管理制度》等相关规定，真实、准确、完整、及时地披露公司定期报告、临时公告，帮助投资者更便捷、更有效地了解公司经营情况，切实保障所有股东尤其是中小投资者对公司重大事项和经营管理情况的知情权。 ——《中粮糖业2023年度ESG报告》"
                type="textarea"
                :rows="4"
              />
            </el-form-item>

            <el-form-item label="中小股东保护">
              <template #label>
                <div>
                  <span>中小股东保护 </span>
                  <EsgTooltip
                    content="描述公司在中小股东保护方面的政策、制度和实践举措。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.minorityShareholderProtection"
                placeholder=""
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="理念与目标" name="philosophy-goals">
        <template #title>
          <div class="collapse-title">
            <span>理念与目标 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>内控和风险管理理念或管理方针</span>
                  <EsgTooltip content="公司内控及风险应对理念及管理方针。" />
                </div>
              </template>
              <el-input
                v-model="formData.riskManagementPhilosophy"
                type="textarea"
                :rows="4"
                placeholder="伊利秉承'强内控、防风险、促合规、创价值'的风控管理理念，逐步构建以风险和价值为导向、以控制为手段、以互联网技术为支撑、以制度为平台、以绩效管理为保障、以流程为对象的'六位一体'的内部控制与风险管理体系，并推动有效落实，推进全面风险管理。——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>

            <el-form-item label="内控和风险管理战略或总体目标">
              <template #label>
                <div>
                  <span>内控和风险管理战略或总体目标</span>
                  <EsgTooltip content="公司内控与风险管理阶段性目标" />
                </div>
              </template>
              <el-input
                v-model="formData.riskManagementStrategy"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="体系与机制" name="system-mechanism">
        <template #title>
          <div class="collapse-title">
            <span
              >体系与机制
              <EsgTooltip content="GRI2-25" />
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
            <el-form-item label="管理组织架构及职责">
              <template #label>
                <div>
                  <span> 管理组织架构及职责 </span>
                  <EsgTooltip
                    content="公司内控和风险管理组织架构及各层级职责。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.managementStructureDuties"
                type="textarea"
                :rows="4"
                placeholder="第一道防线:各业务及职能部门负责人负责部门相关风险的识别、评估、落实整改以及防范和化解潜在风险点;第二道防线:风险委员会对风险控制标准的执行情况进行监督;第三道防线:独立内部审计内审部负责定期对公司风险管理和合规流程有效性进行的内部审计，并将结果向审计委员会汇报；外部审计——《金龙鱼2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="管理核心制度">
              <template #label>
                <div>
                  <span> 管理核心制度 </span>
                  <EsgTooltip content="公司内控和风险管理主要政策、制度等。" />
                </div>
              </template>
              <el-input
                v-model="formData.managementCorePolicies"
                type="textarea"
                :rows="4"
                placeholder="基于《伊利集团内部控制与风险管理制度》及其配套管理流程，持续完善公司内部控制、风险管理及合规管理相关机制。——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="管理流程">
              <template #label>
                <div>
                  <span> 管理流程 </span>
                  <EsgTooltip
                    content="披露公司识别、评估及应对风险的主要管理流程和举措。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.managementProcess"
                type="textarea"
                :rows="4"
                placeholder="针对关键领域和重点业务开展风险识别，并通过完成风险清单编制、确定风险等级及优先顺序、制定重大风险应对方案，进一步夯实公司风控管理体系，保障公司健康运行及可持续发展。 ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="风险识别">
              <template #label>
                <div>
                  <span> 风险识别 </span>
                  <EsgTooltip
                    content="公司为管理风险而开展的识别工作及识别结果"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.riskIdentification"
                type="textarea"
                :rows="4"
                placeholder="目前，公司的风险矩阵中囊括了商业道德与反贪腐、产品质量管理、环境保护与资源节约、生产安全及食品安全管理等ESG风险控制点，有效地将企业ESG相关风险管理融合在现有的企业风险管控框架中。 ——《安井食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="风险应对措施">
              <template #label>
                <div>
                  <span> 风险应对措施 </span>
                  <EsgTooltip
                    content="公司依据风险识别结果而制定的应对措施。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.riskResponseMeasures"
                type="textarea"
                :rows="4"
                placeholder="公司内审部还根据重要性议题评估结果，将环保风险、劳工风险等、食品安全风险等主要的对公司长远发展及价值创造和对环境、社会具有重要影响的ESG风险纳入常规风险管理及内控机制当中，融入风险矩阵，制定专项检查及整改措施，全面提升风险防控质效。——《金龙鱼2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="商业道德理念与目标" name="business-ethics-goals">
        <template #title>
          <div class="collapse-title">
            <span>商业道德理念与目标 </span>
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
            <el-form-item label="商业道德理念或管理方针以及总体目标">
              <template #label>
                <div>
                  <span> 商业道德理念或管理方针以及总体目标 </span>
                  <EsgTooltip
                    content="公司为践行反腐败、反贪污、反垄断、反不正当竞争而制定的理念、管理方针及阶段性目标。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.businessEthicsGoals"
                type="textarea"
                :rows="4"
                placeholder="水井坊根据《刑法》《反不正当竞争法》《关于办理商业贿赂刑事案件适用法律若干问题的意见》等各项法律法规、部委规章、司法解释规定，及公司《商业行为准则》，制定了《四川水井坊股份有限公司反贿赂政策》。该政策适用于水井坊及子公司与其所有员工，在接受礼品与招待、提供礼品与招待、与政府官员往来、公益捐赠、记录和记账规范、政策咨询等方面均做出了详细规定。——《水井坊2023年度ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="平等对待中小企业（财务）"
        name="sme-fair-treatment-finance"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >平等对待中小企业（财务）
              <EsgTooltip content="交易所可持续发展指引" />
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
            <el-form-item label="平等对待中小企业">
              <template #label>
                <div>
                  <span> 平等对待中小企业 </span>
                  <EsgTooltip content="逾期未支付中小企业款项的具体情况" />
                </div>
              </template>
              <el-input
                v-model="formData.smeFairTreatment"
                type="textarea"
                :rows="4"
                placeholder="企业报告期末应付账款（含应付票据）余额超过300亿元或占总资产的比重超过50％的，应当披露报告期末逾期未支付的金额。企业或者其控股子公司通过国家企业信用信息公示系统向社会公示逾期尚未支付中小企业款项信息的，应当披露逾期未支付中小企业款项的金额、对中小企业供应商的账期设置情况、逾期账款的形成原因、是否涉及诉讼仲裁等情况。"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="反贪污腐败" name="anti-corruption">
        <template #title>
          <div class="collapse-title">
            <span
              >反贪污腐败
              <EsgTooltip
                content="对应GRI标准: GRI205<br/>
对应MSCI ESG指标: 公司治理-腐败与不稳定性<br/>
交易所可持续发展指引<br/>
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
            <span class="description">企业所有权结构和法律组织形式。</span>
          </div>
          -->
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="反腐廉洁组织架构及职责">
              <template #label>
                <div>
                  <span> 反腐廉洁组织架构及职责 </span>
                  <EsgTooltip
                    content="公司反腐败、反贪污管理组织架构及各层级职责。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiCorruptionStructureDuties"
                type="textarea"
                :rows="4"
                placeholder="公司全力打造'清廉一鸣',制定《浙江一鸣食品股份有限公司反舞弊制度》,防止各类舞弊事件发生,保障管理层有效履行管理工作。公司监察组主要负责开展反舞弊工作,通过规范公司员工的职业行为,保证公司各部门、中心制度规范运行,防止损害公司利益的行为发生。 公司监察组在董事会领导下独立行使职权,直接上级为董事长,不受业务部门、职能部门、行政部门的干涉和管理。公司监察组的监察工作向公司董事会及审计委员会负责并汇报工作。 ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="反腐廉洁政策">
              <template #label>
                <div>
                  <span> 反腐廉洁政策 </span>
                  <EsgTooltip content="公司反腐败、反贪污主要政策。" />
                </div>
              </template>
              <el-input
                v-model="formData.antiCorruptionPolicy"
                type="textarea"
                :rows="4"
                placeholder="公司严格遵守国家法律法规，制定了《商业道德行为准则》《反腐败政策》《员工职务行为准则》等覆盖公司运营全流程的商业道德政策制度及管理机制，对全体员工、供应商、承包商、经销商等进行监管和约束，并对腐败、贿赂、舞弊、洗钱、不正当竞争、利益冲突等行为和不遵守情况做出明确的规范，同时将员工的年终考评和职务调整与员工行为准则相关联。公司持续完善商业道德管理体系，由董事会审计委员会进行总体监督。公司依据公司商业道德相关政策制度及管理中的要求，将运营中商业道德及违规风险纳入审计评估，每三年完成覆盖所有运营地的内部审计。 ——《金龙鱼2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="腐败风险评估">
              <template #label>
                <div>
                  <span> 腐败风险评估 </span>
                  <EsgTooltip
                    content="公司已进行腐败风险评估的运营点的总数及百分比；<br/> 通过风险评估确认的重大腐败风险"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.corruptionRiskAssessment"
                type="textarea"
                :rows="4"
                placeholder="公司开展关键岗位和重点人员的廉洁风险点识别，制定防控措施，2023年公司采购、销售、工程、财务、人事等重点条线识别出46个重大廉洁风险点。 ——《光明乳业2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="反腐败举报制度">
              <template #label>
                <div>
                  <span> 反腐败举报制度 </span>
                  <EsgTooltip
                    content="公司为及时检举腐败行为而搭建的举报制度。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiCorruptionReportingSystem"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="反腐败举报渠道">
              <template #label>
                <div>
                  <span> 反腐败举报渠道 </span>
                  <EsgTooltip
                    content="公司为及时检举腐败行为而搭建的举报渠道。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiCorruptionReportingChannels"
                type="textarea"
                :rows="4"
                placeholder="双汇发展建立各类反腐败信息举报渠道，包括总裁直通车、稽查审计举报热线、采购吹哨人制度、各管理系统信息沟通平台、工厂经理信箱等，及时解决收到的举报，并充分保护举报人信息。 ——《双汇发展2023年社会责任报告》"
              />
            </el-form-item>
            <el-form-item label="举报人保护政策">
              <template #label>
                <div>
                  <span> 举报人保护政策 </span>
                  <EsgTooltip content="公司为保护举报人而建立的保护政策。" />
                </div>
              </template>
              <el-input
                v-model="formData.whistleblowerProtectionPolicy"
                type="textarea"
                :rows="4"
                placeholder="公司保护举报人的正当权益不受侵害，对举报人的信息和举报事项予以保密。举报属实且为公司挽回损失的，酌情给予奖励。实名举报的，调查结果向举报人反馈。禁止以任何形式对举报人进行打击报复。——《国投中鲁2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="廉洁承诺书覆盖面">
              <template #label>
                <div>
                  <span> 廉洁承诺书覆盖面 </span>
                  <EsgTooltip
                    content="公司与员工、供应商、承包商等相关方签署廉洁承诺书的情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.integrityCommitmentCoverage"
                type="textarea"
                :rows="4"
                placeholder="重大工程建设项目开工时，公司监管部门会在项目现场进行廉政教育，并要求施工单位、监理方须与公司签订三方廉洁协议，公司项目管理人员、施工方和监理公司等参与工程项目人员签署廉洁承诺；项目保证金中含有廉政保证金。——《光明乳业2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="对商业伙伴反贪污，贿赂的监管">
              <template #label>
                <div>
                  <span> 对商业伙伴反贪污，贿赂的监管 </span>
                  <EsgTooltip content="按实际情况统计" />
                </div>
              </template>
              <el-input
                v-model="formData.partnerAntiCorruptionSupervision"
                type="textarea"
                :rows="4"
                placeholder="根据ESG审查方法，制订年度现场评审供应商名单，由供应商评审小组进行现场评审，并将评审结果反馈给供应商改进。供应商年度现场评审由公司内部相关专家组成现场评审小组或由第三方专业机构派遣专家组成现场评审小组，由现场评审小组作出评审结论，公司根据评审结论确定是否继续合作。——《光明乳业2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="廉洁文化宣传渠道与措施">
              <template #label>
                <div>
                  <span> 廉洁文化宣传渠道与措施 </span>
                  <EsgTooltip content="公司为提升廉洁意识而开展的宣传。" />
                </div>
              </template>
              <el-input
                v-model="formData.integrityCulturePromotion"
                type="textarea"
                :rows="6"
                placeholder="公司采用多样化的形式开展廉洁自律宣传教育活动，旨在让廉洁文化深入人心。我们推出文化简报，以最新的资讯传递廉洁之声；举办廉洁专题宣传活动，深入剖析廉洁自律的重要性；开展廉洁文化快闪活动，以生动有趣的方式吸引员工参与；同时还打造了丰富的文化周边产品，以生动的方式强化对员工的廉洁教育。通过这些举措，我们不仅让廉洁文化变得可见，更使其成为企业文化的一部分，潜移默化地影响每位员工。2023年，海天通过公司内网、公告、宣传栏、学习平台、面授、沙龙、文化快闪等形式全方位对员工开展廉洁自律教育，警钟长鸣，共有10,380人次参加廉自律相关学习，8,699人次参加相关考试。——《海天味业2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="antiCorruptionFiles">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="如有活动图片请上传" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.antiCorruptionFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
            <el-form-item label="反腐败反贿赂发生事件">
              <template #label>
                <div>
                  <span> 反腐败反贿赂发生事件 </span>
                  <EsgTooltip
                    content="报告期内发生的商业贿赂及贪污事件的具体情况，包括董事、管理层人员、员工由于商业贿赂或贪污行为而被解雇或受到处分、被有权部门调查、与业务合作伙伴的合同被终止或未续约以及针对公司或其董事、管理层人员、员工商业贿赂或贪污行为的诉讼案件具体情况（如有）"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiCorruptionIncidents"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item label="廉洁承诺书签署率">
              <template #label>
                <div>
                  <span> 廉洁承诺书签署率 </span>
                  <EsgTooltip
                    content="公司与员工、供应商、承包商等相关方签署廉洁承诺书的情况。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.integrityCommitmentSigningRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item label="反腐败、反贿赂培训人次">
              <template #label>
                <div>
                  <span> 反腐败、反贿赂培训人次 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiCorruptionTrainingParticipants"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人次</span>
              </div>
            </el-form-item>
            <el-form-item label="反腐败、反贿赂培训总时长">
              <template #label>
                <div>
                  <span> 反腐败、反贿赂培训总时长 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiCorruptionTrainingTotalHours"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item label="反腐败、反贿赂培训人均时长">
              <template #label>
                <div>
                  <span> 反腐败、反贿赂培训人均时长 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiCorruptionTrainingAvgHours"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>小时</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="反垄断与公平竞争"
        name="anti-monopoly-fair-competition"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >反垄断与公平竞争
              <EsgTooltip
                content="对应GRI标准: <br/>
对应MSCI ESG指标: 公司治理-反竞争行为<br/>
交易所可持续发展指引<br/>
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
            <span class="description">企业所有权结构和法律组织形式。</span>
          </div>
          -->
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="反垄断与公平竞争管理体系与制度">
              <template #label>
                <div>
                  <span> 反垄断与公平竞争管理体系与制度 </span>
                  <EsgTooltip
                    content="防范不正当竞争行为（如虚假宣传、实施垄断行为、侵犯商业秘密等）管理制度体系建立与运作情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiMonopolySystem"
                type="textarea"
                :rows="4"
                placeholder="双汇发展尊重市场竞争原则，支持和维护公平自由的市场竞争环境，反对任何形式的不正当竞双汇发展扎实推进反垄断体系优化工作，坚决支持和维护公平、自由的市场竞争环境，对任何形式的不正当竞争、垄断和洗钱行为持反对态度。2023年，我们关注反垄断规定最新动向，针对肉制品领域可能涉及的反垄断风险点及时修订完善《联销体协议》，进一步夯实反垄断管理。——《双汇发展2023年社会责任报告》"
              />
            </el-form-item>
            <el-form-item label="反垄断与公平竞争风险控制">
              <template #label>
                <div>
                  <span> 反垄断与公平竞争风险控制 </span>
                  <EsgTooltip
                    content="防范不正当竞争行为（如虚假宣传、实施垄断行为、侵犯商业秘密等）具体措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiMonopolyRiskControl"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="反垄断与不当竞争诉讼、行政处罚">
              <template #label>
                <div>
                  <span> 反垄断与不当竞争诉讼、行政处罚 </span>
                  <EsgTooltip
                    content="报告期内因公司不正当竞争行为导致诉讼或重大行政处罚的，应当披露具体诉讼情况、涉案金额、受到的行政处罚相关情况以及整改措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.antiMonopolyLitigation"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item
              label="反垄断与公平竞争培训"
              prop="antiMonopolyTrainingFiles"
            >
              <template #label>
                <div>
                  <span> 反垄断与公平竞争培训 </span>
                  <EsgTooltip content="上传培训图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.antiMonopolyTrainingFiles"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :on-success="() => handleSave('autoSave')"
                :on-remove="() => handleSave('autoSave')"
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
            <el-form-item label="反垄断与公平竞争培训场次">
              <template #label>
                <div>
                  <span> 反垄断与公平竞争培训场次 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiMonopolyTrainingSessions"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item label="反垄断与公平竞争培训人次">
              <template #label>
                <div>
                  <span> 反垄断与公平竞争培训人次 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiMonopolyTrainingParticipants"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>人次</span>
              </div>
            </el-form-item>
            <el-form-item label="反垄断与公平竞争培训总时长">
              <template #label>
                <div>
                  <span> 反垄断与公平竞争培训总时长 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiMonopolyTrainingTotalHours"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item label="反垄断与公平竞争培训人均时长">
              <template #label>
                <div>
                  <span> 反垄断与公平竞争培训人均时长 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.antiMonopolyTrainingAvgHours"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>小时</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="违规违纪事件" name="violation-incidents">
        <template #title>
          <div class="collapse-title">
            <span
              >违规违纪事件
              <EsgTooltip content="对应GRI标准: GRI2-25, GRI2-27, GRI205" />
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
            <el-form-item label="针对违规违纪事件的处理制度">
              <template #label>
                <div>
                  <span> 针对违规违纪事件的处理制度 </span>
                  <EsgTooltip
                    content="公司对腐败与贿赂违规事件、反垄断与公平竞争违规事件的处罚机制及违规事件的发生情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.violationHandlingSystem"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="违规违纪事件类型">
              <template #label>
                <div>
                  <span> 违规违纪事件类型 </span>
                  <EsgTooltip
                    content="对违规违纪事件的分类可分为：<br/> 1.导致罚款的事例；<br/> 2.导致非经济处罚的事例；等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.violationTypes"
                type="textarea"
                :rows="4"
              />
            </el-form-item>

            <el-form-item label="违规违纪事件发生次数">
              <template #label>
                <div>
                  <span> 违规违纪事件发生次数 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.violationCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item label="违规违纪事件处理率">
              <template #label>
                <div>
                  <span> 违规违纪事件处理率 </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.violationHandlingRate"
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
        title="公司治理年度重大事件"
        name="governance-major-events"
      >
        <template #title>
          <div class="collapse-title">
            <span>公司治理年度重大事件 </span>
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
            <el-form-item
              label="包括股本架构改变、兼并重组、投资并购、制度修订等。"
            >
              <template #label>
                <div>
                  <span>
                    包括股本架构改变、兼并重组、投资并购、制度修订等。
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.governanceMajorEvents"
                type="textarea"
                :rows="4"
              />
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
            <span class="description">企业所有权结构和法律组织形式。</span>
          </div>
          -->
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="公司治理类的荣誉认可、被纳入的指数">
              <template #label>
                <div>
                  <span> 公司治理类的荣誉认可、被纳入的指数 </span>
                </div>
              </template>
              <el-input
                v-model="formData.honorsRecognition"
                type="textarea"
                :rows="4"
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
  // Governance Structure and Composition
  governanceStructureDescription: "", // 公司的组织架构，并说明公司最高管治机构及其委员会的构成
  governanceStructureFiles: [], // 附件上传

  // Board Composition List
  boardCompositionFiles: [], // 公司董事会构成名单 附件上传
  boardMemberCount: "", // 董事会成员数量
  boardCommitteeMemberCount: "", // 董事会专门委员会成员数量
  employeeDirectorCount: "", // 职工董事数量
  employeeDirectorRatio: "", // 职工董事占比
  supervisorCount: "", // 监事会成员数量
  employeeSupervisorCount: "", // 职工监事数量
  employeeSupervisorRatio: "", // 职工监事占比

  // Board Diversity Statement
  boardDiversityStatement: "", // 董事会多元化声明
  boardMemberBackground: "", // 董事会成员背景
  femaleDirectorCount: "", // 女性董事数量
  femaleDirectorRatio: "", // 女性董事占比

  // Board Training
  boardTrainingDescription: "", // 董事培训
  boardTrainingFiles: [], // 附件上传
  boardTrainingCount: "", // 董事培训次数
  boardTrainingCoverage: "", // 董事培训覆盖面

  // Board Independence
  boardIndependenceStatement: "", // 董事会独立性声明
  auditCommitteeIndependence: "", // 审计委员会独立性
  esgCommitteeIndependence: "", // 战略与ESG委员会独立性
  remunerationCommitteeIndependence: "", // 薪酬与提名委员会独立性
  independentDirectorCount: "", // 独立董事数量
  independentDirectorRatio: "", // 独立董事占比
  nonExecutiveDirectorCount: "", // 非执行董事数量
  nonExecutiveDirectorRatio: "", // 非执行董事占比
  independentNonExecutiveDirectorCount: "", // 独立非执行董事数量
  independentNonExecutiveDirectorRatio: "", // 独立非执行董事占比

  // Board Nomination and Selection
  boardNominationSelection: "", // 董事会与委员会的提名与遴选

  // Three Meetings Operation
  shareholderMeetingDuties: "", // 股东大会职责
  boardMeetingDuties: "", // 董事会职责
  boardCommitteeDuties: "", // 董事会专门委员会职责
  supervisorMeetingDuties: "", // 监事会职责
  shareholderMeetingCount: "", // 股东大会召开情况-召开次数
  shareholderMeetingResolutionCount: "", // 股东大会召开情况-审议通过项数
  boardMeetingCount: "", // 董事会召开情况-召开次数
  boardMeetingResolutionCount: "", // 董事会召开情况-审议通过项数
  boardCommitteeMeetingCount: "", // 董事会专门委员会召开情况-召开次数
  boardCommitteeMeetingResolutionCount: "", // 董事会专门委员会召开情况-审议通过项数
  supervisorMeetingCount: "", // 监事会召开情况-召开次数
  supervisorMeetingResolutionCount: "", // 监事会召开情况-审议通过项数

  // Executive Compensation
  executiveCompensationPolicy: "", // 高管薪酬政策
  executiveCompensationEsgLink: "", // 高管薪酬与ESG表现挂钩

  // Information Disclosure
  disclosurePrinciple: "", // 信息披露遵循的理念或原则
  disclosureRegulation: "", // 信息披露遵循的法律法规及规范性文件
  regularReportCount: "", // 定期报告发布数
  interimReportCount: "", // 临时报告发布数

  // Investor Interaction
  investorCommunicationChannels: "", // 投资者沟通渠道
  investorCommunicationTypes: "", // 投资者沟通活动类型
  investorInquiryCount: "", // 收到的投资者问询总数
  annualSpeech: "", // 年度领导重要讲话稿
  investorInteractionFiles: [], // 附件上传（投资者互动主表）
  investorInteractionCaseFiles: [], // 附件上传（优秀投资者交流活动案例专用）
  investorReplyRate: "", // 投资者问询答复率
  investorActivityCount: "", // 各类型投资者沟通活动举办次数
  investorActivityCoverage: "", // 各类型投资者沟通活动覆盖人次

  // Investor Education and Protection
  investorEducationPromotion: "", // 投资者教育活动与宣传
  investorEducationFiles: [], // 附件上传
  investorProtectionMeasures: "", // 投资者保护举措
  minorityShareholderProtection: "", // 中小股东保护

  // Philosophy and Goals
  riskManagementPhilosophy: "", // 内控和风险管理理念或管理方针
  riskManagementStrategy: "", // 内控和风险管理战略或总体目标

  // System and Mechanism
  managementStructureDuties: "", // 管理组织架构及职责
  managementCorePolicies: "", // 管理核心制度
  managementProcess: "", // 管理流程
  riskIdentification: "", // 风险识别
  riskResponseMeasures: "", // 风险应对措施

  // Business Ethics Goals
  businessEthicsGoals: "", // 商业道德理念或管理方针以及总体目标

  // SME Fair Treatment (Finance)
  smeFairTreatment: "", // 平等对待中小企业

  // Anti-Corruption
  antiCorruptionStructureDuties: "", // 反腐廉洁组织架构及职责
  antiCorruptionPolicy: "", // 反腐廉洁政策
  corruptionRiskAssessment: "", // 腐败风险评估
  antiCorruptionReportingSystem: "", // 反腐败举报制度
  antiCorruptionReportingChannels: "", // 反腐败举报渠道
  whistleblowerProtectionPolicy: "", // 举报人保护政策
  integrityCommitmentCoverage: "", // 廉洁承诺书覆盖面
  partnerAntiCorruptionSupervision: "", // 对商业伙伴反贪污，贿赂的监管
  integrityCulturePromotion: "", // 廉洁文化宣传渠道与措施
  antiCorruptionFiles: [], // 附件上传
  antiCorruptionIncidents: "", // 反腐败反贿赂发生事件
  integrityCommitmentSigningRate: "", // 廉洁承诺书签署率
  antiCorruptionTrainingParticipants: "", // 反腐败、反贿赂培训人次
  antiCorruptionTrainingTotalHours: "", // 反腐败、反贿赂培训总时长
  antiCorruptionTrainingAvgHours: "", // 反腐败、反贿赂培训人均时长

  // Anti-Monopoly and Fair Competition
  antiMonopolySystem: "", // 反垄断与公平竞争管理体系与制度
  antiMonopolyRiskControl: "", // 反垄断与公平竞争风险控制
  antiMonopolyLitigation: "", // 反垄断与不当竞争诉讼、行政处罚
  antiMonopolyTrainingFiles: [], // 反垄断与公平竞争培训 附件上传
  antiMonopolyTrainingSessions: "", // 反垄断与公平竞争培训场次
  antiMonopolyTrainingParticipants: "", // 反垄断与公平竞争培训人次
  antiMonopolyTrainingTotalHours: "", // 反垄断与公平竞争培训总时长
  antiMonopolyTrainingAvgHours: "", // 反垄断与公平竞争培训人均时长

  // Violation Incidents
  violationHandlingSystem: "", // 针对违规违纪事件的处理制度
  violationTypes: "", // 违规违纪事件类型
  violationCount: "", // 违规违纪事件发生次数
  violationHandlingRate: "", // 违规违纪事件处理率

  // Governance Major Events
  governanceMajorEvents: "", // 包括股本架构改变、兼并重组、投资并购、制度修订等。

  // Honors and Recognition
  honorsRecognition: "" // 公司治理类的荣誉认可、被纳入的指数
});
const emptyFormData = JSON.parse(JSON.stringify(formData.value));

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
                  formData.value[targetKey] +=
                    `${item.userName}: ${contentData[key]}\n`;
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
        console.log("回馈社会：", userItem);
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
//   if (props.activeTab === "corporate-governance" && props.isEdit) {
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
  "corporate-governance"
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

.textAlignStyle {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}
</style>
