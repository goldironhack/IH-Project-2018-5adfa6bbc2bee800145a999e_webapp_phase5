

var URL_POLYGON_ID = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
var URL_NEIGHBORHOOD_NAMES_GIS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
var URL_CRIMES_NY = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
var URL_BUILD_NY = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
var URL_MARKETS = "https://data.cityofnewyork.us/api/views/j8gx-kc43/rows.json?accessType=DOWNLOAD";
var URL_AIR_QUALITY = "https://data.cityofnewyork.us/api/views/c3uy-2p5r/rows.json?accessType=DOWNLOAD";

var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure",
"Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet",
"Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral",
"CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan",
"DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki",
"DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed",
"DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray",
"DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink",
"DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick",
"FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite",
"Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew",
"HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush",
"LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan",
"LightGoldenRodYellow","LightGray","LightGrey","LightGreen",
"LightPink","LightSalmon","LightSeaGreen","LightSkyBlue",
"LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow",
"Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine",
"MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen",
"MediumSlateBlue","MediumSpringGreen","MediumTurquoise",
"MediumVioletRed","MidnightBlue","MintCream","MistyRose",
"Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab",
"Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen",
"PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru",
"Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue",
"SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna",
"Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow",
"SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato",
"Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

var NY_UNIVERSITY_COORDENATES = {lat:40.7290549,lng:-73.9987173};

var directionsService;
var directionsDisplay;
var timeFactor = 0;
var DistrictsAndCoordenate = [];
var distanceToUN = [];
var BoroughAndDistricts = [];
var count = 1;

var BoroughAndAvgAir = [];
var BoroughAndMarkets = [];
var BoroughAndSafety = [];
var BoroughAndAffordability = [];


var DistrictsFull =[];


getDataFromURLS();


