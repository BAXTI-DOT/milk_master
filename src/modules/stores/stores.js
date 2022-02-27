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
    },
    UPDATE_STORE: async(req, res) => {
        try {
            const { storeName, storePassword, storeId } = req.body

            const updatedStore = await model.updateStore(storeName, storePassword, storeId)

            if(updatedStore) {
                res.json({
                    status: 200,
                    message: "Store updated"
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
    DELETE_STORE: async(req, res) => {
        try {
            const { storeId } = req.body

            const deletedStore = await model.deleteStore(storeId)

            if(deletedStore) {
                res.json({
                    status: 200,
                    message: "Store deleted"
                }) 
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: "Internal server error"
            })
        }
    }
}