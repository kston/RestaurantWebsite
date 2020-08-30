var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {

    res.render("admin/index")

})

router.get("/login", function(req, res, next) {
    if(!req.session.views) req.session.views = 0;
    console.log(req.session.views++);

    res.render("admin/login")

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