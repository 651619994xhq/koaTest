const {Movie,Music,Sentence} =require('../models/classic')
class Art {
    static async getData(art_id, type) {
        const finder = {
            where: {
                id: art_id
            }
        };
        let art = null;

        switch (type) {
            case 100:
                art = await Movie.findOne(finder);
                break;
            case 200:
                art = Music.findOne(finder);
                break;
            case 300:
                art = Sentence.findOne(finder);
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