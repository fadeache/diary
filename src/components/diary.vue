<script setup>
import {
  computed,
  reactive,
  ref,
  onBeforeMount,
  toRaw,
  watch,
  nextTick,
} from "vue";
import axios from "axios";
import time from "@/utils/time";
import { ElMessage, ElMessageBox } from "element-plus";

const state = reactive({
  schedules: [],
  showDialog: false,
  showDialog2: false,
  showIndex: false,
  exchangeArr: [],
  loading: false,
  loading2: false,
});
const form = ref(null);
const form2 = ref(null);
const input = ref("");
const date = ref(time.format(new Date(), "yyyy-MM-dd"));
const details = ref([]);
onBeforeMount(async () => {
  updateSchedules();
});

const updateSchedules = async () => {
  state.loading = true;
  let res = await axios.get("/ache/calendar/get-calendar");
  state.loading = false;
  state.schedules = res.data;
};

const aSchedule = ref({
  date: "",
  event: "",
  completed: 0,
  time: "",
});

const comment = ref({
  comment: "",
  pid: null,
});

const oneComment = ref([]);
const showComments = ref(null);
const owner = ref(import.meta.env.VITE_APP_OWNER);

const displayByEdit = (data) => {
  aSchedule.value = data;
  state.showDialog = true;
};

const rules = reactive({
  date: [{ required: true, message: "请选择日期", trigger: ["blur"] }],
  event: [
    { required: true, message: "请输入待办事件", trigger: ["blur", "change"] },
  ],
});

