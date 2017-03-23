<template>
    <div>
        <div class="right_head">
            业务员信息列表
        </div>
        <div class="right_body">
            <el-form label-width="110px" class="demo-ruleForm">
                <el-row :gutter="30">
                    <el-col :xs="24" :sm="24" :md="12" :lg="4">
                        <el-form-item label="业务员编号：">
                            <el-input v-model.trim="searchkey.slsm_uid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="4">
                        <el-form-item label="业务员名称：">
                            <el-input v-model.trim="searchkey.slsm_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="4">
                        <el-form-item label="手机号：">
                            <el-input v-model.trim="searchkey.slsm_mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="4">
                        <el-form-item label="业务员状态：">
                            <el-select v-model="searchkey.slsm_status" placeholder="请选择业务员状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="在职" value="0"></el-option>
                                <el-option label="离职" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="4">
                        <el-form-item label-width="0" class="t_c">
                            <!-- <el-button type="default" @click="fresh_sub">刷新</el-button> -->
                            <el-button type="primary" @click="search_sub">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="salesmen_now" border stripe style="width: 100%">
                    <el-table-column prop="slsm_uid" label="业务员编号" resizable min-width="80px">
                    </el-table-column>
                    <el-table-column prop="slsm_name" label="业务员名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="slsm_mobile" label="手机号" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="slsm_status" label="业务员状态" resizable>
                        <template scope="scope">
                            <span v-if="scope.row.slsm_status">离职</span>
                            <span v-else>在职</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="join_dtm" label="注册时间" resizable min-width="170px">
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px">
                        <template scope="scope">
                            <el-button type="info" @click="open_dialog(scope.row.slsm_uid)">业务统计</el-button>
                        </template>
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
        <el-dialog title="" v-model="dialogslsm">
            <h1 class="dialog_h1">业务员姓名：{{saleman.slsm_name}}</h1>
            <el-table :data="saleman.monthly">
                <el-table-column align="center" property="date" label="月份" resizable min-width="100px"></el-table-column>
                <el-table-column align="center" property="mchnt_count" label="发展商户数" resizable min-width="100px"></el-table-column>
                <el-table-column align="center" property="audit_succ" label="审核成功" resizable min-width="100px"></el-table-column>
                <el-table-column align="center" property="audit_fail" label="审核失败" resizable min-width="100px"></el-table-column>
                <el-table-column align="center" property="audit_reject" label="审核拒绝" resizable min-width="100px"></el-table-column>
                <el-table-column align="center" property="trade_amt" label="交易金额" resizable min-width="100px">
                    <template scope="scope">
                        {{scope.row.trade_amt | yuan}}
                    </template>
                </el-table-column>
            </el-table>
            <p class="dialog_p">
                合计：发展商户{{saleman.total.mchnt_count}}个；审核成功{{saleman.total.audit_succ}}个；审核失败{{saleman.total.audit_fail}}个；审核拒绝{{saleman.total.audit_reject}}个；交易金额{{saleman.total.trade_amt | yuan}}元。
            </p>
        </el-dialog>
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
            dialogslsm: false, //业务员信息弹框默认不显示
            searchkey: {
                slsm_uid: '',
                slsm_name: '',
                slsm_mobile: '',
                slsm_status: '',
            },
            salesmen: [],
            slsm_url: location.protocol + '//' + location.host + '/qudao/v1/api/slsm/list', //获取业务员列表 
            slsm_stat_url: location.protocol + '//' + location.host + '/qudao/v1/api/slsm/', //获取业务员统计信息          
            pages_all: 0, //总信息数
            page_per: 20, //每页信息数
            page_now: 1, //当前页数
            pages: 1, //总页数
            salesmen_mid: [], //搜索后的总信息
            salesmen_now: [], //当前展示信息
            saleman: {
                "slsm_name": "",
                "total": {
                    "mchnt_count": 0, // 发展商户数
                    "audit_succ": 0, // 审核成功数
                    "audit_fail": 0, // 审核失败数
                    "audit_reject": 0, // 审核拒绝数
                    "trade_amt": 0, // 总交易金额
                },
                "monthly": [{
                    "date": "", // 年月
                    "mchnt_count": 0, // 发展商户数
                    "audit_succ": 0, // 审核成功数
                    "audit_fail": 0, // 审核失败数
                    "audit_reject": 0, // 审核拒绝数
                    "trade_amt": 0, // 总交易金额
                }]
            }, //单个业务员信息
        }
    },
    created: function() {
        this.get_list(); //获取商户列表 
    },
    // filters: {
    //     yuan: function(value) {
    //         if (!value) return ''
    //         return (value / 100).toFixed(2)
    //     }
    // },
    watch: {
        // salesmen_mid: function(val, oldVal) {
        //     var _this = this;
        //     _this.pages_all = _this.salesmen_mid.length;
        //     _this.page_now = 1;
        //     _this.salesmen_now = _this.salesmen_mid.slice(0, _this.page_now * _this.page_per);
        // },
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
        //获取业务员列表
        get_list: function() {
            let _this = this;
            let post_data = {
                'page': _this.page_now,
                'page_size': _this.page_per,
                'slsm_uid': _this.searchkey.slsm_uid,
                'slsm_name': _this.searchkey.slsm_name,
                'slsm_mobile': _this.searchkey.slsm_mobile,
                'slsm_status': _this.searchkey.slsm_status,
            };
            this.$http.get(this.slsm_url, {
                    'params': post_data,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        // _this.salesmen = data_return.data;
                        // _this.salesmen_mid = _this.salesmen;
                        // _this.pages_all = _this.salesmen_mid.length;
                        // _this.salesmen_now = _this.salesmen_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
                        _this.pages_all = data_return.data.slsm_cnt;
                        _this.salesmen_now = data_return.data.slsm_infos;
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
        //提交查询
        search_sub: function() {
            // var _this = this;
            // _this.salesmen_mid = [];
            // var key_userid = this.searchkey.slsm_uid;
            // var key_name = this.searchkey.slsm_name;
            // var key_mobile = this.searchkey.slsm_mobile;
            // var key_status = this.searchkey.slsm_status;
            // for (let i = 0; i < _this.salesmen.length; i++) {
            //     let userid = _this.salesmen[i].slsm_uid.toString();
            //     let name = _this.salesmen[i].slsm_name;
            //     let mobile = _this.salesmen[i].slsm_mobile;
            //     let status = _this.salesmen[i].slsm_status.toString();
            //     if (userid.indexOf(key_userid) != '-1' && name.indexOf(key_name) != '-1' && mobile.indexOf(key_mobile) != '-1' && status.indexOf(key_status) != '-1') {
            //         _this.salesmen_mid.push(_this.salesmen[i]);
            //     }
            // }
            // return _this.salesmen_mid;
            this.get_list();
        },
        //清空并刷新---更改成ajax，取消使用
        fresh_sub: function() {
            var _this = this;
            _this.searchkey = {
                slsm_uid: '',
                slsm_name: '',
                slsm_mobile: '',
                slsm_status: '',
            }; //清空搜索内容
            _this.page_now = 1; //页数回到第一页
            _this.get_list(); //获取最新列表
        },
        //打开弹框
        open_dialog(id) {
            let _this = this;
            let slsm_id = id;
            this.$http.get(this.slsm_stat_url + slsm_id + '/stat', {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.saleman = data_return.data;
                        _this.dialogslsm = true; //打开弹框
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
            // _this.dialogslsm = true; //打开弹框
            // _this.saleman = {
            //     "slsm_name": "姓名",
            //     "total": {
            //         "mchnt_count": 10, // 发展商户数
            //         "audit_succ": 5, // 审核成功数
            //         "audit_fail": 3, // 审核失败数
            //         "audit_reject": 2, // 审核拒绝数
            //         "trade_amt": 123456, // 总交易金额
            //     },
            //     "monthly": [{
            //         "date": "2016-12", // 年月
            //         "mchnt_count": 10, // 发展商户数
            //         "audit_succ": 5, // 审核成功数
            //         "audit_fail": 3, // 审核失败数
            //         "audit_reject": 2, // 审核拒绝数
            //         "trade_amt": 123456, // 总交易金额
            //     }]
            // };
        },
        //更改每页显示信息条数
        handleSizeChange(val) {
            let _this = this;
            //console.log(`每页 ${val} 条`);
            _this.page_per = val;
            _this.page_now = 1;
            // _this.salesmen_now = _this.salesmen_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            this.get_list();
        },
        //获取当前页信息
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            let _this = this;
            _this.page_now = val;
            // _this.salesmen_now = _this.salesmen_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            this.get_list();
        },
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.salesmen = [{
                "slsm_uid": 789, // 业务员编号
                "slsm_name": "李四", // 业务员名称
                "slsm_mobile": "14401234567", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 345, // 业务员编号
                "slsm_name": "糊糊", // 业务员名称
                "slsm_mobile": "12201234567", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 33333, // 业务员编号
                "slsm_name": "赵六", // 业务员名称
                "slsm_mobile": "18896587458", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 667777, // 业务员编号
                "slsm_name": "田七", // 业务员名称
                "slsm_mobile": "14785696632", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2016-012-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 23322, // 业务员编号
                "slsm_name": "和", // 业务员名称
                "slsm_mobile": "13333333333", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 11111, // 业务员编号
                "slsm_name": "水电费", // 业务员名称
                "slsm_mobile": "145678888888", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 220778, // 业务员编号
                "slsm_name": "水电费", // 业务员名称
                "slsm_mobile": "1999998888", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 2430756, // 业务员编号
                "slsm_name": "顺丰到付", // 业务员名称
                "slsm_mobile": "16665554443", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-012-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 789, // 业务员编号
                "slsm_name": "李四", // 业务员名称
                "slsm_mobile": "14401234567", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 345, // 业务员编号
                "slsm_name": "糊糊", // 业务员名称
                "slsm_mobile": "12201234567", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 33333, // 业务员编号
                "slsm_name": "赵六", // 业务员名称
                "slsm_mobile": "18896587458", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 667777, // 业务员编号
                "slsm_name": "田七", // 业务员名称
                "slsm_mobile": "14785696632", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2016-012-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 23322, // 业务员编号
                "slsm_name": "和", // 业务员名称
                "slsm_mobile": "13333333333", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 11111, // 业务员编号
                "slsm_name": "水电费", // 业务员名称
                "slsm_mobile": "145678888888", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 220778, // 业务员编号
                "slsm_name": "水电费", // 业务员名称
                "slsm_mobile": "1999998888", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 2430756, // 业务员编号
                "slsm_name": "顺丰到付", // 业务员名称
                "slsm_mobile": "16665554443", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-012-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 789, // 业务员编号
                "slsm_name": "李四", // 业务员名称
                "slsm_mobile": "14401234567", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 345, // 业务员编号
                "slsm_name": "糊糊", // 业务员名称
                "slsm_mobile": "12201234567", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 33333, // 业务员编号
                "slsm_name": "赵六", // 业务员名称
                "slsm_mobile": "18896587458", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 667777, // 业务员编号
                "slsm_name": "田七", // 业务员名称
                "slsm_mobile": "14785696632", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2016-012-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 23322, // 业务员编号
                "slsm_name": "和", // 业务员名称
                "slsm_mobile": "13333333333", // 手机号
                "slsm_status": 0, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 11111, // 业务员编号
                "slsm_name": "水电费", // 业务员名称
                "slsm_mobile": "145678888888", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 220778, // 业务员编号
                "slsm_name": "水电费", // 业务员名称
                "slsm_mobile": "1999998888", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2017-02-01 00:00:00" // 注册时间
            }, {
                "slsm_uid": 2430756, // 业务员编号
                "slsm_name": "顺丰到付", // 业务员名称
                "slsm_mobile": "16665554443", // 手机号
                "slsm_status": 1, // 0在职, 1离职
                "join_dtm": "2016-012-01 00:00:00" // 注册时间
            }];
            _this.salesmen_mid = _this.salesmen;
            _this.pages_all = _this.salesmen_mid.length;
            _this.salesmen_now = _this.salesmen_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
h1.dialog_h1 {
    width: auto;
    display: block;
    text-align: conter;
    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
    padding: 0;
    position: relative;
    top: -26px;
    position: relative;
    z-index: -1;
}

p.dialog_p {
    line-height: 35px;
    margin-top: 20px;
    text-align: center;
}
</style>
