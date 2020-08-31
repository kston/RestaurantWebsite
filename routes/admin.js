var express = require("express");
var users = require("./../public/inc/users")
var router = express.Router();

router.get("/", function(req, res, next) {

    res.render("admin/index")

})

router.get("/login", function(req, res, next) {

users.render(req, res, null );


})
router.post("/login", function(req, res, next) {

    if(!req.body.email) {
        users.render(req, res, "Preencha o email")
    } else if (!req.body.password) {
        users.render(req, res, "Preencha o campo senha")
    } else {
        users.login(req.body.email, req.body.password).then(user => {

            req.session.user = user;

            res.redirect("/admin");
        

        }).catch(err => {

            users.render(req, res, err.message || err);
        })
    }

})

router.get("/menus", function(req, res, next) {

    res.render("admin/menus")

})

router.get("/emails", function(req, res, next) {

    res.render("admin/emails")

})

router.get("/reservations", function(req, res, next) {

    res.render("admin/reservations")

})

router.get("/contacts", function(req, res, next) {

    res.render("admin/contacts")

})

router.get("/users", function(req, res, next) {

    res.render("admin/users")

})
module.exports = router;