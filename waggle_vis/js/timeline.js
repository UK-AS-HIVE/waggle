//Dependent on D3.js and share.js

(function ($) {
  $(document).ready(function() {
  	var ASPECIALCSSCHARS = ['#', '.', '>', '+', ':', '/', '~', '@', ';', "'", "\"", "\\", '(', ')'];
  	var SVGHEIGHT = 300;
  	var VOFFSET = 50;
  	var HOFFSET = 50;
  	var AXISSTROKEWIDTH = 2;
  	var TICKHEIGHT = 3;
  	var INTERPOLATION = "linear";
  	var DEFAULTSTYLE = "faceted";
  	var STANDARDDURATION = 300;
  	var NODESIZE = 3;
  	var LINEGRAPHWIDTH = 1;
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
  	var ISPAN = HTMLEtimelineData["span"]; //only in days right now!
  	var SVGWIDTHPERCENTAGE = 100;
  	var ROOMFORLEGEND = 0;

    var d3sTimelineSVG = createSVG('waggle-vis-timeline', SVGWIDTHPERCENTAGE, SVGHEIGHT);

  	var SVGWIDTH = parseInt(d3sTimelineSVG.style("width"));
  	var HAXISEND = SVGWIDTH - (HOFFSET * 2) - ROOMFORLEGEND; //cut it off shorter on right side

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++ HELPER FUNCTIONS ++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //++++++++++++++++++++++++++++ GRAPHER FUNCTIONS ++++++++++++++++++++++++++++++

    //Not currently used
    /*
  	function isLeapYear(iYear)
  	{
  		return (iYear % 4 === 0 && iYear % 100 !== 0) || iYear % 400 === 0;
  	}
    */
    
    function drawAxis(aJSONDates, fPxBetweenNodes)
    {
    	var iMonthTitlePadding = 10;
    	var fPxBetweenDays = fPxBetweenNodes / ISPAN;

    	//Vertical axis
    	d3sTimelineSVG.append("line").attr("class", "axis")
    		.attr("x1", HOFFSET)
    		.attr("x2", HOFFSET)
    		.attr("y1", 0)
    		.attr("y2", SVGHEIGHT - VOFFSET);

    	//Horizontal axis
    	d3sTimelineSVG.append("line").attr("class", "axis")
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
    			var iMonthDivTickTop = 0;
    			var iMonthDivXLocation = iXLocation - ((iCurrentDay - 1) * fPxBetweenDays);
    			aMonthChange.push({	"x" : iMonthDivXLocation, "date" : jsonDate});

    			d3sTimelineSVG.append("line").attr("class", "ticks")
      			.attr("x1", iMonthDivXLocation)
      			.attr("x2", iMonthDivXLocation)
      			.attr("y1", SVGHEIGHT - VOFFSET)
      			.attr("y2", iMonthDivTickTop);
    		}

    		d3sTimelineSVG.append("line").attr("class", "ticks")
    			.attr("x1", iXLocation)
    			.attr("x2", iXLocation)
    			.attr("y1", SVGHEIGHT - VOFFSET)
    			.attr("y2", iTickTop);

    		d3sTimelineSVG.append("path").attr("id", "tickInfoPath" + i).attr("class", "tickInfoPath date" + jsonDate["full-date"])
    			.data([	{"x1" : iXLocation - 18, "y1" : SVGHEIGHT - VOFFSET + 18,
    					"x2" : iXLocation, "y2" : SVGHEIGHT - VOFFSET}])
    			.attr("d", function (d) {return "M" + d["x1"] + " " + d["y1"] + " L " + d["x2"] + " " + d["y2"];});

    		d3sTimelineSVG.append("text")
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
    		var iMonth = jsonCurrentMonthChange.date.month;
    		var iSpace =  (jsonNextMonthChange.x - iMonthTitlePadding) - (jsonCurrentMonthChange.x + iMonthTitlePadding);

    		if (iSpace >= 40) //magic number
    		{
    			var sMonthName = AJSONMONTHS[iMonth - 1]["name"];
    			var iMiddle = (iSpace / 2) + jsonCurrentMonthChange.x + iMonthTitlePadding;
    			d3sTimelineSVG.append("text").attr("class", "monthTitle")
    				.attr("text-anchor", "middle")
    				.attr("x", iMiddle)
    				.attr("y", 40)
    				.text(sMonthName);
    		}
    	}
    }

    //Not currently used 
    /*
    //Relies on the following globals defined in this file: ASPECIALCSSCHARS
    function escapeForSelectors(sString)
    {
      //ESCAPE THE TAGS
      //not necessary since we never actually make a selection based on the tags, but could
      //definitely be handy if we ever implement a legend or something. Probably worth keeping
      var sStringMod = sString;
      for (var i = 0; i < sStringMod.length; i++)
      {
        var cCurrentChar = sStringMod.charAt(i);
        if (ASPECIALCSSCHARS.indexOf(cCurrentChar) !== -1)
        {
          sStringMod = sStringMod.substring(0, i) + '\\' + sStringMod.substring(i);
          i += 1; //move i two steps ahead so we don't keep seeing the same special char
        }
      }
      if (!isNaN(sStringMod.charAt(0))) //first char is a number
      {
        sStringMod = "\\3" + sStringMod.charAt(0) + sStringMod.substring(1);  //We have to add that space in there so that the new escaped numeral won't accidentally pick up other
                                                                  //characters after the \ to be included in the escape string.
      }
      sStringMod = sStringMod.replace(/\s/g, '.');
      return sStringMod;
    }
    */

    function drawPathsThroughNodes(aJSONNodes, sHiddenOrDisplayed)
    {
      var bDisplayed = (sHiddenOrDisplayed === "displayed");
      var sDisplay = bDisplayed ? "" : "none";

      var d3sLineFunction = d3.svg.line() //function to generate svg path commands
        .x(function(d) {return d.x;})
        .y(function(d) {return d.y;})
        .interpolate(INTERPOLATION);

      var aJSONPathInfo = 
        [{
          "d": d3sLineFunction(aJSONNodes),
          "stroke": aJSONNodes[0]["fill"],
          "stroke-width": bDisplayed ? LINEGRAPHWIDTH : 0,
          "display": sDisplay,
          "fill": "none"
        }];

      //create the path
      //Data join and enter path (not really necessary, only one path per call)
       d3sTimelineSVG.selectAll(".this.must.be.an.empty.selection.so.all.our.data.gets.bound.to.the.enter.selection.ajsdlkfjioeajwf")
        .data(aJSONPathInfo)
        .enter()
        .append("path")
        .attr("class", "lineGraph " + sHiddenOrDisplayed + " " + aJSONNodes[0]["tag"])
        .attr("d", function(d) {return d["d"];})
        .style("stroke-width", function(d) {return d["stroke-width"];})
        .style("stroke", function(d) {return d["stroke"];})
        .style("display", function(d) {return d["display"];})
        .style("fill", function(d) {return d["fill"];});
    }

    //note: here sStyle can be displayed or hidden
    //Relies on the following globals defined in this file: INTERPOLATION, LINEGRAPHWIDTH
  	function drawNodes(aJSONNodes, sHiddenOrDisplayed)
  	{
  		var sColor = aJSONNodes[0]["fill"];
  		var bDisplayed = (sHiddenOrDisplayed === "displayed");
  		var sDisplay = bDisplayed ? "" : "none";

  		//Draw the nodes
  		//Data join and enter circles (more useful, many nodes per call)
  		d3sTimelineSVG.selectAll(".this.must.be.an.empty.selection.so.all.our.data.gets.bound.to.the.enter.selection.ajsdlkfjioeajwf")
  			.data(aJSONNodes)
  			.enter()
  			.append("circle")
  			.attr("class", "node unclicked " + sHiddenOrDisplayed + " " + aJSONNodes[0]["tag"])
  			.attr("r", function(d) {return d["r"];})
  			.attr("cx", function(d) {return d["x"];})
  			.attr("cy", function(d) {return d["y"];})
  			.style("fill", function(d) {return d["fill"];})
  			.style("display", sDisplay);
  	}

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  	//+++++++++++++++++++++++++++++ EVENT FUNCTIONS ++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  	function removePopUps ()
  	{
  		var d3sClickedNode = d3.select(".node.clicked");
  		if (!(d3sClickedNode.empty()))
  		{
  			var fBaseY = d3sClickedNode.datum().y;

  			d3.selectAll(".popUp:not(.infoBox)")
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

  	function createStyleButton(aaJSONNodesFaceted, aJSONNodesTotal, isFaceted)
  	{
  		var iSVGWidth = SVGWIDTH;
  		var iXOffset = 80;
  		var iYOffset = 20;
  		var sColorNotClicked = "rgb(202, 222, 171)";
  		var sColorClicked = "rgb(124, 181, 34)";
  		var iButtonSize = 5;

  		d3sTimelineSVG.append("text")
  			.attr("class", function() {return isFaceted ? "buttonInformation faceted highlighted" : "buttonInformation faceted normal";})
  			.attr("text-anchor", "end")
  			.attr("x", HAXISEND - 10) //magic number
  			.attr("y", SVGHEIGHT - (iYOffset - 4)) //magic number
  			.text("By tag")
  			.style("fill", function() {return isFaceted ? sColorClicked : sColorNotClicked;});

  		d3sTimelineSVG.append("text")
  			.attr("class", function() {return isFaceted ? "buttonInformation total normal" : "buttonInformation faceted highlighted";})
  			.attr("x", HAXISEND + 10) //magic number
  			.attr("y", SVGHEIGHT - (iYOffset - 4)) //magic number
  			.text("total")
  			.style("fill", function() {return isFaceted ? sColorNotClicked : sColorClicked;});

  		var d3sButton = d3sTimelineSVG.append("circle")
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

  					if (d3sThisButton.classed("button clicked")) //aka we currently have the faceted graph and are switching to total
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
  				});
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

  				d3sTimelineSVG.append("text")
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
  					.duration(STANDARDDURATION / 3) //magic number (we want it faster for design purposes)
  					.attr("d", function (d) {return "M" + (d["x1"] - 15) + " " + (d["y1"] + 15) + " L " + d["x2"] + " " + d["y2"];});
    			});

    		d3sNodes.on("mouseleave", 
    			function()
    			{
    				var d3sPopUp = d3.select(".smallPop-up");
    				if ( !(d3sPopUp.empty()) ) //sometimes we get an empty selection (not sure why) this avoids it
    				{
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
    				}
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
  	  					.duration(STANDARDDURATION)
  	  					.attr("r", 7);

  	  				//draw info at top of page
  	  				d3sTimelineSVG.append("text")
  	  					.text(d.total ? "Search: " + d.tag : "Tag: " + d.tag)
  	  					.attr("class", "popUp text")
  	  					.transition()
  	  					.duration(STANDARDDURATION)
  	  					.attr("y", iTextSize + iPopUpBuffer)
  	  					.style("fill-opacity", 1)
  	  					.style("font-size", iTextSize);

  	  				d3sTimelineSVG.append("text")
  	  					.text("Num. of Requests: " + d.requests)
  	  					.attr("class", "popUp text")
  	  					.transition()
  	  					.duration(STANDARDDURATION)
  	  					.attr("y", (2 * iTextSize) + iPopUpBuffer)
  	  					.style("fill-opacity", 1)
  	  					.style("font-size", iTextSize);

  	  				d3sTimelineSVG.append("text")
  	  					.text("Date: " + d["date-range"])
  	  					.attr("class", "popUp text")
  	  					.transition()
  	  					.duration(STANDARDDURATION)
  	  					.attr("y", (3 * iTextSize) + iPopUpBuffer)
  	  					.style("fill-opacity", 1)
  	  					.style("font-size", iTextSize);

  	  				//draw line from node to info
  	  				d3sTimelineSVG.append("line").attr("class", "popUp infoBox")
  	  					.attr("x1", fNodeX)
  	  					.attr("y1", fNodeY - 7)
  	  					.attr("x2", fNodeX)
  	  					.attr("y2", fNodeY)
  	  					.style("stroke", sColor)
  	  					.transition()
  	  					.duration(STANDARDDURATION)
  	  					.attr("y2", (3 * iTextSize) + iPopUpBuffer);

  	  				//set their sizes and opacities to low. This won't cancel transition, and makes fade-in nicer
  	  				d3.selectAll(".popUp:not(.infoBox)")
  	  					.attr("x", fNodeX)
  	  					.attr("y", fNodeY)
  	  					.style("fill", sColor)
  	  					.style("font-size", 0)
  	  					.style("fill-opacity", 0.3);
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
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++ Creating JSON Nodes ++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //+++++++++++++++++++++++++++++ L1 Helper Functions ++++++++++++++++++++++++++++++++++++

    function calculateXLocation(iDate, fXAxisInterval)
    {
      return HOFFSET + (iDate * fXAxisInterval);
    }

    function calculateYLocation(iRequests, fYAxisInterval)
    {
      return (SVGHEIGHT - VOFFSET) - (iRequests * fYAxisInterval);
    }

    function randomColor()
    {
      return "hsl(" 
          + Math.round(Math.random() * 360) + ", " 
          + Math.round(Math.random() * 100) + "%, " 
          + Math.round(30 + Math.random() * 30) + "%)";
    }

    //Note: Does not include the tag, y, and request values for the json node
    function buildPartialJSONNode(jsonData, iDate, sColor, fXAxisInterval, fYAxisInterval, aJSONDates, sStyle, sTagField)
    {
      var bIsTotal = (sStyle === "total");
      var sDate = aJSONDates[iDate]["full-date"];
      var iDateEnd = iDate + 1;
      var sDateEnd = "";
      if (iDateEnd >= aJSONDates.length)
      {
        sDateEnd = "now"
      }
      else
      {
        sDateEnd = aJSONDates[iDateEnd]["full-date"];
      }

      var iRequests = bIsTotal ? jsonData["Total by Dates"][aJSONDates[iDate]["full-key"]] : jsonData["Tags"][sTagField][aJSONDates[iDate]["full-key"]];

      jsonNode =  
      {
        "date": sDate, "tag": sTagField,
        "x": calculateXLocation(iDate, fXAxisInterval), "y": calculateYLocation(iRequests, fYAxisInterval), 
        "requests": iRequests, "fill": sColor,
        "style": sStyle, "r": NODESIZE,
        "display": "", "total": bIsTotal, //we'll undisplay later if necessary
        "date-range": sDate + " to " + sDateEnd
      }; 
      return jsonNode;
    }

    //++++++++++++++++++++++++++++++++++++++ Meat ++++++++++++++++++++++++++++++++++++++++++

    function generateJSONNodes(jsonData, aJSONDates, aTagKeys, fXAxisInterval, fYAxisInterval, sStyle)
    {
      //FACETED
      if (sStyle === "faceted")
      {
        var aaJSONPerDayPerTag = new Array();

        //go through each tag
        for (var iTag = 0; iTag < aTagKeys.length; iTag++)
        {
          var sColor = randomColor();
          var aJSONNodesPerDay = new Array(aJSONDates.length);
          var sCurrentTag = aTagKeys[iTag];
          var iTotalTagRequests = 0;

          //and then through each date in each tag
          for(var iDate = 0; iDate < aJSONDates.length; iDate++)
          {
            aJSONNodesPerDay[iDate] = buildPartialJSONNode(jsonData, iDate, sColor, fXAxisInterval, fYAxisInterval, aJSONDates, sStyle, sCurrentTag);

            iTotalTagRequests += aJSONNodesPerDay[iDate]["requests"];
          }
          if (iTotalTagRequests !== 0) //only add it to our array if it has requests
          {
            aaJSONPerDayPerTag.push(aJSONNodesPerDay);
          }
        }
        return aaJSONPerDayPerTag;
      }
      //TOTAL
      else if (sStyle === "total")
      {
        var sColor = randomColor();
        var aJSONNodesTotal = new Array(aJSONDates.length);

        //Go through each day
        for (var iDate = 0; iDate < aJSONDates.length; iDate++)
        {
          var sSearch = jsonData["search"];

          aJSONNodesTotal[iDate] = buildPartialJSONNode(jsonData, iDate, sColor, fXAxisInterval, fYAxisInterval, aJSONDates, sStyle, sSearch); 
        }
        return aJSONNodesTotal;
      }
    }


  	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  	//+++++++++++++++++++++++++++++++++ Main Function +++++++++++++++++++++++++++++++++++++++
  	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //+++++++++++++++++++++++++++++ L1 Helper Functions ++++++++++++++++++++++++++++++++++++

    function determineMax(jsonSingleGraphData, aJSONDates, iCurrentMax)
    {
      for (var i = 0; i < aJSONDates.length; i++)
      {
        var iCurrentRequests = jsonSingleGraphData[aJSONDates[i]["full-key"]];
        iCurrentMax = iCurrentRequests > iCurrentMax ? iCurrentRequests : iCurrentMax;
      }
      return iCurrentMax;
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
            jsonCurrentTag = jsonData["Tags"][sCurrentTag];
            iMaxRequests = determineMax(jsonCurrentTag, aJSONDates, iMaxRequests);
          }
      }
      else
      {
        iMaxRequests = determineMax(jsonData["Total by Dates"], aJSONDates, iMaxRequests);
      }

        var fCushion = (fPercentCushion * iMaxRequests > 0) ? fPercentCushion * iMaxRequests : 1;

        return iGraphHeight / (iMaxRequests + fCushion);
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
        if (sDate.charAt(0) === '2') //there is also a 'between' field
        {
          var aDate = sDate.split("-");
          var iYear = parseInt(aDate[0]);
          var iMonth = parseInt(aDate[1]);
          var iDay = parseInt(aDate[2]);

          aDates.push({"year" : iYear, "month" : iMonth, "day" : iDay, "full-date" : sDate.substring(0, sDate.indexOf("T")), "full-key" : sDate});
        }
      }
      return aDates;
    }

    //++++++++++++++++++++++++++++++++++++++ Meat ++++++++++++++++++++++++++++++++++++++++++

  	function drawGraph(jsonData)
  	{
  		var isByTag = (DEFAULTSTYLE === "faceted" ? true : false);
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

  		var iSpansOfDays = aJSONDates.length;
  		var fXAxisInterval = (HAXISEND - HOFFSET) / iSpansOfDays; //TODO: scales would be better here
  		var fYAxisIntervalFaceted = getYAxisInterval(jsonData, aJSONDates, aTagKeys, "total"); //always normalize based on total (facet option is valid though)
  		var fYAxisIntervalTotal = getYAxisInterval(jsonData, aJSONDates, aTagKeys, "total");

  		var aJSONNodesTotal = generateJSONNodes(jsonData, aJSONDates, aTagKeys, fXAxisInterval, fYAxisIntervalTotal, "total");
  		var aaJSONNodesFaceted = generateJSONNodes(jsonData, aJSONDates, aTagKeys, fXAxisInterval, fYAxisIntervalFaceted, "faceted");

  		//Draw Graph
  		drawAxis(aJSONDates, fXAxisInterval);
      drawPathsThroughNodes(aJSONNodesTotal, (isByTag ? "hidden" : "displayed"));
  		drawNodes(aJSONNodesTotal, (isByTag ? "hidden" : "displayed"));
      var sFacetDisplay = (isByTag ? "displayed" : "hidden");
		for (var i = 0; i < aaJSONNodesFaceted.length; i++)
		{
      drawPathsThroughNodes(aaJSONNodesFaceted[i], sFacetDisplay);
			drawNodes(aaJSONNodesFaceted[i], sFacetDisplay); //precalculate sFacet display earlier so that we don'thave to do it every loop
		}

		//Create Events
  		createNodeEvents();
  		createStyleButton(aaJSONNodesFaceted, aJSONNodesTotal, isByTag);
  	}
    drawGraph(HTMLEtimelineData);
	});
})(jQuery);