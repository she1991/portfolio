var fonts = 
[	'Barrio',
    'Sansita',
    'Indie Flower',
    'Lobster',
    'Pacifico',
    'Libre Baskerville',
    'Kaushan Script',
    'Permanent Marker',
    'Bangers',
    'Bad Script',
    'Ultra',
    'Press Start 2P',
	'Monoton',
    'Bungee Shade',
    'Ewert',
    'Nosifer',
    'Faster One',
    'Snowburst One',
    'Galindo'];

var nameLetters = null;

var pauseButton = null;

var playButton = null;

var reEvaluateFontInterval = null;

function initNameSVG(name, divName, width, height) {
	var nameSVG = d3.select("."+divName)
					.append("svg")
						.attr("width", width)
						.attr("height", height)
						.attr("class", "name-svg");
	var charArray = name.toUpperCase().split('');
	//render the characters
	var startX = 50
	nameLetters = nameSVG.selectAll("name-letter")
						.data(charArray)
						.enter()
							.append("text")
								.attr("x", function(d, i){
									return i*50 + 10;
								})
								.attr("y", 60)
								.attr("font-family", fonts[9])
								.attr("font-size", "50px")
								.text(function(d) {
									return d;
								});
	//add pause button
	pauseButton = nameSVG.append("svg:image")
		.attr("xlink:href","/media/pause.svg")
		.attr("width", 50)
		.attr("height", 50)
		.attr("x", width/2 - 30)
		.attr("y", 80)
		.attr("visibility", "hidden")
		.on("click", function(){
			window.clearInterval(reEvaluateFontInterval);
			d3.select(this)
				.attr("visibility", "hidden");
			playButton.attr("visibility", "visible");
		});
	//add play button but invisible
	playButton = nameSVG.append("svg:image")
		.attr("xlink:href", "/media/play.svg")
		.attr("width", 50)
		.attr("height", 50)
		.attr("x", width/2 - 30)
		.attr("y", 80)
		.on("click", function(){
			reEvaluateFontInterval = setInterval(changeFont, 200);
			d3.select(this)
				.attr("visibility", "hidden")
			pauseButton.attr("visibility", "visible");
		});
	//Randomize font selection on each nameLetters element
	changeFont();
	initPortfolioSVG();
}

function changeFont(){
	//assign a random font
	//collect current fonts of each
	var nameLettersFonts = [];
	nameLetters.each(function(d, i){
		var fontFamily = d3.select(this).attr("font-family");
		nameLettersFonts.push(fontFamily);
	});
	nameLetters.attr("font-family", function(d, i){
		//roll dice
		var diceRoll = Math.random() >= 0.5;
		if(diceRoll){
			return fonts[Math.floor(Math.random() * fonts.length)];
		}
		else {
			return nameLettersFonts[i];
		}
	});
}
