import { getSetting } from "./setting";

export interface StatementOptions {
  // 是否换行(主要用于最后一行，插入没有换行的问题)
  newline?: boolean;
  // 是否使用;结尾
  semi?: boolean;
  // 缩进
  indent?: number;
  // 展示行号
  showLine?: boolean;
  // 当展示行号，则需要提供行号
  line?: number;
  // 展示文件名
  showFilename?: boolean;
  // 当需要展示文件名，则需要提供文件名
  filename?: string;
  // 自定义前缀
  customPrefix?: {
    // 模板
    template: string;
    // 样式
    style?: string;
  };
}
/**
 * 生成空格
 * @param num
 * @returns
 */
function generateSpace(num: number) {
  return new Array(num).fill(" ").join("");
}
export function generateConsoleStatement(
  identifier: string,
  opts?: StatementOptions
) {
  const {
    newline = false,
    semi = true,
    indent = 0,
    customPrefix,
  } = getSetting("", opts || {}) as StatementOptions;
  const semiStr = semi ? ";" : "";
  const indentStr = indent ? generateSpace(indent) : "";
  const newlineStr = newline ? "\n" : "";
  // default
  let logStr = `console.log("${identifier}:",${identifier})`;
  // 自定义模板处理
  if (customPrefix?.template) {
    const template = customPrefix.template.replace(/(#[ifn])/g, (_, flag) => {
      switch (flag) {
        case "#i":
          return identifier;
        case "#f":
          // TODO 文件名
          break;
        case "#n":
          // TODO 行号
          break;
      }
      return flag;
    });
    if (customPrefix.style) {
      logStr = `console.log(\`%c ${template}","${customPrefix?.style}\`,${identifier})`;
    } else {
      logStr = `console.log("${template}",${identifier})`;
    }
  }

  return `${newlineStr}${indentStr}${logStr}${semiStr}\n`;
}
