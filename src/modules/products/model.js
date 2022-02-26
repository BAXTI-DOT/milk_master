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

const products = () => fetchAll(PRODUCTS)
const newProduct = (productName, productPrice) => fetch(NEW_PRODUCT, productName, productPrice)

module.exports = {
    products,
    newProduct
}