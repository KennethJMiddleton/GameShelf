var Mock_Data = {
    "games":[
        {
            "name" : "Monopoly",
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
var LOGIN_URL = serverBase + 'auth/login';
var SHELF_URL = serverBase + 'gameshelf';



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
		var userName = $('#user-input').val();
		var pass1 = $('#password-input').val();
		var user = {
            "username" : userName,
            "password" : pass1
        };
        $.ajax({
            method: 'POST',
            url: LOGIN_URL,
            data: JSON.stringify(user),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                localStorage.token = data.authToken;
                displayGameShelf(localStorage.token);
            },
            error: function(error) {
                console.log(error);
                $('.Login-Error').html("That username and password combination are not in our system. Please try again");
            }
        });

	});
}

function displayGameShelf(token) {
	$('.Login-Error').empty();
    $.ajax({
        method: 'GET',
        url: SHELF_URL,
        beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
          },
        success: function(data) {
            $('.Login-Page').addClass("hidden");
            $('.Create-Account-Page').addClass("hidden");
	        $('.Splash-Page').addClass("hidden");
            $('.nav-header').removeClass("hidden");
            $('.My-Games').removeClass("hidden");
            renderShelf(data);
        },
        error: function() {
            alert("Sorry, you are not logged in.");
            $('.Login-Page').addClass("hidden");
            $('.Create-Account-Page').addClass("hidden");
            $('.Splash-Page').removeClass("hidden");
            $('.Welcome').removeClass("hidden");
            $('.nav-header').addClass("hidden");
            $('.My-Games').addClass("hidden");
        }
    });
}

function renderShelf(gamelist) {
    $('.js-game list').html(`<span class="sr-only">Loading...</span>`);
    var tokenData = parseJwt(localStorage.token);
    console.log(tokenData.user.username);    
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

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
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {
                  if (data.username===user.username){
                    $.ajax({
                        method: 'POST',
                        url: LOGIN_URL,
                        data: JSON.stringify(user),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function(data) {
                            localStorage.token = data.authToken;
                            displayGameShelf(localStorage.token);
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                  }
                },
                error: function(error) {
                    console.log(error);
                    $('.Create-Error').html(error.responseJSON.message);
                }
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