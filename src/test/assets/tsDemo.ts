const name = "hello";
const age = 23;
const info = {
  name: "张三",
  age: 23,
  detail: {
    address: "home",
  },
};
let time = 20 - 10;
function say(name: string, age: number) {
  return name + ",你好";
}

const outer = (name: string) => {
  console.log("name:", name);
  console.log(
    "%c name:",
    "color: white; background: rgb(0, 122, 204); font-size: 12px;",
    name
  );
  return (age: number) => {
    return name + age;
  };
};