function getDataFromURLS(){
	var dataDis = $.get(URL_NEIGHBORHOOD_NAMES_GIS, function(){})
		.done( function(){
				var objDis = JSON.parse(dataDis.responseText);

				for( var i = 0; i < objDis.data.length; i++)
				{
					var district = objDis.data[i][10];
					var sp = objDis.data[i][9].split(" ");
					var latlon = { lat: parseFloat(sp[2].substring(0,sp[2].length - 1)), lng: parseFloat(sp[1].substring(1,sp[1].length)) };
					var obj2 = {
						distric: district,
						point: latlon
					};
					DistrictsAndCoordenate.push(obj2);

					var obj3 = {
						borough : objDis.data[i][16],
						district : district
					}

					BoroughAndDistricts.push(obj3);
				}


				for(var k = 0; k < DistrictsAndCoordenate.length; k++)
				{
					    var p1 = NY_UNIVERSITY_COORDENATES;
                        var p2 = DistrictsAndCoordenate[k].point;
                        try
                        {
                            var p3 = new google.maps.LatLng(parseFloat(p1.lat), parseFloat(p1.lng));
                            var p4 = new google.maps.LatLng(parseFloat(p2.lat), parseFloat(p2.lng));

	                        var jjj = {
	                            distric : DistrictsAndCoordenate[k].distric,
	                            distance : (google.maps.geometry.spherical.computeDistanceBetween(p3, p4) / 1000).toFixed(2)
	                        }
	                        distanceToUN.push(jjj);
                        }
                        catch(err)
                        {
                            console.log(err);
                            if (confirm("Please, refresh page. An error ocurred")) {
                                location.reload();
                            }
                        }
                        
				}
		})
		.fail( function(error){
			console.error(error);
		});

	var dataAir = $.get(URL_AIR_QUALITY, function(){})
		.done( function(){
				var obj = JSON.parse(dataAir.responseText);

				var tmp = [];
				for( var k = 0; k < obj.data.length; k ++){
					if( obj.data[k][12] == "Borough")
					{
							var borough = obj.data[k][14];
							var avgAir = obj.data[k][16];
							var baa = {
								bor : borough,
								air : avgAir
							}
							tmp.push(baa);
					}
				}
				var b1 =0,b2=0,b3=0,b4=0,b5=0,n1=0,n2=0,n3=0,n4=0,n5=0;
				for(var j = 0; j < tmp.length; j++)
				{
					if(tmp[j].bor == "Bronx" ){
						b1 += +tmp[j].air;
						n1++;
					}
					if(tmp[j].bor == "Brooklyn" ){
						b2 += +tmp[j].air;
						n2++;
					}
					if(tmp[j].bor == "Manhattan" ){
						b3 += +tmp[j].air;
						n3++;
					}
					if(tmp[j].bor == "Queens" ){
						b4 += +tmp[j].air;
						n4++;
					}
					if(tmp[j].bor == "Staten Island" ){
						b5 += +tmp[j].air;
						n5++;
					}
				}

				BoroughAndAvgAir.push({ bor:"Bronx", avgAir:(b1/n1).toFixed(2)  });
				BoroughAndAvgAir.push({ bor:"Brooklyn", avgAir: (b2/n2).toFixed(2) });
				BoroughAndAvgAir.push({ bor:"Manhattan", avgAir: (b3/n3).toFixed(2) });
				BoroughAndAvgAir.push({ bor:"Queens", avgAir: (b4/n4).toFixed(2) });
				BoroughAndAvgAir.push({ bor:"Staten Island", avgAir: (b5/n5).toFixed(2) });

		})
		.fail( function(error){
			console.error(error);
		});

		$.ajax({
		url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json",
		type: "GET",
		data: {
			"law_cat_cd" : "FELONY",
			"$limit" : 50000,
		}
	}).done(function(data) {
		
		var bro =[];
		var man = [];
		var que = [];
		var sta = [];
		var broo = [];
		
		for( var idx = 0; idx < 50000; idx++){
		    if(data[idx].boro_nm == "QUEENS" ){
				que.push(data[idx]);
			}
			if(data[idx].boro_nm == "BROOKLYN" ){
				broo.push(data[idx]);
			}
			if(data[idx].boro_nm == "MANHATTAN" ){
			    man.push(data[idx]);
			}
			if(data[idx].boro_nm == "STATEN ISLAND" ){
				sta.push(data[idx]);
			}
			if(data[idx].boro_nm == "BRONX" ){
				bro.push(data[idx]);
			}
		}
	
        BoroughAndSafety.push({ bor:"Bronx", per: (bro.length/500).toFixed(2)  });
        BoroughAndSafety.push({ bor:"Brooklyn", per: (broo.length/500).toFixed(2) } );
        BoroughAndSafety.push({ bor:"Manhattan",per: (man.length/500).toFixed(2) });
        BoroughAndSafety.push({ bor:"Queens", per: (que.length/500).toFixed(2) });
        BoroughAndSafety.push({ bor:"Staten Island", per: (sta.length/500).toFixed(2) });
		
	});

			var dataAfor = $.get(URL_BUILD_NY, function(){})
				.done( function(){
						var obj = JSON.parse(dataAfor.responseText);
						var n1=0,n2=0,n3=0,n4=0,n5=0, n6 = 0;
							for(var k = 0; k < obj.data.length; k++)
							{
							    
								if(obj.data[k][15] == "Bronx" && obj.data[k][28] == "New Construction" ){
									n1++;
									n6++;
								}
								if(obj.data[k][15] == "Brooklyn" && obj.data[k][28] == "New Construction"  ){
									n2++;
									n6++;
								}
								if(obj.data[k][15] == "Manhattan" && obj.data[k][28] == "New Construction"  ){
									n3++;
									n6++;
								}
								if(obj.data[k][15] == "Queens" && obj.data[k][28] == "New Construction"  ){
									n4++;
									n6++;
								}
								if(obj.data[k][15] == "Staten Island"  && obj.data[k][28] == "New Construction" ){
									n5++;
									n6++;
								}
							}
							BoroughAndAffordability.push({ bor:"Bronx", per: (n1/n6).toFixed(2) });
							BoroughAndAffordability.push({ bor:"Brooklyn", per: (n2/n6).toFixed(2) });
							BoroughAndAffordability.push({ bor:"Manhattan", per: (n3/n6).toFixed(2) });
							BoroughAndAffordability.push({ bor:"Queens", per: (n4/n6).toFixed(2) });
							BoroughAndAffordability.push({ bor:"Staten Island", per: (n5/n6).toFixed(2) });

				})
				.fail( function(error){
					console.error(error);
				});

				var dataMarkets = $.get(URL_MARKETS, function(){})
					.done( function(){
							var obj = JSON.parse(dataMarkets.responseText);
							var n1=0,n2=0,n3=0,n4=0,n5=0;
							for(var k = 0; k < obj.data.length; k++)
							{
								if(obj.data[k][11] == "Bronx" ){
									n1++;
								}
								if(obj.data[k][11] == "Brooklyn" ){
									n2++;
								}
								if(obj.data[k][11] == "Manhattan" ){
									n3++;
								}
								if(obj.data[k][11] == "Queens" ){
									n4++;
								}
								if(obj.data[k][11] == "Staten Island" ){
									n5++;
								}
							}

							BoroughAndMarkets.push({ bor:"Bronx", mar: n1 });
							BoroughAndMarkets.push({ bor:"Brooklyn", mar: n2 });
							BoroughAndMarkets.push({ bor:"Manhattan", mar: n3 });
							BoroughAndMarkets.push({ bor:"Queens", mar: n4 });
							BoroughAndMarkets.push({ bor:"Staten Island", mar: n5 });
					})
					.fail( function(error){
						console.error(error);
					});


}


