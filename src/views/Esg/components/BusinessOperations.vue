<template>
  <div class="esg-content">
    <!-- 公司名称与组织架构 -->
    <el-collapse v-model="activeCollapse" class="esg-collapse">
      <el-collapse-item title="产业价值(财务)" name="industry-value-finance">
        <template #title>
          <div class="collapse-title">
            <span
              >产业价值(财务)
              <EsgTooltip content="GRI 201" />
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
            <el-form-item label="直接经济效益">
              <template #label>
                <div>
                  <span> 直接经济效益 </span>
                  <EsgTooltip
                    content="报告期内经济绩效(营业收入、净利润、利润总额、总资产、净资产、纳税总额）；比率指标(包括资产负债率、利润增长率、收入增长率）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.directEconomicBenefit"
                type="textarea"
                :rows="6"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="政府给予的财政补贴">
              <template #label>
                <div>
                  <span> 政府给予的财政补贴 </span>
                  <EsgTooltip
                    content="报告期内公司从任何政府处获得的财政补贴数据"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.governmentSubsidy"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.governmentSubsidy"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="科技创新-战略与目标" name="strategy-goals">
        <template #title>
          <div class="collapse-title">
            <span
              >科技创新-战略与目标
              <EsgTooltip
                content="交易所可持续发展报告指<br/>
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
            <el-form-item label="战略、目标、方针">
              <template #label>
                <div>
                  <span> 战略、目标、方针 </span>
                  <EsgTooltip
                    content="描述公司科技驱动战略，以及为了促进科技创新设定的目标、方针及承诺，阐述目标设定考量因素。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.strategyPolicy"
                type="textarea"
                :rows="6"
                placeholder="公司着力推进以'核心技术为主体、市场为导向、产学研相结合'的技术创新体制建设，协同整合公司内部科技资源，建立三级科技创新网络开展科研工作。上海梅林围绕公司发展规划、产品品类及相关领域开展新品研发工作， 培育新的经济增长点;同时参与技术创新、技术改造、技术引进消化创新项目，使公司在产品质量、工艺技术和产设备等方面得到持续改进。 ——《上海梅林2023年ESG 暨可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
            <el-form-item label="目标完成情况">
              <template #label>
                <div>
                  <span> 目标完成情况 </span>
                  <EsgTooltip content="披露报告期内目标实现情况。" />
                </div>
              </template>
              <el-input
                v-model="formData.goalAchievement"
                type="textarea"
                :rows="6"
                placeholder="公司着力推进以'核心技术为主体、市场为导向、产学研相结合'的技术创新体制建设，协同整合公司内部科技资源，建立三级科技创新网络开展科研工作。上海梅林围绕公司发展规划、产品品类及相关领域开展新品研发工作， 培育新的经济增长点;同时参与技术创新、技术改造、技术引进消化创新项目，使公司在产品质量、工艺技术和产设备等方面得到持续改进。 ——《上海梅林2023年ESG 暨可持续发展报告》"
                resize="vertical"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <!-- 其他折叠项 -->
      <el-collapse-item title="科技创新-体系及策略" name="system-strategy">
        <template #title>
          <div class="collapse-title">
            <span
              >科技创新-体系及策略
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
            <el-form-item label="组织体系与架构">
              <template #label>
                <div>
                  <span>组织体系与架构</span>
                  <EsgTooltip
                    content="描述公司科技创新研发体系机制、组织架构"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.organizationStructure"
                type="textarea"
                :rows="4"
                placeholder="由上海梅林总部技术质量部牵头，配合市级和区级技术中心及高新技术企业的专业研发团队，针对企业实际情况、市场需求，结合最新的研发科技信息与食品安全信息，开展计划性、合理性、安全性地 开发新产品和升级老产品，丰富上海梅林旗下产品线。 公司对研发项目的实施和管理进行了具体的规定，研发项目由研发部统一管理，大的项目成立项目组，实行项目组长负责制。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
            <el-form-item label="政策与制度">
              <template #label>
                <div>
                  <span> 政策与制度</span>
                  <EsgTooltip content="公司科技创新政策、制度、行动方案等" />
                </div>
              </template>
              <el-input
                v-model="formData.policySystem"
                type="textarea"
                :rows="4"
                placeholder="双汇发展从生产、技术、市场、质量和管理五个方面鼓励和评价创新，通过修订完善《双汇发展创新管理制度》，明确分工和责任。我们依据《双汇发展'重大项目创新奖'实施方案》等制度和规定，对创新成果显著的团队和个人发放奖金，从体制上保持创新活力。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="科研平台建设">
              <template #label>
                <div>
                  <span> 科研平台建设</span>
                  <EsgTooltip
                    content="公司科研平台建设情况，以及累计建设国家级、省部级和企业级创新平台、博士工作站、院士工作站的总数"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.researchPlatform"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="双汇发展持续加大创新研发力度，建立了国家级企业技术中心、博士后科研工作站、省级技术创新中心、省预制菜产业创新联合体等研发平台，推动产品创新以满足消费者不断变化的需求， 加强双汇发展食品行业中的竞争优势。同时，双汇发展加强研发团队建设，引进中国农科院、 河南农业大学等单位的知名专家为顾问，开展课题合作，目前双汇研发人员已达311人。报告期内，双汇发展研发投入约860.48百万元人民币。 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="科学伦理" name="scientific-ethics">
        <template #title>
          <div class="collapse-title">
            <span
              >科学伦理
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
            <span class="description">公司总部详细地址及地理位置信息。</span>
          </div>
          -->
          <el-form
            :model="formData"
            label-position="left"
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item label="遵守科学伦理的情况">
              <template #label>
                <div>
                  <span> 遵守科学伦理的情况 </span>
                  <EsgTooltip
                    content="描述公司开展科技研发创新时是将遵守科学伦理规范纳入考量的制度、举措、宣贯等，如进行动物实验等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.scientificEthics"
                type="textarea"
                :rows="4"
                resize="vertical"
                placeholder="本集团一直秉承「诚信、谦和、前瞻」的理念进行肉鸡生产，对肉鸡养殖到肉鸡屠宰进行全过程管理。本集团下属蚌埠食品厂成立以总经理为总负责人，下设各部门主管负责的动物福利委员会，从养殖过程到屠宰过程以动物福利五大原则为基础进行生产管理，从养殖的一线员工到屠宰的一线员工进行岗前、岗中的动物福利培训与考核，程序文件完全遵守国家法律法规，由取得国家级资格证书的人员负责。本集团坚持提供动物福利，以持续改善的动物福利创造更优的经济动物价值，奉献安全、美味的鸡肉食品。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item title="科技创新-成果与荣誉" name="achievements-honors">
        <template #title>
          <div class="collapse-title">
            <span>科技创新-成果与荣誉 </span>
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
            <el-form-item label="重大技术创新成果">
              <template #label>
                <div>
                  <span> 重大技术创新成果 </span>
                  <EsgTooltip
                    content="描述公司报告期内在科技创新领域形成的重大项目、关键成果及重要产出。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.majorInnovationAchievements"
                type="textarea"
                :rows="4"
                placeholder="我们围绕生物医药辅料战略新兴产业，针对注射级蔗 糖这一'卡脖子'难题，设立药用糖研发项目，取得 阶段性重大突破，研发国内第一瓶注射级蔗糖，在国 家药品评审中心正式备案;并借此打开面向战略新兴 产业的发展空间，陆续研制成功了国内第一个儿童药 用糖、第一个药用红糖，用实际行动守护中国孩子和 妈妈的健康。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item label="科学技术奖励与荣誉">
              <template #label>
                <div>
                  <span> 科学技术奖励与荣誉 </span>
                  <EsgTooltip
                    content="年度获得国家级、省部级、行业学会、企业级技术研发奖项和奖励"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.scienceTechHonors"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="honorsAndRecognitionFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.honorsAndRecognitionFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  () => {
                    // 遍历替换一边文件名
                    formData.honorsAndRecognitionFileList =
                      formData.honorsAndRecognitionFileList.map(item => ({
                        ...item,
                        name: item.response.data.split('/').pop()
                      }));
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
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="研发与创新影响" name="innovation-impact">
        <template #title>
          <div class="collapse-title">
            <span>研发与创新影响 </span>
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
            <el-form-item label="研发投入">
              <template #label>
                <div>
                  <span> 研发投入 </span>
                  <EsgTooltip
                    content="描述报告期内公司在产品、技术、材料、工艺、标准的研究、开发过程中发生的各项费用，需剔除各种财政科技经费补助。"
                  />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.rndInvestment"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.rndInvestment"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item label="创新研发认证情况">
              <template #label>
                <div>
                  <span> 创新研发认证情况 </span>
                  <EsgTooltip
                    content="公司获得企业创新能力认证情况（如高新技术企业认证、专精特新认定等）"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.innovationCertification"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="创新影响">
              <template #label>
                <div>
                  <span> 创新影响 </span>
                  <EsgTooltip
                    content="科技创新成果及其应用对推动发展新质生产力的作用，以及对经济、社会、环境和利益相关方的影响等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.innovationImpact"
                type="textarea"
                :rows="4"
                placeholder="中粮糖业通过对甜菜种植过程中各环节技术指标的归纳和总结，结合'互联网 +'思维模式，开发具有自主知识产权的'农聚通'APP 及甜菜学校信息指导系统 APP，提供便捷高效的农业管理模式，实现订单合同、订单农户信息、种植档案信息、 种植地块 GIS 信息等信息化管理，为管理和决策提供数据支撑，有效提升工作效率和管理效能。同时，为甜菜种植户提 供线上农业技术指导与培训，帮助农民提升种植技术理论和实践操作水平。 ——《中粮糖业2023年环境、社会及治理报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="可持续设计" name="sustainable-design">
        <template #title>
          <div class="collapse-title">
            <span
              >可持续设计
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
            label-width="100px"
            :disabled="!isEdit"
          >
            <el-form-item>
              <template #label>
                <div>
                  <span>绿色设计</span>
                  <EsgTooltip
                    content="描述公司在产品研发阶段融入绿色设计的理念或举措"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.sustainableDesign"
                type="textarea"
                :rows="4"
                placeholder="在环境和交叉污染方面，本集团实行了以下管控举措:1)提高原料综合利用率，降低厨余和废弃原料数量;2)生产线裹粉类在回收利用，减少废弃物料数量; 3)辅料及包装材料使用MRP系统 按生产订单计划精准采购，减少剩余和报废的风险;4)引入UV喷码机进行在线包装标识打码，解决小品项使用不干胶贴，减少产生包材废弃物。 ——《大成食品2023年环境、社会及管治报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="合作机制" name="cooperation-mechanism">
        <template #title>
          <div class="collapse-title">
            <span>合作机制 </span>
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
                  <span>合作机制</span>
                  <EsgTooltip
                    content="报告期内公司开展的行业合作情况，可包括企企合作、校企合作，签署战略合作协议等"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.cooperationMechanism"
                type="textarea"
                :rows="4"
                placeholder="双汇发展与中国肉研中心、中国农科院等院校联合申请了国家重点研发计划'肉制品智能制造与信息化无人工厂关键技术研发与产业化示范'等项目，探索肉制品生产制造新阶段。 ——《双汇发展2023年ESG报告》<br/> 行业协会作为政府与食品生产经营企业以外的'第三部门'，既是沟通政府、企业和市场的桥梁与纽带，又是社会多 元利益的协调机构，也是实现行业自律，规范行业行为，开展行业服务，保障公平竞争的社会组织。上海梅林目前参与的行业协会有协会上海市食品协会、全国食品工业标准化委员会罐头分技术委员会、中国食品协会冷冻冷藏食品专业委员会、上海市食品安全联合会、上海市轻工科技协会、上海市食品学会6家。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="标准制定" name="standards-establishment">
        <template #title>
          <div class="collapse-title">
            <span> 标准制定 </span>
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
                  <span>标准制定</span>
                  <EsgTooltip
                    content="共起草并发布的国际标准，国家标准，行业标准，公司标准数量"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.standardsEstablishment"
                type="textarea"
                :rows="6"
                placeholder="上海梅林罐头是全国食品工业标准化委员会罐头分技术委员会理事长单位，2023年参与了3项国家标准《肉糜类罐头质量通则》《罐头食品的检验方法》《火腿罐头质量通则》的制修订工作，参与行业标准《辣椒罐头》《莲藕罐头和莲子罐头》《元蹄罐头》《香肠罐头》等9项行业标准的审议工作。 冠生园蜂制品公司参与了GH/T1393-2022《蜂蜜中阿洛酮糖含量的测定高效液相色谱法》和GH/T1398-2022《薰衣草蜂蜜风味挥发物质的测定气相色谱质谱联用法》标准的制定。 ——《上海梅林2023年ESG 暨可持续发展报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="行业活动" name="industry-activities">
        <template #title>
          <div class="collapse-title">
            <span>
              行业活动
              <EsgTooltip content="对应GRI标准: GRI 2-28" />
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
                  <span>行业活动</span>
                  <EsgTooltip
                    content="报告期内公司参与行业协会、学会、论坛等活动的情况"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.industryActivities"
                type="textarea"
                :rows="4"
                placeholder="•2023年5月17日，参加河南省企业联合会组织的'企业绿色低碳转型高峰论坛'<br/> •2023年6月9日，作为重点企业代表参加由国家卫生健康委、国家食品安全风险评估中心组织的漯河市食品企业座谈会<br/> •2023年9月18日，参加2023中国国际肉类产业周(CIMIW2023)系列活动<br/> •2023年11月6日，参加第十六届'一带一路'生态农业与食品安全论坛<br/> •2023年11月7日，作为副主任委员单位，参加全国肉禽蛋制品标准化技术委员会年会 ——《双汇发展2023年ESG报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="industryActivitiesFileList">
              <template #label>
                <div>
                  <span>附件上传</span>
                  <EsgTooltip content="上传活动图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.industryActivitiesFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  () => {
                    // 遍历替换一边文件名
                    formData.industryActivitiesFileList =
                      formData.industryActivitiesFileList.map(item => ({
                        ...item,
                        name: item.response.data.split('/').pop()
                      }));
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
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="知识产权保护-管理体系" name="management-system">
        <template #title>
          <div class="collapse-title">
            <span> 知识产权保护-管理体系 </span>
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
                  <span>资金投入</span>
                  <EsgTooltip content="公司在知识产权保护方面投入资金总额" />
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.managementSystem"
                  :formatter="onlyPositiveNumber"
                  :parser="onlyPositiveNumber"
                /> -->
                <el-input
                  v-model="formData.managementSystem"
                  type="textarea"
                  :rows="2"
                />
                <span>万元</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权管理组织架构</span>
                  <EsgTooltip
                    content="公司知识产权管理的组织架构及各层级职责"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.intellectualPropertyOrgStructure"
                type="textarea"
                :rows="6"
                placeholder="海天已逐步建立起完善的知识产权管理架构。我们设置独立的知识产权部负责集团知识产权的统筹管理。独立的知识产权部门有助于专门集中处理知识产权相关事务，提高管理专业性和效率。——《海天味业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权管理遵守的法律法规</span>
                  <EsgTooltip
                    content="列举公司知识产权管理主要遵守的相关法律法规"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.intellectualPropertyLaws"
                type="textarea"
                :rows="6"
                placeholder="我们严格遵守《中华人民共和国专利法》《中华人民共和国商标法》《中华人民共和国著作权法》等法律法规，贯彻《企业知识产权管理规范》（GB/T29490-2013）等国家标准。——《海天味业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>公司知识产权管理的主要政策或制度</span>
                  <EsgTooltip
                    content="列举公司知识产权管理主要遵守的相关政策"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.intellectualPropertyPolicies"
                type="textarea"
                :rows="6"
                placeholder="我们制定了《知识产权管理工作手册》《专利管理规定》《商标管理规定》等内部管理政策。——《海天味业2023年环境、社会及治理报告》"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权保护与侵权管理</span>
                  <EsgTooltip
                    content="公司对于知识产权保护、以及防范他人侵犯知识产权的方法与举措"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.intellectualPropertyProtection"
                type="textarea"
                :rows="6"
                placeholder="海天与第三方专业机构合作，加大力度搜集和分析相关侵权线索，以便及时发现并采取适当的措施应对侵权行为。同时，海天还积极发动内部员工，鼓励他们密切关注身边可能出现的侵权情况并及时反馈侵权线索给知识产权部。——《海天味业2023年环境、社会及治理报告》"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="知识产权保有量"
        name="intellectual-property-holdings"
      >
        <template #title>
          <div class="collapse-title">
            <span> 知识产权保有量 </span>
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
                  <span>各类型专利数量</span>
                  <EsgTooltip
                    content="公司已拥有各类型专利总量、分类情况、年度申请及授权的专利数量。"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.patentTotalCount"
                type="textarea"
                :rows="1"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>新拥有专利类型及数量</span>
                  <EsgTooltip
                    content="报告期内，公司新增获得注册商标740件，专利26件，版权58件，其中新型发明专利4个，实用新型专利5个，外观设计专利19个。——《洋河股份2023年社会责任报告》"
                  />
                </div>
              </template>
              <el-input
                v-model="formData.patentNewTypeCount"
                type="textarea"
                :rows="1"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="宣传与培训" name="publicity-training">
        <template #title>
          <div class="collapse-title">
            <span> 宣传与培训 </span>
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
                  <span>知识产权保护意识培训</span>
                  <EsgTooltip content="公司为提升知识产权保护而开展的培训。" />
                </div>
              </template>
              <el-input
                v-model="formData.publicityTraining"
                type="textarea"
                :rows="6"
                placeholder="2023 年，公司邀请外部专家分别于 5 月、10 月开展知识产权保护法律法规以及知识产权专业知识培训，进一步提高了员工知识产权保护意识，降低了公司的知识产权风险，保护了公司的品牌价值与创新成果。——《洋河股份2023年社会责任报告》"
              />
            </el-form-item>
            <el-form-item label="附件上传" prop="publicityTrainingFileList">
              <template #label>
                <div>
                  <span> 附件上传 </span>
                  <EsgTooltip content="上传图片" />
                </div>
              </template>
              <el-upload
                class="upload-area"
                v-model:file-list="formData.publicityTrainingFileList"
                :on-preview="handlePictureCardPreview"
                :on-change="handleFileChange"
                :before-upload="handleFileBeforeUpload"
                :on-success="
                  () => {
                    // 遍历替换一边文件名
                    formData.publicityTrainingFileList =
                      formData.publicityTrainingFileList.map(item => ({
                        ...item,
                        name: item.response.data.split('/').pop()
                      }));
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
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权保护意识培训场次</span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.iprTrainingSessions"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.iprTrainingSessions"
                  type="textarea"
                  :rows="2"
                />
                <span>次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权保护意识培训人次</span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.iprTrainingParticipants"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.iprTrainingParticipants"
                  type="textarea"
                  :rows="2"
                />
                <span>人次</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权保护意识培训总时长</span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.iprTrainingTotalHours"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.iprTrainingTotalHours"
                  type="textarea"
                  :rows="2"
                />
                <span>小时</span>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div>
                  <span>知识产权保护意识培训人均时长</span>
                </div>
              </template>
              <div class="textContainer">
                <!-- <el-input
                  v-model="formData.iprTrainingAvgHours"
                  :formatter="onlyPositiveInteger"
                  :parser="onlyPositiveInteger"
                /> -->
                <el-input
                  v-model="formData.iprTrainingAvgHours"
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
      :isEdit="isEdit"
      @cancel="handleCancel"
      @save="handleSave"
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
  directEconomicBenefit: "",
  governmentSubsidy: "",
  strategyPolicy: "",
  goalAchievement: "",
  organizationStructure: "",
  policySystem: "",
  researchPlatform: "",
  scientificEthics: "",
  majorInnovationAchievements: "",
  scienceTechHonors: "",
  rndInvestment: "",
  innovationCertification: "",
  innovationImpact: "",
  sustainableDesign: "",
  cooperationMechanism: "",
  standardsEstablishment: "",
  industryActivities: "",
  managementSystem: "",
  intellectualPropertyOrgStructure: "",
  intellectualPropertyLaws: "",
  intellectualPropertyPolicies: "",
  intellectualPropertyProtection: "",
  patentTotalCount: "",
  patentNewTypeCount: "",
  publicityTraining: "",
  iprTrainingSessions: "",
  iprTrainingParticipants: "",
  iprTrainingTotalHours: "",
  iprTrainingAvgHours: "",
  honorsAndRecognitionFileList: [],
  industryActivitiesFileList: [],
  publicityTrainingFileList: []
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
//   if (props.activeTab === "business-operations" && props.isEdit) {
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
  "business-operations"
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
