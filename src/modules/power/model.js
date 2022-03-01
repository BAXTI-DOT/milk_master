const { fetch } = require('../../lib/postgres')

const GET_PRICE_WATT = `
    SELECT
        *
    FROM
        power_price
`

const UPDATE_PRICE_WATT = `
    UPDATE
        power_price
    SET
        power_price = $1
    WHERE
        power_price_id  = $2
    RETURNING *
`

const POWER_CONSUME = `
    INSERT INTO
        power_consume(store_id, power_amount)
    VALUES($1, $2)
    RETURNING *
`

const getWattPrice = () => fetch(GET_PRICE_WATT)
const updatePriceWatt = (powerPrice, powerPriceId) => fetch(UPDATE_PRICE_WATT, powerPrice, powerPriceId)
const powerConsume = (storeId, powerAmount) => fetch(POWER_CONSUME, storeId, powerAmount)

module.exports = {
    getWattPrice,
    updatePriceWatt,
    powerConsume
}