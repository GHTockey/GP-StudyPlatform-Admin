import { request } from "@/utils/request";
import type { AxiosProgressEvent } from "axios";

export class OtherAPI {
   static fileUpload(imgFile: FormData, uploadHandler?: (p: AxiosProgressEvent) => void) {
      return request<string>('other-service/other/image/upload', 'POST', imgFile, uploadHandler)
   }
}