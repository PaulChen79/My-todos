const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const Todo = require("./models/todo")
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

app.get("/", (req, res) => {
    Todo.find()
        .lean()
        .then(todos => res.render("index", { todos }))
        .catch(error => console.error(error))

})

// Home page
app.get("/todos/new", (req, res) => {
    return res.render("new")
})

// create todo method
app.post("/todos", (req, res) => {
    const name = req.body.name
    return Todo.create({ name })
        .then(() => res.redirect("/"))
        .catch(error => console.error(error))
})

// read detail method
app.get("/todos/:id", (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then((todo) => res.render("detail", { todo }))
        .catch(error => console.error(error))
})

// update todo method
app.get("/todos/:id/edit", (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then((todo) => res.render("edit", { todo }))
        .catch(error => console.error(error))
})

app.post("/todos/:id/edit", (req, res) => {
    const id = req.params.id
    const name = req.body.name
    return Todo.findById(id)
        .then((todo) => {
            todo.name = name
            return todo.save()
        })
        .then(() => res.redirect(`/todos/${id}`))
        .catch(error => console.error(error))
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})