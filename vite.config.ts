import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import { proxyHandlerMiddle, proxySettingMiddleware } from './proxy';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    nodePolyfills(),
    react({ devTarget: 'es5' }),
    {
      name: 'proxy',
      configureServer: server => {
        server.middlewares.use('/settings', proxySettingMiddleware);
        server.middlewares.use('/https:', proxyHandlerMiddle);
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@libs': path.resolve(dirname, './src/libs'),
      '@icons': path.resolve(dirname, './src/icons'),
      '@components': path.resolve(dirname, './src/components'),
      '@redux': path.resolve(dirname, './src/redux'),
      '@provider': path.resolve(dirname, './src/provider'),
      '@plugins': path.resolve(dirname, './plugins'),
      '@hooks': path.resolve(dirname, './src/hooks'),
      '@typings': path.resolve(dirname, './src/types'),
      '@scripts': path.resolve(dirname, './scripts'),
      '@store': path.resolve(dirname, './src/store'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
