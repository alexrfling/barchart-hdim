function barchart(id, height, data) {
  var container = new SVGContainer(id, "barchart", "barchartSVG", resizeCallback,
                                  { top: 5, bottom: 5, left: 5, right: 5 }, height);
  var byName = true;
  var descending = true;
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

  container.resize();

  var labels = data.map(key);
  var axisOffset = 5;
  var w = container.svgWidth;
  var h = container.svgHeight;
  var datamax = Math.max(...data.map(function(d) { return Math.abs(d.value); }));
  var svg = container.svg;
  var colors = interpolateColors("#dc3912", "lightgrey", "#109618", 256);

  var xLabelsMargin = axisOffset * 2;// = 30;
  var yLabelsMargin = axisOffset * 2;// = 30;
  var xBarsMargin = w - xLabelsMargin - axisOffset;
  var yBarsMargin = h - yLabelsMargin - axisOffset;

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
  		.attr("class", "axis").attr("id", "xticks")
      .attr("transform", "translate(" + xLabelsMargin + "," + yLabelsMargin + ")")
      .call(xAxis.tickSize(-1 * yBarsMargin - axisOffset, 0, 0) /*.tickFormat("") */ );

  var bars = new Cells(svg, "bars", data, key,
    function(d) { return xScale(0) - (d.value < 0 ? barWidthScale(Math.abs(d.value)) : -1); }, // -1 for pos bars -> no overlap on "0" center tick
    function(d) { return yScale(d.key); },
    function(d) { return barWidthScale(Math.abs(d.value)); },
    function(d) { return barHeightScale.bandwidth(); },
    function(d) { return colorScale(d.value); });
  var barLabels = new Labels(svg, "labels", "axis", labels, function() { return yBarsMargin; },
                            barHeightScale.step, false, 10, "left");
  var posTooltip = new Tooltip(container.div, "Regression Coefficient", [{ text: "Variable", id: "key" }, { text: "Value", id: "value" }], identity);
  var negTooltip = new Tooltip(container.div, "Regression Coefficient", [{ text: "Variable", id: "key" }, { text: "Value", id: "value" }], identity);

  barLabels.group.selectAll("text").attr("id", function() { return this.innerHTML; });
  bars.addListener("mouseover", function(d) {
    barLabels.group.select("#" + d.key).classed("bold", true);
    d.value < 0 ? negTooltip.show(d, this, "left") : posTooltip.show(d, this, "right");
  });
  bars.addListener("mouseout", function(d) {
    barLabels.group.select("#" + d.key).classed("bold", false);
    d.value < 0 ? negTooltip.hide() : posTooltip.hide();
  });
  bars.addListener("click", sortBars);

  marginsSetup(w, h);
  anchorsSetup(w, h);
  scalesSetup(w, h);
  positionAllElements();
  svg.append("g").attr("class", "axis").attr("id", "labels").append("path")//.attr("class", "domain")
    .attr("stroke", "#000").attr("d", "M " + barLabels.anchor[0] + " " + barLabels.anchor[1] + " L " + barLabels.anchor[0] + " " + h);

  // custom initialization + transition
  bars.selection.attr("x", xScale(0))
                .attr("y", function(d) { return yScale(d.key); })
                .attr("height", barHeightScale.bandwidth)
                .attr("width", 0)
                .attr("fill", "white");
  bars.selection.transition()
                .duration(1000)
                .delay(function(d, i) { return i * 25; })
                .attr("x", bars.attrs.x)
                .attr("width", bars.attrs.width)
                .attr("fill", bars.attrs.fill)

  function marginsSetup(w, h) {
    xLabelsMargin = Math.ceil(barLabels.getBox().width);
    yLabelsMargin = 10;
    xBarsMargin = w - xLabelsMargin - axisOffset;
    yBarsMargin = h - yLabelsMargin - axisOffset;
  }

  function anchorsSetup(w, h) {
    bars.anchor = [xLabelsMargin + axisOffset, yLabelsMargin + axisOffset];
    barLabels.anchor = [xLabelsMargin, yLabelsMargin + axisOffset];
  }

  function scalesSetup(w, h) {
    barWidthScale.range([0, xBarsMargin / 2]);
    barHeightScale.range([0, yBarsMargin]);
    xScale.range([0, xBarsMargin]);
    yScale.range([0, yBarsMargin]);
  }

  function positionAllElements() {
    bars.position();
    barLabels.position();
    xLabels.attr("transform", "translate(" + (xLabelsMargin + axisOffset) + "," + yLabelsMargin + ")")
          .call(xAxis.tickSize(-1 * yBarsMargin - axisOffset, 0, 0));
  }

  function updateVisAllElements() {
    bars.updateVis(["x", "y", "width", "height", "fill"]);
    xLabels.call(xAxis.tickSize(-1 * yBarsMargin - axisOffset, 0, 0));
    barLabels.updateVisNT();
    //barLabels.selectAll(".domain").attr("d", function() { return "M-6,10.23434H0.5V570.234234H-6"});
  }

  function resizeCallback() {
    var updatedWidth = container.resize();
    marginsSetup(updatedWidth, h);
    anchorsSetup(updatedWidth, h);
    scalesSetup(updatedWidth, h);
    positionAllElements();
    updateVisAllElements();
  }

  function sortBars() {
    negTooltip.hide();
    posTooltip.hide();
    byName = !byName;
    if (byName) descending = !descending;
    data = data.sort(function(a, b) {
      if (byName) {
        return descending ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key);
      } else {
        return descending ? a.value - b.value : b.value - a.value;
      }
    });
    labels = data.map(key);
    barHeightScale.domain(labels);
    yScale.domain(labels);
    bars.selection.transition()
        .duration(1000)
        .delay(function(d) { return 500 * Math.abs(d.value) / datamax; })
        .attr("y", bars.attrs.y);
    barLabels.updateNames(labels);
    barLabels.updateVis(1000);
  }
}
