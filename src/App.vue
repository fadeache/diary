<script setup>
import Diary from "./components/diary.vue";
import Login from "./components/login.vue";
import { onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isLogin = ref(false);
const owner = ref("");
store.dispatch("user/login").then((rst) => {
  if (rst) setAndLogin(rst);
});
const whetherLogin = (rst) => setAndLogin(rst);
const setAndLogin = (rst) => {
  document.title = rst.data.name + "的日记本";
  owner.value = rst.data;
  isLogin.value = true;
};
</script>

<template>
  <Diary v-if="isLogin" :owner="owner" />
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
