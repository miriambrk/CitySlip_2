var originalWidth = document.getElementById('cont1').clientWidth;
var gaugeMarkerSize = 20;

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



  //default to the first sample so that data is displayed upon startup
  var zip = "22180";


  var mycolorsgauge = ['rgba(0, 255, 0, .5)',
                        'rgba(191, 255, 0, .5)',
                         'rgba(255, 255, 0, .5)',
                        'rgba(255, 128, 0, .5)',
                          'rgba(255, 0, 0, .5)',
                           'rgba(255,255,255,.8)'];



  //build the dropdown button with the sample IDs
  // function build_dropdown_button(data_names) {
  //   //loop through the data_names
  //   for (i=0; i<data_names.length; i++) {
  //     var optn = document.createElement("OPTION");
  //     var element = document.getElementById("selDataset").options.add(optn);
  //     optn.text = data_names[i];
  //     optn.value = data_names[i];
  //   }
  // }

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


  // //Build the initial pie chart for the input sample
  // function build_pie_chart(data_sample, sample_number) {
  //
  //     //set the top 10 values
  //     var top_ten_values = [];
  //     var top_ten_otu_id = [];
  //     var top_ten_otu_desc = [];
  //
  //     //only include if non-zero
  //     for (i=0; i<10; i++) {
  //       if (data_sample[0].sample_values[i] > 0 ) {
  //         top_ten_values.push(data_sample[0].sample_values[i]);
  //         top_ten_otu_id.push(data_sample[0].otu_id[i]);
  //         top_ten_otu_desc.push(data_sample[0].otu_desc[i]);
  //       }
  //     }
  //
  //     //set the layout and the pie data
  //     var pie_chart_layout = {
  //         title: "Top 10 Samples for BB_"+ sample_number,
  //         height: 600,
  //         width: 600
  //         };
  //     var pie_data = [{
  //         values: top_ten_values,
  //         labels: top_ten_otu_id,
  //         type: "pie",
  //         hovertext: top_ten_otu_desc,
  //         'marker': {'colors': mycolors},
  //     }];
  //
  //     //plot the pie chart
  //     Plotly.plot("pie_chart", pie_data, pie_chart_layout);
  //   }



    // //Build the initial bubble chart for the input sample
    // function build_bubble_chart(data_sample, sample_number) {
    //
    //       var bubble_chart_layout = {
    //           title: "All BB_"+ sample_number +" Samples",
    //           height: 700,
    //           width: 1200,
    //           xaxis: { title: "OTU IDs" },
    //           yaxis: { title: "Sample Values" }
    //           };
    //       var bubble_data = [{
    //           x: data_sample[0].otu_id,
    //           y: data_sample[0].sample_values,
    //           mode: "markers",
    //           marker: {
    //             size: data_sample[0].sample_values,
    //             colorscale: mycolorscale,
    //             color: data_sample[0].otu_id,
    //           },
    //           type: "bubble",
    //           text: data_sample[0].otu_desc,
    //         }];
    //
    //       //plot the bubble chart
    //       Plotly.plot("bubble_chart", bubble_data, bubble_chart_layout);
    //   }

        // //update the pie chart and the bubble chart after a new data sample has been selected
        // function updatePlotly(new_top_ten_values, new_top_ten_otu_id, new_top_ten_otu_desc,new_data_sample,new_sample_number) {
        //     //update the PIE chart
        //     var PIE = document.getElementById("pie_chart");
        //     Plotly.relayout(PIE, "title", "Top Ten BB_"+ new_sample_number +" Samples");
        //     Plotly.restyle(PIE, "values", [new_top_ten_values]);
        //     Plotly.restyle(PIE, "labels", [new_top_ten_otu_id]);
        //     Plotly.restyle(PIE, "hovertext", [new_top_ten_otu_desc]);
        //
        //     //update the Bubble chart
        //     var BUBBLE = document.getElementById("bubble_chart");
        //     Plotly.relayout(BUBBLE, "title", "All BB_"+ new_sample_number +" Samples");
        //     Plotly.restyle(BUBBLE, "x", [new_data_sample[0].otu_id]);
        //     Plotly.restyle(BUBBLE, "y", [new_data_sample[0].sample_values]);
        //     Plotly.restyle(BUBBLE, "text", [new_data_sample[0].otu_desc]);
        //     Plotly.restyle(BUBBLE, "marker.color", [new_data_sample[0].otu_id]);
        // }


        //function to create the gauge chart (level is the score, 1-100)
        //function build_gauge_chart(zip_data) {
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
              title: 'Zip Slip Score for '+zip,
              height: 500,
              width: 500,
              xaxis: {zeroline:false, showticklabels:false,
                         showgrid: false, range: [-1, 1]},
              yaxis: {zeroline:false, showticklabels:false,
                         showgrid: false, range: [-1, 1]}
            };
            Plotly.newPlot('gauge', data, layout);
        }




        // //function build_meta data
        // function build_meta_data(data_meta,sample) {
        //
        //   var app = document.querySelector("#meta_list");
        //
        //     //first need to remove any data that might be there, and then populate it
        //     //get the H6 data associated with the #meta_list
        //     var h6data = document.querySelector("#meta_list > h6");
        //     if (h6data !== null) {
        //       for (i=0; i<6; i++) {
        //         var h6data = document.querySelector("#meta_list > h6");
        //         app.removeChild(h6data);
        //       }
        //     }
        //
        //     //put the metadata into h6 tags
        //     var h6data = document.createElement("h6");
        //     h6data.innerHTML = "SAMPLEID: " + "BB_" + sample;
        //     app.appendChild(h6data);
        //
        //     metalabels = ['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION'];
        //     for (label in metalabels) {
        //       var h6data = document.createElement("h6");
        //       h6data.innerHTML = metalabels[label] + ": " + data_meta[metalabels[label]];
        //       app.appendChild(h6data);
        //     }
        //   }




  //get all the initial data, using the default sample id
  function getData() {

    //*Temp
    var zip = 22180;

      //get real estate data
      Plotly.d3.json("/REdata/"+zip, function(error, REdata){
          if (error) return console.warn(error);
          build_real_estate_graph(REdata);
      })

//********* NEW
      // //get market health and real estate median prices
      // Plotly.d3.json("/markethealth/zip", function(error, markethealth){
      //     if (error) return console.warn(error);
      //     print(markethealth);
      // })
//********* NEW

      //get the metadata and build the display of the metadata and score
      // Plotly.d3.json("/alldata/"+zip, function(error, zip_data){
      //     if (error) return console.warn(error);
      //     build_meta_data(zip_data, zip);
      //     build_gauge_chart(zip_data);
      // })
      build_gauge_chart(zip);


  }

  //get all the initial data and build the charts and metadata display
  getData();
