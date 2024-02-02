<template>
   <div class="icon-list">
      <a-card title="图标列表" style="height: 100%;">
         <template #extra>
            <a-button style="margin-left: 10px;" @click="iconFormOpen(false)">添加图标</a-button>
            <a-badge :count="selectedIconList.length">
               <a-button type="primary" danger :disabled="!selectedIconList.length" style="margin-left: 10px;"
                  @click="deleteIconList">批量删除</a-button>
            </a-badge>
         </template>

         <div style="display: flex; height: 100%;">
            <!-- 图标列表 -->
            <a-flex wrap="wrap" gap="small"
               style="min-width: 100px; flex: 2; overflow-y: auto; align-content: baseline; padding: 8px;">
               <div v-for="(item, index) in iconList" :key="index"
                  :class="`border-def ${selectedIconList.includes(item.id!) ? 'icon-active' : ''}`"
                  @click="iconClick(item)">
                  <div style="width: 30px; position: absolute; top: 20%; left: 50%; transform: translate(-50%);">
                     <icon>
                        <template #component>
                           <span v-html="item.code"></span>
                        </template>
                     </icon>
                  </div>
                  <span style="position: absolute; left: 50%; bottom: 20%; transform: translate(-50%);">
                     {{ item.name }}
                  </span>
                  <!-- hover 操作 -->
                  <div class="hover-icon">
                     <EditFilled class="icon-item" title="编辑图标" @click="iconFormOpen(true, item)" />
                     <a-popconfirm title="删除后不可恢复,请确定!" @confirm="deleteIcon(item)" ok-text="确定" cancel-text="取消">
                        <DeleteFilled class="icon-item" title="删除图标" />
                     </a-popconfirm>
                  </div>
               </div>
            </a-flex>
            <!-- 右边栏 -->
            <!-- <div class="right-bar" style=" width: 300px;">
               123
            </div> -->
            <a-card class="right-bar" style="width: 300px;">
               <div class="right-bar-icon">
                  <icon style="width: 100px;">
                     <template #component>
                        <span v-html="showIcon.code"></span>
                     </template>
                  </icon>
               </div>
               <div class="right-bar-info">
                  <p>ID<br /><span>{{ showIcon.id }}</span></p>
                  <p>名称<br /><span>{{ showIcon.name }}</span></p>
                  <p>创建人<br /><span>{{ showIcon.creator }}</span></p>
                  <p>创建时间<br /><span>{{ showIcon.createTime }}</span></p>
                  <p>更新时间<br /><span>{{ showIcon.updateTime || '无' }}</span></p>
               </div>
            </a-card>
         </div>
      </a-card>


      <!-- 添加/编辑对话框 -->
      <a-modal v-model:open="iconModelShow" :title="(isEdit ? '编辑' : '添加') + '图标'" @cancel="iconFormReset"
         @ok="iconFormSubmit">
         <a-form :model="currentIcon" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" ref="iconFormEl">
            <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入图标名称!' }]">
               <a-input v-model:value="currentIcon.name" />
            </a-form-item>
            <a-form-item label="svg 代码" name="code" :rules="[{ required: true, message: '请输入 svg 代码!' }]">
               <a-textarea @input="svgCodeHandler" v-model:value="currentIcon.code"
                  :auto-size="{ minRows: 2, maxRows: 5 }" />
            </a-form-item>
            <a-form-item label="预览">
               <div style="width: 128px; height: 128px; padding: 10px; border: 2px dotted gainsboro; border-radius: 10px;">
                  <icon>
                     <template #component>
                        <span v-html="currentIcon.code"></span>
                     </template>
                  </icon>
               </div>
            </a-form-item>
         </a-form>
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import Icon, { DeleteFilled, EditFilled } from '@ant-design/icons-vue';
import { IconAPI } from "@/apis/icon";
import { ref } from 'vue';
import type { Icon as MyIconType } from "@/types/Icon";
import type { FormExpose } from 'ant-design-vue/es/form/Form';
import { Modal, message } from 'ant-design-vue';
import { useUserStore } from "@/stores/user";


const userStore = useUserStore();
// 图标列表
const iconList = ref<MyIconType[]>([]);
// 当前选中的图标
const currentIcon = ref<MyIconType>({
   name: '',
   code: '',
   creator: '',
   createTime: '',
   updateTime: ''
});
// 添加-编辑对话框 显示隐藏
const iconModelShow = ref(false);
// 是否是编辑
const isEdit = ref(false);
// 表单实例
const iconFormEl = ref<FormExpose | null>(null);
// 多选的图标列表
const selectedIconList = ref<number[]>([]);
// 展示的图标
const showIcon = ref<MyIconType>({
   id: undefined,
   name: '',
   code: '',
   creator: '',
   createTime: '',
   updateTime: ''
});



getIconList();



