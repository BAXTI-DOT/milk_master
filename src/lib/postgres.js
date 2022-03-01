const { Pool } = require('pg')
const { connection } = require('../config')

const pool = new Pool({
    connectionString: connection.connectionLocString,
})

const fetch = async(SQL, ...params) => {
    const client = await pool.connect()
    try {
        const { rows: [ row ] } = await client.query(SQL, params)
        return row
    } finally {
        client.release()
    }
}

const fetchAll = async(SQL, ...params) => {
    const client = await pool.connect()
    try {
        const { rows } = await client.query(SQL, params)
        return rows
    } finally {
        client.release()
    }
}

module.exports = {
    fetch,
    fetchAll
}