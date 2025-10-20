<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item
        title="应对气候变化-战略与目标"
        name="climate-strategy-goals"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              应对气候变化-战略与目标
              <EsgTooltip content="Wind评级、交易所可持续发展报告指引" />
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
            <el-form-item label="气候变化目标与承诺">
              <template #label>
                <div>
                  <span> 气候变化目标与承诺 </span>
                  <EsgTooltip
                    content="公司在应对气候变化工作的目标设定，阐述目标设定考量因素"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.policyCommitment"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="年度目标完成情况">
              <template #label>
                <div>
                  <span> 年度目标完成情况 </span>
                  <EsgTooltip content="并披露报告期内目标实现情况" />
                </div>
              </template>
              <el-input
                v-model="formData.goalCompletionStatus"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="应对气候变化-管理及策略"
        name="climate-management-strategy"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >应对气候变化-管理及策略
              <EsgTooltip content="Wind评级、交易所可持续发展报告指引" />
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
            <el-form-item label="监管与执行组织架构">
              <template #label>
                <div>
                  <span> 监管与执行组织架构 </span>
                  <EsgTooltip
                    content="公司为应对气候变化对公司战略、生产经营带来的风险和机遇建立的管理机制，包括组织架构、监管机制、政策与制度等，需披露董事会的监督情况以及管理层在其中起到的作用。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.policyAndRegulation"
                type="textarea"
                :rows="6"
                placeholder="为适应公司战略与可持续发展需要，进一步增强公司核心竞争力与可持续发展能力，伊利在董事会层面设立董事会战略与   可持续发展委员会，委员会由八名董事组成（包括两名独立董事） ，由公司董事长兼总裁潘刚担任委员会主任委员。董事   会战略与可持续发展委员会主要负责对长期发展战略规划进行研究并提出建议、指导可持续发展工作、审阅公司年度可持续发展工作计划（包含可持续发展战略、温室气体管理、水资源管理等）  及执行情况，督促公司可持续发展计划的实施等。       董事会战略与可持续发展委员会下设可持续发展管理办公室，负责伊利集团可持续发展工作的战略监督及管理、跨部门协调及能力建设等工作，以支撑战略有效落地。在'执行层'共设立   8 个可持续发展关键议题工作组，覆盖碳中和、水资源管理、责任采购、可持续农业、包装与废弃物、   营养与健康、商业道德与 ESG 信息披露，关键议题工作组由总部职能部门、各产品事业部可持续发展联络员组成，负责具   体工作推进。——《伊利股份2023年可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="政策制度">
              <template #label>
                <div>
                  <span> 政策制度 </span>
                  <EsgTooltip
                    content="公司为应对气候变化对公司战略、生产经营带来的风险和机遇建立的管理机制，包括组织架构、监管机制、政策与制度等，需披露董事会的监督情况以及管理层在其中起到的作用。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.riskManagement"
                type="textarea"
                :rows="4"
                placeholder="作为中国食品行业第一家发布双碳目标及路线图的企业，伊利根据中国'双碳'战略指引及集团现状，发布了《伊利集团零碳未来计划》《伊利集团零碳未来计划路线图》，制定并优化《伊利集团零碳未来计划—碳达峰碳中和工作推进方案》，明确了集团的'双碳'目标、实施路径及具体行动，切实推动碳中和目标达成。     ——《伊利股份2023年可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="风险管理">
              <template #label>
                <div>
                  <span> 风险管理 </span>
                  <EsgTooltip
                    content="需披露公司的气候相关风险识别、评估和管理流程，以及如何将这些流程纳入公司全面风险管理流程和战略中。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.climateRiskManagement"
                type="textarea"
                :rows="4"
                placeholder="为提升应对气候变化的韧性   ，有效把握和控制气候相关风险与机遇，伊利遵循'目标 - 风险 - 控制'的内部控制核心理念， 搭建'风险 / 缺陷识别 - 风险 / 缺陷整改监控 -   审计评价'  全员参与的三道防线管理机制，将气候相关风险纳入自身风险评估体系中。伊利定期针对直接运营、供应链上下游进行气候变化相关风险和机遇的识别与评价，依据《气候变化相关财   务信息披露指引（TCFD）》并参考《国际财务报告可持续披露准则》（ IFRS Sustainability Disclosure   Standards），使用TCFD 风险分类框架及公司特定的风险与机遇评估模型，识别、分析与评估集团在未来短期、中期和长期运营过程中，   可能发生的气候相关风险和机遇以及相应财务影响。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="气候风险识别与应对">
              <template #label>
                <div>
                  <span> 气候风险识别与应对 </span>
                  <EsgTooltip
                    content="需披露：<br/>     1.公司关于气候变化对其战略和商业模式影响的评估情况，以及应对相关影响的方法<br/>     2.公司在评估其气候适应性时考虑的重大不确定性因素<br/>     3.公司在短期、中期和长期内为适应气候变化调整其战略和商业模式的能力<br/>     4.公司采用情景分析等方式进行气候适应性评估，并披露情景分析关键假设、分析过程等（鼓励）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.climateRiskIdentificationResponse"
                type="textarea"
                :rows="4"
                placeholder="为了准确识别气候变化对我们业务的影响，从而更全面地部署风险应对方案与识别商业机遇，我们参考气候、宏观环境、产业政策等相关文献研究，并结合双汇发展自身业务情况，根据政府间气候变化专门委员会（IPCC）采用的典型浓度路径（Representative   Concentration Pathways，RCP）假设和央行与监管机构绿色金融网络（Network for Greening the   Financial System, NGFS）的排放情景，选取了全球温度上升的三种不同的气候情景，分别对照2度以下，2度以及2度以上情景对自身业务和上下游产业链产生的影响进行了识别与评估。我们根据气候变化风险类别，结合各部门的职能和责任进行了风险匹配。由管理层牵头并参与的气候变化专项访谈共15场，期间就各项气候风险的企业适应性和恢复力等关键课题进行了深度讨论。我们依据内部风险管控惯例设定了三个时间维度（短期：3年内，中期：3年–5年，长期：5年以上），结合上方展示的预计影响水平，位处高风险暴露的运营地占比情况，结合内部深入讨论和外部研究，运用定性和定量分析方法，综合定义出气候变化风险对公司的影响程度。     ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="气候转型计划">
              <template #label>
                <div>
                  <span> 气候转型计划 </span>
                  <EsgTooltip
                    content="需披露： <br/>    1.公司为应对气候相关风险和机遇而对当前和未来战略、商业模式和资源分配进行调整的情况 <br/>    2.公司已经或者计划为直接或间接应对气候相关风险和机遇所采取的改进生产工艺、更新设备等措施 <br/>    3.公司为应对气候相关风险和机遇所制定的转型计划，及制定该计划所依赖的基本假设 <br/>    4.公司为实施转型计划提供的资源 <br/>    5.公司实施转型计划的进展情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.climateTransitionPlan"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item
        title="应对气候变化-温室气体排放"
        name="climate-ghg-emissions"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >应对气候变化-温室气体排放
              <EsgTooltip content="GRI 305、Wind评级、交易所可持续发展报告指引"
            /></span>

            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
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
                    范围1温室气体排放量
                    <EsgTooltip
                      content="范围1排放是来自公司拥有和控制的资源的直接排放"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.scope1GhgEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>吨二氧化碳当量</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>范围2温室气体排放量</span>
                  <EsgTooltip
                    content="范围2排放是来自公司拥有和控制的资源的间接排放"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.scope2GhgEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>吨二氧化碳当量</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span
                    >范围3温室气体排放量
                    <EsgTooltip
                      content="范围3排放是报告公司价值链中发生的所有间接排放（不包括在范围2中）（鼓励）     企业需注意范围3温室气体排放被细分为多个类别，企业需披露盘查了哪些类别。"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.scope3GhgEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>吨二氧化碳当量</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span
                    >温室气体排放总量
                    <EsgTooltip
                      content="范围1+范围2+范围3温室气体排放量     企业需披露核算温室气体排放量所依据的标准、方法、假设或计算工具，并说明排放量的合并方法（如股权比例、财务控制、运营控制等）"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.totalGhgEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>吨二氧化碳当量</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span
                    >温室气体排放强度
                    <EsgTooltip content="温室气体排放总量/公司营业收入" />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.ghgEmissionIntensity"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>吨二氧化碳当量/万元</span>
              </div>
            </el-form-item>
            <el-form-item label="温室气体排放核查">
              <template #label>
                <div>
                  <span> 温室气体排放核查 </span>
                  <EsgTooltip
                    content="聘请第三方机构对公司温室气体排放等数据进行核查或鉴证"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.ghgVerification"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="ghgVerificationAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.ghgVerificationAttachmentFileList"
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
            <el-form-item label="按分类的温室气体排放情况">
              <template #label>
                <div>
                  <span> 按分类的温室气体排放情况 </span>
                  <EsgTooltip
                    content="企业可按照以下分类中合适的进行披露：（鼓励）<br/>     1.业务单位或设施；<br/>     2.国家或地区；<br/>       3.来源类型（燃烧、加工、电力、供暖、制冷和蒸汽等）分类提供"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.ghgEmissionsByCategory"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="温室气体减排量">
              <template #label>
                <div>
                  <span> 温室气体减排量 </span>
                  <EsgTooltip
                    content="需披露：<br/>     1.因减排举措直接减少的温室气体排放，以CO2当量公吨数表示<br/>     2.被纳入计算的气体的类型<br/>     3.基准年或基线，并说明选择该年作为基准年或基线的理由<br/>     4.减排发生的范畴:是直接(范畴1)、能源直接(范畴2)和/或其他接(范畴3)<br/>       5.使用的标准、方法、假设和/或计算工具"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.ghgReductionAmount"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="产品碳足迹">
              <template #label>
                <div>
                  <span> 产品碳足迹 </span>
                  <EsgTooltip
                    content="沿着产品的整个生命周期，包括从原材料的开采、制造、运输、分销、使用到最终废弃阶段所产生的温室气体排放量。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productCarbonFootprint"
                type="textarea"
                :rows="6"
                placeholder="双汇发展在推进节能减碳的过程中，于报告期内参照《温室气体核算体系：企业核算与报告准则》《温室气体核算体系：企业价值链（范围三）核算与报告标准》，采用运营控制法，组织开展了上下游以及自身运营活动核心环节的温室气体排放现状盘查工作。我们全面梳理了肉制品加工、养殖、采购、包装制造、物流运输、零售经营等主营及配套服务温室气体清单，新增生猪、家禽畜养过程中的甲烷排放源。通过碳盘查，我们全面、准确地把握价值链中的能耗种类及其碳排放分布，为科学规划减排目标和实施路径夯实基础。报告期内，双汇发展的温室气体排放总量（范围一+范围二）为1,196,832.53吨二氧化碳当量，其中，范围一的排放量为443,838.17吨二氧化碳当量；范围二的排放量为752,994.36吨二氧化碳当量。范围三排放是企业价值链温室气体排放的重要组成部分，报告期内我们首次核算了双汇发展价值链上的温室气体排放，其中外购商品和服务、已售产品的使用、已售产品的加工占我们范围三排放的90%以上。范围三的排放量为18,139,397.38吨二氧化碳当量。     ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item
        title="应对气候变化-气候变化实践"
        name="access-evaluation"
      >
        <template #title>
          <div class="collapse-title">
            <span
              >应对气候变化-气候变化实践
              <EsgTooltip content="Wind评级、交易所可持续发展报告指引" />
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
            <el-form-item label="减碳技术研发">
              <template #label>
                <div>
                  <span> 减碳技术研发 </span>
                  <EsgTooltip
                    content="公司在减/零碳产品研发和使用、减碳技术和设备的研发与行业应用方面的相关实践"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.carbonReductionTechnology"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="报告期内，为进一步减少碳排放，公司各个基地从生产工艺管理、供热站技改、光伏发电等多个方面进行节能减排工作。从多方面开展节能减排工作。节能减排部分案例如下：新疆供热站低压蒸汽管网运行优化项目：新疆基地对整体蒸汽管网用户使用情况与设计对标，找到优化点，通过调整外供蒸汽压力使整体电厂汽耗率下降   0.2Kg/Kwh, 预计全年节约标煤约 3.38 万吨，减少碳排放约 8.78 万吨。     ——《梅花生物2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="减碳技术行业应用">
              <template #label>
                <div>
                  <span> 减碳技术行业应用 </span>
                  <EsgTooltip
                    content="公司在减/零碳产品研发和使用、减碳技术和设备的研发与行业应用方面的相关实践"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.carbonReductionIndustryApplication"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="咖啡、鸡尾酒及茶饮的理想冲调伴侣。率先践行减碳、零碳责任，国内首家'零碳工厂'推出的甘蔗糖浆，品质达国标精制级，为国内用糖企业提供更高效、更节能、更绿色的解决方案。配合升级物流方案，好糖走出'碳足迹'。     ——《中粮糖业2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="carbonReductionTechAttachmentFileList"
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
                  formData.carbonReductionTechAttachmentFileList
                "
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
            <el-form-item label="低/零碳产品研发">
              <template #label>
                <div>
                  <span> 低/零碳产品研发 </span>
                  <EsgTooltip
                    content="公司在减/零碳产品研发和使用、减碳技术和设备的研发与行业应用方面的相关实践"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.lowCarbonProductRAndD"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="伊利为消费者提供5款'碳中和'产品，由权威第三方机构遵循ISO 14067:2018《温室气体 - 产品碳足迹 - 量化要求 和指南》及 PAS 2060:2014《碳中和论证规范》要求，颁发《产品碳足迹核查意见声明》及《碳中和宣告核查声明》，通过清洁能源替代、购买绿色电力、推动分布式光伏发电、采用可回收包装、降低运输排放、购买碳抵消等方式，实现产品全生命周期碳中和。具体内容详见《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="lowCarbonProductRAndDAttachmentFileList"
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
                  formData.lowCarbonProductRAndDAttachmentFileList
                "
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
            <el-form-item label="节能减排实践">
              <template #label>
                <div>
                  <span> 节能减排实践 </span>
                  <EsgTooltip
                    content="公司在运营过程中开展节能减排、节能降碳实践，需说明因重新设计生产流程、改造设备、改进工艺、更换燃料等减排措施直接减少的能源消耗量/温室气体排放量"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.energySavingPractice"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="伊利积极引入各类生产工艺减碳、节能降碳等新技术，包括梯度供冷、永磁电机节能、闪蒸汽回收、热泵技术等多种节能减碳技术，并广泛开展工艺改善类项目、节水减排类项目、节能降耗类项目等   6 大类型节能推广项目，项目覆盖2023 年伊利共开展节能减排项1,153 项覆盖生产与运营所在地。伊利集团绿电使用比例达19.99%伊利累计 41   家分子公司获得国家级'绿色工厂'认证。所有核心生产设施。2023 年，伊利共开展节能减排项目 1,153 项，100% 覆盖   生产与运营所在地，共计节约电量 6,432 万千瓦时、节约蒸汽 6 万吨、节约能源消耗 1.91 万吨标煤。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="energySavingMeasuresAttachmentFileList"
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
                  formData.energySavingMeasuresAttachmentFileList
                "
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
            <el-form-item label="清洁生产举措">
              <template #label>
                <div>
                  <span> 清洁生产举措 </span>
                  <EsgTooltip
                    content="公司清洁生产举措，如清洁生产审核、零排放技改、光伏发电、余热利用等先进公益和节能措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.cleanProductionMeasures"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="光明乳业秉持绿色生产理念，持续节能增效，不断提高能源和资源的使用效率，积极推广清洁能源使用，将节能减碳措施融入生产运营的各环节之中，最大化降低生产运营对环境所造成的影响。公司积极开发新能源，利用工厂屋顶资源，建设分布式光伏发电站，所发电力全部自用。其中，2023年郑州工   厂以合同能源管理的形式，建成分布式光伏发电站，装机容量2.43MW。加上已经投入运营的中心工厂、射阳工厂、益民一厂光伏发电站，共发电915.01万度电，全部自用。随着SAP   项目上线，公司电子运单实现全覆盖。同时应用绿色技术装备，对仓库现有制冷设备、设施进行节能   改造，完成康桥一号库、二号库的优化整合，实现节电约140万度，节约电费约100万左右。     ——《光明乳业2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="cleanProductionMeasuresAttachmentFileList"
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
                  formData.cleanProductionMeasuresAttachmentFileList
                "
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
            <el-form-item label="价值链节能减排推广与实践">
              <template #label>
                <div>
                  <span> 价值链节能减排推广与实践 </span>
                  <EsgTooltip content="公司鼓励价值链伙伴开展节能减碳实践" />
                </div>
              </template>
              <el-input
                v-model="formData.valueChainEnergySavingPractice"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="伊利积极发挥行业内'领头羊'作用，通过培训赋能、打造碳中和物料、加强节能减碳项目合作等方式，助力供应链实现低碳转型及绿色发展。邀请全球第三方机构专家，通过伊利集团'伊起赢'平台为合作供应商开展    双碳管理赋能培训，向供应商传授低碳转型的方法、路径、节能项目实施等内容，组织具备双碳管理工作经验的供应商（利乐、罗盖特） 分享成功经验，   全面提升供应商碳管理水平。2023年，伊利在平台共开展 3 次双碳管理直    播培训，供应商在线人数共计 800 余人，直播回放浏览超 3,000   人次。协同内外部相关方开展物料替换工作，优先采购行业新型环保材料，减少原材料生产、使用过程的碳排放，2023 年实现减碳 3.28   万吨。选择核心供应商作为优先推进对象，完成碳盘查核证，积极推动原材料供应商打造碳中和物料。2023 年，伊利已成功推动 6   家供应商完成碳中和核查认证，并获取碳中和证书，加快供应商绿色低碳转型。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="valueChainEnergySavingAttachmentFileList"
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
                  formData.valueChainEnergySavingAttachmentFileList
                "
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
            <el-form-item label="碳排放数字化平台">
              <template #label>
                <div>
                  <span> 碳排放数字化平台 </span>
                  <EsgTooltip content="报告期内公司碳排放数字化平台建设情况" />
                </div>
              </template>
              <el-input
                v-model="formData.carbonEmissionDigitalPlatform"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="伊利自主搭建   EHSQ   信息管理系统，利用信息化手段，实现对碳排放源的追溯与碳排放数据的自动计算与评估，并通过统计分析报表和大数据视图，实时呈现全集团各管控区域的排放情况，为跟进碳中和战略目标的达成提供依据。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="减碳项目投入数量及金额">
              <template #label>
                <div>
                  <span> 减碳项目投入数量及金额 </span>
                  <EsgTooltip content="报告期内公司减碳项目投入数量及金额" />
                </div>
              </template>
              <el-input
                v-model="formData.carbonReductionProjectInvestment"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="参与/交易碳抵消项目">
              <template #label>
                <div>
                  <span> 参与/交易碳抵消项目 </span>
                  <EsgTooltip content="公司参与/交易碳抵消项目情况" />
                </div>
              </template>
              <el-input
                v-model="formData.carbonOffsetProjectParticipation"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="中国石化积极参与全国碳排放权交易市场，制定实施《中国石化碳交易管理办法》，规范企业碳配额履约行为。公司组建专职碳交易团队，统筹控排企业配额盈缺情况，科学制定碳交易计划，开展碳交易集中管理，确保下属企业全部按期完成碳配额履约任务。2022   年，中国石化共有15 家企业参与全国碳交易市场，19 家企业参与试点地区碳市场，碳交易量为 241 万吨。     ——《中国石化2022年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="碳抵消项目数量及投入">
              <template #label>
                <div>
                  <span> 碳抵消项目数量及投入 </span>
                  <EsgTooltip content="公司参与/交易碳抵消项目数量及投入" />
                </div>
              </template>
              <el-input
                v-model="formData.carbonOffsetProjectInvestment"
                type="textarea"
                :rows="4"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item
        title="应对气候变化-绿色投融资（财务）"
        name="climate-green-finance"
      >
        <template #title>
          <div class="collapse-title">
            <span>应对气候变化-绿色投融资（财务） </span>
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
            <el-form-item label="绿色投融资实践">
              <template #label>
                <div>
                  <span> 绿色投融资实践 </span>
                  <EsgTooltip
                    content="报告期内公司开展绿色投融资实践活动，及报告期内公司绿色投融资金额"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.greenFinancePractice"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="伊利集团创新产业链金融模式，推出了'青贮贷'、'牧场贷'等一系列金融产品， 在资金额度、还款期限、放款周期方面综合考量牧场需求， 解决牧场发展资金问题。 2023 年，发放融资贷款约 40.17 亿元，其中 12.6 亿元用于支持内蒙古自治区牧场发展。 ——《伊利股份2023可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="应对气候变化-行业合作"
        name="climate-industry-cooperation"
      >
        <template #title>
          <div class="collapse-title">
            <span> 应对气候变化-行业合作 </span>
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
            <el-form-item label="加入气候变化倡议、组织">
              <template #label>
                <div>
                  <span> 加入气候变化倡议、组织 </span>
                  <EsgTooltip
                    content="公司加入气候变化倡议情况，包括组织的名称及数量"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.fairTrade"
                type="textarea"
                :rows="4"
                placeholder="伊利股份支持和发起的应对气候变化相关计划与倡议：《企业与生物多样性承诺书》签署方，可持续棕榈油圆桌倡议组织成员，联合国   COP28《 为人类、自然和气候转变粮食体系：共同行动倡议 （CTA）》签署方，联合国全球契约组织'加速前进'倡议承诺企业。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="climateInitiativeAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.climateInitiativeAttachmentFileList"
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
            <el-form-item label="参加/开展气候变化活动、论坛">
              <template #label>
                <div>
                  <span> 参加/开展气候变化活动、论坛 </span>
                  <EsgTooltip
                    content="公司参加/开展气候变化活动、论坛情况，包括名称、其中角色和数量"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.climateCooperationProjects"
                type="textarea"
                :rows="4"
                placeholder="参加《联合国气候变化框架公约》第二十七次缔约方大会（COP27）'基于自然的解决方案推动气候和生物多样性协同治理'边会，介绍中国石油推进气候变化应对与生物多样性保护协同治理的创新实践。     ——《中国石油2022年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="climateActivityAttachmentFileList"
            >
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.climateActivityAttachmentFileList"
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
      <el-collapse-item title="环境管理-战略与目标" name="env-management-goals">
        <template #title>
          <div class="collapse-title">
            <span> 环境管理-战略与目标 </span>
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
            <el-form-item label="环境保护目标、理念与承诺">
              <template #label>
                <div>
                  <span> 环境保护目标、理念与承诺</span>
                  <EsgTooltip content="公司是否制定环境保护愿景、目标与承诺" />
                </div>
              </template>
              <el-input
                v-model="formData.envProtectionGoals"
                type="textarea"
                :rows="4"
                placeholder="公司始终坚持环保是生存线和生命力的理念，高度重视环境保护工作，专门指定相关部门整体负责公司的环境保护工   作，经过多年的发展，培养了一支专业的环保人才队伍，主动实施污染物治理从高、从远、从严、从优的标准。设计并   建成了高效节能低耗的生产装置及'三废处理装置',确保生产过程中产生的污染物排放符合国家和地方相关排放标准。     ——《中宠食品股份有限公司2023年度社会责任报告》"
              />
            </el-form-item>
            <el-form-item label="年度目标完成情况">
              <template #label>
                <div>
                  <span> 年度目标完成情况 </span>
                  <EsgTooltip content="报告期内公司目标完成情况" />
                </div>
              </template>
              <el-input
                v-model="formData.envGoalCompletionStatus"
                type="textarea"
                :rows="4"
                placeholder="作为行业领军者，伊利设立并持续推动'12/50'双碳目标的实现，已在   2012  年率先实现范围 1 及范围 2 碳达峰，力争在 2050   年前实现全产业链碳中和，  并制定了 2030、2040、2050   三阶段具体目标，积极探索行业低碳发展新模式。     ——《伊利股份2022年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="环境管理-体系与策略"
        name="env-management-system-strategy"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              环境管理-体系与策略
              <EsgTooltip content="Wind评级" />
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
            <el-form-item label="荣誉及奖项">
              <template #label>
                <div>
                  <span> 荣誉及奖项 </span>
                  <EsgTooltip
                    content="描述公司获得的环保相关外部奖项名称、颁发单位及数量，包括但不限于应对气候变化、排放物管理、生物多样性保护等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envHonors"
                type="textarea"
                :rows="4"
                placeholder="伊利荣获'碳中和领域创新企业奖，成为乳制品行业 唯一获奖单位；伊利供应链双碳管理工作荣获 2023 年'年度低碳先锋奖CSR 单项奖；伊利入选生态环境部首批工 业园区减污降碳协同增效典 型案例 ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="envHonorsAttachmentFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.envHonorsAttachmentFileList"
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
            <el-form-item label="监管与执行组织架构">
              <template #label>
                <div>
                  <span> 监管与执行组织架构 </span>
                  <EsgTooltip
                    content="描述公司为开展环境保护活动建立的管理组织架构"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envMgmtOrg"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="政策、制度">
              <template #label>
                <div>
                  <span> 政策、制度 </span>
                  <EsgTooltip content="减少环境影响的政策、制度" />
                </div>
              </template>
              <el-input
                v-model="formData.envPolicyRegulation"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="与环境相关的考核与激励">
              <template #label>
                <div>
                  <span> 与环境相关的考核与激励 </span>
                  <EsgTooltip
                    content="公司是否将降低环境影响纳入员工及高管绩效考核与激励体系中"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envAssessmentIncentive"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="通过环境管理体系认证">
              <template #label>
                <div>
                  <span> 通过环境管理体系认证 </span>
                  <EsgTooltip
                    content="描述公司通过国内外环境管理体系认证的情况，包括通过 ISO 14000、 GB / T 24001-2016认证等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envSystemCertification"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="envSystemCertificationAttachmentFileList"
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
                  formData.envSystemCertificationAttachmentFileList
                "
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
      <el-collapse-item
        title="环境管理-环保预警及应急"
        name="env-management-emergency"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              环境管理-环保预警及应急
              <EsgTooltip content="Wind评级、交易所可持续发展报告指引" />
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
            <el-form-item label="环保预警及应急管理机制">
              <template #label>
                <div>
                  <span> 环保预警及应急管理机制 </span>
                  <EsgTooltip
                    content="公司识别、监测和评估潜在的环境风险或紧急情况，采取措施预防和减少可能的环境影响，针对各种环境事故制定并演练应急预案。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envEmergencyManagement"
                type="textarea"
                :rows="4"
                placeholder="公司为提高突发环境事件应对能力,预防突发环境事件及其造成的损害,建立了突发环境事件应急预案,并报保护局进行备案,确保事件发生时能够迅速、有序、高效地进行应急处置。     ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="应急培训、应急演练">
              <template #label>
                <div>
                  <span> 应急培训、应急演练 </span>
                  <EsgTooltip
                    content="描述报告期内公司开展应急培训、应急演练活动，并统计次数"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envEmergencyTraining"
                type="textarea"
                :rows="4"
                placeholder="公司为提高突发环境事件应对能力,预防突发环境事件及其造成的损害,建立了突发环境事件应急预案,并报保护局进行备案,确保事件发生时能够迅速、有序、高效地进行应急处置。     ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="envEmergencyTrainingAttachmentFileList"
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
                  formData.envEmergencyTrainingAttachmentFileList
                "
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

            <el-form-item label="环保违法违规事件与处罚">
              <template #label>
                <div>
                  <span> 政策、制度 </span>
                  <EsgTooltip
                    content="公司报告期内环保违法违规的情况。如存在处罚事件，     需说明处罚原因、结果及整改措施。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envViolationPenalty"
                type="textarea"
                :rows="4"
                placeholder="一鸣食品秉承'遵守法律法规、推进节能降耗、营造绿色环境、实现环境友好'的环保方针,   严格遵守国家法律法规及标准的要求,制定《环境及职业健康安全管理手册》《环境保护安全管理手册》等环境管理制度报告期内,公司未发生违反环保法律法规或受监管部门处罚的情况。——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    环境污染罚款额
                    <EsgTooltip
                      content="报告期内公司由于违反环境相关法律所支付的所有罚款的总额"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.envPollutionFine"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>万元</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="环境管理-环境影响评估"
        name="env-management-impact-assessment"
      >
        <template #title>
          <div class="collapse-title">
            <span> 环境管理-环境影响评估 </span>
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
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    开展环境影响评估的项目数
                    <EsgTooltip
                      content="报告期内公司开展环境影响评估的项目总数"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.envImpactAssessmentProjectCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>个</span>
              </div>
            </el-form-item>
            <el-form-item label="管理有关环境影响的行动">
              <template #label>
                <div>
                  <span> 管理有关环境影响的行动 </span>
                  <EsgTooltip
                    content="公司在规划和建设项目的全流程中，对可能造成的环境影响进行分析、预测和评估，采取预防或者降低负面环境影响的具体措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envImpactMgmtActions"
                type="textarea"
                :rows="4"
                placeholder="工厂编制突发环境事件风险评估报告及突发环境事件应急预案，并在当地生态环境局完成备案；定期实施应急演练工作，并评估应急预案有效性。——《光明乳业2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="envImpactMgmtActionsAttachmentFileList"
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
                  formData.envImpactMgmtActionsAttachmentFileList
                "
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
      <el-collapse-item
        title="环境管理-突发重大环境事件"
        name="env-management-major-incidents"
      >
        <template #title>
          <div class="collapse-title">
            <span> 环境管理-突发重大环境事件 </span>
            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="突发重大环境事件起数">
              <template #label>
                <div>
                  <span> 突发重大环境事件起数 </span>
                  <EsgTooltip
                    content="报告期内突发重大环境事件的发生日期、地点和持续时间，事件等级、事件处理方式和处理结果，对公司、社会公众的影响以及整改措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envMajorIncidentsCount"
                type="textarea"
                :rows="4"
                placeholder="2022年，留有记录的严重泄漏事件及重大逸散事件为0起。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="环保实践-生产环保实践"
        name="env-practice-production"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              环保实践-生产环保实践 <EsgTooltip content="Wind评级"
            /></span>

            <el-icon class="collapse-icon"></el-icon>
          </div>
        </template>
        <div class="form-section">
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
                    运营、生产中采用环保技术和设备
                    <EsgTooltip
                      content="描述报告期内公司在运营和生产中采用环保技术和设备的实践"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.envProductionPractice"
                type="textarea"
                :rows="4"
                placeholder="依托先进的研发工具、专业的研发团队和丰富的合作研发经验，伊利持续开展可持续包材的研发以及应用转化工作，推动 可持续包材战略高效落地。2023 年，伊利在可持续包材技术研发与应用领域获得 16 项重要奖项，其中 3个项目被鉴定为国内或国际领先，持续发挥在产业链中的引领作用，共建可持续包材生态圈。伊 利 集 团 包 装 研 究 中 心 于 2021 年 引 入 包 装   生 命 周 期 碳 排 放 计 算 工 具 PIQET（Packaging Impact Quick Evaluation Tool），用于包装可持续改善过程中的碳排放计算及环境影响评估。2023年，PIQET 已在全部事业单元的包装设计环节进行应用，帮助伊利将包装可持续评价完美融入到业务决策中。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="环境监测活动">
              <template #label>
                <div>
                  <span> 环境监测活动 </span>
                  <EsgTooltip
                    content="描述企业按照环境保护法律法规要求，为掌握本单位的污染物排放状况及其对周边环境质量的影响等情况，组织开展环境监测活动。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envMonitoringActivities"
                type="textarea"
                :rows="4"
                placeholder="根据国家相关法律法规的严格规定，公司制定废水、废气以及厂界噪声等关键项目的环境自行监测方案，按照既定要求开展监测工作，各项污染物排放指标均达到了国家相关标准的要求。     ——《洽洽食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="环保项目">
              <template #label>
                <div>
                  <span> 环保项目 </span>
                  <EsgTooltip
                    content="公司开展和加入的环保项目，如生态恢复与治理、公益造林等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envProjects"
                type="textarea"
                :rows="4"
                placeholder="伊利与中国绿化基金会合作，在中国'四大沙尘源'之首阿拉善地区种植10万棵梭梭树，打造'梭梭保护林'，构健绿色生态屏障，助力荒漠化综合防治。同时，   伊利发起'我有一棵梭梭树'互动活动，鼓励消费者为宝宝认领一棵专属梭梭树，号召更多的家庭加入到绿化家园的行动中来。此外，伊利邀请 38个重点母婴连  锁系统合作伙伴共同开启'零碳有机绿色公益行'植树活动，前往内蒙古阿拉善，亲手种下梭梭树，助力建立美丽'生态墙'。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="envProjectsAttachmentFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.envProjectsAttachmentFileList"
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
            <el-form-item label="环保投入资金">
              <template #label>
                <div>
                  <span> 环保投入资金 </span>
                  <EsgTooltip
                    content="1.年度投入环保资金总额     2.环保总投入占营业收入的比例     根据公司实际情况对环保相关投入进行汇总统计。     环保总投入主要应包含：环保设备投入、环保技术研发费用、环保管理与培训投入、环保税费与罚款、环保监测与评估投入等。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.envInvestmentAmount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item label="公司环保宣贯、培训次数及覆盖人数">
              <template #label>
                <div>
                  <span> 公司环保宣贯、培训次数及覆盖人数 </span>
                  <EsgTooltip
                    content="描述公司对董事、高管、员工及供应商等开展的环保培训和宣传活动，包括但不限于应对气候变化、环境管理体系、废弃物管理、环境应急预案、生物多样性保护等主题，需说明活动具体情况、资金投入、覆盖人数、次数等内容"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.envTrainingPublicity"
                type="textarea"
                :rows="4"
                placeholder="伊利积极发挥行业内'领头羊'作用，通过培训赋能、打造碳中和物料、加强节能减碳项目合作等方式，助力供应链实现低碳转型及绿色发展。邀请全球第三方机构专家，通过伊利集团'伊起赢'平台为合作供应商开展    双碳管理赋能培训，向供应商传授低碳转型的方法、路径、节能项目实施等内容，组织具备双碳管理工作经验的供应商（利乐、罗盖特） 分享成功经验，   全面提升供应商碳管理水平。2023年，伊利在平台共开展 3 次双碳管理直 播培训，供应商在线人数共计 800 余人，直播回放浏览超 3,000   人次。     ——《伊利股份2023可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="envTrainingPublicityAttachmentFileList"
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
                  formData.envTrainingPublicityAttachmentFileList
                "
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
      <el-collapse-item
        title="环保实践-绿色办公"
        name="env-practice-green-office"
      >
        <template #title>
          <div class="collapse-title">
            <span> 环保实践-绿色办公 </span>
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
            <el-form-item label="绿色办公">
              <template #label>
                <div>
                  <span> 绿色办公</span>
                  <EsgTooltip
                    content="公司绿色办公政策或措施，以及数据绩效。包括但不限于：夏季空调温度不低于26度；办公区采用节能灯具照明，人走灯灭；办公区生活用水回收再利用；推广无纸化办公，纸张双面使用；办公垃圾科学分类；推行视频会议减少员工出行等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.greenOfficePolicy"
                type="textarea"
                :rows="4"
                placeholder="集团积极推进无纸化办公，在生产端、管理端、营销端大力推进移动办公和电子化留痕，包括电子合同、差旅费控、报表电子化、过程管控流程再造系统化、记录自动化数字化等，确保纸质版的文件大幅降 低，减少对纸张的使用，全年合计省A4 纸约734.4千克。 ——《安井食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="资源使用-目标与方针" name="resource-use-goals">
        <template #title>
          <div class="collapse-title">
            <span>
              资源使用-目标与方针
              <EsgTooltip content="Wind评级、交易所可持续发展报告指引"
            /></span>
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
            <el-form-item label="资源使用效益目标、方针及承诺">
              <template #label>
                <div>
                  <span> 资源使用效益目标、方针及承诺</span>
                  <EsgTooltip
                    content="描述公司制定的节约资源或资源回收再利用的量化目标及实践举措。包括能源、水资源、包装材料等多种资源。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.resourceUseEfficiencyGoalStatus"
                type="textarea"
                :rows="4"
                placeholder="节约资源是保护生态环境的重要根本。双汇发展重视水资源利用效率，确立了'轻量化、定制化、可循环'的包装材料使用指导原则，并持续减少食物损耗及浪费，将减少自然资源消耗的理念融入从工厂到消费者手中的各个环节。     ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="资源使用效益目标完成情况">
              <template #label>
                <div>
                  <span> 资源使用效益目标完成情况</span>
                </div>
              </template>
              <el-input
                v-model="formData.resourceUseEfficiencyGoalCompletion"
                type="textarea"
                :rows="4"
                placeholder="中航重机顺利完成2022   年资源使用工作，例如水资源管理方面万元增加值用水量下降16%，能源管理方面非化石能源消费比重达20%等。     ——《中航重机2022年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="资源使用-管理及策略"
        name="resource-use-management-strategy"
      >
        <template #title>
          <div class="collapse-title">
            <span> 资源使用-管理及策略 <EsgTooltip content="Wind评级" /></span>
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
            <el-form-item label="执行组织架构">
              <template #label>
                <div>
                  <span> 执行组织架构</span>
                  <EsgTooltip
                    content="描述公司为提升资源使用率建立的管理组织架构"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.resourceUseOrganizationStructure"
                type="textarea"
                :rows="4"
                placeholder="公司严格按照'党政同责、一岗双责'要求，坚持'三管三必须'原则，建立了资源节约与生态环境保护责任制体系。公司及各下属企业均成立了资源节约与生态环境保护领导小组，各级部门协调配合，形成共促绿色高质量发展合力。公司承担     管理责任，负责监督、指导、协调和服务工作；各下属企业承担直接责任，负责具体落实生态环境保护相关工作。     ——《国投中鲁2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="政策与制度">
              <template #label>
                <div>
                  <span> 政策与制度 </span>
                  <EsgTooltip
                    content="描述公司制定的有效使用资源的政策与制度"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.resourceUsePolicySystem"
                type="textarea"
                :rows="4"
                placeholder="国投中鲁贯彻执行《中华人民共和国节约能源法》等国家与地方相关法律法规与标准，持续开展节能减排技改，加强全过     程管控，强化监督考核，有效提升能源利用效率。同时，在生产和物流环节，积极提高清洁能源利用水平，降低对传统能     源的依赖，降低碳排放，推动节能工作提质增效。     ——《国投鲁中2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item label="能源管理体系认证">
              <template #label>
                <div>
                  <span> 能源管理体系认证 </span>
                  <EsgTooltip
                    content="描述公司通过能源管理体系ISO 50001认证的情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.energyManagementSystemCertification"
                type="textarea"
                :rows="4"
                placeholder="2023年，伊利共 46 家工厂通过 ISO 50001:2018 能源管理体系认证，较 2022 年增加 27.8 %，全面提升能源管理水平。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="energyManagementSystemCertificationAttachmentFileList"
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
                  formData.energyManagementSystemCertificationAttachmentFileList
                "
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
      <el-collapse-item title="资源使用-能源使用" name="resource-use-energy">
        <template #title>
          <div class="collapse-title">
            <span>
              资源使用-能源使用
              <EsgTooltip
                content="GRI 302、Wind评级、交易所可持续发展报告指引"
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
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    电力
                    <EsgTooltip
                      content="报告期内企业使用的通过电网输送的电量。
