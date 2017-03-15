<template>
    <div>
        <div class="right_head">
            商户信息列表
        </div>
        <div class="right_body">
            <el-form label-width="110px" class="demo-ruleForm">
                <el-row :gutter="30">
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道编号：">
                            <el-input v-model.trim="searchkey.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道名称：">
                            <el-input v-model.trim="searchkey.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="时间区间：">
                            <el-date-picker v-model="searchkey.daterange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions" :editable="false" @change="time_change">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="商户编号：">
                            <el-input v-model.trim="searchkey.userid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="商户名称：">
                            <el-input v-model.trim="searchkey.shopname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="手机号：">
                            <el-input v-model.trim="searchkey.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label-width="0" class="t_c">
                            <!-- <el-button type="default" @click="fresh_sub">刷新</el-button> -->
                            <el-button type="primary" @click="search_sub">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="merchants_now" border stripe style="width: 100%">
                    <el-table-column prop="qd_info.base.userid" label="渠道编号" resizable min-width="80px">
                    </el-table-column>
                    <el-table-column prop="qd_info.base.name" label="渠道名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="userid" label="商户编号" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="shopname" label="商户名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="name" label="法人名称" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="mobile" label="电话" resizable min-width="130px">
                    </el-table-column>
                    <!-- <el-table-column prop="state" label="商户状态" resizable>
                        <template scope="scope">
                            <span v-if="scope.row.state">停用</span>
                            <span v-else>正常</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="jointime" label="注册时间" resizable min-width="170px">
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px">
                    </el-table-column>
                </el-table>
            </template>
            <div class="block t_r mar_t20">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_now" :page-sizes="[20,50,100,200,250]" :page-size="page_per" layout="total, sizes, prev, pager, next" :total="pages_all">
                </el-pagination>
            </div>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
export default {
    name: 'merchant_index',
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            searchkey: {
                id: '',
                name: '',
                userid: '',
                shopname: '',
                mobile: '',
                stime: '',
                etime: '',
                daterange: '',
            },
            merchants: [],
            list_url: location.protocol + '//' + location.host + '/qudao/v1/api/mchnt/list', //获取商户列表            
            pages_all: 0, //总信息数
            page_per: 20, //每页信息数
            page_now: 1, //当前页数
            pages: 1, //总页数
            merchants_mid: [], //搜索后的总信息
            merchants_now: [], //当前展示信息
            pickerOptions: {
                disabledDate: (time) => time.getTime() > Date.now(),
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    created: function() {
        this.get_list(); //获取商户列表 
    },
    watch: {
        merchants_mid: function(val, oldVal) {
            var _this = this;
            _this.pages_all = _this.merchants_mid.length;
            _this.page_now = 1;
            _this.merchants_now = _this.merchants_mid.slice(0, _this.page_now * _this.page_per);
        },
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
        //获取商户列表
        get_list: function() {
            let _this = this;
            let post_data = {
                'page': _this.page_now,
                'page_size': _this.page_per,
                'mchnt_uid': _this.searchkey.userid,
                'mchnt_name': _this.searchkey.shopname,
                'mchnt_mobile': _this.searchkey.mobile,
                'mchnt_s_join_dtm': _this.searchkey.stime,
                'mchnt_e_join_dtm': _this.searchkey.etime,
                'qd_uid': _this.searchkey.id,
                'qd_name': _this.searchkey.name,
                'qd_status': _this.searchkey.slsm_uid,
            };
            this.$http.get(this.list_url, {
                    'params': post_data,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        // _this.merchants = data_return.data;
                        // _this.merchants_mid = _this.merchants;
                        // _this.pages_all = _this.merchants_mid.length;
                        // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
                        _this.pages_all = data_return.data.mchnt_cnt;
                        _this.merchants_now = data_return.data.mchnt_infos;
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
            //列表测试数据--仅供测试
            //_this.getdata_test();
        },
        //时间变化
        time_change(val) {
            if (val.length == 0) {
                this.searchkey.stime = '';
                this.searchkey.etime = '';
            } else {
                let timerange = val.split(' - ');
                this.searchkey.stime = timerange[0] + ' 00:00:00';
                this.searchkey.etime = timerange[1] + ' 23:59:59';
            }
        },
        //提交查询
        search_sub: function() {
            // var _this = this;
            // _this.merchants_mid = [];
            // var key_id = this.searchkey.id;
            // var key_name = this.searchkey.name;
            // var key_userid = this.searchkey.userid;
            // var key_shopname = this.searchkey.shopname;
            // var key_mobile = this.searchkey.mobile;
            // var key_date = this.searchkey.daterange;
            // console.log(this.searchkey);
            // var key_stime = 0,
            //     key_etime = new Date().getTime();
            // if (key_date[0]) {
            //     var k_stime = _this.get_date(key_date[0]) + ' 00:00:00';
            //     var k_etime = _this.get_date(key_date[1]) + ' 23:59:59';
            //     key_stime = new Date(k_stime).getTime();
            //     key_etime = new Date(k_etime).getTime();
            // }
            // for (let i = 0; i < _this.merchants.length; i++) {
            //     let id = _this.merchants[i].qd_info.base.userid.toString();
            //     let name = _this.merchants[i].qd_info.base.name;
            //     let userid = _this.merchants[i].userid.toString();
            //     let shopname = _this.merchants[i].shopname;
            //     let mobile = _this.merchants[i].mobile;
            //     let jointime = new Date(_this.merchants[i].jointime).getTime();
            //     if (id.indexOf(key_id) != '-1' && name.indexOf(key_name) != '-1' && userid.indexOf(key_userid) != '-1' && shopname.indexOf(key_shopname) != '-1' && mobile.indexOf(key_mobile) != '-1' && key_etime >= jointime && jointime >= key_stime) {
            //         _this.merchants_mid.push(_this.merchants[i]);
            //     }
            // }
            // return _this.merchants_mid;
            this.get_list();
        },
        //清空并刷新--更改成ajax提交，取消使用
        fresh_sub: function() {
            var _this = this;
            _this.searchkey = {
                id: '',
                name: '',
                userid: '',
                shopname: '',
                mobile: '',
                stime: '',
                etime: '',
                daterange: '',
            }; //清空搜索内容
            _this.page_now = 1; //页数回到第一页
            _this.get_list(); //获取最新列表
        },
        get_date: function(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return year + '/' + month + '/' + day;
        },
        handleSizeChange(val) {
            let _this = this;
            //console.log(`每页 ${val} 条`);
            _this.page_per = val;
            _this.page_now = 1;
            // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            this.get_list();
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            let _this = this;
            _this.page_now = val;
            // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            this.get_list();
        },
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.merchants = [{
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道01", // 渠道名称
                        "short_name": "川01", // 渠道简称
                        "legal_name": "王二", // 法人姓名
                        "legal_idnumber": "511325197001013333", // 法人省份证号码
                        "province": "四川省", // 所在省份
                        "city": "成都市", // 所在城市
                        "address": "华阳", // 商户地址
                        "business_name": "李二", // 业务联系人姓名
                        "business_mobile": "13012340000", // 业务联系人手机号
                        "business_email": "lier@qfpay.com", // 业务联系人邮箱
                        "finace_name": "李二", // 财务联系人姓名
                        "finace_mobile": "13012340000", // 财务联系人手机号
                        "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                        "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                        "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                        "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                        "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "state": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
            }];
            _this.merchants_mid = _this.merchants;
            _this.pages_all = _this.merchants_mid.length;
            _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
// .el-date-editor--daterange.el-input {
//     /*width: 204px;*/
//     width: 70%;
// }
</style>
