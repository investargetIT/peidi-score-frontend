/**
 * 团建经费按入职日期限定可用月份：
 * - 今年入职：15号及之前入职当月可用，15号之后入职次月才可用，未入职月份一律置灰
 * - 以前年份入职：全年可用
 * - 未来入职：全部置灰
 *
 * 兼容 "YYYY-MM-DD" / "YYYY-MM-DD HH:mm:ss" / "YYYY-MM-DDTHH:mm:ss" 等格式，统一取前 10 位
 *
 * @param hireDate  入职日期（可带时间）
 * @param realMonths 接口返回的 12 个月经费使用情况 boolean[12]，true=该月已用(灰)
 * @returns boolean[12]：true=灰（已用 / 入职前不享受），false=绿（未用）
 */
export const getFundMonthsWithHireDate = (
  hireDate?: string,
  realMonths?: boolean[]
): boolean[] => {
  const months = Array.from({ length: 12 }, (_, i) => !!realMonths?.[i]);
  if (!hireDate) return months;
  const [y, m, d] = String(hireDate).slice(0, 10).split("-").map(Number);
  if (!y || !m) return months;
  const curYear = new Date().getFullYear();
  if (y > curYear) return months.map(() => true);
  if (y < curYear) return months;
  const startMonth = d >= 1 && d <= 15 ? m : m + 1; // 15号之后从次月起算
  for (let i = 1; i < startMonth; i++) months[i - 1] = true; // 未入职月份置灰
  return months;
};
