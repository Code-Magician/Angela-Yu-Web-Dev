import SO from "schema-object";

var Chapter = new SO(
    {
        id : Number,
        hindiName : String,
        englishName : String,
        verseCount : Number,
        chapterNumber : Number,
        chapterNameMeaning : String,
        chapterSummeryHindi : String,
        chapterSummeryEnglish : String,
    }
)

export  {Chapter};