不包括工作现场发电机产生的电量。"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.electricityConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    热力
                    <EsgTooltip content="报告期内企业外购热力" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.heatConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    蒸汽
                    <EsgTooltip content="报告期内蒸汽消耗量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.steamConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    煤炭
                    <EsgTooltip content="报告期内煤炭消耗量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.coalConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    液化天然气
                    <EsgTooltip content="报告期内液化天然气用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.lngConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    天然气
                    <EsgTooltip content="报告期内天然气用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.naturalGasConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    燃料油
                    <EsgTooltip content="报告期内燃料油用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.fuelOilConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    润滑油
                    <EsgTooltip content="报告期内润滑油用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.lubricantConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    柴油
                    <EsgTooltip content="报告期内柴油用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.dieselConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    汽油
                    <EsgTooltip content="报告期内汽油用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.gasolineConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    液化石油气
                    <EsgTooltip content="报告期内液化石油气用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.lpgConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    其它石油制品
                    <EsgTooltip content="报告期内其他石油制品的用量" />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.otherPetroleumProductsConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    清洁能源使用量
                    <EsgTooltip
                      content="描述公司在报告期内清洁能源发电量及使用总量、使用比例（风能、光伏、水能、生物能等）"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.renewableEnergyUsage"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    组织内部的能源消耗量
                    <EsgTooltip
                      content="组织内部的能源消耗量=消耗的不可再生燃料+消耗的可再生燃料+购买的用于消耗的电力、供暖、制冷和蒸汽+未消耗的自产性电力、供暖、制冷和蒸汽-售出的电力、供暖、制冷和蒸汽"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.organizationInternalEnergyConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    组织外部的能源消耗量
                    <EsgTooltip
                      content="计算方法同上     注：组织外部指价值链上下游     上游包括'1. 购买的商品和服务 2. 资本货物 3. 与燃料和能源相关的活动（不包括上一项的值） 4. 上游运输和配送 5. 运营中产生的废物 6.   出差 7. 员工通勤 8. 上游租赁资产 9.其他上游'    下游包括'9. 下游运输和配送 10. 所售产品的加工 11. 所售产品的使用 12. 所售产品的报废处理 13. 下游租赁资产 14. 特许经营   15. 投资其他下游"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.externalEnergyConsumption"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    节能实践
                    <EsgTooltip
                      content="需披露由节约和能效举措直接促成的节能量，需注明 <br/>    1. 节能量中包含的能源类型； <br/>    2. 是燃料、电力、供暖、制冷、蒸汽还是全部； <br/>    3. 计算节能量所使用的依据，例如基准年或基线，包括做出选择的理由； <br/>    4. 使用的标准、方法、假设和 / 或计算工具"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.energySavingMeasures"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    能源强度
                    <EsgTooltip
                      content="本项数据可以是'组织内部的能源消耗量'也可以是'组织外部的能源消耗量'与分母的比值，但需注明选择范围、包含的能源类型、分母为每百万营收"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.energyIntensity"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    降低产品和服务的能源需求
                    <EsgTooltip
                      content="需披露公司在报告期内达到的所售产品和服务的能源减少量<br/> 1. 计算节能量所使用的依据，例如基准年或基线，包括做出选择的理由； <br/> 2. 使用的标准、方法、假设和 / 或计算工具"
                    />
                  </span>
                </div>
              </template>
              <el-input
                v-model="formData.energySavingAmount"
                type="textarea"
                :rows="1"
                placeholder="单位：千瓦时或吨标准煤、%"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="资源使用-水资源使用" name="resource-use-water">
        <template #title>
          <div class="collapse-title">
            <span> 资源使用-水资源使用 <EsgTooltip content="GRI 303" /></span>

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
            <el-form-item label="组织与水（作为共有资源）的相互影响">
              <template #label>
                <div>
                  <span> 组织与水（作为共有资源）的相互影响</span>
                  <EsgTooltip
                    content="需披露：<br/>     1.   组织如何与水资源相互影响，包括取水、耗水和排水的方式与地点，造成的或增加的水资源相关影响，或组织的活动、产品或服务透过商业关系直接产生的水资源相关影响（如，径流造成的影响）。<br/>     2. 用于确定水资源相关影响的方法，包括评估范围、时间框架、采用的任何工具或方法。<br/>     3. 处理水资源相关影响的方式，包括组织如何与利益相关方合作，可持续管理作为共有资源的水，如何与具有水资源相关重大影响的供应商或客户合作。<br/>     4. 说明在组织的管理方法中，制定任何水资源相关目标的过程，以及此等管理方法如何适应存在用水压力的各地区公共政策和地方背景"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.waterIntake"
                type="textarea"
                :rows="4"
                placeholder="伊利构建了涵盖'决策层 -   组织层 - 执行层'的水资源管理架构，在董事会层面设立董事会战略与可持续发展委员会，委 员会由八名董事组成（包括两名独立董事）   ，伊利集团董事长兼总裁潘刚担任委员会主任委员。董事会战略与可持续发展   委员会主要负责对长期发展战略规划进行研究并提出建议、指导可持续发展工作、审阅公司年度可持续发展工作计划（包   含可持续发展战略、水资源管理等）及执行情况，督促公司可持续发展计划的实施等。董事会战略与可持续发展委员会下设可持续发展管理办公室，负责伊利集团可持续发展（包含水资源管理）工作的战略监   督及管理并向董事会战略与可持续发展委员会进行定期汇报。水资源的日常管理、项目推动、技术支持和指导由伊利集团   安全生产管理部负责，并每季度向公司可持续发展管理办公室进行汇报。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="取水">
              <template #label>
                <div>
                  <span> 取水 </span>
                  <EsgTooltip
                    content="需披露： <br/>    1. 来自所有地区的总取水量，以及按（1. 地表水；2. 地下水；3. 海水；4. 工艺水；5. 第三方设施）披露的明细数据（如适用）<br/>    2. 来自存在用水压力的所有地区的总取水量，以及按（1. 地表水；2. 地下水；3. 海水；4. 工艺水；5. 第三方设施）披露的明细数据（如适用）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.surfaceWaterIntake"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="耗水">
              <template #label>
                <div>
                  <span> 耗水 </span>
                  <EsgTooltip
                    content="需披露： <br/>    1. 所有地区的总耗水量。 <br/>    2. 所有地区的耗水强度。     2. 存在用水压力的所有地区的总耗水量。     3. 采用的标准、方法和假设     耗水量=总取水量-总排水量     耗水强度=总耗水量/每百万营收"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.waterConsumption"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="资源使用-资源节约" name="resource-use-saving">
        <template #title>
          <div class="collapse-title">
            <span>
              资源使用-资源节约
              <EsgTooltip content="Wind评级、交易所可持续发展报告指引"
            /></span>
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
            <el-form-item label="资源节约实践">
              <template #label>
                <div>
                  <span> 资源节约实践</span>
                  <EsgTooltip
                    content="公司在节能、节水、节约资源等方面的产品研发、设备改造、流程优化等实践"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.waterSavingMeasures"
                type="textarea"
                :rows="4"
                placeholder="水资源作为乳品行业不可或缺的资源,   在公司的生产运营中承担着重要的角色。公司遵循《中华人民共和国水法》等法律法规, 加强公 司用水管理,贯彻落实国家节水行动。公司不断加大节水改造力度,   建成投用(智慧节水)互联平台, 改造了均质机冷却水回用系统、杀菌机蒸汽冷凝水回用系统、CIP   清洗水二次回用系统,有效降低了水费、排污费支出，实现节水减排。     ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="waterSavingMeasuresAttachmentFileList"
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
                  formData.waterSavingMeasuresAttachmentFileList
                "
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
      <el-collapse-item
        title="资源使用-原材料与包装材料（供应链）"
        name="resource-use-materials-packaging"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              资源使用-原材料与包装材料（供应链）
              <EsgTooltip
                content="GRI 301、<br/>交易所可持续发展指引<br/>Wind评级"
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
            <el-form-item label="原材料与包装材料管理体系与制度">
              <template #label>
                <div>
                  <span> 原材料与包装材料管理体系与制度</span>
                  <EsgTooltip
                    content="指企业为了确保其产品在生产过程中所使用的原材料和包装材料的质量、安全、合规性以及可持续性，而建立的一系列管理流程和规定"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.materialEfficiencyMeasures"
                type="textarea"
                :rows="4"
                placeholder="伊利致力于为消费者提供可持续的产品，从原料阶段关注其可持续性，积极推行绿色采购。我们制定并发布原材料可持续 采购政策，鼓励优先采购具有可持续认证的原材料、持续加强原材料溯源工作；制定《可再生农业及基地管理方案》。
