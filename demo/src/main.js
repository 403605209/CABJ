import Vue from 'vue';
import App from './App.vue';
/* eslint-disable */
import { CABJInit } from '../../dist';

Vue.config.productionTip = false;
CABJInit();
new Vue({
  render: (h) => h(App),
}).$mount('#app');