function getRoute( lat ){

    var request ={
      origin: NY_UNIVERSITY_COORDENATES,
      destination: lat,
      travelMode: 'WALKING'
    }
  directionsService.route(request,function(result,status){
    if (status == "OK") {
      directionsDisplay.setDirections(result);
    }
		else {
			alert("try again!");
		}
  })
}

function getLatLong(district){
	for(var i = 0; i < DistrictsAndCoordenate.length; i++){
		if( DistrictsAndCoordenate[i].distric == district)
		{
			return DistrictsAndCoordenate[i].point;
		}
	}
}

function onGoogleMapResponse(){

	map = new google.maps.Map(document.getElementById('googleMapContainer'), {
 		center: {lat: 40.7291, lng: -73.9965},
		zoom: 10
	});
	
	

	directionsDisplay = new google.maps.DirectionsRenderer({
    polylineOptions: {
			strokeColor: "black",
			strokeOpacity: 1,
			strokeWeight: 20,
			fillColor:  "black",
			fillOpacity:1
    }
  });
	directionsDisplay.setMap(map);

	map.data.loadGeoJson(
      URL_POLYGON_ID
	);

	var data = $.get(URL_POLYGON_ID, function(){})
		.done( function(){
			var obj = JSON.parse(data.responseText);
			var polygon = [];

			for( var k = 0; k < obj.features.length; k++ )
			{
				polygon.push(obj.features[k].geometry.coordinates[0]);
			}

			for( var k = 0; k < polygon.length; k++ )
			{
				map.data.setStyle(function() {
						var r = Math.floor((Math.random() * CSS_COLOR_NAMES.length));
						var color = CSS_COLOR_NAMES[r];
						CSS_COLOR_NAMES.splice(r,1);
			    	return {
								strokeColor: "#000000",
								strokeOpacity: 0.8,
								strokeWeight: 1,
								fillColor:  color,
								fillOpacity: 0.50
			    	}

			  });
			}

		var marker = new google.maps.Marker({
    		position: NY_UNIVERSITY_COORDENATES,
    		map: map,
    		title: 'NYU Stern School of Business'
  		});
		})
		.fail( function(error){
			alert("There is a problem with your internet connection. Don't load the map and data. Please, refresh the page.");
		});
}


function export2(){
	var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"));
}

