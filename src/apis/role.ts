import type { Role } from "@/types/User";
import { request } from "@/utils/request";

export class RoleApi {
   /** 获取角色列表 API */
   static async getRoleList() {
      return request<Role[]>("user-service/role/list")
   };
   /** 添加角色 API */
   static async addRole(data: Role) {
      return request<null>("user-service/role", "POST", data)
   };
   /** 删除角色 API */
   static async deleteRole(id: number) {
      return request<null>(`user-service/role/${id}`, "DELETE")
   };
   /** 编辑角色 API */
   static async editRole(data: Role) {
      return request<null>("user-service/role", "PUT", data)
   }
}