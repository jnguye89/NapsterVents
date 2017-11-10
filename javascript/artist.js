// Global Variables
var artist;
var genreList = [];
var artistNameIn;
var artistName;
var zipCodeIn;
var tmRootQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json";
var tmQueryURL = "";
var tmApiKey = "Q60tg8AuoiJG7UpD8Lk2jUH1vutlxRd0";
var gmLatitude;
var gmLongitude;
var savedEvent = false;
var tmEventDate = "";
var tmEventHTML = "";

//---------------------------
// Click event listeners

// Get form value and run artistInfo function on form submit
$("#nav-submit").on("click", function(event) {

	event.preventDefault();

	// Get artist NAME from user
    artistNameIn = $("#artist-name").val().trim();
    zipCodeIn = $("#zip-code").val().trim();

    //Clear name and zip fields
    $("#artist-name").val('');
    $("#zip-code").val('');

   	if (artistNameIn != ""){
	artistInfo(artistNameIn);
	}
	else {
		$("#artist-heading").html("<h2>No artist selected.</h2>");
    	$("#artist-pic").html("<img id='artist-picture' class='img-responsive' src='images/napster.gif'>");
    	$("#artist-button").empty();
    	$("#artist-info").empty();
    	artistName = "";
    	if (zipCodeIn !== "") {
    		geoCodeAddress();
    	}
    }

	$("#event-info").empty();
	
	gmLatitude = "";
	gmLongitude = "";

});


// Get form value and run artistInfo function on favorite click
$("#artist-fav").on("click", ".fav-artist-button", function(event) {

   	var aName = event.currentTarget.attributes[1].value;

	artistInfo(aName);

	zipCodeIn = "";
	gmLatitude = "";
	gmLongitude = "";

	getTicketmasterInfo(aName);

});




// Add an on-click event listener for the Search button	
// $("#nav-submit").on("click", function(event) {

	// artistNameIn = $("#artist-name").val().trim();
	// zipCodeIn = $("#zip-code").val().trim();

// 	getTicketmasterInfo();
// 	console.log("tmEvents: ", tmEvents);
// })


$("#event-fav").on("click", ".fav-event-button", function(event) {

	var eventArtist = event.currentTarget.attributes[3].nodeValue

	if (eventArtist != ""){
	artistInfo(eventArtist);
	}
	else {
		$("#artist-heading").html("<h2>No artist selected.</h2>");
    	$("#artist-pic").html("<img id='artist-picture' class='img-responsive' src='images/napster.gif'>");
    	$("#artist-button").empty();
    	$("#artist-info").empty();
	}

	displaySavedEvent(event);
})




//------------------------------------------------------------------------------------------------------------------------
// Start Napster Functions

// Function to display artist info
function artistInfo(artist) {

    // Clear old data from artist info divs
    $("#artist-pic").empty();
    $("#artist-info").empty();

    var artistEncoded = encodeURIComponent(artist);
    console.log(artistEncoded);

    // Send API query to Napster
	var queryURL = "https://api.napster.com/v2.2/search?apikey=YTk0ODZlZTktNjIxMy00ZWQ1LTgwYzQtMDk5NmVjYjBlY2Vm&query="+artistEncoded+"&type=artist";
	console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
    	
    	console.log(response);
    	
    	if (response.search.data.artists.length < 1){
    		$("#artist-heading").html("<h2>Sorry, we could not find information on that artist.</h2>");
    		$("#artist-pic").html("<img id='artist-picture' class='img-responsive' src='images/napster.gif'>");
    		artistName = "";
    	}
    	else{
    		artistName = response.search.data.artists[0].name;
    		console.log("artistInfo() artistName: ", artistName); //********************************JS********************
  			$("#artist-heading").html("<h2>"+artistName);
  			$("#artist-button").html("<button class='btn btn-success btn-block' type='button' data-artist = '"+artistName+"' id='artist-submit'>Make Favorite &nbsp;&nbsp;<span class='glyphicon glyphicon-heart-empty'></span></button>");
    	  	favoriteArtistButton(); 


      	

      	// Display list of artist BLURBS
      	var blurb = response.search.data.artists[0].blurbs;

      	var uList = $("<ul>");

      	for (var i = 0; i < blurb.length; i++) {
      		uList.append("<li>"+blurb[i]);
      	}

      	$("#artist-info").append(uList);


	    

      	// Do second ajax query to pull artist GENRES
      	var genre = response.search.data.artists[0].links.genres.href;
      	var queryURL = genre+"?apikey=YTk0ODZlZTktNjIxMy00ZWQ1LTgwYzQtMDk5NmVjYjBlY2Vm";

	    $.ajax({
	      url: queryURL,
	      method: "GET"
	    }).done(function(response) {		      
	    	$("#artist-info").append("<h4>"+"Genres: ");

	    	var uList = $("<ul>");

	      	for (var i = 0; i < response.genres.length; i++) {
	      	uList.append("<li>"+response.genres[i].name);		      
	      	}

	      	$("#artist-info").append(uList);
    	});

    	// Do third API query to pull down an artist photo
    	var image = response.search.data.artists[0].links.images.href

		var queryURL = image + "?apikey=ZWZlOGIzZWQtMmJjYi00MDVkLWJjYmItNzhhNDAyM2IxMDU3";

		$.ajax({
		url: queryURL,
		method: "GET"
		  }).done(function(response) {

		  	if (response.images.length < 1){
    		$("#artist-pic").html("<img id='artist-picture' class='img-responsive' src='images/napster.gif'>");
    		}
    		else{


		    var image = response.images[0].url

		    var artistImage = $("<img>");


		    artistImage.attr("src", image);

		    artistImage.addClass("img-responsive img-rounded");

		      
		    $("#artist-pic").html(artistImage);

			}
		     
		  });

		}

  if (artistName === "" && zipCodeIn === "") {
  	return;
  	}
  	else {
  		if (zipCodeIn === "") {
  			getTicketmasterInfo();
  		}
  		else {
  			geoCodeAddress();
  		}
  	}

  	});

}


