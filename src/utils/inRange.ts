/**
 * 判断pos是否在给定的[start,end]范围内
 * @param pos 位置
 * @param start
 * @param end
 * @returns
 */
export function inRange(pos: number, start: number, end: number) {
  return pos >= start && pos <= end;
}
