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