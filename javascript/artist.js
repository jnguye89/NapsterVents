// Global Variables
var artist;
var genreList = [];

// Get form value and run artistInfo function on form submit
$("#nav-submit").on("click", function(event) {

	// Get artist NAME from user
    artist = $("#artist-name").val().trim();

    //Clear name and zip fields
    $("#artist-name").val('');
    $("#zip-code").val('');
    console.log(artist);
    // Swap spaces with dashes
    // var artistFixed = artist.split(" ").join("-");
    // var artistLower = artistFixed.toLowerCase();
   
   	if (artist != ""){
	artistInfo(artist);
	}
	else {
		$("#artist-heading").html("<h2>No artist selected.</h2>");
    	$("#artist-pic").html("<img id='artist-picture' class='img-responsive' src='images/napster.gif'>");
	}
});


// Get form value and run artistInfo function on favorite click
$("#artist-fav").on("click", ".fav-artist-button", function(event) {

   	var aName = event.currentTarget.attributes[1].value;

   	var artistFixed = aName.split(" ").join("-");
    var artistLower = artistFixed.toLowerCase();

	artistInfo(artistLower);

});


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
    	}
    	else{
    		var artistName = response.search.data.artists[0].name;
  			$("#artist-heading").html("<h2>"+artistName);
  			$("#artist-button").html("<button class='btn btn-primary btn-block' type='button' data-artist = '"+artistName+"' id='artist-submit'>Make Favorite &nbsp;&nbsp;<span class='glyphicon glyphicon-heart-empty'></span></button>");
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
  	});

}
