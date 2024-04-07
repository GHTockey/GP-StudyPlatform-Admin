<template>
   <div style="height:100%; padding:10px">
      <a-card title="网站设置" :bordered="false" style="height: 100%">
         <!-- <a-image :width="200" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" /> -->
         <a-form>
            <a-form-item label="logo" name="logo">
               <a-upload list-type="picture-card" v-model:file-list="fileList" :custom-request="uploadLogo">
                  <div>
                     <PlusOutlined />
                     <div style="margin-top: 8px">修改</div>
                  </div>
               </a-upload>
            </a-form-item>
            <a-form-item label="预览链接">
               <a-input v-model:value="website.logoUrl" disabled />
            </a-form-item>
            <a-form-item label="名称" name="name">
               <a-input v-model:value="website.name" />
            </a-form-item>
            <a-form-item label="描述" name="info">
               <a-input v-model:value="website.info" />
            </a-form-item>
            <!-- 提交 -->
            <a-form-item>
               <a-button @click="submitWebsite" type="primary" :loading="flags.submitLoading">提交</a-button>
            </a-form-item>
         </a-form>
      </a-card>
   </div>
</template>

<script setup lang="ts">
import { OtherAPI } from "@/apis/other";
import type { Website } from "@/types/Other";
import { PlusOutlined } from "@ant-design/icons-vue";
import { message, type UploadChangeParam, type UploadProps } from "ant-design-vue";
import type { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";
import { ref } from "vue";
import { useWebsiteStore } from "@/stores/website";
import { watch } from "vue";

const websiteStore = useWebsiteStore();
const website = ref<Website>({
   // logo_url: "https://img.tockey.cn/pic/logo.svg",
   logoUrl: "",
   name: "",
   info: ""
})
const fileList = ref<UploadProps['fileList']>([]);
const flags = ref({
   // 提交按钮的loading状态
   submitLoading: false
})



watch(() => websiteStore.logoUrl, (val) => {
   if (websiteStore.logoUrl) {
      website.value = websiteStore.$state;
      fileList.value!.push({
         uid: '-1',
         name: 'image.png',
         url: val
      });
   }
}, { immediate: true })

// 提交修改
async function submitWebsite() {
   flags.value.submitLoading = true;
   let result = await OtherAPI.updateWebsiteInfo(website.value);
   if (result.code == 20000) {
      message.success('修改成功');
   } else {
      message.error(result.message);
   }
   flags.value.submitLoading = false;
}
// 上传 Logo
async function uploadLogo(file: UploadRequestOption) {
   // console.log(file);
   if (fileList.value!.length > 0) {
      fileList.value = [];
      fileList.value.push({
         uid: '-1',
         name: 'image.png',
         status: 'uploading'
      });
   }
   website.value.logoUrl = '';
   const formData = new FormData();
   formData.append('file', file.file);
   let { code, data, message: msg } = await OtherAPI.fileUpload(formData);
   if (code == 20000) {
      file.onSuccess?.(data);
      website.value.logoUrl = data;
      fileList.value!.pop();
      fileList.value!.push({
         uid: '-1',
         name: 'image.png',
         url: data
      });
   } else {
      message.error(msg);
   }
}
</script>