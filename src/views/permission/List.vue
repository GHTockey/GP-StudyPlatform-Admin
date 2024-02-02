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
            <!-- 图标 -->
            <template v-if="text?.column.key == 'icon'">
               <icon style="width: 30px;">
                  <template #component>
                     <span v-html="text.record.icon?.code"></span>
                  </template>
               </icon>
            </template>
         </template>
      </a-table>

      <!-- 添加权限弹框 -->
      <a-modal v-model:open="openAddPermModal" :title="(isEditPerm ? '编辑' : '添加') + '权限'" cancel-text="取消" ok-text="确认"
         @ok="handleOk" @cancel="handleCancelClearForm">
         <a-form :model="currentPermForm" autocomplete="off" ref="addPermFormEl" :label-col="{ span: 3 }"
            :wrapper-col="{ span: 20 }">
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

            <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择权限类型' }]">
               <a-radio-group v-model:value="currentPermForm.type" button-style="solid">
                  <a-radio-button value="page">页面</a-radio-button>
                  <a-radio-button value="operate">操作</a-radio-button>
               </a-radio-group>
               <span v-if="currentPermForm.type == 'page'">
                  [页面]影响左侧菜单栏权限
               </span>
               <span v-else-if="currentPermForm.type == 'operate'">
                  [操作]影响按钮级别权限
               </span>
            </a-form-item>

            <a-form-item label="图标" name="icon">
               <div style="width: 32px; height: 32px; position: absolute; left: 80px;">
                  <template v-if="!currentPermForm.icon">
                     <div style="color: grey; width: 100px; height: 100%; line-height: 32px;"> 未选择图标 </div>
                  </template>
                  <icon v-else>
                     <template #component>
                        <span v-html="currentPermForm.icon?.code"></span>
                     </template>
                  </icon>
               </div>
               <a-tooltip color="#fff" trigger="click" placement="bottomLeft">
                  <a-button>选择</a-button>
                  <template #title>
                     <div class="select-icon-box">
                        <div v-for="(item, index) in iconList" :key="index" class="select-icon-item" :title="item.name"
                           @click="selectIconHandler(item.id!)">
                           <icon style="width: 100%;">
                              <template #component>
                                 <span v-html="item.code"></span>
                              </template>
                           </icon>
                        </div>
                     </div>
                  </template>
               </a-tooltip>
            </a-form-item>

         </a-form>
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import { PermApi } from '@/apis/perm';
import type { Permission } from '@/types/User';
import { Modal, message } from 'ant-design-vue';
import type { ColumnsType } from 'ant-design-vue/es/table';
import { h, ref } from 'vue';
import { buildTree } from "@/utils/myTool";
import type { FormExpose } from 'ant-design-vue/es/form/Form';
import Icon from '@ant-design/icons-vue';
import type { Icon as IconType } from '@/types/Icon';
import { IconAPI } from '@/apis/icon';


// 权限列表
const permList = ref<Permission[]>([]);
// 表格对应数据
const columns: ColumnsType = [
   { title: 'ID', key: 'id', dataIndex: 'id', width: 120 },
   { title: '图标', key: 'icon', dataIndex: 'icon', align: 'center', width: 80 },
   { title: '名称', key: 'name', dataIndex: 'name' },
   { title: '路径', key: 'path', dataIndex: 'path' },
   { title: '类型', key: 'type', dataIndex: 'type' },
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
   type: null,
   icon: null
});
// 添加权限 表单实例
const addPermFormEl = ref<FormExpose | null>(null);
// 添加权限 父级路径
const parentPath = ref<string>('');
// 是否是编辑权限
const isEditPerm = ref(false);
// 当前选中的权限 【响应式】
const currentPermReactive = ref<Permission>();
// 图标列表
const iconList = ref<IconType[]>();



getPermList();
getIconList();



// 图标选择事件
function selectIconHandler(id: number) {
   currentPermForm.value.icon = JSON.parse(JSON.stringify(iconList.value?.find((item) => item.id == id)));
}
// 获取图标列表
async function getIconList() {
   let result = await IconAPI.getIconList();
   if (result.code == 20000) {
      iconList.value = result.data;
   }
}
// 删除权限 
function handleDelPerm(perm: Permission) {
   return new Promise(async (resolve) => {
      let { data } = await PermApi.getDescendantIds(perm.id as number)
      if (data.length) {
         Modal.confirm({
            title: '提示',
            // content: `该权限下还有 ${data.length} 项后代权限将一并删除，请确定!`,
            content: h('span', null, [
               '该权限下还有 ',
               h('span', { style: 'color: red; font-weight:700;' }, data.length),
               ' 项后代权限将一并删除，请确定!'
            ]),
            okText: '确定删除',
            cancelText: '取消',
            onOk() {
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
            },
            onCancel() {
               resolve(false);
            }
         });
      } else {
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
      }


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
      type: null
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

<style scoped>
.table-style {
   background-color: rgba(220, 220, 220, 0.689);
}

/* 选择图标 Box */
.select-icon-box {
   padding: 8px 8px 8px 0px;
   display: flex;
   gap: 5px;
   flex-wrap: wrap;
   justify-content: space-evenly;
   max-width: 350px;
   max-height: 100px;
   overflow-y: auto;
}

/* 选择图标 item  */
.select-icon-item {
   width: 30px;
   height: 30px;
   border-radius: 5px;
   cursor: pointer;
   box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
   transition: all 0.3s;
}

.select-icon-item:hover {
   transform: scale(1.1);
   transition: all 0.3s;
   box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
   border-radius: 8px;
   background-color: rgba(255, 255, 255, 0.689);

}
</style>