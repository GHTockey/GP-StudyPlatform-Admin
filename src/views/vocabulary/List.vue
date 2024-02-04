<template>
   <div class="vocab-list-container">
      <!-- <a-card title="词集列表" style="height: 100%;overflow-y: auto;">
         <template #extra>123</template> -->

      <a-table :dataSource="VocabularyList" :columns="columns">

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
                  <a-button :icon="h(EditOutlined)" type="primary" shape="circle" title="编辑" />
                  <a-button :icon="h(DeleteOutlined)" type="primary" danger shape="circle" title="删除" />
               </a-space>
            </template>
         </template>

      </a-table>
      <!-- </a-card> -->

      <!-- 添加/编辑弹窗 -->
      <a-modal :open="vocabModalShow" :title="isEdit ? '编辑词集' : '添加词集'" @cancel="modalClose">
         <a-form :model="currentVocabulary" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
            <a-form-item label="封面">
               <a-upload v-if="!currentVocabulary.cover" v-model:file-list="fileList" name="avatar"
                  list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload"
                  @change="handleChange" :custom-request="uploadAvatar">
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
            <a-form-item label="名称" :rules="{ required: true, message: '请输入名称' }">
               <a-input v-model:value="currentVocabulary.title" />
            </a-form-item>
            <a-form-item label="描述">
               <a-textarea v-model:value="currentVocabulary.desc" />
            </a-form-item>
            <!-- <a-form-item label="词集" :rules="{ required: true, message: '请输入词集' }">
               <a-textarea v-model:value="currentVocabulary.vocab" />
            </a-form-item> -->
         </a-form>
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
const vocabModalShow = ref(true)
// 是否编辑
const isEdit = ref(false)
// 当前选中的词集
const currentVocabulary = ref<Vocabulary>({
   authorId: undefined,
   desc: '',
   title: '',
   cover: '',
   wordsList: []
})
// 上传de文件列表
const fileList = ref([]);
// 上传loading
const coverLoading = ref(false);



getVocabularyList()



// 弹窗关闭 【清除】
function modalClose() {
   vocabModalShow.value = false
   currentVocabulary.value = {
      authorId: undefined,
      desc: '',
      title: '',
      cover: '',
      wordsList: []
   }
   fileList.value = []
   coverLoading.value = false
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
// 上传头像
async function uploadAvatar(file: UploadRequestOption) {
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