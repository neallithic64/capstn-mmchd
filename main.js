const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./models/db");
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	db.testConn(state => {
		if (state) res.send("works fine!");
		else res.send("oh no!");
	});
});

app.get("/mkdata", async (req, res) => {
	"CREATE TABLE mmchddb.test(id int, name VARCHAR(100), PRIMARY KEY(id));";
	"";
	"";
	await db.findAll("mmchddb.test");
	res.send("exec done");
});

app.listen(PORT, () => {
	console.log("listening");
});
