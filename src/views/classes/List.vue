<template>
   <div class="classes-list-container" style="padding: 10px; height: 100%;">
      <a-card title="班级列表" style="height: 100%;">
         <template #extra><a href="#">more</a></template>

         <div class="box-parent" style=" height: 100%;
         display: flex;">

            <!-- 列表 -->
            <div class="list-box" style=" flex: 1; min-width: 550px;">
               <!-- 项目 -->
               <div v-for="(item, index) in 5" :key="index" style="
               display: flex; justify-content: space-between; align-items: center;
                  margin-bottom: 3px; height: 80px; border-bottom: 1px solid gainsboro;
                   padding: 5px;">
                  <!-- 标题与创建者 -->
                  <div>
                     <!-- <a-typography-title :level="4">数字媒体设计1班</a-typography-title> -->
                     <p style=" margin: 0 0 5px 0; font-weight: 600; font-size: 18px;">数字媒体设计1班</p>
                     <div style="display: flex; align-items: center;">
                        <a-avatar size="small" icon="user" />
                        <span style="margin-left: 5px; margin-right: 20px;">张三</span>
                        <a-avatar-group style="align-self: flex-end;" :max-count="3"
                           :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', width: '24px', height: '24px', lineHeight: '24px' }">
                           <a-avatar v-for="(item, index) in 5" :key="index" size="small"
                              src="https://c-ssl.dtstatic.com/uploads/item/202004/06/20200406034059_rm4NU.thumb.1000_0.jpeg" />
                        </a-avatar-group>
                     </div>
                  </div>
                  <!-- 公告内容 -->
                  <div style="width: 230px; height: 100%; display: flex; align-items: center;">
                     <a-typography-paragraph :ellipsis="{ rows: 2 }" style="margin-bottom: 0;"
                        content="描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述">
                     </a-typography-paragraph>
                  </div>
                  <!-- 操作 -->
                  <div>
                     <a-space>
                        <a-button type="primary">编辑</a-button>
                        <a-button type="dashed">删除</a-button>
                     </a-space>
                  </div>
               </div>
            </div>
            <!-- 右侧信息 -->
            <div class="info-box" style="margin-left: 10px;width: 250px; border: 1px solid gainsboro;
               display: flex; flex-wrap: wrap; padding: 20px;
            ">
               <!-- 标题 -->
               <div style="width: 100%;">
                  <a-typography-title :level="4">数字媒体设计1班</a-typography-title>
                  <span style="color: #a7a7a8;">
                     公告
                  </span>
               </div>
               <!-- 成员 -->
               <div style="width: 100%;">
                  <p style="color: #a7a7a8;">成员</p>
                  <a-avatar-group style="align-self: flex-end;" :max-count="5"
                     :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', width: '24px', height: '24px', lineHeight: '24px' }">
                     <a-avatar v-for="(item, index) in 10" :key="index" size="small"
                        src="https://c-ssl.dtstatic.com/uploads/item/202004/06/20200406034059_rm4NU.thumb.1000_0.jpeg" />
                  </a-avatar-group>
               </div>
               <!-- 其它 -->
               <div style="width: 100%;">
                  <div style="color:#a7a7a8; font-size: 10px;">创建者</div>
                  <div>admin</div>
                  <p></p>
                  <div style="color:#a7a7a8; font-size: 10px;">创建与</div>
                  <div>2022-04-06</div>
                  <p></p>
                  <div style="color:#a7a7a8; font-size: 10px;">信息</div>
                  <div>2尽快不合适的付i不i发比我额</div>
               </div>
            </div>
         </div>
      </a-card>
   </div>
</template>

<script setup lang="ts">


const data: DataItem[] = [
   {
      title: 'Ant Design Title 1',
   },
   {
      title: 'Ant Design Title 2',
   },
   {
      title: 'Ant Design Title 3',
   },
   {
      title: 'Ant Design Title 4',
   },
];

</script>

<style></style>