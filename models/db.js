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

function makeWhereClause(obj) {
	/* Expected input:
			Object {
				column1: "value1",
				column2: "value2"
			}
			Expected output:
			String "column1 = 'value1' AND column2 = 'value2';"
		NOTE: this only performs string matching for the moment
	*/
	let entriesArr = [];
	for (let [key, value] of Object.entries(obj)) {
		entriesArr.push(key + " = " + "'" + value + "'");
	}
	return entriesArr.join(" AND ") + ";";
}

function makeSetClause(obj) {
	/* Expected input:
			Object {
				column1: "value1",
				column2: "value2"
			}
			Expected output:
			String "column1 = 'value1', column2 = 'value2'"
		NOTE: this only performs string matching for the moment
	*/
	let entriesArr = [];
	for (let [key, value] of Object.entries(obj)) {
		entriesArr.push(key + " = " + "'" + value + "'");
	}
	return entriesArr.join(", ");
}

const database = {
	testConn: function(callback) {
		pool.getConnection((err, conn) => {
			if (err) {
				console.log("error! :: " + err.stack);
				return callback(false);
			} else {
				console.log("connected! :: " + conn.threadId);
				conn.release();
				console.log("released!");
				return callback(true);
			}
		});
	},
	
	exec: async function(sql) {
		let [rows, fields] = await pool.execute(sql);
		console.log(rows);
		console.log(fields);
	},
	
	insertOne: async function(table, object) {
		let statement = "INSERT INTO " + table + " SET ?";
		let [rows, fields] = await pool.query(statement, object);
		console.log(rows);
		console.log(fields);
	},
	
	findOne: async function(table, query) {
		let statement = "SELECT * FROM " + table + " WHERE " + makeWhereClause(query);
		let [rows, fields] = await pool.execute(statement);
		console.log(rows);
	},
	
	findAll: async function(table) {
		let statement = "SELECT * FROM " + table;
		let [rows, fields] = await pool.execute(statement);
		console.log(rows);
	},
	
	updateOne: async function(table, query, update) {
		let statement = "UPDATE " + table + " SET " + makeSetClause(update) + " WHERE " + makeWhereClause(query);
//		c.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], function (err, results, fields) {
//			if (err) throw err;
//		});
		let [rows, fields] = await pool.query(statement);
		console.log(rows);
		console.log(fields);
	},
	
	deleteOne: async function(table, query) {
		let statement = "DELETE FROM " + table + " WHERE " + makeWhereClause(query);
		let [rows, fields] = await pool.query(statement);
		console.log(rows);
		console.log(fields);
	}
};

module.exports = database;
