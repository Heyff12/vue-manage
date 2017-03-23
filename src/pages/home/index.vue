<template>
    <div>
        <div class="right_head">
            昨日数据
        </div>
        <div class="home_body">
            <el-row :gutter="30">
                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                    <dl class="home_dl">
                        <dt>交易数据</dt>
                        <dd><span class="data_span">{{trade_money}}</span>元</dd>
                    </dl>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                    <dl class="home_dl dl_two">
                        <dt>新入网商户数</dt>
                        <dd><span class="data_span">{{new_merchants}}</span>个</dd>
                    </dl>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                    <dl class="home_dl dl_three">
                        <dt>净收入</dt>
                        <dd><span class="data_span">{{income}}</span>元</dd>
                    </dl>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                    <dl class="home_dl dl_four">
                        <dd v-for="bank in banks">
                            <img src="../../img/logo.png"><span class="grey">{{ bank.name }}</span><span class="grey">{{ (bank.price/100).toFixed(0) }}元</span>
                        </dd>
                    </dl>
                </el-col>
            </el-row>
        </div>
        <div class="home_body_b">
            <div class="line_pic">
                <p class="title">实时交易折线图</p>
                <div class="select">
                    <el-select v-model="select_date" placeholder="请选择日期" v-on:change="change_date">
                        <el-option v-for="month in month_data" :label="month" :value="month">
                        </el-option>
                    </el-select>
                </div>
                <div class="line_body" id="trade_pic"></div>
            </div>
            <div class="line_pic">
                <p class="title title2">业务员业务统计折线图</p>
                <div class="line_body" id="salesman_pic"></div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'

