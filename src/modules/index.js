const express = require('express')
const router = express.Router()

const Users = require('./users/users')
const Stores = require('./stores/stores')
const Products = require('./products/products')

router
    .post('/login', Users.LOGIN)
    .get('/users', Users.ALL_USERS)
    .post('/newUser', Users.CREATE_USER)
    .put('/updateUser', Users.UPDATE_USER)
    .delete('/deleteUser', Users.DELETE_USER)
    .get('/stores', Stores.ALL_STORES)
    .post('/newStore', Stores.NEW_STORE)
    .put('/updateStore', Stores.UPDATE_STORE)
    .delete('/deleteStore', Stores.DELETE_STORE)
    .get('/products', Products.ALL_PRODUCTS)
    .post('/newProduct', Products.NEW_PRODUCT)

module.exports = router