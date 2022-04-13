const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
    // 連線異常
db.on('error', () => {
        console.log('mongodb error!')
    })
    // 連線成功
db.once('open', () => {
    console.log('mongodb connected!')
})

app.engine("hbs", exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set("view engine", "hbs")

app.get("/", (req, res) => {
    res.render("index")
})


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})