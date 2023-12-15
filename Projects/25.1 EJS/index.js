import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
	var date = new Date();
	var dayType = "";
	var actionType = "";

	if (date.getDay() <= 5) {
		actionType = "work hard";
		dayType = "Weekday";
	} else {
		actionType = "have fun";
		dayType = "weekend";
	}

	res.render(`${__dirname}/views/index.ejs`, {
		day: dayType,
		action: actionType,
	});
});

app.listen(port, () => {
	console.log(`Listening on port number : ${port}`);
});
