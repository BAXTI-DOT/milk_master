const { fetch, fetchAll } = require('../../lib/postgres')

const STORES = `
    SELECT
        *
    FROM
        stores
    ORDER BY    
        store_id 
    ASC
`

const STORE_BY_ID = `
    SELECT
        *
    FROM
        stores
    WHERE
        store_id = $1
`

const NEW_STORE = `
    INSERT INTO 
        stores(store_name, store_password)
    VALUES($1, $2)
    RETURNING *
`

const UPDATE_STORE = `
    UPDATE
        stores
    SET
        store_name = $1,
        store_password = $2
    WHERE
        store_id = $3
    RETURNING *
` 

const DELETE_STORE = `
    DELETE
        FROM
    stores
        WHERE
    store_id = $1
    RETURNING *
`

const stores = () => fetchAll(STORES)
const storeById = (storeId) => fetch(STORE_BY_ID, storeId)
const newStore = (storeName, storePassword) => fetch(NEW_STORE, storeName, storePassword)
const updateStore = async(storeName, storePassword, storeId) => {
    const oldStore = await storeById(storeId)

    return fetch(
        UPDATE_STORE, 
        storeName ? storeName : oldStore.store_name, 
        storePassword ? storePassword : oldStore.store_password,
        storeId
    )
}
const deleteStore = (storeId) => fetch(DELETE_STORE, storeId)

module.exports = {
    stores,
    newStore,
    updateStore,
    deleteStore
}