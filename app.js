const express = require("express")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const routes = require("./routes")
const app = express()
require("dotenv").config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
})

app.engine("hbs", exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set("view engine", "hbs")
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride, "_method")

app.use(routes)

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})