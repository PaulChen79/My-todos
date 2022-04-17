module.exports = {
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash("warning_msg", "You Have to login first to use this Todos.")
        res.redirect("/users/login")
    }
}