//--------------------------------------------------------------------------------------------------------
// Start Ticketmaster Functions


// Get the latitude and longitude for the zip code.
// The latitude and longitude is used in the Ticketmaster AJAX call.
function geoCodeAddress() {

	var geoCodeStatus;
	var geoCodeResults;
  var geoCoder = new google.maps.Geocoder();

  geoCoder.geocode(
  	{'address': zipCodeIn}, function(geoCodeResults, geoCodeStatus) {

    if (geoCodeStatus === 'OK') {
    	if (geoCodeResults.length > 0) {
      gmLatitude = geoCodeResults[0].geometry.viewport.f.f;
      gmLongitude = geoCodeResults[0].geometry.viewport.b.b;
      getTicketmasterInfo();
    	}
    }
    else {
      console.log('Geocode was not successful for the following reason: ' + geoCodeStatus);
    }
  });
}

// Get the music events from Ticketmaster
function getTicketmasterInfo() {

	if (gmLatitude === undefined) {
		console.log("getTicketmasterInfo() gmLatitude is undefined: ", gmLatitude);
		return;
	}

 	savedEvent = false;

	// The query URL for the AJAX call to Ticketmaster.
	// The results are sorted by event date.
	if (gmLatitude === "" && gmLongitude === "") {
		tmQueryURL = tmRootQueryURL	+ "?keyword=" + artistName
																// + "&postalCode=" + zipCodeIn
														   	+ "&sort=date,asc"
													 	   	+ "&classificationName=music"
																+ "&apikey=" + tmApiKey;
	}
	else {

		tmQueryURL = tmRootQueryURL	+ "?keyword=" + artistName
																+ "&radius=50"
																+ "&latlong=" + gmLatitude + "," + gmLongitude
													   		+ "&sort=date,asc"
												 	   		+ "&classificationName=music"
																+ "&apikey=" + tmApiKey;
	}

	$.ajax(
	{
	  type:"GET",
	  url: tmQueryURL,
	  async:true,
	  dataType: "json",
	  success: function(json) {

	  	// Check if music events were returned
	  	if (json.page.totalElements === 0) {
	  		displayNoEvents();
	  	}
		  else {
	  		displayEvents(json);
	  		favoriteEventButton();
	  	}
	           },
	  error: function(xhr, status, err) {
	              console.log("Ticketmaster AJAX Error!", err);
	           }
	});	
}

