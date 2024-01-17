<template>
   <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }">

      <template v-for="perm in permissionList">
         <template v-if="perm.children?.length && perm.children[0].children?.length">
            <!-- && perm.children[0].children?.length 是为了只渲染到叶节点的上一级 -->
            <a-sub-menu :title="perm.name" :key="perm.path">
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
import { defineProps } from "vue";

withDefaults(defineProps<{
   permissionList: Permission[]
}>(), {})

</script>

<style lang="less"></style>