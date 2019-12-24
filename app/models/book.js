const util=require('util');
const axios=require('axios');
const {Sequelize,Model} = require('sequelize');
const {sequelize} = require('../../core/db');
const {Favor} = require('@models/favor');



class Book extends Model{
    constructor(id){
        super();
        this.id=id;
    }
    //定义一个属性 不能传餐
    async detail(){
         const url = util.format(global.config.yushu.detailUrl,this.id);
         const result= await axios.get(url)
         return result.data;

    }
    static async getMyFavorBookCount(uid){
        //count 是挂在模型上专门求数量的方法
         const count =await Favor.count({
             where:{
                 type:400,
                 uid
             }
         })
         return count;

    }

    //静态方法 搜索书籍
    static async searchFromYuShu(q,start,count,summary=1){
        const url = util.format(global.config.yushu.keywordUrl,encodeURI(q),start,count,summary);
        const result=await axios.get(url);
        console.log(result.data)
        return result.data;

    }

}

Book.init({
   id:{
       type:Sequelize.INTEGER,
       primaryKey:true
   },
   fav_nums:{
       type:Sequelize.INTEGER,
       default:0
   }
},{
    sequelize,
    tableName:'book'
})

//表与表 之间关联
module.exports={
    Book
}
