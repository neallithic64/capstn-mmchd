const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");

const DRUUserTypes = ['BHS','RHU','CHO', 'govtHosp', 'privHosp', 'clinic', 'privLab', 'airseaPort'];
/** OBJECT CONSTRUCTORS
*/

function User(userID, userName, userEmail, userPassword, userType, addressID,
				lastName, firstName, midName, userContactNo1, userContactNo2,
				druName) {
	this.userID = userID;
	this.userName = userName;
	this.userEmail = userEmail;
	this.userPassword = userPassword;
	this.userType = userType;
	this.addressID = addressID;
	this.lastName = lastName;
	this.firstName = firstName;
	this.midName = midName;
	this.userContactNo1 = userContactNo1;
	this.userContactNo2 = userContactNo2;
	this.druName = druName;
}

function Address(addressID, houseStreet, brgy, city) {
	this.addressID = addressID;
	this.houseStreet = houseStreet;
	this.brgy = brgy;
	this.city = city;
}

function Disease(diseaseID, diseaseName, notifiable, caseThreshold) {
	this.diseaseID = diseaseID;
	this.diseaseName = diseaseName;
	this.notifiable = notifiable;
	this.caseThreshold = caseThreshold;
}

function Patient(patientID, epiID, lastName, firstName, midName, caddressID, paddressID, sex,
					birthDate, ageNo, ageType, admitStatus, civilStatus, occupation, 
					occuLoc, occuAddrID, guardianName, guardianContact, 
					indigeneous, indGroup,
					pregnant, pregMonths, HCPN, ILHZ ) {
	this.patientID = patientID;
	this.epiID = epiID;
	this.lastName = lastName;
	this.firstName = firstName;
	this.midName = midName;
	this.caddressID = caddressID;
	this.paddressID = paddressID;
	this.sex = sex;
	this.birthDate = birthDate;
	this.ageNo = ageNo;
	this.ageType = ageType;
	this.admitStatus = admitStatus;
	this.civilStatus = civilStatus;
	this.occupation = occupation;
	this.occuLoc = occuLoc;
	this.occuAddrID = occuAddrID;
	this.guardianName = guardianName;
	this.guardianContact = guardianContact;
	this.indGroup = indGroup;
	this.pregnant = pregnant;
	this.pregMonths = pregMonths;
	this.HCPN = HCPN;
	this.ILHZ = ILHZ;
}

function Case(caseID, patientID, diseaseID, reportedBy, caseLevel, reportDate, investigationDate,
				dateAdmitted, dateOnset, reporterName, reporterContact, investigatorName, investigatorContact) {
	this.caseID = caseID;
	this.patientID = patientID;
	this.diseaseID = diseaseID;
	this.reportedBy = reportedBy;
	this.caseLevel = caseLevel;
	this.reportDate = reportDate;
	this.investigationDate = investigationDate;
	this.dateAdmitted = dateAdmitted;
	this.dateOnset = dateOnset;
	this.reporterName = reporterName;
	this.reporterContact = reporterContact;
	this.investigatorName = investigatorName;
	this.investigatorContact = investigatorContact;
}

function Case_Data(caseID, value, diseaseID, fieldName) {
	this.caseID = caseID;
	this.value = value;
	this.diseaseID = diseaseID;
	this.fieldName = fieldName;
}

function Case_Data_Ref(diseaseID, fieldName, dataType) {
	this.diseaseID = diseaseID;
	this.fieldName = fieldName;
	this.dataType = dataType;
}

function Event(eventID, userID, addressID, remarks, caseStatus, dateSubmitted) {
	this.eventID = eventID;
	this.userID = userID;
	this.addressID = addressID;
	this.remarks = remarks;
	this.caseStatus = caseStatus;
	this.dateSubmitted = dateSubmitted;
}

