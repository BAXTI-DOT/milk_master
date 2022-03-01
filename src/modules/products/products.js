const model = require('./model')
const { verifyUser } = require('../../lib/jwt')



module.exports = {
    ALL_PRODUCTS: async(_, res) => {
        try {
            const products = await model.products()

            if(products.length) {
                res.json({
                    status: 200,
                    data: products
                })
            } else {
                res.json({
                    message: "Products does not exists"
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
    NEW_PRODUCT: async(req, res) => {
        try {
            const { productName, productPrice } = req.body

            const newProduct = await model.newProduct(productName, productPrice)

            if(newProduct) {
                res.json({
                    status: 200,
                    message: "Product has been created"
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
    UPDATE_PRODUCT: async(req, res) => {
        try {
            const { productName, productPrice } = req.body

            const newProduct = await model.newProduct(productName, productPrice)

            if(newProduct) {
                res.json({
                    status: 200,
                    message: "Product has been created"
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
    PRODUCTS_STORE: async(req, res) => {
        try {
            const { auth_token } = req.headers
            const { storeId } = verifyUser(auth_token)
            const { received, notReceived, notDelivered } = req.body

            if((received.length || notReceived.length || notDelivered.length) && storeId) {
                const result = received.map(async e => await model.dailyStore(storeId, e.product_id, e.product_count))
                const result2 = notReceived.map(async e => await model.dailyStore(storeId, e.product_id, null, e.product_count))
                const result3 = notDelivered.map(async e => await model.dailyStore(storeId, e.product_id, null, null, e.product_count))

                const final = await Promise.all([ ...result2, ...result, ...result3 ])
                
                if(final.length) {
                    return res.json({
                        status: 200,
                        message: "Store products created"
                    })
                }
            } else {
                res.json({
                    status: 20,
                    message: "Length is not defined"
                })
            }
        } catch (err) {
            console.log(err)
            res.json({
                status: 500,
                message: 'Internal server error',
            })
        }
    }
}