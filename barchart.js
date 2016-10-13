// important parameters
var w = 700, h = 450, padding = 30, dataLength = 20, ascending = true,
		DATAMAX = 256, dataset = generateRandomVector(dataLength, DATAMAX),
    datamax = d3.max(dataset, function(d) { return Math.abs(d.value); });

// set up the thing on which we'll draw/animate
var svg = d3.select("body")
						.append("svg")
            .attr("width", w)
            .attr("height", h);

// scales for bar width/height and x/y axes
var barWidthScale = d3.scaleBand()
											.domain(d3.range(0, dataLength, 1))
                      .range([padding, h - padding], 0.05);
var barHeightScale = d3.scaleLinear()
												.domain([0, datamax])
                        .range([0, (w / 2) - padding], 0.0);
var xScale = d3.scaleLinear()
								.domain([-1 * datamax, datamax])
              	.range([padding, w - padding]);
var yScale = d3.scaleLinear()
								.domain([0, dataLength])
              	.range([padding, h - padding]);

// axes for rows/columns (note that these ARE NOT yet added to the svg)
var xAxis = d3.axisTop(xScale);
var yAxis = d3.axisLeft(yScale);

// add the axes to the svg (add these before the bars so the bars will be on top)
svg.append("g")
		.attr("class", "xaxis")
    .attr("transform", "translate(" + 0 + "," + padding + ")")
    .call(xAxis
    		.tickSize(-1 * (h - 2 * padding), 0, 0)//.tickFormat("")
        );
svg.append("g")
		.attr("class", "yaxis")
    .attr("transform", "translate(" + padding + "," + 0 + ")")
    .call(yAxis
    		.tickSize(-1 * (w - 2 * padding), 0, 0)//.tickFormat("")
        );

// create the clipPath
svg.append("clipPath")
		.attr("id", "visible-area")
    .append("rect")
    .attr("x", padding)
    .attr("y", padding)
    .attr("width", w - 2 * padding)
    .attr("height", h - 2 * padding);

// add the clipPath to the svg
svg.append("g")
		.attr("id", "rectangles")
    .attr("clip-path", "url(#visible-area)");

// the initial bars
var bars = svg.select("#rectangles")
							.selectAll("rect")
							.data(dataset, key)
    					.enter()
    					.append("rect")
              .classed("bar", true)
              .attr("x", xScale(0)) // transition later for neg bars
              .attr("y", barPositionY)
              .attr("height", barWidth)
              .attr("width", 0) // transition later
              .attr("fill", "rgb(0,0,0)") // transition later
              .on("mouseover", function() { highlightBar(this); })
              .on("mouseout", function() { unhighlightBar(this); })
              .append("title")
        			.text(function(d, i) {
        					return "d.key: " + d.key + ", d.index: " + d.index + ", d.value: " + d.value + ", i: " + i;
        			});

var highlightBar = function(obj) {
		d3.select(obj).attr("fill", "orange");
}

var unhighlightBar = function(obj) {
		d3.select(obj)//.transition().duration(500)
        .attr("fill", barColor);
}

// THE RED CIRCLE
svg.append("circle")
    .attr("cx", w - padding / 2 - 40)
    .attr("cy", h - padding / 2)
    .attr("r", 10)
    .attr("fill", "red")
    .on("click", function() { sortBars(); });

// THE ORANGE CIRCLE
svg.append("circle")
    .attr("cx", w - padding / 2 - 20)
    .attr("cy", h - padding / 2)
    .attr("r", 10)
    .attr("fill", "orange")
    .on("click", function() { addBarToBottom(); });

// THE GREEN CIRCLE
svg.append("circle")
    .attr("cx", w - padding / 2)
    .attr("cy", h - padding / 2)
    .attr("r", 10)
    .attr("fill", "green")
    .on("click", function() { generateNewData(); });

var sortBars = function() {
		ascending = !ascending;
		//svg.selectAll("rect.bar")
    //		.on("mouseover", null)
    //    .on("mouseout", null);
    dataset.sort(function(a, b) {
    		if (ascending) {
        		return a.value - b.value;
        } else {
        		return b.value - a.value;
        }
    });
    svg.selectAll("rect.bar")
    		//.data(dataset, key)
    		.sort(function(a, b) {
        		if (ascending) {
            		return a.value - b.value; //d3.ascending(a.value, b.value);
            } else {
            		return b.value - a.value; //d3.descending(a.value, b.value);
            }
        })
        .transition()
        .delay(function(d, i) {
        		return Math.abs(d.value) * 3;
        })
        .duration(500)
        //.ease("cubic-in-out")
        .attr("x", barPositionX) // may have been interupted in last transition
        .attr("y", barPositionY)
        .attr("height", barWidth)
        .attr("width", barHeight)
        .attr("fill", barColor);
}