function Notification(notificationID, receiverID, type, message, caseID, dateCreated, redirectTo, viewed) {
	this.notificationID = notificationID;
	this.receiverID = receiverID;
	this.type = type;
	this.message = message;
	this.caseID = caseID;
	this.dateCreated = dateCreated;
	this.redirectTo = redirectTo;
	this.viewed = viewed;
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

async function generateIDs(table, numRows) {
	try {
		let rowcount = await db.findRowCount(table);
		let ids = [];
		if (numRows > 0) {
			for (i = 0; i < numRows; i++) {
				let tempID = getPrefix(table);
				let suffix = rowcount + i;
				for (let j = 0; j < 13 - suffix.toString().length; j++)
					tempID += '0';
				tempID += suffix.toString();
				ids.push(tempID);
			} return ids;
		} else return false;
	} catch(e) {
		console.log(e);
		return false;
	}
}

function dateToString(date) {
	let dateString = new Date(date);
	let month = dateString.getMonth() + 1;
	return dateString.getFullYear()+'-'+ month.toString().padStart(2,'0') +'-'+dateString.getDate().toString().padStart(2,'0');
}

async function createCase(cases) {
	try {
		cases.caseID = (await generateID("mmchddb.CASES")).id;
		let r = await db.insertOne("mmchddb.CASES", cases);
		return r;
	} catch(e) {
		console.log(e);
		return false;
	}
}

async function sendBulkNotifs(userTypes, notificationType, message, caseID) {
	try {
		let userIDs = await db.findUserIDsWithType(userTypes);
		let newNotifications = Object.entries(await generateIDs("mmchddb.NOTIFICATIONS", userIDs.length));
		let dateCreated = new Date();

		newNotifications.forEach(function (element,index) {
			element.push(userIDs[index].userID);
			element.push(notificationType);
			element.push(message);
			element.push(caseID);
			element.push(dateCreated);
			if(notificationType == 'updateNotif')
				element.push('http://localhost:3000/caseDefs');
			else
				element.push('http://localhost:3000/allCases');
			element.push(false);
			element.shift();
		});

		let result = await db.insertNotificationData(newNotifications);
		return result;
	} catch (error) {
		console.log(error);
		return false;
	}
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
	
	getAllDiseases: async function(req, res) {
		try {
			let match = await db.findAll("mmchddb.DISEASES", {});
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getDisease: async function(req, res) {
		try {
			let match = await db.findRows("mmchddb.DISEASES", {diseaseID: req.query.diseaseID});

			if (match.length > 0)
				res.status(200).send(match);
			else
				res.status(500).send("No disease found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getPatients: async function(req, res) {
		try {
			let match = await db.exec(`SELECT p.*, a1.houseStreet AS currHouseStreet,
					a1.brgy AS currBrgy, a1.city AS currCity, a2.houseStreet AS permHouseStreet,
					a2.brgy AS permBrgy, a2.city AS permCity, MAX(c.reportDate) AS updatedDate
					FROM mmchddb.PATIENTS p
					INNER JOIN mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID
					INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID
					LEFT JOIN mmchddb.CASES c ON p.patientID = c.patientID
					GROUP BY p.patientID;`);
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getPatientAutofill: async function(req, res) {
		try {
			let match = await db.findPatientAutofill(req.query.name);
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getCaseDefinitions: async function(req, res) {
		try {
			let rows = await db.findRows("mmchddb.CASE_DEFINITIONS", {diseaseID: req.query.diseaseID});
			// console.log(rows);
			res.status(200).send(rows);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getUser: async function(req, res) {
		try {
			if (!req.session || !req.session.user) {
				return res.status(403).send();
			}
			return res.status(200).send({user: req.session.user});
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getLabUsers: async function(req, res) {
		try {
			let rows = await db.exec("SELECT * FROM mmchddb.USERS WHERE userType LIKE '%Lab%';");
			res.status(200).send(rows);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getCases: async function(req, res) {
		try {
			let match = await db.exec(`SELECT c.*, d.diseaseName,
									CONCAT(p.lastName, ", ", p.firstName, " ", p.midName) AS patientName,
									a.city, MAX(al.dateModified) AS updatedDate
									FROM mmchddb.CASES c
									INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID
									INNER JOIN mmchddb.PATIENTS p ON c.patientID = p.patientID
									INNER JOIN mmchddb.ADDRESSES a ON p.caddressID = a.addressID
									LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID
									GROUP BY c.caseID
									ORDER BY updatedDate DESC;`);
			// label the cases now as CIF or CRF
			for (let i = 0; i < match.length; i++) match[i].type = match[i].CRFID ? "CRF" : "CIF";
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getAllCRFs: async function(req, res) {
		try {
			let match = await db.exec(`SELECT cr.*, d.diseaseName, a.city, COUNT(cr.CRFID) AS caseCount,
									n.dateCreated AS submittedOn
									FROM mmchddb.CRFS cr
									INNER JOIN mmchddb.DISEASES d ON cr.diseaseID = d.diseaseID
									INNER JOIN mmchddb.USERS u ON cr.userID = u.userID
									INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID
									LEFT JOIN mmchddb.CASES c ON cr.CRFID = c.CRFID
									LEFT JOIN mmchddb.NOTIFICATIONS n ON c.caseID = n.caseID
									GROUP BY cr.CRFID;`);
			for (let i = 0; i < match.length; i++) {
				match[i].submitStatus = match[i].isPushed > 0 ? "Pushed" : "Submitted";
				match[i].submittedOn = match[i].submittedOn !== null ? match[i].submittedOn.toISOString().substr(0, 10) : "N/A";
				match[i].reportStatus = match[i].isPushed > 0 ? match[i].caseCount > 0 ? "Cases Submitted" : "Zero Report" : "Ongoing";
			}
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	/**
	 * Collects the following information for the Case Investigation Form
	 *  Case Information (mmchddb.CASES) Dates and Address
	 * 		reportdate
	 * 		dateAdmitted
	 * 		dateOnset
	 *  Patient Info (mmchddb.Patient) Dates and Address causing issues
	 *  Risk Factors (mmchddb.RISK_FACTORS) DONE
	 *  caseData (mmchddb.CaseData)
	 */
	getCIF: async function(req, res) {
		try {
			//collect relevant data
			let rows = await db.findRows("mmchddb.CASES", {caseID: req.query.caseID});
			let reporterData = await db.findRows("mmchddb.USERS", {userID: rows[0].reportedBy});
			let patientData = await db.exec("SELECT p.*, "
					+ "a1.houseStreet AS currHouseStreet, a1.brgy AS currBrgy, a1.city AS "
					+ "currCity, a2.houseStreet AS permHouseStreet, a2.brgy AS permBrgy, "
					+ "a2.city AS permCity FROM mmchddb.PATIENTS p INNER JOIN "
					+ "mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID "
					+ "INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID "+
					"WHERE p.patientID = '" + rows[0].patientID + "';");
			let riskFactorsData = await db.findRows("mmchddb.RISK_FACTORS", {caseID: req.query.caseID});
			let caseData = await db.findRows("mmchddb.CASE_DATA", {caseID: req.query.caseID});
			let caseAudit = await db.exec("SELECT a.dateModified AS 'reportDate', a.prevValue AS 'from', "+ 
			 		"CONCAT(u.firstName,' ', u.midName, ' ', u.lastName, ', ' , u.druName) AS 'reportedBy' " +
					"FROM mmchddb.AUDIT_LOG a JOIN mmchddb.USERS u ON a.modifiedBy = u.userID " +
					"WHERE a.editedID = '" + req.query.caseID + "' " +
					"ORDER BY a.dateModified;");
			let DRUData = await db.exec("SELECT u.druName, userType AS 'druType', a.city AS 'druCity', CONCAT_WS(', ',a.houseStreet, a.brgy, a.city) AS 'druAddress' " +
					"FROM mmchddb.USERS u INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID " + 
					"WHERE u.userID='" + rows[0].reportedBy + "';");

			// console.log(patientData);
			let caseDataObj = {};
			
			caseData.forEach(function(element) {
				caseDataObj[element.fieldName] = element.value;
			});

			if(DRUData[0].druName == 'TestDRU' || DRUData[0].druName == '')
				DRUData[0].druType = 'N/A';

			let dateLastUpdated = new Date(rows[0].reportDate);
			let i = 0;

			if(caseAudit.length > 0){
				for(i = 0; i < caseAudit.length; i++){
					dateLastUpdated = new Date(caseAudit[i].reportDate);
					if(i + 1 == caseAudit.length)
						caseAudit[i].to = rows[0].caseLevel;
					else
						caseAudit[i].to = caseAudit[i+1].from;
					caseAudit[i].reportDate = dateToString(caseAudit[i].reportDate);
				}

				caseAudit = caseAudit.reverse();
			
				caseAudit[i] = {
					reportDate: dateToString(rows[0].reportDate),
					reportedBy: reporterData[0].firstName + ' ' + reporterData[0].midName + ' '+ reporterData[0].lastName + 
								', ' + reporterData[0].druName,
					from: '',
					to: caseAudit[i-1].from
				};


			} else{
				caseAudit[i] = {
					reportDate: dateToString(rows[0].reportDate),
					reportedBy: reporterData[0].firstName + ' ' + reporterData[0].midName + ' '+ reporterData[0].lastName + 
								', ' + reporterData[0].druName,
					from: '',
					to: rows[0].caseLevel
				};
			}

			let data = {
				cases: rows[0],
				patient: patientData[0],
				// caseData: caseData,
				caseData: caseDataObj,
				riskFactors: riskFactorsData[0],
				DRUData: DRUData[0],
				dateLastUpdated: dateLastUpdated,
				caseHistory: caseAudit,
			}

			// fixing dates
			data.cases.reportDate = dateToString(data.cases.reportDate);
			if(data.cases.investigationDate)
				data.cases.investigationDate = dateToString(data.cases.investigationDate);
			if(data.cases.dateOnset)
				data.cases.dateOnset = dateToString(data.cases.dateOnset);
			if(data.cases.dateAdmitted)
				data.cases.dateAdmitted = dateToString(data.cases.dateAdmitted);
			data.patient.birthDate = dateToString(data.patient.birthDate);
			data.dateLastUpdated = dateToString(data.dateLastUpdated);

			// console.log(rows);
			res.status(200).send(data);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getPatientData: async function(req, res) {
		try {
			//collect relevant data
			let rows = await db.exec("SELECT 	c.caseID, c.reportDate, c.caseLevel, d.diseaseName AS 'disease', a.city AS 'city', " +
					"u.druName AS 'reportedBy', IFNULL(MAX(al.dateModified), c.reportDate) AS 'updatedDate', " +
					"c.reportedBy AS 'reportedByID', IF(ISNULL(c.CRFID), 'CIF', 'CRF') AS 'type' " +
					"FROM mmchddb.CASES c 	INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID " + 
					"INNER JOIN mmchddb.USERS u ON c.reportedBy = u.userID " + 
					"INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID " +
					"LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID " + 
					"WHERE c.patientID = '" + req.query.patientID + "' " +
					"GROUP BY c.caseID ORDER BY IFNULL(MAX(al.dateModified), c.reportDate) desc;");
			let patientData = await db.exec("SELECT p.*, "
					+ "a1.houseStreet AS currHouseStreet, a1.brgy AS currBrgy, a1.city AS "
					+ "currCity, a2.houseStreet AS permHouseStreet, a2.brgy AS permBrgy, "
					+ "a2.city AS permCity FROM mmchddb.PATIENTS p INNER JOIN "
					+ "mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID "
					+ "INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID "+
					"WHERE p.patientID = '" + req.query.patientID + "';");
			let riskFactorsData = await db.findRows("mmchddb.RISK_FACTORS", {caseID: rows[rows.length - 1].caseID});
			let DRUData = await db.exec("SELECT u.druName, userType AS 'druType', a.city AS 'druCity', CONCAT_WS(', ',a.houseStreet, a.brgy, a.city) AS 'druAddress' " +
					"FROM mmchddb.USERS u INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID " + 
					"WHERE u.userID='" + rows[0].reportedByID + "';");

			let data = {
				rowData: rows,
				patient: patientData[0],
				riskFactors: riskFactorsData[0],
				DRUData : DRUData[0]
			}

			// fixing dates
			data.rowData.forEach(function(element){
				element.reportDate = dateToString(element.reportDate);
				element.updatedDate = dateToString(element.updatedDate);
			});
			data.patient.birthDate = dateToString(data.patient.birthDate);

			res.status(200).send(data);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getCRF: async function(req, res) {
		try {
			//collect relevant data
			let rows = await db.findRows("mmchddb.CASES", {caseID: req.query.caseID});
			let reporterData = await db.findRows("mmchddb.USERS", {userID: rows[0].reportedBy});
			let patientData = await db.exec("SELECT p.*, "
					+ "a1.houseStreet AS currHouseStreet, a1.brgy AS currBrgy, a1.city AS "
					+ "currCity, a2.houseStreet AS permHouseStreet, a2.brgy AS permBrgy, "
					+ "a2.city AS permCity FROM mmchddb.PATIENTS p INNER JOIN "
					+ "mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID "
					+ "INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID "+
					"WHERE p.patientID = '" + rows[0].patientID + "';");
			let riskFactorsData = await db.findRows("mmchddb.RISK_FACTORS", {caseID: req.query.caseID});
			let caseData = await db.findRows("mmchddb.CASE_DATA", {caseID: req.query.caseID});
			let crfData = await db.findRows("mmchddb.CRFS", {CRFID: rows[0].CRFID});
			let caseAudit = await db.exec("SELECT a.dateModified AS 'reportDate', a.prevValue AS 'from', "+ 
			 		"CONCAT(u.firstName,' ', u.midName, ' ', u.lastName, ', ' , u.druName) AS 'reportedBy' " +
					"FROM mmchddb.AUDIT_LOG a JOIN mmchddb.USERS u ON a.modifiedBy = u.userID " +
					"WHERE a.editedID = '" + req.query.caseID + "' " +
					"ORDER BY a.dateModified;");
			let DRUData = await db.exec("SELECT u.druName, userType AS 'druType', a.city AS 'druCity', CONCAT_WS(', ',a.houseStreet, a.brgy, a.city) AS 'druAddress' " +
					"FROM mmchddb.USERS u INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID " + 
					"WHERE u.userID='" + rows[0].reportedBy + "';");

			let caseDataObj = {};
			
			caseData.forEach(function(element) {
				caseDataObj[element.fieldName] = element.value;
			});

			if(DRUData[0].druName == 'TestDRU' || DRUData[0].druName == '')
				DRUData[0].druType = 'N/A';

			let dateLastUpdated = new Date(rows[0].reportDate);
			let i = 0;

			if(caseAudit.length > 0){
				for(i = 0; i < caseAudit.length; i++){
					dateLastUpdated = new Date(caseAudit[i].reportDate);
					if(i + 1 == caseAudit.length)
						caseAudit[i].to = rows[0].caseLevel;
					else
						caseAudit[i].to = caseAudit[i+1].from;
					caseAudit[i].reportDate = dateToString(caseAudit[i].reportDate);
				}

				caseAudit = caseAudit.reverse();
			
				caseAudit[i] = {
					reportDate: dateToString(rows[0].reportDate),
					reportedBy: reporterData[0].firstName + ' ' + reporterData[0].midName + ' '+ reporterData[0].lastName + 
								', ' + reporterData[0].druName,
					from: '',
					to: caseAudit[i-1].from
				};

			} else{
				caseAudit[i] = {
					reportDate: dateToString(rows[0].reportDate),
					reportedBy: reporterData[0].firstName + ' ' + reporterData[0].midName + ' '+ reporterData[0].lastName + 
								', ' + reporterData[0].druName,
					from: '',
					to: rows[0].caseLevel
				};
			}

			let data = {
				cases: rows[0],
				patient: patientData[0],
				crfData: crfData[0],
				caseData: caseDataObj,
				riskFactors: riskFactorsData[0],
				DRUData: DRUData[0],
				dateLastUpdated: dateLastUpdated,
				caseHistory: caseAudit,
			}

			// fixing data
			data.cases.reportDate = dateToString(data.cases.reportDate);
			if(data.cases.investigationDate)
				data.cases.investigationDate = dateToString(data.cases.investigationDate);
			if(data.cases.dateOnset)
				data.cases.dateOnset = dateToString(data.cases.dateOnset);
			if(data.cases.dateAdmitted)
				data.cases.dateAdmitted = dateToString(data.cases.dateAdmitted);
			data.patient.birthDate = dateToString(data.patient.birthDate);

			data.crfData.week = data.crfData.week.toString().padStart(2,'0');
			data.crfData.year = data.crfData.year.toString();
			data.dateLastUpdated = dateToString(data.dateLastUpdated);
			// console.log(rows);
			res.status(200).send(data);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getCRFPage: async function(req, res) {
		try {
			let userSettings = await db.findRows("mmchddb.USER_SETTINGS", {userID: req.query.userID});
			if (req.query.CRFID) {
				// if viewing the CRF as a report
				let CRFobj = await db.findRows("mmchddb.CRFS", {CRFID: req.query.CRFID});
				let data = await db.exec(`SELECT c.*, d.diseaseName,
										CONCAT(p.lastName, ", ", p.firstName, " ", p.midName) AS patientName,
										p.ageNo, p.sex, a.city, MAX(al.dateModified) AS updatedDate
										FROM mmchddb.CASES c
										INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID
										INNER JOIN mmchddb.PATIENTS p ON c.patientID = p.patientID
										INNER JOIN mmchddb.ADDRESSES a ON p.caddressID = a.addressID
										LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID
										WHERE c.CRFID = '${req.query.CRFID}'
										GROUP BY c.caseID;`);
				res.status(200).send({
					CRF: CRFobj[0],
					crfData: data,
					pushDataAccept: userSettings[0].pushDataAccept
				});
			} else {
				// if viewing the CRF to add a case
				let r = await db.findRows("mmchddb.CRFS", {
					diseaseID: req.query.diseaseID,
					userID: req.query.userID
				});
				if (r.length > 0) {
					// collect the cases with that CRFID
					let data = await db.exec(`SELECT c.*, d.diseaseName,
										CONCAT(p.lastName, ", ", p.firstName, " ", p.midName) AS patientName,
										p.ageNo, p.sex, a.city, MAX(al.dateModified) AS updatedDate
										FROM mmchddb.CASES c
										INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID
										INNER JOIN mmchddb.PATIENTS p ON c.patientID = p.patientID
										INNER JOIN mmchddb.ADDRESSES a ON p.caddressID = a.addressID
										LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID
										WHERE c.CRFID = '${r[r.length - 1].CRFID}'
										GROUP BY c.caseID;`);
					res.status(200).send({
						CRF: r[r.length - 1],
						crfData: data,
						pushDataAccept: userSettings[0].pushDataAccept
					});
				} else {
					Date.prototype.getWeek = function() {
						let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
						let dayNum = d.getUTCDay() || 7;
						d.setUTCDate(d.getUTCDate() + 4 - dayNum);
						let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
						return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
					}
					let thisDate = new Date(), firstCRF = {
						CRFID: (await generateID("mmchddb.CRFS")).id,
						diseaseID: req.query.diseaseID,
						userID: req.query.userID,
						week: thisDate.getWeek(),
						year: thisDate.getFullYear()
					};
					let firstR = await db.insertOne("mmchddb.CRFS", firstCRF);
					res.status(200).send({
						CRF: firstCRF,
						crfData: [],
						pushDataAccept: userSettings[0].pushDataAccept
					});
				}
			}
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getAllNotifs: async function(req, res) {
		try {
			let match = await db.findRows("mmchddb.NOTIFICATIONS", {receiverID: req.query.userID});
			let update = await db.updateRows("mmchddb.NOTIFICATIONS", {receiverID: req.query.userID}, {viewed: true});
			res.status(200).send(match.reverse());
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getNotification: async function(req, res) {
		try {
			let match = await db.findRows("mmchddb.NOTIFICATIONS", {notificationID: req.query.notificationID});

			if (match.length > 0)
				res.status(200).send(match);
			else
				res.status(500).send("No notifications found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getNewNotifs: async function(req, res) {
		try {
			let newNotifCount = await db.findNewNotifsCount(req.query.userID);
			res.status(200).send({newNotifCount:newNotifCount});
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getAllEvents: async function(req, res) {
		try {
			let match = await db.exec("SELECT e.*, a.city FROM mmchddb.EVENTS e " +
									"JOIN mmchddb.ADDRESSES a ON a.addressID = e.addressID;");
			console.log(match);
			match.forEach(function(element){
				element.dateCaptured = dateToString(element.dateCaptured);
			});
			res.status(200).send(match);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getEvent: async function(req, res) {
		try {
			let match = await db.exec("SELECT e.*, a.city AS 'locCity', a.houseStreet AS 'locHouseStreet', a.brgy AS 'locBrgy' " + 
									"FROM mmchddb.EVENTS e " +  
									"JOIN mmchddb.ADDRESSES a ON a.addressID = e.addressID " +
									"WHERE e.eventID = '" + req.query.eventID + "';");						
			if (match.length > 0){
				let reporterData = await db.findRows("mmchddb.USERS", {userID: match[0].userID});
				let eventAudit = await db.exec("SELECT a.dateModified AS 'reportDate', a.prevValue AS 'from', "+ 
										"CONCAT(u.firstName,' ', u.midName, ' ', u.lastName, ', ' , u.druName) AS 'reportedBy' " +
										"FROM mmchddb.AUDIT_LOG a JOIN mmchddb.USERS u ON a.modifiedBy = u.userID " +
										"WHERE a.editedID = '" + req.query.eventID + "' " +
										"ORDER BY a.dateModified;");
				match[0].timeCaptured = new Date(match[0].dateCaptured).toTimeString().substr(0,8);
				match[0].dateCaptured = dateToString(match[0].dateCaptured);

				let i = 0;
				if(eventAudit.length > 0){
					for(i = 0; i < eventAudit.length; i++){
						dateLastUpdated = new Date(eventAudit[i].reportDate);
						if(i + 1 == eventAudit.length)
							eventAudit[i].to = match[0].eventStatus;
						else
							eventAudit[i].to = eventAudit[i+1].from;
						eventAudit[i].reportDate = dateToString(eventAudit[i].reportDate);
					}
	
					eventAudit = eventAudit.reverse();
				
					eventAudit[i] = {
						reportDate: dateToString(match[0].dateCaptured),
						reportedBy: reporterData[0].firstName + ' ' + reporterData[0].midName + ' '+ reporterData[0].lastName + 
									', ' + reporterData[0].druName,
						from: '',
						to: eventAudit[i-1].from
					};
	
				} else{
					eventAudit[i] = {
						reportDate: dateToString(match[0].dateCaptured),
						reportedBy: reporterData[0].firstName + ' ' + reporterData[0].midName + ' '+ reporterData[0].lastName + 
									', ' + reporterData[0].druName,
						from: '',
						to: match[0].eventStatus
					};
				}

				console.log(eventAudit);			
				res.status(200).send({
					event: match[0],
					eventHistory : eventAudit
				});
			}
			else
				res.status(500).send("No Event found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	/*
	 * POST METHODS
	 */
	
	postLogin: async function(req, res) {
		let { userEmail, userPassword } = req.body;
		let match;
		try {
			// checking if email or username
			if (userEmail.indexOf("@") != -1) {
				match = await db.findRows("mmchddb.USERS", {userEmail: userEmail});
			} else {
				match = await db.findRows("mmchddb.USERS", {userName: userEmail});
			}
			if (match.length > 0) {
				bcrypt.compare(userPassword, match[0].userPassword, function(err, result) {
					console.log(result);
					if (result) {
						req.session.user = match[0];
						res.status(200).send({user: match[0]});
						// res.status(200).send("Login successful.");
					} else res.status(403).send("Incorrect password.");
				});
			} else res.status(403).send("No user found.");
		} catch(e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postRegUser: async function(req, res) {
		let { user } = req.body;
		try {
			user.userID = (await generateID("mmchddb.USERS")).id;
			// TODO: address
			user.addressID = "AD-0000000000000";
			delete user.userHouseStreet;
			delete user.userBrgy;
			delete user.userCity;
			delete user.userRePassword;
			user.userPassword = await bcrypt.hash(user.userPassword, saltRounds);

			let result = await db.insertOne("mmchddb.USERS", user);
			if (result) res.status(200).send("Register success");
			else res.status(500).send("Register failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	postLogout: async function(req, res) {
		req.session.destroy();
		res.status(200).send("Logged out.");
	},
	
	postAddDisease: async function(req, res) {
		let { disease } = req.body;

		try {
			disease.diseaseID = (await generateID("mmchddb.DISEASES")).id;
			// let disease = new Disease(diseaseID, "Sample Disease", "Insert symptoms here",
			// 							"Insert Suspected here", "Insert Probable here",
			// 							"Insert Confirmed here", true, 100);
			let result = await db.insertOne("mmchddb.DISEASES", disease);
			console.log(result);

			if (result)
				res.status(200).send("Add disease success");
			else
				res.status(500).send("Add disease failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	}, 

	postAddPatient: async function(req, res) {
		let { formData } = req.body, result;

		try {
			let genPatientID = await generateID("mmchddb.PATIENTS", {
				lastName: formData.patient.lastName,
				firstName: formData.patient.firstName,
				midName: formData.patient.midName
			});
			formData.patient.patientID = genPatientID.id;
			if (!genPatientID.exists)
				result = await db.insertOne("mmchddb.PATIENTS", formData.patient);
			
			console.log(result);
			if (result) res.status(200).send("Add patient success");
			else res.status(500).send("Add patient failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postAddEvent: async function(req, res) {
		let { event } = req.body;

		try {
			let currAddrID = await generateID("mmchddb.ADDRESSES", {
				houseStreet: event.locHouseStreet,
				brgy: event.locBrgy,
				city: event.locCity
			});

			event.addressID = currAddrID.id;
			
			if (!currAddrID.exists) {
				let currAddr = new Address(currAddrID.id, event.locHouseStreet, event.locBrgy, event.locCity);
				let result = await db.insertOne("mmchddb.ADDRESSES", currAddr);
			}

			event.eventID = (await generateID("mmchddb.EVENTS")).id;
			event.dateCaptured = new Date(event.dateCaptured + ' ' + event.timeCaptured);
			event.numCases = Number.parseInt(event.numCases);
			event.numDeaths = Number.parseInt(event.numDeaths);

			delete event.locHouseStreet;
			delete event.locBrgy;
			delete event.locCity;
			delete event.timeCaptured;

			let result = await db.insertOne("mmchddb.EVENTS", event);
			console.log(result);
			if (result) res.status(200).send("Add event success");
			else res.status(500).send("Add event failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	/**	RiskFactors 
			- L : LifeStyle
			- C : Current Health Condition
			- H : Historical Health Data
			- O : Others
	*/
	postNewCase: async function(req, res) {
		let { formData, CRFID } = req.body;
		console.log(formData);
		let result;

		try {
			let currAddrID = await generateID("mmchddb.ADDRESSES", {
				houseStreet: formData.patient.currHouseStreet,
				brgy: formData.patient.currBrgy,
				city: formData.patient.currCity
			});
			formData.patient.caddressID = currAddrID.id;
			if (!currAddrID.exists) {
				let currAddr = new Address(formData.patient.caddressID, formData.patient.currHouseStreet, formData.patient.currBrgy, formData.patient.currCity);
				result = await db.insertOne("mmchddb.ADDRESSES", currAddr);
			}
			
			if (result || currAddrID.exists) {
				let permAddrID = await generateID("mmchddb.ADDRESSES", {
					houseStreet: formData.patient.permHouseStreet,
					brgy: formData.patient.permBrgy,
					city: formData.patient.permCity
				});
				formData.patient.paddressID = permAddrID.id;
				if (!permAddrID.exists) {
					let permAddr = new Address(formData.patient.paddressID, formData.patient.permHouseStreet, formData.patient.permBrgy, formData.patient.permCity);
					result = await db.insertOne("mmchddb.ADDRESSES", permAddr);
				}
				
				if (result || permAddrID.exists) {
					delete formData.patient.currHouseStreet;
					delete formData.patient.currBrgy;
					delete formData.patient.currCity;
					delete formData.patient.permHouseStreet;
					delete formData.patient.permBrgy;
					delete formData.patient.permCity;
					
					// temp fix for occuAddr
					formData.patient.occuAddrID = null;
					let genPatientID = await generateID("mmchddb.PATIENTS", {
						lastName: formData.patient.lastName,
						firstName: formData.patient.firstName,
						midName: formData.patient.midName,
						caddressID: formData.patient.caddressID
					});
					formData.patient.patientID = genPatientID.id;
					if (!genPatientID.exists) {
						result = await db.insertOne("mmchddb.PATIENTS", formData.patient);
					}
					
					if (result || genPatientID.exists) {
						formData.cases.caseID = await generateID("mmchddb.CASES");
						formData.cases.patientID = formData.patient.patientID;
						// formData.cases.reportedBy = req.session.user.userID;
						formData.cases.CRFID = CRFID ? CRFID : null;
						result = await createCase(formData.cases);
						
						if (result) {
							if (formData.caseData.noMCVreason) formData.caseData.noMCVreason = formData.caseData.noMCVreason.join(",");
							// if (formData.caseData.sourceInfection) formData.caseData.sourceInfection = formData.caseData.sourceInfection.join(",");
							let newCaseData = Object.entries(formData.caseData);
							
							newCaseData.forEach(function (element) {
								element.push(formData.cases.caseID);				
								element.push(formData.cases.diseaseID);
							});
							result = await db.insertCaseData(newCaseData);
							
							if (result) {
								formData.riskFactors.caseID = formData.cases.caseID;
								result = await db.insertOne("mmchddb.RISK_FACTORS", formData.riskFactors);
								
								if (result) {
									let user = await db.findRows("mmchddb.USERS",{userID : formData.cases.reportedBy});
									let disease = await db.findRows("mmchddb.DISEASES", {diseaseID : formData.cases.diseaseID});
									result = await sendBulkNotifs(['pidsrStaff', 'fhsisStaff'],'caseNotif', 
										'NEW CASE: '+ user[0].druName + ' submitted a ' + disease[0].diseaseName + ' case', formData.cases.caseID);
									
									if (result)
										res.status(200).send("Add case success"); 
									else res.status(500).send("Send Notifs Failed");

								} else {
									console.log("Add risk factor failed");
									res.status(500).send("Add risk factor failed");
								}
							} else {
								console.log("Add case data failed");
								res.status(500).send("Add case data failed");
							}
						} else {
							console.log("Add case failed");
							res.status(500).send("Add case failed");
						}
					} else {
						console.log("Add patient failed");
						res.status(500).send("Add patient failed");
					}
				} else {
					console.log("Add perm address failed");
					res.status(500).send("Add perm address failed");
				}
			} else {
				console.log("Add curr address failed");
				res.status(500).send("Add curr address failed");
			}
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	postEditDiseaseDef: async function(req, res) {
		let { diseaseDefs, diseaseID } = req.body;
		let arrDefs = Object.keys(diseaseDefs), result = true, query = {
			diseaseID: diseaseID,
			class: null
		};

		try {
			for (let i = 0; result && i < arrDefs.length; i++) {
				query.class = arrDefs[i];
				let result = await db.updateRows("mmchddb.CASE_DEFINITIONS", query, {
					definition: Object.values(diseaseDefs)[i]
				});
			}
			if (result) {
				let disease = await db.findRows("mmchddb.DISEASES",{"diseaseID" : diseaseID});
				result = await sendBulkNotifs(DRUUserTypes, 'updateNotif', 'The case definitions of ' + 
								disease[0].diseaseName + ' have been updated', null);
				if(result)
					res.status(200).send("Update disease Successful");
				else res.status(500).send("Add Notifications Failed");
			}
			else res.status(500).send("Update Case Definition error!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postUpdateCaseStatus: async function(req, res) {
		let { caseId, newStatus } = req.body;
		try {
			// retrieve the case (that hopefully exists)
			let caseData = await db.findRows("mmchddb.CASES", {caseID: caseId});
			if (caseData.length > 0) {
				// constructing the case audit object
				let caseAudit = {
					editedID: caseId,
					dateModified: new Date(),
					fieldName: "caseLevel",
					prevValue: caseData[0].caseLevel,
					modifiedBy: caseData[0].reportedBy
				};
				// inserting the case audit object to the db
				let newCaseAudit = await db.insertOne("mmchddb.AUDIT_LOG", caseAudit);
				// then updating the case object itself
				let updateCase = await db.updateRows("mmchddb.CASES",
						{caseID: caseId},
						{caseLevel: newStatus});
				if (newCaseAudit && updateCase) {
					// (notificationID, receiverID, type, message, caseID, dateCreated, redirectTo, viewed)
					let disease = await db.exec(`SELECT * FROM mmchddb.CASES c
							INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID
							WHERE c.caseID = '${caseId}';`);
					console.log(disease);
					
					// actual notification object insertion
					let notification = new Notification(null, caseData[0].reportedBy, 'updateNotif',
							'CASE UPDATE: The case level of ' + disease[0].diseaseName + ' Case ' + caseId + ' has been updated to ' + newStatus + '.',
							caseId, caseAudit.dateModified, "http://localhost:3000/viewCIFMeasles?caseID=" + caseId, false);
					notification.notificationID = (await generateID("mmchddb.NOTIFICATIONS")).id;
					let newNotif = await db.insertOne("mmchddb.NOTIFICATIONS", notification);
					
					if (newNotif) {
						res.status(200).send("Case has been updated!");
					} else {
						console.log("Add Notification failed");
						res.status(500).send("Add Notification failed");
					}
				} else res.status(500).send("Error making db transaction.");
			} else res.status(404).send("No case with such ID found.");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postUpdateEventStatus: async function(req, res) {
		let { eventID, newStatus, modifiedBy } = req.body;
		try {
			// retrieve the case (that hopefully exists)
			let eventData = await db.findRows("mmchddb.EVENTS", {eventID: eventID});
			if (eventData.length > 0) {
				// constructing the case audit object
				let eventAudit = {
					editedID: eventID,
					dateModified: new Date(),
					fieldName: "eventStatus",
					prevValue: eventData[0].eventStatus,
					modifiedBy: modifiedBy
				};
				// inserting the case audit object to the db
				let newEventAudit = await db.insertOne("mmchddb.AUDIT_LOG", eventAudit);
				// then updating the case object itself
				let updateEvent = await db.updateRows("mmchddb.EVENTS",
						{eventID: eventID},
						{eventStatus: newStatus});
				if (newEventAudit && updateEvent) {
					// actual notification object insertion
					let notification = new Notification(null, eventData[0].userID, 'updateNotif',
							'EVENT UPDATE: Health Event ' + eventID + ' has been updated from ' + eventData[0].eventStatus + ' to ' + newStatus + '.',
							null, eventAudit.dateModified, "http://localhost:3000/viewHealthEvent?eventID=" + eventID, false);
					notification.notificationID = (await generateID("mmchddb.NOTIFICATIONS")).id;
					let newNotif = await db.insertOne("mmchddb.NOTIFICATIONS", notification);
					
					if (newNotif) {
						res.status(200).send("Case has been updated!");
					} else {
						console.log("Add Notification failed");
						res.status(500).send("Add Notification failed");
					}
				} else res.status(500).send("Error making db transaction.");
			} else res.status(404).send("No case with such ID found.");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},

	postEditCIFLab: async function(req, res) {
		/* for the lab data, the records already exist, they're within CASE_DATA. */
		let { caseID, newLabData, submitted } = req.body;
		let auditArr = [], dateNow = new Date();
		try {
			// collect all CASE_DATA records with the caseID and containing "lab" in fieldName
			let rows = await db.exec(`SELECT * FROM mmchddb.CASE_DATA WHERE caseID = '${caseID}' AND fieldName LIKE 'lab%';`);
			
			// reconstruct array as an object for easier update
			let labData = rows.reduce(function(r, i) {
				r[i.fieldName] = i.value;
				return r;
			}, {});
			
			// update every attr in the object for the input information
			// key basis is newLabData to account for cases with no initial info
			Object.keys(newLabData).forEach(e => {
				if (e.includes("lab")) {
					// constructing audit array
					if (labData[e] !== newLabData[e]) {
						auditArr.push({
							editedID: caseID,
							dateModified: dateNow,
							fieldName: e,
							prevValue: labData[e],
							modifiedBy: submitted
						});
					}
					labData[e] = newLabData[e];
				}
			});
			// console.log(labData); console.log(auditArr);
			
			// where updating happens
			for (let i = 0; i < Object.keys(labData).length; i++)
				await db.updateRows("mmchddb.CASE_DATA", {
					caseID: caseID,
					fieldName: Object.keys(labData)[i]
				}, { value: newLabData[Object.keys(labData)[i]] });
			
			// null check before audit log insertion, esp on Object.keys
			if (auditArr.length > 0) {
				await db.insertRows("mmchddb.AUDIT_LOG", Object.keys(auditArr[0]), auditArr.map(Object.values));
			}
			// need updating of investigator details too
			let investigat = Object.fromEntries(Object.entries(newLabData).filter(([key, value]) => key.includes("investigat")));
			await db.updateRows("mmchddb.CASES", {caseID: caseID}, investigat);
			res.status(200).send(labData);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postSubmitCases: async function(req, res) {
		try {
			// let {} = req.body;
			/* MORBIDITY (monthly and quarterly, 62) (after cases are done)
					FK: LGU/userID 
					FK: diseaseID
					Month/Quarter
					Year
					FK: Age range ID ("0-6 days")
					City/Location
					Sex
					Count
					dateCreated
			*/
			// let morbid = await db.insertOne("mmchddb.MORBIDITY", );
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postSubmitCRF: async function(req, res) {
		try {
			// let {} = req.body;
			/* MORBIDITY (monthly and quarterly, 62) (after cases are done)
					FK: LGU/userID 
					FK: diseaseID
					Month/Quarter
					Year
					FK: Age range ID ("0-6 days")
					City/Location
					Sex
					Count
					dateCreated
			*/
			// let morbid = await db.insertOne("mmchddb.MORBIDITY", );
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postUpdatePatient: async function(req, res) {
		let { patientID, newPatientInfo } = req.body;
		/* attributes:
			sex, pregWeeks, civilStatus, occupation, occuLoc, guardianName, guardianContact
			currHouseStreet, currCity, currBrgy (caddressID)
			occuStreet, occuCity, occuBrgy (occuAddrID)
			riskFactors
		*/
		
		// extracting objects that belong to different tables from newPatientInfo
		let cAddress = {
			houseStreet: newPatientInfo.currHouseStreet,
			city: newPatientInfo.currCity,
			brgy: newPatientInfo.currBrgy
		}, oAddress = {
			houseStreet: newPatientInfo.occuStreet,
			city: newPatientInfo.occuCity,
			brgy: newPatientInfo.occuBrgy
		};
		
		try {
			// deleting extracted attributes
			delete newPatientInfo.currHouseStreet;
			delete newPatientInfo.currCity;
			delete newPatientInfo.currBrgy;
			delete newPatientInfo.occuStreet;
			delete newPatientInfo.occuCity;
			delete newPatientInfo.occuBrgy;
			delete newPatientInfo.riskFactors;
			
			// retrieving address rows for need-for-update checking
			let userAddr = await db.exec(`SELECT p.caddressID, p.occuAddrID, a1.houseStreet AS currHouseStreet,
										a1.brgy AS currBrgy, a1.city AS currCity, a2.houseStreet AS occuHouseStreet,
										a2.brgy AS occuBrgy, a2.city AS occuCity FROM mmchddb.PATIENTS p
										LEFT JOIN mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID
										LEFT JOIN mmchddb.ADDRESSES a2 ON p.occuAddrID = a2.addressID
										WHERE p.patientID = '${patientID}';`);
			
			// checking both addresses
			cAddress.addressID = await generateID(table, cAddress);
			oAddress.addressID = await generateID(table, oAddress);
			if (newPatientInfo.caddressID !== cAddress.addressID) {
				newPatientInfo.caddressID = cAddress.addressID;
				// insert new address obj
				await db.insertOne("mmchddb.ADDRESSES", cAddress);
			}
			if (newPatientInfo.occuAddressID !== oAddress.addressID) {
				newPatientInfo.occuAddressID = oAddress.addressID;
				// insert new address obj
				await db.insertOne("mmchddb.ADDRESSES", oAddress);
			}
			
			// updating patient
			await db.updateRows("mmchddb.PATIENTS", { patientID: patientID }, newPatientInfo);
			res.status(200).send(labData);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},

	postUpdatePushData: async function(req,res){
		try {
			let {userID, pushDataAccept} = req.body;
			let updateSettings = await db.updateRows("mmchddb.USER_SETTINGS", {userID:userID}, {pushDataAccept:pushDataAccept});
			if(updateSettings)
				res.status(200).send();
			else
				res.status(500).send();
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	/*
	 * CRON METHODS
	 */
	cronCRFDeadlineNotif : async function() {
		try {
			let result = await sendBulkNotifs(DRUUserTypes,'deadlineNotif', 
										'REMINDER: Please submit your Case Report Forms by Friday. If not submitted, forms will be automatically collected by Friday at 5:00PM.', null);
			if(result) {
				result = await sendBulkNotifs(['pidsrStaff', 'fhsisStaff'],'deadlineNotif', 'REMINDER: Please start reminding DRUs to submit their Case Report Forms', null);
				if(result) {
					console.log("Adding notification success");
				}else console.log("Adding Notification to Staff Failed");
			} else console.log("Adding Notification to DRU Failed");
		} catch (e) {
			console.log(e);
			console.log("Server Error");
		}
	},
	cronCRFPushData : async function() {
		try {
			// TODO: Implement Automatic Push Data Approach

			let date = new Date();
			let JanOne = new Date(date.getFullYear(), 0, 1);
			let numDay = Math.floor((date - JanOne) / (24 * 60 * 60 * 1000));
			let week = Math.ceil((1 + numDay) / 7);
			let pushData = await db.exec("UPDATE mmchddb.CRFS c SET c.isPushed = 1 " +
							"WHERE c.userID IN(SELECT u.userID from mmchddb.USERS u JOIN mmchddb.USER_SETTINGS us ON us.userID = u.userID "+
							"WHERE us.pushDataAccept = 1);");
			if(pushData) {
				let result = await sendBulkNotifs(DRUUserTypes,'pushDataNotif', 
										'SUBMISSION UPDATE: Your Case Report Forms for Week ' + week + ' has been automatically pushed to MMCHD-RESU', null);
				if (result) console.log("Push Data Success");
				else console.log("Adding Notification to DRU Failed");
			} else console.log("Update CRF Push failed");
			
		} catch (e) {
			console.log(e);
			console.log("Server Error");
		}
	},
};

module.exports = indexFunctions;
