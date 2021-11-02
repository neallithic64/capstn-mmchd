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

async function generateID(table) {
	try {
		let rowcount = await db.findRowCount(table);
		console.log(rowcount);
		let id = getPrefix(table);
		for (let i = 0; i < 13 - rowcount; i++)
			id += '0';
		id += rowcount.toString();
		return id;	
	} catch (e) {
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
		let r = await generateID("mmchddb.PROGRAMS");
		console.log(r);
		res.send("exec done");
	},

	/*
	 * POST METHODS 
	 */
	postLogin: async function(req, res) {
		let { user, password } = req.body;
		let match;
		try {
			// checking if email or username
			if (user.indexOf("@") != -1) {
				match = await db.findRows("mmchddb.USERS", {email: user});
			} else {
				match = await db.findRows("mmchddb.USERS", {username: user});
			}
			console.log(match.length);
			if (match.length > 0) {
				bcrypt.compare(password, match[0].password, function(err, result) {
					if (result) {
						// insert user type checking
						req.session.user = match[0];
						res.status(200).send("Login successful.");
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
			// TODO: Generate userID and create address table row
			// let userID = await generateUserID();
			// let addressID = await createAddress();
			let password = await bcrypt.hash("password", saltRounds);
			let user = new User(userID, userName, email, password, userType, addressID,
					lastName, firstName, midName);
			let result = await db.insertOne("mmchddb.USERS", user);
			console.log(result);
			if (result) res.status(200).send("Register success");
			else res.status(500).send("Registr failed");
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
		// let {  } = req.body;
		
		try {
			// let newCaseId = await genCaseID();
			let newCase = {
				caseId: newCaseId
			};
			let result = awaiat db.insertOne("mmchddb.CASES", newCase);
			if (result) res.status(200).send("");
			else res.status(500).send("");
		} catch (e) {
			
		}
	},
	
	postUpdateCaseStatus: async function(req, res) {
		let { caseId, newStatus } = req.body;
		try {
			let caseAudit = {
				caseId: caseId,
				dateModified: new Date(),
				fieldName: "",
				prevValue: "",
				modifiedBy: req.session.user.userId
			};
			console.table(causeAudit);
			res.status().send();
		} catch (e) {
			
		}
	}
};

module.exports = indexFunctions;