——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="原材料与包装材料管理目标与规划">
              <template #label>
                <div>
                  <span> 原材料与包装材料管理目标与规划</span>
                  <EsgTooltip
                    content="指企业在生产和供应链管理中，为了优化原材料和包装材料的使用，降低成本，提高效率，确保产品质量和合规性，而设定的一系列目标和制定的计划"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.packagingOptimization"
                type="textarea"
                :rows="4"
                placeholder="通过现场审核的方式定期监控上游果蔬制品基地的水源、土壤、化肥及农药使用等信息，并向农户提供可再生农业相关技术 培训，减少化肥使用对生态环境的影响，持续降低供应链毁林风险，改善供应链的环境影响。
——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    所用物料的重量或体积
                    <EsgTooltip
                      content="用于生产和包装主要产及服务的物料的总质量或体积，并按'所使用的不可再生材料','所使用的可再生材料'分类"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.materialTotalWeightOrVolume"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
                <span>吨/立方米</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    所使用的回收再利用的物料
                    <EsgTooltip
                      content="所使用的回收再利用的物料百分比=所使用的回收再利用的物料总量/所使用的物料总量 * 100%"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.recycledMaterialUsage"
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
                    回收产品及其包装材料
                    <EsgTooltip
                      content="回收产品及其包装材料百分比=在报告期内回收的产品及其包装材料/在报告期内售出的产品 * 100% 注：需按产品类别披露；可分开披露产品和包装的循环利用率"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.recycledProductAndPackaging"
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
        title="治污减排-目标与方针"
        name="pollution-control-goals"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              治污减排-目标与方针
              <EsgTooltip content="交易所可持续发展报告指引"
            /></span>

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
            <el-form-item label="减排目标、方针与承诺">
              <template #label>
                <div>
                  <span> 减排目标、方针与承诺</span>
                  <EsgTooltip content="描述公司制定的治污减排目标及实践举措" />
                </div>
              </template>
              <el-input
                v-model="formData.wasteReductionMeasures"
                type="textarea"
                :rows="4"
                placeholder="伊利制定《环境保护可持续发展目标体系》，形成以碳排放量为一级目标，综   合能耗及水、电、气、汽、冷等使用量为二、三级目标的完整体系，实现目标 的有效支撑。     ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="年度目标完成情况">
              <template #label>
                <div>
                  <span> 年度目标完成情况 </span>
                  <EsgTooltip content="报告期内公司目标完成情况" />
                </div>
              </template>
              <el-input
                v-model="formData.waterIntakeGoalStatus"
                type="textarea"
                :rows="4"
                placeholder="在国家碳达峰、碳中和目标行动指引下，梅花生物坚持技术与管理并重的原则，持续降低产品能源消耗。基于绿色生物合成制造的可持续发展理念，我们鼓励全体员工对节约能源、减少碳排放提出合理化建议，对提出合理化建议实施后获得显著成效的，按规定对建议人给予奖励。同时，公司董事会战略委员会定期监督气候变化相关目标及指标的完成情况，并进行定期绩效考核，确保相关部门遵守设定的目标。报告期内，我们实现了年度的二氧化碳减排目标。     ——《梅花生物2023年度ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="治污减排-管理及策略"
        name="pollution-control-management-strategy"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              治污减排-管理及策略
              <EsgTooltip content="交易所可持续发展报告指引"
            /></span>

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
            <el-form-item label="监管与执行组织架构">
              <template #label>
                <div>
                  <span> 监管与执行组织架构</span>
                  <EsgTooltip
                    content="描述公司为开展排放物管理建立的组织架构"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.pollutionControlOrgStructure"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="政策制度">
              <template #label>
                <div>
                  <span> 政策制度 </span>
                  <EsgTooltip
                    content="公司为减少生产经营产生废弃物总量的政策和管理制度。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.pollutionControlPolicy"
                type="textarea"
                :rows="4"
                placeholder="我们制定了《废气管理规范》《固体废弃物管理规范》《污水处理站安全运行标准化》等管理制度，推行清洁生产，改善工业污染源产生的废水、废气和固体废弃物排放情况，尽可能减少或消除自身运营对环境的影响。——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="排放监测与排污许可">
              <template #label>
                <div>
                  <span> 排放监测与排污许可 </span>
                  <EsgTooltip
                    content="排污合规管理及举措、排污许可证书数量（鼓励）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.emissionMonitoringPermit"
                type="textarea"
                :rows="4"
                placeholder="光明乳业严格遵循污染防治相关法律法规，新建项目严格履行了环评、'三同时'制度，在废气、废水、噪声、固体废弃物、环境污染隐患排查等多个方面进行严格把控，确保各项污染物合规处理，确保达标排放17家工厂全部实施排污许可管理，  全部环保设施运行正常。按照许可证规定的监测频次对各类污染物实施监测，按期提交排污许可证执行报告，主动公开环境信息。     ——《光明乳业2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="治污减排-废气排放"
        name="pollution-control-air-emissions"
      >
        <template #title>
          <div class="collapse-title">
            <span> 治污减排-废气排放 <EsgTooltip content="GRI 305" /> </span>

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
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    臭氧消耗物质（ODS）的排放量
                    <EsgTooltip
                      content="需披露：     1.ODS 的生产、进口和出口，以 CFC-11(三氣氟甲烷)当量公吨数表示     2.纳入计算的物质     3.使用的排放因子的来源     4.使用的标准、方法、假设和/或计算工具     ODS产生量=生产的ODS-使用批准的技术销毁的ODS-在其他化学品的生产中完全用作原料的ODS"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.odsEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    氮氧化物（NOx）排放量
                    <EsgTooltip
                      content="需披露：<br/>     1.使用的排放因子的来源<br/>     2.使用的标准、方法、假设和/或计算工具"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.noxEmissionsAmount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    硫氧化物（SOx）排放量
                    <EsgTooltip
                      content="需披露：<br/>     1.使用的排放因子的来源<br/>     2.使用的标准、方法、假设和/或计算工具"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.soxEmissionsAmount"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    持久性有机污染物（POP）排放量
                    <EsgTooltip
                      content="需披露：<br/>     1.使用的排放因子的来源<br/>     2.使用的标准、方法、假设和/或计算工具"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.popEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    挥发性有机化合物（VOC）排放量
                    <EsgTooltip
                      content="需披露：<br/>     1.使用的排放因子的来源<br/>     2.使用的标准、方法、假设和/或计算工具"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.vocEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    危害性空气污染物（HAP）排放量
                    <EsgTooltip
                      content="需披露：<br/>     1.使用的排放因子的来源<br/>     2.使用的标准、方法、假设和/或计算工具"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.hapEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>
                    颗粒物质（PM）排放量
                    <EsgTooltip
                      content="需披露：<br/>     1.使用的排放因子的来源<br/>     2.使用的标准、方法、假设和/或计算工具"
                    />
                  </span>
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.pmEmissions"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="治污减排-废水排放"
        name="pollution-control-water-discharges"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              治污减排-废水排放
              <EsgTooltip content="GRI 303、交易所可持续发展报告指引" />
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
            <el-form-item label="管理与排水相关的影响">
              <template #label>
                <div>
                  <span> 管理与排水相关的影响</span>
                  <EsgTooltip
                    content="说明污水排放的最低标准，以及确定这些标准的方式，包括：（鼓励） <br/>    1. 对于在没有地方排放要求的地点运营的设施，如何确定标准； <br/>    2. 任何内部制定的水质标准或准则； <br/>    3. 考虑使用的具体行业标准或国家标准； <br/>    4. 是否考虑了受纳水体的情况。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteWaterTreatmentMeasures"
                type="textarea"
                :rows="4"
                placeholder="废水治理是公司及生产型子公司污染源治理工作的重点及难点。公司确保废水达标排放，不断提高废水回用比例，减少新水用量。公司工厂污染物可生化性能好，采用厌氧好氧工艺法处理。处理后的污水排入城镇下水道。污水排放指标优于国家、地方标准。     ——《光明乳业2023年可持续发展报告"
              />
            </el-form-item>
            <el-form-item label="排水">
              <template #label>
                <div>
                  <span> 排水 </span>
                  <EsgTooltip
                    content="需披露：       1.向所有地区的总排水量（兆升），以及按（地表水、地下水、海水、输送至其他组织供其作为第三方设施使用的排水及其总量）细分的明细数据（如适用）     2.向所有地区的总排水量（淡水、其他水）明细数据（兆升）     3.向存在用水压力的所有地区的总排水量（淡水、其他水）明细数据（兆升）     4.排水处理中的重点关注物质（需注明 1.确定重点关注物质的方法，所用的任何国际标准、权威清单或标准 2.对重点关注物质设定排放标准限制的方法   3.未遵守排放标准限制的次数）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteWaterDischargeTotal"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="氨氮排放量">
              <template #label>
                <div>
                  <span> 氨氮排放量 </span>
                  <EsgTooltip
                    content="公司通过污水等方式排放的氨氮的数量（鼓励"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.waterPollutants"
                type="textarea"
                :rows="4"
                placeholder="2023年，一鸣食品氨氮排放量为3.55吨。     ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="化学需氧量排放量">
              <template #label>
                <div>
                  <span> 化学需氧量排放量 </span>
                  <EsgTooltip
                    content="报告期内公司产生的化学需氧量数量（鼓励）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteWaterDischargeIntensity"
                type="textarea"
                :rows="4"
                placeholder="2023年，一鸣食品废水化学需氧量排放量为24.4吨。     ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="其它特征污染物">
              <template #label>
                <div>
                  <span> 其它特征污染物 </span>
                  <EsgTooltip content="排放废水中产生的其他污染物（鼓励）" />
                </div>
              </template>
              <el-input
                v-model="formData.wasteWaterRecyclingRate"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="治污减排-固废处理"
        name="pollution-control-solid-waste"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              治污减排-固废处理
              <EsgTooltip
                content="GRI 306、Wind评级、交易所可持续发展报告指引"
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
            <el-form-item label="有害废物排放总量">
              <template #label>
                <div>
                  <span> 有害废物排放总量</span>
                  <EsgTooltip
                    content="需披露：<br/>     1.报告期内有害废弃物总量（吨）<br/>     2.每百万营收产生的有害废弃物总量（吨/CNY）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.hazardousWasteTotal"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="无害废物排放总量">
              <template #label>
                <div>
                  <span> 无害废物排放总量</span>
                  <EsgTooltip
                    content="需披露：     1.报告期内除有害废物之外的其他废弃物的总量（吨）     2.每百万营收产生的无害废弃物总量（吨/CNY）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.nonHazardousWasteTotal"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="从处置中转移的废弃物">
              <template #label>
                <div>
                  <span> 从处置中转移的废弃物</span>
                  <EsgTooltip
                    content="需披露：     1.从处置中再利用、循环、其他回收作业的废弃物总吨数，并按照'有害废弃物、无害废弃物及具体类型'、'现场及场外'进行细分     2.每百万营收废弃物回收利用总量（吨/CNY）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteTransferredFromDisposal"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="进入处置的废弃物">
              <template #label>
                <div>
                  <span> 进入处置的废弃物</span>
                  <EsgTooltip
                    content="需披露：进入处置的废弃物总吨数，并按'处置类型'、'有害废弃物、无害废弃物及具体类型'、'现场及场外'细分     处置类型：1.火力发电 2.垃圾焚烧（不含发电）3.填埋 4.其他垃圾处理措施"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteDisposalMethods"
                type="textarea"
                :rows="4"
                placeholder="双汇发展的屠宰和养殖业务均产生有害废弃物、一般固体废物和动物粪便三类固体废弃物。我们的排放物主要来源于生产和养殖环节。在生产运营过程中，双汇发展不断改进生产工艺与设施，优化排放物处理处置方式，从设施和管理两个方面降低污染物排放浓度。双汇发展亦注重养殖过程中的排放物产生的环境影响，开展通过优化饲料肉料比、饲料添加剂的相关研究，减少饲料消耗，从源头减少粪污产生，力求实现粪污减量化的目标。在常规处理方式18的基础上，我们开展专项研究推进养殖业的粪污处理工作，与第三方能源公司合作使用鸡粪制备生物质天然气，通过定向优先使用生物质天然气、价格优惠的方式，实现粪污资源化利用。报告期内，西华基地合作项目已10月份投入运行，日处理鸡粪400吨，日产天然气1万m³，后续将继续扩大产能，未来计划将合作项目拓展至阜新基地。我们于本年度将养殖业猪粪、鸡粪，及产生加工业务的滞销品、废品等纳入定量目标，报告期内，双汇发展养殖端所产生的猪粪和鸡粪已100%实现循环利用。2023年实现回收利用的废弃物1,439,813.9   吨，处置废弃物6,349.2吨。     ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="治污减排-治污减排实践"
        name="pollution-control-practice"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              治污减排-治污减排实践
              <EsgTooltip content="GRI 306、Wind评级、交易所可持续发展报告指引"
            /></span>
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
            <el-form-item label="废弃物管理体系与制度">
              <template #label>
                <div>
                  <span> 废弃物管理体系与制度</span>
                  <EsgTooltip
                    content="指企业或组织为了有效管理其在生产、运营过程中产生的废弃物，确保环境的可持续性和遵守相关法律法规，而建立的一套系统化的管理流程和规定"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.hazardousWasteManagement"
                type="textarea"
                :rows="4"
                placeholder="洽洽食品安环部制定《危险废物管理制度》《供应链运营中心'三废'合规处理规定》等制   度，搭建以公司主要负责人为领导核心，各部门主管为坚实支柱的污染物管理网络，实现 对污染物的全面掌控和有效治理。     ——《恰恰食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="废弃物管理目标与规划">
              <template #label>
                <div>
                  <span> 废弃物管理目标与规划 </span>
                  <EsgTooltip
                    content="企业为了有效处理废弃物而制定的一系列目标和计划"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteReductionTargets"
                type="textarea"
                :rows="4"
                placeholder="不断压实主体责任，聚焦滤泥、堆场和粉尘、恶臭逸散区域，持续开展综合治理，     通过飞行检查、环保核查、生态环境绩效评价等方式，持续提升生态环保绩效。     ——《中粮糖业2023ESG报告》"
              />
            </el-form-item>
            <el-form-item label="废弃物的产生及废弃物相关重大影响">
              <template #label>
                <div>
                  <span> 废弃物的产生及废弃物相关重大影响 </span>
                  <EsgTooltip
                    content="需披露公司的何种生产及服务（如提炼、加工、材料采购、产品或服务设计、生产、分销）会产生什么样的废弃物，这些废弃物在产生后会带来怎样的负面影响（如废弃塑料包装进入水体，可能造成海洋污染）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.circularEconomyPractices"
                type="textarea"
                :rows="4"
                placeholder="双汇发展的屠宰和养殖业务均产生有害废弃物、一般固体废物和动物粪便三类固体废弃物。我们的排放物主要来源于生产和养殖环节。
