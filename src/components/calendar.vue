<script setup>
import { computed, onMounted, reactive, ref, nextTick, onBeforeMount, onBeforeUnmount, watch } from "vue";
import axios from 'axios'
import { ElMessage, ElMessageBox } from "element-plus";

const state = reactive({
  schedules: [],
  showDialog: false,
  showOperation: false,
  exchangeArr: [],
});

const form = ref(null);
const formKey = ref(0);
onBeforeMount(async () => {
  let data = {
    user: 'gaoxing',
    pwd: '8b71883a51c02981412be3a5141caa25',
  };
  const rst = await axios.post("/ache/login", data);
  if (rst.data) {
    axios.interceptors.request.use((config) => {
      config.headers["Cookie-User"] = data.user + "=" + data.pwd;
      return config;
    });
  }
  getToday()
  updateSchedules();
});

const updateSchedules = async () => {
  let res = await axios.get("/ache/calendar/get-calendar");
  state.schedules = res.data;
};

const getToday = () => {
  let today = new Date()
  date.value = today.getFullYear() + '-' + (today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + today.getDate()
}

const getSchedules = computed(() => {
  return function (data) {
    let theDay = [];
    state.schedules.find((item) => {
      if (item.date === data.day) {
        theDay.push(item);
      }
    });
    return theDay;
  };
});

const editSchedule = () => {
  form.value.validate(async (valid, fields) => {
    if (valid) {
      await axios.put("/ache/calendar/edit-calendar", aSchedule.value);
      updateSchedules();
      state.showDialog = false;
    }
  });
};
const aSchedule = ref({
  date: "",
  event: "",
  completed: 0,
  time: ''
});
const deleteSchedule = async (id) => {
  ElMessageBox.confirm("确定要删除这段吗？", "删除", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(async () => {
    await axios.delete("/ache/calendar/delete-calendar", { params: { id: parseInt(id) } });
    updateSchedules();
  });
};

const displayDialog = (data) => {
  aSchedule.value = data;
  state.showDialog = true;
};

const rules = reactive({
  date: [{ required: true, message: "请选择日期", trigger: ["blur"] }],
  event: [
    { required: true, message: "请输入待办事件", trigger: ["blur", "change"] },
  ],
});

const exchange = async (item) => {
  state.exchangeArr.push(item.id);
  if (state.exchangeArr.length === 1) {
    ElMessage({
      message: "当前选择事件：" + (item.event.length > 12 ? item.event.substring(0, 12) + '...' : item.event),
    });
  } else if (state.exchangeArr.length === 2) {
    ElMessage({
      message: "与之交换的事件：" + (item.event.length > 10 ? item.event.substring(0, 10) + '...' : item.event),
    });
    await axios.put("/ache/calendar/exchange-calendar", {
      id1: state.exchangeArr[0],
      id2: state.exchangeArr[1],
    });
    ElMessage({
      type: "success",
      message: "位置交换成功！",
    });
    updateSchedules();
    state.exchangeArr = [];
  }
};

const value = ref('')
const date = ref('')
const addMore = async () => {
  if (value.value) {
    let data = {
      date: date.value,
      event: value.value,
      completed: 0,
      time: new Date().getHours() + ':' + new Date().getMinutes()
    };
    await axios.post("/ache/calendar/add-calendar", data)
    updateSchedules()
    // let tempDate = new Date(date.value)
    // date.value = new Date(tempDate.getTime() + 86400000)
    // date.value = date.value.getFullYear() + '-' + (date.value.getMonth() + 1 < 10 ? '0' + (date.value.getMonth() + 1) : date.value.getMonth() + 1) + '-' + date.value.getDate()
    value.value = ''
    ElMessage.success('添加成功啦，下一条吧')
  } else {
    ElMessage.error('小高记得写点东西哦')
  }
}
const detail = ref([])
</script>

<template>
  <div class="switch gm" :style="[state.showOperation ? 'opacity:1' : '']"
    @click="state.showOperation = !state.showOperation">
    隐藏操作
  </div>
  <el-calendar v-model="state.value"><template #dateCell="{ data }">
      <div class="hasSchedules" v-if="getSchedules(data).length"
        @click="detail.value = getSchedules(data); date = data.day">
        {{ data.day.split("-").slice(2).join("") }}
      </div>
      <div v-else @click="date = data.day; detail.value = []">
        {{ data.day.split("-").slice(2).join("") }}
      </div>
    </template>
  </el-calendar>
  <div class="input">
    <el-input type="textarea" :rows="7" placeholder="记录小高的点点滴滴" v-model="value">
    </el-input>
    <div class="operation">
      <el-date-picker :editable="false" v-model="date" type="date">
      </el-date-picker>
      <el-button type="success" @click="addMore">添加今日美好</el-button>
    </div>
  </div>
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

  <el-dialog v-model="state.showDialog" custom-class="my-dialog general">
    <template #header>
      <span>编辑日记</span>
    </template>
    <el-form :model="aSchedule" ref="form" :rules="rules" :key="formKey" :label-width="52">
      <el-form-item label="日期" prop="date">
        <el-date-picker :editable="false" v-model="aSchedule.date" type="date" placeholder="选择日期" format="YYYY/MM/DD"
          value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="事件" prop="event">
        <el-input type="textarea" :rows="7" v-model="aSchedule.event"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editSchedule()">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-calendar {
  --el-calendar-header-border-bottom: transparent;

  :deep(.el-calendar__header) {
    flex-direction: column;
    height: 56px;
    padding: 0;
  }

  :deep(.el-calendar__body) {
    padding: 0;

    .el-calendar-day {
      height: 56px;

      div {
        height: 100%;
        width: 100%;
        line-height: 40px;
      }

      .hasSchedules::before {
        content: "";
        position: absolute;
        width: 18px;
        height: 2px;
        background: #409eff;
        margin-top: 36px;
        // margin-top: 28px;
        margin-left: 0;
      }
    }
  }
}

.switch {
  position: absolute;
  right: 16px;
  opacity: 0;
}

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


    // :deep(.el-alert__title.is-bold) {
    //   font-weight: 400;
    // }
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
  }
}

.el-dialog__header {
  border-bottom: 1px solid #eee;
  text-align: left;

  svg {
    vertical-align: -12% !important;
  }

  span {
    margin-left: 5px;
  }
}

.el-dialog__body {
  padding: 24px !important;
  height: calc(100% - 168px);
  overflow: auto;
  text-align: left;
}

.el-message-box {
  vertical-align: 15vh !important;
  --el-messagebox-width: 360px !important;
}
</style>

