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
	
	$("#userNotExistsModal").modal({ show: false});


	database.ref().once("value", function(snapshot){
		usernameNotExists = true;
		snapshot.forEach(function(childSnapshot){
			console.log(usernameLowercase);
			console.log("username: "+childSnapshot.val().username);
			if (usernameLowercase == childSnapshot.val().username){
				usernameNotExists = false;
			} 
			console.log(usernameNotExists);
		})
		checkUserNotExists(usernameNotExists);
	})

})

function checkUserNotExists(usernameNotExists) {
	if (usernameNotExists == false){
		
		
		$("#username").hide();
		$("#user-submit").hide();
		$("#logged-in").show().append(username);
		$("#user-logout").show();
		$("#newuser-submit").hide();
		$("#sign-up-modal").hide();

		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				if (usernameLowercase == childSnapshot.val().username){
					var favoriteArtistArray = childSnapshot.val().favoriteArtist;
					var favoriteEventNameArray = childSnapshot.val().favoriteEventName;
					var favoriteEventIDArray = childSnapshot.val().favoriteEventID;
					var favoriteEventArtistArray = childSnapshot.val().favoriteEventArtist;
					$("#artist-fav").html("");
					for (var i = 1; i < favoriteArtistArray.length; i++) {
						console.log(favoriteArtistArray[i])
						$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "<button type='button' class='del-artist-button close' fav-value='" + i + "'>&times;</button></div>");
						deleteArtistButton();
					}
					$("#event-fav").html("");
					for (var k=1; k < favoriteEventNameArray.length; k++){
						$("#event-fav").append("<div class='fav-link fav-event-button' name-value='" + favoriteEventNameArray[k] + "' id-value='" + favoriteEventIDArray[k] + "' artist-value='" + favoriteEventArtistArray[k] + "''>" + favoriteEventNameArray[k] + "<button type='button' class='del-event-button close' fav-value='" + k + "'>&times;</button></div>");
						deleteEventButton();
					}
				}
			})
		})
	} else {
		$("#userNotExistsModal").modal('show');
	
	}
}


$("#newuser-submit").on("click", function(){
	event.preventDefault();
	// $("#sign-up-modal").hide();

	$("#userExistsModal").modal({ show: false});
	username = $("#newUsername").val().trim();
	usernameLowercase = username.toLowerCase();
	var usernameExists;

	database.ref().once("value", function(snapshot){
		usernameExists = false;
		snapshot.forEach(function(childSnapshot){
			console.log(usernameLowercase);
			console.log("username: "+childSnapshot.val().username);
			if (usernameLowercase == childSnapshot.val().username){
				usernameExists = true;
			} 
			console.log(usernameExists);
		})
		checkUserExists(usernameExists);
	})
})

$("#user-logout").on("click",function(){
	$("#username").show();
	$("#user-submit").show();
	$("#logged-in").hide();
	

})

