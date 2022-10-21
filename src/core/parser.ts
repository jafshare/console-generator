import { parse } from "@babel/parser";
/**
 * 解析code 
 * @param code 
 * @returns 
 */
export function parser(code: string) {
  return parse(code);
}
