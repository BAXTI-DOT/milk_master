const model = require('./model')
const { userRoles } = require('../../config')
const { signUser } = require('../../lib/jwt')

module.exports = {
    LOGIN: async(req, res) => {
        try {
            const { username, password } = req.body

            const user = await model.findUser(username, password)

            console.log(user)

            if(!user) {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized"
                })
            }

            if(user && user.user_status == 2) {
                const storeUser = await model.storeUser(user.user_name)

                if(storeUser) {
                    console.log(storeUser)
                    return res.json({
                        status: 200,
                        token: signUser({ storeId: storeUser.store_id }),
                        storeId: storeUser.store_id
                    })
                }
            }

            res.json({
                status: 200,
                token: signUser({ userId: user.user_id, userStatus: user.user_status }),
                userStatus: user.user_status
            })
        } catch(err) {
            console.log(err)
            res.status(5000).json({
                status: 500,
                message: err.message
            })
        }
    },
    ALL_USERS: async(_, res) => {
        try {
            const users = await model.allUsers()

            if(users.length) {
                res.json({
                    status: 200,
                    data: users.filter(e => e.user_status = userRoles(e.user_status))
                }) 
            } else {
                res.json({
                    message: "Users does not exist"
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
    CREATE_USER: async(req, res) => {
        try {
            const { username, password, userStatus, storeId } = req.body

            const existingUser = await model.findUser(username, password)

            if(existingUser) {
                return res.json({
                    status: 400,
                    message: "User already exists"
                })
            }

            const newUser = await model.newUser(username, password, userStatus)

            if(newUser && userStatus == 2 && storeId) {
                const newStoreUser = await model.newStoreUser(newUser.user_id, storeId)

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
                message: err.message
            })
        }
    },
    UPDATE_USER: async(req, res) => {
        try {
            const { username, password, user_status, user_id } = req.body

            const updatedUser = await model.updateUser(username, password, user_status, user_id)

            if(updatedUser) {
                res.json({
                    status: 200,
                    message: "User updated"
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
    DELETE_USER: async(req, res) => {
        try {
            const { user_id } = req.body

            const deletedUser = await model.deleteUser(user_id)

            if(deletedUser) {
                res.json({
                    status: 200,
                    message: "User deleted"
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                status: 500,
                message: err.message
            })
        }
    }
}