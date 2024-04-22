import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//导入path模块
import path from 'path'

export default defineConfig({
  //设置文件路径别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://api.jjcto.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  plugins: [vue()],
})
