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
	/*
	 * GET METHODS
	 */
	
	testConn: async function(req, res) {
		let state = await db.testConn();
		if (state) res.send("works fine!");
		else res.send("oh no!");
	},
	
	mkData: async function(req, res) {
		let r = await db.exec("SELECT * FROM mmchddb.USER_SETTINGS;");
		if (r) res.status(200).send(r);
		else res.status(500).send("problems");
	},
	
	getAllProgTargets: async function(req, res) {
		try {
			let match = await db.exec(`SELECT t.*, tr.*, d.diseaseName FROM mmchddb.TARGETS t
					LEFT JOIN mmchddb.TARGETS_REF tr ON tr.targetID = t.targetID
					LEFT JOIN mmchddb.DISEASES d ON tr.diseaseID = d.diseaseID
					WHERE t.userID = '${req.query.userID}';`);
			let adjMatch = match.reduce((acc, obj) => {
				let diseaseName = obj["diseaseName"];
				if (acc.find(e => e.disease === diseaseName) === undefined) acc.push({disease: diseaseName, indicators: [obj]});
				else acc[acc.map(e => e.disease).indexOf(diseaseName)].indicators.push(obj);
				return acc;
			}, []);
			res.status(200).send(adjMatch);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getProgAccomps: async function(req, res) {
		let match = [],
				cols = ["conf", "LabConf", "total", "population", "month"],
				returnBody = {},
				druName = "N/A",
				year = 2022, month = (new Date()).getMonth(),
				existCheck, existProgAccoID;
		try {
			// check first if the progAccompID exists
			existCheck = await db.findRows("mmchddb.PROGRAM_ACCOMPS", {
				diseaseID: req.query.diseaseID,
				userID: req.query.userID,
				year: (new Date()).getFullYear()
			});
			if (existCheck.length === 0) {
				// generate prog accomp
				existProgAccoID = (await generateID("mmchddb.PROGRAM_ACCOMPS")).id
				await db.insertOne("mmchddb.PROGRAM_ACCOMPS", {
					progAccompID: existProgAccoID,
					diseaseID: req.query.diseaseID,
					userID: req.query.userID,
					year: (new Date()).getFullYear(),
					dateUpdated: new Date()
				});
			} else existProgAccoID = existCheck[0].progAccompID;
			
			// check if month exists too
			existCheck = await db.findRows("mmchddb.PROGRAM_ACCOMP_DATA", {
				progAccompID: existProgAccoID,
				month: month
			});
			if (existCheck.length === 0) {
				// generate prog accomp data
				await db.insertOne("mmchddb.PROGRAM_ACCOMP_DATA", {
					progAccompID: existProgAccoID, month: month,
					populationTotal: 0, populationRisk: 0,
					confCasesTotal: "0, 0", confCases5above: "0, 0",
					confCases5below: "0, 0", confCasesPreg: "0, 0",
					malariaLabConf: "0, 0", malariaLabConfFalci: "0, 0",
					malariaLabConfVivax: "0, 0", malariaLabConfOvale: "0, 0",
					malariaLabConfMalar: "0, 0", confCasesMethod: "0, 0",
					confCasesMethodSlide: "0, 0", confCasesMethodRDT: "0, 0",
					totalLLIN: "0, 0", totalMalariaDeaths: "0, 0"
				});
			}
			
			// regular viewing of paccomp
			if (req.query.progAccompID || existProgAccoID) {
				match = await db.exec(`SELECT pa.*, d.diseaseName, u.druName, a.*, pad.*
						FROM mmchddb.PROGRAM_ACCOMPS pa
						LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = pa.diseaseID
						LEFT JOIN mmchddb.USERS u ON u.userID = pa.userID
						LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID
						LEFT JOIN mmchddb.PROGRAM_ACCOMP_DATA pad ON pad.progAccompID = pa.progAccompID
						WHERE pa.progAccompID = '${req.query.progAccompID || existProgAccoID}';`);
			} else {
				match = await db.exec(`SELECT pa.*, d.diseaseName, u.druName, a.*, pad.*
						FROM mmchddb.PROGRAM_ACCOMPS pa
						LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = pa.diseaseID
						LEFT JOIN mmchddb.USERS u ON u.userID = pa.userID
						LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID
						LEFT JOIN mmchddb.PROGRAM_ACCOMP_DATA pad ON pad.progAccompID = pa.progAccompID
						WHERE pa.userID = '${req.query.userID}' AND pa.diseaseID = '${req.query.diseaseID}';`);
			}
			druName = match[0].druName;
			year = match[0].year;
			
			// converting db resultset to a different format
			match.forEach(e1 => {
				// year object initialisation
				e1["y" + e1.year] = {};
				Object.keys(e1).forEach(e2 => {
					// if the key name is part of the rows of the prodAccom
					if (cols.slice(0, 3).some(e3 => e2.includes(e3))) {
						// split the string into array of two ints for M and F
						e1[e2] = e1[e2].split(", ");
						e1[e2].map(e3 => parseInt(e3));
					}
					// if part of the progAccompData, insert into year object as entry
					if (cols.some(e3 => e2.includes(e3))) {
						e1["y" + e1.year][e2] = e1[e2];
						delete e1[e2];
					}
				});
			});
			// grouping all year objects together into one array per year
			match.forEach(e1 => {
				let yearCode = Object.keys(e1).find(e2 => e2.match(/y\d{4}/g));
				if (!returnBody[yearCode]) returnBody[yearCode] = [];
				// assuming the array is sorted by month
				returnBody[yearCode].push(e1[yearCode]);
			});
			res.status(200).send({
				dataSets: returnBody,
				druName: druName,
				year: year
			});
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getAllProgAccomps: async function(req, res) {
		try {
			let match = await db.exec(`SELECT pa.*, d.diseaseName, u.druName, a.*
					FROM mmchddb.PROGRAM_ACCOMPS pa
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = pa.diseaseID
					LEFT JOIN mmchddb.USERS u ON u.userID = pa.userID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID;`);
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getTCLEntry: async function(req, res) {
		try {
			let match = await db.exec(`SELECT td.*, p.*, rf.*, a.city
					FROM mmchddb.TCL_DATA td
					LEFT JOIN mmchddb.PATIENTS p ON p.patientID = td.patientID
					LEFT JOIN mmchddb.ADDRESS a ON a.addressID = p.caddressID
					LEFT JOIN mmchddb.CASES c ON c.patientID = p.patientID
					LEFT JOIN mmchddb.RISK_FACTORS rf ON rf.caseID = c.caseID
					WHERE td.patientID = ${ req.query.patientID };`);
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getTCL: async function(req, res) {
		try {
			let userSettings = await db.findRows("mmchddb.USER_SETTINGS", {userID: req.query.userID});
			let userData = await db.exec(`SELECT u.userType AS druType, u.druName, a.*
					FROM mmchddb.USERS u
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID
					WHERE u.userID = '${ req.query.userID }';`);
			if (!!req.query.TCLID) { // getting for view page
				let match = await db.exec(`SELECT td.*, t.*, p.*, a1.city AS patientCity,
						u.druName, a2.city AS druCity, a2.brgy AS druBrgy
						FROM mmchddb.TCL_DATA td
						LEFT JOIN mmchddb.TCLS t ON t.TCLID = td.TCLID
						LEFT JOIN mmchddb.PATIENTS p ON p.patientID = td.patientID
						LEFT JOIN mmchddb.ADDRESSES a1 ON a1.addressID = p.caddressID
						LEFT JOIN mmchddb.USERS u ON u.userID = t.userID
						LEFT JOIN mmchddb.ADDRESSES a2 ON a2.addressID = u.addressID
						WHERE t.TCLID = '${ req.query.TCLID }';`);
				let TCL = await db.exec(`SELECT t.*
						FROM mmchddb.TCLS t
						WHERE t.TCLID = '${ req.query.TCLID }';`);
				res.status(200).send({
					TCL: match.length ? match[match.length - 1] : TCL[0],
					tclData: match,
					pushDataAccept: userSettings[0].pushDataAccept,
					userData: userData[0]
				});
			} else { // getting for add page
				let r = await db.findRows("mmchddb.TCLS", {
					diseaseID: req.query.diseaseID,
					userID: req.query.userID
				});
				if (r.length > 0) {
					// collect the patients and TCL data with that TCLID
					let data = await db.exec(`SELECT t.*, p.*, a.city, td.dateAdded
							FROM mmchddb.TCL_DATA td
							LEFT JOIN mmchddb.TCLS t ON t.TCLID = td.TCLID
							LEFT JOIN mmchddb.PATIENTS p ON p.patientID = td.patientID
							LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = p.caddressID
							WHERE td.TCLID = '${r[r.length - 1].TCLID}';`);
					res.status(200).send({
						TCL: r[r.length - 1],
						tclData: data,
						pushDataAccept: userSettings[0].pushDataAccept,
						userData: userData[0]
					});
				} else {
					let thisDate = new Date(), firstTCL = {
						TCLID: (await generateID("mmchddb.TCLS")).id,
						diseaseID: req.query.diseaseID,
						userID: req.query.userID,
						month: thisDate.getMonth(),
						year: thisDate.getFullYear()
					};
					let firstR = await db.insertOne("mmchddb.TCLS", firstTCL);
					res.status(200).send({
						TCL: firstTCL,
						tclData: [],
						pushDataAccept: userSettings[0].pushDataAccept,
						userData: userData[0]
					});
				}
			}
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getAllTCLs: async function(req, res) {
		try {
			let match = await db.exec(`SELECT d.diseaseName, u.druName, a.*, t.*,
					SUM(CASE WHEN td.immunizationStatus = "Complete" THEN 1 ELSE 0 END) AS immuniPati,
					COUNT(td.TCLID) AS totalPatients
					FROM mmchddb.TCLS t
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = t.diseaseID
					LEFT JOIN mmchddb.USERS u ON u.userID = t.userID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID
					LEFT JOIN mmchddb.TCL_DATA td ON td.TCLID = t.TCLID
					GROUP BY td.TCLID;`);
			res.status(200).send(match);
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
