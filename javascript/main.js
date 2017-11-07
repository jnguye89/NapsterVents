var config = {
    apiKey: "AIzaSyDLnLEGIIHzvCIS2TRAjJIFE3_JtKYypt0",
    authDomain: "project-7498a.firebaseapp.com",
    databaseURL: "https://project-7498a.firebaseio.com",
    projectId: "project-7498a",
    storageBucket: "project-7498a.appspot.com",
    messagingSenderId: "1007493758823"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var username = "";
var usernameLowercase = "";

$("#user-submit").on("click", function() {
	event.preventDefault();

	//get username and password
	username = $("#username").val().trim();
	usernameLowercase = username.toLowerCase();
	$("#username").hide();
	$("#user-submit").hide();
	$("#logged-in").show().append(username);
	$("#user-logout").show();
	$("#newuser-submit").hide();


	database.ref().on("value", function(snapshot){
		snapshot.forEach(function(childSnapshot){
			if (usernameLowercase == childSnapshot.val().username){
				var favoriteArtistArray = childSnapshot.val().favoriteArtist;
				var favoriteEventNameArray = childSnapshot.val().favoriteEventName;
				var favoriteEventIDArray = childSnapshot.val().favoriteEventID;
				$("#artist-fav").html("");
				for (var i = 0; i < favoriteArtistArray.length; i++) {
					console.log(favoriteArtistArray[i])
					$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "</div>");
				}
				$("#event-fav").html("");
				for (var k=0; k < favoriteEventNameArray.length; k++){
					$("#event-fav").append("<div class='fav-link fav-event-button' name-value='" + favoriteEventNameArray[k] + "' id-value='" + favoriteEventIDArray[k] + "'>" + favoriteEventNameArray[k] + "</div>");

				}
			}
		})
	});
})


$("#newuser-submit").on("click", function(){
	event.preventDefault();

	username = $("#username").val().trim();
	usernameLowercase = username.toLowerCase();
	$("#newuser-submit").hide();
	$("#username").hide();
	$("#user-submit").hide();
	$("#logged-in").show().append(username);
	$("#user-logout").show();

	database.ref().push({
		username: usernameLowercase,
		favoriteArtist: [""],
		favoriteEventName: [""],
		favoriteEventID: [""],
		
	})

	database.ref().on("value", function(snapshot){
		snapshot.forEach(function(childSnapshot){
			if (usernameLowercase == childSnapshot.val().username){
				var favoriteArtistArray = childSnapshot.val().favoriteArtist;
				var favoriteEventNameArray = childSnapshot.val().favoriteEventName;
				var favoriteEventIDArray = childSnapshot.val().favoriteEventID;
				$("#artist-fav").html("");
				for (var i = 0; i < favoriteArtistArray.length; i++) {
					console.log(favoriteArtistArray[i])
					$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "</div>");
				}
				$("#event-fav").html("");
				for (var k=0; k < favoriteEventNameArray.length; k++){
					$("#event-fav").append("<div class='fav-link fav-event-button' name-value='" + favoriteEventNameArray[k] + "' id-value='" + favoriteEventIDArray[k] + "'>" + favoriteEventNameArray[k] + "</div>");

				}
			}
		})
	});

})

$("#user-logout").on("click",function(){
	$("#username").show();
	$("#user-submit").show();
	$("#logged-in").hide();
	

})


var favoriteArtistButton = function() {
	$("#artist-submit").on("click", function(){
		usernameLowercase = username.toLowerCase();
		console.log("button pressed");
		var artistName = $(this).attr("data-artist");
		var artistNameExists;
		console.log(artistName);
		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var favoriteArtistArray = [];
				console.log(childSnapshot.key);
				if (usernameLowercase == childSnapshot.val().username){

					favoriteArtistArray = childSnapshot.val().favoriteArtist;

					artistNameExists = favoriteArtistArray.indexOf(artistName);
					if (artistNameExists === -1){
						favoriteArtistArray.push(artistName);
						$("#artist-fav").html("");
						for (var i = 0; i < favoriteArtistArray.length; i++) {						
							$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "</div>");
						}
						database.ref(childSnapshot.key).update({
							favoriteArtist: favoriteArtistArray,
						})
			
					} else {
					alert("Artist already saved to favorites!");
					} 
				}		
			})
		})
	})
}
            
            
var favoriteEventButton = function(){
	$(".save-event-submit").on("click", function(){ //JS
		usernameLowercase = username.toLowerCase();
		console.log("button pressed");
		var eventArtist = $(this).attr("data-event-artist");
		console.log(eventArtist);
		var eventID = $(this).attr("data-event-id");
		var eventIDExists;
		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var favoriteEventNameArray = [];
				var favoriteEventIDArray = [];
				if (usernameLowercase == childSnapshot.val().username){
					favoriteEventNameArray = childSnapshot.val().favoriteEventName;
					favoriteEventIDArray = childSnapshot.val().favoriteEventID;

					eventIDExists = favoriteEventIDArray.indexOf(eventID);
					console.log(eventIDExists);
					if (eventIDExists === -1){
						console.log("event doesn't exist");
						favoriteEventNameArray.push(eventArtist);
						favoriteEventIDArray.push(eventID);
						$("#event-fav").html("");
						for (var k=0; k < favoriteEventNameArray.length; k++){
							$("#event-fav").append("<div class='fav-link fav-event-button' name-value='" + favoriteEventNameArray[k] + "' id-value='" + favoriteEventIDArray[k] + "'>" + favoriteEventNameArray[k] + "</div>");
						}
						database.ref(childSnapshot.key).update({
							favoriteEventName: favoriteEventNameArray,
							favoriteEventID: favoriteEventIDArray,
						})
					} else {
						alert("Event already saved");
					}
					
				}
			})
		})
	})

}