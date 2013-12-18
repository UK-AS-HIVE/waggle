//Dependent on D3.js and share.js

(function ($) {
  $(document).ready(function() {
    var SVGWIDTHPERCENTAGE = 100;
    var SVGHEIGHT = 300;
    var XDOMAIN = [-1, 7];
    var WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var DAYSTART = 0;
    var DAYEND = 6;
    var MARGIN = {'top': 10, 'bottom': 30, 'left': 30, 'right': 30};

    //create our SVG selection
    var d3sSVG = createSVG('waggle-vis-heatmap', SVGWIDTHPERCENTAGE, SVGHEIGHT);
    var SVGWIDTH = parseInt(d3sSVG.style('width'));
    var XRANGE = [MARGIN['left'], SVGWIDTH - MARGIN['right']];

    //Create the X-axis
    /*
    var fScale = d3.scale.linear()
                      .domain(XDOMAIN)
                      .range(XRANGE);

    var fAxis = d3.svg.axis() //it is a function!
                    .scale(fScale)
                    .orient("bottom")
                    .ticks(NUMOFDAYSVISIBLE)
                    .tickFormat(function (d) {return WEEK[d];})
                    .innerTickSize(0)
                    .outerTickSize(6);

    var d3sAxis = d3sSVG.append("g").attr("class", "d3Axis")
                    .attr("transform", "translate(0, " + (SVGHEIGHT - MARGIN['bottom']) + ")")
                    .call(fAxis);
    */

    function drawHeatMap()
    {
      var d3sAxis = d3sSVG.append('g').attr("class", "heatMapAxis");

      //TODO: make this loops into a partition function, code reuse (not convinced it's worth it)
      //partition into seven segments for days
      var iNumOfDays = (DAYEND - DAYSTART)
      var fXSpan = (SVGWIDTH - MARGIN['right'] - MARGIN['left']) / iNumOfDays;
      for (var i = 0; i <= DAYEND - DAYSTART; i++) //seven partitions = 8 lines including heatmap edges
      {
        var fXLoc = MARGIN['left'] + (i * fXSpan);
        d3sAxis.append("line")
          .classed("vertical divider", true)
          .attr("x1", fXLoc)
          .attr("x2", fXLoc);
        //note we haven't set the y location yet. Since they'll all be the same, we'll set it after this loop
      }
      d3.selectAll(".heatMapAxis .vertical.divider")
        .attr("y1", MARGIN['top'])
        .attr("y2", SVGHEIGHT - MARGIN['bottom']);

      //finish the cells with horizontal bars
      var iNumOfHours = iHourEnd - iHourStart;
      var fYSpan = (SVGHEIGHT - MARGIN['bottom'] - MARGIN['top']) / iNumOfHours;
      for (var i = 0; i <= iHourEnd - iHourStart; i++)
      {
        var fYLoc = (i * fYSpan) + MARGIN['top'];
        d3sAxis.append("line")
          .classed("horizontal divider", true)
          .attr("y1", fYLoc)
          .attr("y2", fYLoc);
      }
      d3.selectAll(".heatMapAxis .horizontal.divider")
        .attr("x1", MARGIN['left'])
        .attr("x2", SVGWIDTH - MARGIN['right']);
    }

    /*
    this is all probably a waste of time
    function partitionHeatmap(bPerformVertically, iLowBound, iUpBound)
    {
      var jsonInfo = bPerformVertically ? 
                      {'iSVGDimension': SVGHEIGHT, 'iPartitionPadStart': MARGIN['top'], 'iPartitionPadEnd': MARGIN['bottom'], 'sOrientation': 'vertical', 'sPartitionDimension': 'y', 'sOtherDimension': 'x', 'iOtherPadStart': MARGIN['right'], ''} :
                      {'iSVGDimension': SVGWIDTH, 'iPartitionPadStart': MARGIN['left'], 'iPartitionPadEnd': MARGIN['right'], 'sOrientation': 'horizontal', 'sPartitionDimension': 'x', 'sOtherDimension': 'y'};

      var fSpan = (jsonInfo.iSVGDimension - jsonInfoiSVGPadEnd - jsonInfoiSVGPadStart) / (iUpBound - iLowBound);
      for (var i = 0; i <= iUpBound - iLowBound; i++)
      {
        var fLoc = jsonInfo.iSVGPadStart + (i * fSpan);
        d3sAxis.append("line")
          .classed(sOrientation + " divider", true)
          .attr(jsonInfo.sPartitionDimension + "1", fLoc)
          .attr(jsonInfo.sPartitionDimension + "2", fLoc);
        //note we haven't set the y location yet. Since they'll all be the same, we'll set it after this loop
      }
      d3.selectAll(".heatMapAxis .vertical.divider")
        .attr(jsonInfo.sOtherDimension + "1", jsonInfo.iSVGPadStart)
        .attr(jsonInfo.sOtherDimension + "2", jsonInfo.iSVGDimension - jsonInfo.iSVGPadEnd);
    }
    */

    function main()
    {
      drawHeatMap();
    }

    main();

    console.log("success!");
  });
})(jQuery);