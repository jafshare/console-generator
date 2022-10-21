import { describe, test, expect } from "vitest";
import { jsHandler } from "../handler/jsHandler";
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
describe("console-generator tests", () => {
  test("普通表达式", () => {
    const code = normalCode;
    const { offset, identifier } = jsHandler(code, 9);
    expect(offset).toBe(code.length);
    expect(identifier).toBe("test");
  });
  test("普通函数", () => {
    const code = functionCode;
    const { offset, identifier } = jsHandler(code, 12);
    expect(offset).toBe(code.length);
    expect(identifier).toBe("getName");
  });
  test("箭头函数", () => {
    const code = arrowFunctionCode;
    const { offset, identifier } = jsHandler(code, 8);
    expect(offset).toBe(code.length);
    expect(identifier).toBe("getName");
  });
  test("对象表达式", () => {
    const code = objectCode;
    const { offset, identifier } = jsHandler(code, 8);
    expect(offset).toBe(code.length);
    expect(identifier).toBe("name");
  });
  test("对象表达式-属性", () => {
    const code = objectCode;
    const { offset, identifier } = jsHandler(code, 33);
    expect(offset).toBe(code.length);
    expect(identifier).toBe("age");
  });
  test("嵌套对象", () => {
    const code = nestingObjectCode;
    const { offset, identifier } = jsHandler(code, 8);
    expect(offset).toBe(code.length);
    expect(identifier).toBe("name");
  });
});
