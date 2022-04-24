const nodemailer = require("nodemailer");
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

/** Email Order:
 * 1. noted by: LHSD chief
 * 2. recom by: RESU head
 * 3. appro by: CHD director
 */
function sendReportEmail(email, reportID, status) {
	// sending email
	let smtpTransport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL_ADDR,
			pass: process.env.EMAIL_PASS
		}
	});
	let mailOpts = {
		from: "MM-CHD",
		to: email,
		subject: "MMCHD: New Report For Approval",
		text: `Good day! New report ${reportID} has been created with status "${status}". Review it
				here: http://localhost:3000/viewReport?reportID=${reportID}. Thank you very much!`
	};
	smtpTransport.sendMail(mailOpts, function(err) {
		if (err) console.log(err);
		smtpTransport.close();
	});
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
	
	getFileBlob: async function(req, res) {
		let match = "";
		try {
			if (req.query.reportID) {
				match = await db.exec(`SELECT file FROM mmchddb.REPORTS WHERE reportID = '${req.query.reportID}';`);
			} else {
				match = await db.exec(`SELECT file FROM mmchddb.zzzREPORT_COMMENTS;`);
			}
			res.status(200).send(match[0].file);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getReport: async function(req, res) {
		try {
			let report = await db.exec(`SELECT r.*, d.diseaseName,
					u1.firstName AS "preparedByFN", u1.lastName AS "preparedByLN",
					u2.firstName AS "notedByFN", u2.lastName AS "notedByLN",
					u3.firstName AS "recommByFN", u3.lastName AS "recommByLN",
					u4.firstName AS "approvedByFN", u4.lastName AS "approvedByLN"
					FROM mmchddb.REPORTS r
					LEFT JOIN mmchddb.USERS u1 ON u1.userID = r.preparedBy
					LEFT JOIN mmchddb.USERS u2 ON u2.userID = r.notedBy
					LEFT JOIN mmchddb.USERS u3 ON u3.userID = r.recommBy
					LEFT JOIN mmchddb.USERS u4 ON u4.userID = r.approvedBy
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = r.diseaseID
					WHERE r.reportID = '${req.query.reportID}';`);
			let auditLog = await db.exec(`SELECT r.*, ra.remarks, ra.modifiedBy,
					ra.dateModified, ra.action AS updateAction
					FROM mmchddb.REPORTS r
					LEFT JOIN mmchddb.REPORT_AUDIT ra ON ra.reportID = r.reportID
					WHERE r.reportID = '${req.query.reportID}';`);
			res.status(200).send({
				report: report[0],
				dataSet: auditLog
			});
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getAllReports: async function(req, res) {
		try {
			let reports = await db.exec(`SELECT r.*, d.diseaseName
					FROM mmchddb.REPORTS r
					LEFT JOIN mmchddb.USERS u ON u.userID = r.preparedBy
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = r.diseaseID;`);
			res.status(200).send(reports);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getReportBulletin: async function(req, res) {
		try {
			let reports = await db.exec(`SELECT r.reportID, r.reportType, r.title AS reportTitle,
					CONCAT(MONTH(r.dateCreated), ' ', DAY(r.dateCreated)) AS reportDate,
					r.year AS reportYear, IFNULL(r.approvedByDate, 'N/A') AS dateApproved,
					d.diseaseName AS reportDisease
					FROM mmchddb.REPORTS r
					LEFT JOIN mmchddb.USERS u ON u.userID = r.preparedBy
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = r.diseaseID;`);
			res.status(200).send(reports);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/*
	 * POST METHODS
	 */
	
	postFileBlob: async function(req, res) {
		let { file, reportID } = req.body;
		try {
			// console.log(file);
			await db.updateRows("mmchddb.REPORTS", { reportID: reportID }, { file: file });
			res.status(200).send("File uploaded!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postAddReport: async function(req, res) {
		let { report } = req.body;
		try {
			let reportID = (await generateID("mmchddb.REPORTS")).id;
			let diseaseID = await db.findRows("mmchddb.DISEASES", {diseaseName: report.diseaseID});
			let rows = await db.insertOne("mmchddb.REPORTS", {
				reportID: reportID,
				diseaseID: diseaseID[0].diseaseID,
				preparedBy: report.preparedBy,
				reportType: report.reportType,
				status: "For Approval",
				dateCreated: (new Date()).toISOString(), // dateTime
				title: report.title,
				year: report.year,
				duration: report.duration,
				reportsIncluded: JSON.stringify(report.reportsIncluded),
				chartRemarks: JSON.stringify(report.chartRemarks)
			});
			
			sendReportEmail("matthewneal2006@yahoo.com", reportID, "For Approval");
			
			res.status(200).send(reportID);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postEditApproveReport: async function(req, res) {
		let { reportID, userID, userType, remarks } = req.body;
		let newDate = new Date(), newStatus = "Approved", updateObj = {};
		try {
			// checking of userType; different columns will be updated per case
			switch (userType) {
				case "lhsdChief": {
					newStatus = "Noted";
					updateObj.status = newStatus;
					updateObj.notedBy = userID;
					updateObj.notedByDate = newDate.toISOString();
					break;
				}
				case "resuHead": {
					newStatus = "Recommended";
					updateObj.status = newStatus;
					updateObj.recommBy = userID;
					updateObj.recommByDate = newDate.toISOString();
					break;
				}
				case "chdDirector": {
					newStatus = "Approved";
					updateObj.status = newStatus;
					updateObj.approvedBy = userID;
					updateObj.approvedByDate = newDate.toISOString();
					break;
				}
			}
			if (updateObj.status) {
				let audit = {
					reportID: reportID,
					dateModified: newDate.toISOString(),
					modifiedBy: userID,
					action: "Report is now " + newStatus + ".",
					remarks: remarks
				};
				await db.updateRows("mmchddb.REPORTS", { reportID: reportID }, updateObj);
				await db.insertOne("mmchddb.REPORT_AUDIT", audit);
				res.status(200).send("Report approved!");
			} else {
				res.status(200).send("Invalid user type!");
			}
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
};

module.exports = indexFunctions;
