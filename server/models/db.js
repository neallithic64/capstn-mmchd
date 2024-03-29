const mysql = require("mysql2/promise");

// Favouring pools over connections considering the scale of the app
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

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
		case "mmchddb.TCL_EVAL":
			return "TE-";
		case "mmchddb.PROGRAM_EVAL":
			return "PE-";
		case "mmchddb.PROGRAM_ACCOMPS":
			return "PC-";
	}
	return undefined;
}

/** Expected input:
	Object {
		column1: "value1",
		column2: "value2"
	}
 * Expected output:
 * String "column1 = 'value1' AND column2 = 'value2';"
 * NOTE: this only performs string matching for the moment
 */
function makeWhereClause(obj) {
	let entriesArr = [];
	for (let [key, value] of Object.entries(obj)) {
		if (typeof(value) == "boolean") {
			if (value) entriesArr.push(key + " = 1");
			else entriesArr.push(key + " = 0");
		} else entriesArr.push(key + " = " + "'" + value + "'");
	}
	return entriesArr.join(" AND ") + ";";
}

/** Expected input:
	Object {
		column1: "value1",
		column2: "value2"
	}
 * Expected output:
 * String "column1 LIKE '%value1%' AND column2 LIKE '%value2%';"
 * NOTE: this only performs string matching for the moment
 */
function makeWhereLikeClause(obj) {
	let entriesArr = [];
	for (let [key, value] of Object.entries(obj)) {
		entriesArr.push(key + " LIKE " + "'" + value + "%'");
	}
	return entriesArr.join(" AND ") + ";";
}

function makeWhereOrClause(obj, field) {
	let entriesArr = [];
	for (let [key, value] of Object.entries(obj)) {
		entriesArr.push(field + " = " + "'" + value + "'");
	}
	return entriesArr.join(" OR ") + ";";
}
/** Expected input:
	Object {
		column1: "value1",
		column2: "value2"
	}
 * Expected output:
 * String "column1 = 'value1', column2 = 'value2'"
 * NOTE: this only performs string matching for the moment
 */
function makeSetClause(obj) {
	let entriesArr = [];
	for (let [key, value] of Object.entries(obj)) {
		if (typeof(value) == "boolean") {
			if (value) entriesArr.push(key + " = 1");
			else entriesArr.push(key + " = 0");
		} else entriesArr.push(key + " = " + "'" + value + "'");
	}
	return entriesArr.join(", ");
}

