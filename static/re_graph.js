function build_real_estate_graph(REdata) {

  var svgWidth = 600;
  var svgHeight = 500;

  var margin = { top: 20, right: 40, bottom: 80, left: 100 };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var yMax;
  var yMin;


  // Create a function to parse date (YYYY-MM)
  var parseTime = d3.timeParse("%Y_%m");
  // Format the data
  REdata.forEach(function(data) {
    data.period = parseTime(data.period);
    data.home_value = +data.home_value;
    data.rental = +data.rental;
  });

  // Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var chart = svg.append("g");

  // Append a div to the body to create tooltips, assign it a class
  d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // This function identifies the minimum and maximum values in a column
    // and assign them to yMin and yMax variables, which will define the axis domain
    function findMinAndMax(dataColumnY) {
      yMin = d3.min(REdata, function(data) {
      return +data[dataColumnY] * 0.8;
      });
      yMax = d3.max(REdata, function(data) {
        return +data[dataColumnY] * 1.1;
      });
    }

  // The default y-axis is 'home_value'
  // Another axis can be assigned to the variable during an onclick event.
  // This variable is key to the ability to change axis/data column
  var currentAxisLabelX = "period";
  var currentAxisLabelY = "home_value";

  // Call findMinAndMax() with defaults
  findMinAndMax(currentAxisLabelY);

  var xTimeScale = d3.scaleTime()
    .range([0, width]);

  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  // var xLinearScale = d3.scaleLinear()
  //   .range([0, width]);

  // Create axis functions
  //var bottomAxis = d3.axisBottom(xLinearScale);
  var bottomAxis = d3.axisBottom(xTimeScale)
    // Specify the number of tick marks (approximately).
    .ticks(15);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xTimeScale.domain(d3.extent(REdata, function(data) {
    return data.period;
  }));
  yLinearScale.domain([yMin, yMax]);

  //add the tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0,0])

    .html(function(data) {

      if (currentAxisLabelY === "home_value") {
        var yString = data.home_value;
      }
      else {
        var yString = data.rental;
      };

      var formatPeriod = d3.timeFormat("%Y-%m");
      xString = formatPeriod(data.period);

      return (xString + ": $" + yString);
    });

  chart.call(toolTip);

  // create the circles
  chart.selectAll("circle")
    .data(REdata)
    .enter()
      .append("circle")
      .attr("cx", function(data, index) {
        //return xLinearScale(+data[currentAxisLabelX]);
        return xTimeScale(data[currentAxisLabelX]);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(+data[currentAxisLabelY]);
      })
      .attr("r", "5")
      .attr("stroke","black")
      .attr("fill", "blue")

      //on hover, show the tooltip
      .on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event hide the tooltip
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


  //append x axis
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class","x-axis") //used for transition
    .call(bottomAxis);

  //append y axis
  chart.append("g")
    .attr("class","y-axis")
    .call(leftAxis);

  //y-axis label; all y-axis labels will always be inactive. the only way to select an axis is through the x-axis
  // first y-axis is considered selected and bolded

  //x-axis label always selected; y label is selectable (active or inactive)
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 1.7))  // make 1.5 smaller to get the axis title to move down a bit
      .attr("dy", "1em")
      .attr("class", "axis-text active")
      //default
      .attr("data-axis-name", "home_value")
      .text("Home Prices ($)")

  //append the unselected Y labels
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 1.7))  // make 1.5 smaller to get the axis title to move down a bit
      .attr("dy", "1em")
      .attr("class", "axis-text inactive")
      .attr("data-axis-name", "rental")
      .text("Monthly Rent ($)")



  // Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")") //make 2.5 larger to get title to move left
    .attr("class", "axis-text x-selected")
    //default
    .attr("data-axis-name", "period")
    .text("Period")


  //handle the axis change
  function labelChange(clickedAxis) {
    d3
      .selectAll(".axis-text")
      .filter(".active")
      // An alternative to .attr("class", <className>) method. Used to toggle classes.
      .classed("active", false)
      .classed("inactive", true);
    clickedAxis.classed("inactive", false).classed("active", true);
  }




    //CLICKED Y AXIS!!!
    d3.selectAll(".axis-text").on("click", function() {
    // Assign a variable to current axis
      var clickedSelection = d3.select(this);

      // "true" or "false" based on whether the axis is currently selected
      var isClickedSelectionInactive = clickedSelection.classed("inactive");

      // Grab the data-attribute of the axis and assign it to a variable
      var clickedAxis = clickedSelection.attr("data-axis-name");
      
      // The onclick events below take place only if the x-axis is inactive
      // Clicking on an already active axis will therefore do nothing
      if (isClickedSelectionInactive) {
        // Assign the clicked axis to the variable currentAxisLabelX
        currentAxisLabelY = clickedAxis;

        //find min and max domain values
        findMinAndMax(currentAxisLabelY);
        // Set the domain for the y-axis
        yLinearScale.domain([yMin, yMax]);

        // Create a transition effect for the y-axis
        svg
          .select(".y-axis")
          .transition()
          .duration(1000)
          .call(leftAxis);

        // Select all circles to create a transition effect, then relocate the horizontal and vertical location
        // based on the new axis that was selected/clicked
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()

            // .attr("cx", function(data, index) {
            //   return xTimeScale(data[currentAxisLabelX]);
            // })
            .attr("cy", function(data, index) {
              return yLinearScale(+data[currentAxisLabelY]);
            })
            .duration(500);
        });

        // Change the status of the axes.
        labelChange(clickedSelection);

      }
    });

}
