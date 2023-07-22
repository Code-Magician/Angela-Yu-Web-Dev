/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import fs from "fs";
import inquirer from "inquirer";
import qr from "qr-image";

inquirer
	.prompt([
		{
			message: "Type the URL you want to generate QR code for : ",
			name: "URL",
		},
	])
	.then((answers) => {
		const url = answers.URL;

		fs.writeFile("URl.txt", url, (err) => {
			if (err) throw err;
			console.log("The file has been saved!");
		});

		var qrImage = qr.image(url, { type: "png", parse_url: true });
		qrImage.pipe(fs.createWriteStream("qr_image.png"));
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
