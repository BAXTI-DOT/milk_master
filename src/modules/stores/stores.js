const model = require('./model')

module.exports = {
    NEW_STORE: async(req, res) => {
        try {
            const { storeName, storePassword } = req.body

            const newStore = await model.newStore(storeName, storePassword)

            if(newStore) {
                res.json({
                    status: 200,
                    message: "Store created"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: "Internal server error"
            })
        }
    },
    ALL_STORES: async(_, res) => {
        try {
            res.json({
                status: 200,
                data: await model.stores()
            }) 
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: "Internal server error"
            })
        }
    }
}