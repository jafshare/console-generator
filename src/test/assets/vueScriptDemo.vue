<script>
const name = '123123'
export default {
    name: "Demo",
    data() {
        return {}
    },
    methods: {
        calcAge(age) {
            return age
        }
    }
}
</script>
<template>
    <h1>{{ msg }}</h1>
    <input v-model="msg">
</template>