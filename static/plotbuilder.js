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
        
    poi_pie(data.LAT, data.LON)
    age_pie(data.ZIP_CODE)
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