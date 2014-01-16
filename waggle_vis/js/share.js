//Dependent on D3.js

function createSVG(sID, iWidthPercent, iHeightPx)
{
  return d3.select('#' + sID).append("svg")
          .attr("width", iWidthPercent + '%')
          .attr("height", iHeightPx);
}

//TODO: consider creating a main get color function to use in heatmap and timeline. could help in creating a consistent theme in the colors between the apps