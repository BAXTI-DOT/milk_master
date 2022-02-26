const { fetch, fetchAll } = require('../../lib/postgres')

const FIND_USER = `
    SELECT
        *
    FROM
        users
    WHERE
        user_name = $1
    AND
        user_password = $2
`

const NEW_USER = `
    INSERT INTO
        users(
            user_name, 
            user_password, 
            user_status
        )
    VALUES($1, $2, $3)
    RETURNING 
        *
`

const NEW_STORE_USER = `
    INSERT INTO
        user_stores(user_store, store_id)
    VALUES($1, $2)
    RETURNING *
`

const findUser = (userName, passwrd) => fetch(FIND_USER, userName, passwrd)
const newUser = (userName, password, user_status) => fetch(NEW_USER, userName, password, user_status)
const newStoreUser = (userID, storeID) => fetch(NEW_STORE_USER, userID, storeID)

module.exports = {
    findUser,
    newUser,
    newStoreUser
}