const express = require('express')
const app = express()
const { PORT } = require('./config')

app.use(express.json())
app.use('/api/v1' ,require('./modules'))

app.listen(PORT, console.log(PORT))