const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + "/"));

app.use(cors({ 
	credentials: true,
	origin: true,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET,
	name: "sessionId",
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: true,
		samesite: "lax"
	}
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const db = require("./models/db");
const router = require("./routers/indexRouter");
app.use("/", router);

app.listen(PORT, () => console.log("listening at " + PORT));
