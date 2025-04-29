import { id } from "element-plus/es/locale/index.mjs";
import path from "path";
import axios from "axios";
import { downloadFile } from "@/api/pmApi.ts";
import { getToken, formatToken } from "@/utils/auth";

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
      statusName: postData.statusName,
      login: {
        website: JSON.parse(postData.loginInfo)?.website || "",
        username: JSON.parse(postData.loginInfo)?.username || "",
        password: JSON.parse(postData.loginInfo)?.password || ""
      },
      entryPage: postData.infoEntryPage,
      onSiteEvaluation: {
        add: postData.fieldEvaluationAdd,
        batchNumber: JSON.parse(postData.batchNo) || {},
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
        verificationMode: postData.verificationMode,
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
      productPicture: postData.productPicture
        ? JSON.parse(postData.productPicture)
        : [],
      productDetails: postData.productDetails
        ? JSON.parse(postData.productDetails)
        : [],
      factoryPicture: postData.factoryPicture
        ? JSON.parse(postData.factoryPicture)
        : [],
      productionProcessDrawing: postData.productionProcessDrawing
        ? JSON.parse(postData.productionProcessDrawing)
        : [],
      sellingPoint: postData.sellingPoint,
      sellingPointFile: postData.sellingPointFile
        ? JSON.parse(postData.sellingPointFile)
        : []
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
    verificationMode: newProduct.traceabilityIdentification.verificationMode,
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
    id: newProduct.id || null,
    factoryPicture: JSON.stringify(newProduct.factoryPicture),
    productionProcessDrawing: JSON.stringify(
      newProduct.productionProcessDrawing
    ),
    sellingPoint: newProduct.sellingPoint,
    sellingPointFile: JSON.stringify(newProduct.sellingPointFile)
  };
  return postData;
};

export const mappingRecord = newRecord => {
  let nowData = JSON.parse(JSON.stringify(newRecord));

  nowData.factoryInspectionReports.map(item => {
    item.path = item.name;
    console.log("item", item);
  });
  nowData.finalInspectionReports.map(item => {
    item.path = item.name;
    console.log("item", item);
  });
  nowData.ingredientList.map(item => {
    item.quarantineCertificateRecords.map(item1 => {
      item1.path = item1.name;
    });
    item.tripartiteInspectionRecords.map(item1 => {
      item1.path = item1.name;
    });
  });
  console.log("nowData", nowData);
  return nowData;
};

export const reverseMappingRecord = nowData => {
  nowData.map(item => {
    item.factoryInspectionReports.map(item1 => {
      item1.name = item1.path;
      item1.type = "success";
    });
    item.finalInspectionReports.map(item1 => {
      item1.name = item1.path;
      item1.type = "success";
    });
    item.ingredientList.map(item1 => {
      item1.quarantineCertificateRecords.map(item2 => {
        item2.name = item2.path;
        item2.type = "success";
      });
      item1.tripartiteInspectionRecords.map(item2 => {
        item2.name = item2.path;
        item2.type = "success";
      });
    });
  });
  return nowData;
};

export const downloadFileFun1 = file => {
  const name = file.name;
  axios({
    method: "get",
    url: "https://api.peidigroup.cn/prm/common/download", // 替换为你的下载接口
    params: {
      objectName: "prm/traceability-Flow/" + name
    },
    responseType: "arraybuffer", // 确保服务器返回的是 Blob 数据
    headers: {
      Authorization: formatToken(getToken().accessToken)
    }
  })
    .then(res => {
      console.log("res", res);
      // 创建一个 Blob 对象
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      // 创建一个 URL 对象
      const url = URL.createObjectURL(blob);
      // 创建一个链接元素
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      // 触发下载
      document.body.appendChild(a);
      a.click();
      // 移除链接元素
      document.body.removeChild(a);
      // 释放 URL 对象
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error("下载文件失败:", error);
    });
};

export const downloadFileFun = file => {
  const name = file.name; // 获取文件名
  axios({
    method: "get",
    url: "https://api.peidigroup.cn/prm/common/download", // 下载接口的URL
    params: {
      objectName: "prm/traceability-Flow/" + name // 设置请求参数，指定要下载的文件
    },
    responseType: "arraybuffer", // 确保服务器返回的是二进制数据
    headers: {
      Authorization: formatToken(getToken().accessToken) // 设置请求头，包含授权信息
    }
  })
    .then(res => {
      console.log("res", res); // 打印响应结果
      // 获取文件扩展名
      const extension = name.split(".").pop().toLowerCase();
      // 根据扩展名设置 MIME 类型
      let mimeType = "";
      switch (extension) {
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "gif":
          mimeType = "image/gif";
          break;
        default:
          mimeType = "application/octet-stream"; // 默认类型
      }
      // 创建一个 Blob 对象
      const blob = new Blob([res.data], { type: mimeType });
      // 创建一个 URL 对象
      const url = URL.createObjectURL(blob);
      // 创建一个链接元素
      const a = document.createElement("a");
      a.href = url;
      a.download = name; // 设置下载文件名
      // 触发下载
      document.body.appendChild(a);
      a.click();
      // 移除链接元素
      document.body.removeChild(a);
      // 释放 URL 对象
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error("下载文件失败:", error); // 打印错误信息
    });
};
