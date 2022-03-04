const { fetch, fetchAll } = require('../../lib/postgres')

const FIND_BY_ID = `
    SELECT
        *
    FROM
        users
    WHERE
        user_id = $1
`

const ALL_USERS = `
    SELECT
        *
    FROM
        users
    ORDER BY 
        user_id
`

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

const UPDATE_USER = `
    UPDATE 
        users
    SET
        user_name = $1,
        user_password = $2,
        user_status = $3
    WHERE 
        user_id = $4
    RETURNING 
        *
`

const NEW_STORE_USER = `
    INSERT INTO
        user_stores(user_store, store_id)
    VALUES($1, $2)
    RETURNING *
`

const DELETE_USER = `
    DELETE 
        FROM
    users
        WHERE
    user_id = $1
    RETURNING *
`

const STORE_USER = `
    SELECT
        us.user_store,
        u.user_name,
        u.user_status,
        s.store_id
    FROM
        user_stores us
    INNER JOIN
        users u 
    ON
        us.user_store = u.user_id
    INNER JOIN
        stores s 
    ON
        us.store_id = s.store_id
    WHERE
        u.user_name = $1
`

const findUserById = (userID) => fetch(FIND_BY_ID, userID)
const findUser = (userName, password) => fetch(FIND_USER, userName, password)
const allUsers = () => fetchAll(ALL_USERS)
const newUser = (userName, password, user_status) => fetch(NEW_USER, userName, password, user_status)
const updateUser = async(userName, userPassword, userStatus, userID) => {
    const oldUser = await findUserById(userID)
    return fetch(
        UPDATE_USER, 
        userName ? userName: oldUser.user_name, 
        userPassword ? userPassword : oldUser.user_password, 
        userStatus ? userStatus : oldUser.user_status, 
        userID
    )
}
const deleteUser = (user_id) => fetch(DELETE_USER, user_id)
const newStoreUser = (userID, storeID) => fetch(NEW_STORE_USER, userID, storeID)
const storeUser = (userName) => fetch(STORE_USER, userName)

module.exports = {
    findUser,
    newUser,
    newStoreUser,
    updateUser,
    deleteUser,
    allUsers,
    findUser,
    storeUser
}