var widthPortfolio = 700;
var heightPortfolio = 1500;
var marginPortfolio = {top: 20, right: 10, bottom: 20, left: 10};
widthPortfolio = widthPortfolio - marginPortfolio.left - marginPortfolio.right;
heightPortfolio = heightPortfolio - marginPortfolio.top - marginPortfolio.bottom;
var checkedDesign = null;
var uncheckedDesign = null;
var checkedCode = null;
var uncheckedCode = null;
var projectObjects = [];
var tileGroupElementObjects = [];
function initPortfolioSVG() {
	var portfolioSVG = d3.select(".portfolio-div")
                    .append("svg")
                        .attr("width", widthPortfolio)
                        .attr("height", heightPortfolio)
                        .attr("class", "portfolio-svg");
	//Invert co-ordinates for easier coding
	//Using d3 margin conventions
	portfolio = portfolioSVG.append("g")
					.attr("transform", "translate(" + marginPortfolio.left + "," + marginPortfolio.top + ")");
	//draw the legends
	drawLegend(portfolio);
	//Draw radio buttons
	drawSortControls(portfolio);
	//start processing json
	readProjects(portfolio);
}
function drawLegend(portfolio) {
	//legends for code and design on top left
	portfolio.append("rect")
				.attr("class", "design-legend")
				.attr("x",10)
				.attr("y",0)
				.attr("width", 60)
				.attr("height", 40);
	portfolio.append("text")
				.attr("x", 80)
				.attr("y", 33)
				.attr("font-family", "Mada")
				.attr("font-size", "30px")
				.text(": Design");
	portfolio.append("rect")
                .attr("class", "code-legend")
                .attr("x",10)
                .attr("y",45)
                .attr("width", 60) 
                .attr("height", 40);
    portfolio.append("text")
                .attr("x", 80)
                .attr("y", 78)
                .attr("font-family", "Mada")
                .attr("font-size", "30px")
                .text(": Code");				
}
function drawSortControls(portfolio) {
	//Sort by text
	portfolio.append("text")
                .attr("x", 520)
                .attr("y", 55)
                .attr("font-family", "Mada")
                .attr("font-size", "30px")
                .text("Sort :");
	//Radio for design
	checkedDesign = portfolio.append("svg:image")
        .attr("xlink:href","/media/checked_design.svg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 600)
        .attr("y", 0)
        .on("click", function(){
			console.log("checked design clicked");
        });
	uncheckedDesign = portfolio.append("svg:image")
        .attr("xlink:href","/media/unchecked_design.svg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 600)
        .attr("y", 0)
        .attr("visibility", "hidden")
        .on("click", function(){
            d3.select(this)
                .attr("visibility", "hidden");
            checkedDesign.attr("visibility", "visible");
			checkedCode.attr("visibility", "hidden");
			uncheckedCode.attr("visibility", "visible");
			//Sort the projectObjects by code
            projectObjects.sort(designComparator);
            projectObjects = calcDimensions(projectObjects);
            //Iterate through new co-ordinates and call moveTile on every such tileGroupELement
            for(var i=0; i<projectObjects.length; i++){
                //get its tile Id and search for the same group element
                for(var j=0; j<tileGroupElementObjects.length; j++){
                    if(projectObjects[i].tileId == tileGroupElementObjects[j].attr("tileId")){
                        moveTile(projectObjects[i].tileId, projectObjects[i].x, projectObjects[i].y);
                        break;
                    }
                }
            }
        });
	//Radio for code
	checkedCode = portfolio.append("svg:image")
        .attr("xlink:href","/media/checked_code.svg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 600)
        .attr("y", 45)
        .attr("visibility", "hidden")
        .on("click", function(){
			console.log("checked code clicked");
        });
	uncheckedCode = portfolio.append("svg:image")
        .attr("xlink:href","/media/unchecked_code.svg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 600)
        .attr("y", 45)
        .on("click", function(){
            d3.select(this)
                .attr("visibility", "hidden");
            checkedCode.attr("visibility", "visible");
			uncheckedDesign.attr("visibility", "visible");
			checkedDesign.attr("visibility", "hidden");
			//Sort the projectObjects by code
			projectObjects.sort(codeComparator);
			projectObjects = calcDimensions(projectObjects);
			//Iterate through new co-ordinates and call moveTile on every such tileGroupELement
			for(var i=0; i<projectObjects.length; i++){
				//get its tile Id and search for the same group element
				for(var j=0; j<tileGroupElementObjects.length; j++){
					if(projectObjects[i].tileId == tileGroupElementObjects[j].attr("tileId")){
						moveTile(projectObjects[i].tileId, projectObjects[i].x, projectObjects[i].y);
						break;
					}
				}
			}
        });
}
function designComparator( tile1, tile2 ){
    return tile2.design - tile1.design;
}
function codeComparator( tile1, tile2 ){
	return tile2.code - tile1.code;
}
function calcDimensions( projectObjects ){
	// Manufacture starting domensions for tiles
    var col = 0;
    var x1 = 10;
    var y1 = 100;
    var x2 = 350;
    var y2 = 100;
    var tileSide = 300;
    for(var i=0; i<projectObjects.length; i++){
        if(col == 0){
            projectObjects[i].x = x1;
            projectObjects[i].y = y1;
            y1 = y1 + 350;
            projectObjects[i].width = 300;
        	projectObjects[i].height = 300;
			col = 1;
    	}
		else if(col == 1){
			projectObjects[i].x = x2;
            projectObjects[i].y = y2;
            y2 = y2 + 350;
            projectObjects[i].width = 300;
            projectObjects[i].height = 300;
            col = 0;
		}
    }
	return projectObjects;
}
function readProjects(portfolio) {
	//Reads projects.json to create 6 tiles for every one project and create a tile object
	//load media/projects.json file
	d3.json("media/projects.json", function(json){
		json.sort(function(a,b){return b.design-a.design;});
		//add unique tileId
		for(var i=0; i<json.length; i++){
			json[i].tileId = i;
		}
		projectObjects = JSON.parse(JSON.stringify(json))
		projectObjects = calcDimensions(projectObjects);
		renderTiles(portfolio);
	});
}
function renderTiles(portfolio) {
	//iterate through projectObjects and render each
	for(var i=0; i<projectObjects.length; i++){
		var tileGroupElement = portfolio.append("g")
								.attr("tileId",projectObjects[i].tileId);
		tileGroupElement.append("rect")
				.attr("class", "tile-rect")
				.attr("x", projectObjects[i].x)
				.attr("y", projectObjects[i].y)
				.attr("width", projectObjects[i].width)
				.attr("height", projectObjects[i].height)
				.attr("data", projectObjects[i]);
		//Draw the title rect
		tileGroupElement.append("rect")
				.attr("class", "title-rect")
				.attr("x", projectObjects[i].x)
				.attr("y", projectObjects[i].y + 230)
				.attr("width", projectObjects[i].width)
				.attr("height", 50);
		//Make little design bar chart
		var barY = projectObjects[i].y + 280;
		var barWidth = (projectObjects[i].design/100)*projectObjects[i].width;
		tileGroupElement.append("rect")
				.attr("x", projectObjects[i].x)
				.attr("y", projectObjects[i].y + 280)
				.attr("width", barWidth)
				.attr("height", 20)
				.attr("class","design-bar");
		//Make code bar chart
		tileGroupElement.append("rect")
                .attr("x", projectObjects[i].x + barWidth)
                .attr("y", projectObjects[i].y + 280)
                .attr("width", projectObjects[i].width - barWidth)
                .attr("height", 20)
                .attr("class","code-bar");
		//Add org text
		tileGroupElement.append("text")
				.attr("class","title-text")
				.attr("x", projectObjects[i].x + 3)
				.attr("y", projectObjects[i].y + 263)
				.text(projectObjects[i].org);
		//add tile group element to tileGroupElementObjects array
		tileGroupElementObjects.push(tileGroupElement);
	}
}
function moveTile(tileId, x, y){
	//get group element of given tile id
	for(var i=0; i<tileGroupElementObjects.length; i++){
		if(tileId == tileGroupElementObjects[i].attr("tileId")){
			//Get its rect's co ordinates to calculate transformation
			var tileRect = tileGroupElementObjects[i].selectAll(".tile-rect");
			var xCurr = tileRect.attr("x");
			var yCurr = tileRect.attr("y");
			tileGroupElementObjects[i].transition()
				.duration(1000)
				.attr("transform", "translate("+(x - xCurr)+","+(y - yCurr)+")");
			return;
		}
	}
}
