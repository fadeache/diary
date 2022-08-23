<script setup>
import { ref, reactive, nextTick, onMounted, watch } from "vue";
import Calendar from './calendar.vue'

</script>

<template>
  <div class="background">
    <Calendar />
  </div>
</template>

<style lang="scss" scoped>
.background {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #fff;
}
</style>