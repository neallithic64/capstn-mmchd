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

/** ON ID CREATION, AND FORMAT:
	- 
*/

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
			console.log(match);
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


	postRegUser : async function(req,res){
		let { userName, email, password, userType, addressID,
				lastName,firstName, midName
				} = req.body;
		try {
			// TODO: Generate userID and create address table row
			// let userID = await generateUserID();
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
