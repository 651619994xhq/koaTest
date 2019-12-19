const Router = require('koa-router');
const router = new Router();
const {HttpException,ParameterException} = require('../../../core/http-exception');
const {PositiveIntegerValidator} =require('../../validators/validators');
//传参方式 1.在路径中传参/v1/${param}/book/latest 2.在path /v1/book/latest?param=...
          //3.在header
          //4.body 只有在post 才能获取到
router.post('/v1/:id/book/latest',(ctx,next)=>{
    const path=ctx.params;
    const query= ctx.request.query;
    const header=ctx.request.header;
    const body=ctx.request.body;

    //LinValidator;
    const v = new PositiveIntegerValidator().validate(ctx);  //校验器
    const id=v.get('path.id',parsed=false);
    const v_id=v.get('body.d.e.c',parsed=false); //不会报错
    console.log('id==>',id)

    // if(true){
    //     //动态 面向对象
    //   // const error = new Error('为什么错误')
    //   //       error.errorCode = 10001;
    //   //       error.status = 400;
    //   //       error.requestUrl =  `${ctx.method} ${ctx.path}`;
    //   //       throw error;
    //   //   const error = new ParameterException();
    //     // error.requestUrl = `${ctx.method} ${ctx.path}`;
    //     const error = new global.errs.ParameterException();
    //     throw error;
    //
    // }


    ctx.body={
        key:'book'
    }
    // KOA 中间件 1.全局监听异常 2.输出一段有意义的信息

    //异常处理，异常处理的应用
});
module.exports=router

//user
//部分 通用性 针对小程序
// 账号 密码 附属信息：昵称 email 手机
//注册 登录

//API 流程
// 用户 --> api  --> model --> mysql --> koa  -- 用户

// 关系型数据库 1。SQL （CRUD）增删改查   2。ORM(通过对象操作数据库)
// 1. oracle 2. mysql 3. postgresSql Access

// 非关系型数据库
// redis(主要用来做缓存)（key:value）  mongoDB（文档型）

//持久存储数据 持久化

//xampp  navicat for mysql
//如何使用代码自动生成表

//Sequelize 链接数据库 配置数据库的参数

