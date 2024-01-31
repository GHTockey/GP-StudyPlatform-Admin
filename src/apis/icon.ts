import type { Icon } from "@/types/Icon";
import { request } from "@/utils/request";

export class IconAPI {
   /* 获取图标列表 API */
   static getIconList() {
      return request<Icon[]>('icon-service/icon/list', 'GET')
   };
   /* 添加图标 API */
   static addIcon(data: Icon) {
      return request<string>('icon-service/icon', 'POST', data)
   };
   /* 删除图标 API */
   static deleteIcon(id: number) {
      return request<string>('icon-service/icon/' + id, 'DELETE')
   };
   /* 修改图标 API */
   static updateIcon(data: Icon) {
      return request<string>('icon-service/icon', 'PUT', data)
   };
}