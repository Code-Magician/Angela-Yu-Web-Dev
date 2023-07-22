import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

var daywiseList = [];
var workList = [];

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const months = [
	"January",
	"Febuary",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("index.ejs", {
		items: daywiseList,
		date: getDate(),
		route: "/day",
	});
});

app.get("/day", (req, res) => {
	res.render("index.ejs", {
		items: daywiseList,
		date: getDate(),
		route: "/day",
	});
});

app.post("/day", (req, res) => {
	if (req.body.item !== "") daywiseList.push(req.body.item);

	res.render("index.ejs", {
		items: daywiseList,
		date: getDate(),
		route: "/day",
	});
});

app.get("/work", (req, res) => {
	res.render("index.ejs", {
		items: workList,
		route: "/work",
	});
});

app.post("/work", (req, res) => {
	if (req.body.item !== "") workList.push(req.body.item);

	res.render("index.ejs", {
		items: workList,
		route: "/work",
	});
});

app.listen(port, () => {
	console.log(`Server Running on port number : ${port}`);
});

function getDate() {
	var date = new Date();

	var day = days[date.getDay()];
	var month = months[date.getMonth()];
	var dayInMonth = date.getDate();
	var year = date.getFullYear();

	var timeStr = `${day}, ${month} ${dayInMonth}, ${year}`;
	return timeStr;
}
