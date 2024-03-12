import type { Role, SetRolePermVo } from "@/types/User";
import { request } from "@/utils/request";

// let cloudServiceURL = '/user-service';
let cloudServiceURL = '';

export class RoleApi {
   /** 获取角色列表 API */
   static getRoleList() {
      return request<Role[]>(`${cloudServiceURL}/role/list`, "GET")
   };
   /** 添加角色 API */
   static addRole(data: Role) {
      return request<null>(`${cloudServiceURL}/role`, "POST", data)
   };
   /** 删除角色 API */
   static deleteRole(id: number) {
      return request<null>(`${cloudServiceURL}/role/${id}`, "DELETE")
   };
   /** 编辑角色 API */
   static editRole(data: Role) {
      return request<null>(`${cloudServiceURL}/role`, "PUT", data)
   };
   /** 设置角色权限 API */
   static setRolePerm(rid: number, setRolePermVo: SetRolePermVo) {
      return request<null>(`${cloudServiceURL}/role/perm/set/${rid}`, "POST", setRolePermVo)
   };
}