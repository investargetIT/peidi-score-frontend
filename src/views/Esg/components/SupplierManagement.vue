<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="目标" name="policy-goals">
        <template #title>
          <div class="collapse-title">
            <span>目标</span>
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
            <el-form-item label="目标、方针及承诺">
              <template #label>
                <div>
                  <span> 目标、方针及承诺 </span>
                  <EsgTooltip
                    content="公司促进供应商管理、供应商可持续发展意识提升的目标、方针及承诺，阐述目标设定考量因素。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.policyCommitment"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="中粮糖业坚持货比三家、择优选择、程序规范、过程透明 的采购原则 ，建立健全采购管理制度和内部控制体系，加强采购制度梳理与完善，增强业务流程建设、采购绩效管理、采购监督管理，从制度上保障对供应商管理的合规有序，保证供应商在公平公正的环境下进行投标或谈判活动， 实现公司采购管理标准化、规范化、高效化。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="目标完成情况">
              <template #label>
                <div>
                  <span> 目标完成情况 </span>
                  <EsgTooltip content="披露报告期内目标实现情况" />
                </div>
              </template>
              <el-input
                v-model="formData.goalCompletionStatus"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="中粮糖业坚持货比三家、择优选择、程序规范、过程透明 的采购原则 ，建立健全采购管理制度和内部控制体系，加强采购制度梳理与完善，增强业务流程建设、采购绩效管理、采购监督管理，从制度上保障对供应商管理的合规有序，保证供应商在公平公正的环境下进行投标或谈判活动， 实现公司采购管理标准化、规范化、高效化。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="体系及策略" name="system-strategy">
        <template #title>
          <div class="collapse-title">
            <span
              >体系及策略
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
            <el-form-item label="组织架构">
              <template #label>
                <div>
                  <span> 组织架构 </span>
                  <EsgTooltip content="公司为开展供应链管理建立的组织架构。" />
                </div>
              </template>
              <el-input
                v-model="formData.organizationStructure"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="政策与制度">
              <template #label>
                <div>
                  <span> 政策与制度 </span>
                  <EsgTooltip
                    content="公司为开展供应商／承包商可持续发展管理制定的政策与制度，及供应链管理所采纳的相关标准／指引 。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.policyAndRegulation"
                type="textarea"
                :rows="4"
                placeholder="我们落实从准入到淘汰的供应商管理闭环，更新《供应商管理制度》，新增I类物资8供应商引入前的考察，更新辅包、 农牧供应商的年度业绩评价标准，完善招标系统供应商管理模块上传要求，实现供应商全生命 周期的数字化高效管理。双汇发展建立《反腐败管理制度》《供应商行为准则》(以下简称为准则)等制度，对合作供应商在环境保护、社会责任、廉洁治理等ESG方面提出有明确的要求和期许。基于该准则，我们倡导供应商积极获取国际标准化组织的管理体系标准认证，规定供应商若确认违反本规范，经提示后，对发生的问题给予应有的纠正或处理，相关表现将纳入供应商评审考量，严重的将给予停止合作或列入黑名单处理。 ——《双汇发展2023年ESG报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="风险管理">
              <template #label>
                <div>
                  <span> 风险管理 </span>
                  <EsgTooltip
                    content="供应链风险管理的基本情况，包括但不限于公司制定的供应链风险管理目标及具体计划、供应链风险应对机制、措施及实施效果；识别、监测和评估公司供应链的环境及社会风险的制度和举措；"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.riskManagement"
                type="textarea"
                :rows="4"
                placeholder="根据BRC准入原则，公司建立《ML/QP842供方管理控制程序》，对现有合格供应商进行高风险、中风险、低风险的分级管理: 高风险材料供应商的准入需满足以下2个条件中任何1个: 1供方通过GFSI认证且样品试样通过; 2供方资质齐全、食品安全等级至少为A级、样品试样通过且现场审核通过或经整改验证通过; 中风险材料供应商的准入需满足以下2个条件中任何1个: 1供方通过HACCP或ISO认证且样品试样通过; 2供方资质齐全、食品安全等级至少为B级且样品试样通过; 低风险材料供应商的准入需满足以下条件: 供方资质齐全、食品安全等级至少为C级且样品试样通过。 ——《上海梅林2023年ESG 暨可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="供应商管理数字化平台">
              <template #label>
                <div>
                  <span> 供应商管理数字化平台 </span>
                  <EsgTooltip
                    content="描述公司建立数字化供应链管理平台，实行供应链全流程线上管理。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.digitalManagementPlatform"
                type="textarea"
                :rows="4"
                placeholder="旺旺依托供应商协同平台(SRM)系统进行平台化的供应链管理，我们已建立包含供应商开发、审核、评估、分级评价等全部环节在内的供应商管理体系，一体化管控供应商从注册报名到资质单管理、 访厂单管理、检验单管理、试车单管理全阶段，提升管理效率。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item title="宣贯及培训" name="training-publicity">
        <template #title>
          <div class="collapse-title">
            <span>宣贯及培训 </span>
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
            <el-form-item label="供应商ESG培训体系">
              <template #label>
                <div>
                  <span>供应商ESG培训体系</span>
                  <EsgTooltip
                    content="描述公司为提高供应商 ESG 意识，开展的内外部专项培训、宣传教育等活动。包括活动具体情况、资金投入、覆盖人数、次数等内容"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.esgTrainingSystem"
                type="textarea"
                :rows="4"
                placeholder="双汇发展注重与合作供应商之间的沟通与交流，通过形式多样、主题丰富的培训帮助供应商提 升可持续发展能力。报告期内我们通过驻厂、电话、书面函件、视频会议等多渠道形式，保障我们与供应商伙伴双方的可持续发展，助推当地产业发展。 对于需要重点帮扶、问题较多的供应商，我们积极通过分析实际案例、解决具体问题等形式与 合作伙伴展开一对一深入沟通，通过对新出现的质量问题开展预防性测试，以提高供应商的可 持续发展管理水平。报告期内，我们共培训原料供应商65家，辅包供应商387家，生猪供应商4,245家，并对异地纸箱、五金供应商133家进行杂质、质量红线管控培训，帮助10家原料供应商恢复正常供应，持续助力供应商成长。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="trainingAttachmentFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.trainingAttachmentFileList"
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
                  <span>开展供应商ESG培训次数</span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.esgTrainingCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>供应商参与ESG培训百分比</span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.esgTrainingParticipationRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>公司内部通过可持续采购培训 的采购员比例</span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.sustainableProcurementRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="准入与评估" name="access-evaluation">
        <template #title>
          <div class="collapse-title">
            <span
              >准入与评估
              <EsgTooltip
                content="GRI 308、GRI 414<br/>
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="供应商ESG审查与评估">
              <template #label>
                <div>
                  <span> 供应商ESG审查与评估 </span>
                  <EsgTooltip
                    content="公司是否在供应商资质预审和后评估中引入反腐败、劳工、环境、安全等可持续发展相关要求，和是否开展尽职调查、如何开展相关考核，以及根据评估结果所采取的处理方式，如报告期内出现供应商的重大违约违法行为，应详细披露处理情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.esgReviewAssessment"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="本年度，本集团更新了供应商审核流 程，将养殖场审核纳入供应商准入审核程序中，增加对供应商养殖体系评价以及兽药使用、兽药引进制度和生物安全 的审核，将食品安全风险前置，综合评估供应商的全产业链能力。本年度，本集团更新了《供应商管理程序》、《供应商食品安全调查问卷》、《供应商文件评估清单》，新建了《养殖场审核清单》、《OEM工厂审核清单》、《供应商绩效评估程序》、《OEM工厂绩效评估程序》。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="签署供应商行为准则">
              <template #label>
                <div>
                  <span> 签署供应商行为准则 </span>
                  <EsgTooltip
                    content="邀请供应商签署行为准则，以承诺可持续发展相关要求，并统计签署该准则的供应商占比。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.codeOfConductSigning"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="双汇发展建立《反腐败管理制度》《供应商行为准则》(以下简称为准则)等制度，对合作供应商在环境保护、社会责任、廉洁治理等ESG方面提出有明确的要求和期许。基于该准则，我们倡导供应商积极获取国际标准化组织的管理体系标准认证，规定供应商若确认违反本规范，经提示后，对发生的问题给予应有的纠正或处理，相关表现将纳入供应商评审考量，严重的将给予停止合作或列入黑名单处理。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>
                    签订包含环境和劳工要求条款 的供应商百分比
                    <EsgTooltip
                      content="公司拟定供应链环境和劳工要求条款，并统计签订条款的供应商百分比"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.envLaborClauseSupplierRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>
                    开展了社会影响评估的供应商数量
                    <EsgTooltip
                      content="社会评估指标包括劳工权益、健康与安全、商业道德等。"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.socialImpactAssessmentSupplierCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 35px">
              <template #label>
                <div>
                  <span>
                    开展了环境影响评估的供应商数量
                    <EsgTooltip
                      content="环境评估指标包括运营、原材料、零件、生产过程的环境影响等。"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.environmentalImpactSupplierCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 45px">
              <template #label>
                <div>
                  <span
                    >经确定为具有实际和潜在重大负面社会影响的供应商数量
                    <EsgTooltip
                      content="若经确定为具有实际和潜在负面环境影响的供应商数量>0，应说明公司采取了何种措施帮助供应商改进，或者是否采取惩处措施，如取消供应商资格。"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.negativeSocialImpactSupplierCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 45px">
              <template #label>
                <div>
                  <span
                    >经确定为具有实际和潜在重大负面环境影响的供应商数量
                    <EsgTooltip
                      content="若经确定为具有实际和潜在负面环境影响的供应商数量>0，应说明公司采取了何种措施帮助供应商改进，或者是否采取惩处措施，如取消供应商资格。"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.negativeEnvironmentalImpactSupplierCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    供应商认证及审核
                    <EsgTooltip
                      content="统计通过环境、社会、质量等可持续发展相关体系认证、审核的供应商数量及比例"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.supplierCertificationCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    供应商认证及审核率
                    <EsgTooltip
                      content="统计通过环境、社会、质量等可持续发展相关体系认证、审核的供应商比例"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.supplierCertificationRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="供应商数量" name="supplier-quantity">
        <template #title>
          <div class="collapse-title">
            <span
              >供应商数量
              <EsgTooltip content="GRI 204" />
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
                  <span>
                    供应商总数
                    <EsgTooltip
                      content="统计供应商总数及按地区划分的供应商数量（以供应商注册地为依据，判断其所处的地区，如华北、东北、华东、华中等"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.supplierTotalCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    向当地供应商采购比例
                    <EsgTooltip
                      content="统计公司向经营所在地的当地供应商采购的产品/服务百分比（'当地'的地理定义由公司自行裁定）"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.localSupplierPurchaseRate"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>%</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    新增供应商数量
                    <EsgTooltip content="统计报告期内新增供应商数量" />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.newSupplierCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>家</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    使用社会标准筛选的新供应商百分比
                    <EsgTooltip content="按评估类型划分的供应商百分比" />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.socialStandardNewSupplierRate"
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
        title="供应商/承包商权益保护"
        name="supplier-contractor-rights"
      >
        <template #title>
          <div class="collapse-title">
            <span> 供应商/承包商权益保护 </span>
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
            <el-form-item label="公平交易">
              <template #label>
                <div>
                  <span> 公平交易 </span>
                  <EsgTooltip
                    content="描述公司开展阳光采购、制定信用条款等保障供应链公平交易的实践。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.fairTrade"
                type="textarea"
                :rows="4"
                placeholder="上海梅林根据《人力资源控制程序》《采购控制程序》《岗位职责任职要求》《物资采购管理办法》的制度，明确 规定采购部门的业务人员的岗位任职要求、业务流程规范。同时公司纪监部门，要求相关采购人员签订《廉洁承诺书》，要求采购人员在思想意识方面严格遵守公司纪律、规定。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="能力建设支持">
              <template #label>
                <div>
                  <span> 能力建设支持 </span>
                  <EsgTooltip
                    content="公司积极推动供应商发展的举措，例如举办供应商大会、为供应商提供培训、建立战略共享机制和平台等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.capacityBuildingSupport"
                type="textarea"
                :rows="4"
                placeholder="同时，我们对标同行业，探索新技术，引进新资源，坚持走出去，引进来的发展理念，组织集团相关部门与行业内龙头企业交流学习，资源共享，深度延伸供应资源价值。2023 年，双汇发展共组织设备、饲料行业和鸡产业供应商技术交流 51 场，组织辅包供应商信息交流 40 场，协同推进集团新产品新产业发展。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="rightsAttachmentFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.rightsAttachmentFileList"
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
const activeCollapse = ref(["policy-goals"]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  policyCommitment: "", // 目标、方针及承诺
  goalCompletionStatus: "", // 目标完成情况
  organizationStructure: "", // 组织架构
  policyAndRegulation: "", // 政策与制度
  riskManagement: "", // 风险管理
  digitalManagementPlatform: "", // 供应商管理数字化平台
  esgTrainingSystem: "", // 供应商ESG培训体系
  trainingAttachmentFileList: [], // 附件上传 (宣贯及培训)
  esgTrainingCount: "", // 开展供应商ESG培训次数
  esgTrainingParticipationRate: "", // 供应商参与ESG培训百分比
  sustainableProcurementRate: "", // 公司内部通过可持续采购培训的采购员比例
  esgReviewAssessment: "", // 供应商ESG审查与评估
  codeOfConductSigning: "", // 签署供应商行为准则
  envLaborClauseSupplierRate: "", // 签订包含环境和劳工要求条款的供应商百分比
  socialImpactAssessmentSupplierCount: "", // 开展了社会影响评估的供应商数量
  environmentalImpactSupplierCount: "", // 开展了环境影响评估的供应商数量
  negativeSocialImpactSupplierCount: "", // 经确定为具有实际和潜在重大负面社会影响的供应商数量
  negativeEnvironmentalImpactSupplierCount: "", // 经确定为具有实际和潜在重大负面环境影响的供应商数量
  supplierCertificationCount: "", // 供应商认证及审核
  supplierCertificationRate: "", // 供应商认证及审核率
  supplierTotalCount: "", // 供应商总数
  localSupplierPurchaseRate: "", // 向当地供应商采购比例
  newSupplierCount: "", // 新增供应商数量
  socialStandardNewSupplierRate: "", // 使用社会标准筛选的新供应商百分比
  fairTrade: "", // 公平交易
  capacityBuildingSupport: "", // 能力建设支持
  rightsAttachmentFileList: [] // 附件上传 (供应商/承包商权益保护)
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
</style>
