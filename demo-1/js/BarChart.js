// Barchart function
var BarChart = function() {
  // Default values, variables that should be accesible within the namespace
  var fillColor = 'purple',
      height = 600,
      width = 1000,
      xVar = 'x',
      yVar = 'y',
      xAxisLabel = 'X Axis Label',
      yAxisLabel = 'Y Axis Label';

  // Margin: how much space to put in the SVG for axes/titles
  var margin = {
    left:70,
    bottom:50,
    top:0,
    right:50,
  };

  // Chart function to return
  var chart = function(selection) {
    // Height/width of the drawing area for data symbols
    var innerHeight = height - margin.bottom - margin.top;
    var innerWidth = width - margin.left - margin.right;

    // Loop through selections and data bound to each element
    selection.each(function(data){
      var div = d3.select(this); // Container

      // Selection of SVG elements in DIV (making sure not to re-append svg)
      var svg = div.selectAll('svg').data([data])


      // Append a 'g' element in which to place the rects, shifted down and right from the top left corner
  		var gEnter = svg.enter().append("svg").attr('height', height)
                .attr('width', width).append('g')

      // Append a G to hold rects
      gEnter.append('g')
  				.attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
  				.attr('height', innerHeight)
  				.attr('width', innerWidth)
          .attr('class', 'symbol-g');

  		// Append an xaxis label to your SVG, specifying the 'transform' attribute to position it
  		gEnter.append('g')
				 .attr('class', 'xaxis axis');

  		// Append a yaxis label to your SVG, specifying the 'transform' attribute to position it
  		gEnter.append('g')
				 .attr('class', 'yaxis axis');

  		// Append text to label the y axis
  		gEnter.append('text')
  		   .attr('class', 'xtitle title');

  		// Append text to label the y axis
  		gEnter.append('text')
  			 .attr('class', 'title ytitle');

      // Get unique X values
  	  var xValues = data.map(function(d) {return d[xVar]});

      // Set ordinal X scale
  		var xScale  = d3.scale.ordinal().rangeBands([0, innerWidth], .2).domain(xValues);

			// Get min/max values of the y data
			var yMin =d3.min(data, function(d){return +d[yVar]});
			var yMax =d3.max(data, function(d){return +d[yVar]});

  		// Define the yScale: remember to draw from top to bottom!
			yScale = d3.scale.linear().range([innerHeight, 0]).domain([0, yMax]);

  	  // Define x axis using d3.svg.axis(), assigning the scale as the xScale
			var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient('bottom');

			// Define y axis using d3.svg.axis(), assigning the scale as the yScale
			var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient('left')
						.tickFormat(d3.format('.2s'));

			// Call xAxis (and update position)
			svg.select('.xaxis').attr('transform', 'translate(' + margin.left + ',' + (innerHeight + margin.top) + ')')
                          .transition()
                          .duration(500)
                          .call(xAxis);

			// Call yAxis (and update position)
			svg.select('.yaxis').attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
                          .transition()
                          .duration(1500)
                          .call(yAxis);


			// Update labels (and their positions)
			svg.select('.xtitle').attr('transform', 'translate(' + (margin.left + innerWidth/2) + ',' + (innerHeight + margin.top + 40) + ')')
                          .transition()
                          .duration(500)
                          .text(xAxisLabel);

			svg.select('.ytitle').attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + innerHeight/2) + ') rotate(-90)')
                          .transition()
                          .text(yAxisLabel);

      // Re-select G for symbols
      var g = div.select('.symbol-g');

			// Select all rects and bind data
			var bars = g.selectAll('rect').data(data);

			// Use the .enter() method to get your entering elements, and assign initial positions
			bars.enter().append('rect')
				.attr('x', function(d){return xScale(d[xVar])})
				.attr('y', innerHeight)
				.attr('height', 0)
				.attr('width', xScale.rangeBand())
				.attr('class', 'bar');

			// Use the .exit() and .remove() methods to remove elements that are no longer in the data
			bars.exit().remove();

			// Transition properties of the update selection
			bars.transition()
				.duration(1500)
				.delay(function(d,i){return i*50})
				.attr('x', function(d){return xScale(d[xVar])})
				.attr('y', function(d){return yScale(d[yVar])})
				.attr('height', function(d) {return innerHeight - yScale(d[yVar])})
        .style('fill', fillColor)
				.attr('width', xScale.rangeBand());
    })
  }

  // Getter/setter methods
  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.fillColor = function(value) {
    if (!arguments.length) return fillColor;
    fillColor = value;
    return chart;
  };

  chart.xAxisLabel = function(value) {
    if (!arguments.length) return xAxisTitle;
    xAxisLabel = value
    return chart
  }

  chart.yAxisLabel = function(value) {
    if (!arguments.length) return yAxisTitle;
    yAxisLabel = value
    return chart
  }

  chart.xVar = function(value) {
    if (!arguments.length) return xVar;
    xVar = value
    return chart
  }

  chart.yVar = function(value) {
    if (!arguments.length) return yVar;
    yVar = value
    return chart
  }

  return chart;
}
