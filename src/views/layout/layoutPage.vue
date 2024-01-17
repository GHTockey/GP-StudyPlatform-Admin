<template>
   <a-layout style="height: 100%;">
      <a-layout-header><span style="color: white;">Header</span></a-layout-header>
      <a-layout>
         <a-layout-sider>
            <TestMenu :permission-list="permissionList.result" />
            <!-- <a-menu :items="permissionList.result" /> -->
         </a-layout-sider>
         <a-layout-content>
            <RouterView />
         </a-layout-content>
      </a-layout>
      <a-layout-footer style="border-top: 1px solid gray;">Footer</a-layout-footer>
   </a-layout>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { NotificationOutlined } from '@ant-design/icons-vue';
import { useUserStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import TestMenu from "@/components/TestMenu.vue";

const userStore = useUserStore();
const { permissionList } = storeToRefs(userStore);

userStore.getPermissionList('U000001');

</script>

<style lang="less"></style>