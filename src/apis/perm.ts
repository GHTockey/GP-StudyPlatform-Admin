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
   /** 获取所有祖先权限ID API */
   static async getAncestorIds(id: number) {
      return request<number[]>(`user-service/permission/parents/${id}`)
   };
   /** 编辑权限 API */
   static async editPerm(data: Permission) {
      return request<null>("user-service/permission", "PUT", data)
   };
   /** 删除权限 API */
   static async deletePerm(id: number) {
      return request<null>(`user-service/permission/${id}`, "DELETE")
   };
}