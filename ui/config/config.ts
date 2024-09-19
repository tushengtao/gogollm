import { defineConfig } from '@umijs/max';
import routes from './router';
export default defineConfig({
  reactQuery: {},
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'GOGOLLM',
  },
  favicons: ['/favicon.jpg'],
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为文件 TODO 国际化待开启
    default: 'zh-CN',
    baseSeparator: '-',
  },
  routes: routes,
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  exportStatic: {}, // 解决采用默认路由方式 build 后访问路由刷新后 404问题
  proxy: {
    '/api': {
      target: 'http://localhost:9116',
      ws: true,
      changeOrigin: true,
      credentials: true,
      pathRewrite: { '^/api': '' },
      proxyTimeout: 10000,
      timeout: 10000,
    },
  }
});
