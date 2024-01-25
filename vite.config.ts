import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({ // 自动导入组件
      resolvers: [AntDesignVueResolver({ importStyle: false })],
    }),
    AutoImport({ // 自动导入类型  (还要在tsconfig.app.json中配置include: {..., "./components.d.ts"} )
      resolvers: [AntDesignVueResolver()]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server: {
  //   port: 3001,
  // },
})
