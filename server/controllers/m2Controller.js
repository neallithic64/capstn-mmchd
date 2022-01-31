const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");

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
		case "mmchddb.PROGRAMS":
			return "PR-";
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
	}
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
	
	getIndexData: async function(req, res){
		try{
			let latestCase = await db.exec("SELECT * FROM mmchddb.CASES c JOIN mmchddb.DISEASES d ON d.diseaseID = c.diseaseID "+
											"JOIN mmchddb.PATIENTS p ON c.patientID = p.patientID " +
											"JOIN mmchddb.ADDRESSES a ON a.addressID = p.paddressID "+"ORDER BY c.reportDate desc LIMIT 1;");
			let latestEvent = await db.exec("SELECT * FROM mmchddb.EVENTS e JOIN mmchddb.ADDRESSES a ON a.addressID = e.addressID ORDER BY e.dateReported desc LIMIT 1;");
			let latestAccomp = await db.exec("SELECT * FROM mmchddb.PROGRAM_ACCOMPS p JOIN mmchddb.DISEASES d ON d.diseaseID = p.diseaseID JOIN mmchddb.USERS u ON u.userID = p.userID JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID ORDER BY dateUpdated desc LIMIT 1;");
			let ongoingOutbreak = await db.exec("SELECT * FROM mmchddb.OUTBREAKS o JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID WHERE NOT outbreakStatus='Closed' ORDER BY startDate desc LIMIT 1;");
			if(ongoingOutbreak.length > 0){	
				let activeCases = await db.exec("SELECT * FROM mmchddb.CASES WHERE diseaseID='"+ ongoingOutbreak[0].diseaseID + "' AND reportDate >= '" +
									dateToString(ongoingOutbreak[0].startDate) +"';");
				res.status(200).send({
					latestAccomp : latestAccomp[0],
					latestCase : latestCase[0],
					latestEvent : latestEvent[0],
					ongoingOutbreak : ongoingOutbreak,
					activeCases : activeCases.length
					});
			} else 
				res.status(200).send({
					latestAccomp: latestAccomp[0],
					latestCase : latestCase[0],
					latestEvent : latestEvent[0],
					ongoingOutbreak : ongoingOutbreak
				});
			
		}catch(e){
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/*
	 * POST METHODS
	 */
	
	postEditProgTargets: async function(req, res) {
		let { userID, targets } = req.body;
		try {
			console.log(targets);
			for (let i = 0; i < targets.length; i++) {
				await db.updateRows("mmchddb.TARGETS", {
					targetID: targets[i].targetID, userID: userID
				}, {
					numerValue: targets[i].numerValue, denomValue: targets[i].denomValue
				});
			}
			res.status(200).send("Update targets successful!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
};

module.exports = indexFunctions;
