import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "123456",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
    { id: 1, name: "Angela", color: "teal" },
    { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
    const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1",
        [currentUserId]
    );
    let countries = [];

    result.rows.forEach((country) => {
        countries.push(country.country_code);
    });

    return countries;
}

async function getUser() {
    const result = await db.query("SELECT * FROM users");

    users = result.rows;

    let currentUser;
    users.forEach(user =>{
        if(user.id === currentUserId) {
            currentUser = user;
        }
    });

    return currentUser;
}

app.get("/", async (req, res) => {
    const countries = await checkVisisted();
    const currentUser = await getUser();

    console.log(countries);
    console.log(currentUser);


    res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: currentUser.color,
    });
});

app.post("/add", async (req, res) => {
    console.log(req.body);
    const input = req.body["country"];

    try {
        const result = await db.query(
            "SELECT country_code FROM country_codes WHERE LOWER(country) LIKE '%' || $1 || '%';",
            [input.toLowerCase()]
        );

        result.rows.forEach(async (row) => {
            const countryCode = row.country_code;
            try {
                await db.query(
                    "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
                    [countryCode, currentUserId]
                );
                res.redirect("/");
            } catch (err) {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
});

app.post("/user", async (req, res) => {
    console.log(req.body);
    if (req.body.add !== null && req.body.add === 'new') {
        res.render("new.ejs");
    }
    else {
        currentUserId = parseInt(req.body.user);
        res.redirect("/");
    }
});

app.post("/new", async (req, res) => {
    const name = req.body.name, color = req.body.color;

    try{
        const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2)", [name, color]);

        currentUserId = result.rows[0].id;
    }catch(err){
        console.log(err);
    }

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
