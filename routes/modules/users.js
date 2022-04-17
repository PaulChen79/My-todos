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
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
        errors.push({ message: "You have to fill all the fields." })
    }

    if (password !== confirmPassword) {
        errors.push({ message: "Confirm Password have to be equal." })
    }

    if (errors.length) {
        return res.render('register', { errors, name, email, password, confirmPassword })
    }

    User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ message: "This Email have been registered." })
                res.render("register", { errors, name, email, password, confirmPassword })
            } else {
                User.create({ name: name, email: email, password: password })
                    .then(() => res.redirect("/"))
                    .catch(error => console.error(error))
            }
        })
        .catch(error => console.error(error))
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash("success_msg", "You have loged out.")
    res.redirect('/users/login')
})

module.exports = router