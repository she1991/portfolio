var widthPortfolio = 700;
var heightPortfolio = 1500;
var marginPortfolio = {top: 20, right: 10, bottom: 20, left: 10};
widthPortfolio = widthPortfolio - marginPortfolio.left - marginPortfolio.right;
heightPortfolio = heightPortfolio - marginPortfolio.top - marginPortfolio.bottom;
var checkedDesign = null;
var uncheckedDesign = null;
var checkedCode = null;
var uncheckedCode = null;
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
	//Draw the first rendering of project tiles
	renderTiles(portfolio);	
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
				.attr("font-family", "Anton")
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
                .attr("font-family", "Anton")
                .attr("font-size", "30px")
                .text(": Code");				
}
function drawSortControls(portfolio) {
	//Sort by text
	portfolio.append("text")
                .attr("x", 520)
                .attr("y", 55)
                .attr("font-family", "Anton")
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
        });
}
function renderTiles(portfolio) {
	portfolio.append("rect")
				.attr("x", 10)
				.attr("y", 100)
				.attr("width", 300)
				.attr("height", 300)
					.append("rect")
						.attr("x", 0)
	                	.attr("y", 0)
    	        	    .attr("width", 30)
        		        .attr("height", 30)
						.attr("fill", "red");
	portfolio.append("rect")
                .attr("x", 350)
                .attr("y", 100)
                .attr("width", 300)
                .attr("height", 300);
	//Read the projects.json
	
}
