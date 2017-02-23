<template>
    <!-- 获取登录名 、邮箱TODO-->
    <div id="app">
        <div class="manage_body" :class="{hide:login}">
            <div class="header">
                <header>
                    <div class="nav_menu_logo">
                        <router-link :to="{ name: 'home' }">
                            <img v-bind:src="base.logo_url" alt="">
                            <br/> {{base.short_name}}
                            <!-- <img src="./img/logo.png" alt=""><br/>
                                    渠道简称 -->
                        </router-link>
                    </div>
                    <el-menu default-active="1" class="el-menu-vertical-demo" unique-opened="true" router="true" @open="handleOpen" @close="handleClose">
                        <el-menu-item index="1" route="/">
                            <i class="icon_left icon_yester_w"></i>昨日数据
                        </el-menu-item>
                        <el-submenu index="2">
                            <template slot="title"><i class="icon_left icon_qudao_w"></i>渠道管理</template>
                            <el-menu-item index="2-1" route="/channel_list">渠道管理</el-menu-item>
                            <el-menu-item index="2-2" route="/channel_index">新增渠道</el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="icon_left icon_shanghu_w"></i>商户管理</template>
                            <el-menu-item index="3-1" route="/merchant_index">商户管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title"><i class="icon_left icon_slsm_w"></i>业务员管理</template>
                            <el-menu-item index="3-1" route="/salesman_index">业务员管理</el-menu-item>
                        </el-submenu>
                    </el-menu>
                    <div class="clearfix"></div>
                    <div class="head_foot">Copyright <span class="orange"> © 2017</span></div>
                </header>
            </div>
            <div class="main_main">
                <div class="manage_head">
                    <el-row :gutter="0">
                        <el-col :xs="8" :sm="8" :md="8" :lg="8">
                            <div class="manage_head_l"></div>
                        </el-col>
                        <el-col :xs="16" :sm="16" :md="16" :lg="16" :offset="8">
                            <div class="manage_head_r">
                                <span class="fr" v-on:click="quit_manage"><i class="icon_quit"></i>退出</span>
                                <span>Welcome, {{base.name}}</span>
                                <span @click="passdialog=true"><i class="el-icon-setting mar_r6"></i>修改密码</span>
                                <!-- <span class="fr" v-on:click="come_manage">登陆</span> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <router-view></router-view>
            </div>
            <el-dialog title="修改密码" v-model="passdialog" size="tiny">
                <el-form :model="pass" :rules="passes_rules" ref="pass" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="old_password">
                        <el-input v-model="pass.old_password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_password">
                        <el-input v-model="pass.new_password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="check_password">
                        <el-input v-model="pass.check_password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="passdialog = false">取 消</el-button>
                    <el-button type="primary" @click="mendpass">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="返回登录页" v-model="login_dialog" size="tiny">
                <span class="dialog_text">
                    密码修改成功，请点击“确定”按钮进入登录页重新登陆!
                </span>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="tologin">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
