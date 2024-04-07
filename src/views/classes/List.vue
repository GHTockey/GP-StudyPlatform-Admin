<template>
   <div class="classes-list-container" style="padding: 10px; height: 100%;">
      <a-card title="班级列表" style="height: 100%;overflow-y: auto;">
         <!-- 右上角按钮 -->
         <template #extra><a href="#">
               <a-button @click="openClassesModel()">添加</a-button>
            </a></template>

         <div class="box-parent" style="height: 100%;display: flex;">

            <!-- 列表 -->
            <div class="list-box">
               <!-- 项目 -->
               <div v-for="(item, index) in classesList" :key="item.id" style="transition: all 0.3s;">
                  <!-- 标题与创建者 -->
                  <div style="width: 180px;">
                     <!-- <a-typography-title :level="4">数字媒体设计1班</a-typography-title> -->
                     <a style="color: black; margin: 0 0 5px 0; font-weight: 600; font-size: 18px;"
                        @click.stop="ItemTitleClick(item)">{{
                           item.name }}</a>
                     <div style="display: flex; align-items: center;">
                        <a-avatar size="small" icon="user" :src="item.creator?.avatar" />
                        <span style="margin-left: 5px; margin-right: 20px;">{{ item.creator?.username || 'uName' }}</span>
                        <a-avatar-group style="align-self: flex-end;" :max-count="3"
                           :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', width: '24px', height: '24px', lineHeight: '24px' }">
                           <a-avatar v-for="(user, index) in item.userList" :key="index" size="small" :src="user.avatar" />
                        </a-avatar-group>
                     </div>
                  </div>
                  <!-- 公告内容 -->
                  <div style="width: 230px; height: 100%; display: flex; align-items: center;">
                     <a-typography-paragraph :ellipsis="{ rows: 2 }" style="margin-bottom: 0;" :content="item.info">
                     </a-typography-paragraph>
                  </div>
                  <!-- 操作 -->
                  <div>
                     <a-space>
                        <a-button @click="isEdit = true; openClassesModel(item)" :icon="h(EditOutlined)" type="default"
                           shape="circle" title="编辑" />
                        <a-popconfirm title="删除后不可恢复,请确定!" @confirm="deleteClasses(item.id!)" placement="left">
                           <a-button :icon="h(DeleteOutlined)" type="default" danger shape="circle" title="删除" />
                        </a-popconfirm>
                     </a-space>
                  </div>
               </div>
            </div>

            <Transition name="info-box">
               <!-- 右侧信息 -->
               <div class="info-box" v-show="showClassesData">
                  <!-- 标题 -->
                  <div style="width: 100%;">
                     <a-typography-title :level="4">{{ showClassesData?.name }}</a-typography-title>
                     <span style="color: #a7a7a8;">
                        {{ showClassesData?.annc }}
                     </span>
                  </div>
                  <!-- 成员 -->
                  <div style="width: 100%;">
                     <p style="color: #a7a7a8;">成员</p>
                     <a-avatar-group style="align-self: flex-end;" :max-count="5"
                        :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', width: '24px', height: '24px', lineHeight: '24px' }">
                        <a-avatar v-for="(item, index) in showClassesData?.userList" :key="index" size="small"
                           :src="item.avatar" />
                     </a-avatar-group>
                  </div>
                  <!-- 其它 -->
                  <div style="width: 100%;">
                     <div style="color:#a7a7a8; font-size: 10px;">创建者</div>
                     <div>{{ showClassesData?.creator?.username }}</div>
                     <p></p>
                     <div style="color:#a7a7a8; font-size: 10px;">创建与</div>
                     <div>{{ showClassesData?.createTime }}</div>
                     <p></p>
                     <div style="color:#a7a7a8; font-size: 10px;">信息</div>
                     <div>{{ showClassesData?.info }}</div>
                  </div>
               </div>
            </Transition>
         </div>
      </a-card>

      <!-- 添加/修改班级弹窗 -->
      <a-modal v-model:open="classesModelShow" :title="(isEdit ? '修改' : '添加') + '班级'" @ok="handleOk"
         @cancel="closeClassesModel">
         <a-form :model="currentClasses" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" ref="classesFormEl">
            <a-form-item label="名称" name="name" :rules="{ required: true, message: '请输入班级名称' }">
               <a-input v-model:value="currentClasses.name" />
            </a-form-item>
            <a-form-item label="公告" name="annc">
               <a-textarea v-model:value="currentClasses.annc" />
            </a-form-item>
            <a-form-item label="描述" name="info">
               <a-textarea v-model:value="currentClasses.info" />
            </a-form-item>
         </a-form>
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import { ClassesAPI } from '@/apis/classes';
import type { Classes } from '@/types/Claeese';
import { message } from 'ant-design-vue';
import type { FormExpose } from 'ant-design-vue/es/form/Form';
import { ref,h } from 'vue';
import { useUserStore } from "@/stores/user";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';



