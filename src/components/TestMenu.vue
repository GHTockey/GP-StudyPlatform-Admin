<template>
   <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }" :selected-keys="selectedKeys" :open-keys="openKeys">

      <template v-for="perm in permissionList">
         <template v-if="perm.children?.length && perm.children[0].children?.length">
            <!-- && perm.children[0].children?.length 是为了只渲染到叶节点的上一级 -->
            <a-sub-menu :title="perm.name" :key="perm.path">
               <!-- 标题已通过组件属性设置 -->
               <TestMenu :permission-list="perm.children" />
            </a-sub-menu>
         </template>
         <template v-else>
            <a-menu-item :key="perm.path" @click="$router.push(perm.path)">{{ perm.name }}</a-menu-item>
            <!-- <a-menu-item :key="perm.path" @click="jump(perm.path)">{{ perm.name }}</a-menu-item> -->
         </template>
      </template>
   </a-menu>
</template>

<script setup lang="ts">
import type { Permission } from "@/types/User";
import { ref, watch } from "vue";
import { useRoute,useRouter } from "vue-router";

withDefaults(defineProps<{
   permissionList: Permission[]
}>(), {})

const route = useRoute();
const router = useRouter();
// 选择的菜单项
const selectedKeys = ref<string[]>([]);
selectedKeys.value = [route.path];
const openKeys = ref<string[]>([]);
openKeys.value = ["/"+route.path.split("/")[1]];
console.log("/"+route.path.split("/")[1]);

// 跳转
// function jump(path: string) {
//    console.log(path);
//    router.push(path);
//    selectedKeys.value = [path];
//    openKeys.value = ["/"+path.split("/")[1]];
// }

// 监听路由变化
watch(() => route.path, (newVal) => {
   selectedKeys.value = [newVal];
   console.log(123);
})
</script>

<style lang="less"></style>