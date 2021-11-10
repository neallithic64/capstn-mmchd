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

function Address(addressID, houseNo, streetName, brgy, city, province, region, country) {
	this.addressID = addressID;
	this.houseNo = houseNo;
	this.streetName = streetName;
	this.brgy = brgy;
	this.city = city;
	this.province = province;
	this.region = region;
	this.country = country;
}

/** ON ID CREATION, AND FORMAT:
	- 
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

function Event(eventID, userID, addressID, remarks, caseStatus, dateSubmitted){
	this.eventID = eventID;
	this.userID = userID;
	this.addressID = addressID;
	this.remarks = remarks;
	this.caseStatus = caseStatus;
	this.dateSubmitted = dateSubmitted;
}

async function generateID(table) {
	try {
		let rowcount = await db.findRowCount(table);
		// console.log(rowcount);
		let id = getPrefix(table);
		for (let i = 0; i < 13 - rowcount.toString.length; i++)
			id += '0';
		id += rowcount.toString();
		return id;	
	} catch (e) {
		console.log(e);
		return false;
	}
}

async function createAddress(address) {
	try {
		address.addressID = await generateID("mmchddb.ADDRESSES");
		let r = await db.insertOne("mmchddb.ADDRESSES", address);
		return r;
	} catch(e) {
		console.log(e);
		return false;
	}
}

async function createCase(cases){
	try {
		cases.caseID = await generateID("mmchddb.CASES");
		let r = await db.insertOne("mmchddb.CASES", cases);
		return r;
	} catch(e) {
		console.log(e);
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
		// let r = await db.findAll("mmchddb.TARGETS_REF");
		// let r = await db.updateRows("mmchddb.TARGETS_REF", {targetDesc: "desc1"}, {targetDesc: "desc999"});
		// console.log(r);
		let r = await createAddress(new Address(null, '40', 'Basilio Street', 'Barangay Acacia', 'Malabon City',
										'Metro Manila', 'NCR', 'Philippines'));
		console.log(r);
		res.send("exec done");
	},

	getDisease: async function(req,res) {
		// let{
		// 	query
		// } = req.body;

		try {

			let query = {
				diseaseID :"DI-000000000000"
			};

			let match = await db.findRows("mmchddb.DISEASES", query);

			if (match.length > 0)
				res.status(200).send(match);
			else
				res.status(500).send("No disease found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	getPatientAutofill: async function(req,res){
		// let{
		// 	query
		// } = req.body;
		
		try {

			let query = {
				firstName: '',
				lastName : 'Garcia',
				midName : 'Este'
			};

			let match = await db.findRowsLike("mmchddb.PATIENTS", query);
			console.log(match);
			if (match.length > 0)
				res.status(200).send(match);
			else
				res.status(500).send("No Patients found");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	/*
	 * POST METHODS 
	 */
	postLogin: async function(req, res) {
		let { email, password } = req.body;
		let match;
		try {
			// checking if email or username
			if (email.indexOf("@") != -1) {
				match = await db.findRows("mmchddb.USERS", {email: email});
			} else {
				match = await db.findRows("mmchddb.USERS", {userName: email});
			}
			if (match.length > 0) {
				bcrypt.compare(password, match[0].password, function(err, result) {
					console.log(result);
					if (result) {
						req.session.user = match[0];
						res.status(200).send("Login successful.");
						// ALTERNATIVE (to reconsider user type checking):
						// res.status(200).send({user: match[0]});
					} else res.status(403).send("Incorrect password.");
				});
			} else res.status(403).send("No user found.");
		} catch(e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},
	
	postRegUser: async function(req, res) {
		let { userName, email, password, userType, addressID,
				lastName,firstName, midName } = req.body;
		try {
			let userID = await generateID("mmchddb.USERS"); 
			let addressID = "AD-0000000000000";
			let password = await bcrypt.hash("password",saltRounds);
			console.log(password);
			let user = new User(userID, "testuser", "testuser@gmail.com", password, "sample", addressID,
			"Garcia", "Andre Emmanuel", "Servillon");

			let result = await db.insertOne("mmchddb.USERS", user);
			console.log(result);
			if (result) res.status(200).send("Register success");
			else res.status(500).send("Registr failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	postAddDisease : async function(req, res) {
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

			let disease = new Disease(diseaseID, "Sample Disease", "Insert symptoms here",
										"Insert Suspected here", "Insert Probable here",
										"Insert Confirmed here", true, 100);
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

	postAddPatient : async function(req, res) {
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
				res.status(200).send("Add patient success");
			else
				res.status(500).send("Add patient failed");

		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},
	
	postAddEvent : async function(req,res){
		// let{
		// 	eventID, userID, addressID, remarks, caseStatus, dateSubmitted
		// } = req.body;

		try {
			let eventID = await generateID("mmchddb.EVENTS"); 

			let event = new Event(eventID, 'US-0000000000000', 'AD-0000000000000', 'Insert Remarks here', 'Ongoing', '2021-11-01 00:00:00')

			let result = await db.insertOne("mmchddb.EVENTS", event);
			console.log(result);
			if (result)
				res.status(200).send("Add patient success");
			else
				res.status(500).send("Add patient failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	postLogout: async function(req, res) {
		req.session.destroy();
		res.status(200).send("Logged out.");
	},
	
	postNewCase: async function(req, res) {
		// let {  formData } = req.body;
			let formData = {
				cases: {
					caseID: '',
					patientID: 'PA-0000000000000',
					diseaseID: 'DI-0000000000000',
					reportedBy: 'US-0000000000000',
					caseLevel: 'Suspected',
					reportDate: '2021-11-01 00:00:00',
					investigationDate: '2021-11-01 00:00:00',
					dateAdmitted: '2021-11-01 00:00:00',
					dateOnset: '2021-11-01 00:00:00',
					reporterName: 'Andre Garcia',
					reporterContact: '09173131333',
					investigatorName: 'Shannon Ho',
					investigatorContact: '09171234567',
				  },
				  caseData: {
					// firstname: 'Andre',
					// lastname: 'Garcia',
					// middlename: 'Servillon',
					// birthdate: '2021-08-08 00:00:00',
					// age: '14',
					// sex: '',
					// pregnancy: '',
					// currentAddress: '',
					// permanentAddress: '',
					// patientAdmitted: '',
					// indigenousGroup: '',
					contactperson: 'Daisy S. Garcia',
					contactpersonNum: '09178311218',
					// symptoms: {
					  fever: true,
					  rash: true,
					  lymph: false,
					  cough: false,
					  koplik: false,
					  runnynose: false,
					  redeye: false,
					  arthrisis: false,
					// },
					complications: null,
					otherSymptoms: null,
					diagnosis: 'Insert Diagnosis here',
				  }
			}

		try {
			formData.cases.caseID = await generateID("mmchddb.CASES"); 
			let result = await createCase(formData.cases);
			
			if (result){
				let newCaseData = Object.entries(formData.caseData);

				newCaseData.forEach(function (element) {
					element.push(formData.cases.caseID);				
					element.push(formData.cases.diseaseID);
				  });
				
				//   console.log(newCaseData);

				let result = await db.insertCaseData(newCaseData);
				if(result)
					res.status(200).send("Add case successful");
				else res.status(500).send("Add case data failed")
			} 
			else res.status(500).send("Add case failed");
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
					caseID: caseId,
					diseaseID: caseData[0].diseaseID,
					dateModified: new Date(),
					fieldName: "caseLevel",
					prevValue: caseData[0].status,
					modifiedBy: req.session.user.userId
				};
				console.table(caseAudit);
				// inserting the case audit object to the db
				let newCaseAudit = await db.insertOne("mmchddb.CASE_AUDIT", caseAudit);
				// then updating the case object itself
				let updateCase = await db.updateRows("mmchddb.CASES",
						{caseID: caseId},
						{caseLevel: newStatus});
				if (newCaseAudit && updateCase) {
					// TODO: sending of notification as well to the bodies involved
					// another insert, but this time at the NOTIFS table!
					// await db.insertOne("mmchddb.NOTIFS", { something something });
					res.status(200).send("Case has been updated!");
				} else res.status(500).send("Error making db transaction.");
			} else res.status(404).send("No case with such ID found.");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error.");
		}
	},

	postUpdateCaseDef: async function(req, res){
		// let{ 
			// disease
		// } = req.body;

		try {

			let disease = new Disease(null, null, "Insert update symptoms here",
										"Insert update Suspected here", "Insert update Probable here",
										null, true, 50);
			
			// Removes null properties from object
			Object.keys(disease).forEach(key => {
				let value = disease[key];
				let hasProperties = value && Object.keys(value).length > 0;
				if (value === null) {
					delete disease[key];
				}
				else if ((typeof value !== "string") && hasProperties) {
					removeNullProperties(value);
				}
				});

			let query = {
				diseaseID : "DI-0000000000000"
				// diseaseID : disease.diseaseID
			};

			let result = await db.updateRows("mmchddb.DISEASES", query, disease);
      
			if (result)
				res.status(200).send("Update disease success");
			else
				res.status(500).send("Update disease failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	}
};

module.exports = indexFunctions;
