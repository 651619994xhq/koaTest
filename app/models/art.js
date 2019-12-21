const {Movie,Music,Sentence} =require('../models/classic')
class Art {
    static async getData(art_id, type,useScope=true) {
        const finder = {
            where: {
                id: art_id
            }
        };
        let art = null;
        const scope=useScope?'bh':null; //这个是兼容 sequelize 在使用scope 之后 在使用更新操作 会出现sql 语句报错的情况
        // let scope='bh'
        switch (type) {
            case 100:
                //这里 Sscope 是排除时间语句
                art = await Movie.scope(scope).findOne(finder);
                break;
            case 200:
                art = Music.scope(scope).findOne(finder);
                break;
            case 300:
                art = Sentence.scope(scope).findOne(finder);
                break;
            case 400:
                break;
            default:
                break

        }

        return art


    }

}


module.exports={
    Art
}
