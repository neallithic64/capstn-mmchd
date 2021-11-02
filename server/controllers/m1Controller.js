const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");
/* Object constructors */
function User(userID, userName, email, password, userType, addressID,
				lastName,firstName, midName) {
	this.userID = userID;
	this.userName = userName;
	this.email = email;
	this.password = password;
	this.userType = userType;
	this.addressID = addressID;
	this.lastName = lastName;
	this.firstName = firstName;
	this.midName = midName;
}

function Address(addressID, houseNo, streetName, brgy, city, province, region, country){
	this.addressID = addressID;
	this.houseNo = houseNo;
	this.streetName = streetName;
	this.brgy = brgy;
	this.city = city;
	this.province = province;
	this.region = region;
	this.country = country;
}

function Disease(diseaseID, diseaseName, symptomDefinition, suspectedDefinition, probableDefinition,
					confirmedDefinition, notifiable, caseThreshold) {
	this.diseaseID = diseaseID;
	this.diseaseName = diseaseName;
	this.symptomDefinition = symptomDefinition;
	this.suspectedDefinition = suspectedDefinition;
	this.probableDefinition = probableDefinition;
	this.confirmedDefinition = confirmedDefinition;
	this.notifiable = notifiable;
	this.caseThreshold = caseThreshold;
}

function Patient(patientID, epiID, lastName, firstName, midName, caddressID, paddressID, sex,
					birthDate, ageNo, ageType, admitStatus, civilStatus, occupation, companyName,
					comaddressID, schoolName, schaddressID, guardianName, indigeneous, indGroup,
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
	this.companyName = companyName;
	this.comaddressID = comaddressID;
	this.schoolName = schoolName;
	this.schaddressID = schaddressID;
	this.guardianName = guardianName;
	this.indigeneous = indigeneous;
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

function getPrefix(table){
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
 
async function generateID(table){
	try {
		let rowcount = await db.findRowCount(table);
		// console.log(rowcount);
	
		let id = getPrefix(table);
		for(let i = 0; i < 13 - rowcount; i++)
			id += '0';
		id += rowcount.toString();
		
		return id;	
	} catch (e) {
		throw e;
	}
}

async function createAddress(address){
	try {
		address.addressID = await generateID("mmchddb.ADDRESSES");
		let r = await db.insertOne("mmchddb.ADDRESSES", address);
		return r;
	} catch(e) {
		throw e;
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
		// let r = await db.findAll("mmchddb.TARGETS_REF");
		// let r = await db.updateRows("mmchddb.TARGETS_REF", {targetDesc: "desc1"}, {targetDesc: "desc999"});
		// console.log(r);
		let r = await createAddress(new Address(null, '40', 'Basilio Street', 'Barangay Acacia', 'Malabon City',
										'Metro Manila', 'NCR', 'Philippines'));
		console.log(r);
		res.send("exec done");
	},

	/*
	 * POST METHODS 
	 */
	postLogin: async function(req, res) {
		// let{
		// 	email, password
		// } = req.body;
		let email = "testuser@gmail.com";
		let password = "password";
		try {
			let match = await db.findRows("mmchddb.USERS", {email: email});
			console.log(match);
			if (match.length > 0) {
				bcrypt.compare(password, match[0].password, function(err,result) {
					if (result) {
						// insert user type checking
						res.send("Login successful");
					}
					else res.send("Incorrect Password");
				});
			} else res.send("No user found");
		} catch(e) {
			res.send(e);
		}
	},

	postRegUser : async function(req,res){
		// let{
		// 	userName, email, password, userType, addressID,
		// 	lastName,firstName, midName
		// } = req.body;
		
		var pass
		try {
			// TODO: Generate userID and create address table row
			// let userID = await generateuserID();
			// let addressID = await createAddress();

			let userID = await generateID("mmchddb.USERS"); 
			let addressID = "AD-0000000000000";
			let password = await bcrypt.hash("password",saltRounds);
			console.log(password);

			let user = new User(userID, "testuser", "testuser@gmail.com", password, "sample", addressID,
			"Garcia", "Andre Emmanuel", "Servillon");

			// let user = User(userID, userName, email, password, userType, addressID,
			// 	lastName,firstName, midName);

			let result = await db.insertOne("mmchddb.USERS",user);
			console.log(result);
			if (result)
				res.send("success");
			else
				res.send("failed");
		} catch (e) {
			res.send(e);
		}
	},

	postAddDisease : async function(req, res){
		// let{ 
			// diseaseName, 
			// symptomDefinition, 
			// suspectedDefinition, 
			// probableDefinition,
			// confirmedDefinition, 
			// notifiable, 
			// caseThreshold
		// } = req.body;

		try {
			let diseaseID = await generateID("mmchddb.DISEASES"); 

			let disease = new Disease(diseaseID, "Sample Disease", "Insert symptoms here", "Insert Suspected here", 
										"Insert Probable here", "Insert Confirmed here", true, 100);

			let result = await db.insertOne("mmchddb.DISEASES", disease);
			console.log(result);
			if (result)
				res.send("success");
			else
				res.send("failed");
		} catch (e) {
			res.send(e);
		}
	}, 

	postAddPatient : async function(req, res){
		// let{ 
			// patientID, epiID, lastName, firstName, midName, caddressID, paddressID, sex,
			// 		birthDate, ageNo, ageType, admitStatus, civilStatus, occupation, companyName,
			// 		comaddressID, schoolName, schaddressID, guardianName, indigenous, indGroup,
			// 		pregnant, pregMonths, HCPN, ILHZ
		// } = req.body;

		try {
			let patientID = await generateID("mmchddb.PATIENTS"); 

			let patient = new Patient(patientID, "EPI-121312", "Garcia", "Benjamin", "Estepa", "AD-0000000000000", "AD-0000000000000",
										"Male", '1982-02-27 00:00:00', 39, "years", 'yes', "Married", "Working", "Globe", 
										"AD-0000000000000", "De La Salle University", "AD-0000000000000", null,
										false, null, false, null, 'Medicare', "Malabon ILHZ");

			let result = await db.insertOne("mmchddb.PATIENTS", patient);
			console.log(result);
			if (result)
				res.send("success");
			else
				res.send("failed");
		} catch (e) {
			res.send(e);
		}
	}
};

module.exports = indexFunctions;
