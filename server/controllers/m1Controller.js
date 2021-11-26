const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models/db");
/* Object constructors */
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


async function generateID(table) {
	// TODO: add exist-check for "mmchddb.ADDRESSES"
	try {
		let rowcount = await db.findRowCount(table);
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

async function createCase(cases) {
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
			let match = await db.exec("SELECT p.*, "
					+ "a1.houseStreet AS currHouseStreet, a1.brgy AS currBrgy, a1.city AS "
					+ "currCity, a2.houseStreet AS permHouseStreet, a2.brgy AS permBrgy, "
					+ "a2.city AS permCity FROM mmchddb.PATIENTS p INNER JOIN "
					+ "mmchddb.ADDRESSES a1 ON p.caddressID = a1.addressID "
					+ "INNER JOIN mmchddb.ADDRESSES a2 ON p.paddressID = a2.addressID;");
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
	
	getCases: async function(req, res) {
		try {
			let match = await db.findRows("mmchddb.CASES");
			res.status(200).send(match);
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
						console.log(req.session);
						// res.status(200).send("Login successful.");
						// // ALTERNATIVE (to reconsider user type checking):
						res.status(200).send({user: match[0]});
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
			user.userID = await generateID("mmchddb.USERS");
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
			disease.diseaseID = await generateID("mmchddb.DISEASES");
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
		let { formData } = req.body;

		try {
			formData.patient.patientID = await generateID("mmchddb.PATIENTS");

			// let patient = new Patient(patientID, "EPI-121312", "Garcia", "Benjamin", "Estepa", "AD-0000000000000", "AD-0000000000000",
			// 							"Male", '1982-02-27 00:00:00', 39, "years", 'yes', "Married", "Working", "Globe", 
			// 							"AD-0000000000000", "De La Salle University", "AD-0000000000000", null,
			// 							false, null, false, null, 'Medicare', "Malabon ILHZ");

			let result = await db.insertOne("mmchddb.PATIENTS", formData.patient);
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
	
	postAddEvent: async function(req, res) {
		let { event } = req.body;

		try {
			event.eventID = await generateID("mmchddb.EVENTS");

			// let event = new Event(eventID, 'US-0000000000000', 'AD-0000000000000', 'Insert Remarks here', 'Ongoing', '2021-11-01 00:00:00')

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

	/**	RiskFactors 
			- L : LifeStyle
			- C : Current Health Condition
			- H : Historical Health Data
			- O : Others
	*/
	postNewCase: async function(req, res) {
		let { formData } = req.body;
		console.log(formData);
		let result;

		try {
			let currAddrID = await generateID("mmchddb.ADDRESSES");
			formData.patient.caddressID = currAddrID;
			let currAddr = new Address(currAddrID, formData.patient.currHouseStreet, formData.patient.currBrgy, formData.patient.currCity);
			result = await db.insertOne("mmchddb.ADDRESSES", currAddr);
			
			if (result) {
				let permAddrID = await generateID("mmchddb.ADDRESSES");
				formData.patient.paddressID = permAddrID;
				let permAddr = new Address(permAddrID, formData.patient.permHouseStreet, formData.patient.permBrgy, formData.patient.permCity);
				result = await db.insertOne("mmchddb.ADDRESSES", permAddr);
				
				if (result) {
					delete formData.patient.currHouseStreet;
					delete formData.patient.currBrgy;
					delete formData.patient.currCity;
					delete formData.patient.permHouseStreet;
					delete formData.patient.permBrgy;
					delete formData.patient.permCity;
					// temp fix
					formData.patient.occuAddrID = null;
					
					formData.patient.patientID = await generateID("mmchddb.PATIENTS");
					result = await db.insertOne("mmchddb.PATIENTS", formData.patient);
					
					if (result) {
						formData.cases.caseID = await generateID("mmchddb.CASES");
						formData.cases.patientID = formData.patient.patientID;
						// formData.cases.reportedBy = req.session.user.userID;
						result = await createCase(formData.cases);
						
						if (result) {
							formData.caseData.noMCVreason = formData.caseData.noMCVreason.join(",");
							formData.caseData.sourceInfection = formData.caseData.sourceInfection.join(",");
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
									res.status(200).send("Add case success");
								} else res.status(500).send("Add risk factor failed");
							} else res.status(500).send("Add case data failed");
						} else res.status(500).send("Add case failed");
					} else res.status(500).send("Add patient failed");
				} else res.status(500).send("Add perm address failed");
			} else res.status(500).send("Add curr address failed");
		} catch (e) {
			console.log(e);
			res.status(500).send("Server error");
		}
	},

	postUpdateCaseDef: async function(req, res) {
		let { caseDef, diseaseID } = req.body;

		try {
			caseDef.forEach(function (element) {
				Object.keys(element).forEach(key => {
					let value = element[key];
					let hasProperties = value && Object.keys(value).length > 0;
					if (value === null) {
						delete element[key];
					} else if ((typeof value !== "string") && hasProperties) {
						removeNullProperties(value);
					}
				});
			});
			let i = 0;
			let query = {
				diseaseID: diseaseID,
				class: null
			};

			while(result && caseDef.length < i) {
				query.class = caseDef[i].class;
				result = await db.updateRows("mmchddb.CASE_DEFINITIONS", query, caseDef[i]);
				i++;
			}
			if (result)
				res.status(200).send("Update disease success");
			else 
				res.status(500).send("Update Case Definition");
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
	}
};

module.exports = indexFunctions;
