const express = require("express");
const router = express();

const m1Cont = require("../controllers/m1Controller");
// const middleware = require("../middlewares/indexMiddleware");

// Testing Routes
router.get("/", m1Cont.testConn);
router.get("/mkdata", m1Cont.mkData);

// GET Routes
router.get("/getAllDiseases", m1Cont.getAllDiseases);
router.get("/getDisease", m1Cont.getDisease);
router.get("/getPatients", m1Cont.getPatients);
router.get("/getPatientAutofill", m1Cont.getPatientAutofill);
router.get("/getCaseDefs", m1Cont.getCaseDefinitions);
router.get("/getUser", m1Cont.getUser);
router.get("/getCases", m1Cont.getCases);

// POST Routes
router.post("/login", m1Cont.postLogin);
router.post("/newUser", m1Cont.postRegUser);
router.post("/auth/logout", m1Cont.postLogout);
router.post("/newDisease", m1Cont.postAddDisease);
router.post("/newPatient", m1Cont.postAddPatient);
router.post("/newEvent", m1Cont.postAddEvent);
router.post("/newCase", m1Cont.postNewCase);

router.post("/updateDisease", m1Cont.postUpdateCaseDef);
router.post("/updateCaseStatus", m1Cont.postUpdateCaseStatus);


/* 404 PAGE
router.get("*", function(req, res) {
	res.send("page not found!");
});
*/

module.exports = router;
