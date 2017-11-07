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

$("#user-submit").on("click", function() {
	event.preventDefault();

	//get username and password
	username = $("#username").val().trim();
	$("#username").hide();
	$("#user-submit").hide();
	$("#logged-in").show().append(username);
	$("#user-logout").show();
	$("#newuser-submit").hide();


	database.ref().on("value", function(snapshot){
		snapshot.forEach(function(childSnapshot){
			if (username == childSnapshot.val().username){
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
	$("#newuser-submit").hide();
	$("#username").hide();
	$("#user-submit").hide();
	$("#logged-in").show().append(username);
	$("#user-logout").show();

	database.ref().push({
		username: username,
		favoriteArtist: [""],
		favoriteEventName: [""],
		favoriteEventID: [""],
		
	})

	database.ref().on("value", function(snapshot){
		snapshot.forEach(function(childSnapshot){
			if (username == childSnapshot.val().username){
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
		console.log("button pressed");
		var artistName = $(this).attr("data-artist");
		console.log(artistName);
		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var favoriteArtistArray = [];
				console.log(childSnapshot.key);
				if (username == childSnapshot.val().username){

					favoriteArtistArray = childSnapshot.val().favoriteArtist;
					
					favoriteArtistArray.push(artistName);
					$("#artist-fav").html("");
					for (var i = 0; i < favoriteArtistArray.length; i++) {						
						$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "</div>");
          }
					database.ref(childSnapshot.key).update({
						favoriteArtist: favoriteArtistArray,
					})
			
				}
				console.log(favoriteArtistArray);
			})
		})
	})
}
            
            
var favoriteEventButton = function(){
	$("#save-event-submit").on("click", function(){
		console.log("button pressed");
		var eventArtist = $(this).attr("data-event-artist");
		console.log(eventArtist);
		var eventID = $(this).attr("data-event-id");
		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var favoriteEventNameArray = [];
				var favoriteEventIDArray = [];
				if (username == childSnapshot.val().username){
					favoriteEventNameArray = childSnapshot.val().favoriteEventName;
					favoriteEventIDArray = childSnapshot.val().favoriteEventID;

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

				}
			})
		})
	})

}

// database.ref().on("value", function(snapshot){
// 	snapshot.forEach(function(childSnapshot){
// 		if (username = childSnapshot.val().username && password) {

// 		}

// 	});
// });
