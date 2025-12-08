// 抽离一些公共的方法和常量
export const FORM_LABEL_WIDTH = "100px";

import { Ref, nextTick } from "vue";

import {
  updateEsgConfig,
  getEsgRuleDetail,
  getFileDownLoadPath
  // @ts-ignore
} from "@/api/esg";
import { ElMessage } from "element-plus";

/**
 * 通用的ESG保存函数
 * @param formData 表单数据
 * @param activeTab 当前激活的标签页
 * @param year 年份
 * @param curDDUserInfo 当前用户信息
 * @param type 保存类型，可选值："request" | "autoSave"
 */
export function useEsgSave(
  formData: Ref<any>,
  activeTab: Ref<string>,
  year: Ref<string>,
  curDDUserInfo: Ref<any>,
  type: string = "request"
) {
  const handleSave = () => {
    console.log("保存数据:", formData.value);
    const sendConfig = {
      content: JSON.stringify(formData.value),
      type: activeTab.value,
      year: year.value,
      userId: curDDUserInfo.value?.id,
      userName: curDDUserInfo.value?.username
    };

    return updateEsgConfig(sendConfig).then((res: any) => {
      if (res.code === 200) {
        if (type === "request") {
          ElMessage.success("保存成功");
        }
      } else {
        ElMessage.error("保存失败");
      }
      return res;
    });
  };

  return {
    handleSave
  };
}

/**
 * 通用的ESG取消函数
 */
export function useEsgCancel() {
  const handleCancel = () => {
    // 自定义取消逻辑
    console.log("取消操作");
  };

  return {
    handleCancel
  };
}

/**
 * 通用的ESG数据加载函数
 * @param formData 表单数据
 * @param emptyFormData 空表单数据（用于重置）
 * @param activeTab 当前激活的标签页
 * @param year 年份
 * @param curDDUserInfo 当前用户信息
 * @param isEdit 是否有编辑权限
 */
export function useEsgLoadData(
  formData: Ref<any>,
  emptyFormData: any,
  activeTab: Ref<string>,
  year: Ref<string>,
  curDDUserInfo: Ref<any>,
  isEdit: Ref<boolean>
) {
  const loadData = async () => {
    try {
      // 初始化表单数据
      Object.keys(formData.value).forEach(key => {
        // 如果是数组类型，需要确保完全重置为空数组
        if (Array.isArray(emptyFormData[key])) {
          formData.value[key] = [...emptyFormData[key]]; // 创建新数组引用
        } else {
          formData.value[key] = emptyFormData[key];
        }
      });
      // console.log("空表单数据:", emptyFormData);
      // console.log("初始化后的表单数据:", formData.value);
      const res = await getEsgRuleDetail({
        type: activeTab.value,
        year: year.value
      });
      if (res.code === 200 && res.data) {
        // 如果没有编辑权限，则遍历res.data数组，把每个对象相同的字段值进行拼接
        if (!isEdit.value) {
          res.data.forEach((item: any) => {
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
          // 如果有编辑权限，则找到res.data里userId等于props.curDDUserInfo?.id的对象，把它的content赋值给formData
          const userItem = res.data.find(
            (item: any) => item.userId == curDDUserInfo.value?.id
          );
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
      }
    } catch (error) {
      console.error("获取数据失败:", error);
    }
  };

  return {
    loadData
  };
}

/**
 * 通用的ESG文件上传处理函数
 * @param dialogImageUrl 图片预览URL
 * @param dialogVisible 预览对话框显示状态
 * @param curDDUserInfo 当前用户信息
 * @param formData 表单数据（可选，用于处理上传成功逻辑）
 * @param handleSave 保存函数（可选，用于处理上传成功逻辑）
 */
export function useEsgFileUpload(
  dialogImageUrl: Ref<string>,
  dialogVisible: Ref<boolean>,
  curDDUserInfo: Ref<any>,
  formData?: Ref<any>,
  handleSave?: () => Promise<any>
) {
  const handleFileChange = (file: any, fileList: any[]) => {
    console.log("文件变化:", file, fileList);
  };

  const handleFileBeforeUpload = (file: any) => {
    // 生成新的文件名
    const newFileName = curDDUserInfo.value.username + "_" + file.name;

    // 使用 new File 构造新的文件对象，并设置新的文件名
    const newFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified
    });
    // 返回新的文件对象
    return newFile;
  };

  const handlePictureCardPreview = (uploadFile: any) => {
    if (uploadFile.response?.code !== 200) return;
    getFileDownLoadPath({
      objectName: uploadFile.response.data
    })
      .then((res: any) => {
        const { code, msg, data } = res;
        if (code === 200) {
          dialogImageUrl.value = res.data;
          dialogVisible.value = true;
        } else {
          ElMessage.error("图片预览失败--" + msg);
        }
      })
      .catch((err: any) => {
        ElMessage.error("图片预览失败");
      });
  };

  // 文件上传成功处理函数
  const handleUploadSuccess = (fileListKey: string) => () => {
    if (formData && handleSave) {
      // 遍历替换文件名
      formData.value[fileListKey] = formData.value[fileListKey].map(
        (item: any) => ({
          ...item,
          name: item.response.data.split("/").pop()
        })
      );
      handleSave();
    }
  };

  // 文件删除处理函数
  const handleUploadRemove = () => {
    if (handleSave) {
      nextTick(() => handleSave());
    }
  };

  return {
    handleFileChange,
    handleFileBeforeUpload,
    handlePictureCardPreview,
    handleUploadSuccess,
    handleUploadRemove
  };
}
