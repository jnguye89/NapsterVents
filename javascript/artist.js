// Global Variables
var artist;
var genreList = [];

// Get form value
$("#nav-submit").on("click", function(event) {
   

        // Clear old data from artist info divs
        $("#artist-pic").empty();
        $("#artist-info").empty();

        // Get artist NAME from user
        artist = $("#artist-name").val().trim();

        //Clear name and zip fields
        $("#artist-name").val('');
        $("#zip-code").val('');

        // Swap spaces with dashes
        var artistFixed = artist.split(" ").join("-");
        var artistLower = artistFixed.toLowerCase();

        // Send API query to Napster
		var queryURL = "https://api.napster.com/v2.2/artists/"+artistLower+"?apikey=YTk0ODZlZTktNjIxMy00ZWQ1LTgwYzQtMDk5NmVjYjBlY2Vm";

	    $.ajax({
	      url: queryURL,
	      method: "GET"
	    }).done(function(response) {
	    	
	    	console.log(response.artists);
	    	
	    	if (response.artists.length < 1){
	    		$("#artist-name").html("<h2>Sorry, we could not find information on that artist.</h2>");
	    	}
	    	else{
	    		var artistName = response.artists[0].name;
      			$("#artist-name").html("<h2>"+artistName);
      			$("#artist-button").html("<button class='btn btn-primary btn-block' type='button' data-artist = '"+artistName+"' id='nav-submit'>Make Favorite</button>");
	    	}
    		
	      	

	      	// Display list of artist BLURBS
	      	var blurb = response.artists[0].blurbs;

	      	var uList = $("<ul>");

	      	for (var i = 0; i < blurb.length; i++) {
	      		uList.append("<li>"+blurb[i]);
	      	}

	      	$("#artist-info").append(uList);

	      	// Do second ajax query to pull artist GENRES
	      	var genre = response.artists[0].links.genres.href;
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

			      
			    $("#artist-pic").html(artistImage);
			     
			  });


      	});
	});
