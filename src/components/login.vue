<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const store = useStore();
const showDialog = ref(true);
const formInfo = ref({
  user: "",
  pwd: "",
});
const form = ref(null);
const rules = reactive({
  user: [
    { required: true, message: "请输入用户", trigger: ["blur", "change"] },
  ],
  pwd: [{ required: true, message: "请输入密码", trigger: ["blur", "change"] }],
});
const emit = defineEmits(["whetherLogin"]);
const submitForm = () => {
  form.value.validate((valid, fields) => {
    if (valid) {
      store.dispatch("user/login", formInfo.value).then((rst) => {
        if (rst) {
          ElMessage.success("登录成功");
          showDialog.value = false;
          emit("whetherLogin", rst);
        } else {
          ElMessage.error("账号或密码错误");
        }
      });
    }
  });
};
</script>

<template>
  <el-dialog
    v-model="showDialog"
    custom-class="my-dialog general"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <template #header>
      <img
        src="/login.png"
        style="height: 20px; width: 40px; vertical-align: -16%"
      />
    </template>
    <el-form :model="formInfo" ref="form" :rules="rules">
      <el-form-item label="用户" prop="user">
        <el-input
          autofocus
          v-model="formInfo.user"
          clearable
          v-on:keyup.enter="submitForm"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          v-model="formInfo.pwd"
          autocomplete="off"
          show-password
          clearable
          v-on:keyup.enter="submitForm"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">登录</el-button>
    </template>
  </el-dialog>
</template>
