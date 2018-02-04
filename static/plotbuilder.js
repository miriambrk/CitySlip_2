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
            
            poi_pie(data.LAT, data.LON)
            age_pie(data.ZIP_CODE)
            getData(data.ZIP_CODE)
            zipMap(data.LAT, data.LON) 
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
function poi_pie(lat, lng){
    // call the route with the POI data
    Plotly.d3.json("/POIdata?lat=" + lat + "&lng=" + lng ,function(errr, data){
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
            plot_bgcolor:'rgba(0,0,0,0)'
        };
        
        // plot the chart
        Plotly.newPlot('POI-pie', piedata, layout);
    
})};

function age_pie(zip){
    // call the route with the POI data
    Plotly.d3.json("/community/" + zip, function(errr, data){
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
            plot_bgcolor:'rgba(0,0,0,0)'
        };
        
        // plot the chart
        Plotly.newPlot('age-pie', piedata, layout);
    
})};

var originalWidth = document.getElementById('cont1').clientWidth;
var gaugeMarkerSize = 20;
var mycolorsgauge = ['rgba(0, 255, 0, .5)',
'rgba(191, 255, 0, .5)',
 'rgba(255, 255, 0, .5)',
'rgba(255, 128, 0, .5)',
  'rgba(255, 0, 0, .5)',
   'rgba(0,0,0,0)'];

function build_gauge_chart(zip) {


    //var level = zip_data['score'];

    var level = 85;

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
          text: ['Great','Good', 'Adequate', 'Poor', 'Unacceptable', ''],
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
        paper_bgcolor:'rgba(0,0,0,0)',
        plot_bgcolor:'rgba(0,0,0,0)',
        title: 'Zip Slip Score for '+zip,
        height: 350,
        width: 350,
        xaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]}
      };
      Plotly.newPlot('gauge', data, layout);
  }

  //get all the initial data, using the default sample id
  function getData(zip) {


      //get real estate data
      Plotly.d3.json("/REdata/"+zip, function(error, REdata){
          if (error) return console.warn(error);
          build_real_estate_graph(REdata);
      })

      build_gauge_chart(zip);

  };