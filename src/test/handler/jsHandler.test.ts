import { describe, test, expect } from "vitest";
import { getHandler } from "../../handler";
const normalCode = `const test="123";`;
const functionCode = `function getName(a,b){
  return a + b
}`;
const arrowFunctionCode = `const getName = (a,b) => {
  return a + b
}`;
const objectCode = `const name = {
  name:"张三",
  age:12
}`;
const nestingObjectCode = `const name = {
  name:"张三",
  age:12,
  detail:{
    address: "东风",
    email:"12@12.com"
  }
}`;
describe("js handler tests", () => {
  const handler = getHandler("js");
  test("普通表达式", () => {
    const code = normalCode;
    const { identifier, position } = handler.calcPosition(code, 9);
    expect(position).toEqual({ line: 1, column: 17, index: 17 });
    expect(identifier).toBe("test");
  });
  test("普通函数", () => {
    const code = functionCode;
    const { identifier, position } = handler.calcPosition(code, 12);
    expect(position).toEqual({ line: 3, column: 1, index: code.length });
    expect(identifier).toBe("getName");
  });
  test("函数参数", () => {
    const code = functionCode;
    const { identifier, position } = handler.calcPosition(code, 18);
    expect(position).toEqual({ line: 1, column: 21, index: 21 });
    expect(identifier).toBe("a");
  });
  test("函数返回", () => {
    const code = functionCode;
    const { identifier, position } = handler.calcPosition(code, 33);
    expect(position).toEqual({ line: 1, column: 2, index: 25 });
    expect(identifier).toBe("a");
  });
  test("箭头函数", () => {
    const code = arrowFunctionCode;
    const { position, identifier } = handler.calcPosition(code, 8);
    expect(position).toEqual({ line: 3, column: 1, index: code.length });
    expect(identifier).toBe("getName");
  });
  test("对象表达式", () => {
    const code = objectCode;
    const { position, identifier } = handler.calcPosition(code, 8);
    expect(position).toEqual({ line: 4, column: 1, index: code.length });
    expect(identifier).toBe("name");
  });
  test("对象表达式-属性", () => {
    const code = objectCode;
    const { position, identifier } = handler.calcPosition(code, 33);
    expect(position).toEqual({ line: 4, column: 1, index: code.length });
    expect(identifier).toBe("age");
  });
  test("嵌套对象", () => {
    const code = nestingObjectCode;
    const { position, identifier } = handler.calcPosition(code, 8);
    expect(position).toEqual({ line: 8, column: 1, index: code.length });
    expect(identifier).toBe("name");
  });
});