function checkUserExists(usernameExists) {
	if (usernameExists === false){
		$("#new-user-submit").hide();
		$("#username").hide();
		$("#user-submit").hide();
		$("#logged-in").show().append(username);
		$("#user-logout").show();
		$("#sign-up-modal").hide();

		 $("#signupModal").modal("hide");

		database.ref().push({
			username: usernameLowercase,
			favoriteArtist: [""],
			favoriteEventName: [""],
			favoriteEventID: [""],
			favoriteEventArtist: [""],
			
		})
		$("#userExistsModal").modal({ show: false});
	} else {
		$("#userExistsModal").modal('show');
		$("#newUsername").val("");

	}
}

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
						for (var i = 1; i < favoriteArtistArray.length; i++) {						
							$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "<button type='button' class='del-artist-button close' fav-value='" + i + "'>&times;</button></div>");
							deleteArtistButton();
						}
						database.ref(childSnapshot.key).update({
							favoriteArtist: favoriteArtistArray,
						})
			
					} else {
					$("#artistExists").modal('show');
					} 
				}		
			})
		})
	})
}
            
            
var favoriteEventButton = function(){
	$(".save-event-submit").on("click", function(){
		usernameLowercase = username.toLowerCase();
		console.log("button pressed");
		var eventName = $(this).attr("data-event-artist");
		var eventArtist = $(this).attr("data-artist-name")
		var eventID = $(this).attr("data-event-id");
		var eventIDExists;
		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var favoriteEventNameArray = [];
				var favoriteEventIDArray = [];
				var favoriteEventArtistArray = [];
				if (usernameLowercase == childSnapshot.val().username){
					favoriteEventNameArray = childSnapshot.val().favoriteEventName;
					favoriteEventIDArray = childSnapshot.val().favoriteEventID;
					favoriteEventArtistArray = childSnapshot.val().favoriteEventArtist;

					eventIDExists = favoriteEventIDArray.indexOf(eventID);
					console.log(eventIDExists);
					if (eventIDExists === -1){
						console.log("event doesn't exist");
						favoriteEventNameArray.push(eventName);
						favoriteEventIDArray.push(eventID);
						favoriteEventArtistArray.push(eventArtist);
						
						database.ref(childSnapshot.key).update({
							favoriteEventName: favoriteEventNameArray,
							favoriteEventID: favoriteEventIDArray,
							favoriteEventArtist: favoriteEventArtistArray,
						})
					} else {
						$("#eventExists").modal('show');
					}
				}

				if (usernameLowercase == childSnapshot.val().username){
					
					$("#event-fav").html("");
					for (var k=1; k < favoriteEventNameArray.length; k++){
						$("#event-fav").append("<div class='fav-link fav-event-button' name-value='" + favoriteEventNameArray[k] + "' id-value='" + favoriteEventIDArray[k] + "' artist-value='" + favoriteEventArtistArray[k] + "''>" + favoriteEventNameArray[k] + "<button type='button' class='del-event-button close' fav-value='" + k + "'>&times;</button></div>");
						deleteEventButton();
					}
				}
			})
		})
	})
}

var deleteEventButton = function(){
	$(".del-event-button").on("click", function(){
		usernameLowercase = username.toLowerCase();
		var delVal = $(this).attr("fav-value");
		var favoriteEventNameArray = [];
		var favoriteEventIDArray = [];
		var favoriteEventArtistArray = []; 

		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				if (usernameLowercase == childSnapshot.val().username){
					favoriteEventNameArray = childSnapshot.val().favoriteEventName;
					favoriteEventIDArray = childSnapshot.val().favoriteEventID;
					favoriteEventArtistArray = childSnapshot.val().favoriteEventArtist;
				}
				favoriteEventNameArray.splice(delVal, 1);
				favoriteEventIDArray.splice(delVal,1);
				favoriteEventArtistArray.splice(delVal, 1);

				
				database.ref(childSnapshot.key).update({
					favoriteEventName: favoriteEventNameArray,
					favoriteEventID: favoriteEventIDArray,
					favoriteEventArtist: favoriteEventArtistArray,
				})

				if (usernameLowercase == childSnapshot.val().username){
					
					$("#event-fav").html("");
					for (var k=1; k < favoriteEventNameArray.length; k++){
						$("#event-fav").append("<div class='fav-link fav-event-button' name-value='" + favoriteEventNameArray[k] + "' id-value='" + favoriteEventIDArray[k] + "' artist-value='" + favoriteEventArtistArray[k] + "''>" + favoriteEventNameArray[k] + "<button type='button' class='del-event-button close' fav-value='" + k + "'>&times;</button></div>");
						deleteEventButton();
					}
				}
			})
		})	
	})
}


var deleteArtistButton = function(){
	$(".del-artist-button").on("click", function(){
		usernameLowercase = username.toLowerCase();
		var delVal = $(this).attr("fav-value");
		var favoriteArtistArray = [];

		database.ref().once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot){
				if (usernameLowercase == childSnapshot.val().username){
					favoriteArtistArray = childSnapshot.val().favoriteArtist;

				}
				favoriteArtistArray.splice(delVal,1);

				database.ref(childSnapshot.key).update({
					favoriteArtist: favoriteArtistArray,

				})

				if (usernameLowercase == childSnapshot.val().username){
					
					$("#artist-fav").html("");
					for (var i = 1; i < favoriteArtistArray.length; i++) {
						console.log(favoriteArtistArray[i])
						$("#artist-fav").append("<div class='fav-link fav-artist-button' value='"+ favoriteArtistArray[i] + "'>" + favoriteArtistArray[i] + "<button type='button' class='del-artist-button close' fav-value='" + i + "'>&times;</button></div>");
						deleteArtistButton();
					}
				}
			})
		})

	})
}