const rules2 = reactive({
  comment: [{ required: true, message: "评论不能为空哦", trigger: ["blur"] }],
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

const deleteSchedule = async (id) => {
  ElMessageBox.confirm("确定要删除这段吗？", "删除", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(async () => {
    await axios.delete("/ache/calendar/delete-calendar", {
      params: { id: parseInt(id) },
    });
    updateSchedules();
  });
};

const exchange = async (item) => {
  state.exchangeArr.push(item.id);
  if (state.exchangeArr.length === 1) {
    ElMessage({
      message:
        "当前选择事件：" +
        (item.event.length > 12
          ? item.event.substring(0, 12) + "..."
          : item.event),
    });
  } else if (state.exchangeArr.length === 2) {
    ElMessage({
      message:
        "与之交换的事件：" +
        (item.event.length > 10
          ? item.event.substring(0, 10) + "..."
          : item.event),
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

const addSchedule = async () => {
  if (input.value) {
    let data = {
      date: date.value,
      event: input.value,
      completed: 0,
      time: time.format(new Date(), "hh:mm"),
    };
    await axios.post("/ache/calendar/add-calendar", data);
    updateSchedules();
    // let tempDate = new Date(date.value)
    // date.value = new Date(tempDate.getTime() + 86400000)
    // date.value = date.value.getFullYear() + '-' + (date.value.getMonth() + 1 < 10 ? '0' + (date.value.getMonth() + 1) : date.value.getMonth() + 1) + '-' + date.value.getDate()
    input.value = "";
    ElMessage.success("添加成功啦，下一条吧");
  } else {
    ElMessage.error("记得写点东西哦");
  }
};
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

const showDetails = (data) => {
  if (data)
    details.value = state.schedules.filter((item) => {
      return item.date === data.day;
    });
  date.value = data.day;
};

watch(
  () => state.schedules,
  () => showDetails({ day: date.value })
);

const showOperations = (id) => {
  state.showIndex = state.showIndex === id ? null : id;
  showComments.value = showComments.value === id ? null : id;
  updateComments(id);
};

const updateComments = async (id) => {
  oneComment.value = [];
  state.loading2 = true;
  let res = await axios.get("/ache/calendar/get-comments", {
    params: { pid: id },
  });
  state.loading2 = false;
  oneComment.value = res.data;
};

const addComment = () => {
  form2.value.validate(async (valid, fields) => {
    if (valid) {
      await axios.post("/ache/calendar/add-comment", comment.value);
      ElMessage.success("评论成功");
      updateComments(aSchedule.value.id);
      oneComment.value = res.data;
      state.showDialog2 = false;
    }
  });
};

const displayByComment = (data) => {
  aSchedule.value = data;
  comment.value.pid = data.id;
  comment.value.comment = "";
  state.showDialog2 = true;
  nextTick(() => form2.value.resetFields());
};

const deleteComment = async (id, pid) => {
  await axios.delete("/ache/calendar/delete-comment", {
    params: { id: parseInt(id) },
  });
  ElMessage.success("评论删除成功啦");
  updateComments(pid);
  oneComment.value = res.data;
};
</script>

<template>
  <el-calendar v-model="state.value">
    <template #dateCell="{ data }">
      <div
        :class="{ hasSchedules: getSchedules(data).length }"
        @click="showDetails(data)"
      >
        {{ data.day.split("-").slice(2).join("") }}
      </div>
    </template>
  </el-calendar>

  <div class="input">
    <el-input
      type="textarea"
      :rows="7"
      :placeholder="'记录' + owner + '的点点滴滴'"
      v-model="input"
    ></el-input>
    <div class="operation">
      <el-date-picker
        :editable="false"
        v-model="date"
        type="date"
        value-format="YYYY-MM-DD"
        :clearable="false"
      >
      </el-date-picker>
      <el-button type="success" @click="addSchedule">添加今日美好</el-button>
    </div>
  </div>

  <div class="detail" v-loading="state.loading">
    <div v-for="item in JSON.parse(JSON.stringify(details))">
      <el-alert
        :closable="false"
        :type="
          ['success', 'info', 'error', 'warning'][Math.floor(Math.random() * 4)]
        "
        @click="showOperations(item.id)"
      >
        <span>{{ item.event }}</span>
        <span v-if="item.time">🥕{{ item.time }}</span>
        <div
          style="width: 100%; margin-top: 8px"
          v-show="state.showIndex === item.id"
        >
          <span class="edit" @click.stop="displayByEdit(item)">编辑</span>
          <span class="exchange" @click.stop="exchange(item)">交换</span>
          <span class="delete" @click.stop="deleteSchedule(item.id)">删除</span>
          <span class="comment" @click.stop="displayByComment(item)">评论</span>
        </div>
      </el-alert>
      <div
        class="comments"
        v-if="showComments === item.id"
        v-loading="state.loading2"
      >
        <div
          class="oneComment"
          v-for="(one, index) in JSON.parse(JSON.stringify(oneComment))"
        >
          <span>评论{{ index + 1 }}：{{ one.comment }}</span>
          <span class="commentDel" @click.stop="deleteComment(one.id, item.id)"
            >删除</span
          >
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="state.showDialog" custom-class="my-dialog general">
    <template #header>
      <span>编辑日记</span>
    </template>
    <el-form :model="aSchedule" ref="form" :rules="rules" :label-width="52">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          :editable="false"
          v-model="aSchedule.date"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="事件" prop="event">
        <el-input
          type="textarea"
          :rows="7"
          v-model="aSchedule.event"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editSchedule()">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="state.showDialog2" custom-class="my-dialog general">
    <template #header>
      <span>评论</span>
    </template>
    <el-form :model="comment" ref="form2" :rules="rules2" :label-width="52">
      <el-form-item label="回复">
        <el-input
          type="textarea"
          :rows="3"
          v-model="aSchedule.event"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="评论" prop="comment">
        <el-input
          type="textarea"
          :rows="7"
          v-model="comment.comment"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addComment()">确定</el-button>
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
    .edit {
      float: left;
    }

    .delete,
    .exchange {
      float: left;
      margin-left: 16px;
    }

    .comment {
      float: right;
    }
  }

  .comments {
    padding: 4px 0;

    .oneComment {
      border: 1px #eee solid;
      background: rgb(253, 253, 253);
      border-radius: 4%;
      margin-bottom: 4px;
      padding: 8px 16px;
      color: grey;
      font-size: 12px;

      .commentDel {
        float: right;
        color: lightpink;
      }
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