function downloadCSV(csv) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = 'districts.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function filter(){
	var slider1 = $("#slider1").val();
	var slider2 = $("#slider2").val();
	var slider3 = $("#slider3").val();
	var slider4 = $("#slider4").val();
	var slider5 = $("#slider5").val();

	var countNoOne = 0;
	if( slider1 == 1 ){
		countNoOne++;
	}
	if( slider2 == 1 ){
		countNoOne++;
	}
	if( slider3 == 1 ){
		countNoOne++;
	}
	if( slider4 == 1 ){
		countNoOne++;
	}
	if( slider5 == 1 ){
		countNoOne++;
	}
	// top districts
	if( countNoOne == 0 ){
			topDistricts();
	}
	else {
		if( countNoOne == 1 )
		{
			if( slider1 == 1 ){
				DistrictsFull = [];
				for( var i = 0; i < distanceToUN.length; i++ ){
						var mark = getMarkets( distanceToUN[i].distric);
						var airq = getAir( distanceToUN[i].distric);
						var distance = distanceToUN[i].distance;
                        var safety = getSafety(distanceToUN[i].distric);
                        var affordability = getAffordability(distanceToUN[i].distric);
						var ob = {
							no: count,
							dis : distanceToUN[i].distric,
							safety : safety,
							dist : distance,
							aff : affordability,
							mar : mark,
							air : airq,
							percent : distance * slider1 
						}
						DistrictsFull.push(ob);
						count++;
				}
				DistrictsFull.sort(comparePercent);
			}
			if( slider2 == 1 ){
				DistrictsFull = [];
				for( var i = 0; i < distanceToUN.length; i++ ){
						var mark = getMarkets( distanceToUN[i].distric);
						var airq = getAir( distanceToUN[i].distric);
						var distance = distanceToUN[i].distance;
                        var safety = getSafety(distanceToUN[i].distric);
                        var affordability = getAffordability(distanceToUN[i].distric);
						var ob = {
							no: count,
							dis : distanceToUN[i].distric,
							safety : safety,
							dist : distance,
							aff : affordability,
							mar : mark,
							air : airq,
							percent : affordability * slider2
						}
						DistrictsFull.push(ob);
						count++;
				}
				DistrictsFull.sort(compareSafety);
			}
			if( slider3 == 1 ){
				DistrictsFull = [];
				for( var i = 0; i < distanceToUN.length; i++ ){
						var mark = getMarkets( distanceToUN[i].distric);
						var airq = getAir( distanceToUN[i].distric);
						var distance = distanceToUN[i].distance;
                        var safety = getSafety(distanceToUN[i].distric);
                        var affordability = getAffordability(distanceToUN[i].distric);
						var ob = {
							no: count,
							dis : distanceToUN[i].distric,
							safety : safety,
							dist : distance,
							aff : affordability,
							mar : mark,
							air : airq,
							percent : safety * slider3 
							
						}
						DistrictsFull.push(ob);
						count++;
				}
				DistrictsFull.sort(comparePercent);
			}
			if( slider4 == 1 ){
				DistrictsFull = [];
				for( var i = 0; i < distanceToUN.length; i++ ){
						var mark = getMarkets( distanceToUN[i].distric);
						var airq = getAir( distanceToUN[i].distric);
						var distance = distanceToUN[i].distance;
                        var safety = getSafety(distanceToUN[i].distric);
                        var affordability = getAffordability(distanceToUN[i].distric);
						var ob = {
							no: count,
							dis : distanceToUN[i].distric,
							safety : safety,
							dist : distance,
							aff : affordability,
							mar : mark,
							air : airq,
							percent : airq * slider4
						}
						DistrictsFull.push(ob);
						count++;
				}
				DistrictsFull.sort(comparePercent);
			}
			if( slider5 == 1 ){
				DistrictsFull = [];
				for( var i = 0; i < distanceToUN.length; i++ ){
						var mark = getMarkets( distanceToUN[i].distric);
						var airq = getAir( distanceToUN[i].distric);
						var distance = distanceToUN[i].distance;
                        var safety = getSafety(distanceToUN[i].distric);
                        var affordability = getAffordability(distanceToUN[i].distric);
						var ob = {
							no: count,
							dis : distanceToUN[i].distric,
							safety : safety,
							dist : distance,
							aff : affordability,
							mar : mark,
							air : airq,
							percent : mark * slider5
						}
						DistrictsFull.push(ob);
						count++;
				}
				DistrictsFull.sort(compareSafety);
			}
		}
		else {
			DistrictsFull = [];
			for( var i = 0; i < distanceToUN.length; i++ ){
					var mark = getMarkets( distanceToUN[i].distric);
					var airq = getAir( distanceToUN[i].distric);
					var distance = distanceToUN[i].distance;
					var safety = getSafety(distanceToUN[i].distric);
                    var affordability = getAffordability(distanceToUN[i].distric);
                    
					var ob = {
						no: count,
						dis : distanceToUN[i].distric,
						safety : safety,
						dist : distance,
						aff : affordability,
						mar : mark,
						air : airq,
						percent : (safety * slider3 + distance * slider1 + mark * slider5 + airq * slider4 + affordability * slider2)/countNoOne
					}
					DistrictsFull.push(ob);
					count++;
			}
			DistrictsFull.sort(comparePercent);
			}

			$("#mainTableBody tr").remove();
			tableReference = $("#mainTableBody")[0];
			for( var k = 0; k < 10; k++){
				var newRow, no, distric, safety, distance,affordability, markets, air;

			newRow = tableReference.insertRow(tableReference.rows.length);
			no = newRow.insertCell(0);
			distric = newRow.insertCell(1);
			safety = newRow.insertCell(2);
			distance = newRow.insertCell(3);
			affordability = newRow.insertCell(4);
			markets = newRow.insertCell(5);
			air = newRow.insertCell(6);

			no.innerHTML = (k + 1);
			distric.innerHTML = DistrictsFull[k].dis;
			safety.innerHTML = DistrictsFull[k].safety;
			distance.innerHTML = DistrictsFull[k].dist;
			affordability.innerHTML = DistrictsFull[k].aff;;
			markets.innerHTML = DistrictsFull[k].mar;
			air.innerHTML = DistrictsFull[k].air;

			newRow.onclick = function() {
				 var lat=getLatLong(DistrictsFull[k].dis);
				 getRoute(lat);
			};
		}

	}
}

