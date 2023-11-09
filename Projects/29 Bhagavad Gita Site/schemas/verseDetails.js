import SO from "schema-object";

var Verse = new SO({
	id: Number,
	verseNumber: Number,
	chapterNumber: Number,
	hindiText: String,
	transliteration: String,
	wordMeanings: String,
	englishTranslation: String,
	hindiTranslation: String,
	hindiCommentry: String,
	englishCommentry: String,
},
	{
		constructors: {
			fillDetails: function(verse){
				this.id =  verse.id;
                this.verseNumber =  verse.verse_number;
                this.chapterNumber =  verse.chapter_number;
                this.hindiText =  verse.text;
                this.transliteration =  verse.transliteration;
                this.wordMeanings =  verse.word_meanings;

				verse.translations.slice().reverse().forEach(translation => {
					if(translation.language === "english") this.englishTranslation = translation.description;
					if(translation.language === "hindi") this.hindiTranslation = translation.description;
				});

				verse.commentaries.slice().reverse().forEach(commentry => {
					if(commentry.language === "english") this.englishCommentry = commentry.description;
					if(commentry.language === "hindi") this.hindiCommentry = commentry.description;
				});
			}
		}
	}
);

export { Verse };
