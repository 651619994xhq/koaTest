const {sequelize} = require('../../core/db');

const {Sequelize,Model} = require('sequelize');

class Comment extends Model{
    //model constructor 会有问题
    // constructor(){
    //     super()
    // }
    static async addComment(bookId,content){
        //点赞+1
        //相同的content
        const comment = await Comment.findOne({
            where:{
                book_id:bookId,
                content
            }
        });

        if(!comment){
            return await  Comment.create({
                book_id:bookId,
                content,
                nums:1
            })
        }
        //相同评论 +1
        return await  comment.increment('nums',{
            by:1
        })


    }
    static async getComments(bookId){
        const comments=await Comment.findAll({
            where:{
                book_id:bookId
            }
        })
       return comments;
    }
    //这个是在获取的时候 很巧妙
    toJSON(){
        //this.dataValues 可以获取所有对象
        //this
        return {
            content: this.getDataValue('content'),
            nums: this.getDataValue('nums')

        }

    }

}

Comment.init({
    content:Sequelize.STRING(12),
    nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    book_id:Sequelize.INTEGER
},{
    sequelize,
    tableName:'comment'
})

//表与表 之间关联
module.exports={
    Comment
}
