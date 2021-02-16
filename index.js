const express = require('express')
require('./db/database')
const userRouter = require('./routers/user')

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(userRouter)

app.listen(PORT, () => {
    console.log('Server is up on port', PORT)
})