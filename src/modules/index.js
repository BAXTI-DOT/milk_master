const express = require('express')
const router = express.Router()

const Users = require('./users/users')
const Stores = require('./stores/stores')
const Products = require('./products/products')

router
    .post('/login', Users.LOGIN)
    .post('/newUser', Users.CREATE_USER)
    .get('/stores', Stores.ALL_STORES)
    .post('/newStore', Stores.NEW_STORE)
    .get('/products', Products.ALL_PRODUCTS)
    .post('/newProduct', Products.NEW_PRODUCT)

module.exports = router