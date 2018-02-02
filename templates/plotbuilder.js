d3.select("#zip_button")
        .on("click", function(d,i) {
            code = parseInt(document.getElementById("zip_code").value)
            console.log(code)
            checkzip(code)
        });
        
function checkzip(code) {
    Plotly.d3.json("/zip", function(errr, data){
        
    
})};

function poi_pie(lat, lng){
    Plotly.d3.json("/POIdata/" + lat + "/" + lng, function(errr, data){
        
    
})};