export default {
    name: 'home',
    data() {
        return {
            trade_money: 19863.05, //渠道管理展示true，失效false
            new_merchants: 34, //商户管理展示true，失效false
            income: 88888.88,
            banks: [], //排行榜
            trade: null, //交易折线图
            salesman: null, //业务员折线图
            trade_data: [], //交易折线图数据
            salesman_data: [], //业务员折线图数据--------以下为折线需要的公共数据
            day_data: [], //x轴日期区间
            nowYear: '', //当前年份
            nowMonth: '', //当前月份
            nowDate: '', //当前日期
            start_rate: '', //开始起点x轴
            end_rate: '', //结束点x轴
            month_data: [], //筛选日期数组
            select_date: '', //帅选的日期
        }
    },
    created() {
        this.set_banks(); //获取排行
        this.nowdate_get(); //获取年月日
        this.get_trade(); //设置交易折线图
        this.get_salesman(); //设置业务员折线图
        // setTimeout(() => {
        //     this.trade_line();
        //     this.salesman_line();
        // }, 0);//设置成异步执行才能获取id元素
    },
    methods: {
        trade_line: function() {
            // 基于准备好的dom，初始化echarts实例
            let _this = this;
            _this.trade = echarts.init(document.getElementById('trade_pic'));
            // 绘制图表
            _this.trade.setOption({
                title: {
                    text: '',
                    show: false,
                },
                tooltip: {},
                dataZoom: [{
                    type: 'slider',
                    start: _this.start_rate,
                    end: _this.end_rate
                }],
                xAxis: {
                    name: '时间',
                    data: _this.day_data,
                },
                yAxis: {
                    name: '金额',
                    type: 'value',
                },
                series: [{
                    name: '交易额',
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.trade_data
                }]
            });
        },
        salesman_line: function() {
            // 基于准备好的dom，初始化echarts实例
            let _this = this;
            _this.salesman = echarts.init(document.getElementById('salesman_pic'));
            // 绘制图表
            _this.salesman.setOption({
                title: {
                    text: '',
                    show: false,
                },
                tooltip: {},
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: _this.salesman_data
                }]
            });
        },
        //获取排行数据
        set_banks: function() {
            let _this = this;
            _this.banks = [{
                name: '大通冰室',
                price: 678800,
            }, {
                name: '张亮麻辣烫',
                price: 556600,
            }, {
                name: '大通冰室',
                price: 223300,
            }];
        },
        //获取交易数据
        get_trade: function() {
            let _this = this;
            _this.trade_data = [50, 250, 660, 1000, 400, 2000, 50, 250, 660, 1000, 400, 2000, 50, 250, 660, 1000, 400, 2000, 50, 250, 660, 1000, 400, 2000, 50, 250, 660, 1000, 250, 660, 1000];
            setTimeout(() => {
                this.trade_line();
            }, 0);
        },
        //获取交易数据
        get_salesman: function() {
            let _this = this;
            _this.salesman_data = [5, 20, 36, 10, 10, 20];
            setTimeout(() => {
                this.salesman_line();
            }, 0);
        },
        //获取当前年月日
        nowdate_get: function() {
            let now = new Date();
            this.nowYear = now.getFullYear();
            this.nowMonth = now.getMonth() + 1;
            this.nowDate = now.getDate();
            this.select_date = this.nowYear + '-' + this.nowMonth;
            this.day_data = this.day_get(this.nowYear, this.nowMonth);
            this.month_data = this.month_get(this.nowYear, this.nowMonth, 2);
        },
        //根据选项修改x周时间数据
        change_date() {
            let _this = this;
            let year = _this.select_date.split('-')[0];
            let month = _this.select_date.split('-')[1];
            this.day_data = this.day_get(year, month);
            setTimeout(() => {
                this.trade_line();
            }, 0);
        },
        //获取月份数组
        month_get: function(year, month, count) {
            let arr = [];
            for (let i = month; i >= 1; i--) {
                let mon = year + '-' + i;
                // let mon = {
                //     'value': year + '-' + i
                // };
                arr.push(mon);
            }
            if (count >= 1) {
                for (let i = 1; i < count; i++) {
                    let year_p = year - i;
                    for (let j = 12; j >= 1; j--) {
                        let mon = year_p + '-' + j;
                        // let mon = {
                        //     'value': year_p + '-' + j
                        // };
                        arr.push(mon);
                    }
                }
            }
            return arr;
        },
        //获取日期数组
        day_get: function(year, month) {
            if (/^3|5|7|8|10|12$/.test(month)) {
                return this.formatDate(month, 31);
            } else if (/^4|6|9|11$/.test(month)) {
                return this.formatDate(month, 30);
            } else if (/^1$/.test(month)) {
                return this.formatDate(month, 31);
            } else if (/^2$/.test(month)) {
                if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                    return this.formatDate(month, 29);
                } else {
                    return this.formatDate(month, 28);
                }
            } else {
                throw new Error('month is illegal');
            }
        },
        //获取当月日期
        formatDate: function(month, count) {
            let scroll_rate = (this.nowDate * 100 / count).toFixed(0);
            this.rate_area(scroll_rate);
            let arr = [];
            for (let i = 1; i <= count; i++) {
                let day = month + '-' + i;
                arr.push(day);
            }
            return arr;
        },
        //设置显示区间
        rate_area(now_rate) {
            let _this = this;
            if (now_rate - 25 <= 0) {
                _this.start_rate = 0;
                _this.end_rate = 50;
            } else if (now_rate + 25 >= 100) {
                _this.start_rate = 50;
                _this.end_rate = 100;
            } else {
                _this.start_rate = now_rate - 25;
                _this.end_rate = now_rate + 25;
            }
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
@import "../../css/common/const";
// .manage_body {
//     padding-left: 250px;
//     div.header {
//         display: block;
//     }
//     .main_main .manage_head {
//         display: block;
//     }
// }

.home_body_b {
    width: 100%;
    box-sizing: border-box;
    padding: 0px 50px 30px 50px;
}

dl.home_dl {
    width: 100%;
    padding: 25px 10px;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 38px;
    background: white;
    box-shadow: 0 2px 6px 0 rgb(202, 202, 202, 1);
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    margin: 10px 0;
    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: @green;
    }
    &.dl_two:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: @pink;
    }
    &.dl_three:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: @syan;
    }
    dt {
        text-align: center;
        font-size: 18px;
    }
    dd {
        text-align: center;
        color: @orange;
        span.data_span {
            padding-right: 6px;
            font-size: 26px;
        }
    }
    &.dl_four {
        padding: 20px 0px;
        &:before {
            display: none;
        }
        dd {
            text-align: left;
            line-height: 30px;
            background: url('@{images}/band1.png') left center no-repeat;
            background-size: auto 20px;
            padding-left: 60px;
            &:nth-child(2) {
                background: url('@{images}/band2.png') left center no-repeat;
                background-size: auto 20px;
            }
            &:nth-child(3) {
                background: url('@{images}/band3.png') left center no-repeat;
                background-size: auto 20px;
            }
            span {
                padding-left: 10px;
            }
            img {
                width: 20px;
                height: 20px;
                border-radius: 100%;
                vertical-align: middle;
            }
        }
    }
}

.line_pic {
    width: 100%;
    background: white;
    padding: 10px 0;
    box-sizing: border-box;
    height: auto;
    min-height: 248px;
    text-align: left;
    margin-bottom: 30px;
    border-radius: 6px;
    position: relative;
    p.title {
        width: 100%;
        padding-left: 15px;
        line-height: 30px;
        font-size: 16px;
        position: relative;
        box-sizing: border-box;
        &:before {
            content: '';
            position: absolute;
            left: 0;
            width: 3px;
            height: 16px;
            background: @orangebg_color;
            top: 7px;
        }
        &.title2:before {
            content: '';
            background: @blue;
        }
    }
    .select {
        text-align: right;
        width: 100%;
        padding-right: 30px;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
    }
    .line_body {
        width: 100%;
        height: auto;
        min-height: 200px;
        padding: 10px 30px;
        box-sizing: border-box;
        margin-top: -30px;
    }
}
</style>
