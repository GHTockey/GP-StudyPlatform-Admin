import type { Permission, User, UserListVo } from "@/types/User";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useUserStore = defineStore("user_store", () => {
   // 用户信息
   const userInfo = reactive<User>({
      username: "",
      password: null,
      avatar: "",
      email: "",
      id: "",
      permissionList: null
   });
   // 用户权限
   const permissionList = reactive<Permission[]>({
      status: 'idle',
      result: []
   });
   // token
   const token = ref<string>();

   return {
      token,
      userInfo,
   }
},
   { persist: true }
)