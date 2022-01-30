const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + "/"));

app.use(require('morgan')('dev'));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"}));

app.use(cors({ 
	credentials: true,
	origin: ["http://localhost:3000", "https://localhost:3000"],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET,
	name: "sessionId",
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false,
		httpOnly: true,
		samesite: "lax",
		maxAge: 2419200000
	}
}));

const db = require("./models/db");
const router = require("./routers/indexRouter");
app.use("/api", router);

app.listen(PORT, () => console.log("listening at " + PORT));
