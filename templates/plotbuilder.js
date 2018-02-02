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
    Plotly.d3.json("/zip", function(errr, data){
        
    
})};

// POI pie plot taking lat/lng from checkzip funciton
function poi_pie(lat, lng){
    // call the route with the POI data
    Plotly.d3.json("/POIdata/" + lat + "/" + lng, function(errr, data){
        // create the total number of places of interest and the percentages, place in pie values list
        var poi_total = data.liquor_store + data.gym + data.park + data.shopping_mall + data.grocery_or_supermarket + data.movie_theater;
        var ls_pct = (data.liquor_store/poi_total) * 100;
        var gym_pct = (data.gym/poi_total) * 100;
        var park_pct = (data.park/poi_total) * 100;
        var sm_pct = (data.shopping_mall/poi_total) * 100;
        var gos_pct = (data.grocery_or_supermarket/poi_total) * 100;
        var mt_pct = (data.movie_theater/poi_total) * 100;
        var pie_values = [ls_pct, gym_pct, park_pct, sm_pct, gos_pct, mt_pct];

        console.log(pie_values);

        // place the individual totals for hover text
        var ind_totals = [data.liquor_store, data.gym, data.park, data.shopping_mall, data.grocery_or_supermarket, data.movie_theater];
        console.log(ind_totals);

        // create the pie labels
        var pie_labels = ["Liquor Stores", "Gyms", "Parks", "Shopping Malls", "Grocery Stores", "Movie Theaters"];

        // create the hovertext using ind totals and pie labels
        var poi_desc = [];
        for (p=0; p < ind_totals.length; p++){
            poi_desc.push(pie_labels[p] + ": " + ind_totals[p]);
        }

        // create the data part of the pie chart
        var piedata = [{
            values: pie_values,
            labels: pie_labels,
            type:"pie",
            hovertext: poi_desc
        }];
        
        // create the layout of the chart
        var layout = {
            height: 400,
            width: 500
        };
        
        // plot the chart
        Plotly.newPlot('POI-pie', piedata, layout);
    
})};