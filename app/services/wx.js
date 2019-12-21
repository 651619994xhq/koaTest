const util=require('util');
const axios=require('axios');
const {User}=require('../models/user');
const {generateToken} =require('../../core/util');
const {Auth} =require('../../middlewares/auth');
class WXManager{

    static async codeToToken(code){
        //code 小程序
        //code 小程序生成 微信
        //openid 唯一标识 鉴定

        //显示注册
        //code appid appsecret
        //url

        const url= util.format(global.config.wx.loginUrl,global.config.wx.appId,global.config.wx.appSecret,code);
        // console.log('url==>',url);
        const result = await axios.get(url);
        // console.log('result==>',result.data,'status==>',result.status,'errcode==>',result)
        if(result.status!==200){
            throw new global.errs.AuthFailed('openid获取失败');
        };
        const errcode=result.data.errcode
        //微信的错误码没有返回 只能通过openid 判断了
        // if(errcode != 0){
        if(!result.data.openid){
            throw new global.errs.AuthFailed('openid获取失败:'+ errcode);
        }
        //openid
        //档案 user uid
        //openid
        let user = await User.getUserByOpenid(result.data.openid);
        if(!user){
            user = await User.registerByOpenid(result.data.openid);
        };

        return generateToken(user.id,Auth.USER)


    }


}

module.exports={
    WXManager
}