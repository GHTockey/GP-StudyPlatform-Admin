<template>
   <div class="role-container">
      <!-- 角色表格 -->
      <a-table :columns="columns" :data-source="roleList" rowKey="id" :pagination="false">
         <template #bodyCell="text">
            <!-- 描述 -->
            <template v-if="text?.column.key == 'desc'">
               <a-tag :color="roleColor(text.record.id)">{{ text.record.desc }}</a-tag>
            </template>
            <!-- 用户数量 -->
            <template v-if="text?.column.key == 'userIds'">
               {{ text.record.userIds.length }}
            </template>
            <!-- 操作 -->
            <template v-if="text?.column.key == 'control'">
               <a-space>
                  <a-button size="small" type="default" @click="handleEditRole(<Role>text.record)">编辑</a-button>
                  <a-button size="small" type="primary" @click="handleSetRolePerm(<Role>text.record)">权限</a-button>
                  <a-popconfirm title="删除后不可恢复,请确定!" @confirm="handleDelRole(<Role>text.record)" ok-text="确定"
                     cancel-text="取消">
                     <a-button size="small" type="primary" danger>删除</a-button>
                  </a-popconfirm>
               </a-space>
            </template>
         </template>
         <!-- 表格页脚 -->
         <template #footer>
            <a-button @click="handleAddRoleOpen">添加角色</a-button>
         </template>
      </a-table>
      <!-- 添加/编辑弹框 -->
      <a-modal v-model:open="roleModelShow" @ok="roleModelHandleOk" @cancel="resetAddRoleForm" cancelText="取消" okText="提交" :closable="false">
         <template #title>{{ (isEditRole ? '编辑' : '添加') + '角色' }}</template>
         <a-form :model="currentRole" autocomplete="off" ref="addRoleFormEl">
            <a-form-item label="名称" name="name" :rules="{ required: true, message: '请输入角色名称' }">
               <a-input v-model:value="currentRole.name" />
            </a-form-item>

            <a-form-item label="描述" name="desc" :rules="{ required: true, message: '请输入角色描述' }">
               <a-input v-model:value="currentRole.desc" />
            </a-form-item>
         </a-form>
      </a-modal>
      <!-- 角色权限编辑抽屉 -->
      <a-drawer v-model:open="rolePermDrawerShow" class="custom-class" root-class-name="root-class-name"
         :root-style="{ color: 'blue' }" style="color: red" placement="right" @close="resetRolePermTreeAndForm">
         <template #title>设置角色 <span style="font-weight: 700;">{{ currentRole.name }}</span> 的权限</template>
         <template #extra>
            <a-button type="primary" @click="handleSetRolePermSubmit">提交</a-button>
         </template>
         <a-spin :spinning="getRolePermListLoading">
            <a-tree v-if="permList?.length" checkable defaultExpandAll v-model:checked-keys="checkedKeys"
               :treeData="permList" :fieldNames="{ title: 'name', key: 'id' }" @check="treeCheck">
            </a-tree>
         </a-spin>
         <!-- {{ 'sele:' + checkedKeys }}
         {{ 'half:' + halfChecked }} -->
      </a-drawer>
   </div>
</template>
<script setup lang="ts">
import { RoleApi } from "@/apis/role";
import type { Permission, Role } from "@/types/User";
import { ref } from "vue";
import { buildTree, roleColor } from "@/utils/myTool";
import { message, type TreeProps } from "ant-design-vue";
import { PermApi } from "@/apis/perm";
import lodash from "lodash";
import type { ColumnsType } from "ant-design-vue/es/table";
import type { CheckInfo } from "ant-design-vue/es/vc-tree/props";
import type { FormExpose } from "ant-design-vue/es/form/Form";

// 角色列表
const roleList = ref<Role[]>([]);
// 表格对应数据
const columns: ColumnsType = [
   { title: 'ID', key: 'id', dataIndex: 'id' },
   { title: '名称', key: 'name', dataIndex: 'name' },
   { title: '描述', key: 'desc', dataIndex: 'desc' },
   { title: '用户关联', key: 'userIds', dataIndex: 'userIds' },
   { title: '操作', key: 'control', align: 'center' },
];
// 添加/编辑角色弹框显示
const roleModelShow = ref(false);
// 是否编辑角色
const isEditRole = ref(false);
// 表单数据 【当前选中的角色 添加/编辑】
const currentRole = ref<Role>({
   // id: '',
   name: '',
   desc: '',
   userIds: [],
});
// 角色权限编辑抽屉显示
const rolePermDrawerShow = ref(false);
// 当前角色权限树
const currentRolePerm = ref<Permission[]>([]);
// 权限列表
// const permList = ref<Permission[]>([]);
const permList = ref<TreeProps['treeData']>([]);
// 权限树选中的key
const checkedKeys = ref<TreeProps['checkedKeys']>();
// 权限树半选中的key
const halfChecked = ref<TreeProps['checkedKeys']>();
// 添加角色 表单实例
const addRoleFormEl = ref<FormExpose | null>(null);
// 获取当前角色权限列表的loading
const getRolePermListLoading = ref(false);



