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
				for (var i = 0; i < favoriteArtistArray.length; i++) {
					console.log(favoriteArtistArray[i])
					$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "</div>");

				}
			}
		})
	});
})

$("#newuser-submit").on("click", function(){
	event.preventDefault();

	var username = $("#username").val().trim();
	$("#newuser-submit").hide();
	$("#username").hide();
	$("#user-submit").hide();
	$("#logged-in").show().append(username);
	$("#user-logout").show();

	database.ref().push({
		username: username,
		favoriteArtist: ["Beyonce", "Red Hot Chili Peppers", "John Legend"],
	})


})

$("#user-logout").on("click",function(){
	$("#username").show();
	$("#user-submit").show();
	$("#logged-in").hide();
	

})




// database.ref().on("value", function(snapshot){
// 	snapshot.forEach(function(childSnapshot){
// 		if (username = chilSnapshot.val().username && password) {

// 		}

// 	});
// });
