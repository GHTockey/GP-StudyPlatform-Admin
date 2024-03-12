import type { Classes } from "@/types/Claeese";
import { request } from "@/utils/request";

// let cloudServiceURL = '/classes-service';
let cloudServiceURL = '';

export class ClassesAPI {
   /* 获取班级列表 API */
   static getClassesList() {
      return request<Classes[]>(`${cloudServiceURL}/classes/list`, 'GET')
   }
   /* 获取班级详情 API */
   static getClassesById(id: number) {
      return request(`${cloudServiceURL}/classes/${id}`, 'GET')
   }
   /* 添加班级 API */
   static addClasses(classes: Classes) {
      return request(`${cloudServiceURL}/classes`, `POST`, classes)
   }
   /* 删除班级 API */
   static deleteClasses(id: number) {
      return request(`${cloudServiceURL}/classes/${id}`, `DELETE`)
   }
   /* 修改班级 API */
   static updateClasses(classes: Classes) {
      return request(`${cloudServiceURL}/classes`, 'PUT', classes)
   }
}