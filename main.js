const express = require("express");
const app = express();
const db = require("./models/db");
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	db.testConn(state => {
		if (state) res.send("works fine!");
		else res.send("oh no!");
	});
});

app.get("/mkdata", async (req, res) => {
	await db.populateTest("");
	res.send("ehhhhh");
});

app.listen(PORT, () => {
	console.log("listening");
});
