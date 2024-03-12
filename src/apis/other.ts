import { request } from "@/utils/request";
import type { AxiosProgressEvent } from "axios";

// let cloudServiceURL = '/other-service';
let cloudServiceURL = '';

export class OtherAPI {
   static fileUpload(imgFile: FormData, uploadHandler?: (p: AxiosProgressEvent) => void) {
      return request<string>(`${cloudServiceURL}/other/image/upload`, 'POST', imgFile, uploadHandler)
   }
}