import express from "express";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "warlock-perry";
const yourPassword = "IWIllImprove";
const yourAPIKey = "f7e62bc4-f348-4230-ba57-9dc31df2ae7f";
const yourBearerToken = "a060ef3c-fdb5-41ee-8a31-75c3365dd521";

app.get("/", (req, res) => {
	res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
	//TODO 2: Use axios to hit up the /random endpoint
	//The data you get back should be sent to the ejs file as "content"
	//Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.

	try {
		const response = await axios.get(`${API_URL}random`);
		const contentStr = JSON.stringify(response.data);

		console.log(contentStr);

		res.render("index.ejs", { content: contentStr });
	} catch (err) {
		console.log("Failed to make Request to GET/random : " + err.message);
		res.render("index.ejs", { content: err.message });
	}
});

app.get("/basicAuth", async (req, res) => {
	//TODO 3: Write your code here to hit up the /all endpoint
	//Specify that you only want the secrets from page 2
	//HINT: This is how you can use axios to do basic auth:
	// https://stackoverflow.com/a/74632908

	try {
		const response = await axios.get(`${API_URL}all?page=2`, {
			auth: {
				username: yourUsername,
				password: yourPassword,
			},
		});

		const contentStr = JSON.stringify(response.data);

		res.render("index.ejs", { content: contentStr });
	} catch (err) {
		console.log("Failed to make Request to GET/all : " + err.message);
		res.render("index.ejs", { content: err.message });
	}
});

app.get("/apiKey", async (req, res) => {
	//TODO 4: Write your code here to hit up the /filter endpoint
	//Filter for all secrets with an embarassment score of 5 or greater
	//HINT: You need to provide a query parameter of apiKey in the request.

	try {
		const response = await axios.get(`${API_URL}filter`,
			{
				params:{
					score : 5,
					apiKey : yourAPIKey
				}
			}
		);

		const contentStr = JSON.stringify(response.data);
		res.render("index.ejs", { content : contentStr });

	} catch (err) {
		console.log("Failed to make Request to GET/filter : " + err.message);
		res.render("index.ejs", { content : err.message });
	}
});

app.get("/bearerToken", async (req, res) => {
	//TODO 5: Write your code here to hit up the /secrets/{id} endpoint
	//and get the secret with id of 42
	//HINT: This is how you can use axios to do bearer token auth:
	// https://stackoverflow.com/a/52645402

	try{
		const response = await axios.get(`${API_URL}secrets/42`, 
		{
			headers:{
				Authorization: `Bearer ${yourBearerToken}`
			}
		});

		const contentStr = JSON.stringify(response.data);

		res.render("index.ejs", { content : contentStr });
	} catch(err){
		console.log("Failed to make Request to GET/secrets/{id} : " + err.message);
		res.render("index.ejs", { content : err.message });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
