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
				$("#artist-fav").html("Favorite Artists");
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

		
	})


})

$("#user-logout").on("click",function(){
	$("#username").show();
	$("#user-submit").show();
	$("#logged-in").hide();
	

})

var favoriteButton = function() {
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
						$("#artist-fav").html("Favorite Artists");
						for (var i = 0; i < favoriteArtistArray.length; i++) {						
							$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "</div>");
						}
					}
					console.log(favoriteArtistArray);
					// database.ref().set({
					// 	favoriteArtist: favoriteArtistArray,
					// // })
					database.ref(childSnapshot.key).update({
						favoriteArtist: favoriteArtistArray,
					})
				})
		})
	})
}



// database.ref().on("value", function(snapshot){
// 	snapshot.forEach(function(childSnapshot){
// 		if (username = chilSnapshot.val().username && password) {

// 		}

// 	});
// });
