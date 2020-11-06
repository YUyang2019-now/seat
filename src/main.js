import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './iconfont/iconfont.css'
import Selectable from './untils/selectDiv' //这个修改为你的js路径

Vue.config.productionTip = false


Vue.use(Selectable);

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