const userStore = useUserStore();
// 班级列表
const classesList = ref<Classes[]>();
// 弹窗开关
const classesModelShow = ref(false);
// 是否修改
const isEdit = ref(false);
// 当前选中的班级
const currentClasses = ref<Classes>({
   name: '',
   creatorUid: '',
   annc: '',
   info: '',
   createTime: ''
});
// 表单实例
const classesFormEl = ref<FormExpose>();
// 右侧栏显示的班级数据
const showClassesData = ref<Classes>();



getClassesList();



// 删除班级 【提交】
async function deleteClasses(id: number) {
   let result = await ClassesAPI.deleteClasses(id);
   if (result.code === 20000) {
      getClassesList();
      message.success('删除成功');
   } else {
      message.error('删除失败');
   }
}
// 班级名字点击事件
function ItemTitleClick(item: Classes) {
   if (item.id == showClassesData.value?.id) {
      showClassesData.value = undefined;
      return
   }
   showClassesData.value = JSON.parse(JSON.stringify(item));
}
// 弹窗 OK按钮 【提交】
async function handleOk() {
   try {
      await classesFormEl.value?.validateFields()
      if(!userStore.userInfo) return message.error('用户信息获取失败');
      currentClasses.value.creatorUid = String(userStore.userInfo.id)!;
      let result;
      if (isEdit.value) {
         // 修改
         result = await ClassesAPI.updateClasses(currentClasses.value);
      } else {
         // 添加
         currentClasses.value.createTime = new Date().toLocaleString();
         result = await ClassesAPI.addClasses(currentClasses.value);
      }
      if (result.code === 20000) {
         getClassesList();
         classesModelShow.value = false;
         message.success('操作成功');
      } else {
         message.error('操作失败');
      }

   } catch (error) {
      console.log('校验失败');
   }
}
// 打开弹窗
function openClassesModel(c?: Classes) {
   classesModelShow.value = true;
   if (isEdit.value) {
      currentClasses.value = JSON.parse(JSON.stringify(c));
   } else {

   }
}
// 弹窗关闭时事件
function closeClassesModel() {
   isEdit.value = false;
   currentClasses.value = {
      name: '',
      creatorUid: '',
      annc: '',
      info: '',
      createTime: ''
   };
   classesFormEl.value?.clearValidate();
}
// 获取班级列表
async function getClassesList() {
   let result = await ClassesAPI.getClassesList();
   if (result.code === 20000) {
      classesList.value = result.data;
   }
}
</script>

<style>
/* 班级列表 项目 */
.list-box {
   transition: all 0.3s;
   flex: 1;
   min-width: 550px;


   >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      height: 80px;
      border-bottom: 1px solid gainsboro;
      padding: 5px;
   }
}

/* 右侧信息栏 */
.info-box {
   margin-left: 10px;
   width: 280px;
   border: 1px solid gainsboro;
   display: flex;
   flex-wrap: wrap;
   padding: 20px;
}

.info-box-enter-active {
   animation: itemEnter .2s;
}

.info-box-leave-active {
   animation: itemEnter .2s reverse;
}

/* 进入动画 */
@keyframes itemEnter {
   0% {
      opacity: 0;
      transform: translateX(100%);
      /* width: 0px; */
   }

   100% {
      opacity: 1;
      transform: translateX(0);
      /* width: 280px; */
   }
}
</style>