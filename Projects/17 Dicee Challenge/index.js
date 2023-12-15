var num1 = Math.floor(Math.random() * 6 + 1);
var num2 = Math.floor(Math.random() * 6 + 1);

document
	.getElementsByClassName("img1")[0]
	.setAttribute("src", `images/dice${num1}.png`);

document
	.getElementsByClassName("img2")[0]
	.setAttribute("src", `images/dice${num2}.png`);

if (num1 > num2) document.querySelector("h1").textContent = "🚩 Player 1 Wins";
else if (num1 < num2)
	document.querySelector("h1").textContent = "Player 2 Wins 🚩";
else document.querySelector("h1").textContent = "Its a draw";
