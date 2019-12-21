const {Movie,Music,Sentence} =require('../models/classic')
const {Op} = require('sequelize');
const {flatten} =require('lodash');
class Art {
    static async getData(art_id, type,useScope=true) {
        const finder = {
            where: {
                id: art_id
            }
        };
        let art = null;
        const scope=useScope?'bh':null; //这个是兼容 sequelize 在使用scope 之后 在使用更新操作 会出现sql 语句报错的情况
        // let scope='bh'
        switch (type) {
            case 100:
                //这里 Sscope 是排除时间语句
                art = await Movie.scope(scope).findOne(finder);
                break;
            case 200:
                art = Music.scope(scope).findOne(finder);
                break;
            case 300:
                art = Sentence.scope(scope).findOne(finder);
                break;
            case 400:
                break;
            default:
                break

        }

        return art


    }

    static async getList(artInfoList){
        // in 查询 【ids】
        //3种类型 art
        //3次 in 查询
        const artInfoObj = {
            100:[],
            200:[],
            300:[],
        };
        for(let artInfo of artInfoList){
            //artInfo.type  artInfo.art_id
            artInfoObj[artInfo.type].push(artInfo.art_id);
        };
        console.log('artInfoObj==>',artInfoObj);
        let  arts = [];
        //把复杂的逻辑 拆分为函数 for循环 代码大全书里
        for(let key in artInfoObj){
          const ids=  artInfoObj[key];
          if(ids.length == 0){
              continue;
          }
          key=parseInt(key);
          let _arts = await  Art._getListByType(ids,key);
          arts.push(_arts);
        }
        //将二维数组展开
        return flatten(arts)||[];
    }

    //_下滑线 私有方法
    static async _getListByType(ids,type){
        const finder = {
            where: {
                id: {
                    [Op.in]:ids  //in 集合 查询
                }
            }
        };
        let arts = null;
        const scope='bh'; //这个是兼容 sequelize 在使用scope 之后 在使用更新操作 会出现sql 语句报错的情况
        // let scope='bh'
        switch (type) {
            case 100:
                //这里 Sscope 是排除时间语句
                arts = await Movie.scope(scope).findOne(finder);
                break;
            case 200:
                arts = Music.scope(scope).findOne(finder);
                break;
            case 300:
                arts = Sentence.scope(scope).findOne(finder);
                break;
            case 400:
                break;
            default:
                break

        }
        return arts

    }

}


module.exports={
    Art
}
