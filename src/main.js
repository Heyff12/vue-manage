// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router' //路由
import routes from './route/' //路由参数

import store from './store/' //状态管理参数

import VueResource from 'vue-resource' //ajax请求数据
import ElementUI from 'element-ui' //饿了吗主题插件
import 'element-theme-default'; //饿了吗主题样式

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
    //Vue.http.options.emulateJSON = true;//调整contenttype值为application/x-www-form-urlencoded，其默认值是application/json
const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
router.beforeEach(({ meta, path }, from, next) => {
        var { auth = true } = meta
        var isLogin = Boolean(store.state.sessionid) //true用户已登录， false用户未登录
        // console.log(auth);
        // console.log(store.state.sessionid);
        // console.log(isLogin);
        if(path=='/login'){
            store.commit('login_ify');
        }else{
            store.commit('login_ifn');
        }
        if (auth && !isLogin && path !== '/login') {            
            return next({ path: '/login' })
        } 
        next()
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    store
})
