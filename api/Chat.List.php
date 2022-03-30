<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

respond([
	["Username2", "John Doe", "Sorted :)"],
	["Username3", "John Doe", "Did you hurt your head?"],
	["Username4", "John Doe", "Well looky what we have here. No no no, you're staying right here with me."],
	["Username5", "John Doe", "It was meant to be."],
	["Username6", "John Doe", "Anyway, if Grandpa hadn't hit him, then none of you would have been born"],
	["Username7", "John Doe", "I think we need a rematch"],
	["Username8", "John Doe", "Now look, I think she was born a nun."],
	["Username9", "John Doe", "What did you sleep in your clothes again last night?"],
	["Username10", "John Doe", "Hey c'mon, I had to change, you think I'm going back in that zoot suit?"],
	["Username11", "John Doe", "Well, aren't you going up to the lake tonight, you've been planning it for two weeks"],
	["Username12", "John Doe", "You'll find out in thirty years!"],
	["Username13", "John Doe", "Get out of town, I didn't know you did anything creative"],
	["Username14", "John Doe", "The consequences could be disastrous!"],
], true);
