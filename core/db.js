const Sequelize = require('sequelize');
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
    },
});

sequelize.sync(); //必须加上 这个代码 才会触发模型的创建
// sequelize.sync({force:true});  开发环境 可以 加上 但是 如果 生产环境 或者已经 有数据了 会很危险的 这个是强制被删除表 重新 创建数据

module.exports ={
    sequelize
}

//开始创建模型了