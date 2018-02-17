var Mock_Data = {
    "games":[
        {
            "name" : "Monopoloy",
            "minPlayers" : 2,
            "maxPlayers" : 6,
            "time" : 120,
            "age" : 8,
            "coop" : false,
            "dice" : true,
            "deckBuilding" : false,
            "bluffing" : false,
            "tokenMovement" : true,
            "tokenPlacement" : true,
            "setCollecting" : true,
            "party" : false,
            "trivia" : false,
            "expansion" : false            
        },
        {
            "name" : "Clue",
            "minPlayers" : 3,
            "maxPlayers" : 6,
            "time" : 60,
            "age" : 8,
            "coop" : false,
            "dice" : true,
            "deckBuilding" : false,
            "bluffing" : false,
            "tokenMovement" : true,
            "tokenPlacement" : false,
            "setCollecting" : false,
            "party" : false,
            "trivia" : false,
            "expansion" : false            
        },
        {
            "name" : "Betrayal at the House on the Hill",
            "minPlayers" : 3,
            "maxPlayers" : 6,
            "time" : 60,
            "age" : 12,
            "coop" : true,
            "dice" : true,
            "deckBuilding" : false,
            "bluffing" : false,
            "tokenMovement" : true,
            "tokenPlacement" : true,
            "setCollecting" : false,
            "party" : false,
            "trivia" : false,
            "expansion" : false            
        },
        {
            "name" : "Pandemic",
            "minPlayers" : 2,
            "maxPlayers" : 4,
            "time" : 45,
            "age" : 8,
            "coop" : true,
            "dice" : false,
            "deckBuilding" : false,
            "bluffing" : false,
            "tokenMovement" : true,
            "tokenPlacement" : true,
            "setCollecting" : true,
            "party" : false,
            "trivia" : false,
            "expansion" : false            
        }
    ]
}
var serverBase = '//localhost:8080/';
var USERS_URL = serverBase + 'users';


function start() {
	handleLoginButton();
	handleCreateAccount();
}

function handleLoginButton() {
	$('.open-login-button').on('click', event => {
		$('.Welcome').addClass("hidden");
		$('.Login-Page').removeClass("hidden");
		handleLogin();
		handleReturnFromLogin();
	});
}

function handleLogin() {
	$('.Login').on('submit', event => {
		event.preventDefault();
		var user = $('#user-input').val();
		console.log(user);
		var pass = $('#password-input').val();
		console.log(pass);
		if (user === "Kenneth" && pass === "Test") {
			displayGameShelf();
		}
		else {
			$('.Login-Error').html(`That username and password combination isn't in our system. <br> Please try again or go back and create an account`);
		}
	});
}

function displayGameShelf() {
	$('.Login-Error').empty();
    $('.Login-Page').addClass("hidden");
    $('.Create-Account-Page').addClass("hidden");
	$('.Splash-Page').addClass("hidden");
	$('.nav-header').removeClass("hidden");
}

function handleReturnFromLogin() {
	$('.login-to-main').on('click', event => {
		$('.Login-Page').addClass("hidden");
		$('.Welcome').removeClass("hidden");
		$('.Login-Error').empty();
	});
}

function handleCreateAccount() {
	$('.open-create-account').on('click', event => {
		$('.Welcome').addClass("hidden");
		$('.Create-Account-Page').removeClass("hidden");
		handleCreation();
		handleReturnFromCreate();
	});
}

function handleCreation() {
	$('.Create-Account').on('submit', event => {
		event.preventDefault();
		var userName = $('#user-create').val();
		var pass1 = $('#password-create').val();
        var pass2 = $('#password-confirm').val();
        if (pass1 === pass2) {
            var user = {
                "username" : userName,
                "password" : pass1
            };
            $.ajax({
                method: 'POST',
                url: USERS_URL,
                data: JSON.stringify(user),
                success: function(data) {
                  if (data.username===user.username){
                    displayGameShelf();
                  }
                },
                dataType: 'json',
                contentType: 'application/json'
              });
        };
	});
}

function handleReturnFromCreate() {
	$('.create-to-main').on('click', event => {
		$('.Create-Account-Page').addClass("hidden");
		$('.Welcome').removeClass("hidden");
	});
}

$(start);