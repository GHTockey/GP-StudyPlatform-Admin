import type { Permission } from "@/types/User";
import { request } from "@/utils/request";

export class PermApi {
   /** 获取权限列表 API */
   static async getPermList() {
      return request<Permission[]>("user-service/permission/list")
   }
}