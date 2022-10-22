import { parse } from "@babel/parser";
/**
 * 解析code
 * @param code
 * @returns
 */
export function parser(code: string) {
  // 支持ts、jsx语法
  const ast = parse(code, {
    plugins: ["jsx", "typescript"],
    // 设置为module模式，避免解析提示错误
    sourceType: "module",
  });
  return ast;
}
