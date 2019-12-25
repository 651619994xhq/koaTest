const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/classic'
});
const {Flow} =require('@models/flow');
const {Art} =require('@models/art');
const {Favor} = require('@models/favor');

const {Auth} = require('@middlewares/auth');

const {PositiveIntegerValidator,ClassicValidator} = require('@validators/validators');

// router.post('/latest',new Auth().m,async (ctx,next)=>{
router.post('/latest',new Auth().m,async (ctx,next)=>{
    //index max
    //排序1，2，3，4，5，6...max
    const flow =await Flow.findOne({
        //index 倒叙
        order:[
            ['index','DESC']
        ]
    });

    const art=await Art.getData(flow.art_id,flow.type);

    const likeLatest = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid);

    // art.dataValues.index = flow.index; //可以用这个 js 动态 不严谨
    art.setDataValue('index',flow.index);
    art.setDataValue('like_status',likeLatest);
    ctx.body=art;
    //koa
    //序列化 对象 json
    //js 序列化 JSON
    //Class
});

router.post('/:index/next',new Auth().m,async (ctx,next)=>{
    const v =await new PositiveIntegerValidator().validate(ctx,{
        id:'index'
    });
    const index = v.get('path.index');
    //如果只有一小段 不必要放在 model里 看个人
    const flow =await Flow.findOne({
        where:{
            index:index+1
        }
    });
    if(!flow){
        throw new global.errs.NotFound();
    }

    const art=await Art.getData(flow.art_id,flow.type);

    const likeNext = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid);

    // art.dataValues.index = flow.index; //可以用这个 js 动态 不严谨
    art.setDataValue('index',flow.index);
    art.setDataValue('like_status',likeNext);
    ctx.body=art;

});


router.post('/:index/previous',new Auth().m,async (ctx,next)=>{
    const v =await new PositiveIntegerValidator().validate(ctx,{
        id:'index'
    });
    const index = v.get('path.index');
    //如果只有一小段 不必要放在 model里 看个人
    const flow =await Flow.findOne({
        where:{
            index:index-1
        }
    });
    if(!flow){
        throw new global.errs.NotFound();
    }

    const art=await Art.getData(flow.art_id,flow.type);

    const likePrevious = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid);

    // art.dataValues.index = flow.index; //可以用这个 js 动态 不严谨
    art.setDataValue('index',flow.index);
    art.setDataValue('like_status',likePrevious);
    ctx.body=art;

});

/**
 * @type
 * @id
 */
router.post('/favor',new Auth().m,async ctx=>{
    const v=await new ClassicValidator().validate(ctx);
    const id=v.get('body.id'),type=v.get('body.type');
    const art =await Art.getData(id, type);
    if(!art){
        throw new global.errs.NotFound();
    }
    const like = await Favor.userLikeIt(id,type,ctx.auth.uid);

    ctx.body={
        fav_nums: art.fav_nums,
        like_status:like
    }

});

/**
 *
 *
 */
router.post('/favorList/',new Auth().m,async ctx=>{
    const uid =ctx.auth.uid;
    let list=await Favor.getMyClassicFavors(uid);
    ctx.body={list}


});

/**
 * 点赞详情
 */
router.post('/favor/detail',new Auth().m,async ctx=>{
    const v=await new ClassicValidator().validate(ctx);
    const id=v.get('body.id'),type=v.get('body.type');
    // const art =await Art.getData(id, type);
    // if(!art){
    //     throw new global.errs.NotFound();
    // }
    // const like = await Favor.userLikeIt(id,type,ctx.auth.uid);
    // art.setDataValue('like_status',like);
    const artDetail =await new Art(id,type).getDetail(ctx.auth.uid); //在这里运行实例方法
    artDetail.art.setDataValue('like_status',artDetail.like_status)
    ctx.body=artDetail.art;

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
