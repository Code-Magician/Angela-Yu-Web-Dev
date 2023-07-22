import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit", (req, res) => {
	console.log(req.body);
	res.send(
		`<h1>Your Band Name is : </h1> <br/> <h2>${req.body.street}${req.body.pet}😎`
	);
});

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
