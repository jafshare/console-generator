import { parser } from "../core/parser";
import traverse from "@babel/traverse";
import { inRange } from "../utils/inRange";
export interface Location {
  start: { line: number; column: number; index?: number };
  end: { line: number; column: number; index?: number };
}
export function jsHandler(code: string, offset: number) {
  const ast = parser(code);
  let finalOffset = offset;
  let identifier = "";
  let loc: Location | undefined | null;
  traverse(ast, {
    /**
     * 普通变量
     * 例如: const name = "张三"
     */
    Identifier: (path) => {
      const { node } = path;
      if (node) {
        if (inRange(offset, node.start as number, node.end as number)) {
          identifier = path.node.name;
          const parentNodePath = path.findParent(
            (path) =>
              path.isVariableDeclaration() || path.isFunctionDeclaration()
          );
          if (parentNodePath) {
            // offset为node.end
            finalOffset = parentNodePath.node.end!;
            loc = parentNodePath.node.loc;
          }
          //中断遍历
          path.stop();
        }
      }
    },
    // TODO 类参数、箭头函数
  });
  return { offset: finalOffset, identifier, loc };
}
