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

const outer = (name) => {
  
  return (age) => {
    
    
    return name + age;
  };
};

