const model = require('./model')

module.exports = {
    GET: async(_, res) => {
        try {
            const power = await model.getWattPrice()

            if(!power) {
                res.status(400).json({
                    status: 400,
                    message: "Watt is not provided"
                })
            }

            res.status(200).json({
                status: 200,
                power: power?.power_price
            })
        } catch(err) {
            console.log(err)
            res.status(500).json({
                status: 500,
                message: "Internal server error"
            })
        }
    },
    PUT: async(req, res) => {
        try {
            const { powerPrice, powerPriceId } = req.body

            const updatedPowerPrice = await model.updatePriceWatt(powerPrice, powerPriceId)

            if(updatedPowerPrice) {
                res.status(200).json({
                    status: 200,
                    message: "Updated watt price"
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Price is not updated"
                })
            }
        } catch(err) {
            console.log(err)
            res.status(500).json({
                status: 500,
                message: "Internal server error"
            })
        }
    },
}