const database = {
	/** Not really a useful function, it was used for sandboxing on initial test.
	 * However, it basically returns a bool on the test result. Nothing else, really.
	 */
	testConn: async function() {
		try {
			let conn = await pool.getConnection();
			console.log("loaded db, threadId " + conn.threadId);
			conn.release();
			return true;
		} catch (e) {
			console.log(conn.stack);
			return false;
		}
	},
	
	/** A general/generic wrapper function to execute any SQL query. Basically used
	 * for queries that are not or cannot be covered by the other helpers. ALWAYS
	 * will return the rows from the query, regardless whether something was meant
	 * to be returned.
	 */
	exec: async function(sql) {
		try {
			let [rows, fields] = await pool.execute(sql);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** Inserts a row of data into the specified table. Accepts a string for the
	 * table name and an object for the row to be inserted. The function's
	 * return value is the success state of the operation.
	 */
	insertOne: async function(table, object) {
		try {
			let statement = "INSERT INTO " + table + " SET ?";
			let [rows, fields] = await pool.query(statement, object);
			console.log("Inserted " + rows.affectedRows + " rows");
			// if (rows.serverStatus === 2)
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** Inserts multiple rows of data into the specified table. Accepts a string for the
	 * table name, an array of keys of values, and an array of the objects to be inserted.
	 * The function's return value is the success state of the operation. Typically, the
	 * `keys` parameter already expects an Object.keys() object passed to it for convenience.
	 * 
	 * Additionally, this function is still not final and is subject to change.
	 */
	insertRows: async function(table, keys, objects) {
		try {
			let keyList = JSON.stringify(keys).replace(/\"/g, "").slice(1, -1).replace(/,/g, ", ");
			let statement = "INSERT INTO " + table + " (" + keyList + ") VALUES ?";
			let [rows, fields] = await pool.query(statement, [objects]);
			console.log("Inserted " + rows.affectedRows + " rows");
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** Returns rows belonging to the specified table that satisfy the given WHERE
	 * condition. Currently, the WHERE clause supports string types; integers are
	 * not yet taken into account.
	 */
	findRows: async function(table, query) {
		try {
			let statement = "SELECT * FROM " + table + " WHERE " + makeWhereClause(query);
			let [rows, fields] = await pool.execute(statement);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** Returns rows belonging to the specified table that satisfy the given WHERE
	 *  column Like '%value%'condition. Currently, the WHERE clause supports string types; integers are
	 * not yet taken into account.
	 */
	findRowsLike: async function(table, query) {
		try {
			let statement = "SELECT * FROM " + table + " WHERE " + makeWhereLikeClause(query);
			let [rows, fields] = await pool.execute(statement);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	/** Returns all rows belonging to the specified table. Perhaps useful for
	 * reports or table queries.
	 */
	findAll: async function(table) {
		try {
			let statement = "SELECT * FROM " + table;
			let [rows, fields] = await pool.execute(statement);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** (Currently WIP) Updates all matches in a specified table with the given
	 * SET specifications. This needs to be tested first for typecasting and
	 * general functionality.
	 */
	updateRows: async function(table, query, update) {
		try {
			let statement = "UPDATE " + table + " SET " + makeSetClause(update) + " WHERE " + makeWhereClause(query);
			let [rows, fields] = await pool.query(statement);
			console.log("Updated " + rows.changedRows + " rows");
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** (Currently WIP) Deletes all matches in a specified table. This needs to be
	 * tested first for general functionality.
	 */
	deleteRows: async function(table, query) {
		try {
			let statement = "DELETE FROM " + table + " WHERE " + makeWhereClause(query);
			let [rows, fields] = await pool.query(statement);
			console.log(rows);
			console.log(fields);
			// console.log("Deleted " + n + " rows");
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	/** Returns rows belonging to the specified table as an integer.
	 */
	findRowCount: async function(table) {
		try {
			let statement = "SELECT COUNT(*) AS 'rowcount' FROM " + table;
			let [rows, fields] = await pool.query(statement);
			console.log(rows);
			return rows[0].rowcount;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	/** Inserts mutiple rows into CaseData
	 *  TODO: Convert function into a more generalized function
	 */
	insertCaseData: async function(object) {
		try {
			console.log(object);
			let statement = "INSERT INTO mmchddb.CASE_DATA (fieldName, value, caseID, diseaseID) VALUES ?";
			let [rows, fields] = await pool.query(statement, [object]);
			console.log("Inserted " + rows.affectedRows + " rows");
			// if (rows.serverStatus === 2)
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	/**
	 * Returns rows from patients that matches the pattern of the name
	 */
	findPatientAutofill: async function(name) {
		try {
			let statement = "SELECT * FROM mmchddb.PATIENTS WHERE CONCAT_WS(' ', firstName, midName, lastName) LIKE '%" + name 
							+"%' OR CONCAT(lastName, ', ', firstName, ' ', midName) LIKE '%" + name + "%';";
			let [rows, fields] = await pool.execute(statement);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	/**
	 * Returns rows from patients that matches the pattern of the name
	 */
	findUserIDsWithType: async function(userType) {
		try {
			let statement = "SELECT userID FROM mmchddb.USERS WHERE " + makeWhereOrClause(userType, "userType");
			let [rows, fields] = await pool.execute(statement);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	/** Inserts mutiple rows into Notification
	 *  TODO: Convert function into a more generalized function
	 */
	insertNotificationData: async function(object) {
		try {
			// console.log(object);
			let statement = "INSERT INTO mmchddb.NOTIFICATIONS (notificationID, receiverID, type, message, caseID, dateCreated, redirectTo, viewed) VALUES ?";
			let [rows, fields] = await pool.query(statement, [object]);
			console.log("Inserted " + rows.affectedRows + " rows");
			// if (rows.serverStatus === 2)
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	/**
	 * Returns rows from patients that matches the pattern of the name
	 */
	findNewNotifsCount: async function(receiverID) {
		try {
			let statement = "SELECT Count(notificationID) AS 'newNotifCount' from mmchddb.NOTIFICATIONS where viewed = 0 AND receiverID = '" + receiverID + "'";
			let [rows, fields] = await pool.execute(statement);
			return rows[0].newNotifCount;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	insertCRFS: async function(object) {
		try {
			console.log(object);
			let statement = "INSERT INTO mmchddb.CRFS (CRFID, diseaseID, userID, week, year, isPushed) VALUES ?";
			let [rows, fields] = await pool.query(statement, [object]);
			console.log("Inserted " + rows.affectedRows + " rows");
			// if (rows.serverStatus === 2)
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	generateID: async function(table, checkObj) {
		let retObj = { exists: false, id: "" };
		
		try {
			// checking for existence
			if (table === "mmchddb.ADDRESSES") {
				let rows = await this.findRows(table, checkObj);
				if (rows.length > 0) {
					retObj.exists = true;
					retObj.id = rows[0].addressID;
				}
			} else if (table === "mmchddb.PATIENTS") {
				// JOIN to addresses? well...
				let rows = await this.findRows(table, checkObj);
				if (rows.length > 0) {
					retObj.exists = true;
					retObj.id = rows[0].patientID;
				}
			}
			
			// generating for new object/row
			if (!retObj.exists) {
				let rowcount = await this.findRowCount(table);
				let id = getPrefix(table);
				for (let i = 0; i < 13 - rowcount.toString().length; i++)
					id += "0";
				id += rowcount.toString();
				retObj.id = id;
			}
			console.log(retObj);
			return retObj;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	generateIDs: async function (table, numRows) {
		try {
			let rowcount = await this.findRowCount(table);
			let ids = [], tempID, suffix;
			if (numRows > 0) {
				for (i = 0; i < numRows; i++) {
					tempID = getPrefix(table);
					suffix = rowcount + i;
					for (let j = 0; j < 13 - suffix.toString().length; j++)
						tempID += "0";
					tempID += suffix.toString();
					ids.push(tempID);
				} return ids;
			} else return false;
		} catch(e) {
			console.log(e);
			return false;
		}
	},
};

module.exports = database;
