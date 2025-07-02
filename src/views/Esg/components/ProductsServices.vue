<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="方针与目标" name="policy-goals">
        <template #title>
          <div class="collapse-title">
            <span>方针与目标</span>
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
            <el-form-item label="目标、理念方针及承诺">
              <template #label>
                <div>
                  <span> 目标、理念方针及承诺 </span>
                  <EsgTooltip
                    content="公司促进质量与食品安全管理制定的目标、方针及承诺，阐述目标设定考量因素。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.policyCommitment"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="食品质量安全始终是双汇发展企业管理的首位，并已经成为企业文化的重要组成。我们的食品安全控制体系践行预防为主、风险管理、全员参与、全程控制的原则，以科技智能为工具优化安全管理，同时深化产品营养研发，实现食品安全和品质从源头到销售的全过程管控，做消费者信赖的肉类食品企业。2023年，双汇发展坚持并落实六大质量目标，其下涵盖69项质量指标，涉及研发、供应生产、储存、运输5个环节，我们严格推进六大目标的关键指标管理，落实质量管理举措，并全面跟踪质量关键节点绩效表现。——双汇发展2023年ESG报告"
              />
            </el-form-item>
            <el-form-item label="目标完成情况">
              <template #label>
                <div>
                  <span> 目标完成情况 </span>
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
      <el-collapse-item title="体系及策略" name="system-strategy">
        <template #title>
          <div class="collapse-title">
            <span
              >体系及策略
              <EsgTooltip
                content="交易所可持续发展报告指引<br/>
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

          <el-form :model="formData" label-position="left" label-width="100px">
            <!-- 定性描述 -->
            <el-form-item label="组织架构">
              <template #label>
                <div>
                  <span> 组织架构 </span>
                  <EsgTooltip
                    content="公司为开展质量与食品安全管理建立的组织架构。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.organizationStructure"
                type="textarea"
                :rows="4"
                placeholder="双汇发展已建有一个权责清晰的集团级、事业部级、项目公司级三级食品安全管理架构，推进和落实产品质量控制和保障工作。我们设有食品安全监督小组，负责推进和敦促各项食品安全管理措施的执行。品质管理中心负责生产基地的驻厂督导和检验，并按照《双汇发展2023年项目公司质量管理评价方案》执行绩效考核。我们每月进行质量指标的跟踪，不断推动质量管理工作有效实施，保障食品质量与安全。 ——《双汇发展2023年ESG报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="政策与制度">
              <template #label>
                <div>
                  <span> 政策与制度 </span>
                  <EsgTooltip
                    content="公司为开展质量与食品安全管理制定的政策与制度"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.policyAndRegulation"
                type="textarea"
                :rows="4"
                placeholder="双汇发展以最严谨的标准、最严格的监督、最严厉的处理、最严肃的问责四个最严作为质量管理的总体原则，严格遵循中华人民共和国食品安全法、中华人民共和国食品安全法实施条例、中华人民共和国产品质量法、企业落实食品安全主体责任监督管理规定等国家法律和地方法规，各产业运行基于国际标准的质量管理体系，制定双汇发展食品安全事故应急预案、卫生标准操作规范等质量管理制度和操作规程，并不断优化双汇发展2023年项目公司质量管理评价方案、双汇发展产品质量、食品安全考核管理规定等管理和监督制度和程序，以达到公司各产业质量标准。——双汇发展2023年ESG报告"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="全周期产品质量管理">
              <template #label>
                <div>
                  <span> 全周期产品质量管理 </span>
                  <EsgTooltip
                    content="公司年对产品、项目的全生命周期质量管理，并提供采购原材料到最后项目交付等各个环节的质量安全与食品安全保障实践和有关持续检测、管理、优化产品/服务质量的典型案例"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.lifecycleQualityManagement"
                type="textarea"
                :rows="4"
                placeholder="上海梅林旗下各企业围绕质量和食品安全管理体系，从原辅料、产品、生产工艺、危害分析工作表对食品安全风险控制提出了要求和识别。对于体系覆盖的产品建立了HACCP计划，根据计划实施关键点控制。 我们围绕《食品安全法》与质量和食品安全管理体系的要求，制定了《产品模拟追溯演练管理办法》《产品召回管理办法》等制度，建立产品可追溯性控制程序，实现从原辅料到销售全过程的追溯，以方便消费者通过追溯系统对整个生产过程进行溯源，进而保障食品质量安全可靠。 ——《上海梅林2023年ESG 暨可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="认证与审验">
              <template #label>
                <div>
                  <span> 认证与审验 </span>
                  <EsgTooltip
                    content="描述公司开展的质量相关的认证和审验、主要产品和服务质量管理体系认证情况。/服务质量的典型案例"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.certificationAndAudit"
                type="textarea"
                :rows="4"
                placeholder="双汇发展的下属生产企业按业务属性和需要获得和保有多个国际质量管理体系认证。报告期内，2家下属公司新增相关认证:汇佳味公司获得ISO 9001认证，食用油科技公司获得ISO 9001认证和HACCP认证。截止2023年底，本公司拥有的质量体系认证情况如下:双汇发展及其下属公司100%保有ISO 9001质量管理体系认证，共覆盖42家公司;涉及屠宰和肉制品加工的公司拥有HACCP危害分析与关键控制点体系认证，已覆盖17家公司;ISO 22000食品安全管理体系覆盖16家公司;我们亦根据国际客户的需求定向申请FSSC 22000食品安全管理体系认证，覆盖6家公司。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="honorsAndAwardsFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.honorsAndAwardsFileList"
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
            <el-form-item label="宣贯与培训">
              <template #label>
                <div>
                  <span> 宣贯与培训 </span>
                  <EsgTooltip
                    content="描述公司质量管理相关理念宣贯、培训/服务质量的典型案例"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.trainingAndPromotion"
                type="textarea"
                :rows="4"
                placeholder="双汇发展秉持产品质量无小事，食品安全大如天的理念，致力于以自上而下的方式打造质量文化，通过每年组织开展系统性、专业性的质量培训，培养员工及合作伙伴的质量意识和技能，确保产品质量的持续提升。同时，我们每月组织工厂召开质量专题会，主要通报各工厂在质量管理方面存在的短板指标，督促相对排名靠后的工厂分析原因并及时反馈和进行必要整改，形成解决质量问题的长效机制。报告期内，我们举办劳动比赛、技术比武176场次，开展食品安全质量知识竞赛、安全生产知识竞赛56场次，有效提高职工实际岗位技能，加强员工团结协作融合。我们每年开展质量安全相关培训，2023年共开展5235次培训，参与培训468215人次，培训时长总计1224490时，员工培训覆盖率100%。——双汇发展2023年ESG报告"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item title="质量管理实践" name="quality-management-practice">
        <template #title>
          <div class="collapse-title">
            <span
              >质量管理实践
              <EsgTooltip
                content="GRI 416<br/>
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
            <span class="description"
              >企业主要活动、品牌介绍、产品和服务详情。</span
            >
          </div>
          -->
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item label="活动与举措">
              <template #label>
                <div>
                  <span>活动与举措</span>
                  <EsgTooltip
                    content="描述公司为提升产品质量开展的活动、举措及效果。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.qualityImprovementActions"
                type="textarea"
                :rows="4"
                placeholder="本集团食品安全中心在各级领导的支持下，带领团队，高举GMP大旗，紧紧围绕'100-1=0'的管理理念，积极推进并落实日常GMP改善计划追踪工作， 稽核内容逐年细化精进，稽核水平逐年提升。食品、肉品同步管理，硬件和软件同步精进，消除短板，加长长板，共同达成1+1≥2的目的;稽核内容有基本硬件设施要求和维护、收发货和仓储管理、设备维护保养校准人员卫生要求和培训、清洁消毒和虫鼠管理、追溯体系、异物和过敏源管理HACCP计划、 SOP落地执行9个模块。本集团共12个被稽核单位，总分100%达成90分以上好成绩。团队整体表现优秀，持续改善一直在进行中，为质量管理目标的圆满达成奠定了良好的基础。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="qualityPracticeFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.qualityPracticeFileList"
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
            <el-form-item label="荣誉及奖项">
              <template #label>
                <div>
                  <span> 荣誉及奖项</span>
                  <EsgTooltip
                    content="报告期内公司在质量管理方面取得的成绩与荣誉"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.honorsAndAwards"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="管理体系" name="management-system">
        <template #title>
          <div class="collapse-title">
            <span
              >管理体系
              <EsgTooltip content="Wind评级、GRI 403" />
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
            <el-form-item label="安全生产价值理念与目标">
              <template #label>
                <div>
                  <span> 安全生产价值理念与目标 </span>
                  <EsgTooltip
                    content="公司安全管理理念以及设置的目标，可考虑以安全工时作为量化目标。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.safetyManagementSystem"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="本集团一直秉承'诚信、谦和、前瞻'的理念进行肉鸡生产，对肉鸡养殖到肉鸡屠宰进行全过程管理。本集团下属蚌埠食品厂成立以总经理为总负责人，下设各部门主管负责的动物福利委员会，从养殖过程到屠宰过程以动物福利五大原则为基础进行生产管理，从养殖的一线员工到屠宰的一线员工进行岗前、岗中的动物福利培训与考核，程序文件完全遵守国家法律法规，由取得国家级资格证书的人员负责。本集团坚持提供动物福利，以持续改善的动物福利创造更优的经济动物价值，奉献安全、美味的鸡肉食品。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="安全生产管理制度体系">
              <template #label>
                <div>
                  <span> 安全生产管理制度体系 </span>
                  <EsgTooltip
                    content="公司为实现安全管理理念和目标而制定的制度，可考虑披露具体政策数。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.safetyManagementSystem"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="旺旺严格遵守《中华人民共和国安全生产法》《中华人民共和国消防法》 《生产安全事故应急预案管理办法》等法律法规，结合地方实际新增的《安全生产投入管理办法》《文件档案管理办法》 《变更管理办法》《安全警示标志管理制度》《相关方管理办法》5份内部安全管理制度，结合入职健康证明、员工团体保险、僱主责任险、海外旅游险等方面， 保证员工的工作安全和身体健康。集团积 极建立标准化的、全面的旺旺标准安全管理WSSM三阶安全管理体系，确保制度的适用性及有效落地，保障当地工厂生产运营的安全稳定。2022财年，集团为落实 全员安全生产责任制，及时修订了安全责 任书内容，工厂安全生产责任书签订率达 100%。 ——《中国旺旺2022/23年环境、社会及管治报告》"
              />
            </el-form-item>
            <el-form-item label="安全生产管理组织架构">
              <template #label>
                <div>
                  <span> 安全生产管理组织架构 </span>
                  <EsgTooltip content="公司安全管理组织架构及各层级职责" />
                </div>
              </template>
              <el-input
                v-model="formData.safetyManagementOrg"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="为保障员工健康安全，本集团各工厂建立生产三级安全体系，即厂长、现场主管、一线员工，三级管理防控;同时，将安全指标纳入三类人群月度绩效奖金考核，确保员工健康安全机制得以落地实施并得到所有员工及主管的重视。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="管理实践" name="management-practice">
        <template #title>
          <div class="collapse-title">
            <span
              >管理实践
              <EsgTooltip content="Wind评级、GRI 403" />
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
            <el-form-item label="培训与宣导">
              <template #label>
                <div>
                  <span> 培训与宣导 </span>
                  <EsgTooltip
                    content="公司为提升员工安全生产意识和技能而开展的技能考核、知识宣讲、警示教育等活动。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.safetyTraining"
                type="textarea"
                :rows="4"
                placeholder="公司始终将员工的安全作为企业稳定发展的脉搏所在，通过组织开展丰富多样的安全教育培训活动，2023年上海梅林共组织安全教育培训活动705次，参加安全培训54114人次，其中安全管理人员5342人次、职工人员33757人次、外来劳务人员15015人次。使广大干部员工不断增强安全意识、掌握安全知识技能、提升安全履职能力，为进一步提高公司安全生产管理水平奠定了良好基础。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="safetyTrainingFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.safetyTrainingFileList"
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
            <el-form-item label="安全风险识别与检查">
              <template #label>
                <div>
                  <span> 安全风险识别与检查 </span>
                  <EsgTooltip
                    content="公司为保证生产过程中的安全风险被提前识别和管理而开展的督导、风险排查、整改督促等措施。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.riskIdentification"
                type="textarea"
                :rows="4"
                placeholder="2023年，本公司重点围绕消防、特种设备、安全生产等相关标准进行了风险点评估，深入分析了各环节可能存在的安全隐患，对识别出的风险进行了相应的改造和优化，不仅提升了企业的安全管理水平，也为员工创造了一个更加安全、健康的工作环境。 我们通过设施更新、应急演练和安全排查，从风险源头管控、预防消除隐患，维护安全的作业环境，保障员工和财产安全。对已发生的事故，我们采取了相应的纠正措施，以预防未来再次发生类似事件。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="安全应急事件管理">
              <template #label>
                <div>
                  <span> 安全应急事件管理 </span>
                  <EsgTooltip
                    content="公司为应对安全风险应急事件而制定的应急预案，以及开展的培训、演练等实践。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.emergencyManagement"
                type="textarea"
                :rows="4"
                placeholder="2023年各单位共进行各类应急演练1,287场次，累计参加应急演练人员19万余人次。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="危害及风险评估和调查"
        name="hazard-risk-assessment"
      >
        <template #title>
          <div class="collapse-title">
            <span>
              危害及风险评估和调查
              <EsgTooltip content="GRI 403、交易所可持续发展报告指引" />
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
            <el-form-item label="识别评估工作场所潜在危害和风险因素的程序">
              <template #label>
                <div>
                  <span> 识别评估工作场所潜在危害和风险因素的程序 </span>
                  <EsgTooltip
                    content="识别工作相关危害和评估风险的流程，以及应用控制层级消除危害并将风险最小化的流程，包括：<br/> 1.公司如何确保这些流程的质量，包括执行人员的能力；<br/> 2. 这些流程的结果如何用来评估并持续改善职业健康安全管理体系"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.hazardRiskAssessment"
                type="textarea"
                :rows="4"
                placeholder="我们始终将员工的职业健康放在首位，并采取了一系列的管理举措，保障全体员工的健康与安全。报告期内，我们通过识别职业危害因素岗位，定期进行职业病危害因素检测，配备职业病危害防护用品等措施，保障员工的健康安全。我们对各单位接触职业危害因素的岗位员工定期进行职业健康体检，共覆盖5,200余名接触职业危害因素的员工，投入约60万元。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="产品信息与标识" name="product-info-label">
        <template #title>
          <div class="collapse-title">
            <span
              >产品信息与标识
              <EsgTooltip content="GRI 417" />
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
                  <span>产品组成</span>
                  <EsgTooltip
                    content="描述公司产品组成、成分情况，特别是可能产生环境或社会影响的物质"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productComposition"
                type="textarea"
                :rows="4"
                placeholder="据销售宣传需要，相关部门配合品牌市场提供相应的产品特点、烹饪方法、营养成分标注等方面的技术支撑，并积 极督促引导下属子公司严格落实食品安全责任，规范经营行为,同时考虑到产品受众群体对产品的营养、感官、体验感等因素，将产品营养成分标注于产品外包装上，供顾客参考。
