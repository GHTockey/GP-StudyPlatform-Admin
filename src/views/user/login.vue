<template>
   <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
         <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
         <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
         <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
   </a-form>
</template>
<script lang="ts" setup>
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { message, notification } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

interface FormState {
   username: string;
   password: string;
}

const formState = reactive<FormState>({
   username: 'admin',
   password: '114514',
});


// 校验通过
async function onFinish(values: any) {
   // console.log('Success:', values);
   await userStore.login(values.username, values.password);
   notification.success({
      message: '登录成功',
      description: `欢迎回来，${userInfo.value.result.username}！`,
   });
   router.push('/');
};
// 校验失败
function onFinishFailed(errorInfo: any) {
   console.log('Failed:', errorInfo);
};
</script>
 
 