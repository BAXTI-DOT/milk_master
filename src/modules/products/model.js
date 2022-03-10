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
        s.store_id,
        s.store_name,
        p.product_name,
        p.product_price,
        sp.product_received,
        sp.product_unreceived,
        sp.product_returned,
        sp.sent_at
    FROM
        products p
    INNER JOIN
        store_products sp
    ON
        p.product_id = sp.product_id
    INNER JOIN
        stores s
    ON 
        sp.store_id = s.store_id
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

const getDailySaleWarehose = () => fetchAll(GET_DAILY_SALE_WARE_HOUSE)

module.exports = {
    products,
    newProduct,
    dailyStore,
    getDailySaleWarehose
}