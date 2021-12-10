const express = require("express");
const router = express();
const cron = require('node-cron');
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
router.get("/getNotifs", m1Cont.getAllNotifs);
router.get("/getNotification", m1Cont.getNotification);
router.get("/getCIF", m1Cont.getCIF);
router.get("/getCRF", m1Cont.getCRF);
router.get("/getCRFPage", m1Cont.getCRFPage);
router.get("/getNewNotifs", m1Cont.getNewNotifs);

// POST Routes
router.post("/login", m1Cont.postLogin);
router.post("/newUser", m1Cont.postRegUser);
router.post("/auth/logout", m1Cont.postLogout);
router.post("/newDisease", m1Cont.postAddDisease);
router.post("/newPatient", m1Cont.postAddPatient);
router.post("/newEvent", m1Cont.postAddEvent);
router.post("/newCase", m1Cont.postNewCase);

router.post("/editDiseaseDef", m1Cont.postEditDiseaseDef);
router.post("/updateCaseStatus", m1Cont.postUpdateCaseStatus);

// CRON Routes
cron.schedule("00 14 * * 3", m1Cont.cronCRFDeadlineNotif);
cron.schedule("00 17 * * 5", m1Cont.cronCRFPushData);

/* 404 PAGE
router.get("*", function(req, res) {
	res.send("page not found!");
});
*/

module.exports = router;
