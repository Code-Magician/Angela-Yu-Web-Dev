import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render(`${__dirname}/views/index.ejs`, {
		instruction: "Enter you name here👇.",
	});
});

app.post("/submit", (req, res) => {
	res.render(`${__dirname}/views/index.ejs`, {
		instruction: `You have ${
			req.body.fName.length + req.body.lName.length
		} letters in your name.`,
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
