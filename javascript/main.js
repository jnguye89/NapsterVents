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


})

$("#user-logout").on("click",function(){
	$("#username").show();
	$("#user-submit").show();
	$("#logged-in").hide();
	username = null;
	database.ref().set({
		username: false

	})

})



database.ref().on("value", function(snapshot){
	snapshot.forEach(function(childSnapshot){
		var favoriteArtistArray = childSnapshot.val().favoriteArtist;
		
		if (username == childSnapshot.val().username){
			for (var i = 0; i < favoriteArtistArray.length; i++) {
				console.log(favoriteArtistArray[i])
				$("#artist-fav").append("<div>" + favoriteArtistArray[i] + "</div>")
		}
	}
})});

// database.ref().on("value", function(snapshot){
// 	snapshot.forEach(function(childSnapshot){
// 		if (username = chilSnapshot.val().username && password) {

// 		}

// 	});
// });
