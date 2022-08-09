const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");

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
	
	mkData: async function(req, res) {
		let r = await db.exec("SELECT * FROM mmchddb.USER_SETTINGS;");
		if (r) res.status(200).send(r);
		else res.status(500).send("problems");
	},
	
	getMobCRFs: async function(req, res) {
		try {
			let r = await db.exec("SELECT c.CRFID FROM mmchddb.CRFS c WHERE c.userID = '${req.query.userID}';");
			res.status(200).send(r);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/*
	 * POST METHODS
	 */
	
	postMobCRF: async function(req, res) {
		let { formData, CRFID } = req.body;
		try {
			console.log("new case for CRF " + CRFID);
			console.log(formData);
			res.status(200).send("Done!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
};

module.exports = indexFunctions;
