import CryptoJS from "crypto-js";
export const CRYPTOJS_KEY = "secret key peidi12345";

/**
 * 解密
 * @param encryptedData 加密数据
 * @returns 解密后的字符串
 */
export const decrypt = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, CRYPTOJS_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
