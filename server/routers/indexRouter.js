const express = require("express");
const router = express();
const cron = require('node-cron');
const db = require("../models/db");
const m1Cont = require("../controllers/m1Controller");
const m2Cont = require("../controllers/m2Controller");
const m3Cont = require("../controllers/m3Controller");
const m4Cont = require("../controllers/m4Controller");
const m5Cont = require("../controllers/m5Controller");
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
router.get("/getLabUsers", m1Cont.getLabUsers);

router.get("/getCases", m1Cont.getCases);
router.get("/getAllCRFs", m1Cont.getAllCRFs);
router.get("/getNotifs", m1Cont.getAllNotifs);
router.get("/getNotification", m1Cont.getNotification);
router.get("/getCIF", m1Cont.getCIF);
router.get("/getCRF", m1Cont.getCRF);
router.get("/getCRFPage", m1Cont.getCRFPage);
router.get("/getNewNotifs", m1Cont.getNewNotifs);
router.get("/getPatientData", m1Cont.getPatientData);

router.get("/getAllOutbreaks", m1Cont.getAllOutbreaks);
router.get("/getOutbreak", m1Cont.getOutbreak);
router.get("/getOutbreakAlertDetails", m1Cont.getOutbreakAlertDetails);
router.get("/getOngoingOutbreaks", m1Cont.getOngoingOutbreaks);
router.get("/getAllEvents", m1Cont.getAllEvents);
router.get("/getEvent", m1Cont.getEvent);
router.get("/getSettings", m1Cont.getSettings);

router.get("/dashboardData", m2Cont.getIndexData);

router.get("/getFileBlob", m3Cont.getFileBlob);
router.get("/getReport", m3Cont.getReport);
router.get("/getAllReports", m3Cont.getAllReports);
router.get("/getReportBulletin", m3Cont.getReportBulletin);

router.get("/getProgTargets", m4Cont.getAllProgTargets);
router.get("/getProgAccomps", m4Cont.getAllProgAccomps);
router.get("/getViewProgAccomp", m4Cont.getProgAccomps);
router.get("/getTCLEntry", m4Cont.getTCLEntry);
router.get("/getTCL", m4Cont.getTCL);
router.get("/getAllTCLs", m4Cont.getAllTCLs);

router.get("/getAllDRUs", m5Cont.getAllDRUs);
router.get("/getDRUEvals", m5Cont.getDRUEvals);


// POST Routes
router.post("/login", m1Cont.postLogin);
router.post("/newUser", m1Cont.postRegUser);
router.post("/auth/logout", m1Cont.postLogout);
router.post("/newDisease", m1Cont.postAddDisease);
router.post("/newPatient", m1Cont.postAddPatient);
router.post("/newEvent", m1Cont.postAddEvent);
router.post("/newCase", m1Cont.postNewCase);

router.post("/submitCRF", m1Cont.postSubmitCRF);
router.post("/editDiseaseDef", m1Cont.postEditDiseaseDef);
router.post("/updateCaseStatus", m1Cont.postUpdateCaseStatus);
router.post("/editCIFLab", m1Cont.postEditCIFLab);
router.post("/editPatientOutcome", m1Cont.postEditPatientOutcome);
router.post("/updatePatientDetails", m1Cont.postUpdatePatient);

router.post("/updateEventStatus", m1Cont.postUpdateEventStatus);
router.post("/updatePushData", m1Cont.postUpdatePushData);
router.post("/updateOutbreakStatus", m1Cont.postUpdateOutbreakStatus);
router.post("/updateSettings", m1Cont.postUpdateSettings);

router.post("/postFileBlob", m3Cont.postFileBlob);
router.post("/postAddReport", m3Cont.postAddReport);
router.post("/editApproveReport", m3Cont.postEditApproveReport);

router.post("/editProgTargets", m4Cont.postEditProgTargets);
router.post("/editProgAccomp", m4Cont.postEditProgAccomp);
router.post("/submitProgAccomp", m4Cont.postSubmitProgAccomp);
router.post("/newImmuProgEntry", m4Cont.postNewImmuProgEntry);
router.post("/editPatientTCL", m4Cont.postEditPatientTCL);
router.post("/submitTCL", m4Cont.postSubmitTCL);


// CRON Routes
(async () => {
	try {
		let sysSet = (await db.exec(`SELECT * FROM mmchddb.SYSTEM_SETTINGS;`))[0];
		cron.schedule(sysSet.reportingMinute + " " + sysSet.reportingHour + " * * " + sysSet.reportingDay, m1Cont.cronCRFPushData);
	} catch (e) {
		console.log(e);
	}
})();
cron.schedule("00 14 * * 3", m1Cont.cronCRFDeadlineNotif);
cron.schedule("00 17 * * 6", m1Cont.cronUpdateThresholds);
cron.schedule("0 0 17 * * 5#2", m4Cont.cronTCLPushData);

// 404 PAGE
router.get("*", function(req, res) {
	res.status(404).send("page not found!");
});


module.exports = router;
