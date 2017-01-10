/*
Visualization code
*/

var svgWidth = 1200;
var svgHeight = 600;
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = null;
var height = null;
var svg = null;

function initSVG(){
	//Appending out SVG Canvas
	svg = d3.select("body")
				.append("svg")
					.attr("class", "visualization")
					.attr("width", svgWidth)
					.attr("height", svgHeight);
	//Resolve margin and operating width and height values
	width = svgWidth - margin.left - margin.right;
	height = svgHeight - margin.top - margin.bottom;
	buildVisualization();
};

function buildVisualization(){
	var xScale = d3.scaleTime()
					.rangeRound([0, width]);
	var yScale = d3.scaleLinear()
					.rangeRound([height, 0]);
	//Using bostock's margin and translate conventions
	var g = svg.append("g")
				.attr("transform", "translate(" + margin.left +"," + margin.top + ")");
	//time parser
	var parseTime = d3.timeParse("%m/%d/%Y");
	//line function for currency in circulation
	var lineCurrency = d3.line()
					.x(function(d){ return xScale(d.date); })
					.y(function(d){ return yScale(d.currency); });
	//line function for non-govt deposits
	var lineNonGovtDeposits = d3.line()
							.x(function(d){ console.log(d.date, xScale(d.date));return xScale(d.date); })
							.y(function(d){ return yScale(d.nonGovtDeposits); });
	//line function for government deposits
	var lineGovtDeposits = d3.line()
							.x(function(d){ return xScale(d.date); })
							.y(function(d){ return yScale(d.govtDeposits); });
	d3.tsv("RBI_Stats.tsv", function(d){
		d.date = parseTime( d["MM/DD/YYYY"] );
		d.currency = +d["Notes in Circulation"];
		d.nonGovtDeposits = +d["Total Non-Govt Deposits"];
		d.govtDeposits = +d["Govt Deposits"];
		return d;
	},
	function(error, data){
		if(error) throw error;
		//determine the domain for currency, nonGovtDeposits and govtDeposits
		var cumulativeExtent = [];
		cumulativeExtent = cumulativeExtent.concat(d3.extent(data, function(d){ return d.currency; }));
		cumulativeExtent = cumulativeExtent.concat(d3.extent(data, function(d){ return d.nonGovtDeposits; }));
		cumulativeExtent = cumulativeExtent.concat(d3.extent(data, function(d){ return d.govtDeposits; }));
		cumulativeExtent = d3.extent(cumulativeExtent);
		dateExtent = d3.extent(data, function(d){ return d.date; });
		xScale.domain(dateExtent);
		//for govt deposits too low fixing looks
		yScale.domain([0, cumulativeExtent[1]]);

		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(yScale))
				.append("text")
				.attr("fill", "#000")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.style("text-anchor", "end")
				.text("Price ($)");

		g.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", lineGovtDeposits);
		g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", lineNonGovtDeposits);
		g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", lineCurrency);
	});
};
