const express = require("express")
const mongoose = require("mongoose")
const config = require('config')
const cors = require('cors')

const fileRouter = require('./routes/filesRouter')
const userRouter = require('./routes/userRouter')
const { logReq } = require('./middlewares/logReqMiddleware')
const app = express()

app.use(express.json())
app.use(cors())
app.use(logReq)
app.use('/api/files', fileRouter)
app.use('/api/user', userRouter)

// const PORT = config.get('serverPort')

const start = async() => {
    try {
        //db
        mongoose.connect('mongodb+srv://PlaytikaCloudStore:First1Logon@cloudstore.trd0w.mongodb.net/cloudestore?retryWrites=true&w=majority', () => {
                console.log("Data base connect successfully")
            })
            //server
        app.listen(process.env.PORT || 5005, () => {
            console.log("Server run on port:", 5005);
        })
    } catch (error) {
        console.log(error);
    }
}

start()