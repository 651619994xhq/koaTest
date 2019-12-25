const {Op} = require('sequelize');
const {flatten} =require('lodash');
const {Movie,Music,Sentence} =require('./classic')
// const {Favor} =require('./favor');  //避免循环引入，可以写在函数内部导入
class Art {
    //决定一个对象的特征的参数 可以在构造函数内传入，其他灵活参数可以在 方法中传入
    constructor(art_id,type){
        this.art_id=art_id;
        this.type=type
    }
    // getDetail(){
    //
    // }
    //用get 关键字 获取属性 的 detail 是一个属性 不能传参
    async getDetail(uid){
        const {Favor} =require('./favor');
        const art =await Art.getData(this.art_id, this.type);
        if(!art){
            throw new global.errs.NotFound();
        }
        const like = await Favor.userLikeIt(this.art_id,this.type,uid);
        return {
            art,
            like_status: like
        }
    }

    //可以改成实例方法
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
                const {Book} =require('@models/book');
                art = Book.scope(scope).findOne(finder);
                if(!art){
                   art = await Book.create({
                        id:art_id,
                    })
                }
                break;
            default:
                break

        }

        return art


    }

    //处理集合 可以单独 在宁一个 集合类artCollection
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
        let arts = [];
        const scope='bh'; //这个是兼容 sequelize 在使用scope 之后 在使用更新操作 会出现sql 语句报错的情况
        // let scope='bh'
        switch (type) {
            case 100:
                //这里 Sscope 是排除时间语句
                arts = await Movie.scope(scope).findAll(finder);
                break;
            case 200:
                arts = Music.scope(scope).findAll(finder);
                break;
            case 300:
                arts = Sentence.scope(scope).findAll(finder);
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

//面向对象编程
//如果一个类下没有实例方法全是 static 静态方法 一个类也就没有了意义 只是 一个方法的集合
//静态方法不太具有复用性 但是实例方法确是有
//如果一个类中有很多方法 如果用static 方法 则需要传递很多参数  但是实例方法不一样 constructor 构造函数 传递一些特征性参数 在实例中 直接进行运用


//浅谈中间层和微服务
//前端 后端(数据整合) 服务（提供数据） 多个服务 微服务 可以针对性的扩容 成本高 维护高
//中间层 （偏向业务，所有的数据 都是不管来源）python php java nodejs  都可以做
