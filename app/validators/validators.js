const { LinValidator, Rule } = require('../../core/lin-validator-v2');
const {User} = require('../models/user')
const {LoginType,ArtType} =require('../lib/enum');
//正整数校验
class PositiveIntegerValidator extends LinValidator{
      constructor(){
          super();
              //且关系
              //1.规则，2.提示信息 3.可选配置
              this.id = [
                  new Rule('isInt', '必须为正整数', { min: 1 })
              ];
      }
}

class RegisterValidator extends LinValidator{
     constructor(){
         super();
         this.email=[
             new Rule('isEmail','不符合email规范')
         ];
         this.password1=[
             //用户指定范围
             new Rule('isLength','最多18个字符',{min:6,max:18}),
             new Rule('matches','密码不符合规范','^[0-9]*$')
         ];
         this.password2=this.password1;
         this.nickname=[
             new Rule('isLength','昵称不符合长度规范',{min:4,max:32}),
         ]

     }

     validatePassWord(vals){
         const psw1 =vals.body.password1;
         const psw2 =vals.body.password2;
         if(psw1 !== psw2){
             //lin-validate 会自己处理异常
             throw new Error('两个密码必须相同');
         }
     }

    async validateEmail(vals){
        const email =vals.body.email;
        const user =await User.findOne({
            where:{
                email:email
            }
        });
        if(user){
            throw new Error('email已存在');

        }


    }

}

class TokenValidator extends LinValidator{
       constructor(){
           super();
           this.account = [
               new Rule('isLength','不符合账号规则',{
                   min:4,
                   max:32
               })
           ]
           this.secret = [
               //是必须要传入吗？
               //web 账号+ 密码
               //登录 多元化 小程序 密码
               //微信 打开小程序 合法用户

               //1.可以为空，可以不传
               //2.空 不为空
               new Rule('isOptional'),
               new Rule('isLength','至少6位字符',{
                   min:6,
                   max:128
               })
           ]

           // type 枚举 js 枚举

       }
       validateLoginType(vals){
           if(!vals.body.type){
               throw new Error('type是必传参数')
           }
           if(!LoginType.isThisType(vals.body.type)){
               console.log('type==>',vals.body.type)
               throw new Error('type参数不合法')
           }

       }

}

class NotEmptyValidator extends LinValidator{
    constructor(){
        super();
        this.token = [
            new Rule('isLength','不允许为空',{min:1})
        ]

    }

}


//这里也可以 写成函数
//类  可以保存 变量 函数 不可以保存变量
class Checker{

    constructor(type){
        this.enumType= type;
    }
    //注意类上 静态方法 和动态方法的区别
    //是一个实例方法
    check(vals) {
        let type =vals.body.type;
        if(!type){
            throw new Error('type是必传参数')
        }
        type=parseInt(type);
        if(!this.enumType.isThisType(type)){
            console.log('type==>',vals.body.type)
            throw new Error('type参数不合法')
        }

    }

}

function checkArtType(vals){
    let type =vals.body.type;
    if(!type){
        throw new Error('type是必传参数')
    }
    type=parseInt(type);
    if(!ArtType.isThisType(type)){
        console.log('type==>',vals.body.type)
        throw new Error('type参数不合法')
    }

}

//复用
class LikeValidator extends PositiveIntegerValidator{
    constructor(){
        super();
        this.validateType=checkArtType;
        // const checker = new Checker(ArtType)
        // this.validateType = checker.check.bind(checker);

    }

}

class ClassicValidator extends LikeValidator{

}

class SearchValidator extends LinValidator{
    constructor(){
        super();
        this.q=[
            new Rule('isLength','搜索关键词不能为空',{min:1,max:16})
        ];
        //start count pageNum perPage
        this.start = [
            new Rule('isInt','start不符合规范',{
                min:0,
                max:60000
            }),
            new Rule('isOptional','',0)   //默认值0
        ]
        this.count=[
            new Rule('isInt','count不符合规范',{
                min:1,
                max:20
            }),
            new Rule('isOptional','',20)  //默认值20
        ]

    }

}





module.exports={
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator,
    ClassicValidator,
    SearchValidator
}
