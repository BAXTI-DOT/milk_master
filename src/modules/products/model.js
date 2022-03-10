const { fetch, fetchAll } = require('../../lib/postgres')

const PRODUCTS = `
    SELECT
        *
    FROM
        products
`

const NEW_PRODUCT = `
    INSERT INTO
        products(product_name, product_price)
    VALUES($1, $2)
    RETURNING *
`

const DAILY_STORE = `
    INSERT INTO
        store_products(
            store_id,
            product_id,
            product_received,
            product_unreceived,
            product_returned
        )
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
`

const GET_DAILY_SALE_WARE_HOUSE = `
    SELECT
        *
    FROM
        products p
    INNER JOIN
        store_products s
    USING(product_id)
`

const products = () => fetchAll(PRODUCTS)
const newProduct = (productName, productPrice) => fetch(NEW_PRODUCT, productName, productPrice)
const dailyStore = (   
        storeId, 
        productId, 
        productReceived, 
        productUnreceived, 
        productReturned
    ) => fetch(
        DAILY_STORE,
        storeId, 
        productId, 
        productReceived, 
        productUnreceived, 
        productReturned
    )

const getDailySaleWarehose = (storeId) => fetchAll(GET_DAILY_SALE_WARE_HOUSE, storeId)

module.exports = {
    products,
    newProduct,
    dailyStore,
    getDailySaleWarehose
}