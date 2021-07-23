import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import 'nprogress/nprogress.css';
import {authDynamicRouter} from "./router"

import 'utils/filter'

Vue.config.productionTip = false
Vue.use(ElementUI);
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

if (sessionStorage.getItem('authMenus')) {
  authDynamicRouter()
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
