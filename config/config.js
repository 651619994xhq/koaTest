module.exports ={
    //prod dev
    env:'dev',
    database:{
        dbName:'island',
        host:'localhost',
        port:3306,
        user:'root',
        password:'beibei520'
    },
    security:{
        secretKey:'abcdefg', //这个最好是一个无规律的随机字符串
        expiresIn:60*60*30    //令牌过期时间 目前是1个小时
    },
    wx:{
        appId:'wx935b81e3fb93ecb1',
        appSecret:'866ac05c7ce3e9f4695a91b121bacbfb',
        loginUrl:`https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code`,
    },
    yushu:{
        detailUrl:'http://t.yushu.im/v2/book/id/%s',
        keywordUrl:'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
    },
    host:'http://localhost:3000/'

}
