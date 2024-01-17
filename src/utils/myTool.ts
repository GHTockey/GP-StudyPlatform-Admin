// 将 [{id:number,parent_id:number,children:null,...},...] 处理成树形数据的方法
// export function listToTree(
//    parentEl: { id: number, parent_id: number, children: null },
//    list: { id: number, parent_id: number, children: null }[]) {

// }


export function buildTree(data, baseId) {
   const tree = [];
   data.forEach(item => {
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
