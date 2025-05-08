/**
 * 将数字转换为逗号分隔的格式
 * @param number 需要转换的数字
 * @returns 转换后的逗号分隔格式字符串
 */
export const changeNumberFormat = (num: number | undefined) => {
  if (typeof num !== "number") {
    return "";
  }
  if (num === 0) {
    return "0";
  }
  let sign = "";
  if (num < 0) {
    sign = "-";
    num = -num;
  }
  const s = num.toString();
  const reversed = s.split("").reverse().join("");
  const chunks = [];
  for (let i = 0; i < reversed.length; i += 3) {
    const chunk = reversed
      .substring(i, i + 3)
      .split("")
      .reverse()
      .join("");
    chunks.push(chunk);
  }
  chunks.reverse();
  return sign + chunks.join(",");
};
