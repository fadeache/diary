<script setup>
import Calendar from './calendar.vue'
import Events from './events.vue'
</script>

<template>
  <Calendar></Calendar>
  <Events></Events>
</template>

<style scoped lang="scss">
</style>

<style lang="scss">
.gm {
  color: #70b8ff;
  cursor: pointer;
}

.gm:hover {
  color: #409eff;
}

.my-dialog {
  &.general {
    &.el-dialog {
      max-width: 460px;
      min-width: 360px;
    }

    .el-dialog__header {
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    .el-dialog__body {
      padding: 24px;
      height: calc(100% - 168px);
      overflow: auto;
      text-align: left;
    }
  }
}

.el-message-box {
  vertical-align: 15vh !important;
  --el-messagebox-width: 360px !important;
}
</style>

