export type User = {
   username: string
   password: string | null,
   avatar: string,
   email: string,
   id: string,
   permissionList: Permission[] | null,
}
export type Permission = {
   id: number,
   name: string,
   parentId: number,
   path: string,
   children: Permission[] | null
}
export type UserListVo = {
   rid: number | null,
   username: string | null,
}