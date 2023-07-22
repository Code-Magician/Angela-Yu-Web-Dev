function playSound(key) {
	var audio = null;
	switch (key) {
		case "w":
			audio = new Audio("sounds/tom-1.mp3");
			break;
		case "a":
			audio = new Audio("sounds/tom-2.mp3");
			break;
		case "s":
			audio = new Audio("sounds/tom-3.mp3");
			break;
		case "d":
			audio = new Audio("sounds/tom-4.mp3");
			break;
		case "j":
			audio = new Audio("sounds/crash.mp3");
			break;
		case "k":
			audio = new Audio("sounds/snare.mp3");
			break;
		case "l":
			audio = new Audio("sounds/kick-bass.mp3");
			break;
	}
	audio.play();
}

function buttonAnimation(key) {
	var activeKey = document.querySelector(`.${key}`);
	activeKey.classList.add("pressed");
	activeKey.style.color = "white";

	setTimeout(function () {
		activeKey.classList.remove("pressed");
		activeKey.style.color = "red";
	}, 100);
}

var buttons = document.querySelectorAll(".drum");

for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("click", function () {
		var key = this.innerHTML;
		playSound(key);
		buttonAnimation(key);
	});
}

document.addEventListener("keydown", function (event) {
	var key = event.key;
	playSound(key);
	buttonAnimation(key);
});
