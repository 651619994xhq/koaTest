//dir core  初始化类的概念
const requireDirectory=require('require-directory');  //牛逼逼的文件夹
const Router = require('koa-router');
 class InitManager{
    static initCore(app){
        //入口方法
        InitManager.app=app;
        InitManager.loadConfig();
        InitManager.initLoadRoutes();
        InitManager.loadHttpException();
    }
    static loadConfig(path=''){
        const configPath = path || `${process.cwd()}/config/config.js`;
        const config = require(configPath);
        global.config=config;
    }
    static initLoadRoutes(){
        //1.path config 2.使用绝对路劲
        const apiDirectory=`${process.cwd()}/app/api`;
        //实现路由自动注册
        requireDirectory(module,apiDirectory,{visit:(obj)=>{
                //第三个回调 是 每次加载模块前 都会执行这个回调函数 通过回调 兼容router
                if(obj instanceof Router){
                    InitManager.app.use(obj.routes())
                };
            }});



    }
    //处理错误页面
    static loadHttpException(){
        const errors =require('./http-exception');
        global.errs =  errors;

    }


}

module.exports= InitManager;