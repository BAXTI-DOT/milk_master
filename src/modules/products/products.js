const model = require('./model')
const { verifyUser } = require('../../lib/jwt')
const moment = require('moment')
moment.locale("uz-latn")

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
                message: err.message
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
                message: err.message
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
                message: err.message
            })
        }
    },
    PRODUCTS_STORE: async(req, res) => {
        try {
            const { auth_token } = req.headers
            const { storeId } = verifyUser(auth_token)
            const { received, notReceived, returning } = req.body

            if((received.length || notReceived.length || returning.length) && storeId) {
                const result1 = received.map(async e => await model.dailyStore(storeId, e.product_id, e.product_count))
                const result2 = notReceived.map(async e => await model.dailyStore(storeId, e.product_id, null, e.product_count))
                const result3 = returning.map(async e => await model.dailyStore(storeId, e.product_id, null, null, e.product_count))

                const final = await Promise.all([ ...result2, ...result1, ...result3 ])

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
            res.status(500).send(err)
        }
    },
    GET_DAILY_SALE_WARE_HOUSE_MAN: async(req, res) => {
        try {
            const { storeId } = req.query

            const data = await model.getDailySaleWarehose(storeId)

            const received = data.filter(e => e.product_received).filter(m => m.sent_at = moment(m.sent_at).calendar())
            const notReceived = data.filter(e => e.product_unreceived).filter(m => m.sent_at = moment(m.sent_at).calendar())
            const returned = data.filter(e => e.product_returned).filter(m => m.sent_at = moment(m.sent_at).calendar())

            if(received.length || notReceived.length || returned.length) {
                res.status(200).json({
                    status: 200,
                    data: {
                        received,
                        notReceived,
                        returned
                    }
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: "No products yet"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: 'Internal server error',
            })
        }
    }
}