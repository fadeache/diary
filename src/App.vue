<script setup>
import Diary from "./components/diary.vue";
import { onBeforeMount, ref } from 'vue'
import axios from "axios";
const password = ref('')

onBeforeMount(() => {
  let data = {
    user: 'gaoxing',
    pwd: '8b71883a51c02981412be3a5141caa25',
  };
  axios.interceptors.request.use((config) => {
    config.headers["Cookie-User"] = data.user + "=" + data.pwd;
    return config;
  });
})
</script>

<template>
  <div v-if="password !== '0121'" class="protect">
    <el-input autofocus type="password" v-model="password"></el-input>
  </div>
  <div v-else class="diary">
    <Diary />
  </div>
</template>

<style>
#app {
  position: absolute;
  width: 100%;
  height: 100%;
}

.protect {
  width: 320px;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.diary {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #fff;
}
</style>
