<script setup>

</script>

<template>
  <div class="detail">
    <el-alert v-for="item in detail.value" :key="item.id" :closable="false"
      :type="['success', 'info', 'error', 'warning'][Math.floor(Math.random() * 4)]">
      <span>{{ item.event }}</span><span v-if="item.time"> 🥕{{ item.time }}</span>
      <div style="width: 100%;">
        <span class="delete" v-show="state.showOperation" @click="deleteSchedule(item.id)">delete</span>
        <span class="edit" v-show="state.showOperation" @click="displayDialog(item)">edit</span>
        <span class="exchange" v-show="state.showOperation" @click="exchange(item)">exchange</span>
      </div>
    </el-alert>
  </div>
</template>

<Style lang="scss" scoped>
.input {
  margin-top: 24px;

  .operation {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;

    .el-button {
      width: 108px;
    }
  }
}

.detail {
  text-align: left;
  margin-top: 24px;
  padding-bottom: 16px;

  .el-alert {
    margin-top: 10px;

    :deep(.el-alert__content) {
      padding: 0;
      width: 100%;

      .el-alert__description {
        margin: 5px 0;
      }
    }

    .exchange {
      float: right;
    }

    .edit,
    .delete {
      float: right;
      margin-left: 16px;
    }
  }

}
</Style>