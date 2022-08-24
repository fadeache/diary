<script setup>
import Diary from "./components/diary.vue";
import Login from "./components/login.vue";
import { onBeforeMount, ref } from 'vue'
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const store = useStore()
const isLogin = ref(false)
onBeforeMount(() =>
{
  store.dispatch("user/login").then((rst) =>
  {
    if (rst) isLogin.value = true
  })
});
const whetherLogin = (whether) => isLogin.value = whether
</script>

<template>
  <Diary v-if="isLogin" />
  <Login v-else @whetherLogin="whetherLogin" />
</template>

<style>
#app {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #fff;
}
</style>
