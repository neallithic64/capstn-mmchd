const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + "/"));

const db = require("./models/db");
// const router = require("./routers/router");
// app.use("/", router);

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

/* UNSET ONCE VIEWS ARE CREATED!

app.set("views", path.join(__dirname, "/views/"));
app.engine("hbs", exphbs.create({
	extname: "hbs",
	defaultLayout: "main",
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true
	},
	partialsDir: "views/partials",
	layoutsDir: "views/layouts",
	helpers: {
		// helpers go here!
	}
}).engine);
app.set("view engine", "hbs");

*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	db.testConn(state => {
		if (state) res.send("works fine!");
		else res.send("oh no!");
	});
});

app.get("/mkdata", async (req, res) => {
	await db.findAll("mmchddb.test");
	res.send("exec done");
});

app.get("*", function(req, res) {
	res.send("page not found!");
});

app.listen(PORT, () => console.log("listening at " + PORT));
