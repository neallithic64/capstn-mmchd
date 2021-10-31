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
		console.log(rowcount);
	
		let id = getPrefix(table);
		for(let i = 0; i < 13 - rowcount; i++)
			id += '0';
		id += rowcount.toString();
		
		return id;	
	} catch (e) {
		throw e
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

			let userID = "User-00000001"; 
			let addressID = null;
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

};

module.exports = indexFunctions;
