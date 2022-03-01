const userRoles = role => {
    if(role == 1) return "Admin"
    if(role == 2) return "Sotuvchi"
    if(role == 3) return "Buxgalter"
    if(role == 4) return "Kassir"
    if(role == 5) return "Omborchi"
}

const PORT = process.env.PORT || 9000

const SECRET_KEY = 'SUT_ICHAMAN'

module.exports = {
    userRoles,
    PORT,
    SECRET_KEY
}