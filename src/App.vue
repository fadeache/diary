<script setup>
import Diary from "./components/diary.vue";
import { onBeforeMount, ref, watch } from 'vue'
const value = ref('')

onBeforeMount(() => {
  if (document.cookie) {
    let strcookie = document.cookie;//获取cookie字符串
    let arrcookie = strcookie.split("; ");//分割
    for (let i = 0; i < arrcookie.length; i++) {//遍历匹配
      if (arrcookie[i] === 'isLogin=true') value.value = '0121'
    }
  }
})
watch(() => value.value,
  () => {
    if (value.value === '0121') {
      let expTime = new Date();
      expTime.setTime(expTime.getTime() + 30 * 60 * 1000);
      document.cookie =
        "isLogin=true" + ";expires=" + expTime.toUTCString();
    }
  })
</script>

<template>
  <div v-if="value !== '0121'" class="protect">
    <el-input autofocus type="password" v-model="value"></el-input>
  </div>
  <Diary v-else />
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
</style>
