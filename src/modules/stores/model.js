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
        stores(store_name)
    VALUES($1)
    RETURNING *
`

const UPDATE_STORE = `
    UPDATE
        stores
    SET
        store_name = $1
    WHERE
        store_id = $2
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

const NEW_STORE_MONEY = `
    INSERT INTO
        store_money(
            store_money_cash,
            store_money_incass,
            store_money_humo,
            store_money_uzcard,
            store_id
        )
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
`

const GET_CASHER_MONEY = `
    SELECT
        store_id,
        store_money_id,
        store_name,
        store_money_cash,
        money_sent_at
    FROM
        store_money
    INNER JOIN
        stores
    USING(store_id)
    WHERE
        store_money_status = 1
`

const GET_ACCOUNTANT_MONEY = `
    SELECT
        store_money_id,
        SUM(store_money_cash + store_money_incass)::decimal(10, 2),
            CASE WHEN store_money_humo IS NULL THEN 0 ELSE store_money_humo END store_money_humo,
            CASE WHEN store_money_uzcard IS NULL THEN 0 ELSE store_money_uzcard END store_money_uzcard,
        store_id,
        money_updated_at
    FROM
        store_money
    WHERE
        store_money_status = 2
    GROUP BY 
        store_money_id
`

const SEND_TO_ACCOUNTANT_FROM_CASHER = `
    UPDATE
        store_money
    SET
        store_money_status = 2,
        store_money_cash = $2
    WHERE
        store_money_id = $1
    RETURNING *
`

const MONTHLY_REPORT = `
    INSERT INTO
        store_month_remainings(product_id, product_count, store_id)
    VALUES($1, $2, $3)
    RETURNING *
`

const MONTHLY_REPORT_ACCOUNTANT = `
    SELECT
        smr.store_id,
        CASE WHEN SUM(p.product_price * smr.product_count) IS NULL THEN 0 ELSE SUM(p.product_price * smr.product_count) END AS remain,
        CASE WHEN SUM(sp.product_received * p.product_price) IS NULL THEN 0 ELSE SUM(sp.product_received * p.product_price) END AS received,
        CASE WHEN SUM(sp.product_unreceived * p.product_price) IS NULL THEN 0 ELSE SUM(sp.product_unreceived * p.product_price) END AS unreceived,
        CASE WHEN SUM(sp.product_returned * p.product_price) IS NULL THEN 0 ELSE SUM(sp.product_returned * p.product_price) END AS returned,
        CASE WHEN SUM(w.power_amount * (SELECT power_price FROM power_price)) IS NULL THEN 0 ELSE SUM(w.power_amount * (SELECT power_price FROM power_price)) END AS electricity,
        w.power_reported_at
    FROM
        store_month_remainings smr
    INNER JOIN
        products p 
    ON
        smr.product_id = p.product_id
    LEFT JOIN
        store_products sp
    ON
        p.product_id = sp.product_id
    LEFT JOIN
        power_consume w
    ON
        w.store_id = smr.store_id
    GROUP BY 
        smr.store_id,
        w.power_reported_at
`

const GET_OLD_STORE_MONEY = `
    SELECT
        store_money_cash
    FROM
        store_money
    WHERE
        store_money_id = $1
`

const stores = () => fetchAll(STORES)
const storeById = (storeId) => fetch(STORE_BY_ID, storeId)
const newStore = (storeName) => fetch(NEW_STORE, storeName)
const updateStore = async(storeName, storeId) => {
    const oldStore = await storeById(storeId)

    return fetch(
        UPDATE_STORE, 
        storeName ? storeName : oldStore.store_name, 
        storeId
    )
}
const deleteStore = (storeId) => fetch(DELETE_STORE, storeId)
const newStoreMoney = (
    cash, 
    incass, 
    humo, 
    uzcard, 
    storeId
) => fetch(
    NEW_STORE_MONEY, 
    cash, 
    incass, 
    humo, 
    uzcard, 
    storeId
)
const getCasherMoney = () => fetchAll(GET_CASHER_MONEY)
const getCasherMoneyToUpdate = (storeMoneyId) => fetch(GET_OLD_STORE_MONEY, storeMoneyId)
const sendToAccountantFromCasher = async(storeMoneyId, storeCash) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              qaaaaaaaaa
    const oldCash = await getCasherMoneyToUpdate(storeMoneyId)

    return fetch(
        SEND_TO_ACCOUNTANT_FROM_CASHER,
        storeMoneyId,
        storeCash ? storeCash: oldCash.store_money_cash
    )
}
const getAccountantMoney = () => fetchAll(GET_ACCOUNTANT_MONEY)
const monthlyReport = (productId, productCount, storeId) => fetch(MONTHLY_REPORT, productId, productCount, storeId)
const monthlyReportAccountant = (storeId) => fetchAll(MONTHLY_REPORT_ACCOUNTANT, storeId)

module.exports = {
    stores,
    newStore,
    updateStore,
    deleteStore,
    newStoreMoney,
    getCasherMoney,
    getAccountantMoney,
    sendToAccountantFromCasher,
    monthlyReport,
    monthlyReportAccountant
}