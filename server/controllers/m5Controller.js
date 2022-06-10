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
		let rows = await db.exec(`SELECT * FROM mmchddb.RISK_FACTORS;`);
		// console.log("row count: " + rows.length);
		
		rows.forEach(async function(e1, i) {
			// if (i <= 0) {}
			let caseID = e1.caseID, index = i + 1;
			arr = [];
			Object.entries(e1).forEach(async function (e2) {
				if (["L", "C", "H", "O"].includes(e2[0].charAt(0)) && typeof e2[1] === "number") {
					arr.push({
						caseIndex: index,
						caseID: caseID,
						riskName: e2[0],
						riskValue: e2[1]
					});
				}
			});
			// console.log(arr.map(Object.values));
			await db.insertRows("mmchddb.RISK_FACTORS_E", Object.keys(arr[0]), arr.map(Object.values));
		});
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
			let seMatch = await db.exec(`SELECT se.*, u.druName
					FROM mmchddb.SURVEILLANCE_EVAL se
					LEFT JOIN mmchddb.USERS u ON se.userID = u.userID
					WHERE u.druName = "${req.query.druName}";`);
			// health program eval
			let teMatch = await db.exec(`SELECT te.*, u.druName
					FROM mmchddb.TCL_EVAL te
					LEFT JOIN mmchddb.USERS u ON te.userID = u.userID
					WHERE u.druName = "${req.query.druName}";`);
			
			res.status(200).send({ cases, seMatch, teMatch });
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/*
	 * POST METHODS
	 */
	
	postEditProgTargets: async function(req, res) {
		let { progAccompID, userID, diseaseID, data } = req.body;
		try {
			
			res.status(200).send("Update targets successful!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postEditProgAccomp: async function(req, res) {
		let { progAccompID, userID, diseaseID, data } = req.body,
				cols = ["conf", "LabConf", "total"];
		try {
			let month = data.month;
			delete data.month;
			Object.keys(data).forEach(e1 => {
				if (cols.some(e2 => e1.includes(e2))) {
					data[e1] = data[e1].join(", ");
				}
			});
			await db.updateRows("mmchddb.PROGRAM_ACCOMP_DATA", {
				progAccompID: progAccompID,
				month: month
			}, data);
			await db.updateRows("mmchddb.PROGRAM_ACCOMPS", {
				progAccompID: progAccompID
			}, { dateUpdated: new Date() });
			res.status(200).send("Update targets successful!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postSubmitProgAccomp: async function(req, res) {
		let { progAccompID, userID, diseaseID } = req.body;
		try {
			// get all data rows
			let progData = await db.exec(`SELECT pa.year, pad.*
					FROM mmchddb.PROGRAM_ACCOMPS pa
					JOIN PROGRAM_ACCOMP_DATA pad
					ON pad.progAccompID = pa.progAccompID
					WHERE pa.progAccompID = '${progAccompID}'`);
			let newProgObj;
			if (progData.length < 12) {
				// make new month
				newProgObj = {
					progAccompID: progAccompID,
					month: progData.length,
					populationTotal: progData.length > 0 ? progData[progData.length - 1].populationTotal : 0,
					populationRisk: 0,
					confCasesTotal: "0, 0",
					confCases5above: "0, 0",
					confCases5below: "0, 0",
					confCasesPreg: "0, 0",
					malariaLabConf: "0, 0",
					malariaLabConfFalci: "0, 0",
					malariaLabConfVivax: "0, 0",
					malariaLabConfOvale: "0, 0",
					malariaLabConfMalar: "0, 0",
					confCasesMethod: "0, 0",
					confCasesMethodSlide: "0, 0",
					confCasesMethodRDT: "0, 0",
					totalLLIN: "0, 0",
					totalMalariaDeaths: "0, 0"
				};
			} else {
				// make new prog accomp
				let newAccomp = await generateID("mmchddb.PROGRAM_ACCOMPS");
				await db.insertOne("mmchddb.PROGRAM_ACCOMPS", {
					progAccompID: newAccomp.id,
					diseaseID: diseaseID,
					userID: userID,
					year: progData[0].year + 1,
					dateUpdated: new Date()
				});
				newProgObj = {
					progAccompID: newAccomp.id,
					month: 0,
					populationTotal: 0,
					populationRisk: 0,
					confCasesTotal: "0, 0",
					confCases5above: "0, 0",
					confCases5below: "0, 0",
					confCasesPreg: "0, 0",
					malariaLabConf: "0, 0",
					malariaLabConfFalci: "0, 0",
					malariaLabConfVivax: "0, 0",
					malariaLabConfOvale: "0, 0",
					malariaLabConfMalar: "0, 0",
					confCasesMethod: "0, 0",
					confCasesMethodSlide: "0, 0",
					confCasesMethodRDT: "0, 0",
					totalLLIN: "0, 0",
					totalMalariaDeaths: "0, 0"
				};
			}
			await db.insertOne("mmchddb.PROGRAM_ACCOMP_DATA", newProgObj);
			res.status(200).send("Update targets successful!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postNewImmuProgEntry: async function(req, res) {
		let { formData, immunisationData, TCLID } = req.body;
		try {
			console.log(formData);
			
			// inserting current address
			let currAddrID = await generateID("mmchddb.ADDRESSES", {
				houseStreet: formData.patient.currHouseStreet,
				brgy: formData.patient.currBrgy,
				city: formData.patient.currCity
			});
			formData.patient.caddressID = currAddrID.id;
			if (!currAddrID.exists) {
				let currAddr = new Address(formData.patient.caddressID, formData.patient.currHouseStreet, formData.patient.currBrgy, formData.patient.currCity);
				await db.insertOne("mmchddb.ADDRESSES", currAddr);
			}
			
			// inserting permanent address
			let permAddrID = await generateID("mmchddb.ADDRESSES", {
				houseStreet: formData.patient.permHouseStreet,
				brgy: formData.patient.permBrgy,
				city: formData.patient.permCity
			});
			formData.patient.paddressID = permAddrID.id;
			if (!permAddrID.exists) {
				let permAddr = new Address(formData.patient.paddressID, formData.patient.permHouseStreet, formData.patient.permBrgy, formData.patient.permCity);
				await db.insertOne("mmchddb.ADDRESSES", permAddr);
			}
			
			// delete fields
			delete formData.patient.currHouseStreet;
			delete formData.patient.currBrgy;
			delete formData.patient.currCity;
			delete formData.patient.permHouseStreet;
			delete formData.patient.permBrgy;
			delete formData.patient.permCity;
			
			// adding patient's data
			let genPatientID = await generateID("mmchddb.PATIENTS", {
				lastName: formData.patient.lastName,
				firstName: formData.patient.firstName,
				midName: formData.patient.midName
			});
			formData.patient.patientID = genPatientID.id;
			if (!genPatientID.exists) {
				result = await db.insertOne("mmchddb.PATIENTS", formData.patient);
			}
			
			let insertObj = {
				TCLID: TCLID,
				patientID: formData.patient.patientID,
				dateAdded: new Date(),
				immunizationStatus: "Ongoing",
				...immunisationData
			};
			await db.insertOne("mmchddb.TCL_DATA", insertObj);
			res.status(200).send(insertObj);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
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
			
			// generate new CRFs and update past ones
			for (let i = 0; i < tclRow.length; i++) {
				// updating TCL
				await db.updateRows("mmchddb.TCLS", {TCLID: tclRow[i].TCLID}, {
					isPushed: true,
					status: "Submitted",
					dateSubmitted: new Date()
				});
				
				// generating new TCL
				let newTCL = (await generateID("mmchddb.TCLS")).id;
				currMonth = new Date(tclRow[i].year, tclRow[i].month, 0);
				nextMonth = new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, currMonth.getDate());
				await db.insertOne("mmchddb.TCLS", {
					TCLID: newTCL,
					diseaseID: tclRow[i].diseaseID,
					userID: tclRow[i].userID,
					dateSubmitted: null,
					month: nextMonth.getMonth(),
					year: nextMonth.getFullYear(),
					isPushed: false,
					status: "Ongoing"
				});
			}
			res.status(200).send("TCL has been submitted successfully!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/*
	 * CRON METHODS
	 */
	
	cronTCLPushData: async function() {
		try {
			let tcls = await db.exec(`SELECT * FROM mmchddb.TCLS WHERE isPushed = 0 AND status = 'Ongoing';`);
			
			// generate new CRFs and update past ones
			for (let i = 0; i < tcls.length; i++) {
				// updating TCL
				await db.updateRows("mmchddb.TCLS", {TCLID: tcls[i].TCLID}, {
					isPushed: true,
					status: "Submitted",
					dateSubmitted: new Date()
				});
				
				// generating new TCL
				let newTCL = (await generateID("mmchddb.TCLS")).id;
				currMonth = new Date(tcls[i].year, tcls[i].month, 0);
				nextMonth = new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, currMonth.getDate());
				await db.insertOne("mmchddb.TCLS", {
					TCLID: newTCL,
					diseaseID: tcls[i].diseaseID,
					userID: tcls[i].userID,
					dateSubmitted: null,
					month: nextMonth.getMonth(),
					year: nextMonth.getFullYear(),
					isPushed: false,
					status: "Ongoing"
				});
			}
			console.log("TCLs have been pushed successfully!");
		} catch (e) {
			console.log(e);
			console.log("Server Error");
		}
	},
};

module.exports = indexFunctions;
