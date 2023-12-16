import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
	user: "postgres",
	password: "123456",
	host: "localhost",
	database: "world",
	port: 5432
});

db.connect();


app.get("/", async (req, res) => {
	var result = await db.query("SELECT * FROM visited_countries");

	var visited_country_codes = [];
	result.rows.forEach(country => {
		visited_country_codes.push(country.country_code);
	});

	res.render(
		"index.ejs",
		{
			countries: visited_country_codes,
			total: visited_country_codes.length
		});
});

app.post("/add",async (req, res) => {
	var reqCountry = req.body.country;

	var visited_country_code;
	var result = await db.query("SELECT * FROM country_codes");

	result.rows.forEach(row => {
		if (reqCountry.toLowerCase() == row.country.toLowerCase())
			visited_country_code = row.country_code;
	});


	if(visited_country_code != null)
		await db.query(`INSERT INTO visited_countries (country_code) VALUES ('${visited_country_code}')`, (err, res)=>{
			if(err) console.log(err.message);
		});
	
	res.redirect("/");
})

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
