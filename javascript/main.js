// Initialize Firebase
var config = {
    apiKey: "AIzaSyDLnLEGIIHzvCIS2TRAjJIFE3_JtKYypt0",
    authDomain: "project-7498a.firebaseapp.com",
    databaseURL: "https://project-7498a.firebaseio.com",
    projectId: "project-7498a",
    storageBucket: "project-7498a.appspot.com",
    messagingSenderId: "1007493758823"
  };
  firebase.initializeApp(config);

// Global Variables
var artist;
var genreList = [];

// Get form value
$("#nav-submit").on("click", function(event) {
        event.preventDefault();

        // Get artist NAME from user
        artist = $("#artist-name").val().trim();

        //Clear name and zip fields
        $("#artist-name").val('');
        $("#zip-code").val('');

        // Swap spaces with dashes
        var artistFixed = artist.split(" ").join("-");

        // Send API query to Napster
		var queryURL = "https://api.napster.com/v2.2/artists/"+artistFixed+"?apikey=YTk0ODZlZTktNjIxMy00ZWQ1LTgwYzQtMDk5NmVjYjBlY2Vm";

	    $.ajax({
	      url: queryURL,
	      method: "GET"
	    }).done(function(response) {

	    	// Display artist NAME
	      	var artistName = response.artists[0].name;
	      	$("#artist-info").html("<h3>"+artistName);

	      	// Display list of artist BLURBS
	      	var blurb = response.artists[0].blurbs;

	      	for (var i = 0; i < blurb.length; i++) {
	      		$("#artist-info").append("<li>"+blurb[i]);
	      	}

	      	// Do second ajax query to pull artist GENRES
	      	var genre = response.artists[0].links.genres.href;
	      	var queryURL = genre+"?apikey=YTk0ODZlZTktNjIxMy00ZWQ1LTgwYzQtMDk5NmVjYjBlY2Vm";

		    $.ajax({
		      url: queryURL,
		      method: "GET"
		    }).done(function(response) {		      
		    	$("#artist-info").append("<h4>"+"Genres: ");

		    	$("#artist-info").append("<ul>")

		      	for (var i = 0; i < response.genres.length; i++) {
		      	$("#artist-info").append("<li>"+response.genres[i].name);		      
		      	}

	    	});

	    	// Do third API query to pull down an artist photo
	    	var image = response.artists[0].links.images.href

			var queryURL = image + "?apikey=ZWZlOGIzZWQtMmJjYi00MDVkLWJjYmItNzhhNDAyM2IxMDU3";

			$.ajax({
			url: queryURL,
			method: "GET"
			  }).done(function(response) {

			    var image = response.images[0].url

			    var artistImage = $("<img>");


			    artistImage.attr("src", image);

			    artistImage.addClass("img-responsive img-rounded");

			      
			    $("#artist-info").append(artistImage);
			     
			  });


      	});
	});

 