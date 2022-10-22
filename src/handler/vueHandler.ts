import { parse } from "@vue/compiler-sfc";
import { Position } from "./index";
import { jsHandler, calcPosition } from "./jsHandler";
function parseVueText(code: string) {
  // 利用vue解析器，拆分script的代码
  const { descriptor } = parse(code);
  if (!descriptor.scriptSetup && !descriptor.script) {
    return;
  }
  const loc = descriptor.scriptSetup
    ? descriptor.scriptSetup.loc
    : descriptor.script?.loc!;
  return loc;
}
function calcVuePosition(code: string, offset: number) {
  let identifier = "";
  let position: Position | undefined | null;
  const loc = parseVueText(code);
  if (!loc) {
    return {
      identifier,
      position,
    };
  }
  const scriptCode = loc.source;
  // 相对于script位置转换offset
  const contentOffset = offset - loc.start.offset;
  // 提取script的代码，交由babel处理解析
  const calcResult = jsHandler.calcPosition(scriptCode, contentOffset);
  // 需要增加script的偏移量
  position = calcPosition(calcResult.position, {
    line: loc.start.line - 1,
    column: 0,
  });
  identifier = calcResult.identifier;
  return { position, identifier };
}
function deleteConsole(code: string) {
  const loc = parseVueText(code);
  if (!loc) return [];
  const scriptCode = loc.source;
  const positions = jsHandler.delete(scriptCode);
  return positions.map(([startPos, endPos]) => {
    // 需要增加script的偏移量
    const finalStartPos = calcPosition(startPos, {
      line: loc.start.line - 1,
      column: 0,
    });
    const finalEndPos = calcPosition(endPos, {
      line: loc.start.line - 1,
      column: 0,
    });
    return [finalStartPos, finalEndPos];
  });
}
export const vueHandler = {
  calcPosition: calcVuePosition,
  delete: deleteConsole,
};
