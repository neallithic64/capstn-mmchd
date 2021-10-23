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
		entriesArr.push(key + " = " + "'" + value + "'");
	}
	return entriesArr.join(" AND ") + ";";
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
		entriesArr.push(key + " = " + "'" + value + "'");
	}
	return entriesArr.join(", ");
}

const database = {
	/** Not really a useful function, it was used for sandboxing on initial test.
	 * However, it basically returns a callback function with a bool on the test
	 * result. Nothing else, really.
	 */
	testConn: async function() {
		try {
			let conn = await pool.getConnection();
			console.log(conn.threadId);
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
			console.log(rows);
			console.log(fields);
			return rows;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	/** Inserts a row of data into the specified table. Accepts a string for the
	 * table name and an object for the row to be inserted. The function's
	 * return is also void.
	 */
	insertOne: async function(table, object) {
		try {
			let statement = "INSERT INTO " + table + " SET ?";
			let [rows, fields] = await pool.query(statement, object);
			console.log(rows);
			console.log(fields);
			// console.log("Inserted " + n + " rows");
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
			// c.query("UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?", ['a', 'b', 'c', userId], function (err, results, fields));
			let [rows, fields] = await pool.query(statement);
			console.log(rows);
			console.log(fields);
			// console.log("Updated " + n + " rows");
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
	}
};

module.exports = database;