getRoleList();
getPermList();
// todo 弹框关闭重置数据



// 重置添加/编辑角色表单
function resetAddRoleForm() {
   currentRole.value = {
      name: '',
      desc: '',
      userIds: [],
   };
   addRoleFormEl.value?.resetFields();
}
// 权限树选中事件
const treeCheck = (fnCheckedKeys: TreeProps['checkedKeys'], info: CheckInfo) => {
   // console.log(fnCheckedKeys, info, "treeCheck");
   checkedKeys.value = fnCheckedKeys;
   halfChecked.value = info.halfCheckedKeys;
};
// 重置角色权限树和添加/编辑角色表单
function resetRolePermTreeAndForm() {
   getRolePermListLoading.value = false;
   currentRolePerm.value = [];
   checkedKeys.value = []
   currentRole.value = {
      name: '',
      desc: '',
      userIds: [],
   };
}
// 添加角色 【打开弹框】
function handleAddRoleOpen() {
   roleModelShow.value = true;
   isEditRole.value = false;
}
// 角色权限设置 【提交请求】
async function handleSetRolePermSubmit() {
   console.log(checkedKeys.value, "权限树选中的key");
   console.log(currentRole.value, "当前选中的角色");
   if (!currentRole.value.id) return message.error('【系统错误】：roleID不能为空');
   let result = await RoleApi.setRolePerm(
      currentRole.value.id,
      { selectedIds: checkedKeys.value as number[], halfCheckIds: halfChecked.value as number[] || [] }
   );
   if (result.code == 20000) {
      message.success(result.message);
      rolePermDrawerShow.value = false;
      getRoleList();
   } else {
      message.error(result.message);
   }
}
// 设置角色权限 【打开抽屉】
async function handleSetRolePerm(role: Role) {
   currentRole.value = lodash.cloneDeep(role);
   rolePermDrawerShow.value = true;
   // console.log(role);
   await getRolePermList(<number>role.id);
   checkedKeys.value = currentRolePerm.value.filter(item => item.halfCheck != 1).map(perm => perm.id as number)
}
// 获取当前角色权限列表
async function getRolePermList(rid: number) {
   getRolePermListLoading.value = true;
   let { code, data } = await PermApi.getPermListByRid(rid);
   if (code == 20000) {
      currentRolePerm.value = data
      getRolePermListLoading.value = false;
   }
}
// 获取权限列表
async function getPermList() {
   let { code, data } = await PermApi.getPermList();
   if (code == 20000) {
      permList.value = buildTree(data, 0);
   }
}
// 编辑角色【打开弹框】
function handleEditRole(role: Role) {
   roleModelShow.value = true;
   isEditRole.value = true;
   // console.log(role);
   currentRole.value = lodash.cloneDeep(role);
}
// 添加/编辑角色【提交请求】
function roleModelHandleOk() {
   // console.log(currentActiveRole.value);
   // console.log(isEditRole.value, 'isEditRole');
   addRoleFormEl.value?.validateFields().then(async () => {
      console.log('验证通过');
      let result;
      if (isEditRole.value) {
         result = await RoleApi.editRole(currentRole.value);
      } else {
         result = await RoleApi.addRole(currentRole.value);
      }
      if (result.code == 20000) {
         message.success(result.message);
         getRoleList();
         roleModelShow.value = false;
      } else {
         message.error(result.message);
      }

   }).catch();

}
// 删除角色【提交请求】
async function handleDelRole(role: Role) {
   if (!role.id) return message.error('角色ID不能为空');
   let { code, message: mag } = await RoleApi.deleteRole(role.id);
   if (code == 20000) {
      message.success(mag);
      getRoleList();
   } else {
      message.error(mag);
   }
}
// 获取角色列表
async function getRoleList() {
   let { code, message, data } = await RoleApi.getRoleList();
   if (code == 20000) {
      roleList.value = data;
   }
}
</script>

<style lang="less"></style>