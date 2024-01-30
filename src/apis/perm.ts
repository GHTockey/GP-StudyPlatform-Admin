import type { Permission } from "@/types/User";
import { request } from "@/utils/request";

export class PermApi {
   /** 获取权限列表 API */
   static getPermList() {
      return request<Permission[]>("user-service/permission/list")
   };
   /** 获取权限 API */
   static getPerm(id: number) {
      return request<Permission>(`user-service/permission/${id}`)
   };
   /** 添加权限 API */
   static addPerm(data: Permission) {
      return request<null>("user-service/permission", "POST", data)
   };
   /** 获取所有祖先权限ID API */
   static getAncestorIds(id: number) {
      return request<number[]>(`user-service/permission/parents/${id}`)
   };
   /** 获取所有子级权限ID API */
   static getDescendantIds(id: number) {
      return request<number[]>(`user-service/permission/Descendant/${id}`)
   };
   /** 编辑权限 API */
   static editPerm(data: Permission) {
      return request<null>("user-service/permission", "PUT", data)
   };
   /** 删除权限 API */
   static deletePerm(id: number) {
      return request<null>(`user-service/permission/${id}`, "DELETE")
   };
   /** 根据RID获取权限列表 API */
   static getPermListByRid(rid: number) {
      return request<Permission[]>(`user-service/permission/role/${rid}`)
   }
}