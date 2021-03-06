// const {sequelize : db} = require('../../core/db');
const bcrypt = require('bcryptjs');
//模型
const {sequelize} = require('../../core/db');

const {Sequelize,Model,Op} = require('sequelize');

const {Art} = require('./art');


//业务表 点赞 取消
class Favor extends Model {
    /**
     * 增加数据
     * @param art_id
     * @param type
     * @param uid
     * @returns {Promise<Promise<any>>}
     */
    static async like(art_id,type,uid){
        //1.favor 表 添加记录
        //2.classic fav_nums
        //可能会操作 多个表 如果保持数据库 一致性 要用事务 不加事务不一定能保证数据的一致性
        //数据库 事务 可以帮助 可以保持数据的一致性
        //关系型数据ACID 1。原子性，2。一致性，3。隔离性 4。持久性
        const favor=await Favor.findOne({
            where:{
                art_id,
                type,
                uid
            }
        });
        if(favor){
            throw new global.errs.LikeError();
        };
        //使用数据库 事务
        return sequelize.transaction(async t=>{
          await  Favor.create({
                art_id,
                type,
                uid
            },{transaction:t});

         const art = await Art.getData(art_id,type,false);
         await art.increment('fav_nums',{by:1,transaction:t});
        });


    }

    /**
     * 从数据库中删除 数据 使用数据库事务
     * @param art_id
     * @param type
     * @param uid
     * @returns {Promise<Promise<any>>}
     */
    static async disLike(art_id,type,uid){
        const favor=await Favor.findOne({
            where:{
                art_id,
                type,
                uid
            }
        });
        if(!favor){
            throw new global.errs.DislikeError();
        };
        //Favor 表   favor 表里的数据
        //使用数据库 事务
        return sequelize.transaction(async t=>{
            //向里添加一条记录
            await  favor.destroy({
                force:true,  //false 软删除  true 物理删除
                transaction:t
            });

            const art = await Art.getData(art_id,type,false);
            //减一
            await art.decrement('fav_nums',{by:1,transaction:t});
        });
    }

    /**
     * 用户是否点过赞
     * @param art_id
     * @param type
     * @param uid
     * @returns {Promise<boolean>}
     */
    static async userLikeIt(art_id,type,uid){
         const favor=await Favor.findOne({
             where:{
                 uid,
                 art_id,
                 type
             }
         });
         return favor?true:false
    }

    static async getMyClassicFavors(uid){
        // type!=400
        //查询列表
        const arts = await Favor.findAll({
            where:{
                uid,
                type:{
                    //这个不是js 写法 这个是sequlize写法
                    [Op.not]:400  //OP.not 表示操作符 不等于 400
                }
            }
        })

        if(!arts){
            throw new global.errs.NotFound();
        }

        return await Art.getList(arts);

        //arts 是数组
        //如果for 循环 查询数据库 是很危险的行为 不可控
        // in 查询 可以接受一个集合 [ids]


    }

    static async getBookFavor(uid,bookId){
        const count = await Favor.count({
            where:{
                art_id:bookId,
                type:400
            }
        })

        const myFavor = await Favor.findOne({
            where:{
                art_id:bookId,
                type:400,
                uid
            }
        })

        return {
            fav_nums:count,
            like_status: myFavor?1:0
        }



    }


}

Favor.init({
 uid:Sequelize.INTEGER,
 art_id:Sequelize.INTEGER,
 type:Sequelize.INTEGER,

},{
    sequelize,
    tableName:'favor'   //指定表的名字
});

module.exports = {
    Favor
}
// 数据迁移 SQL 更新 有风险
