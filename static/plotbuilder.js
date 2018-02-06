// begin running the zipcode on entry of a code by the user
d3.select("#zip_button")
        .on("click", function(d,i) {
            // convert the code to an interger
            code = parseInt(document.getElementById("zip_code").value)
            console.log(code)
            checkzip(code)
        });

// check the zip code to make sure it is valid, place popup for invalid zips
// return lat/lon/city/county to the other functions when zip code is valid
function checkzip(code) {
    Plotly.d3.json("/zip_latlng/" + code, function(errr, data){
        
        if (Object.keys(data).length < 3){
            console.log("empty")
            var zipCode = prompt("Sorry, there is no data for that zipcode, please enter another");
            checkzip(zipCode)
        }
        else{
            Plotly.d3.json("/alldata/" + code, function(err, allData){
                poi_pie(allData[1], code);
                age_pie(allData[0], code, data.LAT, data.LON);
                build_gauge_chart(allData);
                build_real_estate_graph(allData[3]);
               
            })
                
        }   
    
})};

function zipMap(lat, lng){
    var myMap = L.map("map", {
        center: [lat, lng],
        zoom: 13,
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYmxhc2VyMjIiLCJhIjoiY2pjc2F3NXBmMHBzNjJxbnE2MjkzZWhmOCJ9.PGCeud8Kd0hTJ4Eh-w6nFg").addTo(myMap);

    var marker = L.marker([lat, lng], {
        draggable: true
    }).addTo(myMap);
};


// POI pie plot taking lat/lng from checkzip funciton
function poi_pie(data, zip){
    
        // create the total number of places of interest and the percentages, place in pie values list
        console.log(data)
        var poi_total = data.Liquorstore + data.Gym + data.Park + data.Shoppingmall + data.Groceryorsupermarket + data.Movietheater;
        var ls_pct = (data.Liquorstore/poi_total) * 100;
        var gym_pct = (data.Gym/poi_total) * 100;
        var park_pct = (data.Park/poi_total) * 100;
        var sm_pct = (data.Shoppingmall/poi_total) * 100;
        var gos_pct = (data.Groceryorsupermarket/poi_total) * 100;
        var mt_pct = (data.Movietheater/poi_total) * 100;
        var pie_values = [ls_pct, gym_pct, park_pct, sm_pct, gos_pct, mt_pct];

        console.log(pie_values);

        // place the individual totals for hover text
        var ind_totals = [data.Liquorstore, data.Gym, data.Park, data.Shoppingmall, data.Groceryorsupermarket, data.Movietheater];
        console.log(ind_totals);

        // create the pie labels
        var pie_labels = ["Liquor Stores", "Gyms", "Parks", "Shopping Malls", "Grocery Stores", "Movie Theaters"];

        // create the hovertext using ind totals and pie labels
        var poi_desc = [];
        for (p=0; p < ind_totals.length; p++){
            poi_desc.push(pie_labels[p] + ": " + ind_totals[p]);
        }
        console.log(poi_desc);
        // create the data part of the pie chart
        var piedata = [{
            values: pie_values,
            labels: pie_labels,
            type:"pie",
            hoverinfo: "text",
            hovertext: poi_desc
        }];
        
        // create the layout of the chart
        var layout = {
            height: 400,
            width: 500,
            paper_bgcolor:'rgba(0,0,0,0)',
            plot_bgcolor:'rgba(0,0,0,0)',
            title: 'POI Breakdown for '+zip,
        };
        
        // plot the chart
        Plotly.newPlot('POI-pie', piedata, layout);
        
};

function age_pie(data, zip, lat, lng){
    // call the route with the POI data
    
        // create the total number of places of interest and the percentages, place in pie values list
        console.log(data)
        var age_total = data._0_09 + data._10_19 + data._20_29 + data._30_39 + data._40_49 + data._50_59 + data._60_69 + data._70_plus;
        var _0_09_pct = (data._0_09/age_total) * 100;
        var _10_19_pct = (data._10_19/age_total) * 100;
        var _20_29_pct = (data._20_29/age_total) * 100;
        var _30_39_pct = (data._30_39/age_total) * 100;
        var _40_49_pct = (data._40_49/age_total) * 100;
        var _50_59_pct = (data._50_59/age_total) * 100;
        var _60_69_pct = (data._60_69/age_total) * 100;
        var _70_plus_pct = (data._70_plus/age_total) * 100;

        var pie_values = [_0_09_pct,_10_19_pct, _20_29_pct, _30_39_pct, _40_49_pct, _50_59_pct, _60_69_pct, _70_plus_pct];

        console.log(pie_values);

        // place the individual totals for hover text
        var ind_totals = [data._0_09, data._10_19, data._20_29, data._30_39, data._40_49, data._50_59, data._60_69, data._70_plus];
        console.log(ind_totals);

        // create the pie labels
        var pie_labels = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70+"];

        // create the hovertext using ind totals and pie labels
        var age_desc = [];
        for (a=0; a < ind_totals.length; a++){
            age_desc.push(pie_labels[a] + ": " + ind_totals[a]);
        }
        console.log(age_desc);
        // create the data part of the pie chart
        var piedata = [{
            values: pie_values,
            labels: pie_labels,
            type:"pie",
            hoverinfo: "text",
            hovertext: age_desc
        }];
        
        // create the layout of the chart
        var layout = {
            height: 400,
            width: 500,
            paper_bgcolor:'rgba(0,0,0,0)',
            plot_bgcolor:'rgba(0,0,0,0)',
            title: 'Age Demographics for '+zip,
        };
        
        // plot the chart
        Plotly.newPlot('age-pie', piedata, layout);
        zipMap(lat,lng)
};

var originalWidth = document.getElementById('cont1').clientWidth;
var gaugeMarkerSize = 10;
var mycolorsgauge = ['rgba(0, 255, 0, .5)',
                      'rgba(191, 255, 0, .5)',
                       'rgba(255, 255, 0, .5)',
                      'rgba(255, 128, 0, .5)',
                        'rgba(255, 0, 0, .5)',
                         'rgba(0,0,0,0)'];

function build_gauge_chart(zip_data) {


//var level = zip_data[0]['score'] * 100;
var level = zip_data[0]['score'].toPrecision(2) * 100;

console.log("level score: " + level);

// Trig to calc meter point
    var deg = degrees = ((level*180)/100);
    var degrees = 180-deg,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);


    // Path:
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
        x: [0], y:[0],
        marker: {size: gaugeMarkerSize, color:'black'},
        showlegend: false,
        name: 'score',
        text: level,
        hoverinfo: 'text'},
        { values: [40/5, 40/5, 40/5, 40/5, 40/5, 40],
        rotation: 90,
        text: ['Great','Good', 'Adequate', 'Poor', 'Awful', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors: mycolorsgauge},
        labels: ['80-100','60-80', '40-60', '20-40', '0-20', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: 'black',
        line: {
            color: 'black'
        }
        }],
    title: 'Zip Slip Score for '+zip_data[4]['zip_code'],
    height: 350,
    width: 350,
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('gauge', data, layout);
}

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
  
