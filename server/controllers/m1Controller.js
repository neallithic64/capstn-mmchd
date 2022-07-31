const bcrypt = require("bcrypt");
const saltRounds = 10;

const cron = require('node-cron');
const db = require("../models/db");
let task;
(async () => {
	try {
		return (await db.exec(`SELECT * FROM mmchddb.SYSTEM_SETTINGS;`))[0];
	} catch (e) {
		console.log(e);
	}
})().then(sysSet => {
	task = cron.schedule(sysSet.reportingMinute + " " + sysSet.reportingHour + " * * " + sysSet.reportingDay, indexFunctions.cronCRFPushData);
});

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
function convDatePHT(d) {
	return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
}

const math = require('mathjs');
const { fractionDependencies } = require("mathjs");
const DRUUserTypes = ['BHS','RHU','CHO', 'govtHosp', 'privHosp', 'clinic', 'privLab', 'airseaPort'];
const monthName = ["January", "February", "March", "April", "May", "June", "July",
				"August", "September", "October", "November", "December"];
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
					indigeneous,
					pregWeeks, HCPN, ILHZ ) {
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
	this.indigeneous = indigeneous;
	this.pregWeeks = pregWeeks;
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

function Outbreak(outbreakID, diseaseID, outbreakStatus, startDate, endDate, type ,responseTime) {
	this.outbreakID = outbreakID;
	this.diseaseID = diseaseID;
	this.outbreakStatus = outbreakStatus;
	this.startDate = startDate;
	this.endDate = endDate;
	this.responseTime = responseTime;
	this.type = type;
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

function datetimeToString(date) {
	let dateString = new Date(date);
	return monthName[dateString.getMonth()] + " " + dateString.getDate() + ", " + dateString.getFullYear() + " " +
			dateString.getHours() + ":" + dateString.getMinutes() + ":" + dateString.getSeconds();
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
			if (notificationType == 'updateNotif') element.push('http://localhost:3000/caseDefs');
			else element.push('http://localhost:3000/allCases');
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

async function createOutbreak(diseaseID, type) {
	try {
		let match = await db.exec("SELECT * FROM mmchddb.OUTBREAKS WHERE diseaseID='" + diseaseID +
								"' AND NOT outbreakStatus='Closed';");
		if (match.length > 0) {
			if (match[0].type == type)
				return match[0];
			else if (type == 'Epidemic') {
				let result = await db.updateRows("mmchddb.OUTBREAKS", {outbreakID:match[0].outbreakID}, {type:type});
				if (result)
					return match[0];
				else return false;
			}
			else return match[0];
		} else {
			let newOutbreak = new Outbreak((await generateID("mmchddb.OUTBREAKS")).id, diseaseID, 'Ongoing', new Date(), null, type, null);
			let result = await db.insertOne("mmchddb.OUTBREAKS", newOutbreak);
			return result;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function checkIfOutbreak(diseaseID, caseObj) {
	try {
		// check if disease case is measles (suspected case for alert, confirmed case for epidemic)
		if (diseaseID == "DI-0000000000000") {
			if (caseObj.caseLevel == "Suspected Case") {
				return await createOutbreak("DI-0000000000000", "Alert");
			}
			else if (caseObj.caseLevel == "Non-Measles/Rubella Discarded Case")
				return false;
			else return await createOutbreak("DI-0000000000000", "Epidemic");
		} else {
			// general formula (1 standard deviation above the norm for alert, 2 standard deviation for epidemic)
			let cases = await db.exec("SELECT * FROM mmchddb.CASES WHERE YEARWEEK(reportDate, 1) = YEARWEEK(CURDATE(), 1)");
			let disease = await db.findRows("mmchddb.DISEASES", {diseaseID:diseaseID});
			
			if (cases.length >= disease[0].alertThreshold) {
				return await createOutbreak(diseaseID, "Alert");
			} else if (cases.length >= disease[0].epiThreshold) {
				return await createOutbreak(diseaseID, "Epidemic");
			} else return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
	
}

function computeThreshold(numCases) {
	while (numCases.length < 156) numCases.push({ numCases: 0 });
	// converting obj-array "numCases" to a 1D array
	let flattenedCases = numCases.map(e => e.numCases);
	let thresholds = {
		alertThreshold: Math.floor(math.mean(flattenedCases) + math.std(flattenedCases, "uncorrected")),
		epiThreshold: Math.floor(math.mean(flattenedCases) + math.std(flattenedCases, "uncorrected") * 2),
	}
	return thresholds;
}


async function updateDiseaseThreshold(diseaseID) {
	try {
		let numCases = await db.exec(`SELECT yearweek(reportDate) AS 'yearweek', COUNT(caseID) AS 'numCases'
				FROM mmchddb.CASES WHERE yearweek(reportDate) >= yearweek(DATE_SUB(CURDATE(), INTERVAL 3 YEAR))
				AND diseaseID='${diseaseID}' GROUP BY yearweek(reportDate);`);
		if (numCases.length > 0) {
			let thresholds = computeThreshold(numCases);
			return await db.updateRows("mmchddb.DISEASES", {diseaseID : diseaseID}, {
				alertThreshold: thresholds.alertThreshold,
				epiThreshold: thresholds.epiThreshold
			});
		} else return false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function getOutbreakData(outbreakID) {
	let outbreaks, tempOutbreak = {},
			caseCount, deathCount, growth, attack;
	try {
		if (!!outbreakID) {
			caseCount = await db.exec(`SELECT o.*, o.startDate, o.diseaseID,
					d.epiThreshold, d.diseaseName, a.city AS city,
					COUNT(c.caseID) AS numCases
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON c.diseaseID = o.diseaseID AND c.reportDate > o.startDate
					LEFT JOIN mmchddb.PATIENTS p ON p.patientID = c.patientID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = p.caddressID
					WHERE o.outbreakID = '${outbreakID}'
					GROUP BY a.city
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			let casePast = await db.exec(`SELECT cp.city AS city, COUNT(cp.caseID) AS casePast
					FROM (SELECT pasta.city AS city, pastc.caseID
						FROM mmchddb.CASES pastc
						LEFT JOIN mmchddb.PATIENTS pastp ON pastp.patientID = pastc.patientID
						LEFT JOIN mmchddb.ADDRESSES pasta ON pasta.addressID = pastp.caddressID
						WHERE pastc.diseaseID = '${ caseCount[0].diseaseID }' AND
						pastc.reportDate < ${convDatePHT(caseCount[0].startDate)}
						ORDER BY pastc.reportDate DESC
						LIMIT 0, ${ caseCount[0].epiThreshold }
					) cp
					GROUP BY cp.city;`);
			
			deathCount = await db.exec(`SELECT o.outbreakID, a.city AS city, COUNT(c.caseID) AS numDeaths
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID AND c.reportDate > o.startDate
					LEFT JOIN mmchddb.CASE_DATA cd ON c.caseID = cd.caseID
					AND cd.fieldName = "outcome" AND cd.value = "Dead"
					LEFT JOIN mmchddb.PATIENTS p ON p.patientID = c.patientID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = p.caddressID
					WHERE o.outbreakID = '${outbreakID}'
					GROUP BY a.city
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			let deathPast = await db.exec(`SELECT dp.city AS city, COUNT(dp.caseID) AS deathPast
					FROM (SELECT pasta.city AS city, pastc.caseID
						FROM mmchddb.CASES pastc
						LEFT JOIN mmchddb.CASE_DATA pastcd ON pastcd.caseID = pastc.caseID
						AND pastcd.fieldName = "outcome" AND pastcd.value = "Dead"
						LEFT JOIN mmchddb.PATIENTS pastp ON pastp.patientID = pastc.patientID
						LEFT JOIN mmchddb.ADDRESSES pasta ON pasta.addressID = pastp.caddressID
						WHERE pastc.diseaseID = '${ caseCount[0].diseaseID }' AND
						pastc.reportDate < ${convDatePHT(caseCount[0].startDate)}
						ORDER BY pastc.reportDate DESC
						LIMIT 0, ${ caseCount[0].epiThreshold }
					) dp
					GROUP BY dp.city;`);
			
			/* growth rate: rate of outbreak cases to non-outbreak cases
			 */
			growth = await db.exec(`SELECT o.outbreakID, a.city AS city,
					SUM(CASE WHEN c.reportDate > o.startDate THEN 1 ELSE 0 END) AS growthNum,
					SUM(CASE WHEN c.reportDate < o.startDate THEN 1 ELSE 0 END) AS growthDen
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID
					LEFT JOIN mmchddb.PATIENTS p ON p.patientID = c.patientID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = p.caddressID
					WHERE o.outbreakID = '${outbreakID}'
					GROUP BY a.city
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			let growthPast = await db.exec(`SELECT gp.city AS city,
					SUM(CASE WHEN gp.reportDate < ${convDatePHT(caseCount[0].startDate)} THEN 1 ELSE 0 END) AS growthPast
					FROM (SELECT pasta.city AS city, pastc.reportDate
						FROM mmchddb.CASES pastc
						LEFT JOIN mmchddb.PATIENTS pastp ON pastp.patientID = pastc.patientID
						LEFT JOIN mmchddb.ADDRESSES pasta ON pasta.addressID = pastp.caddressID
						WHERE pastc.diseaseID = '${ caseCount[0].diseaseID }'
						ORDER BY pastc.reportDate DESC
						LIMIT 0, ${ caseCount[0].epiThreshold }
					) gp
					GROUP BY gp.city;`);
			
			/* attack rate: percentage of an at-risk population that contracts a disease
			 */
			attack = await db.exec(`SELECT o.outbreakID, a.city AS city,
					SUM(CASE WHEN c.caseLevel LIKE '%Confirm%' THEN 1 ELSE 0 END) AS attackNum,
					IF(IFNULL(MAX(pad.populationTotal), 0) > 0, MAX(pad.populationTotal), 1) * 100000 AS attackDen
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID AND c.reportDate > o.startDate
					LEFT JOIN mmchddb.PATIENTS p ON p.patientID = c.patientID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = p.caddressID
					LEFT JOIN mmchddb.PROGRAM_ACCOMPS pa ON pa.year = YEAR(o.startDate)
					LEFT JOIN mmchddb.PROGRAM_ACCOMP_DATA pad ON pad.progAccompID = pa.progAccompID AND pad.month = MONTH(o.startDate) - 1
					WHERE o.outbreakID = '${outbreakID}'
					GROUP BY a.city
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			let attackPast = await db.exec(`SELECT ap.city,
					SUM(CASE WHEN ap.caseLevel LIKE '%Confirm%' THEN 1 ELSE 0 END) AS attackPast
					FROM (SELECT pasta.city AS city, pastc.caseLevel
						FROM mmchddb.CASES pastc
						LEFT JOIN mmchddb.PATIENTS pastp ON pastp.patientID = pastc.patientID
						LEFT JOIN mmchddb.ADDRESSES pasta ON pasta.addressID = pastp.caddressID
						WHERE pastc.diseaseID = '${ caseCount[0].diseaseID }'
						ORDER BY pastc.reportDate DESC
						LIMIT 0, ${ caseCount[0].epiThreshold }
					) ap
					GROUP BY ap.city;`);
			
			outbreaks = {
				outbreak: caseCount[0],
				caseCount: caseCount,
				casePast: casePast,
				deathCount: deathCount,
				deathPast: deathPast,
				growth: growth,
				growthPast: growthPast,
				attack: attack,
				attackPast: attackPast
			};
			// console.log(outbreaks);
			outbreaks.outbreak.endDate = outbreaks.outbreak.endDate ? outbreaks.outbreak.endDate : "N/A";
			if (!!outbreaks.outbreak.responseTime) {
				let seconds = Math.floor(outbreaks.outbreak.responseTime / 1000);
				outbreaks.outbreak.responseTime = Math.floor(seconds / 3600) + "h ";
				seconds %= 3600;
				outbreaks.outbreak.responseTime += Math.floor(seconds / 60) + "min ";
				seconds %= 60;
				outbreaks.outbreak.responseTime += seconds + "s";
				console.log("response time: " + outbreaks.outbreak.responseTime);
			} else outbreaks.outbreak.responseTime = "N/A";
		} else {
			caseCount = await db.exec(`SELECT o.*, d.diseaseName, COUNT(c.caseID) + IFNULL(d.epiThreshold, 0) AS numCases
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID AND c.reportDate > o.startDate
					GROUP BY o.outbreakID
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			deathCount = await db.exec(`SELECT o.outbreakID, COUNT(c.caseID) AS numDeaths
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID AND c.reportDate > o.startDate
					LEFT JOIN mmchddb.CASE_DATA cd ON c.caseID = cd.caseID AND cd.fieldName = "outcome" AND cd.value = "Dead"
					GROUP BY o.outbreakID
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			/* growth rate: rate of outbreak cases to non-outbreak cases
			 */
			growth = await db.exec(`SELECT o.outbreakID,
					(SUM(CASE WHEN c.reportDate > o.startDate THEN 1 ELSE 0 END) + IFNULL(d.epiThreshold, 0)) /
					SUM(CASE WHEN c.reportDate < o.startDate THEN 1 ELSE 0 END) AS growthRate
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID
					GROUP BY o.outbreakID
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			/* attack rate: new cases of disease over population
			 */
			attack = await db.exec(`SELECT o.outbreakID,
					(SUM(CASE WHEN c.caseLevel LIKE '%Confirm%' THEN 1 ELSE 0 END) + IFNULL(d.epiThreshold, 0)) /
					IF(IFNULL(MAX(pad.populationTotal), 0) > 0, MAX(pad.populationTotal), 1) * 100000 AS attackRate
					FROM mmchddb.OUTBREAKS o
					LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = o.diseaseID
					LEFT JOIN mmchddb.CASES c ON o.diseaseID = c.diseaseID AND c.reportDate > o.startDate
					LEFT JOIN mmchddb.PROGRAM_ACCOMPS pa ON pa.year = YEAR(o.startDate)
					LEFT JOIN mmchddb.PROGRAM_ACCOMP_DATA pad ON pad.progAccompID = pa.progAccompID
					AND pad.month = MONTH(o.startDate) - 1
					GROUP BY o.outbreakID
					ORDER BY (CASE WHEN o.type = 'Ongoing' THEN '1' ELSE '2' END) ASC, o.startDate DESC;`);
			
			outbreaks = [];
			/* merging everything, ASSUME that same number of rows in all four arrays.
			 * admittedly hacky solution. consider: https://stackoverflow.com/a/64394834
			 */
			for (let i = 0; i < caseCount.length; i++) {
				tempOutbreak = caseCount[i];
				tempOutbreak.numDeaths = deathCount[i].numDeaths;
				tempOutbreak.growthRate = growth[i].growthRate;
				tempOutbreak.attackRate = attack[i].attackRate;
				// console.log(attack[i]);
				if (!!caseCount[i].responseTime) {
					let seconds = caseCount[i].responseTime;
					caseCount[i].responseTime = Math.floor(seconds / 3600) + "h ";
					seconds %= 3600;
					caseCount[i].responseTime += Math.floor(seconds / 60) + "min ";
					seconds %= 60;
					caseCount[i].responseTime += seconds + "s";
					console.log("response time: " + caseCount[i].responseTime);
				} else tempOutbreak.responseTime = "N/A";
				outbreaks.push(tempOutbreak);
			}
		}
		return outbreaks;
	} catch (e) {
		console.log(e);
		return "Server error";
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
		try {
			/*
			let rows = await db.exec(`SELECT userID FROM mmchddb.USERS ORDER BY userID;`);
			if (rows) rows = rows.map(e => e.userID);
			let arr = [];
			let rows = await db.exec(`SELECT SUM(rf.LSmoking), SUM(rf.LAlcoholism), SUM(rf.LDrugUse),
					SUM(rf.LPhysicalInactivity), SUM(rf.CHereditary), SUM(rf.CAsthma), SUM(rf.HHeartDisease),
					SUM(rf.HHypertension), SUM(rf.HObesity), SUM(rf.HDiabetes), SUM(rf.OCleanWater),
					SUM(rf.OAirPollution), SUM(rf.OHealthFacility), SUM(rf.OWasteMgmt), SUM(rf.OVacCoverage),
					SUM(rf.OHealthEdu), SUM(rf.OShelter), SUM(rf.OFlooding), SUM(rf.OPoverty)
					FROM mmchddb.RISK_FACTORS rf
					LEFT JOIN mmchddb.CASES c ON c.caseID = rf.caseID
					WHERE c.diseaseID = 'DI-0000000000003';`);
			for (let [key, val] of Object.entries(rows[0])) {
				arr.push({key: /SUM\(rf\.(\w+)\)/.exec(key)[1], value: val});
			}
			arr.forEach(async (e) => await db.insertOne("mmchddb.RISK_FACTORS_C", e));
			let risks = ["rf.LSmoking", "rf.LAlcoholism", "rf.LDrugUse", "rf.LPhysicalInactivity",
					"rf.CHereditary", "rf.CAsthma", "rf.HHeartDisease", "rf.HHypertension", "rf.HObesity",
					"rf.HDiabetes", "rf.OCleanWater", "rf.OAirPollution", "rf.OHealthFacility",
					"rf.OWasteMgmt", "rf.OVacCoverage", "rf.OHealthEdu", "rf.OShelter", "rf.OFlooding",
					"rf.OPoverty"], risk, rows;
			for (let i = 0; i < risks.length; i++) {
				risk = risks[i];
				rows = await db.exec(`SELECT SUM(CASE WHEN ${risk} = 1 AND c.caseLevel LIKE '%Confirm%' THEN 1 ELSE 0 END) AS exposedDisease,
						SUM(${risk}) AS totalExposed,
						SUM(CASE WHEN ${risk} = 0 AND c.caseLevel LIKE '%Confirm%' THEN 1 ELSE 0 END) AS unexposedDisease,
						SUM(CASE WHEN ${risk} = 0 THEN 1 ELSE 0 END) totalUnexposed, d.diseaseName, '${risk.substr(3)}' AS riskName
						FROM mmchddb.RISK_FACTORS rf
						LEFT JOIN mmchddb.CASES c ON c.caseID = rf.caseID
						LEFT JOIN mmchddb.DISEASES d ON d.diseaseID = c.diseaseID
						GROUP BY d.diseaseName`);
				console.log(rows);
				await db.insertRows("mmchddb.RISK_FACTORS_D", Object.keys(rows[0]), rows.map(Object.values));
			}
			*/
			
			// get all CRFs of 2022
			let YearCRFs = await db.exec(`SELECT * FROM mmchddb.CRFS c WHERE c.year = 2022 ORDER BY c.userID;`);
			
			// get the stopping condition (i.e., the max week available)
			let maxWeek = YearCRFs.reduce((a, b) => Math.max(a, b.week), -Infinity);
			
			// make empty array, dummy obj, and array containing the users present in 2022 CRFs
			let missings = [], obj, userIDs = [...new Set(YearCRFs.map(e => e.userID))];
			
			// for each week until stopping condition...
			for (let i = 1; i <= maxWeek; i++) {
				for (let j = 0; j < userIDs.length; j++) {
					// dummy obj
					obj = {
						CRFID: null,
						diseaseID: "DI-0000000000003",
						userID: userIDs[j],
						week: i,
						year: 2022,
						isPushed: 1
					};
					// check which userIDs don't have that week
					if (YearCRFs.findIndex(e => e.week === obj.week && e.userID === obj.userID) === -1) {
						// push the userIDs into missings
						missings.push(obj);
					}
				}
			}
			// generate new IDs then reform the table with the missing data
			let idArr = await generateIDs("mmchddb.CRFS", missings.length);
			missings.forEach((e, i) => e.CRFID = idArr[i]);
			// await db.insertRows("mmchddb.CRFS", Object.keys(missings[0]), missings.map(Object.values));
			res.status(200).send([Object.keys(missings[0]), missings.map(Object.values)]);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
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
			else res.status(500).send("No disease found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getPatients: async function(req, res) {
		let match = [];
		// checking type of userOnly (must be boolean)
		console.log(req.query);
		try {
			if (req.query.userOnly === "true") {
				// filtered by user only
				match = await db.exec(`SELECT p.*, a1.houseStreet AS currHouseStreet,
						a1.brgy AS currBrgy, a1.city AS currCity, a2.houseStreet AS permHouseStreet,
						a2.brgy AS permBrgy, a2.city AS permCity, MAX(c.reportDate) AS updatedDate
						FROM mmchddb.PATIENTS p
						INNER JOIN mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID
						INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID
						LEFT JOIN mmchddb.CASES c ON p.patientID = c.patientID
						WHERE c.reportedBy = '${req.query.userID}'
						GROUP BY p.patientID;`);
			} else {
				// must be fitered by logged in user's city
				match = await db.exec(`SELECT p.*, a1.houseStreet AS currHouseStreet,
						a1.brgy AS currBrgy, a1.city AS currCity, a2.houseStreet AS permHouseStreet,
						a2.brgy AS permBrgy, a2.city AS permCity, MAX(c.reportDate) AS updatedDate
						FROM mmchddb.PATIENTS p
						INNER JOIN mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID
						INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID
						LEFT JOIN mmchddb.CASES c ON p.patientID = c.patientID
						WHERE a1.city IN (SELECT a.city
							FROM mmchddb.USERS u
							JOIN mmchddb.ADDRESSES a
							ON a.addressID = u.addressID
							WHERE u.userID = '${req.query.userID}')
						GROUP BY p.patientID;`);
			}
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

	getCaseDefsAudit: async function(req, res) {
		try {
			let rows = await db.exec(`SELECT cda.*, d.diseaseName, u.druName
					FROM mmchddb.CASE_DEF_AUDIT cda
					LEFT JOIN mmchddb.DISEASES d ON cda.diseaseID = d.diseaseID
					LEFT JOIN mmchddb.USERS u ON cda.modifiedBy = u.userID;`);
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
			let havingClause,
					userTypeCheck = await db.findRows("mmchddb.USERS", {userID: req.query.userID});
			if (userTypeCheck.length > 0 && userTypeCheck[0].userType.includes("Staff")) {
				havingClause = ``;
			} else if (userTypeCheck.length > 0 && userTypeCheck[0].userType.includes("Lab")) {
				havingClause = `HAVING c.reportedBy = '${req.query.userID}' OR c.investigatorLab = '${req.query.userID}'`;
			} else havingClause = `HAVING c.reportedBy = '${req.query.userID}'`;
			
			let match = await db.exec(`SELECT c.*, d.diseaseName,
					CONCAT(p.lastName, ", ", p.firstName, " ", p.midName) AS patientName,
					a.city, MAX(al.dateModified) AS updatedDate
					FROM mmchddb.CASES c
					INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID
					INNER JOIN mmchddb.PATIENTS p ON c.patientID = p.patientID
					INNER JOIN mmchddb.ADDRESSES a ON p.caddressID = a.addressID
					LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID
					GROUP BY c.caseID
					${havingClause}
					ORDER BY reportDate DESC;`);
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
			let havingClause,
					userTypeCheck = await db.findRows("mmchddb.USERS", {userID: req.query.userID});
			if (userTypeCheck.length > 0 && userTypeCheck[0].userType.includes("Staff")) {
				console.log(userTypeCheck[0]);
				havingClause = `HAVING cr.isPushed = 1 OR cr.userID = '${req.query.userID}'`;
			} else havingClause = `HAVING cr.userID = '${req.query.userID}'`;
			
			let match = await db.exec(`SELECT cr.*, d.diseaseName, a.city, COUNT(c.caseID) AS caseCount,
					n.dateCreated AS submittedOn, MAX(c.reportDate) AS lastCase
					FROM mmchddb.CRFS cr
					INNER JOIN mmchddb.DISEASES d ON cr.diseaseID = d.diseaseID
					INNER JOIN mmchddb.USERS u ON cr.userID = u.userID
					INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID
					LEFT JOIN mmchddb.CASES c ON cr.CRFID = c.CRFID
					LEFT JOIN mmchddb.NOTIFICATIONS n ON c.caseID = n.caseID
					GROUP BY cr.CRFID ${ havingClause }
					ORDER BY cr.year DESC, cr.week DESC;`);
			for (let i = 0; i < match.length; i++) {
				match[i].submitStatus = match[i].isPushed > 0 ? "Pushed" : "Ongoing";
				match[i].submittedOn = match[i].submittedOn ? convDatePHT(new Date(match[i].submittedOn)) : "N/A";
				match[i].lastCase = match[i].lastCase ? convDatePHT(new Date(match[i].lastCase)) : "N/A";
				if (match[i].isPushed > 0) {
					if (match[i].caseCount > 0) {
						if (match[i].lastCase >= new Date(match[i].year, 0, 1 + match[i].week * 7)) {
							match[i].reportStatus = "Late Cases";
						} else match[i].reportStatus = "Cases Submitted";
					} else match[i].reportStatus = "Zero Report";
				} else match[i].reportStatus = "Ongoing";
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
					"WHERE a.editedID = '" + req.query.caseID + "' AND a.fieldName = 'caseLevel'" +
					"ORDER BY a.dateModified;");
			let DRUData = await db.exec("SELECT u.druName, userType AS 'druType', a.city AS 'druCity', CONCAT_WS(', ',a.houseStreet, a.brgy, a.city) AS 'druAddress' " +
					"FROM mmchddb.USERS u INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID " +
					"WHERE u.userID='" + rows[0].reportedBy + "';");

			// console.log(patientData);
			let caseDataObj = {};
			
			caseData.forEach(function(element) {
				caseDataObj[element.fieldName] = element.value;
			});

			if (DRUData[0].druName == 'TestDRU' || DRUData[0].druName == '')
				DRUData[0].druType = 'N/A';

			let dateLastUpdated = new Date(rows[0].reportDate);
			let i = 0;

			if(caseAudit.length > 0){
				for(i = 0; i < caseAudit.length; i++){
					dateLastUpdated = new Date(caseAudit[i].reportDate);
					if (i + 1 == caseAudit.length)
						caseAudit[i].to = rows[0].caseLevel;
					else caseAudit[i].to = caseAudit[i+1].from;
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
			if (data.cases.investigationDate)
				data.cases.investigationDate = dateToString(data.cases.investigationDate);
			if (data.cases.dateOnset)
				data.cases.dateOnset = dateToString(data.cases.dateOnset);
			if (data.cases.dateAdmitted)
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
		let riskFactorsData = [], DRUData = [];
		try {
			// collect relevant data
			let rows = await db.exec(`SELECT c.caseID, c.reportDate, c.caseLevel,
					d.diseaseName AS 'disease', a.city AS 'city', u.druName AS 'reportedBy',
					IFNULL(MAX(al.dateModified), c.reportDate) AS 'updatedDate',
					c.reportedBy, IF(ISNULL(c.CRFID), 'CIF', 'CRF') AS 'type'
					FROM mmchddb.CASES c
					INNER JOIN mmchddb.DISEASES d ON c.diseaseID = d.diseaseID
					INNER JOIN mmchddb.USERS u ON c.reportedBy = u.userID
					INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID
					LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID
					WHERE c.patientID = '${req.query.patientID}' AND c.reportedBy = '${req.query.userID}'
					GROUP BY c.caseID
					ORDER BY IFNULL(MAX(al.dateModified), c.reportDate) DESC;`);
			if (rows.length > 0) {
				riskFactorsData = await db.findRows("mmchddb.RISK_FACTORS", {caseID: rows[rows.length - 1].caseID});
				DRUData = await db.exec(`SELECT u.druName, userType AS 'druType', a.city AS 'druCity',
						a.houseStreet AS 'druHouseStreet', a.brgy AS 'druBrgy', us.pushDataAccept
						FROM mmchddb.USERS u
						INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID
						INNER JOIN mmchddb.USER_SETTINGS us ON us.userID = u.userID
						WHERE u.userID = '${rows[0].reportedBy}';`);
			} else {
				riskFactorsData = [{
					LSmoking: 0,
					LAlcoholism: 0,
					LDrugUse: 0,
					LPhysicalInactivity: 0,
					LOthers: 0,
					CHereditary: 0,
					CAsthma: 0,
					COthers: 0,
					HHeartDisease: 0,
					HHypertension: 0,
					HObesity: 0,
					HDiabetes: 0,
					HOthers: 0,
					OCleanWater: 0,
					OAirPollution: 0,
					OHealthFacility: 0,
					OWasteMgmt: 0,
					OVacCoverage: 0,
					OHealthEdu: 0,
					OShelter: 0,
					OFlooding: 0,
					OPoverty: 0,
					OOthers: 0
				}];
			}
			
			let patientData = await db.exec(`SELECT p.*, a1.houseStreet AS currHouseStreet,
					a1.brgy AS currBrgy, a1.city AS currCity, a2.houseStreet AS permHouseStreet,
					a2.brgy AS permBrgy, a2.city AS permCity
					FROM mmchddb.PATIENTS p
					INNER JOIN mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID
					INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID
					WHERE p.patientID = '${req.query.patientID}';`);
			
			let tclData = await db.exec(`SELECT immunizationStatus, BCGdate,
					HEPAwithdate, HEPAmoredate, OPV1date, OPV2date, OPV3date,
					PENTA1date, PENTA2date, PENTA3date, PCV1date, PCV2date, PCV3date,
					MCV1date, MCV2date, Dengue1date, Dengue2date, Dengue3date
					FROM mmchddb.TCL_DATA WHERE patientID = '${req.query.patientID}';`);
			tclData = tclData.length ? tclData[0] : {};
			let immunization = Object.entries(tclData).reduce(function (prev, e) {
				if (e[0] !== "immunizationStatus") prev[e[0].substr(0, 3)] = !!e[1];
				return prev;
			}, { immunizationStatus: tclData.immunizationStatus });
			
			let data = {
				rowData: rows,
				patient: patientData[0],
				riskFactors: riskFactorsData[0],
				DRUData: DRUData.length ? DRUData[0] : [],
				immunization: immunization
			};
			
			// fixing dates
			data.rowData.forEach(function(element) {
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
					+ "INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID " +
					"WHERE p.patientID = '" + rows[0].patientID + "';");
			let riskFactorsData = await db.findRows("mmchddb.RISK_FACTORS", {caseID: req.query.caseID});
			let caseData = await db.findRows("mmchddb.CASE_DATA", {caseID: req.query.caseID});
			let crfData = await db.findRows("mmchddb.CRFS", {CRFID: rows[0].CRFID});
			let caseAudit = await db.exec("SELECT a.dateModified AS 'reportDate', a.prevValue AS 'from', " +
					"CONCAT(u.firstName,' ', u.midName, ' ', u.lastName, ', ' , u.druName) AS 'reportedBy' " +
					"FROM mmchddb.AUDIT_LOG a JOIN mmchddb.USERS u ON a.modifiedBy = u.userID " +
					"WHERE a.editedID = '" + req.query.caseID + "' AND a.fieldName = 'caseLevel'" +
					"ORDER BY a.dateModified;");
			let DRUData = await db.exec(`SELECT u.druName, userType AS 'druType', a.city AS 'druCity',
					a.houseStreet AS 'druHouseStreet', a.brgy AS 'druBrgy', us.pushDataAccept
					FROM mmchddb.USERS u
					INNER JOIN mmchddb.ADDRESSES a ON u.addressID = a.addressID
					INNER JOIN mmchddb.USER_SETTINGS us ON us.userID = u.userID
					WHERE u.userID = '${rows[0].reportedBy}';`);

			let caseDataObj = {};
			
			caseData.forEach(function(element) {
				caseDataObj[element.fieldName] = element.value;
			});
			
			console.log(DRUData);
			if (!DRUData[0].druName) DRUData[0].druType = 'N/A';

			let dateLastUpdated = new Date(rows[0].reportDate);
			let i = 0;

			if(caseAudit.length > 0){
				for(i = 0; i < caseAudit.length; i++){
					dateLastUpdated = new Date(caseAudit[i].reportDate);
					if(i + 1 == caseAudit.length)
						caseAudit[i].to = rows[0].caseLevel;
					else caseAudit[i].to = caseAudit[i+1].from;
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
			if (data.cases.investigationDate)
				data.cases.investigationDate = dateToString(data.cases.investigationDate);
			if (data.cases.dateOnset)
				data.cases.dateOnset = dateToString(data.cases.dateOnset);
			if (data.cases.dateAdmitted)
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
			let userData = await db.exec(`SELECT u.userType AS druType, u.druName,
					a.city AS druCity, CONCAT(a.houseStreet, ', ', a.brgy) AS druAddr
					FROM mmchddb.USERS u
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID
					WHERE u.userID = '${ req.query.userID }';`);
			if (req.query.CRFID) {
				// if viewing the CRF as a report
				let CRFobj = await db.exec(`SELECT cr.*, u.userType AS druType, u.druName,
						a.city AS druCity, CONCAT(a.houseStreet, ', ', a.brgy) AS druAddr
						FROM mmchddb.CRFS cr
						LEFT JOIN mmchddb.USERS u ON u.userID = cr.userID
						LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = u.addressID
						WHERE cr.CRFID = '${req.query.CRFID}';`);
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
					pushDataAccept: userSettings[0].pushDataAccept,
					userData: userData[0]
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
						pushDataAccept: userSettings[0].pushDataAccept,
						userData: userData[0]
					});
				} else {
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
			else res.status(500).send("No notifications found");
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
	
	getAllOutbreaks: async function(req, res) {
		try {
			let outbreaks = await getOutbreakData();
			res.status(200).send(outbreaks);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getOutbreak: async function(req, res) {
		try {
			let outbreak = await getOutbreakData(req.query.outbreakID);
			console.log(outbreak);
			outbreak.outbreak.timer = datetimeToString(new Date(outbreak.outbreak.startDate.getTime() + 86400000));
			// get all cities across all arrays
			let lookup = [...new Set([
					...outbreak.caseCount.map(e => e.city),
					...outbreak.casePast.map(e => e.city),
					...outbreak.deathCount.map(e => e.city),
					...outbreak.deathPast.map(e => e.city),
					...outbreak.growth.map(e => e.city),
					...outbreak.growthPast.map(e => e.city),
					...outbreak.attack.map(e => e.city),
					...outbreak.attackPast.map(e => e.city)
			])];
			outbreak.outbreakSumm = [];
			lookup.forEach(e1 => {
				outbreak.outbreakSumm.push({
					city: e1,
					...outbreak.caseCount.find(e2 => e2.city === e1),
					...outbreak.casePast.find(e2 => e2.city === e1),
					...outbreak.deathCount.find(e2 => e2.city === e1),
					...outbreak.deathPast.find(e2 => e2.city === e1),
					...outbreak.growth.find(e2 => e2.city === e1),
					...outbreak.growthPast.find(e2 => e2.city === e1),
					...outbreak.attack.find(e2 => e2.city === e1),
					...outbreak.attackPast.find(e2 => e2.city === e1)
				});
			});
			delete outbreak.caseCount;
			delete outbreak.casePast;
			delete outbreak.deathCount;
			delete outbreak.deathPast;
			delete outbreak.growth;
			delete outbreak.growthPast;
			delete outbreak.attack;
			delete outbreak.attackPast;
			
			outbreak.outbreakAudit = await db.exec(`SELECT oa.*, u.druName
					FROM mmchddb.OUTBREAK_AUDIT oa
					LEFT JOIN mmchddb.USERS u ON u.userID = oa.modifiedBy
					WHERE oa.outbreakID = '${req.query.outbreakID}';`);
			for (let i = 0; i < outbreak.outbreakAudit.length; i++) {
				// if array empty
				if (outbreak.outbreakAudit.length > 0) {
					// if at end of array
					if (i === outbreak.outbreakAudit.length - 1)
						outbreak.outbreakAudit[i].to = outbreak.outbreak.outbreakStatus;
					else outbreak.outbreakAudit[i].to = outbreak.outbreakAudit[i+1].prevValue;
				}
			}
			
			outbreak.outbreakCases = await db.exec(`SELECT c.*, a.city, u.druName,
					MAX(al.dateModified) AS updatedDate
					FROM mmchddb.CASES c
					LEFT JOIN mmchddb.PATIENTS p ON p.patientID = c.patientID
					LEFT JOIN mmchddb.ADDRESSES a ON a.addressID = p.caddressID
					LEFT JOIN mmchddb.USERS u ON u.userID = c.reportedBy
					LEFT JOIN mmchddb.AUDIT_LOG al ON c.caseID = al.editedID
					GROUP BY c.caseID
					HAVING c.diseaseID = '${outbreak.outbreak.diseaseID}' AND
					c.reportDate > '${convDatePHT(new Date(outbreak.outbreak.startDate))}';`);
			res.status(200).send(outbreak);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getOutbreakAlertDetails: async function(req, res){
		try {
			let outbreaks = await db.findRows("mmchddb.OUTBREAKS", {outbreakID:req.query.outbreakID});
			if (outbreaks.length > 0) {
				let disease = await db.findRows("mmchddb.DISEASES", {diseaseID:outbreaks[0].diseaseID});
				res.status(200).send({outbreak: outbreaks[0], disease:disease[0]});
			}
			else res.status(400).send("No outbreaks");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getOngoingOutbreaks: async function(req, res){
		try {
			let outbreaks = await db.exec("SELECT * FROM mmchddb.OUTBREAKS WHERE NOT outbreakStatus='Closed'");
			if (outbreaks.length > 0)
				res.status(200).send(outbreaks);
			else res.status(400).send("No outbreaks");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getAllEvents: async function(req, res) {
		try {
			let match = await db.exec("SELECT e.*, a.city FROM mmchddb.EVENTS e " +
									"JOIN mmchddb.ADDRESSES a ON a.addressID = e.addressID;");
			// console.log(match);
			match.forEach(function(element){
				element.dateCaptured = dateToString(element.dateCaptured);
				element.dateReported = dateToString(element.dateReported);
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
				let eventAudit = await db.exec("SELECT a.dateModified AS 'reportDate', a.prevValue AS 'from', " +
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
						else eventAudit[i].to = eventAudit[i+1].from;
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
			else res.status(500).send("No Event found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	getSettings: async function(req, res) {
		let settingsObj = {};
		try {
			let sysSet = (await db.exec(`SELECT * FROM mmchddb.SYSTEM_SETTINGS;`))[0];
			let userSet = (await db.exec(`SELECT * FROM mmchddb.USER_SETTINGS WHERE userID = '${req.query.userID}';`))[0];
			settingsObj.systemSettings = sysSet;
			settingsObj.userSettings = userSet;
			res.status(200).send(settingsObj);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},

	/*
	 * POST METHODS
	 */
	
	postLogin: async function(req, res) {
		let { userEmail, userPassword } = req.body;
		let match, updateCRF, newCRF;
		try {
			// checking if email or username
			if (userEmail.indexOf("@") != -1) {
				match = await db.findRows("mmchddb.USERS", {userEmail: userEmail});
			} else {
				match = await db.findRows("mmchddb.USERS", {userName: userEmail});
			}
			if (match.length > 0) {
				console.log(match);
				bcrypt.compare(userPassword, match[0].userPassword, async function(err, result) {
					console.log(result);
					if (result) {
						req.session.user = match[0];
						// automatically push existing crfs that are not pushed
						console.log("SELECT * FROM mmchddb.CRFS WHERE userID = '" + match[0].userID +
						"' AND isPushed = 0 AND (week != " + (new Date).getWeek() + " OR year != " + (new Date).getFullYear() + ");");
						let notPushedCRFS = await db.exec("SELECT * FROM mmchddb.CRFS WHERE userID = '" + match[0].userID +
						"' AND isPushed = 0 AND (week != " + (new Date).getWeek() + " OR year != " + (new Date).getFullYear() + ");");
						if(notPushedCRFS.length > 0) {
							for(let i = 0; i < notPushedCRFS.length; i++) {
								updateCRF = await db.updateRows("mmchddb.CRFS",{CRFID:notPushedCRFS[i].CRFID}, {isPushed:1});
							}
							newCRF = Object.entries(await generateIDs("mmchddb.CRFS", notPushedCRFS.length));
							newCRF.forEach(function(element,index){
								element.push(notPushedCRFS[index].diseaseID);
								element.push(match[0].userID);
								element.push((new Date).getWeek());
								element.push((new Date).getFullYear());
								element.push(0);
								element.shift();
							});
							result = await db.insertCRFS(newCRF);
						}
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
		let resultAddr = false;
		try {
			user.userID = (await generateID("mmchddb.USERS")).id;
			// extracting address into an object
			let addrObj = {
				houseStreet: user.userHouseStreet,
				brgy: user.userBrgy,
				city: user.userCity
			};
			// then generating an ID for the address
			let addrID = await generateID("mmchddb.ADDRESSES", addrObj);
			// set it to the user and address objects
			addrObj.addressID = addrID.id;
			user.addressID = addrID.id;
			// password hashing
			user.userPassword = await bcrypt.hash(user.userPassword, saltRounds);
			
			// deleting unneeded keys
			delete user.userHouseStreet;
			delete user.userBrgy;
			delete user.userCity;
			delete user.userRePassword;
			
			// inserting address, user, and user settings rows
			if (!addrID.exists) {
				resultAddr = await db.insertOne("mmchddb.ADDRESSES", addrObj);
			}
			let resultReg = await db.insertOne("mmchddb.USERS", user);
			let resultSettings = await db.insertOne("mmchddb.USER_SETTINGS", {
				userID: user.userID,
				pushDataAccept: false
			});
			// result checking/validations
			if (resultReg && resultSettings && resultAddr) res.status(200).send("Register success");
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
			else res.status(500).send("Add disease failed");
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
			event.dateReported = new Date();
			event.assessment = "TBD";

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
		let occuresult = true;

		try {
			let currAddrID = await generateID("mmchddb.ADDRESSES", {
				houseStreet: formData.patient.currHouseStreet,
				brgy: formData.patient.currBrgy,
				city: formData.patient.currCity
			});
			formData.patient.caddressID = currAddrID.id;

			if(formData.patient.occuStreet != '' && formData.patient.occuBrgy != '' && formData.patient.occuCity != ''){
				let occuAddrID = await generateID("mmchddb.ADDRESSES", {
					houseStreet: formData.patient.occuStreet,
					brgy: formData.patient.occuBrgy,
					city: formData.patient.occuCity
				});
	
				if (!occuAddrID.exists) {
					let occuAddr = new Address(occuAddrID, formData.patient.occuStreet, formData.patient.occuBrgy, formData.patient.occuCity);
					occuresult = await db.insertOne("mmchddb.ADDRESSES", occuAddr);
					if(occuresult)
						formData.patient.occuAddrID = occuAddrID.id;
				}
			}
			
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
				
				if ((result || permAddrID.exists) && (occuresult)) {
					delete formData.patient.currHouseStreet;
					delete formData.patient.currBrgy;
					delete formData.patient.currCity;
					delete formData.patient.permHouseStreet;
					delete formData.patient.permBrgy;
					delete formData.patient.permCity;
					delete formData.patient.occuCity;
					delete formData.patient.occuBrgy;
					delete formData.patient.occuStreet;
					
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
									
									if (result){
										let ifOutbreak = await checkIfOutbreak(formData.cases.diseaseID, formData.cases);
										res.status(200).send(ifOutbreak);
									}
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
		let { diseaseDefs, diseaseID, userID } = req.body;
		let arrDefs = Object.keys(diseaseDefs), result = true, query = {
			diseaseID: diseaseID,
			class: null
		}, auditObj = {};

		try {
			for (let i = 0; result && i < arrDefs.length; i++) {
				query.class = arrDefs[i];
				let prevRecord = await db.findRows("mmchddb.CASE_DEFINITIONS", query);
				auditObj = {
					diseaseID: diseaseID,
					class: prevRecord[0].class,
					dateModified: new Date(),
					modifiedBy: userID,
					prevValue: prevRecord[0].definition
				};
				
				let result = await db.updateRows("mmchddb.CASE_DEFINITIONS", query, {
					definition: Object.values(diseaseDefs)[i]
				});
				
				// record audit, comparing if the prev and new definitions are different
				if (auditObj.prevValue !== Object.values(diseaseDefs)[i]) {
					db.insertOne("mmchddb.CASE_DEF_AUDIT", auditObj);
				}
			}
			if (result) {
				let disease = await db.findRows("mmchddb.DISEASES", {"diseaseID" : diseaseID});
				result = await sendBulkNotifs(DRUUserTypes, 'updateNotif', 'The case definitions of ' +
								disease[0].diseaseName + ' have been updated', null);
				if (result) res.status(200).send("Update disease Successful");
				else res.status(500).send("Add Notifications Failed");
			} else res.status(500).send("Update Case Definition error!");
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
						let ifOutbreak = await checkIfOutbreak(caseData[0].diseaseID, caseData[0]);
						res.status(200).send(ifOutbreak);
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
		let { eventID, newStatus, modifiedBy, assessment} = req.body;
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
						{eventStatus: newStatus, assessment:assessment});
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
		// keywords for lab-related information under CASE_DATA
		let keywords = ["lab", "ns1", "igg", "igm", "pcr"];
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
			Object.keys(newLabData).forEach(e1 => {
				if (keywords.find(e2 => e1.includes(e2)) !== undefined) {
					// constructing audit array
					if (labData[e1] !== newLabData[e1]) {
						auditArr.push({
							editedID: caseID,
							dateModified: dateNow,
							fieldName: e1,
							prevValue: labData[e1],
							modifiedBy: submitted
						});
					}
					labData[e1] = newLabData[e1];
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
	
	postEditPatientOutcome: async function(req, res) {
		let { caseID, newOutcome, submitted } = req.body;
		let auditArr = [], dateNow = new Date(), rows, updateObj = {};
		try {
			console.log(newOutcome);
			// update every attr in the object for the input information
			// key basis is newLabData to account for cases with no initial info
			for (let i = 0; i < Object.keys(newOutcome).length; i++) {
				// getting rows
				rows = await db.exec(`SELECT * FROM mmchddb.CASE_DATA WHERE caseID = '${caseID}' AND fieldName = '${Object.keys(newOutcome)[i]}';`);
				console.log(rows[0]);
				
				// constructing audit array and update object
				if (rows.length > 0 && rows[0].value !== newOutcome[Object.keys(newOutcome)[i]]) {
					auditArr.push({
						editedID: caseID,
						dateModified: dateNow,
						fieldName: Object.keys(newOutcome)[i],
						prevValue: rows[0].value ? rows[0].value : "N/A",
						modifiedBy: submitted
					});
					updateObj[Object.keys(newOutcome)[i]] = newOutcome[Object.keys(newOutcome)[i]];
				}
			}
			
			// where updating happens
			for (let i = 0; i < Object.keys(updateObj).length; i++)
				await db.updateRows("mmchddb.CASE_DATA", {
					caseID: caseID,
					fieldName: Object.keys(updateObj)[i]
				}, { value: newOutcome[Object.keys(updateObj)[i]] });
			
			// null check before audit log insertion, esp on Object.keys
			if (auditArr.length > 0) {
				await db.insertRows("mmchddb.AUDIT_LOG", Object.keys(auditArr[0]), auditArr.map(Object.values));
			}
			res.status(200).send("Outcome updated!");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postSubmitCRF: async function(req, res) {
		let { CRFID, diseaseID, userID } = req.body;
		try {
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
			await db.updateRows("mmchddb.CRFS", {
				CRFID: CRFID,
				diseaseID: diseaseID,
				userID: userID
			}, { isPushed: true });
			
			let oldCRF = (await db.findRows("mmchddb.CRFS", { CRFID: CRFID }))[0];
			let nextWeek;
			
			// if cases were submitted ahead of time, generate the next week
			if (oldCRF.year == (new Date()).getFullYear() && oldCRF.week == (new Date()).getWeek()) {
				nextWeek = new Date(oldCRF.year, 0, 1 + oldCRF.week * 7);
			} else { // if not, just get the currect date
				nextWeek = new Date();
			}
			
			// generate new CRF
			await db.insertOne("mmchddb.CRFS", {
				CRFID: (await generateID("mmchddb.CRFS")).id,
				diseaseID: diseaseID,
				userID: userID,
				week: nextWeek.getWeek(),
				year: nextWeek.getFullYear(),
				isPushed: false
			});
			res.status(200).send("done");
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
			cAddress.addressID = (await generateID("mmchddb.ADDRESSES", cAddress)).id;
			oAddress.addressID = (await generateID("mmchddb.ADDRESSES", oAddress)).id;
			if (newPatientInfo.caddressID !== cAddress.addressID) {
				newPatientInfo.caddressID = cAddress.addressID;
				// insert new address obj
				await db.insertOne("mmchddb.ADDRESSES", cAddress);
			}
			if (newPatientInfo.occuAddrID !== oAddress.addressID) {
				newPatientInfo.occuAddrID = oAddress.addressID;
				// insert new address obj
				await db.insertOne("mmchddb.ADDRESSES", oAddress);
			}
			
			// updating patient
			await db.updateRows("mmchddb.PATIENTS", { patientID: patientID }, newPatientInfo);
			res.status(200).send(newPatientInfo);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},

	postUpdatePushData: async function(req,res){
		try {
			let {userID, pushDataAccept} = req.body;
			let updateSettings = await db.updateRows("mmchddb.USER_SETTINGS", {userID: userID}, {pushDataAccept: pushDataAccept});
			if (updateSettings) res.status(200).send();
			else res.status(500).send();
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postUpdateOutbreakStatus: async function(req, res) {
		try {
			let { outbreakID, newStatus, userID } = req.body, updateObj = { outbreakStatus: newStatus.newStatus }
					dateNow = new Date();
			let outbreak = await db.findRows("mmchddb.OUTBREAKS", { outbreakID: outbreakID });
			
			// response time updating
			if (newStatus.newStatus === "Ongoing with Initial Response" && outbreak.length > 0) {
				updateObj.responseTime = Math.floor((dateNow - new Date(outbreak[0].startDate)) / 1000);
			}
			await db.updateRows("mmchddb.OUTBREAKS", { outbreakID: outbreakID }, updateObj);
			
			// outbreak audit
			let audit = {
				outbreakID: outbreakID,
				modifiedBy: userID,
				dateModified: dateNow,
				prevValue: outbreak[0].outbreakStatus,
				remarks: newStatus.remarks
			};
			await db.insertOne("mmchddb.OUTBREAK_AUDIT", audit);
			res.status(200).send("Updated outbreak status.");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postUpdateSettings: async function(req, res) {
		try {
			let { day, time, userID, consent } = req.body.cronDetails, settingUpdate;
			timeArr = time.split(":");
			let userType = await db.exec(`SELECT u.userType FROM mmchddb.USERS u WHERE u.userID = '${userID}'`);
			
			/* two updates: (1) consent and (2) cron time */
			if (["pidsrStaff", "techStaff", "lhsdChief", "resuHead", "chdDirector", "fhsisStaff"].includes(userType[0].userType)) {
				settingUpdate = await db.exec(`UPDATE mmchddb.SYSTEM_SETTINGS ss
						SET ss.reportingDay = '${day}', ss.reportingHour = ${timeArr[0]},
						ss.reportingMinute = ${timeArr[1]}
						WHERE ss.settingID = 0;`);
				task.stop();
				task = cron.schedule(timeArr[1] + " " + timeArr[0] + " * * " + day, indexFunctions.cronCRFPushData);
			} else {
				settingUpdate = await db.exec(`UPDATE mmchddb.USER_SETTINGS us
						SET us.pushDataAccept = ${consent}
						WHERE us.userID = '${userID}';`);
			}
			if (settingUpdate) res.status(200).send("Settings saved.");
			else res.status(200).send("Settings not saved properly.");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	/*
	 * CRON METHODS
	 */
	cronCRFDeadlineNotif: async function() {
		try {
			let result = await sendBulkNotifs(DRUUserTypes, 'deadlineNotif',
					`REMINDER: Please submit your Case Report Forms by Friday.
					If not submitted, forms will be automatically collected by Friday at 5:00PM.`, null);
			if (result) {
				result = await sendBulkNotifs(['pidsrStaff', 'fhsisStaff'], 'deadlineNotif',
						'REMINDER: Please start reminding DRUs to submit their Case Report Forms', null);
				if (result) {
					console.log("Adding notification success");
				} else console.log("Adding Notification to Staff Failed");
			} else console.log("Adding Notification to DRU Failed");
		} catch (e) {
			console.log(e);
			console.log("Server Error");
		}
	},
	
	cronCRFPushData: async function() {
		let currWeek, nextWeek;
		try {
			let crfs = await db.exec(`SELECT * FROM mmchddb.CRFS c
					WHERE c.userID IN(SELECT u.userID FROM mmchddb.USERS u
					JOIN mmchddb.USER_SETTINGS us ON us.userID = u.userID
					WHERE us.pushDataAccept = 1) AND c.isPushed = 0;`);
			let pushData = await db.exec(`UPDATE mmchddb.CRFS c SET c.isPushed = 1
					WHERE c.userID IN(SELECT u.userID FROM mmchddb.USERS u
					JOIN mmchddb.USER_SETTINGS us ON us.userID = u.userID
					WHERE us.pushDataAccept = 1) AND c.isPushed = 0;`);
			if (pushData) {
				// generate new CRFs
				for (let i = 0; i < crfs.length; i++) {
					let newCRFID = (await generateID("mmchddb.CRFS")).id;
					currWeek = new Date(crfs[i].year, 0, (1 + crfs[i].week * 7));
					nextWeek = new Date(currWeek.getFullYear(), currWeek.getMonth(), currWeek.getDate() + 7);
					await db.insertOne("mmchddb.CRFS", {
						CRFID: newCRFID,
						diseaseID: crfs[i].diseaseID,
						userID: crfs[i].userID,
						week: nextWeek.getWeek(),
						year: nextWeek.getFullYear(),
						isPushed: false
					});
				}
				let result = await sendBulkNotifs(DRUUserTypes, 'pushDataNotif',
						'SUBMISSION UPDATE: Your Case Report Forms for Week ' +
						currWeek.getWeek() + ' has been automatically pushed to MMCHD-RESU', null);
				if (result) console.log("Push Data Success");
				else console.log("Adding Notification to DRU Failed");
			} else {
				console.log("Update CRF Push failed");
			}
		} catch (e) {
			console.log(e);
			console.log("Server Error");
		}
	},
	cronUpdateThresholds: async function() {
		try {
			let diseases = await db.findAll("mmchddb.DISEASES");
			for (let i = 0; i < diseases.length; i++) {
				let result = await updateDiseaseThreshold(diseases[i].diseaseID);
				if (result) console.log(diseases[i].diseaseName + " thresholds updated successfully");
				else console.log(diseases[i].diseaseName + " thresholds were not updated");
			}
		} catch (e) {
			console.log(e);
			console.log("Server Error");
		}
	}
};

module.exports = indexFunctions;
