<template>
   <div class="list-container">
      <a-table :columns="columns" :data-source="permList" rowKey="id" v-if="permList?.length > 0" bordered
         :pagination="false" :rowClassName="(record => record.parentId == 0 ? 'table-style' : '')" default-expand-all-rows>
         <!-- 页头 -->
         <template #footer>
            <a-button @click="handleAddPerm()">添加权限</a-button>
         </template>
         <template #bodyCell="text">
            <!-- 操作 -->
            <template v-if="text?.column.key == 'control'">
               <a-space>
                  <a-button size="small" type="primary" @click="handleEditPerm(<Permission>text.record)">编辑</a-button>
                  <a-popconfirm title="删除后不可恢复,请确定!" @confirm="handleDelPerm(<Permission>text.record)" ok-text="确定"
                     cancel-text="取消">
                     <a-button size="small" type="primary" danger>删除</a-button>
                  </a-popconfirm>
               </a-space>
            </template>
         </template>
      </a-table>

      <!-- 添加权限弹框 -->
      <a-modal v-model:open="openAddPermModal" :title="(isEditPerm ? '编辑' : '添加') + '权限'" cancel-text="取消" ok-text="确认"
         @ok="handleOk" @cancel="handleCancelClearForm">
         <a-form :model="currentPermForm" autocomplete="off" ref="addPermFormEl">
            <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入权限名称' }]">
               <a-input v-model:value="currentPermForm.name" />
            </a-form-item>

            <a-form-item label="路径" name="path" :rules="[{ required: true, message: '请输入权限路径' }]">
               <div style="display: flex; align-items: center;">
                  <span style="color: grey;margin-right: 5px; cursor:no-drop;" v-show="parentPath">{{ parentPath }}</span>
                  <a-input v-model:value="currentPermForm.path" />
               </div>
            </a-form-item>

            <a-form-item label="父级" name="parentId">
               <a-cascader v-model:value="currentPermForm.parentIdArr" @change="(<any>onChange)" change-on-select
                  :field-names="{ label: 'name', value: 'id', children: 'children' }" :options="(<any>permList)"
                  placeholder="没有选择默认为顶级权限" />
            </a-form-item>
         </a-form>
         {{ isEditPerm }}
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import { PermApi } from '@/apis/perm';
import type { Permission } from '@/types/User';
import { message } from 'ant-design-vue';
import type { ColumnsType } from 'ant-design-vue/es/table';
import { ref } from 'vue';
import { buildTree } from "@/utils/myTool";
import type { FormExpose } from 'ant-design-vue/es/form/Form';


// 权限列表
const permList = ref<Permission[]>([]);
// 表格对应数据
const columns: ColumnsType = [
   { title: 'ID', key: 'id', dataIndex: 'id' },
   { title: '名称', key: 'name', dataIndex: 'name' },
   { title: '路径', key: 'path', dataIndex: 'path' },
   { title: '操作', key: 'control' },
];
// 添加权限 弹框开关
const openAddPermModal = ref(false);
// 添加权限 表单数据
const currentPermForm = ref<Permission & { parentIdArr: number[] }>({
   path: '',
   name: '',
   parentId: 0,
   parentIdArr: [],
   id: 0,
});
// 添加权限 表单实例
const addPermFormEl = ref<FormExpose | null>(null);
// 添加权限 父级路径
const parentPath = ref<string>('');
// 是否是编辑权限
const isEditPerm = ref(false);
// 当前选中的权限 【响应式】
const currentPermReactive = ref<Permission>();



getPermList();



// 删除权限
function handleDelPerm(perm: Permission) {
   return new Promise((resolve) => {
      PermApi.deletePerm(perm.id as number).then((res) => {
         if (res.code == 20000) {
            message.success(res.message);
            getPermList();
            resolve(true);
         } else {
            message.error(res.message);
            resolve(false);
         }
      });

   })
};
// 添加权限 关闭弹框 清空表单
function handleCancelClearForm() {
   console.log('取消清除表单');
   if (currentPermReactive.value) {
      currentPermReactive.value.disabled = false; // 关闭弹框时解除禁用
      currentPermReactive.value = undefined;
   }
   currentPermForm.value = {
      path: '',
      name: '',
      parentId: 0,
      parentIdArr: [],
      id: 0,
   };
   parentPath.value = '';
   addPermFormEl.value?.resetFields();
};
// 修改权限 打开弹框
async function handleEditPerm(perm: Permission) {
   currentPermReactive.value = perm; // 保存当前选中的权限响应式数据
   currentPermReactive.value.disabled = true; // 因为数据是响应式，所以这里直接修改会影响到树形数据从而禁用当前节点解决“自己选择自己当儿子”的问题
   isEditPerm.value = true;
   openAddPermModal.value = true;
   currentPermForm.value = { ...perm, parentIdArr: [] };
   currentPermForm.value.parentIdArr = (await PermApi.getAncestorIds(<number>perm.id)).data.filter((id: number) => id != 0);
   if (currentPermForm.value.parentId != 0) {
      // 获取父级 path
      parentPath.value = (await PermApi.getPerm(currentPermForm.value.parentId)).data.path;
      // 将父级 path 从当前 path 中去除
      currentPermForm.value.path = currentPermForm.value.path.replace(parentPath.value, '');
   }
};
// 添加权限 联级选择
async function onChange(ids?: number[]) {
   console.log(ids);
   parentPath.value = '';
   if (!ids) return;
   // 选择的最后一个就是父级id
   currentPermForm.value.parentId = ids[ids.length - 1];
   // 设置父级路径
   parentPath.value = (await PermApi.getPerm(currentPermForm.value.parentId)).data.path
};
// 添加权限 打开弹框
function handleAddPerm(parentId?: number) {
   isEditPerm.value = false;
   openAddPermModal.value = true;
   console.log(parentId);
}
// 添加权限 submit
function handleOk() {
   addPermFormEl.value?.validateFields().then(async () => {
      console.log('验证通过');
      let submitData = { ...currentPermForm.value };
      let result;
      submitData.path = parentPath.value + submitData.path;
      if (isEditPerm.value) {
         // 修改权限
         result = await PermApi.editPerm(submitData);
      } else {
         // 添加权限
         result = await PermApi.addPerm(submitData);
      }
      if (result && result.code == 20000) {
         message.success(result.message);
         openAddPermModal.value = false;
         getPermList();
         handleCancelClearForm();
      } else {
         message.error(result?.message);
      }
   }).catch();
}
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