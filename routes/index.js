const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", { title: "Home Page" });
});

router.get("/about", (req, res) => {
    res.render("about", { title: "About Us" });
});

module.exports = router;
