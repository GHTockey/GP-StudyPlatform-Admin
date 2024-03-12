import type { Icon } from "@/types/Icon";
import { request } from "@/utils/request";

// let cloudServiceURL = '/icon-service';
let cloudServiceURL = '';

export class IconAPI {
   /* 获取图标列表 API */
   static getIconList() {
      return request<Icon[]>(`${cloudServiceURL}/icon/list`, `GET`)
   };
   /* 添加图标 API */
   static addIcon(data: Icon) {
      return request<null>(`${cloudServiceURL}/icon`, `POST`, data)
   };
   /* 删除图标 API */
   static deleteIcon(ids: number[]) {
      return request<null>(`${cloudServiceURL}/icon/` + ids.join(','), `DELETE`)
   };
   /* 修改图标 API */
   static updateIcon(data: Icon) {
      return request<null>(`${cloudServiceURL}/icon`, `PUT`, data)
   };
}