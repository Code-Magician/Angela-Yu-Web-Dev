import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
	user : "postgres",
	password : "123456",
	database : "permalist",
	host : "localhost",
	port : 5432
});
db.connect();

let items = [
	{ id: 1, title: "Buy milk" },
	{ id: 2, title: "Finish homework" },
];

async function getTaskList(){
	try{
		const result = await db.query("SELECT * from task_list");

		return result.rows;
	}catch(err){
		console.log(err);
	}
}

app.get("/",async (req, res) => {
	let items = await getTaskList();

	res.render("index.ejs", {
		listTitle: "Today",
		listItems: items,
	});
});

app.post("/add", async (req, res) => {
	const item = req.body.newItem;

	try{
		if(item)
			await db.query("INSERT INTO task_list (task) VALUES ($1)", [item]);
	}catch(err){
		console.log(err);
	}

	res.redirect("/");
});

app.post("/edit", async (req, res) => { 
	let editID = parseInt(req.body["updatedItemId"]);
	let editedTask = req.body["updatedItemTitle"];

	try{
		if(editedTask)
			await db.query("UPDATE task_list SET task = $1 WHERE id = $2", [editedTask, editID]);
		else
			await db.query("DELETE FROM task_list WHERE id = $1", [editID]);
	}catch(err){
		console.log(err);
	}

	res.redirect("/");
});

app.post("/delete", async (req, res) => { 
	let delID = parseInt(req.body["deleteItemId"]);

	try{
		await db.query("DELETE FROM task_list WHERE id = $1", [delID]);
	}catch(err){
		console.log(err);
	}

	res.redirect("/");
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