——《上海梅林2023年ESG 暨可持续发展报告》<br/>
双汇发展秉持负责任的营销理念，规避不公平营销或虚假宣传行为发生的同时，积极宣导健康产品理念，引导消费者合理膳食，构建健康、均衡、营养的生活方式。我们严格遵守《中华人 民共和国广告法》等相关法律法规，开展广告投放工作。
——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>产品处置及环境、社会影响</span>
                  <EsgTooltip
                    content="描述产品在淘汰或处置时的注意事项，以及其它潜在的环境或社会相关影响。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productDisposalImpact"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>设计产品信息与标识的违规事件</span>
                  <EsgTooltip
                    content="公司遵守有关产品和服务信息与标识规定的情况，是否有发现危废相关法律法规的事件。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productLabelViolation"
                type="textarea"
                :rows="4"
                placeholder="2023年，公司不存在夸大其词、隐瞒风险、过度营销等无底线营销产品的违法行为。
——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="市场营销" name="marketing">
        <template #title>
          <div class="collapse-title">
            <span>
              市场营销
              <EsgTooltip content="GRI 417" />
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
                  <span>市场营销</span>
                  <EsgTooltip
                    content="公司遵守市场营销相关法律法规的情况，是否有发现违反相关法律法规的事件。     公司在开展市场营销时考虑到营销活动的社会、环境影响的相关案例，负责任营销理念等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.marketing"
                type="textarea"
                :rows="4"
                placeholder="双汇发展秉持负责任的营销理念，规避不公平营销或虚假宣传行为发生的同时，积极宣导健康产品理念，引导消费者合理膳食，构建健康、均衡、营养的生活方式。我们严格遵守《中华人民共和国广告法》等相关法律法规，开展广告投放工作。     ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="产品可及性" name="product-accessibility">
        <template #title>
          <div class="collapse-title">
            <span>
              产品可及性
              <EsgTooltip content="交易所可持续发展报告指引、Wind评级" />
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
                  <span>产品可及性</span>
                  <EsgTooltip
                    content="公司提升产品或服务可获得性的举措，包括产品分销渠道、地理覆盖范围以及用户获取产品的便利性等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productAccessibility"
                type="textarea"
                :rows="6"
                placeholder="我们通过传统节日微电影拍摄、综艺年轻化营销、线上线下多平台明星营销推广等方式，向不同年龄段消费者普及食品健康相关知识。2023年，我们持续探索负责任营销和责任品牌建设路径，通过开展体育运动相关营销活动，树立健康消费新标杆，向社会传递大健康消费理念。     ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="客户评价" name="customer-feedback">
        <template #title>
          <div class="collapse-title">
            <span>
              客户评价
              <EsgTooltip content="交易所可持续发展报告指引" />
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
                  <span>客户投诉</span>
                  <EsgTooltip
                    content="公司针对客户投诉的受理途径、处理流程及处理情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.customerComplaints"
                type="textarea"
                :rows="4"
                placeholder="客户及消费者投诉处理流程：受理相关问题，创建投诉工单；通过信息化系统将相关投诉工单分配至相关部门与人员；统计投诉问题及基本情况，在1小时内通过工单流转到具体业务人员。 ——《双汇发展2023年ESG报告》<br/> 客户权益的保护是我们首要责任。真诚用心服务客户， 我们持续健全客户投诉机制，规范投诉的受理与反馈， 畅通内部沟通渠道，贯彻落实整改情况并及时反馈客户， 切实保障客户合法权益。公司收到客诉81起，较去年下降22起。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>客户满意度</span>
                  <EsgTooltip
                    content="请介绍2023年公司的客户满意度目标及达成情况，以及服务重点客户、与客户加强沟通，获得客户高度评价的案例介绍，可提供相关图片、客户评价"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.customerSatisfaction"
                type="textarea"
                :rows="4"
                placeholder="2023年上海梅林及其下属子公司通过公布投诉电话、市场调查、走访客户、电话、邮件、QQ、微信、手机等客服平台等方式，对零售市场、团购市场和消费者进行满意度调查，调查对象采取随机抽样法，综合客户满意率为95.78%，消费者对上海梅林产品质量和服务质量较认可。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="产品召回" name="product-recall">
        <template #title>
          <div class="collapse-title">
            <span>
              产品召回
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
          <el-form :model="formData" label-position="left" label-width="100px">
            <el-form-item>
              <template #label>
                <div>
                  <span>产品召回程序</span>
                  <EsgTooltip
                    content="公司采取召回措施的程序、机制、效率和效果，包括召回的触发机制、执行过程、成本、影响评估以及后续改进措施等。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.productRecallProcedure"
                type="textarea"
                :rows="4"
                placeholder="一级程度,经济损失在5000元以上 1超保质期 2标签信息批量错误(品名、生产日期错误) 3生产日期批量打印模糊或缺失 4产品批量变质 5来自政府和新闻媒介或相关部门的投诉; 6社会后果严重或将会引发一系列具有社会影响的问题; 7涉及产品安全问题的投诉。 批量指同批次产品发生投诉或退货数量在10件以上。48h内做应14日内提出解决方案。按《食品质量安全预与应急处置预案》执行 是否启动产品召回程序 由公司总经理决定，若启动则按《产品召回控制程序》流程处理，所有的纠正措施实施须由责任部门分管领导派有关人员予以验证提交技质部管理评审、跟踪。 ——《上海梅林2023年ESG 暨可持续发展报告》<br/> 为切实保障消费者健康与安全，预防发生产品缺陷事件造成广泛影响，双汇发展未雨绸缪，每 年按照《产品召回控制操作规范》组织模拟召回，报告期内，各项目公司均组织2次产品召回演练，锻炼产品召回能力，发现问题及时改进。报告期内，未发生任何产品召回事件。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>产品召回数量</span>
                  <EsgTooltip
                    content="报告期内公司采取产品召回程序的次数，以及召回结果。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <el-input
                  v-model="formData.productRecallCount"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                />
                <span>次</span>
              </div>
            </el-form-item></el-form
          >
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
const activeCollapse = ref(["industry-value-finance"]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 表单数据 - 重新命名以匹配各模块标题和字段含义
const formData = ref({
  policyCommitment: "", // 目标、理念方针及承诺
  goalCompletionStatus: "", // 目标完成情况
  organizationStructure: "", // 组织架构
  policyAndRegulation: "", // 政策与制度
  lifecycleQualityManagement: "", // 全周期产品质量管理
  certificationAndAudit: "", // 认证与审验
  qualityPracticeFileList: [], // 附件上传 (质量管理实践)
  trainingAndPromotion: "", // 宣贯与培训
  qualityImprovementActions: "", // 活动与举措
  honorsAndAwards: "", // 荣誉及奖项
  honorsAndAwardsFileList: [], // 附件上传 (荣誉及奖项)
  majorIncidents: "", // 重大事故
  healthAndSafety: "", // 健康与安全
  safetyManagementSystem: "", // 安全生产管理制度体系
  safetyManagementOrg: "", // 安全生产管理组织架构
  safetyTraining: "", // 培训与宣导
  safetyTrainingFileList: [], // 附件上传 (管理实践)
  riskIdentification: "", // 安全风险识别与检查
  emergencyManagement: "", // 安全应急事件管理
  equipmentSafetyManagement: "", // 装备安全管理
  hazardRiskAssessment: "", // 识别评估工作场所潜在危害和风险因素的程序
  productComposition: "", // 产品组成
  productDisposalImpact: "", // 产品处置及环境、社会影响
  productLabelViolation: "", // 设计产品信息与标识的违规事件
  marketing: "", // 市场营销
  productAccessibility: "", // 产品可及性
  customerComplaints: "", // 客户投诉
  customerSatisfaction: "", // 客户满意度
  productRecallProcedure: "", // 产品召回程序
  productRecallCount: "" // 产品召回数量
  // ... (add any other fields as needed based on template usage)
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
  white-space: nowrap;
}
</style>
