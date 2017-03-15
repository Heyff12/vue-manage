<template>
    <div class="body_bg">
        <div class="band">
            <span>渠道系统</span>
        </div>
        <div class="formbody">
            <p>用户登录</p>
            <el-form :model="login" :rules="login_rules" ref="login" label-width="0px" class="demo-ruleForm">
                <el-form-item label="" prop="username">
                    <el-input v-model="login.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input v-model="login.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footerbg"></div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
import load from '../../components/load'
import toast from '../../components/toast'
export default {
    name: 'login',
    components: {
        load,
        toast
    },
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            login: {
                "username": "",
                "password": "",
            },
            login_rules: {
                username: [{
                    required: true,
                    pattern: /(^1[0-9]{10}$|^[a-zA-Z0-9_\-\'\.]+@[a-zA-Z0-9_]+(\.[a-z]+){1,2}$)/,
                    message: '请输入用户名（密码/邮箱）',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    pattern: /^[a-zA-Z0-9]{6,20}$/,
                    message: '请输密码，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
            },
            login_url: location.protocol + '//' + location.host + '/qudao/v1/api/user/login', //登录地址
        }
    },
    created() {

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
        onSubmit() {
            let _this = this;
            this.$refs.login.validate((valid) => {
                if (valid) {
                    this.$store.commit('login');
                    this.$router.replace({
                            path: '/'
                        })
                        //_this.login_post();
                } else {
                    return false;
                }
            });
        },
        login_post() {
            let _this = this;
            this.$http.post(_this.login_url, _this.login, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        window.location.href = data_return.data.redirect_url;
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
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
// .manage_body {
//     padding: 0;
//     div.header {
//         display: none;
//     }
//     .main_main .manage_head {
//         display: none;
//     }
// }

//登录页
.body_bg {
    width: 100%;
    height: 100%;
    min-height: 500px;
    background: #FFF8EB;
    overflow: hidden;
    position: relative;
    //z-index: -2;
    .footerbg {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: auto;
        min-height: 600px;
        background: url('../../img/bg.png') bottom center no-repeat #FFF8EB;
        background-size: 100% auto;
        z-index: 1;
    }
    .band {
        width: auto;
        height: auto;
        max-width: 380px;
        max-height: 80px;
        box-sizing: border-box;
        margin: 0 auto;
        font-size: 36px;
        padding: 12px 30px;
        color: #FF8100;
        background: white;
        border-radius: 0 0 16px 16px;
        box-shadow: 0 4px 10px 0 rgba(255, 129, 0, .19);
        text-align: center;
        position: relative;
        z-index: 1;
        span {
            display: inline-block;
            width: 100%;
            height: 100%;
            text-align: center;
            box-sizing: border-box;
            position: relative;
            &:before {
                content: '';
                position: absolute;
                background: url('../../img/square.png') center center no-repeat;
                background-size: 12px 12px;
                width: 12px;
                height: 12px;
                top: 20px;
                left: 20px;
            }
            &:after {
                content: '';
                position: absolute;
                background: url('../../img/square.png') center center no-repeat;
                background-size: 12px 12px;
                width: 12px;
                height: 12px;
                top: 20px;
                right: 20px;
            }
        }
    }
    .formbody {
        width: 320px;
        height: 230px;
        background: white;
        box-sizing: border-box;
        padding: 12px 25px 25px;
        //margin: 250px auto 450px;
        border-radius: 5px;
        position: fixed;
        z-index: 3;
        top:50%;
        left: 50%;
        margin-left: -160px;
        margin-top: -130px;
        &:before {
            content: '';
            position: absolute;
            top: -20px;
            right: -60px;
            background: url('../../img/star.png') center center no-repeat;
            background-size: 30px 50px;
            width: 30px;
            height: 50px;
        }
        p {
            width: 100%;
            line-height: 35px;
            color: #FF8100;
            font-size: 22px;
            text-align: center;
            margin-bottom: 10px;
        }
        form {
            .el-form-item {
                margin-bottom: 18px;
            }
            .el-button--primary {
                width: 100%;
                color: #fff;
                background-color: #FF8100;
                border-color: #FF8100;
            }
        }
    }
}


/* 小屏幕（平板，大于等于 768px） */

@media (min-width: 320px) {
    .formbody {
        margin: 100px auto 160px;
    }
}

/* 小屏幕（平板，大于等于 768px） */

@media (min-width: 768px) {
    .formbody {
        margin: 220px auto 450px;
    }
}
</style>
