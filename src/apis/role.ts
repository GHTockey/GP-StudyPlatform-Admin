import type { Role } from "@/types/User";
import { request } from "@/utils/request";

export class RoleApi {
   static async getRoleList() {
      return request<Role[]>("user-service/role/list")
   }
}