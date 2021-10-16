const mysql = require("mysql2/promise");

// Favouring pools over connections considering the scale of the app
const pool = mysql.createPool({
	host: provess.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

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
	
	populateTest: async function(sql) {
		let [rows, fields] = await pool.execute(sql);
		console.log(rows);
		console.log(fields);
	}
	
	/* CRUD-J
		CREATE
		READ
		UPDATE
		DELETE
		JOIN
	*/
};

module.exports = database;
