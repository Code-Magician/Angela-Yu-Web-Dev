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
    },
    {
        constructors:{
            fillDetails: function(chapter){
                this.id =  chapter.id;
                this.hindiName =  chapter.name;
                this.englishName =  chapter.name_translated;
                this.verseCount =  chapter.verses_count;
                this.chapterNumber =  chapter.chapter_number;
                this.chapterNameMeaning =  chapter.name_meaning;
                this.chapterSummeryHindi =  chapter.chapter_summary_hindi;
                this.chapterSummeryEnglish =  chapter.chapter_summary;
            }
        }
    }
)

export  {Chapter};