var gameStarted = false;
var level = 0;
var gamePattern = [];
var userClickedPatten = [];
var buttonColors = ["red", "blue", "green", "yellow"];

buttonColors.forEach((x) => {
	$(`#${x}`).on("click", handleClick);
});

$(document).keypress(function (event) {
	if (!gameStarted && event.originalEvent.key) {
		gameStarted = true;
		nextSequence();
	}
});

function nextSequence() {
	level++;
	userClickedPatten = [];
	$("#level-title").html(`Level : ${level}`);

	var randIdx = Math.floor(Math.random() * 3);

	gamePattern.push(buttonColors[randIdx]);

	$(`#${gamePattern[gamePattern.length - 1]}`)
		.fadeOut(100)
		.fadeIn(100)
		.fadeOut(100)
		.fadeIn(100);

	playSound(gamePattern[gamePattern.length - 1]);
}

function handleClick(event) {
	var clickedColor = event.currentTarget.id;

	playSound(clickedColor);
	animatePress(clickedColor);
	userClickedPatten.push(clickedColor);

	if (checkAnswer(clickedColor)) {
		if (userClickedPatten.length >= gamePattern.length) {
			setTimeout(() => {
				nextSequence();
			}, 1000);
			return;
		}
	} else {
		startOver();
	}
}

function playSound(name) {
	var audio = new Audio(`sounds/${name}.mp3`);
	audio.play();
}

function animatePress(name) {
	$(`#${name}`).addClass("pressed");
	setTimeout(() => {
		$(`#${name}`).removeClass("pressed");
	}, 100);
}

function checkAnswer() {
	for (var i = 0; i < userClickedPatten.length; i++) {
		if (gamePattern[i] !== userClickedPatten[i]) {
			return false;
		}
	}

	return true;
}

function startOver() {
	$("#level-title").html("Game Over, Press Any Key to Restart");

	$("body").addClass("game-over");

	playSound("wrong");
	setTimeout(() => {
		$("body").removeClass("game-over");
	}, 200);

	gamePattern = [];
	userClickedPatten = [];
	level = 0;
	gameStarted = false;
}
