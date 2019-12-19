const {HttpException} = require('../core/http-exception');

//全局处理异常
const catchError = async (ctx,next)=>{
    try{
        await next();
    }catch(error){
        const isHttpException = error instanceof HttpException;
        const isDev = global.config.env === 'dev';
        if(isDev && !isHttpException){
            throw error
        }
        //开发环境 生产环境
        //error 堆栈调用信息
        //error 进行简化 返回客户端清晰明了的信息 给前端
        //HTTP Status code 2xx 4xx 5xx
        //message 文字性描述
        //error_code 详细 开发者自己定义 10001 20003
        //request_url 当前请求url


        //已知型错误
        //处理错误，明确
        //try catch 处理错误 明确

        //未知型错误 程序潜在错误 无意识 根本不知道出错了
        //链接数据库 账号 密码 输错了
        if(isHttpException){
            ctx.body= {
                msg:error.msg,
                error_code:error.errorCode,
                request:`${ctx.method} ${ctx.path}`

            }
            ctx.status = error.code;
        }else{
            ctx.body={
                msg:'系统错误',
                error_code:999,
                request:`${ctx.method} ${ctx.path}`

            }
            ctx.status = 500;



        }

    }
};

//AOP 面向切面编程

module.exports=catchError;