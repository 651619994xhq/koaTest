// const bcrypt = require('bcryptjs');
const Router = require('koa-router');
const {success} = require('../../lib/helper');
const {RegisterValidator} =require('../../validators/validators');
const {User} = require('../../models/user');
const router = new Router({
    prefix:'/v1/user',   //路由的前缀
});


//中间件 是在 app启动 的时候 执行一次

// 注册 新增数据 put get delete
router.post('/register',async (ctx)=>{
    console.log('register is run')
 //思维路劲
 //接收参数 linValidator
 //email password1 password2 nickname
 // 每次请求 都会实例化一次 保证数据的唯一性
 const v =await new RegisterValidator().validate(ctx);
 // const salt = bcrypt.genSaltSync(10)   // 盐 加密 这个是同步 也有异步的方法
 // // 10不是位数 ，是加密的成本
 // // 明文 加密 不同 彩虹攻击
 // const psw = bcrypt.hashSync(v.get('body.password2'),salt)
 const user = {
     email:v.get('body.email'),
     password:v.get('body.password2'),
     nickname:v.get('body.nickname')
 }
 // v.get
 // 数据库
 // SQL Model
 await User.create(user);
 success();

});

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

