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

/** ON ID CREATION
*/
function getPrefix(table) {
	switch(table) {
		case "mmchddb.USERS":
			return "US-";
		case "mmchddb.DISEASES":
			return "DI-";
		case "mmchddb.EVENTS":
			return "EV-";
		case "mmchddb.PATIENTS":
			return "PA-";
		case "mmchddb.CASES":
			return "CA-";
		case "mmchddb.CRFS":
			return "CR-";
		case "mmchddb.NOTIFICATIONS":
			return "NO-";
		case "mmchddb.REPORTS":
			return "RE-";
		case "mmchddb.TARGETS":
			return "TA-";
		case "mmchddb.TCLS":
			return "TC-";
		case "mmchddb.AGE_RANGE_REF":
			return "AR-";
		case "mmchddb.ADDRESSES":
			return "AD-";
		case "mmchddb.OUTBREAKS":
			return "OU-";
		case "mmchddb.SURVEILLANCE_EVAL":
			return "SE-";
		case "mmchddb.PROGRAM_EVAL":
			return "PE-";
		case "mmchddb.PROGRAM_ACCOMPS":
			return "PC-";
	}
	return undefined;
}

async function generateID(table, checkObj) {
	let retObj = { exists: false, id: "" };
	
	try {
		// checking for existence
		if (table === "mmchddb.ADDRESSES") {
			let rows = await db.findRows(table, checkObj);
			if (rows.length > 0) {
				retObj.exists = true;
				retObj.id = rows[0].addressID;
			}
		} else if (table === "mmchddb.PATIENTS") {
			// JOIN to addresses? well...
			let rows = await db.findRows(table, checkObj);
			if (rows.length > 0) {
				retObj.exists = true;
				retObj.id = rows[0].patientID;
			}
		}
		
		// generating for new object/row
		if (!retObj.exists) {
			let rowcount = await db.findRowCount(table);
			let id = getPrefix(table);
			for (let i = 0; i < 13 - rowcount.toString().length; i++)
				id += '0';
			id += rowcount.toString();
			retObj.id = id;
		}
		console.log(retObj);
		return retObj;
	} catch (e) {
		console.log(e);
		return false;
	}
}

function dateToString(date) {
	let dateString = new Date(date);
	let month = dateString.getMonth() + 1;
	return dateString.getFullYear()+'-'+ month.toString().padStart(2,'0') +'-'+dateString.getDate().toString().padStart(2,'0');
}

const indexFunctions = {
	mkData: async function(req, res) {
		let arr = [];
		res.status(200).send("done");
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
			
			let riskFactMatch = await db.exec(`SELECT rfd.riskName, rfd.diseaseName,
					(rfd.exposedDisease / rfd.totalExposed) /
					(rfd.unexposedDisease / rfd.totalUnexposed) AS risk
					FROM mmchddb.RISK_FACTORS_D rfd;`);
			let riskPivots = riskFactMatch.reduce(function(prev, riskFact) {
				let findElem = prev.find(e => e.diseaseName === riskFact.diseaseName);
				if (findElem && findElem["risk" + (riskCateg.indexOf(riskFact.riskName.charAt(0)) + 1)][1] < riskFact.risk) {
					findElem["risk" + (riskCateg.indexOf(riskFact.riskName.charAt(0)) + 1)] = [riskFact.riskName, riskFact.risk];
					return prev;
				} else if (findElem) {
					return prev;
				} else {
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
	
	postSubmitTCL: async function(req, res) {
		let {TCLID} = req.body;
		try {
			let tclRow = await db.exec(`SELECT * FROM mmchddb.TCLS WHERE TCLID = '${TCLID}' AND isPushed = 0;`);
			res.status(200).send("TCL has been submitted successfully!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
};

module.exports = indexFunctions;
