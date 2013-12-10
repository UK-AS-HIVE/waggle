//Dependent on D3.js

function createSVG(sID, iWidthPercent, iHeightPx)
{
  return d3.select('#' + sID).append("svg")
          .attr("width", iWidthPercent + '%')
          .attr("height", iHeightPx);
}