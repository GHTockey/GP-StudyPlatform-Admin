import type { Permission, User, UserListVo } from "@/types/User";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user_store", () => {
   // 用户信息
   const userInfo = ref<User>({
      username: "",
      avatar: "",
      email: ""
   });
   // 用户权限
   const permissionList = ref<Permission[]>([]);
   // token
   const token = ref<string>();

   return {
      token,
      userInfo,
   }
},
   { persist: true }
)