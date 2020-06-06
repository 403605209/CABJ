import Vue from 'vue';
import App from './App.vue';
/* eslint-disable */
import { AnimacioInit } from '../../dist';

Vue.config.productionTip = false;
AnimacioInit();
new Vue({
  render: (h) => h(App),
}).$mount('#app');
