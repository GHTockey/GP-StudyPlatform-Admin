export type User = {
   id?: number,
   username: string
   password?: string,
   avatar: string,
   email: string,
   permissionList?: Permission[] | null,
   roleList?: Role[] | null,
   roleIds?: number[]
}
export type Permission = {
   id?: number,
   name: string,
   parentId: number,
   path: string,
   children?: Permission[] | null,
   halfCheck?: number,
   disabled?: boolean, // 是否禁用 用于树形控件
   type: 'page' | 'operate' | null
}
export type UserListVo = {
   rid?: number,
   username: string,
}
export type Role = {
   id?: number,
   desc: string,
   name: string,
   userIds?: string[] | null,
}
export type SetRolePermVo = {
   halfCheckIds: number[],
   selectedIds: number[]
}