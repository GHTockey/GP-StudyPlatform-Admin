<template>
   <div class="list-container">
      <a-table :columns="columns" :data-source="permList" v-if="permList?.length > 0" bordered defaultExpandAllRows
         :row-class-name="(record => (record.parentId == 0 ? 'table-style' : null) as string)">
         <!-- 页头 -->
         <template #title>
            <a-button>添加权限</a-button>
         </template>
      </a-table>
   </div>
</template>

<script setup lang="ts">
import { PermApi } from '@/apis/perm';
import type { Permission } from '@/types/User';
import { message } from 'ant-design-vue';
import type { ColumnsType } from 'ant-design-vue/es/table';
import { ref } from 'vue';
import { buildTree } from "@/utils/myTool";


// import {  } from "module";

// 权限列表
const permList = ref<Permission[]>([]);
// 表格对应数据
const columns: ColumnsType = [
   { title: 'ID', key: 'id', dataIndex: 'id' },
   { title: '名称', key: 'name', dataIndex: 'name' },
   { title: '路径', key: 'path', dataIndex: 'path' },
   { title: '操作', key: 'control' },
];


getPermList();


// 获取权限列表
async function getPermList() {
   let { code, data, message: msg } = await PermApi.getPermList();
   if (code == 20000) {
      permList.value = buildTree(data, 0);
   } else {
      message.error(msg);
   }
}
</script>

<style>
.table-style {
   background-color: rgba(220, 220, 220, 0.689);
}
</style>