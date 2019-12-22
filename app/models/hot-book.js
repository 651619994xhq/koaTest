// const {sequelize : db} = require('../../core/db');
const bcrypt = require('bcryptjs');
//模型
const {sequelize} = require('../../core/db');

const {Sequelize,Model,Op} = require('sequelize');

const {Favor} = require('./favor')


//5.6 之前 define
class HotBook extends Model {

    static async getAll(){
        //排序 查到所有数据
        const books = await HotBook.findAll({
            order:[
                'index'
            ]
        });
        //count
        const ids=[];
        //这个是错误的 并发 不会等待 forEach 不要使用async await
        // books.forEach(async book=>{
        //   await ids.push(book.id);
        // });
        books.forEach(book=>{
           ids.push(book.id)
        });

        //group
        //[{id:777,count:125}] 数据结构
        const favors =await  Favor.findAll({
            where:{
               art_id:{
                   [Op.in]:ids
               }
            },
            group:['art_id'],     //分组
              //Sequelize.fn('COUNT') 对所有的分组art_id 进行求和      Sequelize.fn('SUM','score') //这个表示对所有的分数进行求和
            attributes:['art_id',[Sequelize.fn('COUNT',"*"),'count']]  //决定最后返回字段的名字
        });

        books.forEach(book=>{
           HotBook._getEachBookStatus(book,favors);
        });

        return books



        //并发 并行
        //高并发
        //python 并行 单线程 Thread()
        //js 并发  宏任务 微任务 执行并发
        //单线程 实质 cpu 足够快
        //cpu密集型操作 资源密集型操作
        //java C# 多线程 线程同步 lock

        //nodejs  对cpu 要求低 充分榨取 单核的性能 利用率非常高 依赖硬件的成本很低 可以处理 资源密集 高并发 是可以快速切换 实现高并发


    }
    static _getEachBookStatus(book,favors){
        let count = 0;
        favors.forEach(favor =>{
           if(book.id === favor.art_id){
               count=favor.get('count');
           }
        });
        book.setDataValue('count',count);
        return book;

    }


}

HotBook.init({
    index:Sequelize.INTEGER,
    image:Sequelize.STRING,
    author:Sequelize.STRING,
    title:Sequelize.STRING

},{
    sequelize,
    tableName:'hot_book'   //指定表的名字
});

module.exports = {
    HotBook
}
// 排序 重要
//
