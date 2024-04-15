import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  // for storybook builds to github pages
  //base: process.env.NODE_ENV === 'production' ? '/snowind-stories/' : './',
  resolve: {
    alias: [
      { find: '@/', replacement: '/src/' },
      {
        find: 'vue',
        replacement: path.resolve("./node_modules/vue"),
      },
    ]
  },
})