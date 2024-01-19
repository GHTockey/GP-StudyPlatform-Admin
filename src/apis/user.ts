import type { MyBatisPlusPage } from "@/types/Other";
import type { Permission, User, UserListVo } from "@/types/User";
import { request } from "@/utils/request";


export class UserAPI {
   /** 用户登录 API */
   static login(username: string, password: string) {
      return request<User>("/user-service/user/login", "POST", { username, password })
   };
   /** 根据 UID 获取用户权限列表 API */
   static getPermissionListByUid(uid: string) {
      return request<Permission[]>(`/user-service/permission/user/${uid}`, "GET")
   };
   /** 获取用户列表 API */
   static getUserList(num: number, size: number, userLsitVo: UserListVo) {
      return request<MyBatisPlusPage<User[]>>(`/user-service/user/list/${num}/${size}`, "POST", userLsitVo)
   };

}