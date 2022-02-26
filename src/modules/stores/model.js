const { fetch, fetchAll } = require('../../lib/postgres')

const NEW_STORE = `
    INSERT INTO 
        stores(store_name, store_password)
    VALUES($1, $2)
    RETURNING *
`

const STORES = `
    SELECT
        *
    FROM
        stores
`

const newStore = (storeName, storePassword) => fetch(NEW_STORE, storeName, storePassword)
const stores = () => fetchAll(STORES)

module.exports = {
    newStore,
    stores
}