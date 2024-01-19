<template>
   <a-layout style="height: 100%;">
      <a-layout-header><span style="color: white;">Header</span></a-layout-header>
      <a-layout>
         <a-layout-sider>
            <TestMenu :permission-list="permissionList || []" />
            <!-- <a-menu :items="permissionList.result" /> -->
         </a-layout-sider>
         <a-layout-content>
            <RouterView />
         </a-layout-content>
      </a-layout>
      <!-- <a-layout-footer style="border-top: 1px solid gray;">Footer</a-layout-footer> -->
   </a-layout>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from 'vue';
import { NotificationOutlined } from '@ant-design/icons-vue';
import { useUserStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import TestMenu from "@/components/TestMenu.vue";
import { UserAPI } from "@/apis/user";
import type { Permission } from '@/types/User';
import { buildTree } from "@/utils/myTool";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const permissionList = ref<Permission[]>();

getUserPerms('U000001');

// 获取用户权限列表
async function getUserPerms(uid: string) {
   let { code, data, message } = await UserAPI.getPermissionListByUid(uid);
   if (code == 20000) {
      // 存储用户权限列表并构建树形结构
      permissionList.value = buildTree(data, 0);
   } else {
      console.log(message);
   }
}

</script>

<style lang="less"></style>