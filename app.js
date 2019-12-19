const Koa = require('koa');
const parser = require('koa-bodyparser');//中间件 主要是获取客户端请求的body 参数
// const requireDirectory=require('require-directory');
// const Router = require('koa-router')
const InitManager = require('./core/init');
const catchError=require('./middlewares/exception'); //处理异常的中间件

//应用程序对象 中间件
const app = new Koa();
//中间件 从上到下一次执行
app.use(parser()); //注册中间件
app.use(catchError); //全局处理异常
InitManager.initCore(app);
app.listen(3000);

// //实现路由自动注册
// requireDirectory(module,'./app/api',{visit:(obj)=>{
//     //第三个回调 是 每次加载模块前 都会执行这个回调函数 通过回调 兼容router
//        if(obj instanceof Router){
//            app.use(obj.routes())
//        };
// }});
// console.log(module);
// const bookRouter = require('./api/v1/book');
// const classicRouter = require('./api/v1/classic');
// app.use(bookRouter.routes()) //启动路由
// app.use(classicRouter.routes()) //启动路由

// commonJS ES6 AMD  模块导入 3种方式
// ES10 import decorator class this.x=  这些node 不太支持
//babel es5 服务端 nodeJS 并不太友好
//TS Typescript 大型 超大型 维护 比较好
//Vue3.0
// 发送HTTP KOA 接收HTTP
//中间件 就是函数
//注册 中间件 通过use 进行注册
//编程 主题 拆分 文件
//数据类型

//api 版本 业务变动 客户端兼容性
//v1 v2 v3 可能最多只支持3个版本
//api 携带版本号
//1.路劲
//2.查询参数
//3.header
// router.get('/abc',(ctx,next)=>{
//     ctx.body = {key:'classci'}
// });

// router.get   查询数据
// router.post  新增数据
// router.put  REST 跟新数据
// router.delete 删除数据



// app.use( async (ctx,next)=>{
    //ctx 上下文 next 下一个中件间函数   洋葱模型
  // console.log('1');
  // await next();
  // const r=ctx.r;
  // console.log(ctx.path);
  // console.log(ctx.method)
  // console.log(ctx);
  //   ctx.body = {key:'clessc'};
  //await 1.等待 2.求值  表达式 仅仅promise
  // console.log(a)
  // a.then((res)=>{
  //    console.log(res);
  // });
  //   console.log('2');
// });
// app.use(async (ctx,next)=>{
//     // console.log('3');
//     const axios = require('axios');
//     const start=Date.now();
//     const res= await axios.get('http://7yue.pro');
//     ctx.r=res;
//     await next();
//     // console.log('4');
// });
//一个请求过来 从上倒下 依次执行 中间件函数

// app.listen(3000);

//为什么一定要保持 中间件 的洋葱模型 这样可以保持 context(上下文) 有值
//ctx 放在body 中 会自动序列化

//KOA 库 包 基本都是返回 封装好的promise
//promise 1.等待 2.求值
