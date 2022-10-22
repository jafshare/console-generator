import { describe, test, expect } from "vitest";
import { getHandler } from "../../handler";
const sfcCode = `<script setup>
import { ref } from 'vue';
const msg = ref('Hello World!');
</script>
<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>`;
const sfcBlackCode = `<script setup>




import { ref } from 'vue';
const msg = ref('Hello World!');
</script>
<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>`;
const sfcScriptCode = `<script>
const name = '123123'
export default {
    name:"Demo",
    data(){
        return {}
    },
    methods:{
        calcAge(age){
            return age
        }
    }
}
</script>
<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>`;
describe("vue handler tests", () => {
  const handler = getHandler("vue");
  test("setup组件", () => {
    const { position } = handler.calcPosition(sfcCode, 50);
    expect(position).toEqual({ line: 3, column: 32, index: 60 });
  });
  test("setup有空格的组件", () => {
    const { position } = handler.calcPosition(sfcBlackCode, 54);
    expect(position).toEqual({ line: 7, column: 32, index: 64 });
  });
  test("script组件", () => {
    const { position } = handler.calcPosition(sfcScriptCode, 18);
    expect(position).toEqual({ line: 2, column: 21, index: 22 });
  });
});
