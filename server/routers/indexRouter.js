const express = require("express");
const router = express();

const m1Cont = require("../controllers/m1Controller");
// const middleware = require("../middlewares/indexMiddleware");

// Testing Routes
router.get("/", m1Cont.testConn);
router.get("/mkdata", m1Cont.mkData);

// GET Routes



// POST Routes
router.post("/newUser", m1Cont.postRegUser); // change to post when forms are received
router.post("/login", m1Cont.postLogin);
router.post("/newDisease", m1Cont.postAddDisease);
router.post("/newPatient", m1Cont.postAddPatient);
router.post("/newEvent", m1Cont.postAddEvent);
router.post("/newCase", m1Cont.postNewCase);
// 404 PAGE
/*
router.get("*", function(req, res) {
	res.send("page not found!");
});
*/

module.exports = router;
