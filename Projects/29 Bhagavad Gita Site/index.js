import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import {dirname} from 'path';
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Chapter } from "./schemas/chapterDetails.js";
import { Verse } from "./schemas/verseDetails.js";

dotenv.config();
const API_KEY = process.env.API_KEY;

// API URL
const API_URL = "https://bhagavad-gita3.p.rapidapi.com/v2/chapters/";

// Request object
const request = {
    method: "GET",
    url: API_URL,
    headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
    },
};

const PORT = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET request for fetching all the chapters details.
app.get("/", async (req, res) => {
    res.render("loader.ejs");
    
    var chapters = [];

    try {
        request.url = API_URL;
        const response = await axios.request(request);

        response.data.forEach((chapter) => {
            var temp = new Chapter.fillDetails(chapter);

            chapters.push(temp);
        });

        res.render("home.ejs", { chapters: chapters, title: "Bhagavad Gita" });
    } catch (error) {
        res.sendStatus(422).json(error.details);
    }
});

// Getting details of a specific chapter...
app.get("/chapter/:ch", async (req, res) => {
    var ch = parseInt(req.params.ch);

    try {
        request.url = `${API_URL}${ch}/`;
        const chapterResponse = (await axios.request(request)).data;

        request.url = `${API_URL}${ch}/verses/`;
        const versesResponse = (await axios.request(request)).data;

        var chapter = new Chapter.fillDetails(chapterResponse);

        var verses = [];
        versesResponse.forEach((verse) => {
            var temp = new Verse.fillDetails(verse);

            verses.push(temp);
        });

        var chapterDetails = {
            chapter: chapter,
            verses: verses,
            title: `Chapter ${ch}`
        };

        res.render("chapter.ejs", chapterDetails);
    } catch (error) {
        res.sendStatus(422).json(error.details);
    }
});


// GET a particular verse
app.get("/chapter/:ch/verse/:vr", async (req, res) => {
    var ch = parseInt(req.params.ch);
    var vr = parseInt(req.params.vr);

    try {
        request.url = `${API_URL}${ch}/verses/${vr}/`;
        const response = (await axios.request(request)).data;

        var verse = Verse.fillDetails(response);

        res.render("verse.ejs", {
            verse: verse,
            title: `Chapter ${ch} Verse ${vr}`
        });
    } catch (error) {
        res.sendStatus(422).json(error.details);
    }
});


// POST return the verse count for a particular chanpter.
app.post("/getVerseCount", async (req, res) => {
    try {
        request.url = `${API_URL}${parseInt(req.body.ch)}/`;
        const chapterResponse = (await axios.request(request)).data;

        res.send(chapterResponse);
    } catch (error) {
        res.sendStatus(422).json(error.details);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
