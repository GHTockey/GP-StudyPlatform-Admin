<template>
   <div class="vocab-list-container">
      <!-- <a-card title="词集列表" style="height: 100%;overflow-y: auto;">
         <template #extra>123</template> -->

      <a-table :dataSource="VocabularyList" :columns="columns">
         <!-- 表头行 -->
         <template #title>
            <a-space>
               <a-button type="primary" @click="modalOpen()">添加</a-button>
            </a-space>
         </template>

         <template #bodyCell="cell">
            <!-- 名称列 -->
            <template v-if="cell?.column.dataIndex == 'title'">
               <div style="display: flex; align-items: center;">
                  <!-- {{ cell.record.cover }} -->
                  <a-avatar shape="square" :src="cell.record.cover" :size="64" class="list-cover">
                     cover
                  </a-avatar>
                  <span style="font-weight: 600;">《{{ cell.record.title }}》</span>
               </div>
            </template>

            <!-- 操作列 -->
            <template v-if="cell?.column.key == 'control'">
               <a-space>
                  <a-button @click="modalOpen(<Vocabulary>cell.record)" :icon="h(EditOutlined)" type="default"
                     shape="circle" title="编辑" />
                  <a-popconfirm  title="删除后不可恢复,请确定!" @confirm="delVocabulary(cell.record.id)" placement="left" >
                     <a-button :icon="h(DeleteOutlined)" type="default" danger shape="circle" title="删除" />
                  </a-popconfirm>
               </a-space>
            </template>
         </template>

      </a-table>
      <!-- </a-card> -->

      <!-- 添加/编辑弹窗 -->
      <a-modal :open="vocabModalShow" :title="isEdit ? '编辑词集' : '添加词集'" @cancel="modalClose" @ok="modalOk">
         <a-form :model="currentVocabulary" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }" ref="vocabModalEl">
            <a-form-item label="封面" name="cover">
               <a-upload v-if="!currentVocabulary.cover" v-model:file-list="fileList" name="avatar"
                  list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload"
                  @change="handleChange" :custom-request="uploadCover">
                  <div>
                     <LoadingOutlined v-if="coverLoading"></LoadingOutlined>
                     <PlusOutlined v-else></PlusOutlined>
                     <div class="ant-upload-text">上传</div>
                  </div>
               </a-upload>
               <a-tooltip v-if="currentVocabulary.cover" @click="clearCover" placement="right" color="red" title="点击清除">
                  <a-avatar :src="currentVocabulary.cover" shape="square" :size="64" class="modal-cover" />
               </a-tooltip>

            </a-form-item>
            <a-form-item label="名称" name="title" :rules="{ required: true, message: '请输入名称' }">
               <a-input v-model:value="currentVocabulary.title" />
            </a-form-item>
            <a-form-item label="描述" name="desc">
               <a-textarea v-model:value="currentVocabulary.desc" />
            </a-form-item>
            <!-- <a-form-item label="词集" :rules="{ required: true, message: '请输入词集' }">
               <a-textarea v-model:value="currentVocabulary.vocab" />
            </a-form-item> -->
         </a-form>
         {{ currentVocabulary }}
      </a-modal>
   </div>
</template>

<script setup lang="ts">
import { VocabularyAPI } from '@/apis/vocabulary';
import type { Vocabulary } from '@/types/Vocabulary';
import type { ColumnsType } from 'ant-design-vue/es/table';
import { ref, h } from 'vue';
import { EditOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message, type UploadFile, type UploadChangeParam } from 'ant-design-vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { OtherAPI } from '@/apis/other';
import type { FormExpose } from 'ant-design-vue/es/form/Form';
import { useUserStore } from "@/stores/user";


