const Router = require('koa-router');
const {TokenValidator,NotEmptyValidator} =require('../../validators/validators')
const {LoginType} = require('../../lib/enum');
const {User} = require('../../models/user');
const {generateToken} =require('../../../core/util');
const {Auth} = require('../../../middlewares/auth')
const router = new Router({
    prefix:'/v1/token',   //路由的前缀
});
const {WXManager} = require('../../services/wx');


//中间件 是在 app启动 的时候 执行一次

// 注册 新增数据 put get delete
router.post('/',async (ctx)=>{
    const v=await new TokenValidator().validate(ctx);
    //type 做不同的处理
    //email
    let token;
    switch(v.get('body.type')){
        case LoginType.USER_EMAIL:
         token =  await  emailLogin(v.get('body.account'),v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:
            token = await WXManager.codeToToken(v.get('body.account'));
            break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
            break;
    }

    ctx.body={
        token
    }



});

async function emailLogin(account,secret){
   const user = await User.verifyEmailPassword(account,secret)
   // return user;
   return  generateToken(user.id,Auth.USER);
}

router.post('/verify',async (ctx)=>{
    //token
    const v=await new NotEmptyValidator().validate(ctx);
    const result=Auth.verifyToken(v.get('body.token'));
    ctx.body = {
        is_valid:result
    }

})


//做了自动加载 必须导出
module.exports = router;

//1.session(考虑状态 无状态) 2.token 令牌
//TP REST SOAP ASP JSP

//email password
//token jwt令牌
//token 无意义的随机字符串
//携带数据
//uid jwt
//令牌



//API 权限 公开API
//token 过期 不合法

