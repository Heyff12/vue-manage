// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router' //路由

import routes from './route/' //路由参数
import store from './store/' //状态管理参数
import filter from './filter/' //过滤函数
import component from './components/' //全局组建

import VueResource from 'vue-resource' //ajax请求数据
import 'element-theme-default'; //饿了吗主题样式
import ElementUI from 'element-ui' //饿了吗主题插件

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
    //Vue.http.options.emulateJSON = true;//调整contenttype值为application/x-www-form-urlencoded，其默认值是application/json
Vue.http.interceptors.push((request, next) => {
    next((response) => {
        if (response.body.respcd==1001) {
            store.commit('t_login_no', true);
            return false
        }else{
        	return response
        }        
    });
});
const router = new VueRouter({
        routes // （缩写）相当于 routes: routes
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    store
})
