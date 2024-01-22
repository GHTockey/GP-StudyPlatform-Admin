import type { Permission } from "@/types/User";
import { request } from "@/utils/request";

export class PermApi {
   /** 获取权限列表 API */
   static async getPermList() {
      return request<Permission[]>("user-service/permission/list")
   };
   /** 获取权限 API */
   static async getPerm(id: number) {
      return request<Permission>(`user-service/permission/${id}`)
   };
   /** 添加权限 API */
   static async addPerm(data: Permission) {
      return request<null>("user-service/permission", "POST", data)
   };
}