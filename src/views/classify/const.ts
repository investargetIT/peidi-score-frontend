const factories = [
  {
    login: {
      website: "https://trace.cciccloud.com/trace-web/#!/login",
      username: "caicf@peidibrand.com",
      password: "PDGFkj12345678"
    },
    entryPage:
      "点击左侧“溯源信息管理”；点击“溯源信息录入”；点击“国产宠物食品溯源”；默认进入“实地评价”信息录入界面。",
    onSiteEvaluation: {
      add: "点击右上角的 '新增'",
      batchNumber: {
        description: "输入编辑后的批次号",
        rules: [
          "温州工厂：PDDWYY + 删除项目编号中的 '-' + 生产日期（年 + 月 + 日）",
          "江苏工厂：PDKB + 删除项目编号中的 '-' + 生产日期（年 + 月 + 日）"
        ],
        examples: [
          "PDKB+CK241100+20231109 变为 PDKBCK24110020231109",
          "PDDWYY+CK2950+20231109 变为 PDDWYYCK295020231109"
        ]
      },
      selectedProduct:
        "点击“选择”，输入“产品名称”或“产品编号”点击“查询”；选择对应产品在其右侧点击“选择”；点击右下角“确认”。",
      factoryName: "江苏康贝宠物食品有限公司",
      address: "泰州市高港区许庄街道创业大道南侧",
      factoryIntroduction:
        "江苏康贝宠物食品有限公司成立于2010年，一直专注于宠物营养食品的研究，致力于为全球家庭提供专业的宠物营养产品。公司是宠物营养科技有限公司的全资子公司。目前公司拥有员工530人，其中工程技术人员138人，中高级职称82人。公司主要生产五大系列产品：狗咬胶、肉制品、鸟食、小动物食品和烘焙食品。产品款式新颖、口感美味、营养丰富，深受国内外客户和宠物家庭的喜爱。公司拥有自主品牌——'CPET'、'PEIDI'国外品牌，'好时佳'、'驰能'、'贝佳'等国内品牌。产品出口到美国、日本、欧盟、韩国等发达国家，并与多家欧美大型宠物连锁超市建立了销售合作关系，成为沃尔玛超市全球优质产品的特供供应商。公司先后获得'省级企业认定技术中心'、'市级龙头企业'、'省级农产品出口基地'等荣誉称号。公司自主品牌'PEIDI'获得江苏省名牌产品称号。",
      factoryDisplay: "点击 '+', 上传 '康贝工厂区' 照片",
      save: "点击底部的 '保存'"
    },
    rawMaterialPurchase: {
      entry:
        "点击左侧的 '原料采购'默认显示未录入批次，点击右侧的 '录入' 进入录入页面",
      materialName: "填写第三方检测的原料名称",
      materialSource: "填写原料供应商名称",
      supplier: "填写原料供应商名称",
      inspectionReport: "点击 '+', 上传 '检疫证书'、'第三方检测报告' 照片",
      purchaseBatchNumber: "填写第三方检测的原料批次号",
      save: "点击底部的 '保存'"
    },
    productProduction: {
      entry:
        "点击左侧的 '产品生产'默认显示未录入批次，点击右侧的 '录入' 进入录入页面",
      productionProcess: "点击 '+', 上传 '江苏康贝肉制品生产工艺' 照片",
      productionDate: "选择生产日期",
      productionBatchNumber: "输入产品批次号",
      productionTechnology: "",
      technologyDescription: ""
    },
    finishedProductControl: {
      entry:
        "点击左侧“成品控制”；默认显示未录入批次，点击右侧“录入”，进入录入界面。",
      inspectionResult: "合格",
      inspectionReport: "点击“+”，上传“检测报告”、“终检单”照片。",
      save: "点击下方“保存”"
    },
    afterSalesService: {
      entry:
        "点击左侧“售后服务”；默认显示未录入批次，点击右侧“录入”，进入录入界面。",
      contactAddress: "浙江省杭州市萧山区宁围街道诺德财富中心1幢2001室",
      hotline: "400-836-1508",
      save: "点击下方“保存”"
    },
    traceabilityIdentification: {
      entry:
        "点击左侧“售后服务”；默认显示未录入批次，点击右侧“录入”，进入录入界面。",
      traceabilityType: "合规申明溯源",
      identificationType: "防伪防转移一物一码标识",
      identificationFunction:
        "涂层+金属线防伪 一次性易碎防转移 唯一身份识别+随机码验证",
      verificationMode:
        "扫描溯源二维码，点击底部“防伪查询”，输入银色涂层下方的4位数随机码查询验证",
      save: "点击下方“保存”"
    },
    cciStatement: {
      entry:
        "点击左侧“中检声明”；默认显示未录入批次，点击右侧“录入”，进入录入界面。",
      traceabilityType: "产品合规申明溯源",
      consumerService:
        "宠物食品/产品追溯热线：0571-56551738或13567137494(微信同号)，QQ社群号：663988914",
      authenticityStatement:
        "本产品溯源信息链接包含的资料、信息等，均由中检溯源及其客户企业共同提供。但中检溯源仅对由自身（含中检各分支机构）直接采集的信息和出具的报告、证书负责。中检溯源开展检验、检测、认证、验证等活动所获得的企业和产品信息，均在申请企业保证诚信的前提下现场或线上采集，与此相关的报告以及证书为我方据实出具，但并不能免除生产方、贸易双方、承运人等所应承担的义务和法律责任，任何有意或无意的虚假行为所造成的后果由当事方自行承担负责。",
      infringementStatement:
        "所有资料、信息及其他内容涉及中检溯源及其客户企业的知识产权和相关权益，未经许可，不得随意下载，转载和用于未经授权的其他途径，中检溯源及其客户企业有权诉诸法律维护自身合法权益",
      save: "点击下方“保存”"
    },
    traceabilityBatchCoding: {
      entry:
        "点击最左侧列表：追溯信息管理＞追溯批次赋码；选择对应批次编号，点击其右侧“维护”；进入追溯批次赋码界面，点击右侧“编辑”；在“单品追溯码”后填写追溯码，一个填写框只能写一个码，追溯码前五位的“0”不能去除，需要完整填入；输入所有溯源码序号后，点击右下角“保存”。"
    },
    production_enterprise: "",
    product_brand: "",
    specification_model: "",
    bar_code: "",
    origin: "",
    product_classification: "",
    shelf_life: "",
    storage_environment: "",
    ingredient_information: "",
    product_picture: "",
    product_details: ""
  },
  {
    login: {
      website: "https://trace.cciccloud.com/trace-web/#!/login",
      username: "caicf@peidibrand.com",
      password: "PDGFkj12345678"
    },
    entryPage:
      "点击左侧“溯源信息管理”；点击“溯源信息录入”；点击“国产宠物食品溯源”；默认进入“实地评价”信息录入界面。",
    onSiteEvaluation: {
      add: "点击右上角的 '新增'",
      batchNumber: {
        description: "输入编写后的批次编号",
        rules: [
          "温州工厂：PDDWYY + 删除项目编号中的 '-' + 生产日期（年 + 月 + 日）",
          "江苏工厂：PDKB + 删除项目编号中的 '-' + 生产日期（年 + 月 + 日）"
        ],
        examples: [
          "PDKB+CK241100+20231109 变为 PDKBCK24110020231109",
          "PDDWYY+CK2950+20231109 变为 PDDWYYCK295020231109"
        ]
      },
      selectedProduct:
        "点击“选择”，输入“产品名称”或“产品编号”点击“查询”；选择对应产品在其右侧点击“选择”；点击右下角“确认”。",
      factoryName: "佩蒂动物营养科技股份有限公司",
      address: "浙江省温州市平阳县水头镇工业园区宠乐路2号",
      factoryIntroduction:
        "佩蒂动物营养科技股份有限公司在2015年在新三板挂牌，初步踏入资本市场，后转板成功，于2017年7月11日成功在深交所创业板上市，成为我国宠物行业第一家上市公司。自上市以来，我们持续完善公司治理，主动与监管部门沟通，以规范运营和加强信息披露为底线，夯实发展根基。2018年，我们启动了“双轮驱动”的发展战略，在坐稳国内制造的基础上，坚持生产制造和品牌塑造双核心、国内国外双向发展，响应“一带一路”，积极实施“走出去”发展的策略。为提高产品质量，我们通过持续的研发投入，提升中国制造产品的技术含量和附加值逐步探索供应链的国际化。我们的原材料供应不仅有来自中国的和项目所在国的，还有来自乌兹别克斯坦、日本、泰国和巴西等国的原材料。2020年，公司入选浙江“省级供应链创新与应用第二批试点企业”，我们还将继续探索宠物食品企业如何建设高效的供应链这一课题。",
      factoryDisplay: "点击 '+', 上传 '温州厂区' 照片",
      save: "点击下方 '保存'"
    },
    rawMaterialPurchase: {
      entry:
        "点击左侧的 '原料采购'默认显示未录入批次，点击右侧的 '录入' 进入录入界面",
      materialName: "填写原料三方检测中的原料名称",
      materialSource: "填写原料供应商名称",
      supplier: "填写原料供应商名称",
      inspectionReport: "点击 '+', 上传 '出厂检验报告'、'三方检测报告' 照片",
      purchaseBatchNumber: "填写原料三方检测中的原料批号",
      save: "点击下方 '保存'"
    },
    productProduction: {
      entry:
        "点击左侧的 '产品生产'默认显示未录入批次，点击右侧的 '录入' 进入录入界面",
      productionProcess: "点击 '+', 上传 '温州佩蒂鱼干生产工艺' 照片",
      productionDate: "选择生产日期",
      productionBatchNumber: "输入产品批号，同上方 '批次编号'",
      productionTechnology: "",
      technologyDescription: "",
      save: "点击下方 '保存'"
    },
    finishedProductControl: {
      entry:
        "点击左侧的 '成品控制'默认显示未录入批次，点击右侧的 '录入' 进入录入界面",
      inspectionResult: "合格",
      inspectionReport: "点击 '+', 上传 '检测报告'、'终检单' 照片",
      save: "点击下方 '保存'"
    },
    afterSalesService: {
      entry:
        "点击左侧的 '售后服务'默认显示未录入批次，点击右侧的 '录入' 进入录入界面",
      contactAddress: "浙江省杭州市萧山区宁围街道诺德财富中心1幢2001室",
      hotline: "400-836-1508",
      save: "点击下方 '保存'"
    },
    traceabilityIdentification: {
      entry:
        "点击左侧“售后服务”；默认显示未录入批次，点击右侧“录入”，进入录入界面。",
      traceabilityType: "合规申明溯源",
      identificationType: "防伪防转移一物一码标识",
      identificationFunction:
        "涂层+金属线防伪 一次性易碎防转移 唯一身份识别+随机码验证",
      verificationMode:
        "扫描溯源二维码，点击底部“防伪查询”，输入银色涂层下方的4位数随机码查询验证",
      save: "点击下方“保存”"
    },
    cciStatement: {
      entry:
        "点击左侧“中检声明”；默认显示未录入批次，点击右侧“录入”，进入录入界面。",
      traceabilityType: "产品合规申明溯源",
      consumerService:
        "宠物食品/产品追溯热线：0571-56551738或13567137494(微信同号)，QQ社群号：663988914",
      authenticityStatement:
        "本产品溯源信息链接包含的资料、信息等，均由中检溯源及其客户企业共同提供。但中检溯源仅对由自身（含中检各分支机构）直接采集的信息和出具的报告、证书负责。中检溯源开展检验、检测、认证、验证等活动所获得的企业和产品信息，均在申请企业保证诚信的前提下现场或线上采集，与此相关的报告以及证书为我方据实出具，但并不能免除生产方、贸易双方、承运人等所应承担的义务和法律责任，任何有意或无意的虚假行为所造成的后果由当事方自行承担负责。",
      infringementStatement:
        "所有资料、信息及其他内容涉及中检溯源及其客户企业的知识产权和相关权益，未经许可，不得随意下载，转载和用于未经授权的其他途径，中检溯源及其客户企业有权诉诸法律维护自身合法权益",
      save: "点击下方“保存”"
    },
    traceabilityBatchCoding: {
      entry:
        "点击最左侧列表：追溯信息管理＞追溯批次赋码；选择对应批次编号，点击其右侧“维护”；进入追溯批次赋码界面，点击右侧“编辑”；在“单品追溯码”后填写追溯码，一个填写框只能写一个码，追溯码前五位的“0”不能去除，需要完整填入；输入所有溯源码序号后，点击右下角“保存”。"
    },
    production_enterprise: "",
    product_brand: "",
    specification_model: "",
    bar_code: "",
    origin: "",
    product_classification: "",
    shelf_life: "",
    storage_environment: "",
    ingredient_information: "",
    product_picture: "",
    product_details: ""
  }
];

export default factories;
