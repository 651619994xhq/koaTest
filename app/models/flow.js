const {sequelize} = require('../../core/db');

const {Sequelize,Model} = require('sequelize');

class Flow extends Model{

}

Flow.init({
    index:Sequelize.INTEGER,
    art_id:Sequelize.INTEGER, //通过实体ID号 去实体表查询信息
    type:Sequelize.INTEGER,  //100 电影类型 200 music  300 sentence
},{
    sequelize,
    tableName:'flow'
})

//表与表 之间关联
module.exports={
    Flow
}