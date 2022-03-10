const model = require('./model')
const powerModel = require('../power/model')
const moment = require('moment')
moment.locale("uz-latn")
const { verifyUser } = require('../../lib/jwt') 

module.exports = {
    NEW_STORE: async(req, res) => {
        try {
            const { storeName } = req.body

            const newStore = await model.newStore(storeName)

            if(newStore) {
                res.json({
                    status: 200,
                    message: "Store created"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    ALL_STORES: async(_, res) => {
        try {
            res.json({
                status: 200,
                data: await model.stores()
            }) 
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    UPDATE_STORE: async(req, res) => {
        try {
            const { storeName, storeId } = req.body

            const updatedStore = await model.updateStore(storeName, storeId)

            if(updatedStore) {
                res.json({
                    status: 200,
                    message: "Store updated"
                }) 
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    DELETE_STORE: async(req, res) => {
        try {
            const { storeId } = req.body

            const deletedStore = await model.deleteStore(storeId)

            if(deletedStore) {
                res.json({
                    status: 200,
                    message: "Store deleted"
                }) 
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    SEND_STORE_MONEY: async(req, res) => {
        try {
            const { auth_token } = req.headers
            const { storeId } = verifyUser(auth_token)
            const { cash, incass, humo, uzcard } = req.body

            const storeMoney = await model.newStoreMoney(cash, incass, humo, uzcard, storeId)

            if(storeMoney) {
                res.json({
                    status: 200,
                    message: "Send money into casher"
                })
            } else {
                res.json({
                    status: 400,
                    message: "Bad request"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    GET_CASHER_MONEY: async(req, res) => {
        try {
            const storeMoney = await model.getCasherMoney()

            if(storeMoney) {
                res.status(200).json({
                    status: 200,
                    data: storeMoney.filter(e => e.money_sent_at = moment(e.money_sent_at).calendar())
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Data not found" 
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    SEND_TO_ACCOUNTANT: async(req, res) => {
        try {
            const { storeMoneyId, storeMoneyCashNew } = req.body
            const sentToAccountant = await model.sendToAccountantFromCasher(storeMoneyId, storeMoneyCashNew ? storeMoneyCashNew: null)

            if(sentToAccountant) {
                res.status(200).json({
                    status: 200,
                    message: "Sent to accountant"
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Could not sent to accountant"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    GET_ACCOUNTANT_MONEY: async(_, res) => {
        try {
            const storeMoney = await model.getAccountantMoney()

            if(storeMoney) {
                res.status(200).json({
                    status: 200,
                    data: storeMoney.filter(e => e.money_updated_at = moment(e.money_updated_at).calendar())
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Data not found" 
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    MONTHLY_REPORT: async(req, res) => {
        try {
            const { auth_token } = req.headers
            const { productsLeft, watt } = req.body
            const { storeId } = verifyUser(auth_token)
            if(productsLeft.length && storeId && watt) {
                let result = []
                for(let i of productsLeft) {
                    const newReportMonth = await model.monthlyReport(i.product_id, i.product_count, storeId)
                    result.push(newReportMonth)
                }

                const consumedWatt = await powerModel.powerConsume(storeId, watt)
                
                if(result.length && consumedWatt) {
                    return res.status(200).json({
                        status: 200,
                        message: "Remainings inserted"
                    })
                }
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    },
    MONTHLY_REPORT_ACCOUNTANT: async(req, res) => {
        try {
            const { storeId } = req.query

            const reportMonth = await model.monthlyReportAccountant(storeId)

            if(!reportMonth.length) {
                return res.status(400).json({
                    status: 400,
                    message: "Report not found"
                })
            }

            res.status(200).json({
                status: 200,
                data: reportMonth.filter(e => e.power_reported_at = moment(e.power_reported_at).format('MMMM'))
            })
        } catch(err) {
            console.log(err)
            res.status(500).json({
                status: 500,
                message: err.message
            })
        }
    }
}