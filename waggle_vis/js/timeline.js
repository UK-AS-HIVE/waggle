(function ($) {
  $(document).ready(function() {

  	var SVGHEIGHT = 300;
  	var VOFFSET = 50;
  	var HOFFSET = 50;
  	var AXISSTROKEWIDTH = 2;
  	var TICKHEIGHT = 3;
  	var INTERPOLATION = "linear";
  	var DEFAULTSTYLE = "faceted";
  	var STANDARDDURATION = 300;
  	var NODESIZE = 3;
  	var LINEGRAPHWIDTH = 2;
  	var AJSONMONTHS =
		[{"name" : "January",
			"other-info" :
			{
				"abbreviation" : "Jan",
				"days" : 31
			}
		},
		{"name" : "February",
			"other-info" :  
			{
				"abbreviation" : "Feb",
				"days" : 28
			}
		},
		{"name" : "March",
			"other-info" :  
			{
				"abbreviation" : "Mar",
				"days" : 31
			}
		},
		{"name" : "April",
			"other-info" :  
			{
				"abbreviation" : "Apr",
				"days" : 30
			}
		},
		{"name" : "May",
			"other-info" : 
			{
				"abbreviation" : "May",
				"days" : 31
			}
		},
		{"name" : "June",
			"other-info" :  
			{
				"abbreviation" : "Jun",
				"days" : 30
			},
		},
		{"name" : "July",
			"other-info" :
			{
				"abbreviation" : "Jul",
				"days" : 31
			}
		},
		{"name" : "August",
			"other-info" :
			{
				"abbreviation" : "Aug",
				"days" : 31
			}
		},
		{"name" : "September",
			"other-info" :
			{
				"abbreviation" : "Sep",
				"days" : 30
			}
		},
		{"name" : "October",
			"other-info" :
			{
				"abbreviation" : "Oct",
				"days" : 31
			}
		},
		{"name" : "November",
			"other-info" :
			{
				"abbreviation" : "Nov",
				"days" : 30
			}
		},
		{"name" : "December",
			"other-info" :
			{
				"abbreviation" : "Dec",
				"days" : 31
			}
		}];
	var ISPAN = 7; //one week
	var SVGWIDTHPERCENTAGE = 100;
	var ROOMFORLEGEND = 100;

    var d3sSVG = d3.select("#waggle-vis-timeline").append("svg")
    				.attr("width", SVGWIDTHPERCENTAGE + "%")
    				.attr("height", SVGHEIGHT);

  	var SVGWIDTH = parseInt(d3sSVG.style("width"));
  	var HAXISEND = SVGWIDTH - (HOFFSET * 2) - ROOMFORLEGEND; //cut it off shorter on right side

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++ HELPER FUNCTIONS ++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++ GRAPHER FUNCTIONS ++++++++++++++++++++++++++++++

	function isLeapYear(iYear)
	{
		return (iYear % 4 === 0 && iYear % 100 !== 0) || iYear % 400 === 0;
	}

    function randomColor()
    {
		return "hsl(" 
					+ Math.round(Math.random() * 360) + ", " 
					+ Math.round(Math.random() * 100) + "%, " 
					+ Math.round(30 + Math.random() * 30) + "%)";
    }

	function getSortedKeys(jsonData)
	{
		return d3.keys(jsonData).sort(
			function(sOne, sTwo)
			{
				return sOne.toLowerCase() < sTwo.toLowerCase() ? -1 : 1;
			});
	}

  	function generateJSONDates(jsonData)
  	{
  		var aDates = new Array();
		for(var sDate in jsonData["Total by Dates"])
		{
			if (sDate.charAt(0) === '2')
			{
				var iDateIndexOfDash = sDate.indexOf("-");
				var iYear = parseInt(sDate.substring(0, iDateIndexOfDash));
				var iMonth = parseInt(sDate.substring(iDateIndexOfDash + 1, iDateIndexOfDash + 3));
				var iDay = parseInt(sDate.substring(iDateIndexOfDash + 4, iDateIndexOfDash + 6));

				aDates.push({"year" : iYear, "month" : iMonth, "day" : iDay, "full-date" : sDate.substring(0, sDate.indexOf("T")), "full-key" : sDate});
			}
		}
		return aDates;
  	}

  	
	function getYAxisInterval(jsonData, aJSONDates, aTagKeys, sStyle)
	{
		var iMaxRequests = 0;
    	var iGraphHeight = SVGHEIGHT - VOFFSET;
    	var fPercentCushion = .2;
		if (sStyle === "faceted")
		{
    		for (var iTag = 0; iTag < aTagKeys.length; iTag++)
    		{
    			var sCurrentTag = aTagKeys[iTag];
    			for (var iDate = 0; iDate < aJSONDates.length; iDate++)
    			{
    				var sCurrentDateKey = aJSONDates[iDate]["full-key"];
    				var iCurrentRequests = jsonData["Tags"][sCurrentTag][sCurrentDateKey];
    				iMaxRequests = iCurrentRequests > iMaxRequests ? iCurrentRequests : iMaxRequests;
    			}
    		}
		}
		else
		{
			for (var i = 0; i < aJSONDates.length; i++)
			{
				var iRequestsFromCurrentDate = jsonData["Total by Dates"][aJSONDates[i]["full-key"]];
	    		iMaxRequests = iRequestsFromCurrentDate > iMaxRequests ? iRequestsFromCurrentDate : iMaxRequests;
			}
		}

	    var fCushion = fPercentCushion * iMaxRequests;

	    return (iGraphHeight / (iMaxRequests + fCushion));
	}
  
    function drawAxis(aJSONDates, fPxBetweenNodes)
    {
    	var iMonthTitlePadding = 10;
    	var fPxBetweenDays = fPxBetweenNodes / ISPAN;

    	//Vertical axis
    	d3sSVG.append("line").attr("class", "axis")
    		.attr("x1", HOFFSET)
    		.attr("x2", HOFFSET)
    		.attr("y1", 0)
    		.attr("y2", SVGHEIGHT - VOFFSET);

    	//Horizontal axis
    	d3sSVG.append("line").attr("class", "axis")
    		.attr("x1", HOFFSET)
    		.attr("x2", HAXISEND)
    		.attr("y1", SVGHEIGHT - VOFFSET)
    		.attr("y2", SVGHEIGHT - VOFFSET);

    	//Draw the tick marks

    	//put the first date into our list
    	var aMonthChange = [{"x" : HOFFSET, "date" : aJSONDates[0]}]

    	//start with the second date
    	var iPreviousMonth = aJSONDates[0].month;
    	for (var i = 0; i < aJSONDates.length; i++)
    	{
    		var jsonDate = aJSONDates[i];
    		var iTickTop =  SVGHEIGHT - VOFFSET - TICKHEIGHT;
    		var iCurrentMonth = jsonDate.month;
    		var iCurrentDay = jsonDate.day;
    		var iXLocation = HOFFSET + (i * fPxBetweenNodes);

    		if (iCurrentMonth !== iPreviousMonth)
    		{
    			var iMonthDivTickTop = 0; //n18
    			var iMonthDivXLocation = iXLocation - ((iCurrentDay - 1) * fPxBetweenDays);
    			aMonthChange.push({	"x" : iMonthDivXLocation, "date" : jsonDate});

    			d3sSVG.append("line").attr("class", "ticks")
	    			.attr("x1", iMonthDivXLocation)
	    			.attr("x2", iMonthDivXLocation)
	    			.attr("y1", SVGHEIGHT - VOFFSET)
	    			.attr("y2", iMonthDivTickTop);
    		}

    		d3sSVG.append("line").attr("class", "ticks")
    			.attr("x1", iXLocation)
    			.attr("x2", iXLocation)
    			.attr("y1", SVGHEIGHT - VOFFSET)
    			.attr("y2", iTickTop);

    		d3sSVG.append("path").attr("id", "tickInfoPath" + i).attr("class", "tickInfoPath date" + jsonDate["full-date"])
    			.data([	{"x1" : iXLocation - 18, "y1" : SVGHEIGHT - VOFFSET + 18,
    					"x2" : iXLocation, "y2" : SVGHEIGHT - VOFFSET}])
    			.attr("d", function (d) {return "M" + d["x1"] + " " + d["y1"] + " L " + d["x2"] + " " + d["y2"];});

    		d3sSVG.append("text")
    			.attr("class", "tickInfo date" + jsonDate["full-date"])
    			.style("fill", "rgb(140, 140, 140)")
    			.append("textPath")
    			.attr("xlink:href", "#tickInfoPath" + i)
    			.text(jsonDate.day);

			iPreviousMonth = iCurrentMonth;
    	}

    	aMonthChange.push({"x" : HOFFSET + ((aJSONDates.length - 1) * fPxBetweenNodes), "date" : aJSONDates[aJSONDates.length - 1]});

    	//draw month names if they'll fit (right now, if theres at least thirty pixels
    	// between month change markers)
		for (i = 0; i < aMonthChange.length - 1; i++)
		{
			var jsonCurrentMonthChange = aMonthChange[i];
			var jsonNextMonthChange = aMonthChange[i + 1];
			var iMonth = jsonCurrentMonthChange.date.month; //n22
			var iSpace =  (jsonNextMonthChange.x - iMonthTitlePadding) - (jsonCurrentMonthChange.x + iMonthTitlePadding);

			if (iSpace >= 40) //n18
			{
				var sMonthName = AJSONMONTHS[iMonth - 1]["name"];
				var iMiddle = (iSpace / 2) + jsonCurrentMonthChange.x + iMonthTitlePadding;
				d3sSVG.append("text").attr("class", "monthTitle")
					.attr("text-anchor", "middle")
					.attr("x", iMiddle)
					.attr("y", 40)
					.text(sMonthName);
			}
		}
    }


    function generateJSONNodes(jsonData, aJSONDates, aTagKeys, fXAxisInterval, fYAxisInterval, sStyle)
    {
    	if (sStyle === "faceted")
    	{
    		//var iTotalHits = 0; //DEBUG
    		var aaRequestsPerTag = new Array(); //CAREFUL: n24
			for (var iTag = 0; iTag < aTagKeys.length; iTag++)
	    	{
	    		var sColor = randomColor();
	    		var aRequestsPerDay = new Array(aJSONDates.length);
	    		var sCurrentTag = aTagKeys[iTag];
	    		var iTotalTagRequests = 0;

				for(var iDate = 0; iDate < aJSONDates.length; iDate++)
				{
					var sDateKeyFull = aJSONDates[iDate]["full-key"];
					var sDate = aJSONDates[iDate]["full-date"];

					var iRequests = jsonData["Tags"][sCurrentTag][sDateKeyFull];
					iTotalTagRequests += iRequests;

					var iCurrentX = HOFFSET + (iDate * fXAxisInterval);
					var iCurrentY = (SVGHEIGHT - VOFFSET) - (iRequests * fYAxisInterval);

	    			aRequestsPerDay[iDate] = 	{"date": sDate, "tag": sCurrentTag,
	    										"x": iCurrentX, "y": iCurrentY, 
	    										"requests": iRequests, "color": sColor,
	    										"style" : sStyle};
	    		}
	    		if (iTotalTagRequests !== 0)
	    		{
	    			aaRequestsPerTag.push(aRequestsPerDay);
	    		}
	    		//console.log(sCurrentTag + ": " + iTotalTagRequests); //DEBUG
	    		//iTotalHits += iTotalTagRequests; //DEBUG
			}
			//console.log("Total hits: " + iTotalHits); //DEBUG
			return aaRequestsPerTag;
    	}
    	else if (sStyle === "total")
    	{
    		var sColor = randomColor();
    		var aJSONNodesTotal = new Array(aJSONDates.length);

    		for (var iDate = 0; iDate < aJSONDates.length; iDate++)
    		{
    			var iRequestsMadeThisDay = jsonData["Total by Dates"][aJSONDates[iDate]["full-key"]];

    			var iCurrentX = HOFFSET + (iDate * fXAxisInterval);
    			var iCurrentY = (SVGHEIGHT - VOFFSET) - (iRequestsMadeThisDay * fYAxisInterval);

				aJSONNodesTotal[iDate] = {"date": aJSONDates[iDate]["full-date"], "tag": "All Tags", //n19
										 "x": iCurrentX, "y": iCurrentY, 
										 "requests": iRequestsMadeThisDay, "color": sColor,
										 "style": sStyle};
    		}
    		return aJSONNodesTotal;
    	}
	}


	//note: here sStyle can be displayed or hidden
	function plotJSONNodes(aJSONNodes, sHiddenOrDisplayed)
	{
		//function to generate svg path commands
		var d3sLineFunction = d3.svg.line()
			.x(function(d) {return d.x;})
			.y(function(d) {return d.y;})
			.interpolate(INTERPOLATION);

		var sColor = aJSONNodes[0].color;
		var sTag = aJSONNodes[0].tag;

		//create the path
		var d3sPath = d3sSVG.append("path")
			.attr("class", "lineGraph " + sHiddenOrDisplayed + " " + sTag)
			.attr("d", d3sLineFunction(aJSONNodes))
			.style("stroke", sColor)
			.style("stroke-width", 0)
			.style("display", "none");
		
		//create the nodes
		for (var i = 0; i < aJSONNodes.length; i++)
		{
			d3sSVG.append("circle").data([aJSONNodes[i]])
				.attr("class", "node unclicked " + sHiddenOrDisplayed + " " + sTag)
				.attr("r", 0)
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;})
				.style("fill", sColor)
				.style("display", "none");
		}

		//display the nodes if necessary
		if (sHiddenOrDisplayed === "displayed")
		{
			//escape the /. only needed for selectors
			var iSlashIndex = sTag.indexOf('/');
			if (iSlashIndex !== -1)
			{
				sTag = sTag.substring(0, iSlashIndex) + '\\' + sTag.substring(iSlashIndex);   
			}

			d3.selectAll("#waggle-vis-timeline .node.displayed." + sTag)
				.attr("r", NODESIZE)
				.style("display", "");

			d3.select(".lineGraph.displayed." + sTag)
				.style("stroke-width", LINEGRAPHWIDTH)
				.style("display", "");
		}
	}

	//+++++++++++++++++++++++++++++ EVENT FUNCTIONS ++++++++++++++++++++++++++++++++++++++++


	function removePopUps ()
	{
		var d3sClickedNode = d3.select(".node.clicked");
		if (!(d3sClickedNode.empty()))
		{
			var fBaseY = d3sClickedNode.datum().y;

			d3.selectAll(".popUpText")
				.attr("class", "dying")
				.transition()
				.duration(STANDARDDURATION)
				.attr("y", fBaseY)
				.style("fill-opacity", 0)
				.style("font-size", 0)
				.remove();

			d3.select(".infoBox")
				.attr("class", "dying")
				.transition()
				.duration(STANDARDDURATION)
				.attr("y2", fBaseY)
				.style("fill-opacity", 0)
				.remove();
		}
		
	}

	function createFacetStyleButton(isViewFaceted, isTimeLine)
	{
		var sColorNotActivated = "rgb(171, 202, 222)";
		var sColorActivated = "rgb(34, 120, 181)";
		var d3sFacetStyleButton = d3sSVG.append("circle")
									.attr("class", "button " + (isViewFaceted ? "on " : "off ") + (isTimeLine ? "inactivated" : "activated")) //n23
									.attr("id", "facetStyleButton")
									.attr("r", 5)
									.attr("cx", HAXISEND)
									.attr("cy", SVGHEIGHT - 5) //n18 consider selecting styleButton and placing based on that
									.style("fill", isTimeLine && isViewFaceted ? sColorActivated : sColorNotActivated)
									.style("display", isViewFaceted ? "" : "none");
	}

	function createStyleButton(aaJSONNodesFaceted, aJSONNodesTotal, isFaceted)
	{
		var iSVGWidth = SVGWIDTH;
		var iXOffset = 80;
		var iYOffset = 20;
		var sColorNotClicked = "rgb(202, 222, 171)";
		var sColorClicked = "rgb(124, 181, 34)";
		var iButtonSize = 5;

		d3sSVG.append("text")
			.attr("class", function() {return isFaceted ? "buttonInformation faceted highlighted" : "buttonInformation faceted normal";})
			.attr("text-anchor", "end")
			.attr("x", HAXISEND - 10) //n18
			.attr("y", SVGHEIGHT - (iYOffset - 4)) //n18
			.text("By tag")
			.style("fill", function() {return isFaceted ? sColorClicked : sColorNotClicked;});

		d3sSVG.append("text")
			.attr("class", function() {return isFaceted ? "buttonInformation total normal" : "buttonInformation faceted highlighted";})
			.attr("x", HAXISEND + 10) //n18
			.attr("y", SVGHEIGHT - (iYOffset - 4)) //n18
			.text("total")
			.style("fill", function() {return isFaceted ? sColorNotClicked : sColorClicked;});

		var d3sButton = d3sSVG.append("circle")
			.attr("class", function() {return isFaceted ? "button clicked" : "button unclicked";})
			.attr("r", iButtonSize)
			.attr("cx", HAXISEND)
			.attr("cy", SVGHEIGHT - iYOffset)
			.style("fill", function() {return isFaceted ? sColorClicked : sColorNotClicked;})
			.on("click",
				function()
				{
					removePopUps();

					var d3sThisButton = d3.select(this);
					var d3sHighlightedText = d3.select(".highlighted");
					var d3sNormalText = d3.select(".normal");
					var d3sDisplayedLineGraphs = d3.selectAll(".lineGraph.displayed");
					var d3sDisplayedNodes = d3.selectAll("#waggle-vis-timeline .node.displayed");
					var d3sHiddenLineGraphs = d3.selectAll(".lineGraph.hidden");
					var d3sHiddenNodes = d3.selectAll("#waggle-vis-timeline .node.hidden");

					d3sDisplayedLineGraphs
						.classed("displayed", false)
						.classed("hidden", true)
						.style("stroke-width", 0)
						.style("display", "none");

					d3sDisplayedNodes
						.classed("displayed", false)
						.classed("hidden", true)
						.style("fill-opacity", 0)
						.attr("r", 0)
						.style("display", "none");

					d3sHiddenLineGraphs
						.classed("displayed", true)
						.classed("hidden", false)
						.style("display", "")
						.transition()
						.duration(STANDARDDURATION)
						.style("stroke-width", LINEGRAPHWIDTH);

					d3sHiddenNodes
						.classed("displayed", true)
						.classed("hidden", false)
						.style("display", "")
						.transition()
						.duration(STANDARDDURATION)
						.style("fill-opacity", 1)
						.attr("r", NODESIZE);

					d3sHighlightedText
						.classed("highlighted", false)
						.classed("normal", true)
						.transition()
						.duration(STANDARDDURATION)
						.style("fill", sColorNotClicked);

					d3sNormalText
						.classed("highlighted", true)
						.classed("normal", false)
						.transition()
						.duration(STANDARDDURATION)
						.style("fill", sColorClicked);

					if (d3sThisButton.attr("class") === "button clicked") //aka we currently have the faceted graph and are switching to total
					{
						d3sThisButton
							.attr("class", "button unclicked")
							.transition()
							.duration(STANDARDDURATION)
							.style("fill", sColorNotClicked);
					}
					else //aka we currently have the total graph, and are switching to faceted
					{
						d3sThisButton
							.attr("class", "button clicked")
							.transition()
							.duration(STANDARDDURATION)
							.style("fill", sColorClicked);
					}

					d3.select("#facetStyleButton")
						.call(toggleExistence);
				});
	}

	function toggleExistence(d3sButton)
	{
		var bToggledOff = d3sButton.classed("on");

		if (bToggledOff)
		{
			d3sButton.classed("on", false).classed("off", true)
				.transition()
				.duration(STANDARDDURATION)
				.attr("r", 0)
				.attr("fill-opacity", 0);

			d3sButton
				.transition()
				.delay(STANDARDDURATION)
				.style("display", "none");
		}
		else
		{
			d3sButton.classed("on", true).classed("off", false)
				.style("display", "")
				.transition()
				.duration(STANDARDDURATION)
				.attr("fill-opacity", 1)
				.attr("r", 5); //n18
		}
	}

	function createNodeEvents()
	{
		var d3sNodes = d3.selectAll("#waggle-vis-timeline .node");
  		d3sNodes.on("mouseover", 
  			function(d) 
  			{
				var d3sTrigger = d3.select(this);
				var sColor = d3sTrigger.style("fill");
				var iXLocation = parseInt(d3sTrigger.attr("cx"));
				var iYLocation = parseInt(d3sTrigger.attr("cy"));
				var d3sTickPath = d3.select(".tickInfoPath.date" + d.date);

				d3sSVG.append("text")
					.text(d.tag)
					.attr("class", "smallPop-up")
					.attr("x", iXLocation + 5)
					.attr("y", iYLocation - 5)
					.attr("font-family", "sans-serif")
					.attr("font-size", "10px")
					.attr("fill", sColor)
					.style("fill-opacity", 1.0);

				d3sTickPath
					.classed("grown", true)
					.transition()
					.duration(STANDARDDURATION / 3) //n18 (we want it faster for design purposes)
					.attr("d", function (d) {return "M" + (d["x1"] - 15) + " " + (d["y1"] + 15) + " L " + d["x2"] + " " + d["y2"];});
  			});

  		d3sNodes.on("mouseleave", 
  			function()
  			{
  				var d3sPopUp = d3.select(".smallPop-up");
  				var iYLocation = parseInt(d3sPopUp.attr("y"));
				var d3sTickPath = d3.select(".grown");

				d3sPopUp.attr("class", "dying").transition().duration(STANDARDDURATION)
					.attr("y", iYLocation + 5)
					.style("fill-opacity", 0)
					.remove();

				d3sTickPath
					.classed("grown", false)
					.transition()
					.duration(STANDARDDURATION)
					.attr("d", function (d) {return "M" + d["x1"] + " " + d["y1"] + " L " + d["x2"] + " " + d["y2"];});
			});

  		d3sNodes.on("click",
  			function(d)
  			{
  				var d3sTrigger = d3.select(this);
				var sColor = d3sTrigger.style("fill");

  				var fNodeX = d.x;
  				var fNodeY = d.y;

  				removePopUps();

  				if ((d3sTrigger.attr("class")).indexOf("unclicked") !== -1) //clicking
  				{
	  				var d3sSmallPopup = d3.select(".smallPop-up");
	  				var iTextSize  = parseInt(d3sSmallPopup.attr("font-size"));

	  				var iPopUpBuffer = 2;

	  				//remove any other clicked nodes
	  				d3.select(".node.clicked").classed("clicked", false).classed("unclicked", true)
	  					.transition()
	  					.duration(STANDARDDURATION)
	  					.attr("r", NODESIZE);

	  				d3sTrigger.classed("clicked", true).classed("unclicked", false)
	  					.transition()
	  					.attr("r", 7);

	  				//draw info at top of page
	  				d3sSVG.append("text")
	  					.text("Tag: " + d.tag)
	  					.attr("class", "popUpText")
	  					.style("fill", sColor)
	  					.attr("x", fNodeX)
	  					.attr("y", fNodeY)
	  					.style("font-size", 0)
	  					.style("fill-opacity", 0.3)
	  					.transition()
	  					.duration(STANDARDDURATION)
	  					.attr("y", iTextSize + iPopUpBuffer)
	  					.style("fill-opacity", 1)
	  					.style("font-size", iTextSize);

	  				d3sSVG.append("text")
	  					.text("Num. of Requests: " + d.requests)
	  					.attr("class", "popUpText")
	  					.style("fill", sColor)
	  					.attr("x", fNodeX)
	  					.attr("y", fNodeY)
	  					.style("font-size", 0)
	  					.style("fill-opacity", 0.3)
	  					.transition()
	  					.duration(STANDARDDURATION)
	  					.attr("y", (2 * iTextSize + iPopUpBuffer))
	  					.style("fill-opacity", 1)
	  					.style("font-size", iTextSize);

	  				d3sSVG.append("text")
	  					.text("Date: " + d.date)
	  					.attr("class", "popUpText")
	  					.style("fill", sColor)
	  					.attr("x", fNodeX)
	  					.attr("y", fNodeY)
	  					.style("font-size", 0)
	  					.style("fill-opacity", 0.3)
	  					.transition()
	  					.duration(STANDARDDURATION)
	  					.attr("y", (3 * iTextSize) + (2 * iPopUpBuffer))
	  					.style("fill-opacity", 1)
	  					.style("font-size", iTextSize);

	  				//draw line from node to info
	  				d3sSVG.append("line").attr("class", "infoBox")
	  					.attr("x1", fNodeX)
	  					.attr("y1", fNodeY - 7)
	  					.attr("x2", fNodeX)
	  					.attr("y2", fNodeY)
	  					.style("stroke", sColor)
	  					.transition()
	  					.duration(STANDARDDURATION)
	  					.attr("y2", (4 * iTextSize) + (2 * iPopUpBuffer));
  				}
  				else
  				{
  					d3sTrigger.classed("clicked", false).classed("unclicked", true)
	  					.transition()
	  					.duration(STANDARDDURATION)
	  					.attr("r", NODESIZE);
  				}
  			});
	}

	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//++++++++++++++++++++++++++ MAIN FUNCTION ++++++++++++++++++++++++++++++++
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  	function drawGraph(jsonData)
  	{
  		var isFaceted = (DEFAULTSTYLE === "faceted" ? true : false);
  		var sFacetDisplay = (isFaceted ? "displayed" : "hidden");
  		var aJSONDates = generateJSONDates(jsonData).sort(
  			function (jsonDateOne, jsonDateTwo) 
  			{
  				if (jsonDateOne.year !== jsonDateTwo.year)
  				{
  					return (jsonDateOne.year < jsonDateTwo.year) ? -1 : 1;
  				}
  				else if (jsonDateOne.month !== jsonDateTwo.month)
  				{
  					return (jsonDateOne.month < jsonDateTwo.month) ? -1 : 1;

  				}
  				else
  				{
  					return (jsonDateOne.day <= jsonDateTwo.day) ? -1 : 1;
  				}
  			});
		var aTagKeys = getSortedKeys(jsonData["Total by Tags"]);

  		var iSpansOfDays = aJSONDates.length; //n20
  		var fXAxisInterval = (HAXISEND - HOFFSET) / iSpansOfDays; //n21
  		var fYAxisIntervalFaceted = getYAxisInterval(jsonData, aJSONDates, aTagKeys, "faceted");
  		var fYAxisIntervalTotal = getYAxisInterval(jsonData, aJSONDates, aTagKeys, "total");

  		var aJSONNodesTotal = generateJSONNodes(jsonData, aJSONDates, aTagKeys, fXAxisInterval, fYAxisIntervalTotal, "total");
  		var aaJSONNodesFaceted = generateJSONNodes(jsonData, aJSONDates, aTagKeys, fXAxisInterval, fYAxisIntervalFaceted, "faceted");

  		//Draw Graph
  		drawAxis(aJSONDates, fXAxisInterval);
  		plotJSONNodes(aJSONNodesTotal, (isFaceted ? "hidden" : "displayed"));
		for (var i = 0; i < aaJSONNodesFaceted.length; i++)
		{
			plotJSONNodes(aaJSONNodesFaceted[i], sFacetDisplay);
		}

		//Create Events
  		createNodeEvents();
  		createStyleButton(aaJSONNodesFaceted, aJSONNodesTotal, isFaceted);
  		createFacetStyleButton(isFaceted, true);
  	}

    drawGraph(HTMLEtimelineData);
	});
})(jQuery);