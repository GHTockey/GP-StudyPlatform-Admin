<template>
   <div class="role-container">
      <!-- 角色表格 -->
      <a-table :columns="columns" :data-source="roleList" rowKey="id">
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
                  <a-button size="small" type="primary" @click="handleEditRole(<Role>text.record)">编辑</a-button>
                  <a-popconfirm title="删除后不可恢复,请确定!" @confirm="handleDelRole(<Role>text.record)" ok-text="确定"
                     cancel-text="取消">
                     <a-button size="small" type="primary" danger>删除</a-button>
                  </a-popconfirm>
               </a-space>
            </template>
         </template>
      </a-table>
      <!-- 添加/编辑弹框 -->
      <a-modal v-model:open="roleModelShow" :title="(isEditRole ? '编辑' : '添加') + '角色'" @ok="roleModelHandleOk"
         cancelText="取消" okText="提交">
         <a-form :model="currentActiveRole" autocomplete="off">
            <a-form-item label="名称" name="name">
               <a-input v-model:value="currentActiveRole.name" />
            </a-form-item>

            <a-form-item label="描述" name="desc">
               <a-input v-model:value="currentActiveRole.desc" />
            </a-form-item>
         </a-form>
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import { RoleApi } from "@/apis/role";
import type { Role } from "@/types/User";
import { ref } from "vue";
import { roleColor } from "@/utils/myTool";
import { message } from "ant-design-vue";

// 角色列表
const roleList = ref<Role[]>([]);
// 表格对应数据
const columns = [
   { title: 'ID', key: 'id', dataIndex: 'id' },
   { title: '名称', key: 'name', dataIndex: 'name' },
   { title: '描述', key: 'desc', dataIndex: 'desc' },
   { title: '用户数量', key: 'userIds', dataIndex: 'userIds' },
   { title: '操作', key: 'control' },
];
// 角色弹框显示
const roleModelShow = ref(true);
// 是否编辑角色
const isEditRole = ref(false);
// 表单数据 【当前角色添加/编辑】
const currentActiveRole = ref<Role>({
   // id: '',
   name: '',
   desc: '',
   userIds: [],
});

getRoleList();

// 编辑角色【打开弹框】
function handleEditRole(role: Role) {
   roleModelShow.value = true;
   isEditRole.value = true;
   // console.log(role);
   currentActiveRole.value = role;
}
// 编辑角色【提交请求】
async function roleModelHandleOk() {
   console.log(currentActiveRole.value);
   console.log(isEditRole.value, 'isEditRole');
   let result;
   if (isEditRole.value) {
      result = await RoleApi.editRole(currentActiveRole.value);
   } else {
      result = await RoleApi.addRole(currentActiveRole.value);
   }
   if (result.code == 20000) {
      message.success(result.message);
      getRoleList();
      roleModelShow.value = false;
   } else {
      message.error(result.message);
   }
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