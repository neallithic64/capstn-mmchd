const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");
const monthName= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

function dateToString(date) {
	let dateString = new Date(date);
	let month = dateString.getMonth() + 1;
	return dateString.getFullYear()+'-'+ month.toString().padStart(2,'0') +'-'+dateString.getDate().toString().padStart(2,'0');
}

/* Converts Date to String with the format 
	MonthName DD YYYY hh:mm:ss
*/ 
function datetimeToString(date) {
	let dateString = new Date(date);
	return monthName[dateString.getMonth()] + " " + dateString.getDate() + ", " + dateString.getFullYear() + " " + 
			dateString.getHours() + ":" + dateString.getMinutes() + ":" + dateString.getSeconds();
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
			let latestFeedback = await db.exec("SELECT r.reportID, d.diseaseName, r.reportType, r.title, r.dateCreated, r.approvedByDate FROM mmchddb.REPORTS r JOIN mmchddb.DISEASES d ON d.diseaseID = r.diseaseID WHERE status = 'Approved' ORDER BY approvedByDate desc LIMIT 1;")
			if(ongoingOutbreak.length > 0){	
				let activeCases = await db.exec("SELECT * FROM mmchddb.CASES WHERE diseaseID='"+ ongoingOutbreak[0].diseaseID + "' AND reportDate >= '" +
									dateToString(ongoingOutbreak[0].startDate) +"';");

				// add 24 hour timer from the initial date of the start of the outbreak
				ongoingOutbreak[0].timer = datetimeToString(new Date(ongoingOutbreak[0].startDate.getTime() + 86400000));

				res.status(200).send({
					latestAccomp : latestAccomp[0],
					latestCase : latestCase[0],
					latestEvent : latestEvent[0],
					ongoingOutbreak : ongoingOutbreak,
					activeCases : activeCases.length,
					latestFeedback : latestFeedback[0]
					});
			} else 
				res.status(200).send({
					latestAccomp: latestAccomp[0],
					latestCase : latestCase[0],
					latestEvent : latestEvent[0],
					ongoingOutbreak : ongoingOutbreak,
					latestFeedback : latestFeedback[0]
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
