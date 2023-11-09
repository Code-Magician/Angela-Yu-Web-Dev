import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Chapter } from "./schemas/chapterDetails.js";
import { Verse } from "./schemas/verseDetails.js";

const API_KEY = "9a8cb40716msh060641adc01ab4ep1a6b97jsn2ff592949651";

const PORT = 3000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET request for fetching all the chapters details.
app.get("/", async (req, res) => {
    // Request Details
    const options = {
        method: "GET",
        url: "https://bhagavad-gita3.p.rapidapi.com/v2/chapters/",
        params: { limit: "18" },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
        },
    };

    var chapters = [];
    try {
        const response = await axios.request(options);

        response.data.forEach((chapter) => {
            var temp = new Chapter({
                id: chapter.id,
                hindiName: chapter.name,
                englishName: chapter.name_translated,
                verseCount: chapter.verses_count,
                chapterNumber: chapter.chapter_number,
                chapterNameMeaning: chapter.name_meaning,
                chapterSummeryHindi: chapter.chapter_summary_hindi,
                chapterSummeryEnglish: chapter.chapter_summary,
            });

            chapters.push(temp);
        });
    } catch (error) {
        console.error(error);
    }
    console.log(chapters);
    res.render("home.ejs", { chapters: chapters });
});

// Getting details of a specific chapter...
app.get("/chapter/:ch", async (req, res) => {
    var ch = parseInt(req.params.ch);

    const chapterRequest = {
        method: "GET",
        url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${ch}/`,
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
        },
    };

    const versesRequest = {
        method: "GET",
        url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${ch}/verses/`,
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
        },
    };

    try {
        const chapterResponse = (await axios.request(chapterRequest)).data;
        const versesResponse = (await axios.request(versesRequest)).data;

        var chapter = new Chapter({
            id: chapterResponse.id,
            hindiName: chapterResponse.name,
            englishName: chapterResponse.name_translated,
            verseCount: chapterResponse.verses_count,
            chapterNumber: chapterResponse.chapter_number,
            chapterNameMeaning: chapterResponse.name_meaning,
            chapterSummeryHindi: chapterResponse.chapter_summary_hindi,
            chapterSummeryEnglish: chapterResponse.chapter_summary,
        });

        var verses = [];

        versesResponse.forEach((verse) => {
            var temp = new Verse.fillDetails(verse);

            verses.push(temp);
        });

        var chapterDetails = {
            chapter : chapter,
            verses : verses
        };
        // res.send(chapterDetails);
        res.render("chapter.ejs", chapterDetails);
    } catch (error) {
        console.error(error);
    }
});


// GET a particular verse
app.get("/chapter/:ch/verse/:vr", async (req, res) =>{
    var ch = parseInt(req.params.ch);
    var vr = parseInt(req.params.vr);

    const options = {
        method: 'GET',
        url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${ch}/verses/${vr}/`,
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'
        }
      };
      
      try {
          const response = (await axios.request(options)).data;

          var verse = Verse.fillDetails(response);

          res.render("verse.ejs", verse);
      } catch (error) {
          console.error(error);
      }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
