import type { Website } from "@/types/Other";
import { request } from "@/utils/request";
import type { AxiosProgressEvent } from "axios";

// let cloudServiceURL = '/other-service';
let cloudServiceURL = '';

export class OtherAPI {
   static fileUpload(imgFile: FormData, uploadHandler?: (p: AxiosProgressEvent) => void) {
      return request<string>(`${cloudServiceURL}/other/image/upload`, 'POST', imgFile, uploadHandler)
   };


   // 修改网站信息
   static updateWebsiteInfo(data: Website) {
      return request(`${cloudServiceURL}/website`, "PUT", data)
   };
   // 获取网站信息
   static getWebsiteInfo() {
      return request<Website>(`${cloudServiceURL}/website`, 'GET')
   };
}