import { parser } from "../core/parser";
import traverse, { NodePath } from "@babel/traverse";
import generator from "@babel/generator";
import { inRange } from "../utils/inRange";
import {
  isFunctionDeclaration,
  isBlockStatement,
  isReturnStatement,
  isExpressionStatement,
  Identifier,
} from "@babel/types";
import type { Position } from "./index";
export function calcPosition(
  p: Position | undefined | null,
  p1: Position | undefined | null
): Position | undefined | null {
  if (!p || !p1) return p;
  return {
    line: p.line + p1.line,
    column: p.column + p1.column,
    index: (p.index || 0) + (p1.index || 0),
  };
}
/**
 * 获取标识符，由于存在obj.name的情况,所以需要拼接父路径
 * @param path
 */
function getIdentifier(path: NodePath<Identifier>, root: string = "") {
  let identifier = "";
  let currentPath: any = path;
  let parentPath = path.parentPath;
  /**-----------------------------------------------------------------------------------------------------------------------
   * TODO
   * 处理如下情况:
   * const info = {
   *  name: "张三",
   *   age: 23,
   *  detail: {
   *    address: "home",
   *  },
   *};
   *
   *
   *
   *-----------------------------------------------------------------------------------------------------------------------**/
  /**-----------------------------------------------------------------------------------------------------------------------
   * 处理取对象属性的情况,parentPath.node.property === path.node是为了处理a.b的时候，a也被识别为child的情况
   * 例如: const name = a.b.name
   *-----------------------------------------------------------------------------------------------------------------------**/
  while (
    parentPath &&
    parentPath.isMemberExpression() &&
    parentPath.node.property === path.node
  ) {
    currentPath = parentPath;
    parentPath = parentPath.parentPath;
  }
  console.log("node:", currentPath.node);
  // 如果path和currentPath一致，说明没有嵌套取值
  if (path.node === currentPath.node) {
    identifier = path.node.name;
  } else {
    // 根据当前的node生成语句，不用手动生成
    identifier = generator(currentPath.node, {}).code;
  }
  return root ? `${root}.${identifier}` : identifier;
}

function generate(code: string, offset: number) {
  const ast = parser(code);
  let identifier = "";
  let position: Position | undefined | null;
  traverse(ast, {
    /**
     * 普通变量
     * 例如: const name = "张三"
     */
    Identifier: (path) => {
      const { node } = path;
      if (node) {
        if (inRange(offset, node.start as number, node.end as number)) {
          //中断遍历
          path.stop();
          identifier = getIdentifier(path);
          // 处理函数的情况
          const parentPath = path.parentPath;
          if (parentPath) {
            if (
              parentPath.isFunctionDeclaration() ||
              parentPath.isArrowFunctionExpression()
            ) {
              // TODO 判断函数是否合法 有代码块{}
              if (isBlockStatement(parentPath.node.body)) {
                // 如果是函数参数，则需要生成在函数体里面，如果是函数名，则生成在函数后面
                const isParam = parentPath.node.params.includes(node);
                // 是否是函数名
                const isFunctionName = isFunctionDeclaration(parentPath.node)
                  ? parentPath.node.id === node
                  : false;
                if (isFunctionName) {
                  // 函数名
                  position = parentPath.node.body.loc?.end;
                } else if (isParam) {
                  // 函数参数
                  position = parentPath.node.body.loc?.start;
                }
              }
              // TODO 处理没有代码块的情况
              return;
            }
          }
          // 处理表达式的情况
          const nearestParentPath = path.findParent(
            (path) =>
              path.isVariableDeclaration() || // 变量语句
              path.isReturnStatement() || // 返回语句
              path.isAssignmentExpression() // 赋值语句
          );
          if (nearestParentPath) {
            // TODO 处理没有代码块包裹的情况
            // 如果是函数返回
            if (isReturnStatement(nearestParentPath)) {
              position = calcPosition(nearestParentPath.node.loc?.start, {
                line: -1,
                column: 0,
              });
            } else {
              position = nearestParentPath.node.loc?.end;
            }
            return;
          }
        }
      }
    },
  });
  return { identifier, position };
}
function deleteConsole(code: string) {
  const ast = parser(code);
  let positions: [Position, Position][] = [];
  traverse(ast, {
    MemberExpression(path) {
      if (
        path.node.object.type === "Identifier" &&
        path.node.object.name === "console" &&
        path.node.property.type === "Identifier" &&
        path.node.property.name === "log"
      ) {
        // 停止遍历子节点
        path.skip();
        // 删除ExpressionStatement
        if (isExpressionStatement(path.parentPath.parentPath)) {
          positions.push([
            path.parentPath.parentPath.node.loc?.start!,
            path.parentPath.parentPath.node.loc?.end!,
          ]);
        }
      }
    },
  });
  // 反转，避免行删除后，导致后续删除出错
  positions.reverse();
  return positions;
}
export const jsHandler = {
  calcPosition: generate,
  delete: deleteConsole,
};
