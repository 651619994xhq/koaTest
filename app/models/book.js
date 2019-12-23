const util=require('util');
const axios=require('axios');
const {sequelize} = require('../../core/db');

const {Sequelize,Model} = require('sequelize');

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
    //静态方法 搜索书籍
    static async searchFromYuShu(q,start,count,summary=1){
        console.log('q==>',q,' start==>',start,' count==>',count)
        const url = util.format(global.config.yushu.keywordUrl,encodeURI(q),start,count,summary);
        console.log('url==>',url);
        const result=await axios.get(url);
        // console.log(result.data)
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
