//引入文件路径--组建
import home from '../pages/home'
import login from '../pages/login'
import merchant_index from '../pages/merchant/index'
import channel_index from '../pages/channel/index'
import channel_list from '../pages/channel/list'
import channel_base from '../pages/channel/channel_base'
import channel_account from '../pages/channel/channel_account'
import channel_pro from '../pages/channel/channel_pro'
import salesman_index from '../pages/salesman/index'

//路由参数
/**
 * auth true登录才能访问，false不需要登录，默认true
 */
export default [
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