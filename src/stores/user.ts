import type { Permission, User, UserListVo } from "@/types/User";
import { defineStore } from "pinia";
import { UserAPI } from "@/apis/user";
import { reactive, ref } from "vue";
import type { Status } from "@/types/Other";
import { buildTree } from "@/utils/myTool";

export const useUserStore = defineStore("user_store", () => {
   // 用户信息
   const userInfo = reactive<{ status: Status, result: User }>({
      status: 'idle',
      result: {
         username: "",
         password: null,
         avatar: "",
         email: "",
         id: "",
         permissionList: null
      }
   });
   // 用户权限
   const permissionList = reactive<{ status: Status, result: Permission[] }>({
      status: 'idle',
      result: []
   });
   // token
   const token = ref<string>();
   // 用户列表


   // 用户登录 handler
   async function login(username: string, password: string) {
      userInfo.status = 'loading';
      try {
         let result = await UserAPI.login(username, password)
         userInfo.status = 'success'
         userInfo.result = result.data
         token.value = result.other.token
      } catch (error) {
         userInfo.status = 'error'
      }
   };
   // 获取用户权限 Handler
   async function getPermissionList(uid: string) {
      permissionList.status = 'loading'
      try {
         let result = await UserAPI.getPermissionListByUid(uid)
         permissionList.result = buildTree(result.data, 0)
         permissionList.status = 'success'
      } catch (error) {
         permissionList.status = 'error'
      }
   };

   return {
      token,
      userInfo,
      permissionList,
      getPermissionList, login
   }
},
   // { persist: true }
)