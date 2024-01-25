import type { Role } from "@/types/User";
import { request } from "@/utils/request";

export class RoleApi {
   /** 获取角色列表 API */
   static getRoleList() {
      return request<Role[]>("user-service/role/list", "GET")
   };
   /** 添加角色 API */
   static addRole(data: Role) {
      return request<null>("user-service/role", "POST", data)
   };
   /** 删除角色 API */
   static deleteRole(id: number) {
      return request<null>(`user-service/role/${id}`, "DELETE")
   };
   /** 编辑角色 API */
   static editRole(data: Role) {
      return request<null>("user-service/role", "PUT", data)
   };
   /** 设置角色权限 API */
   static setRolePerm(rid: number, permIds: number[]) {
      return request<null>(`user-service/role/perm/set/${rid}`, "POST", permIds)
   };
}