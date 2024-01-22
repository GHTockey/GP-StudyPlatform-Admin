<template>
   <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }" :selected-keys="selectedKeys">

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
         </template>
      </template>

   </a-menu>
</template>

<script setup lang="ts">
import type { Permission } from "@/types/User";
import { defineProps, ref, watch } from "vue";
import { useRoute } from "vue-router";

withDefaults(defineProps<{
   permissionList: Permission[]
}>(), {})

const route = useRoute();
// 选择的菜单项
const selectedKeys = ref<string[]>([]);

// 监听路由变化
watch(() => route.path, (newVal) => {
   selectedKeys.value = [newVal];
})
</script>

<style lang="less"></style>