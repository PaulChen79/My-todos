const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

router.get('/login', (req, res) => {
    res.render("login", { "warning_msg": req.flash("error") })
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
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
                return res.render("register", { errors, name, email, password, confirmPassword })
            }

            return bcrypt
                .genSalt(10)
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => User
                    .create({ name, email, password: hash })
                    .then(() => res.redirect("/"))
                    .catch(error => console.error(error)))
        })
        .catch(error => console.error(error))
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash("success_msg", "You have loged out.")
    res.redirect('/users/login')
})

module.exports = router