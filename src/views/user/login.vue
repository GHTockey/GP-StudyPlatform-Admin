<template>
   <div class="login-box">
      <div class="login-box-content">
         <!-- left box -->
         <div class="login-box-left">
            <img src="@/assets/img/lijie.png">
         </div>
         <!-- right box -->
         <div class="login-box-right">
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100px;">
               <IconFont type="icon-logo" style="font-size: 85px;" />
               <span style="margin: 0 8px;">|</span>
               <span style="font-size: 23px; font-weight: 700;">后台管理系统</span>
            </div>
            <div style="width: 100%; padding: 0 30px;">
               <a-form :model="formState" name="basic"
                  autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                  <a-form-item name="username"
                     :rules="[{ required: true, message: '此项必填!' }]">
                     <a-input v-model:value="formState.username" placeholder="用户名" />
                  </a-form-item>

                  <a-form-item name="password"
                     :rules="[{ required: true, message: '此项必填!' }]">
                     <a-input-password v-model:value="formState.password" placeholder="密码" />
                  </a-form-item>

                  <a-form-item style="text-align: right;">
                     <a-button type="primary" html-type="submit">登录</a-button>
                  </a-form-item>
               </a-form>
            </div>
         </div>
      </div>
   </div>
</template>
<script lang="ts" setup>
import { UserAPI } from '@/apis/user';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { notification } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
import { IconFont } from "@/utils/myTool";


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
   let userLoginResult = await UserAPI.login(formState.username, formState.password);
   if (userLoginResult.code == 20000) {
      // 存储用户信息
      userInfo.value = userLoginResult.data;
      // 存储token
      userStore.token = userLoginResult.other.token;
      localStorage.setItem('token', userLoginResult.other.token);
      notification.success({
         message: userLoginResult.message,
         description: `欢迎回来，${userInfo.value.username}！`,
      });
      router.push('/');
   }
};
// 校验失败
function onFinishFailed(errorInfo: any) {
   console.log('Failed:', errorInfo);
};
</script>
 
<style>
.login-box {
   width: 100%;
   height: 100%;
   background-image: linear-gradient(-35deg, #09203f 0%, #537895 100%);
   display: grid;
   place-items: center;

   .login-box-content {
      color: white;
      background-color: #09203f;
      width: 730px;
      height: 500px;
      border-radius: 0.75rem;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      >div {
         flex: 1;
         /* border: 1px solid rgba(255, 255, 255, 0.2); */
      }

      .login-box-left {
         background-color: white;
         overflow: hidden;
         border-radius: 0.75rem;

         >img {
            width: 100%;
            transform: scale(1.3) translateY(25px);
         }
      }
      .login-box-right {
         /* height: 100%; */
         position: relative;
         display: flex;
         flex-wrap: wrap;
         align-items: center;
         align-self: center;
      }
   }
}
</style>