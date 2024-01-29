// 将 [{id:number,parent_id:number,children:null,...},...] 处理成树形数据的方法
// export function listToTree(
//    parentEl: { id: number, parent_id: number, children: null },
//    list: { id: number, parent_id: number, children: null }[]) {

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
export const roleColor = computed(() => (type: number) => {
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