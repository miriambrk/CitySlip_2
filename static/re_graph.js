function build_real_estate_graph(REdata) {


  //first remove a previously-rendered svg
  d3.select("#homechart").remove();
  d3.select("#homestooltip").remove();


  var svgWidth = 600;
  var svgHeight = 500;

  var margin = { top: 20, right: 40, bottom: 80, left: 100 };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var yMax;
  var yMin;


  // Create a function to parse date (YYYY-MM) because this will be a time-sequenced graph
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
    .attr("id","homechart")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var chart = svg.append("g");

  // Append a div to the body to create tooltips, assign it a class
  d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "homestooltip")
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

  var x = d3.scaleTime()
      .range([0, width]);

  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);
  var y = d3.scaleLinear()
      .range([height, 0]);


  var line1 = d3
        .line()
        .x(function(data) {
          return xTimeScale(data.period);
        })
        .y(function(data) {
          return yLinearScale(data.home_value);
        });
  var line2 = d3
        .line()
        .x(function(data) {
          return xTimeScale(data.period);
        })
        .y(function(data) {
          return yLinearScale(data.rental);
        });

  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale)
    .ticks(18)
    .tickFormat(d3.timeFormat("%m-%Y"));

  var leftAxis = d3.axisLeft(yLinearScale)
    .tickFormat(d3.format('$,'));

  // Scale the domain
  xTimeScale.domain(d3.extent(REdata, function(data) {
    return data.period;
  }));
  yLinearScale.domain([yMin, yMax]);

  // Add the line paths.
  // Add the line paths.
  chart.append("path")
      .data([REdata])
      .attr("class", "line green")
      .attr("id","rentline")
      .style("stroke-opacity", 0)
      .attr("d", line2);
  chart.append("path")
      .data([REdata])
      .attr("class", "line blue")
      .attr("id","homeline")
      .style("stroke-opacity", 0.8)
      .attr("d", line1);


  //add the tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0,0])
    .html(function(data) {

      if (currentAxisLabelY === "home_value") {
        var yVal = data.home_value;
        // //////////////////////////////////d3.format('$,')
      }
      else {
        var yVal = data.rental;
      };
      var formatAmount = d3.format('$,');
      yString = formatAmount(yVal);

      var formatPeriod = d3.timeFormat("%m-%Y");
      xString = formatPeriod(data.period);
      return (xString + ": " + yString);
    });

  chart.call(toolTip);

  // create the circles
  chart.selectAll("circle")
    .data(REdata)
    .enter()
      .append("circle")
      .attr("cx", function(data, index) {
        return xTimeScale(data[currentAxisLabelX]);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(+data[currentAxisLabelY]);
      })
      .attr("r", "5")
      .attr("stroke","black")
      //*************************ADD FUNCTION TO FILL SO IT WILL BE GREEN FOR RENT
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
    .attr("class","axis")
    //.call(d3.axisBottom(xTimeScale).ticks(16))
    .call(bottomAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".35em")
        .attr("transform", "rotate(-65)")


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
      .attr("class", "axis-text active blue")
      //default
      .attr("data-axis-name", "home_value")
      .text("Home Prices ($)")

  //append the unselected Y labels
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 1.7))  // make 1.5 smaller to get the axis title to move down a bit
      .attr("dy", "1em")
      .attr("class", "axis-text inactive green")
      .attr("data-axis-name", "rental")
      .text("Monthly Rent ($)")



  // Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 50) + ")") //make 2.5 larger to get title to move left
    .attr("class", "axis-text x-selected")
    //default
    .attr("data-axis-name", "period")
    .text("Home Sales and Rents - 2014-2017")


  //handle the axis change
  function labelChange(clickedAxis) {
    d3.selectAll(".axis-text")
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

      // The onclick events below take place only if the axis is inactive
      // Clicking on an already active axis will therefore do nothing
      if (isClickedSelectionInactive) {
        // Assign the clicked axis to the variable currentAxisLabelY
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
            .attr("cy", function(data, index) {
              return yLinearScale(+data[currentAxisLabelY]);
            })
            .duration(500)

            .attr("fill", function(data,index) {
              if (currentAxisLabelY === "home_value") {
                return "blue";
              }
              else {
                return "green";
              }
            })


        });

        // change the line
        if (clickedAxis === "home_value") {
          d3.select("#homeline").style("stroke-opacity",1);
          d3.select("#rentline").style("stroke-opacity",0);
          console.log("homevalue selected");
        }
        else {
          d3.select("#homeline").style("stroke-opacity",0);
          d3.select("#rentline").style("stroke-opacity",1);
          console.log("rent selected");
        }

        // Change the status of the axes.
        labelChange(clickedSelection);

      }
    });

}
