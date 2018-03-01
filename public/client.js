var serverBase = '//localhost:8080/';
var USERS_URL = serverBase + 'users';
var LOGIN_URL = serverBase + 'auth/login';
var SHELF_URL = serverBase + 'gameshelf';
var GAMES_URL = serverBase + 'games';
const GAME_TABLE = `<table><tr><th>Game</th><th class = "rotate"><div><span>Min Players</span></div></th><th class = "rotate"><div><span>Max Players</span></div></th><th class = "rotate"><div><span>Play Time (min)</span></div></th><th class = "rotate"><div><span>Age to Play</span></div></th><th class = "rotate"><div><span>Co-Op</span></div></th><th class = "rotate"><div><span>Uses Dice</span></div></th><th class = "rotate"><div><span>Deck Building</span></div></th><th class = "rotate"><div><span>Bluffing</span></div></th><th class = "rotate"><div><span>Token Movement</span></div></th><th class = "rotate"><div><span>Token Placement</span></div></th><th class = "rotate"><div><span>Set Collecting</span></div></th><th class = "rotate"><div><span>Party Game</span></div></th><th class = "rotate"><div><span>Trivia Game</span></div></th><th class = "rotate"><div><span>Expansion</span></div></th></tr><tbody class = "myTable"></tbody></table>`

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
                handleMyShelfClick();
                handleSearchClick();
                handleLogoutClick();
                $('.Login-Page').addClass("hidden");
                $('.Create-Account-Page').addClass("hidden");
	            $('.Splash-Page').addClass("hidden");
                $('.nav-header').removeClass("hidden");
                $('.My-Games').removeClass("hidden");
                document.getElementById("Login").reset();
            },
            error: function(error) {
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
            renderShelf(data);
        },
        error: function(error) {
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
    $('.js-game-list').html(`<span class="sr-only">Loading...</span>`);
    var tokenData = parseJwt(localStorage.token);
    $.ajax({
        method: 'GET',
        url: SHELF_URL + '/' + tokenData.user.myShelf,
        beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
          },
        success: function(data) {
            const gameList = data.map(game =>renderGame(game));
            if(data.length === 0) {
                $('.js-game-list').html("You don't have any games on your shelf yet. You should click on 'Search for Games' above and fix that.")
            }
            else{
                $('.js-game-list').html(GAME_TABLE)
                $('.myTable').html(gameList);
            }
        },
        error: function(error) {
            
        }
    });
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

function renderGame (game) {
    return `
    <tr><td>${game.name}</td><td>${game.minPlayers}</td><td>${game.maxPlayers}</td><td>${game.time}</td><td>${game.age}</td><td>${game.coop}</td><td>${game.dice}</td><td>${game.deckBuilding}</td><td>${game.bluffing}</td><td>${game.tokenMovement}</td><td>${game.tokenPlacement}</td><td>${game.setCollecting}</td><td>${game.party}</td><td>${game.trivia}</td><td>${game.expansion}</td></tr>
    `;
}

function handleSearchClick() {
    $('.search').on('click', event =>{
        $('.js-game-list').html(`<span class="sr-only">Loading...</span>`);
        var tokenData = parseJwt(localStorage.token);
        $.ajax({
            method: 'GET',
            url: GAMES_URL,
            beforeSend: function(xhr) {
                if (localStorage.token) {
                  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
              },
            success: function(data) {
                const gameList = data.map(game =>renderGameChoice(game));
                $('.js-game-list').html(GAME_TABLE);
                $('.myTable').html(gameList);
                $('.js-add-button').html(`<button type="button" class="add-game-button">Add to my Shelf</button>`)
                handleAddGame(data);
            },
            error: function(error) {
                
            }
        });
    });
}

function handleAddGame(games){
    $('.add-game-button').on('click', event =>{
        console.log(games);
        const gameName = $('input[name=game]:checked', '.myTable').attr('value');
        console.log(gameName);
        const gameID = getId(games, gameName);
        console.log(gameID);
        var tokenData = parseJwt(localStorage.token);
        $.ajax({
            method: 'PUT',
            url: SHELF_URL + '/' + tokenData.user.myShelf + '/' + gameID,
            beforeSend: function(xhr) {
                if (localStorage.token) {
                  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
              },
            success: function() {
                $('.js-add-response').html(gameName + " was added to your shelf.");
            },
            error: function(error) {
                
            }
        });
    }); 
}

function getId (list, name){
    for(var i = 0, numGames = list.length; i < numGames; i++){
        if(list[i].name == name){
            return list[i].id;
        }
    }
}

function handleMyShelfClick(){
    $('.my-games').on('click', event =>{
        $('.js-add-button').html("");
        $('.js-add-response').html("");
        displayGameShelf(localStorage.token);
    });
}

function handleLogoutClick(){
    $('.log-out').on('click', event =>{
        localStorage.token = "";
        $('.Login-Page').addClass("hidden");
        $('.Create-Account-Page').addClass("hidden");
        $('.Splash-Page').removeClass("hidden");
        $('.Welcome').removeClass("hidden");
        $('.nav-header').addClass("hidden");
        $('.My-Games').addClass("hidden");
    });
}

function renderGameChoice(game) {
    return `
    <tr><td><input type="radio" name="game" value="${game.name}" />${game.name}</td><td>${game.minPlayers}</td><td>${game.maxPlayers}</td><td>${game.time}</td><td>${game.age}</td><td>${game.coop}</td><td>${game.dice}</td><td>${game.deckBuilding}</td><td>${game.bluffing}</td><td>${game.tokenMovement}</td><td>${game.tokenPlacement}</td><td>${game.setCollecting}</td><td>${game.party}</td><td>${game.trivia}</td><td>${game.expansion}</td></tr>
    `;
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
                            handleMyShelfClick();
                            handleSearchClick();
                            handleLogoutClick();
                            $('.Login-Page').addClass("hidden");
                            $('.Create-Account-Page').addClass("hidden");
	                        $('.Splash-Page').addClass("hidden");
                            $('.nav-header').removeClass("hidden");
                            $('.My-Games').removeClass("hidden");
                            document.getElementById("Create-Account").reset();                            
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                  }
                },
                error: function(error) {
                    $('.Create-Error').html(error.responseJSON.message);
                }
              });
        }
        else {
            $('.Create-Error').html('Your passwords do not match.'); 
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