var addBarToBottom = function() {
		dataLength = dataLength + 1;
    dataset.push({
    		key: "Row " + (dataLength - 1),
        index: dataLength - 1,
        value: Math.floor(Math.random() * DATAMAX) - DATAMAX / 2
    });
    //dataset = generateRandomVector(dataLength, DATAMAX);
    barWidthScale.domain(d3.range(0, dataLength, 1));
    yScale.domain([0, dataLength]);
    datamax = d3.max(dataset, function(d) { return Math.abs(d.value); });
		barHeightScale.domain([0, datamax]);
    xScale.domain([-1 * datamax, datamax]);

    svg.selectAll("rect.bar")
    		.data(dataset, key)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("x", barPositionX)
        .attr("y", h - padding) // transition later
        .attr("height", barWidth)
        .attr("width", barHeight)
        .attr("fill", barColor)
        .on("mouseover", function() { highlightBar(this); })
        .on("mouseout", function() { unhighlightBar(this); })
        .append("title")
        .classed("tooltip", true)
        .text(function(d, i) {
        		return "d.key: " + d.key + ", d.index: " + d.index + ", d.value: " + d.value + ", i: " + i;
        });

    svg.selectAll("rect.bar")
    		.transition()
        .duration(1000)
        .attr("x", barPositionX)
        .attr("y", barPositionY)
        .attr("height", barWidth)
        .attr("width", barHeight)
        .attr("fill", barColor);

    svg.select(".yaxis")
    		.transition()
        .duration(1000)
        .call(yAxis);
}

// make some random data, an array with cells being objects
function generateRandomVector(len, maxVal) {
		var arr = [];
    for (var j = 0; j < len; j++) {
    		arr.push({
        		key: "Row " + j,
        		index: j,
            value: Math.floor(Math.random() * maxVal) - maxVal / 2
        });
    }
    return arr;
}
function generateNewRandomVector(len, maxVal, oldData) {
		var arr = [];
    for (var j = 0; j < len; j++) {
    		arr.push({
        		key: "Row " + oldData[j].index,
        		index: j,
            value: Math.floor(Math.random() * maxVal) - maxVal / 2
        });
    }
    return arr;
}

var generateNewData = function() {
    //var newDataLength = Math.floor(Math.random() * 24 + 24);
		DATAMAX = Math.floor(Math.random() * 128 + 128);
		dataset = generateNewRandomVector(dataLength, DATAMAX, dataset);
    datamax = d3.max(dataset, function(d) { return Math.abs(d.value); });

    // this update doesn't do anything yet, change dataLength when generating new data?
		//barWidthScale.domain(d3.range(0, dataLength, 1));
    //yScale.domain([0, dataLength]);

    // update scales
		barHeightScale.domain([0, datamax]);
    xScale.domain([-1 * datamax, datamax]);

    // axis updates
    svg.select(".xaxis") // used to be after bar updates
    		.transition()
        .duration(1000)
        .call(xAxis);
    svg.select(".yaxis") // used to be after bar updates
    		.transition()
        .duration(1000)
        .call(yAxis);

    // bar updates
    svg.selectAll("rect.bar")
    		.data(dataset, key)
        .transition()
        .delay(function(d, i) {
        		return i * 20;
        })
        .duration(1000)
        .attr("x", barPositionX) // d, i automatically passed in
        .attr("y", barPositionY) // d, i automatically passed in
        .attr("height", barWidth)
        .attr("width", barHeight)
        .attr("fill", barColor);
    svg.selectAll("title.tooltip")
        .text(function(d, i) {
        		return "d.key: " + d.key + ", d.index: " + d.index + ", d.value: " + d.value + ", i: " + i;
        });
}

// initial fade in/growth of the bars
svg.selectAll("rect.bar")
		.transition()
    .duration(1000)
    .attr("x", barPositionX)
    .attr("width", barHeight)
    .attr("fill", barColor);

function barPositionX(d, i) {
		if (d.value < 0) {
    		return xScale(0) - barHeightScale(Math.abs(d.value));
    } else {
    		return xScale(0);
    }
}

function barPositionY(d, i) {
		return yScale(i); // d.index instead of i???
}

function barHeight(d, i) {
		return barHeightScale(Math.abs(d.value));
}

function barWidth(d, i) {
		return barWidthScale.bandwidth();
}

function barColor(d, i) {
		return "rgb(0,0," + (2 * Math.abs(d.value)) + ")";
}

function key(d, i) {
		return d.key;
}