// Display the Ticketmaster music event information
function displayEvents(tmEvents) {

	var i = 0;
	var tmEventState = "";
	var currentDate = moment();
	var tmEventDate;
	var hasMusicEvent = false;

	$("#event-info").empty();

	tmEventHTML  = "<h2 class='panel-heading'>Ticketmaster Music Events</h2>";
	tmEventHTML += "<table class='table'>";
	tmEventHTML += "<thead>";
	tmEventHTML += "<tr>"
	tmEventHTML += "<th>Artist Name</th>";
	tmEventHTML += "<th>Venue</th>";
	tmEventHTML += "<th>Location</th>";
	tmEventHTML += "<th>Date</th>";
	tmEventHTML += "<th></th>";
	tmEventHTML += "<th></th>";
	tmEventHTML += "</tr>";
	tmEventHTML += "</thead>";
	tmEventHTML += "<tbody id='event-schedule'>";

	for (i = 0; i < tmEvents._embedded.events.length; i++) {

		tmEventDate = moment(tmEvents._embedded.events[i].dates.start.localDate);

		// Don't display music events in the past
		if ((tmEventDate).isBefore(currentDate, 'day')) {
			continue;
		}
		else {
			hasMusicEvent = true;
		}

		// Music events outside the US don't have a state code property.
		// In those cases use the country code in place of the state code.
		if (tmEvents._embedded.events[i]._embedded.venues[0].country.countryCode === "US") {
			tmEventState = tmEvents._embedded.events[i]._embedded.venues[0].state.stateCode;
		}
		else {
			tmEventState = tmEvents._embedded.events[i]._embedded.venues[0].country.countryCode;
		}

		// Build the HTML to display the Ticketmaster music event information
		tmEventHTML += "<tr>";
		tmEventHTML += "<td>" + tmEvents._embedded.events[i].name + "</td>";
		tmEventHTML += "<td>" + tmEvents._embedded.events[i]._embedded.venues[0].name + "</td>";
		tmEventHTML	+= "<td>" + tmEvents._embedded.events[i]._embedded.venues[0].city.name + ", " + tmEventState + "</td>";
		tmEventHTML += "<td>" + moment(tmEvents._embedded.events[i].dates.start.localDate).format("MMMM Do YYYY") + "</td>";
		tmEventHTML	+= "<td><a href=" + tmEvents._embedded.events[i].url + " target=_blank>Tickets</a></td>";
		
		if (!savedEvent) {
			tmEventHTML += "<td><button type='button' class='btn btn-primary btn-block save-event-submit' data-toggle='tooltip' title='Save This Music Event' data-artist-name='" + artistName + "'" + "data-event-artist='" + tmEvents._embedded.events[i].name + "' data-event-id='" + tmEvents._embedded.events[i].id + "'><span class='glyphicon glyphicon-heart-empty'></span></button></td>";
			// tmEventHTML += "<td><button type='button' class='btn btn-primary btn-block save-event-submit' data-toggle='tooltip' title='Save This Event' data-artist-name='" + artistNameIn + "'" + "data-event-artist='" + tmEvents._embedded.events[i].name + "' data-event-id='" + tmEvents._embedded.events[i].id + "'><span class='glyphicon glyphicon-heart-empty'></span></button></td>";
		}

		tmEventHTML	+= "</tr>";
	}

	tmEventHTML += "</tbody>";
	tmEventHTML += "</table>";

	// Add the Ticketmaster music event information to the web page HTML
	$("#event-info").append(tmEventHTML);

	if (!hasMusicEvent) {
		displayNoEvents();
	}

}

// No music event information was returned from Ticketmaster.
function displayNoEvents() {

	$("#event-info").empty();

	tmEventHTML  = "<h2 class='panel-heading'>Ticketmaster Music Events</h2>";
	tmEventHTML += "<table class='table'>";
	tmEventHTML += "<tbody id='event-schedule'>";
	tmEventHTML += "<tr>";

	if (artistName === "") {
		tmEventHTML += "<td>There are no music events in Zip Code " + zipCodeIn + " within 50 miles</td>";
	}
	else {
		if (zipCodeIn === "") {
			tmEventHTML += "<td>There are no music events for " + artistName + "</td>";
		}
		else {
			tmEventHTML += "<td>There are no music events for " + artistName + " in Zip Code " + zipCodeIn + " within 50 miles</td>";
		}
	}

	tmEventHTML += "</tr>";
	tmEventHTML += "</tbody>";
	tmEventHTML += "</table>";

	// Add the HTML to the web page
	$("#event-info").append(tmEventHTML);
}


// Display the favorite music event info
function displaySavedEvent(event) {

 	savedEvent = true;

	tmQueryURL = tmRootQueryURL + "?id=" + event.currentTarget.attributes[2].nodeValue
															+ "&apikey=" + tmApiKey;

	$.ajax(
	{
	  type:"GET",
	  url: tmQueryURL,
	  async:true,
	  dataType: "json",
	  success: function(json) {

	  	// Check if music events were returned
	  	if (json.page.totalElements === 0) {
	  		savedEventUnavailable(event);
	  	}
		  else {
	  		displayEvents(json);
	  	}
	           },
	  error: function(xhr, status, err) {
	              console.log("Ticketmaster AJAX Error!", err);
	           }
	});	
}


// Display a message if the favorite music event has already happened
function savedEventUnavailable(event) {

	$("#event-info").empty();

	tmEventHTML =  "<div class='panel-heading'>";
  tmEventHTML += "<h2 class='panel-title'>Ticketmaster Music Events</h2>";
  tmEventHTML += "</div>";
	tmEventHTML += "<table class='table'>";
	tmEventHTML += "<tbody id='event-schedule'>";
	tmEventHTML += "<tr>";

	tmEventHTML += "<td>The " + event.currentTarget.attributes[1].nodeValue + " music event has started or has already happened so ticket sales have stopped";

	tmEventHTML += "</tr>";
	tmEventHTML += "</tbody>";
	tmEventHTML += "</table>";

	// Add the HTML to the web page
	$("#event-info").append(tmEventHTML);
}

// End Ticketmaster
