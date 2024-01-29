<template>
   <div class="list-container">
      <!-- 用户列表表格 -->
      <a-table :dataSource="userList" :columns="columns" bordered :pagination="false">
         <template #bodyCell="cell">
            <!-- 头像列 -->
            <template v-if="cell?.column.key == 'avatar'">
               {{ cell?.record.avatar || 'default' }}
            </template>
            <!-- 角色列 -->
            <template v-if="cell?.column.key == 'roleList'">
               <a-tooltip v-for="role in cell?.record.roleList" :title="role.desc" :color="roleColor(role.id)">
                  <a-tag :color="roleColor(role.id)">{{ role.name }}</a-tag>
               </a-tooltip>
            </template>
            <!-- 操作列 -->
            <template v-if="cell?.column.key == 'control'">
               <a-space>
                  <a-button type="default" size="small">编辑</a-button>
                  <a-popconfirm title="删除后不可恢复,请确定!" @confirm="handleDelUser(<User>cell?.record)" ok-text="确定"
                     cancel-text="取消">
                     <a-button type='primary' danger size="small">删除</a-button>
                  </a-popconfirm>
               </a-space>
            </template>
         </template>

         <!-- 页脚 -->
         <template #footer>
            <a-flex justify="space-between">
               <a-button>添加用户</a-button>
               <!-- 自定义分页 -->
               <a-pagination responsive v-model:current="pageVo.current" v-model:page-size="pageVo.pageSize"
                  :total="pageVo.total" show-size-changer :pageSizeOptions="['5', '10', '20']"
                  :show-total="(total) => `共 ${total} 条`" @change="pageChange">
                  <template #buildOptionText="props">
                     <span>{{ props.value }} 条/页</span>
                  </template>
               </a-pagination>
            </a-flex>
         </template>
         <!-- title -->
         <template #title>
            <!-- 用户筛选条件 -->
            <a-form layout="inline" :model="userListVo">
               <a-form-item label="角色" style="width: 150px;">
                  <a-select placeholder="请选择" v-model:value="userListVo.rid">
                     <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.name
                     }}</a-select-option>
                  </a-select>
               </a-form-item>

               <a-form-item label="用户名">
                  <a-input v-model:value="userListVo.username" placeholder="请输入">
                  </a-input>
               </a-form-item>

               <a-form-item>
                  <a-button type="default" @click="resetForm">
                     重置
                  </a-button>
               </a-form-item>
               <a-form-item>
                  <a-button type="primary" html-type="submit"
                     @click="getUserList(pageVo.current, pageVo.pageSize, userListVo)">
                     查询
                  </a-button>
               </a-form-item>

            </a-form>
         </template>

      </a-table>
      <!-- 添加/编辑用户弹框 -->
      <a-modal v-model:open="addEditModalShow" :title="(isEditUser ? '编辑' : '添加') + '用户'" @ok="handleOk">
         <template #footer>
            <a-button key="back">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
         </template>
         <p>Some contents...</p>
         <p>Some contents...</p>
         <p>Some contents...</p>
         <p>Some contents...</p>
         <p>Some contents...</p>
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import { UserAPI } from '@/apis/user';
import type { Role, User, UserListVo } from '@/types/User';
import type { ColumnsType } from 'ant-design-vue/es/table';
import { ref } from 'vue';
import { roleColor } from "@/utils/myTool";
import { RoleApi } from '@/apis/role';
import { message } from 'ant-design-vue';

// 角色列表
const roleList = ref<Role[]>();
// 用户列表
const userList = ref<User[]>();
// 分页条件
const pageVo = ref({
   current: 1, // 当前页
   pageSize: 5, // 每页条数
   total: 0, // 总条数
});
// 用户筛选条件
const userListVo = ref<UserListVo>({
   rid: undefined,
   username: ''
});
// 添加/编辑用户弹框显示
const addEditModalShow = ref(true);
// 是否编辑用户
const isEditUser = ref(false);

// 表格列
const columns: ColumnsType = [
   { title: 'ID', dataIndex: 'id', key: 'id' },
   { title: '头像', key: 'avatar' },
   { title: '用户名', dataIndex: 'username', key: 'username', width: '80px' },
   { title: '邮箱', dataIndex: 'email', key: 'email' },
   { title: '角色', dataIndex: 'roleList', key: 'roleList' },
   { title: '操作', key: 'control', align: 'center' },
];


getUserList(pageVo.value.current, pageVo.value.pageSize, userListVo.value);
getRoleList();


// 添加/编辑用户 【提交】
async function handleOk() {
   // let result = await UserAPI.addUser();
   // if (result.code == 20000) {
   //    message.success(result.message);
   //    getUserList(pageVo.value.current, pageVo.value.pageSize, userListVo.value);
   // } else {
   //    message.error(result.message);
   // }
};
// 删除用户 【提交】
async function handleDelUser(user: User) {
   let result = await UserAPI.deleteUser(user.id as string);
   if (result.code == 20000) {
      message.success(result.message);
      getUserList(pageVo.value.current, pageVo.value.pageSize, userListVo.value);
   } else {
      message.error(result.message);
   }
};
// 重置条件表单
function resetForm() {
   userListVo.value = {
      rid: undefined,
      username: ''
   };
}
// 获取去角色列表
async function getRoleList() {
   let { code, data, message } = await RoleApi.getRoleList();
   if (code == 20000) {
      roleList.value = data;
   } else {
      console.log(message);
   }
};
// 获取用户列表
async function getUserList(num: number, size: number, userListVo: UserListVo) {
   let { code, data, message } = await UserAPI.getUserList(num, size, userListVo);
   if (code == 20000) {
      userList.value = data.records;
      pageVo.value.total = data.total;
   } else {
      console.log(message);
   }
};
// 页码改变
function pageChange(page: number, pageSize: number) {
   console.log(page, pageSize);
   getUserList(page, pageSize, userListVo.value);
}
</script>

<style lang="less"></style>