const name = "hello";
const age = 23;
const info = {
  name: "张三",
  age: 23,
  detail: {
    address: "home",
  },
};
let start;
let end;
let time = end - start;
function say(name, age) {
  return name + ",你好";
}
time = start;
console.log("%c time:","color: white; background: rgb(0, 122, 204); font-size: 12px;",time);
time = 1;
const outer = (name) => {
  console.log("name:", name);
  return (age) => {
    return name + age;
  };
};
