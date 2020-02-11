import Vue from 'vue';
import 'sanitize.css'; /* normailze */
import '@/plugins/element-ui.config'; /* register element-ui */
import './css/element-variables.scss'; /* element-ui variables */
import './css/index.scss';
import plugin from '@/plugins';
import mixins from '@/mixins';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(plugin);
Vue.mixin(mixins);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
