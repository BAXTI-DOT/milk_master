const model = require('./model')

module.exports = {
    LOGIN: async(req, res) => {
        try {
            const { username, password } = req.body

            const user = await model.findUser(username, password)

            if(!user) {
                return res.json({
                    status: 401,
                    message: "Unauthorized"
                })
            }

            res.json({
                status: 200,
                user
            })
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: "Internal server error"
            })
        }
    },
    CREATE_USER: async(req, res) => {
        try {
            const { username, password, user_status, store_id } = req.body

            const newUser = await model.newUser(username, password, user_status)

            if(newUser && user_status == 2 && store_id) {
                const newStoreUser = await model.newStoreUser(newUser.user_id, store_id)

                if(newStoreUser) {
                    return res.json({
                        status: 200,
                        message: "User for store created"
                    })
                }
            }

            if(newUser) {
                res.json({
                    status: 200,
                    message: "User created"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: "Internal server error"
            })
        }
    }
}