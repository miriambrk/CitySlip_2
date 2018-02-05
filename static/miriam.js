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

    //poi_pie(data.LAT, data.LON)
    //age_pie(data.ZIP_CODE)
    getData(data.ZIP_CODE)
})};

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
var gaugeMarkerSize = 10;
var mycolorsgauge = ['rgba(0, 255, 0, .5)',
                      'rgba(191, 255, 0, .5)',
                       'rgba(255, 255, 0, .5)',
                      'rgba(255, 128, 0, .5)',
                        'rgba(255, 0, 0, .5)',
                         'rgba(255,255,255,.8)'];

//make responsive/resizable with event listeners for resize; resize the charts proportionally
//Note: the pie chart is in a column of size 5 (out of 12); gauge is size 4 out of 12
// window.addEventListener('resize', function() {
//   var containerWidth = document.getElementById('cont1').clientWidth;
//   var new_width = containerWidth * 5/12;
//
//   var pie_chg_size = {width:new_width, height:new_width};
//   var bubble_chg_size = {width: new_width*2};
//   Plotly.relayout('pie_chart', pie_chg_size);
//   Plotly.relayout('bubble_chart', bubble_chg_size);
//
//   var new_width = containerWidth / 3;
//   //make the marker size for the pointer circle proportional to the new size of the graph
//   var new_marker_size = gaugeMarkerSize * (containerWidth / originalWidth);
//   var gauge_chg_size = {width:new_width, height:new_width};
//   Plotly.restyle('gauge_chart', 'marker', [{size: new_marker_size, color:'orchid'},{colors: mycolorsgauge} ]);
//   Plotly.relayout('gauge_chart', gauge_chg_size);
// });



  // //refresh the charts using the data for the newly selected sample
  // function optionChanged(new_sample) {
  //
  //   new_sample_number = new_sample.slice(3);
  //
  //   //get the metadata and display
  //   Plotly.d3.json("/metadata/"+new_sample_number, function(error, data_meta){
  //       if (error) return console.warn(error);
  //       console.log(data_meta);
  //       build_meta_data(data_meta, new_sample_number);
  //
  //       //update the washing gauge chart
  //       build_gauge_chart(data_meta);
  //   })
  //
  //   //get sample and OTU data for the new_sample
  //   Plotly.d3.json("/samples/"+new_sample_number, function(error, new_data_sample){
  //       if (error) return console.warn(error);
  //
  //       //Set the top 10 values
  //       var new_top_ten_values = [];
  //       var new_top_ten_otu_id = [];
  //       var new_top_ten_otu_desc = [];
  //
  //       for (i=0; i<10; i++) {
  //         //only include if non-zero
  //         if (new_data_sample[0].sample_values[i] > 0) {
  //           new_top_ten_values.push(new_data_sample[0].sample_values[i]);
  //           new_top_ten_otu_id.push(new_data_sample[0].otu_id[i]);
  //           new_top_ten_otu_desc.push(new_data_sample[0].otu_desc[i]);
  //         }
  //       }
  //       //update the pie chart, bubble chart with the new data
  //       updatePlotly(new_top_ten_values, new_top_ten_otu_id, new_top_ten_otu_desc,new_data_sample,new_sample_number);
  //   })
  // }



        // //update the pie chart and the bubble chart after a new data sample has been selected
        // function updatePlotly(new_top_ten_values, new_top_ten_otu_id, new_top_ten_otu_desc,new_data_sample,new_sample_number) {
        //     //update the PIE chart
        //     var PIE = document.getElementById("pie_chart");
        //     Plotly.relayout(PIE, "title", "Top Ten BB_"+ new_sample_number +" Samples");
        //     Plotly.restyle(PIE, "values", [new_top_ten_values]);
        //     Plotly.restyle(PIE, "labels", [new_top_ten_otu_id]);
        //     Plotly.restyle(PIE, "hovertext", [new_top_ten_otu_desc]);
        //
        // }


        //function to create the gauge chart (level is the score, 1-100)
        function build_gauge_chart(zip_data) {


          var level = zip_data[0]['score'];

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




        //function build_meta data
        function build_meta_data(zip_data) {

          var app = document.querySelector("#score-metadata");

            //first need to remove any data that might be there, and then populate it
            //get the H6 data associated with the #meta_list
            var h6data = document.querySelector("#score-metadata > h6");
            if (h6data !== null) {
              for (i=0; i<11; i++) {
                var h6data = document.querySelector("#meta_list > h6");
                app.removeChild(h6data);
              }
            }


            //put the metadata into h6 tags
            var h6data = document.createElement("h6");
            //city, state, zip on first line
            h6data.innerHTML = zip_data[4]['city'] + ", " + zip_data[4]['state'] + " " +zip_data[4]['zip_code'];
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Avg Home Value: $' +  zip_data[4]['recent_sale'].toLocaleString();
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Avg Rent: $' +  zip_data[4]['recent_rent'].toLocaleString();
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Avg Winter Temp (\xB0F): ' +  zip_data[0]['avg_jan'];
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Avg Summer Temp (\xB0F): ' +  zip_data[0]['avg_jul'];
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Schools: Public: ' +  zip_data[0]['public_school'] + ", Private: " + zip_data[0]['private_school'] + zip_data[0]['catholic_school'];
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Crime Rate: ' +  zip_data[0]['crime'];
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Sales Tax: ' +  zip_data[0]['sales_tax'] + "%";
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Market Health Index: ' +  zip_data[0]['market_health_index'] + " (0-10)";
            app.appendChild(h6data);
            var h6data = document.createElement("h6");
            h6data.innerHTML = 'Walkability: ' +  zip_data[0]['walk_description'];
            app.appendChild(h6data);
            var h6data = document.createElement("h6");

            //NEED TO FIX pop_growth once it exists
            h6data.innerHTML = 'Population Growth: ' +  zip_data[3]['pop_growth']+ "%";
            app.appendChild(h6data);
          }







  //get all the initial data
  function getData(zip) {

      console.log("running getData for:" + zip);

      // TEMPorary
      //get RE the data and build the display of the metadata and score
      // Plotly.d3.json("/REdata/"+zip, function(error, zip_data){
      //     build_real_estate_graph(zip_data[0]);
      // })

      //get ALL the data and build the display of the metadata and score
      Plotly.d3.json("/alldata/"+zip, function(error, zip_data){
          if (error) return console.warn(error);
          build_meta_data(zip_data);
          build_real_estate_graph(zip_data[3]);
          build_gauge_chart(zip_data);
      })



  }

  //get all the initial data and build the charts and metadata display
  //getData(zip);
