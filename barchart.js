function barchart(id, height, data) {
  var container = new SVGContainer(id, "barchart", "barchartSVG",
                                  resizeCallback,
                                  { top: 3, bottom: 3, left: 3, right: 3 }, height);

  // important parameters
  var w = container.svgWidth, h = container.svgHeight, padding = 30, datamax = 128;
  var svg = container.svg;
  var colors = interpolateColors("red", "lightgrey", "green", 256);

  container.resize();

  var xLabelsMargin = 100;
  var yLabelsMargin = 100;
  var xBarsMargin = w - xLabelsMargin;
  var yBarsMargin = h - yLabelsMargin;

  // scales for bar width/height and x/y axes
  var barHeightScale = d3.scaleBand()
  											.domain(d3.range(data.length))
                        .range([padding, h - padding], 0.05);
  var barWidthScale = d3.scaleLinear()
  												.domain([0, datamax])
                          .range([0, (w / 2) - padding], 0.0);
  var xScale = d3.scaleLinear()
  								.domain([-1 * datamax, datamax])
                	.range([padding, w - padding]);
  var yScale = d3.scaleLinear()
  								.domain([0, data.length])
                	.range([padding, h - padding]);

  // axes for rows/columns (note that these ARE NOT yet added to the svg)
  var xAxis = d3.axisTop(xScale);

  // add the axes to the svg (add these before the bars so the bars will be on top)
  svg.append("g")
  		.attr("class", "xaxis")
      .attr("transform", "translate(" + 0 + "," + padding + ")")
      .call(xAxis.tickSize(-1 * (h - 2 * padding), 0, 0) /*.tickFormat("") */ );

  // the initial bars
  var bars = new Cells(svg, "bars", data, key,
    function(d, i) { return xScale(0) - (d.value < 0 ? barWidthScale(Math.abs(d.value)) : 0); },
    function(d, i) { return yScale(i); /* d.index instead of i??? */ },
    function(d, i) { return barWidthScale(Math.abs(d.value)); },
    function(d, i) { return barHeightScale.bandwidth(); },
    function(d, i) { return colors[Math.floor(d.value + 128)]; });

  var barLabels = new Labels(svg, "labels", data.map(key), function() { return yBarsMargin; },
                            bars.attrs.height, false, 10, "left");
  //var ticks = new Labels(svg, )

  bars.selection.attr("x", xScale(0)) // transition later for neg bars
                .attr("y", function(d, i) { return yScale(i); /* d.index instead of i??? */ })
                .attr("height", function(d, i) { return barHeightScale.bandwidth(); })
                .attr("width", 0) // transition later
                .attr("fill", "rgb(255,255,255)"); // transition later

  // initial fade in/growth of the bars
  bars.selection.transition()
      .duration(1000)
      .delay(function(d, i) { return i * 25; })
      .attr("x", bars.attrs.x)
      .attr("width", bars.attrs.width)
      .attr("fill", bars.attrs.fill);

  function scalesSetup(w) {
    barWidthScale.range([0, (w / 2) - padding], 0.0);
    xScale.range([padding, w - padding]);
  }

  function marginsSetup(w) {
    xLabelsMargin = 100;
    yLabelsMargin = 100;
    xBarsMargin = w - xLabelsMargin;
    yBarsMargin = h - yLabelsMargin;
  }

  function anchorsSetup(w) {
    bars.anchor = [xLabelsMargin, yLabelsMargin];
  }

  function positionAllElements() {
    bars.updateVis(["x", "y", "width", "height", "fill"]);
    svg.call(xAxis);
  }

  function resizeCallback() {
    var updatedWidth = container.resize();
    marginsSetup(updatedWidth);
    anchorsSetup(updatedWidth);
    scalesSetup(updatedWidth);
    positionAllElements();
  }
}
