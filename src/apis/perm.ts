import type { Permission } from "@/types/User";
import { request } from "@/utils/request";

// let cloudServiceURL = '/user-service';
let cloudServiceURL = '';

export class PermApi {
   /** 获取权限列表 API */
   static getPermList() {
      return request<Permission[]>(`${cloudServiceURL}/permission/list`, 'GET')
   };
   /** 获取权限 API */
   static getPerm(id: number) {
      return request<Permission>(`${cloudServiceURL}/permission/${id}`, 'GET')
   };
   /** 添加权限 API */
   static addPerm(data: Permission) {
      return request<null>(`${cloudServiceURL}/permission`, "POST", data)
   };
   /** 获取所有祖先权限ID API */
   static getAncestorIds(id: number) {
      return request<number[]>(`${cloudServiceURL}/permission/parents/${id}`, 'GET')
   };
   /** 获取所有子级权限ID API */
   static getDescendantIds(id: number) {
      return request<number[]>(`${cloudServiceURL}/permission/Descendant/${id}`, 'GET')
   };
   /** 编辑权限 API */
   static editPerm(data: Permission) {
      return request<null>(`${cloudServiceURL}/permission`, "PUT", data)
   };
   /** 删除权限 API */
   static deletePerm(id: number) {
      return request<null>(`${cloudServiceURL}/permission/${id}`, "DELETE")
   };
   /** 根据RID获取权限列表 API */
   static getPermListByRid(rid: number) {
      return request<Permission[]>(`${cloudServiceURL}/permission/role/${rid}`, 'GET')
   };
}