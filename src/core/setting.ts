import { workspace } from "vscode";
export const SETTING_PREFIX = "consoleGenerator";
function resolveSetting(key?: string, defaultSetting?: Record<string, any>) {
  const userSetting = getUserSetting(key);
  const setting: Record<string, any> = {
    ...defaultSetting,
  };
  if (!key) {
    return { ...defaultSetting, ...(userSetting as any) };
  }
  return userSetting ?? setting[key as keyof typeof defaultSetting];
}
/**
 * 如果未提供key，则获取所有相关的配置信息
 * @param key
 * @returns
 */
function getUserSetting(key?: string) {
  const value = workspace
    .getConfiguration()
    .get(key ? `${SETTING_PREFIX}.${key}` : `${SETTING_PREFIX}`);
  function transObject(obj: Record<string, any>) {
    const newObj = { ...obj };
    // 处理proxy的情况
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object") {
        newObj[key] = transObject(value);
      }
    }
    return newObj
  }
  return typeof value === "object" ? transObject(value as any) : value;
}
/**
 * 配置信息,如果提供key，则返回对应的value,否则返回所有配置
 * @param key
 * @param defaultSetting
 * @returns
 */
export function getSetting(key?: string, defaultSetting?: Record<string, any>) {
  return resolveSetting(key, defaultSetting);
}
