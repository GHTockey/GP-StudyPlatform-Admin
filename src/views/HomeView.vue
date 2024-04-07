<template>
  <div class="home-container">
    <!-- 左边盒子 -->
    <div class="left-box">
      <!-- 用户盒子 -->
      <div class="user-box">
        <!-- 信息 左 -->
        <div>
          <p>欢迎回来</p>
          <p> {{ userInfo?.username }}
            <a-tag color="#f50">管理员</a-tag>
          </p>
          <span>上次登陆：2011-02-15</span>
          <span>登录地址：192.168.0.222</span>
        </div>
        <!-- 图标装饰 -->
        <div>
          <img :src="userIcon" alt="">
        </div>
      </div>
      <!-- 快捷入口 -->
      <div class="entrance">
        <div>
          <UserOutlined />
          <div>
            <span>用户管理</span>
            <!-- <span>...</span> -->
          </div>
        </div>
        <div>
          <KeyOutlined />
          <div>
            <span>权限管理</span>
            <!-- <span>...</span> -->
          </div>
        </div>
        <div>
          <FileTextOutlined />
          <div>
            <span>词集管理</span>
            <!-- <span>...</span> -->
          </div>
        </div>
        <div>
          <TeamOutlined />
          <div>
            <span>班级管理</span>
            <!-- <span>...</span> -->
          </div>
        </div>
      </div>
      <!-- 图表 数据可视化 -->
      <div class="chart">
        <!-- 顶部栏 -->
        <div>
          <span>词集学习人数分布</span>
          <div>
            <a-button type="primary">班级</a-button>
          </div>
        </div>
        <!-- 图表 -->
        <div ref="chart1"></div>
      </div>
    </div>

    <!-- 右边盒子 -->
    <div class="right-box">
      <!-- 用户的快捷入口 -->
      <div class="user-entrance">
        <span>快捷入口</span>
        <div>
          <div>
            <a-button type="dashed" shape="circle" size="large" :icon="h(LockFilled)"></a-button>
            <span>修改密码</span>
          </div>
          <div>
            <a-button type="dashed" shape="circle" size="large" :icon="h(BellFilled)"></a-button>
            <span>班级申请</span>
          </div>
          <div>
            <a-button type="dashed" shape="circle" size="large" :icon="h(CalendarFilled)"></a-button>
            <span>发布作业</span>
          </div>
          <div>
            <a-button type="dashed" shape="circle" size="large" :icon="h(MessageFilled)"></a-button>
            <span>班级消息</span>
          </div>
        </div>
      </div>
      <!-- 饼图表 -->
      <div ref="pieChart" id="pieChart"></div>
      <!-- 一言 -->
      <div class="one-word">
        <span>一言</span>
        <p>{{ oneWord }}</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { VocabularyAPI } from '@/apis/vocabulary';
import userIcon from '@/assets/img/admin.webp';
import type { Vocabulary } from '@/types/Vocabulary';
import {
  UserOutlined,
  KeyOutlined,
  FileTextOutlined,
  TeamOutlined,
  MessageFilled,
  CalendarFilled,
  BellFilled,
  LockFilled
} from '@ant-design/icons-vue';
import * as echarts from 'echarts';
import { ref, h, onMounted } from 'vue';
import { useUserStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import axios from 'axios';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
// 词集学习人数分布图表
const chart1 = ref<HTMLElement | null>(null);
// 不同词集的词条数
const pieChart = ref<HTMLElement | null>(null);
// 词集排名列表
const vocList = ref<Vocabulary[]>([]);
// 一言
const oneWord = ref<string>('');

onMounted(() => {
  if (userInfo.value) {
    // 获取词集排名列表
    getMostStudyVocList();
    // 获取一言
    getOneWord();
  }
})



// 获取词集列表 按照学习人数排序
async function getMostStudyVocList() {
  let result = await VocabularyAPI.getMostStudyVocList();
  if (result.code === 20000) {
    vocList.value = result.data;
    // 绘制图表 词集学习人数分布
    drawChart1();
    // 绘制图表 不同词集的词条数
    drawChart2();
  } else {
    console.log(result.message);
  }
}
// 绘制图表 词集学习人数分布
function drawChart1() {
  // 深拷贝
  let data: Vocabulary[] = JSON.parse(JSON.stringify(vocList.value));
  if (data.length > 10) {
    data = data.splice(0, 10) // 最多10条数据
  }
  // console.log('开始绘制', data);
  // console.log(vocList.value.map(item => item.stuNum));
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(chart1.value);
  // 绘制图表
  myChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '8%',
      bottom: '8%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.title)
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.stuNum),
        itemStyle: {
          color: '#1677ff'
        }
      }
    ]
  });
}
// 绘制图表 不同词集的词条数
function drawChart2() {
  let data: Vocabulary[] = JSON.parse(JSON.stringify(vocList.value));
  if (data.length > 10) {
    data = data.splice(0, 6) // 最多6条数据
  }

  let myChart = echarts.init(pieChart.value);
  myChart.setOption({
    title: {
      text: '词条分布',
      top: '10%',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: '词条数',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 25,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(item => {
          return {
            value: item.stuNum,
            name: item.title
          }
        })
      }
    ]
  })
}
// 获取一言
async function getOneWord() {
  try {
    let result = await axios.get('https://v1.hitokoto.cn/?c=i');
    oneWord.value = result.data.hitokoto;
  } catch (error) {
    console.log(error);
    oneWord.value = '第三方数据获取失败';
  }
}
</script>

