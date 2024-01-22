export type User = {
   username: string
   password: string | null,
   avatar: string,
   email: string,
   id: string,
   permissionList: Permission[] | null,
   roleList: Role[] | null
}
export type Permission = {
   id: number,
   name: string,
   parentId: number,
   path: string,
   children?: Permission[] | null
}
export type UserListVo = {
   rid?: number,
   username: string,
}
export type Role = {
   id: number,
   desc: string,
   name: string
}