// 将 [{id:number,parent_id:number,children:null,...},...] 处理成树形数据的方法
// export function listToTree(
//    parentEl: { id: number, parent_id: number, children: null },
//    list: { id: number, parent_id: number, children: null }[]) {

import router from "@/router";
import type { Permission } from "@/types/User";
import type { ItemType } from "ant-design-vue";
import { computed } from "vue";

// }


export function buildTree(data: any[], baseId: number) {
   const tree: any[] = [];
   data.forEach((item: { parentId: any; id: any; children: any[]; }) => {
      if (item.parentId === baseId) {
         const children = buildTree(data, item.id);
         if (children.length > 0) {
            item.children = children;
         }
         tree.push(item);
      }
   });
   return tree;
}


// 角色颜色
export const roleColor = computed(() => (type: number | undefined) => {
   switch (type) {
      case 1:
         return 'red';
      case 2:
         return 'blue';
      case 3:
         return 'green';
      default:
         return 'default';
   }
});

export function buildMenuTree(data: Permission[], baseId: number) {
   const tree: ItemType[] = [];
   data.forEach((item: Permission) => {
      if (item.parentId === baseId) {
         const children = buildMenuTree(data, item.id as number);
         if (children.length > 0) {
            item.children = children;
         }
         tree.push({
            label: item.name,
            key: item.path,
            id: String(item.id),
            parentId: item.parentId,
            children: item.children,
            onClick: item.parentId != 0 ? function () {
               router.push(item.path)
            } : undefined
         } as ItemType);
      }
   });
   return tree;
}