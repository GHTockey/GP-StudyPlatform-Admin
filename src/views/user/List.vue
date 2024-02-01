<template>
   <div class="list-container">
      <!-- 用户列表表格 -->
      <a-table :dataSource="userList" :columns="columns" bordered :pagination="false">
         <template #bodyCell="cell">
            <!-- 头像列 -->
            <template v-if="cell?.column.key == 'avatar'">
               <!-- {{ cell?.record.avatar || 'default' }} -->
               <a-avatar :size="'large'" :src="cell.record.avatar">
                  <template #icon>
                     <UserOutlined />
                  </template>
               </a-avatar>
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
                  <a-button type="default" size="small" @click="openEditUserModal(<User>cell?.record)">编辑</a-button>
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
               <a-button @click="openAddUserModal" type="dashed">添加用户</a-button>
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
      <a-modal v-model:open="addEditModalShow" :title="(isEditUser ? '编辑' : '添加') + '用户'" @ok="handleOk"
         @cancel="handleCancel" ok-text="确定" cancel-text="取消">
         <a-form ref="userFormEl" :model="currentUserForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <a-form-item label="头像">
               <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
                  :show-upload-list="false" :before-upload="beforeUpload" @change="handleChange"
                  :custom-request="uploadAvatar">
                  <img v-if="currentUserForm.avatar" :src="currentUserForm.avatar" alt="avatar" style="width: 100%;" />
                  <div v-else>
                     <loading-outlined v-if="avatarLoading"></loading-outlined>
                     <plus-outlined v-else></plus-outlined>
                     <div class="ant-upload-text">上传</div>
                  </div>
               </a-upload>
            </a-form-item>
            <a-form-item label="用户名" name="username" :rules="{ required: true, message: '请输入用户名' }">
               <a-input v-model:value="currentUserForm.username" />
            </a-form-item>
            <a-form-item label="邮箱">
               <a-input v-model:value="currentUserForm.email" />
            </a-form-item>
            <a-form-item label="角色" name="roleIds" >
               <a-select v-model:value="currentUserForm.roleIds" mode="multiple" placeholder="请选择角色">
                  <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
                     <div>
                        <a-tag :color="roleColor(role.id)">{{ role.name }}</a-tag>
                        <!-- #{{ role.id }} -->
                        <span style="float: right;">{{ role.desc }}</span>
                     </div>
                  </a-select-option>
               </a-select>
            </a-form-item>
            <!-- {{ currentUserForm }} -->
         </a-form>
         <!-- <a-alert message="此页添加用户功能仅供管理员快速的新建账号，其它未输入的数据自动填充默认值。如：密码默认为 123456" /> -->

         <div v-if="!isEditUser" style="border-top: 1px dotted gainsboro;padding: 10px; color: gray;">
            此页添加用户功能仅供管理员快速的新建账号，其它未输入的数据自动填充默认值。如：密码默认为 123456</div>
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
import { message, type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import type { FormExpose } from 'ant-design-vue/es/form/Form';
import { PlusOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons-vue';
import { OtherAPI } from "@/apis/other";
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';


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
const addEditModalShow = ref(false);
// 是否编辑用户
const isEditUser = ref(false);

// 表格列
const columns: ColumnsType = [
   { title: 'ID', dataIndex: 'id', key: 'id', width: 30 },
   { title: '头像', key: 'avatar', width: '50px' },
   { title: '用户名', dataIndex: 'username', key: 'username', width: '100px', align: 'center' },
   { title: '邮箱', dataIndex: 'email', key: 'email' },
   { title: '角色', dataIndex: 'roleList', key: 'roleList' },
   { title: '操作', key: 'control', align: 'center' },
];
// 用户表单数据
const currentUserForm = ref<User>({
   username: '',
   password: '',
   email: '',
   avatar: '',
   roleList: [],
   roleIds: [],
});
// 用户表单实例
const userFormEl = ref<FormExpose | null>(null);
// 上传头像文件列表
const fileList = ref([]);
// 上传头像loading
const avatarLoading = ref<boolean>(false);

getUserList(pageVo.value.current, pageVo.value.pageSize, userListVo.value);
getRoleList();


// 上传头像
async function uploadAvatar(file: UploadRequestOption) {
   currentUserForm.value.avatar = '';
   const formData = new FormData();
   formData.append('file', file.file);
   let { code, data, message: msg } = await OtherAPI.fileUpload(formData);
   if (code == 20000) {
      file.onSuccess?.(data);
   } else {
      message.error(msg);
   }
}
// 上传组件change事件
const handleChange = (info: UploadChangeParam) => {
   // 上传中
   if (info.file.status === 'uploading') {
      avatarLoading.value = true;
      return;
   }
   // 上传成功
   if (info.file.status === 'done') {
      // console.log('done', info);
      currentUserForm.value.avatar = info.file.response;
      avatarLoading.value = false;
   }
   // 上传失败
   if (info.file.status === 'error') {
      avatarLoading.value = false;
      message.error('upload error');
   }
};
// 文件校验
const beforeUpload = (file: UploadProps['fileList'][number]) => {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的文件!');
   }
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) {
      message.error('图片必须小于2MB!');
   }
   return isJpgOrPng && isLt2M;
};
// 编辑用户按钮 【打开弹框】
function openEditUserModal(user: User) {
   isEditUser.value = true;
   addEditModalShow.value = true;
   currentUserForm.value = JSON.parse(JSON.stringify(user));
   currentUserForm.value.roleIds = user.roleList?.map(role => role.id) as number[];
};
// 添加/编辑用户 【弹框关闭】
function handleCancel() {
   addEditModalShow.value = false; // 关闭弹框
   userFormEl.value?.resetFields(); // 重置表单验证
   currentUserForm.value = { // 重置表单数据
      username: '',
      password: '',
      email: '',
      avatar: '',
      roleList: [],
      roleIds: [],
   };
};
// 添加用户按钮 【打开弹框】
function openAddUserModal() {
   isEditUser.value = false;
   addEditModalShow.value = true;
};
// 添加/编辑用户 【提交】
async function handleOk() {
   await userFormEl.value?.validateFields()
   // 处理角色列表
   currentUserForm.value.roleList = roleList.value?.filter(role => currentUserForm.value.roleIds?.includes(role.id as number)) as Role[];
   // console.log(currentUserForm.value);
   let result;
   if (isEditUser.value) {
      // 编辑用户
      result = await UserAPI.editUser(currentUserForm.value);
   } else {
      // 添加用户
      result = await UserAPI.addUser(currentUserForm.value);
   }
   if (result.code == 20000) {
      message.success(result.message);
      getUserList(pageVo.value.current, pageVo.value.pageSize, userListVo.value);
      handleCancel();
   } else {
      message.error(result.message);
   }
};
// 删除用户 【提交】
async function handleDelUser(user: User) {
   let result = await UserAPI.deleteUser(user.id!);
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

<style scoped>
.avatar-uploader>.ant-upload {
   width: 128px;
   height: 128px;
}

.ant-upload-select-picture-card i {
   font-size: 32px;
   color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
   margin-top: 8px;
   color: #666;
}
</style>