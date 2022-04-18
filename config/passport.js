const passport = require("passport")
const bcrypt = require('bcryptjs')
const localStrategy = require("passport-local").Strategy
const FacebookStrategy = require("passport-facebook")

const User = require("../models/user")

module.exports = (app) => {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new localStrategy({
        usernameField: 'email',
        passReqToCallback: true,
        session: false
    }, (req, email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "This Email is not exist." })
                }
                return bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return done(null, false, { message: "Password incorrect." })
                    }
                    return done(null, user)
                })
            })
            .catch(err => done(err, false))
    }))

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email })
            .then(user => {
                if (user) return done(null, user)
                const randomPassword = Math.random().toString(36).slice(-8)
                bcrypt
                    .genSalt(10)
                    .then(salt => bcrypt.hash(randomPassword, salt))
                    .then(hash => User.create({ name, email, password: hash }))
                    .then(user => done(null, user))
                    .catch(error => console.error(error))
            })
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