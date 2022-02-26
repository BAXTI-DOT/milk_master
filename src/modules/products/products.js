const model = require('./model')

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
    }
}