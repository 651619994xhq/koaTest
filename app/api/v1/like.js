const Router = require('koa-router');
const router = new Router({
    prefix:'v1/like'
});
const {Auth} = require('../../../middlewares/auth')
const {LikeValidator} =require('../../validators/validators');
const {Favor} = require('../../models/flow');
const {success} = require('../../lib/helper');
//需要加入权限
router.post('/',new Auth().m,async (ctx,next)=>{
   const v= new LikeValidator().validate(ctx,{id:'art_id'});
   await  Favor.like(v.get('body.art_id'),v.get('body.type'),ctx.auth.uid);
   success();

});

router.post('/cancel',new Auth().m,async (ctx,next)=>{
    const v= new LikeValidator().validate(ctx,{id:'art_id'});
    await  Favor.disLike(v.get('body.art_id'),v.get('body.type'),ctx.auth.uid);
    success();

});
module.exports=router



