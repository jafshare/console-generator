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
  const funName = outer.name;
  const result = outer("name")(12).name;
  return (age: number) => {
    return {
      name: { name },
      age,
    };
  };
};
