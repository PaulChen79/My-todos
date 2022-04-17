const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
    res.render("login")
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login"
}))

router.get('/register', (req, res) => {
    res.render("register")
})

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    User.findOne({ email: email }).then(user => {
            if (user) {
                res.render("register", { name, email, password, confirmPassword })
            } else {
                User.create({ name: name, email: email, password: password })
                    .then(() => res.redirect("/"))
                    .catch(error => console.error(error))
            }
        })
        .catch(error => console.error(error))
})

module.exports = router