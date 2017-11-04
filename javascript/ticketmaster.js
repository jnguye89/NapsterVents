// Author: James Scott


var artistNameIn;
var zipCodeIn;
var tmRootQueryURL = "https://app.ticketmaster.com/discovery/v2/";
var tmApiKey = "Q60tg8AuoiJG7UpD8Lk2jUH1vutlxRd0";
var tmEventIDs = [];
var tmEventHTML = "";

$( document ).ready(function() {
  
	// Add an on-click event listener for the Search button	
	$("#nav-submit").on("click", function(event) {


		// Remove all elements from the event id array
		tmEventIDs.splice(0, tmEventIDs.length);

		artistNameIn = $("#artist-name").val().trim();
		zipCodeIn = $("#zip-code").val().trim();

		// Either the artist name or zip code must be entered
		if (artistNameIn !== "" || zipCodeIn !== "") {
			tmEvents = getTicketmasterInfo();
		}
	})
})

// Get the music events from Ticketmaster
function getTicketmasterInfo() {

	// console.log("artistNameIn: ", artistNameIn);
	// console.log("zipCodeIn: ", zipCodeIn);
	
	// The query URL for the AJAX call to Ticketmaster.
	// The results are sorted by event date
	tmQueryURL = tmRootQueryURL + "events.json?apikey=" + tmApiKey
															+ "&source=ticketmaster"
															// + "&size=5"
											 	   		+ "&classificationName=music"
												   		+ "&sort=date,asc"
												   		+ "&keyword=" + artistNameIn
												   		+ "&postalCode=" + zipCodeIn;

	$.ajax(
	{
	  type:"GET",
	  url: tmQueryURL,
	  async:true,
	  dataType: "json",
	  success: function(json) {

	  	// console.log("json.page.totalElements: ", json.page.totalElements);
	  	console.log("JSON Returned From Tickmaster AJAX Call: ", json);

	  	// Check if music events were returned
	  	if (json.page.totalElements === 0) {
	  		displayNoEvents();
	  	}
		  else {
	  		displayEvents(json);
	  	}
	           },
	  error: function(xhr, status, err) {
	              console.log("Ticketmaster AJAX Error!");
	           }
	});	
}

// Display the Ticketmaster music event information
function displayEvents(tmEvents) {

	var i = 0;
	var eventOnSale = 0;
	var tmEventState = "";

	$(".table").empty();

	tmEventHTML = "<table class='table'>";
	tmEventHTML += "<thead>";
	tmEventHTML += "<tr>"
	tmEventHTML += "<th>Artist Name</th>";
	tmEventHTML += "<th>Venue</th>";
	tmEventHTML += "<th>Location</th>";
	tmEventHTML += "<th>Date</th>";
	tmEventHTML += "<th>More Information</th>";
	tmEventHTML += "<th></th>";
	tmEventHTML += "</tr>";
	tmEventHTML += "</thead>";
	tmEventHTML += "<tbody id='event-schedule'>";

	for (i = 0; i < tmEvents._embedded.events.length; i++) {

		// console.log("Event On Sale: ", tmEvents._embedded.events[i].dates.status.code);

		// Only display music events that have tickets for sale
		if (tmEvents._embedded.events[i].dates.status.code === "onsale") {
			// console.log("Event Artist Name: ", tmEvents._embedded.events[i].name);
			// console.log("Event Date: ", tmEvents._embedded.events[i].dates.start.localDate);
			// console.log("Event Venue: ", tmEvents._embedded.events[i]._embedded.venues[0].name);
			// console.log("Event City: ", tmEvents._embedded.events[i]._embedded.venues[0].city.name);
			// console.log("Event Country: ", tmEvents._embedded.events[i]._embedded.venues[0].country.countryCode);

			if (tmEvents._embedded.events[i]._embedded.venues[0].country.countryCode === "US") {
				tmEventState = tmEvents._embedded.events[i]._embedded.venues[0].state.stateCode;
			}
			else {
				tmEventState = tmEvents._embedded.events[i]._embedded.venues[0].country.countryCode;
			}
			// console.log("tmEventState: ", tmEventState);

			// console.log("Event ID: ", tmEvents._embedded.events[i].id);
			tmEventIDs[eventOnSale] = tmEvents._embedded.events[i].id;

			eventOnSale ++;

			// console.log("Event URL: ", tmEvents._embedded.events[i].url);

			// Build the HTML to display the Ticketmaster music event information
			tmEventHTML += "<tr>";
			tmEventHTML += "<td>" + tmEvents._embedded.events[i].name + "</td>";
			tmEventHTML += "<td>" + tmEvents._embedded.events[i]._embedded.venues[0].name + "</td>";
			tmEventHTML	+= "<td>" + tmEvents._embedded.events[i]._embedded.venues[0].city.name + ", " + tmEventState + "</td>";
			tmEventHTML	+= "<td>" + tmEvents._embedded.events[i].dates.start.localDate + "</td>";
			tmEventHTML	+= "<td><a href=" + tmEvents._embedded.events[i].url + " target=_blank>Ticketmaster Info</a></td>";
			tmEventHTML += "<td><button type='submit' class='btn btn-default' id='save-event-submit' onclick='saveEvent()'>Save Event</button></td>";
			tmEventHTML	+= "</tr>";
		}
	}

	console.log("tmEventIDs: ", tmEventIDs);

	tmEventHTML += "</tbody>";
	tmEventHTML += "</table>";

	// Add the Ticketmaster music event information to the web page HTML
	$("#event-info").append(tmEventHTML);
}

// No music event information was returned from Ticketmaster.
// Display a message on the web page that no music events exist.
function displayNoEvents() {
	
	$(".table").empty();

	tmEventHTML = "<table class='table'>";
	tmEventHTML += "<thead>";
	tmEventHTML += "<tr>"
	tmEventHTML += "<th>Artist Name</th>";
	tmEventHTML += "<th>Venue</th>";
	tmEventHTML += "<th>Date</th>";
	tmEventHTML += "<th>More Information</th>";
	tmEventHTML += "</tr>";
	tmEventHTML += "</thead>";
	tmEventHTML += "<tbody id='event-schedule'>";
	tmEventHTML += "<tr>";

	if (artistNameIn === "") {
		tmEventHTML += "<td>There are no music events in Zip Code " + zipCodeIn + "</td>";
	}
	else {
		if (zipCodeIn === "") {
			tmEventHTML += "<td>There are no music events for " + artistNameIn + "</td>";
		}
		else {
			tmEventHTML += "<td>There are no music events for " + artistNameIn + " in Zip Code " + zipCodeIn;
		}
	}

	tmEventHTML += "</tr>";
	tmEventHTML += "</tbody>";
	tmEventHTML += "</table>";

	// Add the HTML to the web page
	$("#event-info").append(tmEventHTML);
}

// Add the music event to the users list of saved events.
function saveEvent() {
	alert("saveEvent() function entered");
}