// 图标点击事件 【选中】
function iconClick(icon: MyIconType) {
   let selectedIcon: MyIconType = JSON.parse(JSON.stringify(icon));
   currentIcon.value = selectedIcon;
   showIcon.value = selectedIcon;
   // 如果已经选中了,则取消选中
   if (selectedIconList.value.includes(selectedIcon.id!)) {
      selectedIconList.value = selectedIconList.value.filter(item => item != selectedIcon.id);
      return;
   }
   selectedIconList.value.push(selectedIcon.id!);
}
// 删除图标
async function deleteIcon(icon: MyIconType) {
   let result = await IconAPI.deleteIcon([icon.id!]);
   if (result.code == 20000) {
      message.success(result.message)
      getIconList();
   } else {
      message.error(result.message)
   }
}
// 批量删除
async function deleteIconList() {
   if (selectedIconList.value.length == 0) {
      message.error('请先选择图标!')
      return;
   }
   Modal.confirm({
      title: '确定要删除吗?',
      content: `将删除${selectedIconList.value.length}项图标,不可恢复,请确定!`,
      onOk: async () => {
         let result = await IconAPI.deleteIcon(selectedIconList.value);
         if (result.code == 20000) {
            message.success(result.message)
            getIconList();
            selectedIconList.value = [];
         } else {
            message.error(result.message)
         }
      }
   });
}
// 图标表单 【打开】
function iconFormOpen(isEditParma: boolean, icon?: MyIconType) {
   isEdit.value = isEditParma;
   iconModelShow.value = true;
   if (isEditParma) {
      currentIcon.value = JSON.parse(JSON.stringify(icon));
   } else {
      iconFormReset();
   }
}
// 图标表单 【重置】
function iconFormReset() {
   iconFormEl.value?.resetFields();
   currentIcon.value = {
      name: '',
      code: '',
      creator: '',
      createTime: '',
      updateTime: ''
   };
   isEdit.value = false;
}
// 图标表单 【提交】
async function iconFormSubmit() {
   try {
      await iconFormEl.value?.validate()
      let result;
      currentIcon.value.creator = userStore.userInfo.username;
      if (isEdit.value) {
         currentIcon.value.updateTime = new Date().toLocaleString();
         result = await IconAPI.updateIcon(currentIcon.value);
      } else {
         currentIcon.value.createTime = new Date().toLocaleString();
         result = await IconAPI.addIcon(currentIcon.value);
      }
      if (result.code == 20000) {
         message.success(result.message)
         iconModelShow.value = false;
         iconFormReset();
         getIconList();
      } else {
         message.error(result.message)
      }
   } catch (error) {
      console.log("表单验证失败", error);
   }
}
// svg 代码处理 [宽度 100%] (使用正侧表达式将 width="xxx" 替换为 width="100%")
function svgCodeHandler() {
   if (!currentIcon.value.code) return;
   currentIcon.value.code = currentIcon.value.code.replace(/width="[^"]+"/g, 'width="100%"').replace(/height="[^"]+"/g, '');
}
// 获取图标列表
async function getIconList() {
   let result = await IconAPI.getIconList();
   if (result.code == 20000) {
      iconList.value = result.data;
   }
}
</script>

<style>
.icon-list {
   padding: 10px;
   height: 100%;
   width: 100%;
   /* overflow: hidden; */
   /* 显示滚动条 */
   /* overflow-y: auto; */
}

.ant-card-body {
   height: calc(100% - 56px);
   padding: 0 !important;
}

.border-def {
   border: 2px solid transparent;
   cursor: pointer;
   transition: all .3s;
   border-radius: 10px;
   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
   position: relative;
   width: 100px;
   height: 100px;
   overflow: hidden;
}

.border-def:hover {
   border-radius: 10px;
   box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
   transition: all .3s;
}

.right-bar {
   box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.hover-icon {
   transition: all .3s;
   display: flex;
   justify-content: space-evenly;
   align-items: center;
   position: absolute;
   bottom: -30%;
   left: 0;
   width: 100%;
   height: 30%;
   background-color: rgba(0, 0, 0, .3);
   /* border-radius: 10px; */
   /* border-radius: 10px 10px 0 0; */
}

.border-def:hover .hover-icon {
   bottom: 0;
}

.icon-item {
   border-radius: 5px;
   padding: 5px;
   transition: all .3s;
   color: #fff;
}

.icon-item:hover {
   background-color: #418efa;
}

/* 图标选中 */
.icon-active {
   border: 2px solid #418efa;
   transition: all .3s;
}

/* 右边栏图标 */
.right-bar-icon {
   position: absolute;
   left: 50%;
   transform: translate(-50%);
   top: 30px;
   border-radius: 10px;
   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

/* 右边栏信息 */
.right-bar-info {
   width: 100%;
   height: 70%;
   position: absolute;
   bottom: 0;
   /* background-color: #418efa; */

   >p {
      font-size: 12px;
      color: gray;
      margin: 0;
      padding: 10px;

      >span {
         font-size: 14px;
         margin-left: 5px;
         color: #000;
         /* font-weight: bold; */
      }
   }
}
</style>