import home from './pages/home'
import load from './components/load'
import toast from './components/toast'
import {
    mapState
} from 'vuex'
export default {
    name: 'app',
    components: {
        home,
        load,
        toast
    },
    data() {
        var Pass_old = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            } else {
                if (this.pass.old_password.length < 6 || this.pass.old_password.length > 20) {
                    callback(new Error('密码长度在6~20之内'));
                }
                callback();
            }
        };
        var Pass_new = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.pass.new_password.length < 6 && this.pass.new_password.length > 20) {
                    callback(new Error('密码长度在6~20之内'));
                }
                callback();
            }
        };
        var pass_check = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pass.new_password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            passdialog: false, //是否打开修改密码弹框
            login_dialog: false, //完成修改密码后提示弹框
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            base: {
                "name": "", // 渠道名称
                "short_name": '',
                "logo_url": "/qudao/v1/static/login/img/logo.png", // 企业LOGO的URL
            },
            pass: {
                "old_password": "",
                "new_password": "",
                "check_password": ""
            },
            passes_rules: {
                old_password: [{
                    required: true,
                    pattern: /^[a-zA-Z0-9]{6,20}$/,
                    message: '请输入旧密码，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
                new_password: [{
                    required: true,
                    pattern: /^[a-zA-Z0-9]{6,20}$/,
                    message: '请输入新密码，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
                check_password: [{
                    required: true,
                    validator: pass_check,
                    trigger: 'blur'
                }],
            },
            quit_url: location.protocol + '//' + location.host + '/qudao/v1/api/user/logout', //退出登录
            mendpass_url: location.protocol + '//' + location.host + '/qudao/v1/api/user/change_pwd', //修改密码
            qd_info_url: location.protocol + '//' + location.host + '/qudao/v1/api/qd/info', //渠道基本信息
        }
    },
    computed: mapState({
        // 箭头函数可使代码更简练---是否显示公共部分的样式
        login(state) {
            return state.if_login
        }
    }),
    created: function() {
        this.get_info(); //获取渠道信息 
    },
    methods: {
        //监听toast是否可见的值得变化
        onVisibleChange(val) {
            this.visible_toast = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        },
        //监听toast内容的值得变化
        onMsgChange(val) {
            this.toastmsg = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        },
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        },
        //设置默认sessionid---上线将取消
        come_manage: function() {
            this.$store.commit('login');
        },
        //退出
        quit_manage: function() {
            let _this = this;
            this.$store.commit('logout');
            // this.$http.post(this.quit_url, {
            //         before: function() {
            //             _this.loading = true;
            //         }
            //     })
            //     .then(function(response) {
            //         _this.loading = false;
            //         var data_return = response.body;
            //         if (data_return.respcd == '0000') {
            //             _this.visible_toast = true;
            //             _this.toastmsg = '退出成功!';
            //             window.location.href = location.protocol + '//' + location.host + '/qudao/v1/page/login.html'
            //         } else {
            //             if (data_return.respmsg) {
            //                 _this.toastmsg = data_return.respmsg;
            //             } else {
            //                 _this.toastmsg = data_return.resperr;
            //             }
            //             _this.visible_toast = true;
            //         }
            //     }, function(response) {
            //         _this.loading = false;
            //         _this.visible_toast = true;
            //         _this.toastmsg = '网络超时!';
            //     })
            //     .catch(function(response) {
            //         _this.loading = false;
            //     });
        },
        //修改密码--点击确定
        mendpass: function() {
            let _this = this;
            this.$refs.pass.validate((valid) => {
                if (valid) {
                    this.$store.commit('logout');
                    //_this.mendpass_post();
                } else {
                    return false;
                }
            });
        },
        //修改密码--发送请求
        mendpass_post: function() {
            let _this = this;
            _this.passdialog = false; //关闭修改密码弹框
            let post_data = {
                "old_password": _this.pass.old_password,
                "new_password": _this.pass.new_password,
            };
            this.$http.post(this.mendpass_url, post_data, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.login_dialog = true; //打开跳转到登陆页面弹框
                    } else {
                        if (data_return.respmsg) {
                            _this.toastmsg = data_return.respmsg;
                        } else {
                            _this.toastmsg = data_return.resperr;
                        }
                        _this.visible_toast = true;
                    }
                }, function(response) {
                    _this.loading = false;
                    _this.visible_toast = true;
                    _this.toastmsg = '网络超时!';
                })
                .catch(function(response) {
                    _this.loading = false;
                });
        },
        //返回登录页
        tologin: function() {
            window.location.href = location.protocol + '//' + location.host + '/qudao/v1/page/login.html'
        },
        //获取特定渠道的基本信息
        get_info: function() {
            var _this = this;
            // this.$http.get(this.qd_info_url, {
            //         before: function() {
            //             _this.loading = true;
            //         }
            //     })
            //     .then(function(response) {
            //         _this.loading = false;
            //         var data_return = response.body;
            //         if (data_return.respcd == '0000') {
            //             _this.base = data_return.data.base;
            //             if (_this.base.logo_url.length <= 0 || !_this.base.logo_url) {
            //                 _this.base.logo_url = '/qudao/v1/static/login/img/logo.png';
            //             }
            //         } else {
            //             if (data_return.respmsg) {
            //                 _this.toastmsg = data_return.respmsg;
            //             } else {
            //                 _this.toastmsg = data_return.resperr;
            //             }
            //             _this.visible_toast = true;
            //         }
            //     }, function(response) {
            //         _this.loading = false;
            //         _this.visible_toast = true;
            //         _this.toastmsg = '网络超时!';
            //     })
            //     .catch(function(response) {
            //         _this.loading = false;
            //     });
        },
    }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "./css/common/const";
body,
p,
ul,
ol,
li,
dl,
dt,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
form,
fieldset,
legend,
input,
select,
textarea,
button,
th,
td {
    margin: 0;
    padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: 100%;
}

ul,
dl,
ol {
    list-style: none;
}

img,
fieldset,
input[type="submit"] {
    border: 0 none;
}

img {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
}

em {
    font-style: normal;
}

