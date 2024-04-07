// 将 [{id:number,parent_id:number,children:null,...},...] 处理成树形数据的方法
// export function listToTree(
//    parentEl: { id: number, parent_id: number, children: null },
//    list: { id: number, parent_id: number, children: null }[]) {
// }

import router from "@/router";
import type { Permission } from "@/types/User";
import type { ItemType } from "ant-design-vue";
import { computed, h, withDirectives } from "vue";
import Icon from '@ant-design/icons-vue';
import { createFromIconfontCN } from "@ant-design/icons-vue";


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

// 自定义指令 将svg代码以innerHTML的形式插入到span中
const myHtml = {
   mounted(el: HTMLSpanElement, f) {
      // console.log(el, f);
      el.innerHTML = f.value.svgCode;
   }
}

// 构建菜单树
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
            icon: item.icon ? h(Icon, {}, {
               component: () => withDirectives( // 自定义指令将svg代码以innerHTML的形式插入到span中
                  h('span', { style: { width: '20px', height: '20px', marginTop: '3px' } }), [[myHtml, { svgCode: item.icon?.code }]]
               )
            }) : undefined,
            onClick: item.parentId != 0 ? function () {
               router.push(item.path)
            } : undefined
         } as ItemType);
      }
   });
   return tree;
}


// 字体图标
export const IconFont = createFromIconfontCN({
   scriptUrl: '//at.alicdn.com/t/c/font_4434606_68pfs7gm12l.js',
})