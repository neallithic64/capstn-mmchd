const express = require("express");
const router = express();

const m1Cont = require("../controllers/m1Controller");
// const middleware = require("../middlewares/indexMiddleware");

// Testing Routes
router.get("/", m1Cont.testConn);
router.get("/mkdata", m1Cont.mkData);

// GET Routes



// POST Routes



// 404 PAGE
router.get("*", function(req, res) {
	res.send("page not found!");
});

module.exports = router;
