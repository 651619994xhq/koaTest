const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/classic'
});
const {Flow} =require('../../models/flow');
const {Art} =require('../../models/art');

const {Auth} = require('../../../middlewares/auth')

// router.post('/latest',new Auth().m,async (ctx,next)=>{
router.post('/latest',async (ctx,next)=>{
    //index max
    //排序1，2，3，4，5，6...max
    const flow =await Flow.findOne({
        //index 倒叙
        order:[
            ['index','DESC']
        ]
    });

    const art=await Art.getData(flow.art_id,flow.type);
    // art.dataValues.index = flow.index; //可以用这个 js 动态 不严谨
    art.setDataValue('index',flow.index);
    ctx.body=art;
    //koa
    //序列化 对象 json
    //js 序列化 JSON
    //Class
});
module.exports=router

//权限 复杂
//限制 token  角色
//普通用户 管理员
//分级 scope
//普通用户 8  管理员16




//web 编程 写业务逻辑
//1.在API 接口编写
//2.在Model 分层
//mvc Model 是处理业务的地方

//业务分层  Model , Service
//Thinkphp Model Service Logic
//java Model DTO