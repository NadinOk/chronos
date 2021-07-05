const {token} = require("../db/database");


class TokenModel {
    async createToken(user_id, rand){
        try {
            return  await token.create({
                token: rand,
                user_id: user_id,
                created: Date.now(),
                expires_at: Date.now() + 7200000
            })
        } catch (e) {
            console.log(e)
        }
    }
    async logout(t) {
        let dataToUpdate = {expires_at: Date.now()}
        try {
            return await token.update(dataToUpdate, {where: ({token: [t]})})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getUserByToken(t) {
        try {
            return await token.findOne({where: {token: [t]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
}

module.exports = { TokenModel, token }