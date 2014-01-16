//Dependent on D3.js and share.js

(function ($) {
  $(document).ready(function() {
    var SVGWIDTHPERCENTAGE = 50;
    var SVGHEIGHT = 300;
    var WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var MARGINBASE = {'top': 10, 'bottom': 30, 'left': 2, 'right': 2};
    var MARGINFORCHART = {'top': MARGINBASE['top'], 'bottom': MARGINBASE['bottom'], 'left': 15, 'right': 60}; //note: margin is a misnomer. it's actually the location in the SVG it is placed from the property's name (ie 2 units from the left of the SVG border)
    var MARGINFORLEGEND = {'top': MARGINBASE['top'], 'bottom': MARGINBASE['bottom'], 'left': 0, 'right': 2}; //but this is the margin of the legend from the heatmap (also I don't think the left margin is used...)
    var MARGINFORCOLORSCALE = {'top': MARGINBASE['top'], 'bottom': MARGINBASE['bottom'], 'left': 2, 'right': 0}
    var NUMOFDAYS = DAYEND - DAYSTART;
    var NUMOFHOURS = HOUREND - HOURSTART;

    //create our SVG selection
    var d3sSVG = createSVG('waggle-vis-heatmap', SVGWIDTHPERCENTAGE, SVGHEIGHT); //share.js (not really working out for me hehe)
    var SVGWIDTH = parseInt(d3sSVG.style('width'));
    
    function getMaxRequests()
    {
      var iMax = 0;
      for (var i = DAYSTART; i < DAYEND; i++)
      {
        for (var j = HOURSTART; j < HOUREND; j++)
        {
          var iTemp = HTMLEHeatmapData[i][j];
          iMax = (iTemp > iMax) ? iTemp : iMax;
        }
      }
      return iMax;
    }

    function drawHeatMap(jsonHelpfulData)
    {
      var iColorVal = jsonHelpfulData['color'];
      var iMaxHours = jsonHelpfulData['maxRequests'];
      var iColorPadLight = 20;
      var iColorPadDark = 20;
      var iColorScalePad = 0; //might through off color scale slider calculations, leave at 0 for now
      var iRoundedness = 0;

      //var d3sAxis = d3sSVG.append('g').attr("class", "heatMapAxis");
      var fXSpan = (SVGWIDTH - MARGINFORCHART['right'] - MARGINFORCHART['left']) / (NUMOFDAYS + 1); //plus one because it's inclusive (6 - 0 + 1 = 7)
      var fYSpan = (SVGHEIGHT - MARGINFORCHART['bottom'] - MARGINFORCHART['top']) / (NUMOFHOURS + 1); //same
      var d3sBlocksGroup = d3sSVG.append("g").classed("cellBlocks", true);
      for (var i = 0; i <= NUMOFDAYS; i++) //seven partitions = 8 lines including heatmap edges
      {
        var fXLoc = MARGINFORCHART['left'] + (i * fXSpan);
        /*d3sAxis.append("line")
          .classed("vertical divider", true)
          .attr("x1", fXLoc)
          .attr("x2", fXLoc);*/

        for (var j = 0; j <= NUMOFHOURS; j++)
        {
          var fYLoc = MARGINFORCHART['top'] + (j * fYSpan);
          /*d3sAxis.append("line")
            .classed("horizontal divider", true)
            .attr("y1", fYLoc)
            .attr("y2", fYLoc);*/

          //get the hour data for this time
          iRequests = HTMLEHeatmapData[i + DAYSTART][j + HOURSTART]; //TODO: resave HTMLEHeatmapData in this file so if it changes in waggle_vis_heatmap_block.inc we only have to change it once here too
          iRequestsNormalized = (iRequests / iMaxHours);
          iLightnesVal = iColorPadLight + (iRequestsNormalized * (100 - iColorPadDark - iColorPadLight));
          d3sBlocksGroup
            .append("rect")
            .classed("cell", true)
            .data([{'requests': iRequests, 'hour': j + HOURSTART, 'day': i + DAYSTART}])
            .attr("x", fXLoc)
            .attr("y", fYLoc)
            .attr("height", fYSpan - 1) //TODO: Magic number 1
            .attr("width", fXSpan - 1) //TODO: Magic number 1
            .attr("rx", iRoundedness)
            .attr("ry", iRoundedness)
            .style("fill", "hsl(" + iColorVal + ", " + 100 + "%, " + iLightnesVal + "%)");
        }
      }

      /*d3.selectAll(".heatMapAxis .vertical.divider")
        .attr("y1", MARGINFORCHART['top'])
        .attr("y2", SVGHEIGHT - MARGINFORCHART['bottom']);
      d3.selectAll(".heatMapAxis .horizontal.divider")
        .attr("x1", MARGINFORCHART['left'])
        .attr("x2", SVGWIDTH - MARGINFORCHART['right']);*/

      return {"ySpan" : fYSpan, "xSpan" : fXSpan, 'colLight': "hsl(" + iColorVal + ", " + 100 + "%, " + (100 - iColorPadDark + iColorScalePad) + "%)", 'colDark': "hsl(" + iColorVal + ", " + 100 + "%, " + (iColorPadLight - iColorScalePad) + "%)"};
    }

    function drawHours(fYSpan)
    {
      var iFontSize = 12;
      var d3sYAxis = d3sSVG.append('g').classed('yAxis', true);

      for (var i = 0; i <= NUMOFHOURS; i++)
      {
        var fYLoc = MARGINFORLEGEND['top'] + (fYSpan * i) + iFontSize;
        d3sYAxis.append('text').classed('hour', true)
          .attr('id', 'h' + (i + HOURSTART))
          .attr('x', MARGINFORCHART['left'] - MARGINFORLEGEND['right'])
          .attr('y', fYLoc)
          .attr('text-anchor', 'end')
          //.attr('dominant-baseline', 'middle') THANKS, IE
          .text(i + HOURSTART)
          .style("font-size", iFontSize + "px");
      }
    }

    function drawDays(fXSpan)
    {
      var iFontSize = 15;
      var d3sXAxis = d3sSVG.append('g').classed("xAxis", true);
      var fXLocOffset = MARGINFORCHART['left'] + ((fXSpan - 1) / 2); //width = fXSpan - 1, / 2 for middle

      for (var i = 0; i <= NUMOFDAYS; i++)
      {
        var fXLoc = fXLocOffset + (fXSpan * i);
        d3sXAxis.append('text').classed('day', true)
          .attr('id', 'd' + (i + DAYSTART))
          .attr('x', fXLoc)
          .attr('y', SVGHEIGHT - MARGINFORCHART['bottom'] + iFontSize)
          .attr('text-anchor', 'middle')
          .text(WEEK[i + DAYSTART])
          .style('font-size', iFontSize + 'px');

      }
    }

    function drawColorScale(sColLight, sColDark)
    {
      var d3sColorScale = d3sSVG.append('g').classed('colorScaleGroup', true);
      var iColorScaleXLoc = SVGWIDTH - MARGINFORCHART['right'] + MARGINFORCOLORSCALE['left'];
      var iColorScaleYLoc = MARGINFORCHART['top'];
      var iColorScaleSliderLength = 8;

      //create the gradient
      var d3sDefs = d3sSVG.append('svg:defs');
      var d3sGradient = d3sDefs.append('svg:linearGradient')
                          .attr('id', 'heatMapGradient')
                          .attr('y1', '0%')
                          .attr('y2', '100%')
                          .attr('x1', '0%')
                          .attr('x2', '0%');
      d3sGradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', sColLight)
        .attr('stop-oppacity', 1);
      d3sGradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', sColDark)
        .attr('stop-oppacity', 1);

      d3sColorScale.append('rect')
        .attr('id', 'colorScale')
        .attr('x', iColorScaleXLoc)
        .attr('y', iColorScaleYLoc)
        .attr('height', SVGHEIGHT - MARGINFORCHART['bottom'] - MARGINFORCHART['top'])
        .attr('width', 5) //TODO: magic number 5
        .style('fill', 'url(#heatMapGradient)')

      //add the color scale slider
      d3sColorScale.append('line').classed('colorScaleSlider', true)
        .attr('id', 'colorScaleSlider')
        .attr('x1', iColorScaleXLoc)
        .attr('y1', iColorScaleYLoc)
        .attr('x2', iColorScaleXLoc + iColorScaleSliderLength)
        .attr('y2', iColorScaleYLoc)
        .style('stroke', 'black')
        .style('stroke-width', 1);

      d3sColorScale.append('text').classed('colorScaleSlider', true)
        .attr('id', 'colorScaleSliderVal')
        .attr('x', iColorScaleXLoc + iColorScaleSliderLength + 2) //TODO: magic number
        .attr('y', iColorScaleYLoc)
        .style('font-size', '12px');

      return {'yLoc': iColorScaleYLoc, 'xLoc': iColorScaleXLoc};
    }

    function addMouseOverForCells(iMaxRequests, jsonColorScaleLocInfo)
    {
      var d3sCells = d3.selectAll('.cell');
      var d3sColorScale = d3.select('#colorScale');
      var iColorScaleHeight = parseInt(d3sColorScale.attr('height'));
      var d3sColorScaleSlider = d3.select('#colorScaleSlider');
      var d3sColorScaleSliderVal = d3.select('#colorScaleSliderVal');

      d3sCells.on('mouseover', 
        function(d)
        {
          var d3sTrigger = d3.select(this);
          var iTransform = ((iMaxRequests - d['requests']) / iMaxRequests) * iColorScaleHeight;
          var iNewYLoc = jsonColorScaleLocInfo['yLoc'] + iTransform;
          d3sColorScaleSlider.transition().duration(300)
            .attr('y1', iNewYLoc)
            .attr('y2', iNewYLoc);


          d3sColorScaleSliderVal
            .text(d['requests'])
            .transition().duration(300)
            .attr('y', iNewYLoc);

          //d3sTrigger.attr('transform', 'translate(')

          //d3.select('#d' + d['day']).transform().duration(300).scale
        });
    }

    function createJSONData()
    {
      return {"color" : Math.random() * 360, "maxRequests" : getMaxRequests()};
    }

    function main()
    {
      var jsonHelpfulData = createJSONData();
      var jsonMapInfo = drawHeatMap(jsonHelpfulData);
      drawHours(jsonMapInfo['ySpan']);
      drawDays(jsonMapInfo['xSpan']);
      var jsonColorScaleLocInfo = drawColorScale(jsonMapInfo['colLight'], jsonMapInfo['colDark']);
      addMouseOverForCells(jsonHelpfulData['maxRequests'], jsonColorScaleLocInfo);
    }

    main();

    console.log("success!");
  });
})(jQuery);