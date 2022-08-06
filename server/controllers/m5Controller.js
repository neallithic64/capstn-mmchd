const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");

Date.prototype.getWeek = function() {
	let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
	let dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/** This helper function only accepts Date objects. Function also includes checking
 * if the object itself is valid. If the object-to-be-converted is itself a String, it
 * is advised to pass it through `new Date()` first before passing to this function.
 * This will return a String representation of the corrected date in Philippine Standard
 * Time. This is done by offsetting the date by a constant of 8 hours in miliseconds.
 */
function convDatePHT (d) {
	return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
}

function dateToString(date) {
	let dateString = new Date(date);
	let month = dateString.getMonth() + 1;
	return dateString.getFullYear()+'-'+ month.toString().padStart(2,'0') +'-'+dateString.getDate().toString().padStart(2,'0');
}

const indexFunctions = {
	evalCalc: async function(req, res) {
		// need to calculate the evals
		let ids;
		// surveillance eval
		/* how to get the remaining columns:
			evalID: to be generated in genID(),
			reportsOnTime: reportsReceived operation,
			reportsExpected: reportsReceived operation,
			withDetected: hard-code to 5,
			withDisease: hard-code to 5,
			withoutDetected: hard-code to 5,
			withoutDisease: hard-code to 5,
			timeliness: reportsOnTime / reportsReceived,
			completeness: reportsReceived / reportsExpected
		 */
		let casesQuery = await db.exec(`SELECT YEARWEEK(c.reportDate, 2) AS weekNo,
				COUNT(c.caseID) AS reportsReceived, c.diseaseID, a.city, 5 AS withDetected,
				5 AS withDisease, 5 AS withoutDetected, 5 AS withoutDisease, c.reportedBy
				FROM mmchddb.CASES c
				LEFT JOIN mmchddb.USERS u ON c.reportedBy = u.userID
				LEFT JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID
				GROUP BY weekNo;`);
		ids = await db.generateIDs("mmchddb.SURVEILLANCE_EVAL", casesQuery.length);
		casesQuery.forEach((e, i) => {
			e.evalID = ids[i];
			e.reportsOnTime = e.reportsReceived - Math.floor(10 * Math.random()) - 1;
			e.reportsExpected = e.reportsReceived + Math.ceil(10 * Math.random()) + 1;
			e.timeliness = e.reportsOnTime / e.reportsReceived * 100;
			e.completeness = e.reportsReceived / e.reportsExpected * 100;
		});
		
		// tcl eval
		/* columns:
			pevalID: to be generated in genID("TCL_EVAL"),
			dateEvaluated: 2022-01-01 02:00:00,
			timeliness: hard-code to 1,
			completeness: hard-code to 1,
			oddsRatio
			*/
		let TCLQuery = await db.exec(`SELECT t.TCLID,
				COUNT(td.patientID) AS cases, d.diseaseName AS disease,
				SUM(IF(c.caseLevel LIKE "%Confirm%", 1, 0)) AS confirmCount,
				SUM(IF(c.caseLevel NOT LIKE "%Confirm%", 1, 0)) AS unconfirmCount,
				SUM(CASE WHEN td.immunizationStatus = "Complete" THEN 1 ELSE 0 END) AS treated
				FROM mmchddb.TCLS t
				LEFT JOIN mmchddb.TCL_DATA td ON t.TCLID = td.TCLID
				LEFT JOIN mmchddb.CASES c ON c.patientID = td.patientID
				LEFT JOIN mmchddb.DISEASES d ON t.diseaseID = d.diseaseID
				GROUP BY t.TCLID;`);
		ids = await db.generateIDs("mmchddb.TCL_EVAL", casesQuery.length);
		TCLQuery.forEach((e, i) => {
			e.pevalID = ids[i];
			e.dateEvaluated = new Date("2022-01-01 02:00:00");
			e.timeliness = 1;
			e.completeness = 1;
			e.confirmCount = parseInt(e.confirmCount);
			e.unconfirmCount = parseInt(e.unconfirmCount);
			e.treated = parseInt(e.treated);
			e.oddsRatio = !!e.confirmCount && !!e.unconfirmCount ? e.confirmCount / e.unconfirmCount : 0;
		});
		res.status(200).send(casesQuery);
	},
	
	/*
	 * GET METHODS
	 */
	
	getAllDRUs: async function(req, res) {
		try {
			let match = await db.exec(`SELECT u.druName FROM mmchddb.USERS u GROUP BY u.druName;`);
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getAllHealthProgEvals: async function(req, res) {
		let riskCateg = ["L", "H", "C", "O"];
		try {
			// health program eval
			let teMatch = await db.exec(`SELECT te.*, d.diseaseName AS disease, COUNT(td.patientID) AS cases,
					SUM(CASE WHEN td.immunizationStatus = "Complete" THEN 1 ELSE 0 END) AS treated
					FROM mmchddb.TCL_EVAL te
					LEFT JOIN mmchddb.TCLS t ON te.TCLID = t.TCLID
					LEFT JOIN mmchddb.TCL_DATA td ON te.TCLID = td.TCLID
					LEFT JOIN mmchddb.DISEASES d ON t.diseaseID = d.diseaseID
					GROUP BY te.TCLID;`);
			
			// retrieving all risk factors while calculating risk ratio
			let riskFactMatch = await db.exec(`SELECT rfd.riskName, rfd.diseaseName,
					(rfd.exposedDisease / rfd.totalExposed) /
					(rfd.unexposedDisease / rfd.totalUnexposed) AS risk
					FROM mmchddb.RISK_FACTORS_D rfd;`);
			
			// transposing the risk factors
			let riskPivots = riskFactMatch.reduce(function(prev, riskFact) {
				let findElem = prev.find(e => e.diseaseName === riskFact.diseaseName);
				if (findElem && findElem["risk" + (riskCateg.indexOf(riskFact.riskName.charAt(0)) + 1)][1] < riskFact.risk) {
					// case 1, transforming the risk factor to match frontend format + plaintext
					findElem["risk" + (riskCateg.indexOf(riskFact.riskName.charAt(0)) + 1)] = [riskFact.riskName, riskFact.risk];
					return prev;
				} else if (findElem) {
					// case 2, pass
					return prev;
				} else {
					// case 0, initialising array then pushing
					let tempElem = {
						diseaseName: riskFact.diseaseName,
						risk1: ["", 0],
						risk2: ["", 0],
						risk3: ["", 0],
						risk4: ["", 0]
					};
					tempElem["risk" + (riskCateg.indexOf(riskFact.riskName.charAt(0)) + 1)] = [riskFact.riskName, riskFact.risk];
					prev.push(tempElem);
					return prev;
				}
			}, []);
			
			// transforming data for displaying
			riskPivots.forEach(e => {
				for (let prop in e) {
					e[prop] = Array.isArray(e[prop]) ? e[prop].join(" - ").substring(1) : e[prop];
				}
			});
			res.status(200).send({ teMatch, riskPivots });
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getDRUEvals: async function(req, res) {
		try {
			let cases = [], queryTemp;
			for (let i = 0; i < 52; i++) {
				cases.push({ weekNo: i + 202201, caseCount: 0, CIFSubmission: "", CRFSubmission: "" });
			}
			
			// DRU eval
			let casesQuery = await db.exec(`SELECT YEARWEEK(c.reportDate, 2) AS weekNo,
					COUNT(c.caseID) AS caseCount, 1 AS CIFSubmission, u.druName
					FROM mmchddb.CASES c
					LEFT JOIN mmchddb.USERS u ON c.reportedBy = u.userID
					GROUP BY weekNo
					HAVING u.druName = "${req.query.druName}";`);
			let CRFQuery = await db.exec(`SELECT c.CRFID, c.isPushed,
					CONCAT(c.year, LPAD(c.week, 2, 0)) AS weekNo, COUNT(ca.caseID) AS CRFCount,
					YEARWEEK(MAX(ca.reportDate)) AS lastCaseWeek, u.druName
					FROM mmchddb.CRFS c
					LEFT JOIN mmchddb.USERS u ON c.userID = u.userID
					LEFT JOIN mmchddb.CASES ca ON c.CRFID = ca.CRFID
					GROUP BY c.CRFID
					HAVING u.druName = "${req.query.druName}";`);
			for (let i = 0; i < cases.length; i++) {
				queryTemp = casesQuery.find(e => e.weekNo === cases[i].weekNo);
				if (queryTemp) {
					cases[i].caseCount = queryTemp.caseCount;
				}
				cases[i].CIFSubmission = cases[i].caseCount > 0 ? "YES" : "NO";
				
				// cannot use strict comparison here, one is a formatted string and one is an int
				queryTemp = CRFQuery.find(e => e.weekNo == cases[i].weekNo);
				if (queryTemp) {
					if (queryTemp.isPushed > 0) {
						if (queryTemp.CRFCount > 0) {
							if (queryTemp.weekNo > cases[i].weekNo) {
								cases[i].CRFSubmission = "Late Cases";
							} else cases[i].CRFSubmission = "Cases Submitted";
						} else cases[i].CRFSubmission = "Zero Report";
					} else cases[i].CRFSubmission = "Ongoing";
				} else cases[i].CRFSubmission = "No Data";
			}
			
			// surveillance eval
			let seMatch = await db.exec(`SELECT se.*, u.druName, COUNT(c.caseID) AS totalCases
					FROM mmchddb.SURVEILLANCE_EVAL se
					LEFT JOIN mmchddb.USERS u ON se.userID = u.userID
					LEFT JOIN mmchddb.CASES c ON se.userID = c.reportedBy
					GROUP BY se.evalID
					HAVING u.druName = "${req.query.druName}";`);
			res.status(200).send({ cases, seMatch });
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/*
	 * POST METHODS
	 */
	
	postEditPatientTCL: async function(req, res) {
		let { loadedData, patientID } = req.body;
		try {
			delete loadedData.dateAdded;
			delete loadedData.immunizationStatus;
			delete loadedData.TCLID;
			
			// getting patient's TCL data
			let tclData = await db.findRows("mmchddb.TCL_DATA", {patientID: patientID});
			await db.updateRows("mmchddb.TCL_DATA", {patientID: patientID}, {...loadedData, status: "Complete"});
			res.status(200).send("Update targets successful!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
};

module.exports = indexFunctions;
