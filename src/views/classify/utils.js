import { id } from "element-plus/es/locale/index.mjs";

export function removeDuplicates(arr) {
  const seen = new Object();
  const result = [];
  for (const item of arr) {
    const value = item.value;
    if (!seen[value]) {
      seen[value] = true;
      result.push(item);
    }
  }
  return result;
}

export function extractEmplId(arr) {
  const result = [];
  for (const item of arr) {
    result.push(item.emplId || item.userId);
  }
  return result;
}

export function extractInfo(str) {
  const parts = str.split("/");
  const [nameAndFiles, workerMasterId] = parts;
  const nameAndFilesArr = nameAndFiles.split("#");
  const name = nameAndFilesArr[0];
  const filenames = nameAndFilesArr.slice(1);

  return {
    name: name,
    filename: filenames,
    workerMasterId: workerMasterId
  };
}

export function splitTaskType(val) {
  let arr = val.split("&");
  return {
    value: arr[0],
    priority: arr[1]
  };
}

export const reverseMapping = postData => {
  console.log("postData", postData);
  const newProduct = {
    value: {
      id: postData.id,
      productNo: postData.productNo,
      productName: postData.productName,
      login: {
        website: JSON.parse(postData.loginInfo).website,
        username: JSON.parse(postData.loginInfo).username,
        password: JSON.parse(postData.loginInfo).password
      },
      entryPage: postData.infoEntryPage,
      onSiteEvaluation: {
        add: postData.fieldEvaluationAdd,
        batchNumber: JSON.parse(postData.batchNo),
        selectedProduct: postData.selectedProducts,
        factoryName: postData.factoryName,
        address: postData.detailedAddress,
        factoryIntroduction: postData.factoryProfile,
        factoryDisplay: postData.factoryDisplay,
        save: postData.fieldEvaluationSave
      },
      rawMaterialPurchase: {
        entry: postData.rawMaterialPurchaseAdd,
        materialName: postData.rawMaterialName,
        materialSource: postData.rawMaterialSource,
        supplier: postData.supplier,
        inspectionReport: postData.factoryInspectionReport,
        purchaseBatchNumber: postData.purchaseLotNumber,
        save: postData.rawMaterialPurchaseSave
      },
      productProduction: {
        entry: postData.productProductionAdd,
        productionProcess: postData.productionProcess,
        productionDate: postData.productionDate,
        productionTechnology: postData.productionTechnology,
        technologyDescription: postData.processSpecification,
        save: postData.productProductionSave
      },
      finishedProductControl: {
        entry: postData.finishedProductControlAdd,
        inspectionResult: postData.testResult,
        inspectionReport: postData.testReport,
        save: postData.finishedProductControlSave
      },
      afterSalesService: {
        entry: postData.afterSalesServiceAdd,
        contactAddress: postData.contactAddress,
        hotline: postData.enquiryHotline,
        save: postData.afterSalesServiceSave
      },
      traceabilityIdentification: {
        entry: postData.traceabilityIdentificationAdd,
        traceabilityType: postData.traceabilityType,
        identificationType: postData.identificationType,
        identificationFunction: postData.identificationFunction,
        verificationMethod: postData.verificationMethod,
        save: postData.traceabilityIdentificationSave
      },
      cciStatement: {
        entry: postData.inspectionDeclarationAdd,
        traceabilityType: postData.inspectionTraceabilityType,
        consumerService: postData.consumerService,
        authenticityStatement: postData.authenticityStatement,
        infringementStatement: postData.infringementStatement,
        save: postData.inspectionDeclarationSave
      },
      traceabilityBatchCoding: {
        entry: postData.traceabilityBatchCoding
      },
      productionEnterprise: postData.productionEnterprise,
      productBrand: postData.productBrand,
      specificationModel: postData.specificationModel,
      barCode: postData.barCode,
      origin: postData.origin,
      productClassification: postData.productClassification,
      shelfLife: postData.shelfLife,
      storageEnvironment: postData.storageEnvironment,
      ingredientInformation: postData.ingredientInformation,
      productPicture: JSON.parse(postData.productPicture),
      productDetails: JSON.parse(postData.productDetails)
    }
  };
  console.log("newProduct", newProduct);
  return newProduct.value;
};

