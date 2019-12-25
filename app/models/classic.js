//一些贴切单词 变量/类 名字 阻塞 词汇量
const {sequelize} = require('../../core/db');

const {Sequelize, Model} = require('sequelize');
// image title pubdate content fav_nums type  共同的数据
// url  music 特有的属性
// class Base extends Model {
//      constructor(){
//          super();
//
//      }
//
// }  这种写法 不支持
const classicFields = {
    image: Sequelize.STRING,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    type: Sequelize.TINYINT,
    title: Sequelize.STRING,

}

class Movie extends Model {


}

Movie.init(classicFields,{
    sequelize,
    tableName:'movie'
})

class Sentence extends Model {

}

Sentence.init(classicFields,{
    sequelize,
    tableName:'sentence'
})

class Music extends Model {

}

Music.init(Object.assign({url:Sequelize.STRING},classicFields),
{
    sequelize,
    tableName:'music'
});

module.exports={
    Movie,
    Sentence,
    Music

}
