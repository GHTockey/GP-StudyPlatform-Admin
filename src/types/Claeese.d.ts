import type { User } from "./User"

export type Classes = {
   id?: number,
   name: string,
   creatorUid: string,
   annc: string,
   info: string,
   createTime: string,
   creator?: User,
   userList?: User[]
}