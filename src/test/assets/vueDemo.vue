/***/
<script setup lang="ts">




import { ref } from 'vue';
const name = ref("");
function getName(name:string){
    return name
}
</script>

<template>
    <div class=''>
        <h1>123123123</h1>
        <h1>{name}</h1>
    </div>
</template>

<style lang='scss' scoped>

</style>