// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router' //路由
import VueResource from 'vue-resource' //ajax请求数据
import 'element-theme-default'; //饿了吗主题样式
import ElementUI from 'element-ui' //饿了吗主题插件
import Vuex from 'vuex' //状态管理
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(Vuex)
    //Vue.http.options.emulateJSON = true;//调整contenttype值为application/x-www-form-urlencoded，其默认值是application/json
    //引入文件路径--组建
import home from './pages/home'
import login from './pages/login'
import merchant_index from './pages/merchant/index'
import channel_index from './pages/channel/index'
import channel_list from './pages/channel/list'
import channel_base from './pages/channel/channel_base'
import channel_account from './pages/channel/channel_account'
import channel_pro from './pages/channel/channel_pro'
import salesman_index from './pages/salesman/index'
//登录状态配置 
const store = new Vuex.Store({
        state: {
            sessionid: GetCookie('sessionid') || ''
        },
        mutations: {
            login(state) {
                SetCookie('sessionid', 'yaya123344', 12);
                console.log(GetCookie('sessionid'));
                state.sessionid = GetCookie('sessionid');
            },
            logout(state) {
                deleteCookie('sessionid');
                console.log(GetCookie('sessionid'));
                state.sessionid = GetCookie('sessionid');
            },
        }
    })
    //路由参数
const routes = [
    //首页
    { path: '/', name: 'home',meta: { auth: false }, component: home },
    //登录页
    { path: '/login', name: 'login', meta: { auth: false }, component: login },
    //商户管理
    { path: '/merchant_index', name: 'merchant_index', component: merchant_index },
    //渠道管理
    { path: '/channel_index', name: 'channel_index', component: channel_index },
    //查看渠道信息
    { path: '/channel_list', name: 'channel_list', component: channel_list }, {
        path: '/channel_base/:userid',
        name: 'channel_base',
        component: channel_base,
    }, {
        path: '/channel_account/:userid',
        name: 'channel_account',
        component: channel_account,
    }, {
        path: '/channel_pro/:userid',
        name: 'channel_pro',
        component: channel_pro,
    },
    //业务员管理
    { path: '/salesman_index', name: 'salesman_index', component: salesman_index },
]
const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
router.beforeEach(({ meta, path }, from, next) => {
        var { auth = true } = meta
        var isLogin = Boolean(store.state.sessionid) //true用户已登录， false用户未登录
        console.log(auth);
        console.log(store.state.sessionid);
        console.log(isLogin);

        if (auth && !isLogin && path !== '/login') {
            return next({ path: '/login' })
            //location.href='http://localhost:8081/#/channel_account/123'
        } else {
            next()
        }

    })
    /* eslint-disable no-new */
new Vue({
        el: '#app',
        template: '<App/>',
        components: { App },
        router,store
    })
    //获取cookie
function GetCookie(cookieName) {
    var strCookie = document.cookie;
    // 将多cookie切割为多个名/值对
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        // 遍历cookie数组，处理每个cookie对
        var arr = arrCookie[i].split("=");
        // 找到名称为cookieName的cookie，并返回它的值
        if (arr[0] == cookieName)
            return arr[1];
    }
    return "";
}
//删除cookie
function deleteCookie(username) {
    var date = new Date();
    // // 删除一个cookie，就是将其过期时间设定为一个过去的时间
    date.setTime(date.getTime() - 10000);
    document.cookie = username + "=v; expires=" + date.toGMTString();
}
// /**/**
// * 设置Cookie （通用函数）
// * @param {string} cookieName Cookie 名称
// * @param {string} cookieValue Cookie 值
// * @param {string} nDays Cookie 过期天数

function SetCookie(cookieName, cookieValue, nDays) {
    /**/
    /* 当前日期 */
    var today = new Date();
    /**/
    /* Cookie 过期时间 */
    var expire = new Date();
    /**/
    /* 如果未设置nDays参数或者nDays为0，取默认值 1 */
    if (nDays == null || nDays == 0)
        nDays = 1;
    /**/
    /* 计算Cookie过期时间 */
    expire.setTime(today.getTime() + nDays * 24 * 60 * 60 * 1000); //获取毫秒数      
    /**/
    /* 设置Cookie值 */
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
    //alert(cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString());
}
