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
};

module.exports = indexFunctions;
