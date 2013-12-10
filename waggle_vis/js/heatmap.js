//Dependent on D3.js and share.js

(function ($) {
  $(document).ready(function() {
    var SVGWIDTHPERCENTAGE = 100;
    var SVGHEIGHT = 300;

    //create our SVG selection
    var d3sHeatmapSVG = createSVG('waggle-vis-heatmap', SVGWIDTHPERCENTAGE, SVGHEIGHT);

    console.log("success!");
  });
})(jQuery);