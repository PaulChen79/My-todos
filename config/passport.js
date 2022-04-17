const passport = require("passport")
const localStrategy = require("passport-local").Strategy

const User = require("../models/user")

module.exports = (app) => {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'passwd',
        passReqToCallback: true,
        session: false
    }, (req, email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "This Email is not exist." })
                }
                if (user.password !== password) {
                    return done(null, false, { message: "Password incorrect." })
                }
                return done(null, user)
            })
            .catch(err => done(err, false))
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}