——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="废弃物相关重大影响的管理">
              <template #label>
                <div>
                  <span> 废弃物相关重大影响的管理 </span>
                  <EsgTooltip
                    content="需披露公司如何减少自身及价值链上下游产生的废弃物，并管理废弃物带来的负面影响（如进行废弃包装循环）；     若自身活动产生的废弃物交由第三方处理，需披露公司如何确认第三方对废弃物的处理合法合规；     需披露公司如何收集和监测废弃物相关的数据"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.circularEconomyInitiatives"
                type="textarea"
                :rows="4"
                placeholder="在生产运营过程中，双汇发展不断改进生产工艺与设施，优化排放物处理处置方式，从设施和管理两个方面降低污染物排放浓度。双汇发展亦注重养殖过程中的排放物产生的环境影响，开展通过优化饲料肉料比、饲料添加剂的相关研究，减少饲料消耗，从源头减少粪污产生，力求实现粪污减量化的目标。在常规处理方式18的基础上，我们开展专项研究推进养殖业的粪污处理工作，与第三方能源公司合作使用鸡粪制备生物质天然气，通过定向优先使用生物质天然气、价格优惠的方式，实现粪污资源化利用。报告期内，西华基地合作项目10月份投入运行，日处理鸡粪400吨，日产天然气1万m³，后续将继续扩大产能，未来计划将合作项目拓展至阜新基地。我们于本年度将养殖业猪粪、鸡粪，及产生加工业务的滞销品、废品等纳入定量目标，报告期内，双汇发展养殖端所产生的猪粪和鸡粪已100%实现循环利用。——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="废弃物存放">
              <template #label>
                <div>
                  <span> 废弃物存放 </span>
                  <EsgTooltip
                    content="公司按照国家及监管要求存放废弃物，降低其对环境的影响"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteStorage"
                type="textarea"
                :rows="4"
                placeholder="公司严格遵守国家及所在运营地的法律法规要求，制定并实施了《固体废物管理办法》，对所有活动中产生的生活垃圾、不可回收利用工业垃圾、可回收利用工业垃圾和危险废弃物的处置进行全面有效的管理。——《金龙鱼2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="废弃物运送">
              <template #label>
                <div>
                  <span> 废弃物运送 </span>
                  <EsgTooltip
                    content="公司安全、合规运输废弃物，避免泄露，降低其对环境的影响"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.wasteTransport"
                type="textarea"
                :rows="4"
                placeholder="针对一般固体废物，我们积极探索适用的技术以提高固体废物的综合利用率，并提升废弃物处置的工艺及设备，推动废弃物减量化、资源化和无害化。同时，我们通过改进生产工艺、调整产品结构、开展清洁生产等多项措施，从源头减少废弃物的产生。针对危险废物，我们严格落实对其产生、收集、贮存、运输、利用、处置全过程的环境管理要求，依法对危险废物的暂存场所进行升级改造，交由有资质的第三方处置单位进行资源化利用或无害化处置，最大限度地降低废弃物对环境产生的影响。截至2023   年底，公司已经试点建立了 2 家'无废工厂'，另有 2 家子公司正在推进申报工作。——《金龙鱼2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="产业价值" name="industry-value">
        <template #title>
          <div class="collapse-title">
            <span> 产业价值 <EsgTooltip content="GRI 413" /></span>
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
            <el-form-item label="助力生态文明建设">
              <template #label>
                <div>
                  <span> 助力生态文明建设</span>
                  <EsgTooltip
                    content="描述公司产业发展助力当地生态文明建设情况，及相关项目基本情况和综合价值"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.greenSupplyChain"
                type="textarea"
                :rows="4"
                placeholder="西红柿作物是'用水大户'，生长全过程每亩需用水 460 余方。西红柿公司引进国际先进节水技术，采用'膜下双滴灌'，将水精确地输送到西红柿根部周围 35 厘米处。到采收季节，引导农户提前停水，既节约了宝贵的水资源，又提高了西红柿固形物含量，降低了青果率和烂果率。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="生物多样性保护-目标与方针"
        name="biodiversity-goals"
      >
        <template #title>
          <div class="collapse-title">
            <span> 生物多样性保护-目标与方针 </span>
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
            <el-form-item label="生物多样性保护目标、方针与承诺">
              <template #label>
                <div>
                  <span> 生物多样性保护目标、方针与承诺</span>
                  <EsgTooltip
                    content="描述公司制定的生物多样性保护量化目标及实践举措"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityPolicy"
                type="textarea"
                :rows="4"
                placeholder="公司充分认识到生物多样性对于维持地球生态平衡具有关键作用 . 保护生物多样性也是实现可持续发展的重要保障 . 我们积极响应联 合国《生物多样性公约》以及中国政府《关于进-步加强生物多样性保护的意见》.致力于推动生物多样性保护和生态可持续发展。我们承诺不在任何生态红线禁止开发区域内进行生产经营活动 . 公司的工厂和经营场所均经过环境影响评价 . 充分评估其对生态环境 的影响.对项目建设期和运营期各个阶段的生态保护要求做出规定.最大限度降低运营过程对生态环境的影响。 ——《一鸣食品2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="年度目标完成情况">
              <template #label>
                <div>
                  <span> 年度目标完成情况 </span>
                  <EsgTooltip content="报告期内公司目标完成情况" />
                </div>
              </template>
              <el-input
                v-model="formData.waterRiskManagement"
                type="textarea"
                :rows="4"
                placeholder="为首个签署联合国《企业与生物多样性承诺书》 的中国企业，伊利坚持人与自然和谐共生，通过'伊利家园行动'在生物多样 性保护方面进行了诸多探索与实践，连续 6 年发布《生物多样性保护报告》，详细阐述其每年在生物多样性方面的目标完成情况。 ——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="生物多样性保护-管理及策略"
        name="biodiversity-management-strategy"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              生物多样性保护-管理及策略
              <EsgTooltip content="GRI 301、交易所可持续发展指引"
            /></span>
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
              style="margin-bottom: 50px"
              label="组织所拥有、租赁、在位于或邻近于保护区和保护区外生物多样性丰富区域管理的运营点"
            >
              <template #label>
                <div>
                  <span>
                    组织所拥有、租赁、在位于或邻近于保护区和保护区外生物多样性丰富区域管理的运营点</span
                  >
                  <EsgTooltip
                    content="对于组织所拥有、租赁、在位于或邻近于保护区和保护区外的生物多样性丰富区域管理的每个运营点，报告如下信息： 1.地理位置； 2.可能由组织拥有、租赁或管理的地表和地下土地； 3.与保护区（在区域内、与之毗邻或含有部分保护区）或保护区外生物多样性丰富区域有关的位置； 4.经营类型（办公、制造、生产或采掘）； 5.经营场地的规模，以平方公里表示（如适用，或以另一种单位表示）； 6.以保护区或保护区外生物多样性丰富区域（陆地、淡水或海洋生态系统）的属性为特征的生物多样性价值； 7.以受保护状态名录（例如 IUCN 保护区管理类别、拉姆萨尔公约、国家法规）为特征的生物多样性价值。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityOperatingLocations"
                type="textarea"
                :rows="4"
                placeholder="如《水井坊环境方针》所承诺，我们不对物种、栖息地、生物多样性造成持久破坏。在保护生物多样性方面，我们遵守各项法律法规，响应全球生物多样性框架、联合国可持续发展目标、《濒危野生动植物种国际贸易公约（CITES）》等国际倡议。我们承诺在全价值链环节，包括原材料采购、生产运营等，持续减少生态足 迹，致力于达成'无净损失'（No net loss, NNL）。我们承诺净零毁林，不参与开发法定生态保护区，不将具有高度生态保护价值的区域及其周边地区用于生产运营，避免对受威胁和受保护物种造成负面影响，禁止濒危野生动植物贸易（包括但不限于 CITES 所列濒危物种——《水井坊2023ESG报告》"
              />
            </el-form-item>
            <el-form-item label="活动、产品和服务对生物多样性的重大影响">
              <template #label>
                <div>
                  <span> 活动、产品和服务对生物多样性的重大影响 </span>
                  <EsgTooltip
                    content="在以下的一个或多个方面，对生物多样性的重大直接和间接影响的性质： 1.制造厂的建造或使用； 2.污染（从点源和非点源引进栖息地的非天然的物质）； 3.引进入侵物种、害虫和病原体； 4.物种减少； 5.栖息地转变； 6.自然变化范围之外的生态过程变化（如盐度或地下水位变化）。 在以下方面的重大直接和间接的正面和负面影响： 1.受影响的物种； 2.受影响区域的范围； 3.影响持续时间； 4.影响的可逆性或不可逆性。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityMajorImpact"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="受保护或经修复的栖息地">
              <template #label>
                <div>
                  <span> 受保护或经修复的栖息地 </span>
                  <EsgTooltip
                    content="报告组织应报告以下信息： 1.所有受保护或经修复的栖息地区域的规模和位置，以及修复措施的成功是否得到或得到过独立的外部专业人士的核准。 2.是否与第三方存在合作关系，以保护或修复不同于组织已监督并实施修复或保护措施的栖息地区域。 3.报告期结束时各区域的状况。 4.使用的标准、方法和假设。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.protectedOrRestoredHabitats"
                type="textarea"
                :rows="4"
                placeholder="为更好地保护草原生态环境，伊利金典联合 WWF、中国绿化基金会等在京共同 发起'中国有机种草节'，唤起全社会对草原生态保护的关注和参与。同时， 伊利金典向中国绿化基金会'一平米草原公益计划'捐款 10 万元，用于内蒙古 50,000 平米退化草原的修复工作，改善草原生态状况。 ——《伊利股份2023可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="监管与执行组织架构">
              <template #label>
                <div>
                  <span> 监管与执行组织架构 </span>
                  <EsgTooltip
                    content="描述公司为开展生物多样性保护活动建立的管理组织架构"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityMgmtOrg"
                type="textarea"
                :rows="4"
                placeholder="伊利可持续发展委员会负责统筹生物多样性保护管理及相关工作，并推动董事会战略与可持续发展委员会监督公司生物多样性风险相关事宜，讨论生物多样性风险相关议题。 ——《伊利集团2023年度生物多样性保护报告》"
              />
            </el-form-item>
            <el-form-item label="政策、制度">
              <template #label>
                <div>
                  <span> 政策、制度 </span>
                  <EsgTooltip content="减少生物多样性影响的政策、制度" />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityPolicySystem"
                type="textarea"
                :rows="4"
                placeholder="公司遵循母公司丰益国际的 NDPE（即'不毁林开荒'不开垦泥炭地'不剥削劳工'）政策，高度重视生物多样性保护及森林保护。我们在《环境政策》和《生物多样性保护政策》中要求公司包含供应链在运营时，按照国际和国家标准来实施生物多样性保护，尽量减少对动植物及生态环境的影响。同时，我们积极保护、恢复和促进可持续利用陆地生态系统，将生物多样性考量纳入项目的全生命周期，助力构建生态环保命运共同体，致力于最大限度实现人与自然资源和谐共生。 ——《金龙鱼2023可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="风险管理">
              <template #label>
                <div>
                  <span> 风险管理 </span>
                  <EsgTooltip
                    content="公司识别、监测和评估潜在的生物多样性风险或紧急情况，采取措施预防和减少可能的影响"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityRiskManagement"
                type="textarea"
                :rows="4"
                placeholder="对于生产运营过程中对生物多样性产生的潜在影响，采用'分级减缓管理'（Mitigation hierarchy approach）进行评估和应对，即避免（Avoid）、最小化（Minimise）、修复（Restore）和补偿（Offset）。——《水井坊2023ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="生物多样性保护-生物多样性保护实践"
        name="biodiversity-practice"
      >
        <template #title>
          <div class="collapse-title">
            <span> 生物多样性保护-生物多样性保护实践 </span>
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
            <el-form-item style="margin-bottom: 50px" label="投入资金">
              <template #label>
                <div>
                  <span> 投入资金</span>
                  <EsgTooltip content="报告期内生物多样性保护投入资金总额" />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityInvestmentAmount"
                type="textarea"
                :rows="4"
                placeholder="2023 年 8 月 12 日，在第 12 个世界大象日，伊利再捐 100 万元支 持濒危亚洲象及其栖息地保护工作。当天，伊利携手新华网联合 出品《狂'膘'吧！小象》科普视频，带动亚洲象保护科普，视 频阅读量超 6,000 万次，主流新媒体阅读量破 2 亿次，让公众了 解亚洲象的健康成长之路。 ——《伊利集团2023年度可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="土壤环境监测">
              <template #label>
                <div>
                  <span> 土壤环境监测 </span>
                  <EsgTooltip content="土壤环境监测覆盖率以及举措" />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversitySoilMonitoring"
                type="textarea"
                :rows="4"
                placeholder="伊利建立以IP认证为主的、可追溯到生产源头的大豆溯源体系，通过建立大豆溯源体系和收集供应商种植基地信息，对大豆生产过程中的灌溉用水管理、农药使用频次、使用类型等情况进行持续监测和管理，规避农药的散布造成农园地区土壤污染等环境问题。——《伊利股份2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="生物多样性影响缓解措施">
              <template #label>
                <div>
                  <span> 生物多样性影响缓解措施 </span>
                  <EsgTooltip
                    content="降低公司运营中对生物多样性造成影响的管理及实践。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityMitigation"
                type="textarea"
                :rows="4"
                placeholder="针对建设项目，在选址时公司会避开生态红线区、珍稀动物保护区以及自然保护区等生态敏感区域，同时在环境影响评价阶段，就项目对周边生物多样性的影响进行评价，并提出预防对策；针对收并购项目，公司会开展环境风险调查和评估，确保项目符合生物多样性保护的相关要求。 ——《金龙鱼2023年可持续发展报告》"
              />
            </el-form-item>
            <el-form-item
              label="运营或项目地附近建设生物多样性保护区数量和保护举措"
            >
              <template #label>
                <div>
                  <span>
                    运营或项目地附近建设生物多样性保护区数量和保护举措
                  </span>
                  <EsgTooltip
                    content="项目运营地周围建设保护区数量；参与项目当地生物多样性保护科研项目、增殖放流、植树造林、保护鸟类等活动"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.biodiversityProtectedAreas"
                type="textarea"
                :rows="4"
                placeholder="2023 年 3 月，为深入践行'绿水青山就是金山银山'发展理念，营造'全民参与、爱绿植绿护绿'的良好氛围，云南中鲁党支部组织在厂值守的党员职工开展义务植树主题党日活动。在厂区内植树点现场，大家团结协作植树 60 余株，为云南中鲁厂区环境绿化做出贡献，进一步增强环保责任意识 ——《国投鲁中2023年度ESG报告》"
              />
            </el-form-item>
            <el-form-item
              label="附件上传"
              prop="biodiversityProtectedAreasAttachmentFileList"
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
                  formData.biodiversityProtectedAreasAttachmentFileList
                "
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
const activeCollapse = ref(["climate-strategy-goals"]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  policyCommitment: "", // 目标、方针及承诺
  goalCompletionStatus: "", // 目标完成情况
  organizationStructure: "", // 组织架构
  policyAndRegulation: "", // 政策与制度
  riskManagement: "", // 风险管理
  climateRiskManagement: "", // 气候风险管理
  climateRiskIdentificationResponse: "", // 气候风险识别与应对
  climateTransitionPlan: "", // 气候转型计划
  esgTrainingSystem: "", // 供应商ESG培训体系
  esgTrainingCount: "", // 开展供应商ESG培训次数
  esgTrainingParticipationRate: "", // 供应商参与ESG培训百分比
  sustainableProcurementRate: "", // 公司内部通过可持续采购培训的采购员比例
  esgReviewAssessment: "", // 供应商ESG审查与评估
  lowCarbonProductRAndD: "", // 低/零碳产品研发
  valueChainEnergySavingPractice: "", // 价值链节能减排推广与实践
  envLaborClauseSupplierRate: "", // 签订包含环境和劳工要求条款的供应商百分比
  socialImpactAssessmentSupplierCount: "", // 开展了社会影响评估的供应商数量
  environmentalImpactSupplierCount: "", // 开展了环境影响评估的供应商数量
  negativeSocialImpactSupplierCount: "", // 经确定为具有实际和潜在重大负面社会影响的供应商数量
  negativeEnvironmentalImpactSupplierCount: "", // 经确定为具有实际和潜在重大负面环境影响的供应商数量
  supplierCertificationCount: "", // 供应商认证及审核
  supplierCertificationRate: "", // 供应商认证及审核率
  supplierTotalCount: "", // 供应商总数
  localSupplierPurchaseRate: "", // 向当地供应商采购比例
  envInvestmentAmount: "", // 环保投入资金
  envPollutionFine: "", // 环境污染罚款额
  newSupplierCount: "", // 新增供应商数量
  scope1GhgEmissions: "", // 范围1温室气体排放量
  scope2GhgEmissions: "", // 范围2温室气体排放量
  scope3GhgEmissions: "", // 范围3温室气体排放量
  totalGhgEmissions: "", // 温室气体排放总量
  ghgEmissionIntensity: "", // 温室气体排放强度
  noxEmissionsAmount: "", // 氮氧化物（NOx）排放量
  soxEmissionsAmount: "", // 硫氧化物（SOx）排放量
  popEmissions: "", // 持久性有机污染物（POP）排放量
  vocEmissions: "", // 挥发性有机化合物（VOC）排放量
  hapEmissions: "", // 危害性空气污染物（HAP）排放量
  pmEmissions: "", // 颗粒物质（PM）排放量
  odsEmissions: "", // 臭氧消耗物质（ODS）排放量
  nonHazardousWasteTotal: "", // 无害废物排放总量
  wasteTransferredFromDisposal: "", // 从处置中转移的废弃物
  envGoalCompletionStatus: "", // 年度目标完成情况
  envMgmtOrg: "", // 监管与执行组织架构
  envPolicyRegulation: "", // 政策、制度
  envAssessmentIncentive: "", // 与环境相关的考核与激励
  envSystemCertification: "", // 通过环境管理体系认证
  envEmergencyManagement: "", // 环境风险管理
  ghgVerification: "", // 温室气体排放核查
  ghgReductionAmount: "", // 温室气体减排量
  ghgEmissionsByCategory: "", // 按分类的温室气体排放情况
  productCarbonFootprint: "", // 产品碳足迹
  carbonReductionTechnology: "", // 减碳技术研发
  carbonReductionIndustryApplication: "", // 减碳技术行业应用
  envProtectionGoals: "", // 环境保护目标、理念与承诺
  envHonors: "", // 荣誉及奖项
  envEmergencyTraining: "", // 应急培训、应急演练
  envProductionPractice: "", // 生产环保实践
  envMonitoringActivities: "", // 环境监测活动
  envProjects: "", // 环保项目
  envMajorIncidentsCount: "", // 突发重大环境事件起数
  envImpactAssessmentProjectCount: "", // 开展环境影响评估的项目数
  envImpactMgmtActions: "", // 环境影响管理措施
  greenOfficePolicy: "", // 绿色办公政策
  resourceUseEfficiencyGoalStatus: "", // 资源使用效益目标、方针及承诺
  resourceUseEfficiencyGoalCompletion: "", // 资源使用效益目标完成情况
  resourceUseOrganizationStructure: "", // 执行组织架构
  resourceUsePolicySystem: "", // 政策与制度
  energyManagementSystemCertification: "", // 能源管理体系认证
  wasteStorage: "", // 废弃物存放
  wasteTransport: "", // 废弃物运送
  biodiversityPolicy: "", // 生物多样性政策
  biodiversityMajorImpact: "", // 活动、产品和服务对生物多样性的重大影响
  biodiversityRiskManagement: "", // 生物多样性风险管理
  biodiversityMitigation: "", // 生物多样性影响缓解措施
  biodiversityMgmtOrg: "", // 监管与执行组织架构
  biodiversityProtectedAreas: "", // 运营或项目地附近建设生物多样性保护区数量和保护举措
  biodiversitySoilMonitoring: "", // 土壤环境监测
  electricityConsumption: "", // 电力消耗
  lngConsumption: "", // 液化天然气
  naturalGasConsumption: "", // 天然气
  fuelOilConsumption: "", // 燃料油
  lpgConsumption: "", // 液化石油气
  otherPetroleumProductsConsumption: "", // 其它石油制品
  heatConsumption: "", // 热力
  steamConsumption: "", // 蒸汽
  coalConsumption: "", // 煤炭
  lubricantConsumption: "", // 润滑油
  dieselConsumption: "", // 柴油
  gasolineConsumption: "", // 汽油
  externalEnergyConsumption: "", // 外购能源消耗
  energySavingAmount: "", // 减少能源消耗量
  energyIntensity: "", // 能源强度
  renewableEnergyUsage: "", // 可再生能源使用情况
  waterIntake: "", // 取水
  waterConsumption: "", // 耗水
  waterRecycling: "", // 中水回用
  waterSavingMeasures: "", // 节水措施
  waterRiskManagement: "", // 水资源风险管理
  waterDischargeStandards: "", // 废水排放标准
  waterQualityMonitoring: "", // 水质监测
  materialTotalWeightOrVolume: "", // 所用物料的重量或体积
  recycledMaterialUsage: "", // 所使用的回收再利用的物料
  recycledProductAndPackaging: "", // 回收的产品及包装材料
  circularEconomyPractices: "", // 循环经济实践
  greenSupplyChain: "", // 绿色供应链
  materialEfficiencyMeasures: "", // 物料效率措施
  packagingOptimization: "", // 包装优化
  wasteReductionMeasures: "", // 废物减少措施
  socialStandardNewSupplierRate: "", // 社会标准新供应商比例
  hazardousWasteTotal: "", // 有害废物排放总量
  wasteWaterDischargeTotal: "", // 废水排放总量
  wasteWaterDischargeIntensity: "", // 废水排放强度
  waterPollutants: "", // 水污染物
  wasteWaterTreatmentMeasures: "", // 废水处理措施
  wasteWaterRecyclingRate: "", // 废水回收利用率
  wasteDisposalMethods: "", // 废弃物处置方式
  wasteReductionTargets: "", // 废物减少目标
  hazardousWasteManagement: "", // 有害废物管理
  circularEconomyInitiatives: "", // 循环经济倡议
  fairTrade: "", // 公平贸易
  capacityBuildingSupport: "", // 能力建设支持
  // 附件上传字段
  valueChainEnergySavingAttachmentFileList: [], // 价值链节能减排附件
  climateInitiativeAttachmentFileList: [], // 气候变化倡议附件
  climateActivityAttachmentFileList: [], // 气候变化活动附件
  envHonorsAttachmentFileList: [], // 环境荣誉附件
  envSystemCertificationAttachmentFileList: [], // 环境体系认证附件
  envEmergencyTrainingAttachmentFileList: [], // 环境应急培训附件
  envImpactMgmtActionsAttachmentFileList: [], // 环境影响管理措施附件
  envProjectsAttachmentFileList: [], // 环保项目附件
  envTrainingPublicityAttachmentFileList: [], // 环保宣贯培训附件
  energyManagementSystemCertificationAttachmentFileList: [], // 能源管理体系认证附件
  waterSavingMeasuresAttachmentFileList: [], // 节水措施附件
  biodiversityProtectedAreasAttachmentFileList: [], // 生物多样性保护区附件
  ghgVerificationAttachmentFileList: [], // 温室气体排放核查附件
  carbonReductionTechAttachmentFileList: [], // 减碳技术研发附件
  lowCarbonProductRAndDAttachmentFileList: [], // 低/零碳产品研发附件
  cleanProductionMeasuresAttachmentFileList: [], // 清洁生产举措附件
  energySavingMeasuresAttachmentFileList: [], // 节能实践附件

  // 新增字段
  cleanProductionMeasures: "", // 清洁生产举措
  energySavingPractice: "", // 节能减排实践
  carbonEmissionDigitalPlatform: "", // 碳排放数字化平台
  carbonReductionProjectInvestment: "", // 减碳项目投入数量及金额
  carbonOffsetProjectParticipation: "", // 参与/交易碳抵消项目
  carbonOffsetProjectInvestment: "", // 碳抵消项目数量及投入
  greenFinancePractice: "", // 绿色投融资实践
  climateCooperationProjects: "", // 气候合作项目
  organizationInternalEnergyConsumption: "", // 组织内部的能源消耗量
  surfaceWaterIntake: "", // 地表水取水
  energySavingMeasures: "", // 节能实践
  waterIntakeGoalStatus: "", // 取水目标完成情况
  pollutionControlOrgStructure: "", // 污染控制监管与执行组织架构
  pollutionControlPolicy: "", // 污染控制政策制度
  emissionMonitoringPermit: "", // 排放监测与排污许可
  biodiversityOperatingLocations: "", // 生物多样性经营场所、运营点或项目地
  biodiversityPolicySystem: "", // 生物多样性政策、制度
  biodiversityInvestmentAmount: "", // 生物多样性投入资金
  protectedOrRestoredHabitats: "", // 受保护或经修复的栖息地
  envViolationPenalty: "", // 环保违法违规事件与处罚
  envTrainingPublicity: "" // 公司环保宣贯、培训次数及覆盖人数
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