export const mapping = newProduct => {
  const postData = {
    productNo: newProduct.productNo,
    productName: newProduct.productName,
    loginInfo: JSON.stringify({
      website: newProduct.login.website,
      username: newProduct.login.username,
      password: newProduct.login.password
    }),
    infoEntryPage: newProduct.entryPage,
    fieldEvaluationAdd: newProduct.onSiteEvaluation.add,
    batchNo: JSON.stringify(newProduct.onSiteEvaluation.batchNumber),
    selectedProducts: newProduct.onSiteEvaluation.selectedProduct,
    factoryName: newProduct.onSiteEvaluation.factoryName,
    detailedAddress: newProduct.onSiteEvaluation.address,
    factoryProfile: newProduct.onSiteEvaluation.factoryIntroduction,
    factoryDisplay: newProduct.onSiteEvaluation.factoryDisplay,
    fieldEvaluationSave: newProduct.onSiteEvaluation.save,
    rawMaterialPurchaseAdd: newProduct.rawMaterialPurchase.entry,
    rawMaterialName: newProduct.rawMaterialPurchase.materialName,
    rawMaterialSource: newProduct.rawMaterialPurchase.materialSource,
    supplier: newProduct.rawMaterialPurchase.supplier,
    factoryInspectionReport: newProduct.rawMaterialPurchase.inspectionReport,
    purchaseLotNumber: newProduct.rawMaterialPurchase.purchaseBatchNumber,
    rawMaterialPurchaseSave: newProduct.rawMaterialPurchase.save,
    productProductionAdd: newProduct.productProduction.entry,
    productionProcess: newProduct.productProduction.productionProcess,
    productionDate: newProduct.productProduction.productionDate,
    productionTechnology: newProduct.productProduction.productionTechnology,
    processSpecification: newProduct.productProduction.technologyDescription,
    productProductionSave: newProduct.productProduction.save,
    finishedProductControlAdd: newProduct.finishedProductControl.entry,
    testResult: newProduct.finishedProductControl.inspectionResult,
    testReport: newProduct.finishedProductControl.inspectionReport,
    finishedProductControlSave: newProduct.finishedProductControl.save,
    afterSalesServiceAdd: newProduct.afterSalesService.entry,
    contactAddress: newProduct.afterSalesService.contactAddress,
    enquiryHotline: newProduct.afterSalesService.hotline,
    afterSalesServiceSave: newProduct.afterSalesService.save,
    traceabilityIdentificationAdd: newProduct.traceabilityIdentification.entry,
    traceabilityType: newProduct.traceabilityIdentification.traceabilityType,
    identificationType:
      newProduct.traceabilityIdentification.identificationType,
    identificationFunction:
      newProduct.traceabilityIdentification.identificationFunction,
    verificationMethod:
      newProduct.traceabilityIdentification.verificationMethod,
    traceabilityIdentificationSave: newProduct.traceabilityIdentification.save,
    inspectionDeclarationAdd: newProduct.cciStatement.entry,
    inspectionTraceabilityType: newProduct.cciStatement.traceabilityType,
    consumerService: newProduct.cciStatement.consumerService,
    authenticityStatement: newProduct.cciStatement.authenticityStatement,
    infringementStatement: newProduct.cciStatement.infringementStatement,
    inspectionDeclarationSave: newProduct.cciStatement.save,
    traceabilityBatchCoding: newProduct.traceabilityBatchCoding.entry,
    productionEnterprise: newProduct.productionEnterprise,
    productBrand: newProduct.productBrand,
    specificationModel: newProduct.specificationModel,
    barCode: newProduct.barCode,
    origin: newProduct.origin,
    productClassification: newProduct.productClassification,
    shelfLife: newProduct.shelfLife,
    storageEnvironment: newProduct.storageEnvironment,
    ingredientInformation: newProduct.ingredientInformation,
    productPicture: JSON.stringify(newProduct.productPicture),
    productDetails: JSON.stringify(newProduct.productDetails),
    id: newProduct.id
  };
  return postData;
};
