// const {sequelize : db} = require('../../core/db');
const bcrypt = require('bcryptjs');
//模型
const {sequelize} = require('../../core/db');

const {Sequelize,Model} = require('sequelize');


//5.6 之前 define
class User extends Model {
     static  async verifyEmailPassword(email,plainPassword){
         const user=await User.findOne({
             where:{
                 email
             }
         });

         if(!user){
             throw new global.errs.AuthFailed('账号不存在')
         }

         const correct = bcrypt.compareSync(plainPassword,user.password);
         if(!correct){
             throw new global.errs.AuthFailed('密码不正确');
         }

         return user;
     }

     static async getUserByOpenid(openid){
         const user =await User.findOne({
             where:{
                 openid
             }
         })
         return user;
     }

    static async registerByOpenid(openid){
        const user =await User.create({
            openid
        })
        return user;
    }

}

User.init({
    // 主键  关系型数据库
    // 主键：不能重复 不能为空
    // 注册 user id  设计 ID 编号系统 60001 60002
    //自动增长的ID编号
    // 推荐 用 数字  数字 查询性能最好 尤其 不要使用随机字符串 GUID 数据量大的时候 查询的时候 很慢
    //并发  数字 可能会重复 报错
    //暴露 用户编号 1，2，3，4，5
    // 即使别人知道用户编号，也无法做坏事
    //接口保护  权限  访问接口  Token令牌
    id:{
      type:Sequelize.INTEGER,
      primaryKey:true,   //设置为主键
      autoIncrement:true
    },
    nickname:Sequelize.STRING,
    email:{
        type:Sequelize.STRING(128),
        unique:true //唯一
    },
    password:{
        //扩展 设计模式 观察者模式
        // es6 Reflect vue3.0
        type:Sequelize.STRING,
        //model 的属性操作
        set(val){
            const salt = bcrypt.genSaltSync(10)   // 盐 加密 这个是同步 也有异步的方法
            // 10不是位数 ，是加密的成本
            // 明文 加密 不同 彩虹攻击
            const psw = bcrypt.hashSync(val,salt)
            this.setDataValue('password',psw);
        }
    },
    openid:{
        type:Sequelize.STRING(64),
        unique:true //唯一
    }
    //用户 小程序 openid 是不变的 且 唯一
    //一个用户 针对于 一个小程序 openid  是唯一的
    // 小程序 公众号 unionID  是 唯一的 如果 做 跨 小程序 跨 微信公众号  使用unionID 就可以了
},{
    sequelize,
    tableName:'user'   //指定表的名字
});

module.exports = {
    User
}
// 数据迁移 SQL 更新 有风险