strong {
    font-weight: normal;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

button,
input[type="button"] {
    cursor: pointer;
    border: 0 none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    tap-highlight-color: rgba(0, 0, 0, 0);
}

textarea {
    word-wrap: break-word;
    resize: none;
}


/* word-wrap for opera, resize for webkit */

menu {
    margin: 0;
    padding: 0;
}

body {
    -webkit-user-select: none;
    -webkit-text-size-adjust: none;
    font-family: Arial, helvetica, "微软雅黑", "Microsoft Yahei", sans-serif;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

input[type="number"] {
    -webkit-user-select: text;
}

a,
button,
input,
img {
    -webkit-touch-callout: none;
}


/* 1.ios 长按时不触发系统的菜单 2.禁止长按时下载图片 */

input,
select,
textarea {
    outline: none;
}

a,
button,
input,
textarea,
span {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    tap-highlight-color: rgba(0, 0, 0, 0);
}

a,
a:link,
a:visited,
a:hover {
    text-decoration: none;
    color: @black;
    cursor: pointer;
}

@media all and (-webkit-transform-3d) {
    /* android4.0+ ios4+ 恢复按钮被点击时产生的效果 */
    a,
    button,
    input,
    textarea,
    span {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        tap-highlight-color: rgba(0, 0, 0, 0);
    }
}

textarea {
    /* 消除ios内阴影 */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

a {
    text-decoration: none;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
    background-color: white;
    background-image: none;
    color: #000000;
}

section,
div,
dl,
dt,
dd,
footer {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}


/* ==================共用============================================================ */

.t_c {
    text-align: center;
}

.t_r {
    text-align: right;
}

.mar_t20 {
    margin-top: 20px;
}

.mar_r6 {
    margin-right: 6px;
}

.fl {
    float: left;
}

.fr {
    float: right;
}

.clearfix {
    display: block;
    zoom: 1;
}

.clearfix:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
    overflow: hidden;
}

.clearfix_line {
    content: "";
    clear: both;
    overflow: hidden;
    width: 100%;
    height: 1px;
    background: @line_color;
}

.clearfix_liner {
    content: "";
    clear: both;
    overflow: hidden;
    width: 92%;
    margin: 0 auto;
    height: 1px;
    background: @line_color;
}

.clearfix_liner1 {
    content: "";
    clear: both;
    overflow: hidden;
    width: 100%;
    box-sizing: content-box;
    padding-right: 20px;
    margin: 0 auto;
    height: 0px;
    border-bottom: 1px dashed @line_color;
    margin-bottom: 22px;
}

.grey {
    color: @grey;
}

.black {
    color: @black;
}

.red {
    color: @red;
}

.orange {
    color: @orange;
}

.border_red {
    color: @red;
}

i.i_normal {
    font-style: normal;
}

a.orange,
a.orange:link,
a.orange:visited,
a.orange:hover {
    text-decoration: none;
    color: @orange;
    cursor: pointer;
}

body {
    background: @background_color;
    color: @black;
    /* 增加该属性，可以增加弹性 */
    -webkit-overflow-scrolling: touch;
}

//本页面
.manage_body {
    width: 100%;
    position: relative;
    padding-left: 250px;
    div.header {
        width: 250px;
        margin: 0px;
        background: #2A2A2A;
        top: 0;
        left: 0;
        padding: 20px 0px 20px 0px;
        border-right: 1px solid @line_color;
        border-top: 1px solid @line_color;
        height: 100%;
        float: left;
        position: fixed;
        color: white;
        z-index: 12;
        display: block;        
        .nav_menu_logo {
            text-align: center;
            margin: 0px 0px 10px;
            font-size: 16px;
            line-height: 50px;
            padding: 10px;
            img {
                width: 60px;
                height: auto;
                border-radius: 10px;
            }
            a {
                display: inline-block;
                color: white;
            }
        }
        .head_foot {
            position: absolute;
            bottom: 36px;
            width: 100%;
            text-align: center;
            font-size: 14px;
        }
    }
    .main_main {
        margin: 0px 0 0 0px;
        padding: 0px 0;
        .manage_head {
            width: 100%;
            padding: 0 30px 0 10px;
            height: 50px;
            line-height: 50px;
            background: @orangebg_color;
            color: white;
            display: block;
            .manage_head_l {
                text-align: left;
                font-size: 18px;
                line-height: 50px;
                a {
                    display: inline-block;
                }
                img {
                    width: auto;
                    height: 50px;
                    margin: 0 10px 0 0px;
                }
            }
            .manage_head_r {
                text-align: right;
                line-height: 50px;
                span {
                    margin-left: 40px;
                    .el-button span {
                        margin-left: 0;
                    }
                }
            }
        }
        .right_head {
            width: 100%;
            height: 76px;
            line-height: 76px;
            box-sizing: border-box;
            padding: 0 20px;
            font-size: 24px;
            background: white;
            margin-bottom: 30px;
        }
        .home_body {
            width: 100%;
            box-sizing: border-box;
            padding: 0px 50px 30px;
        }
        .right_body {
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px 20px;
            &:after {
                content: '';
                clear: both;
                line-height: 0px;
                height: 0px;
                font-size: 0px;
            }
            .right_body_inner {
                width: 100%;
                background: white;
                border-radius: 3px;
            }
            .el-button--primary {
                color: #fff;
                background-color: @orange;
                border-color: @orange;
            }
            .el-button--default {
                color: @orange;
                background-color: white;
                border-color: @orange;
            }
        }
    }
    &.hide{
        padding: 0;
        div.header{
            display: none;
        }
        .main_main{
            .manage_head{
                display: none;
            }
        }
    }
}

.icon_quit {
    width: 16px;
    height: 21px;
    display: inline-block;
    background: url('./img/quit.png') center center no-repeat;
    background-size: 16px auto;
    position: relative;
    top: 6px;
    margin-right: 6px;
}

//导航样式调整
.header {
    .el-menu {
        background: none;
        color: white;
        a {
            color: white;
        }
        .el-submenu__title {
            color: white;
            /*padding-left: 0;*/
            &:hover {
                background: none;
            }
        }
        .el-menu-item {
            color: #8A8C92;
            &:hover {
                background: none;
            }
            &.is-active {
                background: #252424;
                position: relative;
                color: @orange;
                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    width: 3px;
                    height: 56px;
                    background: @orangebg_color;
                }
            }
            a {
                color: @orange;
            }
        }
        .el-submenu.is-opened .el-submenu__title {
            color: @orange;
        }
    }
    .el-submenu {
        .el-menu {
            background: none;
            a li.is-active {
                color: @orange;
            }
        }
        .el-menu-item.is-active:before {
            content: '';
            position: absolute;
            left: 0;
            width: 3px;
            height: 50px;
            background: @orangebg_color;
        }
        i.icon_left {
            margin-right: 6px;
            display: inline-block;
            width: 16px;
            height: 16px;
            position: relative;
            &.icon_yester_w {
                background: url('./img/yester_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_qudao_w {
                background: url('./img/qudao_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_shanghu_w {
                background: url('./img/shanghu_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_slsm_w {
                background: url('./img/ic_yewuyuanw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
        }
        &.is-opened {
            i.icon_left {
                &.icon_shanghu_w {
                    background: url('./img/shanghu_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_yester_w {
                    background: url('./img/yester_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_qudao_w {
                    background: url('./img/qudao_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_slsm_w {
                    background: url('./img/ic_yewuyuan.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
            }
        }
    }
}


/*-----------通用-------------------------------------------------------------------------*/

@media only screen and (min-width: 1450px) {
    header {
        width: 100%;
        height: auto;
        margin: 0px auto 0px;
        padding: 0px 0px;
    }
}

@media only screen and (max-width: 1450px) and (min-width: 768px) {
    header {
        width: 100%;
        height: auto;
        margin: 0 auto;
        padding: 10px 0px;
    }
    div.header {
        margin: 0px auto;
    }
}

@media only screen and (max-width: 768px) and (min-width: 500px) {
    header {
        width: 100%;
    }
    .manage_body div.header {
        margin: 0px auto;
        display: none;
    }
    .manage_body {
        padding-left: 0;
    }
}

@media only screen and (max-width: 500px) {
    .container {
        width: auto;
    }
    .manage_body div.header {
        margin: 0px auto;
        display: none;
    }
    .manage_body {
        padding-left: 0;
    }
    .home_body {
        padding: 0px 10px 30px;
    }
    .home_body_b {
        padding: 0px 10px 30px 10px;
    }
    .right_body {
        padding: 0 10px 20px;
    }
}


/*图片上传*/

.el_pic {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    dd {
        display: inline-block;
        &.tips {
            color: @red;
            position: absolute;
            top: -15px;
            left: 34px;
            display: none;
        }
        &.ipload {
            width: 30%;
            min-width: 60px;
            background-color: @light_orange;
            border: 1px solid @element_bordercolor;
            position: relative;
            text-align: center;
            border-radius: 4px;
            top: -14px;
            left: 8px;
            input {
                width: 100%;
                height: 30px;
                background: 0 0;
                border: none;
                opacity: 0;
                position: absolute;
                left: 0;
                top: 0
            }
            &.disa {
                background: @element_disacolor;
                color: #bbb;
                cursor: not-allowed;
            }
        }
        &.opload_img {
            width: 41px;
            height: 40px;
            border: 1px solid @element_bordercolor;
            border-radius: 3px;
            position: relative;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            img {
                width: 41px;
                height: auto;
                border-radius: 3px;
                position: relative;
                top: -1px;
                left: -1px;
            }
        }
    }
    &.error {
        dd.tips {
            display: block;
        }
        dd.ipload {
            color: @red;
        }
    }
}

table {
    border-collapse: separate; //保留边框
}
</style>
