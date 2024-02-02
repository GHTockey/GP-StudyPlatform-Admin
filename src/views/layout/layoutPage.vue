<template>
   <a-layout style="height: 100%;">
      <a-layout-header><span style="color: white;">Header</span></a-layout-header>
      <a-layout>
         <a-layout-sider>
            <!-- <TestMenu :permission-list="permissionList || []" /> -->
            <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys"
               mode="inline" :items="items">
               <template #default="text">
                  {{ text }}
               </template>
            </a-menu>
         </a-layout-sider>
         <a-layout-content>
            <RouterView />
         </a-layout-content>
      </a-layout>
      <a-layout-footer style="border-top: 1px solid gray;">Footer</a-layout-footer>
   </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import { UserAPI } from "@/apis/user";
import type { Permission } from '@/types/User';
import { buildTree, buildMenuTree } from "@/utils/myTool";
import { message, type ItemType } from 'ant-design-vue';
import _ from "lodash";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const permissionList = ref<Permission[]>();

const items = ref<ItemType[]>([]);
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);



if (userInfo.value.id) {
   getUserPerms(userInfo.value.id);
   openKeys.value = [route.matched[1].path];
   selectedKeys.value = [route.path];
} else {
   message.error('用户信息获取失败，请重新登录！');
}

// 获取用户权限列表
async function getUserPerms(uid: number) {
   let { code, data, message } = await UserAPI.getPermissionListByUid(uid);
   if (code == 20000) {
      // 存储用户权限列表并构建树形结构
      // permissionList.value = buildTree(data, 0);
      permissionList.value = buildTree(_.cloneDeep(data), 0);
      items.value = buildMenuTree(_.cloneDeep(data), 0);
   } else {
      console.log(message);
   }
}

</script>

<style lang="less"></style>