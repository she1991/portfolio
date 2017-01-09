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
					.x(function(d){ return xScale(d.currency); })
					.y(function(d){ return yScale(d.date); });
	//line function for non-govt deposits
	var lineNonGovtDeposits = d3.line()
							.x(function(d){ return xScale(d.nonGovtDeposits); })
							.y(function(d){ return yScaled(d.date); });
	//line function for government deposits
	var lineGovtDeposits = d3.line()
							.x(function(d){ return xScale(d.govtDeposits); })
							.y(function(d){ return yScaled(d.date); });
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
		console.log(data);
		currencyExtent = d3.extent(data, function(d){ return d.currency; });
		nonGovtDepositsExtent = d3.extent(data, function(d){ return r.nonGovtDeposits; });
		govtDepositsExtent = d3.extent(data, function);
	});
};
