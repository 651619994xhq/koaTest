const {Sequelize,Model} = require('sequelize');
const {unset,clone,isArray} =require('lodash')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

//1.dbName  , 2.user  3. password 4.{}
const  sequelize = new Sequelize(dbName,user,password,{
    dialect:'mysql',  //数据库类型
    host,
    port,
    // logging:true,
    timezone: '+08:00',  //用北京时间
    define:{
       timestamps: true, //去掉2个默认字段  create_time update_time
       paranoid: true,   //deleted_time
       // createdAt:'created_time', //替换 默认字段
       // deletedAt:'deleted_time',
       // updatedAt:'updated_time',
       underscored:true, //把所有的 驼峰转换成 下滑线
       scopes:{  //也可以写在单个model上，写在这里 就是搞成全局
           bh:{
               attributes:{
                   exclude:['created_at','deleted_at','updated_at','createdAt','deletedAt','updatedAt']  //排除这3个字段
               }
           }
       }
    },
});

sequelize.sync(); //必须加上 这个代码 才会触发模型的创建
// sequelize.sync({force:true});  开发环境 可以 加上 但是 如果 生产环境 或者已经 有数据了 会很危险的 这个是强制被删除表 重新 创建数据


Model.prototype.toJSON = function(){
    let data = clone(this.dataValues);
    unset(data,'created_at');
    unset(data,'updated_at');
    unset(data,'deleted_at');
    unset(data,'deletedAt');
    unset(data,'updatedAt');
    unset(data,'createdAt');

    //这个比较特殊化 暂时只能用这个了
    for(key in data){
        if(key === 'image'){
            if(!data[key].startsWith('http')){
                data[key]=global.config.host + data[key];
            }

        }
    }
    //exclude  排除  //添加上模型的方法
    if(isArray(this.exclude)){
        this.exclude.forEach((value)=>{
            unset(data,value)
        });
    }
    return data;
}
module.exports ={
    sequelize
}

//开始创建模型了


//数据库 scope 是个很好的东西 可以排除很多数据

//钩子最大的好处，就是解耦程序


//静态资源应该放在什么位置   图片 消耗流量
//1.最简单最常见的是 放在项目中 这样会污染代码
//2.静态资源服务器 微服务  可以在放一个koa  只有koa-static 这个项目放在宁一台机器上
//3.云服务 oss 贵 ECS RDS ,OSS ，CDN
//4.github gitpage 300mb 一般个人开发者可以使用


//js css html
//vue/react 前端单页面(可以看到静态资源)可以放在cdn上
//不包括nuxt ssr
//服务端渲染 php java
//vue react 网站，SEO TO C 网站 绝大数网站 还是用的老牌服务端渲染，因为vue react 不支持sso
//cms 内部SEO
//webapp h5


