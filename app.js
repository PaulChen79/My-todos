const express = require("express")
const session = require("express-session")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const routes = require("./routes")
const app = express()
const usePassport = require("./config/passport")
require('./config/mongoose')
const PORT = process.env.PORT || 3000



app.engine("hbs", exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set("view engine", "hbs")
app.use(session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

usePassport(app)
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    next()
})
app.use(routes)

app.listen(PORT, () => {
    console.log("Server is listening on port 3000");
})