function topDistricts(){

	DistrictsFull = [];
	for( var i = 0; i < distanceToUN.length; i++ ){
			var mark = getMarkets( distanceToUN[i].distric);
			var airq = getAir( distanceToUN[i].distric);
			var distance = distanceToUN[i].distance;
			var safety = getSafety(distanceToUN[i].distric);
			var affordability = getAffordability(distanceToUN[i].distric);
			var ob = {
				no: count,
				dis : distanceToUN[i].distric,
				safety : safety,
				dist : distance,
				aff : affordability,
				mar : mark,
				air : airq,
				percent : (distance + safety + affordability)/3
			}
			DistrictsFull.push(ob);
			count++;
	}
	$("#mainTableBody tr").remove();
	tableReference = $("#mainTableBody")[0];

	DistrictsFull.sort(comparePercent);
	
	console.log(DistrictsFull);

	for( var k = 0; k < 3; k++){
		var newRow, no, distric, safety, distance,affordability, markets, air;

	newRow = tableReference.insertRow(tableReference.rows.length);
	no = newRow.insertCell(0);
	distric = newRow.insertCell(1);
	safety = newRow.insertCell(2);
	distance = newRow.insertCell(3);
	affordability = newRow.insertCell(4);
	markets = newRow.insertCell(5);
	air = newRow.insertCell(6);

	no.innerHTML = (k + 1);
	distric.innerHTML = DistrictsFull[k].dis;
	safety.innerHTML = DistrictsFull[k].safety;
	distance.innerHTML = DistrictsFull[k].dist;
	affordability.innerHTML = DistrictsFull[k].aff;
	markets.innerHTML = DistrictsFull[k].mar;
	air.innerHTML = DistrictsFull[k].air;

	newRow.onclick = function() {
		 var lat=getLatLong(DistrictsFull[k].dis);
		 getRoute(lat);
	};

	}
}

