const express = require("express")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const routes = require("./routes")
const app = express()
require('./config/mongoose')
const PORT = process.env.PORT || 3000



app.engine("hbs", exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set("view engine", "hbs")
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

app.use(routes)

app.listen(PORT, () => {
    console.log("Server is listening on port 3000");
})