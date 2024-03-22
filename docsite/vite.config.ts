import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Pages from 'vite-plugin-pages'
import { libName } from "./src/conf";
//var nav;
//import('./node_modules/@docdundee/docnav/bin/lib.mjs').then((x) => nav = x)

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver()
      ],
    }),
    Icons({
      scale: 1.2,
      defaultClass: 'inline-block align-middle',
      compiler: 'vue3',
    }),
    Pages(),
    {
      name: 'watch-doc',
      handleHotUpdate({ file, server }) {
        if (file.includes("public/doc")) {
          //nav.parseDirTree(path.resolve("./public/doc"))
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      },
    }
  ],
  assetsInclude: ["**/*.md", "**/*.py"],
  base: process.env.NODE_ENV === 'production' ? `/${libName.toLowerCase()}` : './',
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