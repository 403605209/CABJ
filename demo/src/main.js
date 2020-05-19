import Vue from 'vue';
import App from './App.vue';
import Cabj from '../../src/main';

Vue.config.productionTip = false;
Vue.use(Cabj);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