<style>
.home-container {
  /* background-color: aquamarine; */
  width: 100%;
  height: 100%;
  min-height: 600px;
  max-height: 850px;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;

  >div {
    /* border: 1px solid #000; */

    /* 左 */
    &:nth-child(1) {
      flex: 1;
      padding: 10px;

      /* 用户盒子 */
      .user-box {
        display: flex;
        /* flex-wrap: wrap; */
        justify-content: space-between;
        align-items: center;
        height: 180px;
        border-radius: 10px;
        background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);

        >div:nth-child(1) {
          margin-left: 25px;
          color: white;

          >p:nth-child(1) {
            font-size: 20px;
            margin: 0;
          }

          >p:nth-child(2) {
            font-size: 30px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          >span {
            display: block;
            font-size: 14px;
            color: #ccc;
            margin-right: 18px;
          }
        }

        >div:nth-child(2) {
          width: 140px;
          height: 140px;
          margin-right: 20px;

          >img {
            width: 100%;
            height: 100%;
          }
        }
      }

      /* 快捷入口 */
      .entrance {
        margin-top: 10px;
        display: flex;
        height: 150px;
        gap: 10px;

        >div {
          width: calc(100% / 4);
          border-radius: 18px;
          padding: 10px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          flex-wrap: wrap;

          /* 图标 */
          >span {
            width: 50px;
            height: 50px;
            border-radius: 18px;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 25px;
          }

          /* 文字 */
          >div {
            width: 100%;
            font-size: 14px;
            margin-top: 10px;
            text-align: center;

            >span {
              display: block;
              /* color: #517fa4; */

              &:nth-child(1) {
                font-size: 13px;
                font-weight: 600;
              }

              &:nth-child(2) {
                color: gray;
              }
            }
          }

          &:nth-child(1) {
            background-color: #c9facc;

            >span {
              background-color: #95f49d;
            }
          }

          &:nth-child(2) {
            background-color: #cff2fd;

            >span {
              background-color: #95d7f4;
            }
          }

          &:nth-child(3) {
            background-color: #fff9cd;

            >span {
              background-color: #dbd076;
            }
          }

          &:nth-child(4) {
            background-color: #ffe8db;

            >span {
              background-color: #ffc8a8;
            }
          }
        }
      }

      /* 图表: 词集学习人数分布图表 */
      .chart {
        width: 100%;
        margin-top: 10px;
        /* border: 1px solid red; */
        height: calc(100% - (180px + 150px + 20px));

        >div {

          /* 顶部栏 */
          &:nth-child(1) {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30px;

            >span {
              font-weight: 600;
              font-size: 16px;
              /* margin: 10px 0; */
            }
          }

          /* 内容 【图表】 */
          &:nth-child(2) {
            height: calc(100% - 30px);
            background-color: white;
            border-radius: 15px;
            margin-top: 10px;
          }
        }
      }
    }


    /* 右 */
    &:nth-child(2) {
      width: 350px;

      /* 用户的快捷入口 */
      .user-entrance {
        position: relative;
        margin-top: 10px;
        padding: 10px;
        height: 180px;
        background-color: white;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        >span {
          font-weight: 600;
          font-size: 16px;
          position: absolute;
          top: 20px;
          left: 20px;
        }

        /* 快捷入口 */
        >div {
          width: 100%;
          display: flex;
          justify-content: space-around;
          margin-top: 30px;

          >div {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-wrap: wrap;

            >span {
              width: 100%;
              margin-top: 10px;
            }
          }
        }
      }

      /* 饼图 */
      #pieChart {
        margin-top: 10px;
        height: 450px;
        background-color: white;
        border-radius: 15px;
      }

      /* 一言 */
      .one-word {
        position: relative;
        margin-top: 10px;
        height: calc(100% - (180px + 450px + 30px));
        /* background-color: #00ac54; */
        background-color: #1677ff;
        border-radius: 15px;
        color: white;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: 600;
        padding: 30px;
        /* 文字阴影 */
        text-shadow: 0 0 5px #6666669a;

        >span {
          font-size: 12px;
          font-weight: 400;
          margin-top: 10px;
          position: absolute;
          top: 13px;
          left: 25px;
        }
      }
    }
  }
}
</style>