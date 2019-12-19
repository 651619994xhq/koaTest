const basicAuth = require('basic-auth');
const jwt =require('jsonwebtoken');
//这里处理了权限 分级控制 以及 token 令牌
class Auth {
    constructor(level){
        this.level = level || 1; //这个是给API 赋值权重
        //定义类的常量
        Auth.USER = 8; //普通用户
        Auth.ADMIN = 16; //管理员
        Auth.SUPER_ADMIN = 32; //超级管理员

    }
    get m(){
        return async (ctx,next)=>{
            // koa  nodejs 封装后的一个产物
            // nodejs request
            // ctx.req  是 对 原生的nodejs request 包装后的
            //token 检测
            //token 开发者 传递令牌
            //token body header 约定
            //HTTP 协议 规定 身份验证机制 HttpBasicAuth
            const userToken = basicAuth(ctx.req);
            console.log(userToken)
            let errMsg= 'token不合法'
            // ctx.body=token;
            if(!userToken || !userToken.name){
                  throw new global.errs.Forbbiden(errMsg);
            };
            try{
                // console.log('name==>',userToken.name, '  secretKey==>',global.config.security.secretKey)
             var decode = jwt.verify(userToken.name,global.config.security.secretKey)
             // console.log('decode==>',decode);

            }catch (error) {
                //1.用户 token 不合法
                //2. token 过期
                if(error.name == 'TokenExpiredError'){
                    errMsg='token已过期';
                }
                throw new global.errs.Forbbiden(errMsg)
            }

            if(decode.scope < this.level){
                errMsg='权限不足';
                throw new global.errs.Forbbiden(errMsg)
            }

            //放在上下文的 属性中
            ctx.auth={
                uid:decode.uid,
                scope:decode.scope
            }

            await next();



        }

    }

    static verifyToken(token){
        try{
            jwt.verify(token,global.config.security.secretKey)
            return true;
        }catch(e){

            return false
        }

    }


}

module.exports={
    Auth
}


//model code first 表  模型
//面向对象 思维 model Class
//初始化数据 期刊 书籍  SQL 文件
//model
//主题 粗到细
//user
//期刊 粗
//movie Sentence music  扩展性 相似性（抽离出来）
//url pubdate title 导演 演员
//实体 表 模型 记录本身的相关信息 事物  映射 （实体表）


// 一期 一期 Model/表 1期2期3期
//Flow 抽象 记录业务 解决业务问题    （业务表）
//多变 没有具体 好 不好 坏  简单 繁琐

//实体表 其实没有分为 实体 和 业务表 来的



//不知道 怎么设计数据库  感觉  辅助