const userStore = useUserStore();
// 词集列表
const VocabularyList = ref<Vocabulary[]>([])
// 表格对应数据
const columns: ColumnsType = [
   { title: '名称', dataIndex: 'title', align: 'center' },
   { title: '作者', dataIndex: 'authorId' },
   { title: '描述', dataIndex: 'desc' },
   { title: '词数', dataIndex: 'count' },
   { title: '创建于', dataIndex: 'createTime' },
   { title: '更新于', dataIndex: 'updateTime' },
   { title: '操作', key: 'control' },
]
// 弹窗显示开关
const vocabModalShow = ref(false)
// 是否编辑
const isEdit = ref(false)
// 当前选中的词集
const currentVocabulary = ref<Vocabulary>({
   authorId: '',
   desc: '',
   title: '',
   cover: '',
   wordsList: []
})
// 上传de文件列表
const fileList = ref([]);
// 上传loading
const coverLoading = ref(false);
// 表单实例
const vocabModalEl = ref<FormExpose | null>(null)



getVocabularyList()



// 删除词集 【提交】
async function delVocabulary(id: number | string) {
   const result = await VocabularyAPI.delVocabulary(id)
   if (result.code == 20000) {
      message.success('删除成功')
      getVocabularyList()
   } else {
      message.error('删除失败')
   }
}
// 弹窗确定 【提交】
async function modalOk() {
   try {
      await vocabModalEl.value?.validateFields();
      let result;
      if (isEdit.value) {
         // 编辑
         result = await VocabularyAPI.updVocabulary(currentVocabulary.value)
      } else {
         // 添加
         currentVocabulary.value.authorId = userStore.userInfo.id!
         result = await VocabularyAPI.addVocabulary(currentVocabulary.value)
      }
      if (result.code == 20000) {
         message.success('操作成功')
         getVocabularyList()
         modalClose()
      } else {
         message.error('操作失败')
      }
   } catch (error) {
      console.log(error);
      console.log('表单验证失败');
   }
}
// 弹窗打开 【添加/编辑回显】
function modalOpen(vocab?: Vocabulary) {
   if (vocab) {
      isEdit.value = true
      // 回显
      currentVocabulary.value = JSON.parse(JSON.stringify(vocab))
   }
   vocabModalShow.value = true

}
// 弹窗关闭 【清除】
function modalClose() {
   vocabModalShow.value = false
   currentVocabulary.value = {
      authorId: '',
      desc: '',
      title: '',
      cover: '',
      wordsList: []
   }
   fileList.value = []
   coverLoading.value = false
   isEdit.value = false
   vocabModalEl.value?.resetFields()
}
// 弹窗图片点击 【点击清除封面】
function clearCover() {
   currentVocabulary.value.cover = ''
}
// 获取词集列表
async function getVocabularyList() {
   let result = await VocabularyAPI.getVocabularyList()
   if (result.code == 20000) {
      VocabularyList.value = result.data
   }
}
// 文件校验
const beforeUpload = (file: UploadFile) => {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的文件!');
   }
   const isLt2M = file.size! / 1024 / 1024 < 2;
   if (!isLt2M) {
      message.error('图片必须小于2MB!');
   }
   return isJpgOrPng && isLt2M;
};
// 上传组件change事件
const handleChange = (info: UploadChangeParam) => {
   // 上传中
   if (info.file.status === 'uploading') {
      coverLoading.value = true;
      return;
   }
   // 上传成功
   if (info.file.status === 'done') {
      // console.log('done', info);
      // 上传成功后赋值
      currentVocabulary.value.cover = info.file.response;
      coverLoading.value = false;
   }
   // 上传失败
   if (info.file.status === 'error') {
      coverLoading.value = false;
      message.error('upload error');
   }
};
// 上传封面
async function uploadCover(file: UploadRequestOption) {
   currentVocabulary.value.cover = ''; // 清空
   const formData = new FormData();
   formData.append('file', file.file);
   let { code, data, message: msg } = await OtherAPI.fileUpload(formData);
   if (code == 20000) {
      file.onSuccess?.(data);
   } else {
      message.error(msg);
   }
}
</script>

<style scoped>
.vocab-list-container {
   padding: 10px;
   height: 100%;
   overflow: auto;


   /* 列表中的封面 */
   .list-cover {
      width: 100px !important;
      margin-right: 5px;
      border-radius: 10px;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
   }
}

/* 弹窗中的封面 */
.modal-cover {
   width: 200px !important;
   height: 120px !important;
   border-radius: 10px;
   cursor: pointer;
   box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.v-enter-active {
   opacity: 1;
}

.v-leave-active {
   opacity: 0;
}
</style>