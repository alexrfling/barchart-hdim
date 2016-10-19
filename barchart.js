function barchart(id, height, data) {
  var container = new SVGContainer(id, "barchart", "barchartSVG", resizeCallback,
                                  { top: 5, bottom: 5, left: 5, right: 5 }, height);

  var filter = container.SVG.append("filter")
                  .attr("id", "shadow")
                  .attr("x", -2)
                  .attr("y", -2)
                  .attr("width", 200)
                  .attr("height", 200);
  filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 4);
  filter.append("feOffset").attr("dx", 0).attr("dy", 0);
  var filterMerge = filter.append("feMerge");
  filterMerge.append("feMergeNode");
  filterMerge.append("feMergeNode").attr("in", "SourceGraphic");

  var labels = data.map(key);
  var axisOffset = 5;
  var w = container.svgWidth, h = container.svgHeight, datamax = Math.max(...data.map(function(d) { return Math.abs(d.value); }));
  var svg = container.svg;
  var colors = interpolateColors("#dc3912", "lightgrey", "#109618", 256);

  container.resize();

  var xLabelsMargin = 30;
  var yLabelsMargin = 30;
  var xBarsMargin = w - xLabelsMargin;
  var yBarsMargin = h - yLabelsMargin;

  // scales for bar width/height and x/y axes
  var barHeightScale = d3.scaleBand().domain(labels)
                                     .range([0, yBarsMargin])
                                     .paddingInner(0.1)
                                     .paddingOuter(0.05);
  var barWidthScale = d3.scaleLinear().domain([0, datamax])
                                      .range([0, xBarsMargin / 2]);
  var xScale = d3.scaleLinear().domain([-1 * datamax, datamax])
                	             .range([0, xBarsMargin]);
  var yScale = d3.scaleBand().domain(labels)
                	           .range([0, yBarsMargin]);
  var colorScale = d3.scaleQuantize().domain([-datamax, datamax]).range(colors);

  // axes for rows/columns (note that these ARE NOT yet added to the svg)
  var xAxis = d3.axisTop(xScale);

  // add the axes to the svg (add these before the bars so the bars will be on top)
  var xLabels = svg.append("g")
  		.attr("class", "xaxis")
      .attr("transform", "translate(" + xLabelsMargin + "," + yLabelsMargin + ")")
      .call(xAxis.tickSize(-1 * yBarsMargin, 0, 0) /*.tickFormat("") */ );

  // the initial bars
  var bars = new Cells(svg, "bars", data, key,
    function(d) { return xScale(0) - (d.value < 0 ? barWidthScale(Math.abs(d.value)) : 0); },
    function(d) { return yScale(d.key); },
    function(d) { return barWidthScale(Math.abs(d.value)); },
    function(d) { return barHeightScale.bandwidth(); },
    function(d) { return colorScale(d.value); });

  var barLabels = new Labels(svg, "labels", "yaxis", labels, function() { return yBarsMargin; },
                            bars.attrs.height, false, 10, "left");
  //var ticks = new Labels(svg, )
  barLabels.group.selectAll("text").attr("id", function() { return this.innerHTML; });
  bars.addListener("mouseover", function(d) { barLabels.group.select("#" + d.key).classed("bold", true); });
  bars.addListener("mouseout", function(d) { barLabels.group.select("#" + d.key).classed("bold", false); });

  marginsSetup(w);
  anchorsSetup(w);
  scalesSetup(w);
  positionAllElements();

  // custom setup
  bars.selection.attr("x", xScale(0)) // transition later for neg bars
                .attr("y", function(d) { return yScale(d.key); })
                .attr("height", barHeightScale.bandwidth)
                .attr("width", 0) // transition later
                .attr("fill", "white"); // transition later

  // initial fade in/growth of the bars
  bars.selection.transition()
      .duration(1000)
      .delay(function(d, i) { return i * 25; })
      .attr("x", bars.attrs.x)
      .attr("width", bars.attrs.width)
      .attr("fill", bars.attrs.fill);

  function marginsSetup(w) {
    xLabelsMargin = barLabels.getBox().width;
    yLabelsMargin = 10;
    xBarsMargin = w - xLabelsMargin - axisOffset;
    yBarsMargin = h - yLabelsMargin - axisOffset;
  }

  function anchorsSetup(w) {
    bars.anchor = [xLabelsMargin + axisOffset, yLabelsMargin + axisOffset];
    barLabels.anchor = [xLabelsMargin, yLabelsMargin + axisOffset];
  }

  function scalesSetup(w) {
    barWidthScale.range([0, xBarsMargin / 2], 0.0);
    xScale.range([0, xBarsMargin]);
  }

  function positionAllElements() {
    bars.position();
    barLabels.position();
    xLabels.attr("transform", "translate(" + (xLabelsMargin + axisOffset) + "," + yLabelsMargin + ")").call(xAxis);
  }

  function updateVisAllElements() {
    bars.updateVis(["x", "y", "width", "height", "fill"]);
    xLabels.call(xAxis);
  }

  function resizeCallback() {
    var updatedWidth = container.resize();
    marginsSetup(updatedWidth);
    anchorsSetup(updatedWidth);
    scalesSetup(updatedWidth);
    positionAllElements();
    updateVisAllElements();
  }
}