var sliders = document.getElementsByClassName('slider');
    var len = sliders.length;

    for ( var i = 0; i < len; i++ ) {
        var slider = sliders[i];

        slider.addEventListener('change', function() {
            updateValue(this);
        });

        updateValue(slider);
    }

    function updateValue(slider) {
        var id = slider.id;

        if (!id) {
            return;
        }

        var val = document.getElementById(id + '_value');

        if (val) {
            val.innerHTML = slider.value; // And update it!
        }
    }

		function compare(a,b) {
  		if (a.distance < b.distance)
    		return -1;
  		if (a.distance > b.distance)
    		return 1;
  		return 0;
		}

		function comparePercent(a,b) {
  		if (a.percent < b.percent )
    		return -1;
  		if (a.percent > b.percent)
    		return 1;
  		return 0;
		}

		function compareSafety(a,b) {
  		if (a.percent < b.percent )
    		return 1;
  		if (a.percent > b.percent)
    		return -1;
  		return 0;
		}

		function updateChart()
		{
			distanceToUN.sort(compare);
			var data = [];
			if( distanceToUN.length > 0)
			{
				for( var i = 0; i < 10; i++ )
					data.push(distanceToUN[i]);
			}

			if( data.length == 0 )
			{
				alert("There aren't elemnts to make a chart!")
			}
			else {
				d3.selectAll("svg > *").remove();
				var margin = {top:0, right:0, bottom:20, left:50},
	    width  = 1000,
	    height = 270;

			var svg = d3.select("#statesChart")
	    .append("svg")
	    .attr("width", "100%")
	    .attr("height", "90%")
	    .attr("viewBox", "0 0 " + width + " " + height);

			var yScale = d3.scale.linear()
	    .range([height - margin.top - margin.bottom, 0]);

			var xScale = d3.scale.ordinal()
	    .rangeRoundBands([0, width - margin.right - margin.left], .1);

			var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");

			var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");

		svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Distance(km)");

			yScale.domain([0, d3.max(data, function(d){ return + d.distance; })]);


			xScale.domain(data.map(function(d){ return d.distric; }));

			svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .selectAll(".bar")
	    .data(data)
	    .enter()
	    .append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d){ return xScale(d.distric); })
	    .attr("y", function(d){ return yScale(+d.distance); })
	    .attr("height", function(d){ return height - margin.top - margin.bottom - yScale(d.distance); })
	    .attr("width", function(d){ return xScale.rangeBand(); });

	svg.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .call(yAxis);

svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
	    .call(xAxis);

	var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left")
	    .tickFormat(d3.format("$,"));
			}

			svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll(".textlabel")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "textlabel")
    .attr("x", function(d){ return xScale(d.distric) + (xScale.rangeBand()/2); })
    .attr("y", function(d){ return yScale(d.distance) - 3; })
    .text(function(d){ return d.distance; });

		}

		function getBorough(district){
			for( var i = 0; i < BoroughAndDistricts.length; i++){
				if( BoroughAndDistricts[i].district == district){
					return BoroughAndDistricts[i].borough;
				}
			}
		}

		function getAir(district){
			for( var i = 0; i < BoroughAndAvgAir.length; i++){
				if( BoroughAndAvgAir[i].bor == getBorough(district)){
					return BoroughAndAvgAir[i].avgAir;
				}
			}
		}

		function getMarkets(district){
			for( var i = 0; i < BoroughAndMarkets.length; i++){
				if( BoroughAndMarkets[i].bor == getBorough(district)){
					return BoroughAndMarkets[i].mar;
				}
			}
		}
		
		function getSafety(district){
			for( var i = 0; i < BoroughAndSafety.length; i++){
				if( BoroughAndSafety[i].bor == getBorough(district)){
					return BoroughAndSafety[i].per;
				}
			}
		}
		
		function getAffordability(district){
			for( var i = 0; i < BoroughAndAffordability.length; i++){
				if( BoroughAndAffordability[i].bor == getBorough(district)){
					return BoroughAndAffordability[i].per;
				}
			}
		}



$(document).ready( function(){
	$("#updateChartButton").on("click", topDistricts);
	$("#export").on("click", export2);
	$("#filters").on("click", filter);
	$("#chart").on("click", updateChart);
})
