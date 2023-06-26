import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import TDesign, { MessagePlugin } from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
// @ts-ignore
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  // @ts-ignore
  MessagePlugin('error', { content: err.message }).then((r) => {
    console.log(r);
  });
  console.error('发生了一个异常：', err, vm, info);
};
app.use(createPinia());
app.use(router);
app.use(TDesign);
app.mount('#app');
