const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/book'
});
const {HttpException,ParameterException} = require('../../../core/http-exception');
const {PositiveIntegerValidator,SearchValidator,AddShortCommentValidator} =require('../../validators/validators');
const {Auth} =require('@middlewares/auth');
const {HotBook} =require('@models/hot-book');
const {Book} =require('@models/book');
const {Favor} =require('@models/favor');
const {Comment} = require('@models/book-comment');
const {success} =require('@lib/helper');
//传参方式 1.在路径中传参/v1/${param}/book/latest 2.在path /v1/book/latest?param=...
          //3.在header
          //4.body 只有在post 才能获取到
// router.post('/v1/:id/book/latest',(ctx,next)=>{
//     const path=ctx.params;
//     const query= ctx.request.query;
//     const header=ctx.request.header;
//     const body=ctx.request.body;
//
//     //LinValidator;
//     const v = new PositiveIntegerValidator().validate(ctx);  //校验器
//     const id=v.get('path.id',parsed=false);
//     const v_id=v.get('body.d.e.c',parsed=false); //不会报错
//     console.log('id==>',id)
//
//     // if(true){
//     //     //动态 面向对象
//     //   // const error = new Error('为什么错误')
//     //   //       error.errorCode = 10001;
//     //   //       error.status = 400;
//     //   //       error.requestUrl =  `${ctx.method} ${ctx.path}`;
//     //   //       throw error;
//     //   //   const error = new ParameterException();
//     //     // error.requestUrl = `${ctx.method} ${ctx.path}`;
//     //     const error = new global.errs.ParameterException();
//     //     throw error;
//     //
//     // }
//
//
//     ctx.body={
//         key:'book'
//     }
//     // KOA 中间件 1.全局监听异常 2.输出一段有意义的信息
//
//     //异常处理，异常处理的应用
// });


//图书基础数据 服务的形式
//API/项目
//公用型 API 公开

//nodejs 中间层
//微服务

//book 数据库表
//业务 图书业务数据
router.post('/hot_list',new Auth().m,async ctx=>{
    let books=await HotBook.getAll()
    ctx.body=books;

});

router.post('/detail',new Auth().m,async ctx=>{
    const v=await new PositiveIntegerValidator().validate(ctx);
    // let books=await HotBook.getAll()
    // ctx.body=books;
    const book = new Book(v.get('body.id'))
    ctx.body=await book.detail();

});

/**
 * 图书搜索
 */
router.get('/search',new Auth().m,async ctx=>{
    const v=await new SearchValidator().validate(ctx);
    const q=v.get('query.q'),start=v.get('query.start'),count=v.get('query.count');
    const result =await Book.searchFromYuShu(q,start,count);
    ctx.body = result;
});

router.get('/favor/count',new Auth().m,async ctx=>{
    const count =await Book.getMyFavorBookCount(ctx.auth.uid);
    ctx.body = {
        count
    };
});

router.get('/:book_id/favor',new Auth().m,async ctx=>{
    const v =await new PositiveIntegerValidator().validate(ctx,{
        id:'book_id'
    });
    const favor=await Favor.getBookFavor(ctx.auth.uid,v.get('path.book_id'))
    ctx.body = favor
});

router.post('/add/short_comment',new Auth().m,async ctx=>{
    const v =await new AddShortCommentValidator().validate(ctx,{
        id:'book_id'
    });
    await Comment.addComment(v.get('body.book_id'),v.get('body.content'));
    success();
});

router.get('/:book_id/short_comment',new Auth().m,async ctx=>{
    const v =await new PositiveIntegerValidator().validate(ctx,{
        id:'book_id'
    });
    // let shortComment=await Comment.findOne({
    //     where:{
    //         book_id:v.get('path.book_id')
    //     }
    // });
    let shortComments = await Comment.getComments(v.get('path.book_id'));
    // console.log('shortComments==>',shortComments);
    ctx.body=shortComments;
});


//爬虫 必备工具 数据处理和分析
//KOA
//Python 爬虫工具 requests BF4 Scrapy
//nodejs 正则表达式

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

