var USERS_URL = '/users';
var LOGIN_URL = '/auth/login';
var SHELF_URL = '/gameshelf';
var GAMES_URL = '/games';
var ADD_TO_SHELF_LIST = "";
var NEW_GAME = "";
const GAME_TABLE = `<table><tr><th>Game</th><th class = "rotate"><div><span>Min Players</span></div></th><th class = "rotate"><div><span>Max Players</span></div></th><th class = "rotate"><div><span>Play Time (min)</span></div></th><th class = "rotate"><div><span>Age to Play</span></div></th><th class = "rotate"><div><span>Co-Op</span></div></th><th class = "rotate"><div><span>Uses Dice</span></div></th><th class = "rotate"><div><span>Deck Building</span></div></th><th class = "rotate"><div><span>Bluffing</span></div></th><th class = "rotate"><div><span>Token Movement</span></div></th><th class = "rotate"><div><span>Token Placement</span></div></th><th class = "rotate"><div><span>Set Collecting</span></div></th><th class = "rotate"><div><span>Party Game</span></div></th><th class = "rotate"><div><span>Trivia Game</span></div></th><th class = "rotate"><div><span>Expansion</span></div></th></tr><tbody class = "myTable"></tbody></table>`

function start() {
	handleLoginButton();
    handleCreateAccount();
    handleLogin();
	handleReturnFromLogin();
    handleMyShelfClick();
    handleSearchClick();
    handleLogoutClick();
    handleAddGame();
    handleGenerateGame();
    handleGameSubmission();
    handleDBSubmission();
    handleCorrection();
    handleCreation();
    handleReturnFromCreate();
    handleBackButton ();
}

//switches to the login page from the main page
function handleLoginButton() {
	$('.open-login-button').on('click', event => {
		$('.Welcome').addClass("hidden");
		$('.Login-Page').removeClass("hidden");
	});
}

//allows the user to login to their account and displays their homepage
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

//generates the primary view on the user page
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

//populates the users list of games
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

//pulls data from the JWT into a usable form
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

//fills in the game data for each line of the display
function renderGame (game) {
    return `
    <tr><td>${game.name}</td><td>${game.minPlayers}</td><td>${game.maxPlayers}</td><td>${game.time}</td><td>${game.age}</td><td>${game.coop}</td><td>${game.dice}</td><td>${game.deckBuilding}</td><td>${game.bluffing}</td><td>${game.tokenMovement}</td><td>${game.tokenPlacement}</td><td>${game.setCollecting}</td><td>${game.party}</td><td>${game.trivia}</td><td>${game.expansion}</td></tr>
    `;
}

// loads the master list of games for addition to a users list
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
                $('.js-add-button').html(`<button type="button" class="add-game-button">Add to my Shelf</button><br><button type="button" class="generate-game-button">Add to this list</button>`)
                ADD_TO_SHELF_LIST = data;
            },
            error: function(error) {
                
            }
        });
    });
}


//adds a game from the master list to a users list
function handleAddGame(){
    $('.js-add-button').on('click', '.add-game-button', event =>{
        console.log("you did it")
        const gameName = $('input[name=game]:checked', '.myTable').attr('value');
        const gameID = getId(ADD_TO_SHELF_LIST, gameName);
        if(gameName){
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
        }
        else {
            $('.js-add-response').html("You must select a game!");
        }
        
    }); 
}

//pulls out the game ID form the data list
function getId (list, name){
    for(var i = 0, numGames = list.length; i < numGames; i++){
        if(list[i].name == name){
            return list[i].id;
        }
    }
}

//opens window for adding a game to the master list
function handleGenerateGame() {
    $('.js-add-button').on('click', '.generate-game-button', event =>{
        $('.nav-header').addClass("hidden");
        $('.My-Games').addClass("hidden");
        $('.New-Game').removeClass("hidden");
    });
}

//pull user infor into an object and preps to upload to master list
function handleGameSubmission(){
    $('.add-new-game-button').on('click', event => {
        var newGame = {
            name : $(".js-game-name").val(),
            minPlayers : parseInt($(".js-min-players").val()),
            maxPlayers : parseInt($(".js-max-players").val()),
            time : parseInt($(".js-game-time").val()),
            age : parseInt($(".js-game-age").val()),
            coop : $("input[name=coop]:checked").val()=="true",
            dice : $("input[name=dice]:checked").val()=="true",
            deckBuilding : $("input[name=deck]:checked").val()=="true",
            bluffing : $("input[name=bluff]:checked").val()=="true",   
            tokenMovement : $("input[name=pawn]:checked").val()=="true",
            tokenPlacement : $("input[name=WP]:checked").val()=="true",
            setCollecting : $("input[name=set]:checked").val()=="true",
            party : $("input[name=party]:checked").val()=="true",
            trivia : $("input[name=trivia]:checked").val()=="true",
            expansion : $("input[name=exp]:checked").val()=="true"
        }
        gameCheck(newGame);    
    });
}

//displays new game information for user review before submission
function gameCheck(game) {
    $('.New-Game').addClass("hidden");
    $('.Game-Check-Space').removeClass("hidden");
    $('.Game-Review').html(GAME_TABLE)
    $('.myTable').html(renderGame(game));
    NEW_GAME = game;
}

//adds new game to master list
function handleDBSubmission(){
    $('.create-game-button').on('click', event =>{
        document.getElementById("New-Game").reset();
        $('.Game-Check-Space').addClass("hidden");
        $('.Game-Review').html("");
        $.ajax({
            method: 'POST',
            url: GAMES_URL,
            data: JSON.stringify(NEW_GAME),
            dataType: 'json',
            contentType: 'application/json',
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
                $('.js-add-button').html("");
                $('.js-game-list').html(NEW_GAME.name + " was added to the database successfully! <br> Search again and you will find it on the full list and can add it to your Shelf from there");
            },
            error: function(error) {

            }
        });
        NEW_GAME = "";
    });
}

//allows user to edit new game information
function handleCorrection(){
    $('.fix-game-button').on('click', event =>{
        $('.New-Game').removeClass("hidden");
        $('.Game-Check-Space').addClass("hidden");
        $('.Game-Review').html("");
    });
}

//takes away from adding a new game back to the master list display 
function handleBackButton (){
    $('.back-button').on('click', event => {
        $('.nav-header').removeClass("hidden");
        $('.My-Games').removeClass("hidden");
        $('.New-Game').addClass("hidden");
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
                $('.js-add-button').html(`<button type="button" class="add-game-button">Add to my Shelf</button><br><button type="button" class="generate-game-button">Add to this list</button>`)
                ADD_TO_SHELF_LIST = data;
                
            },
            error: function(error) {
                
            }
        });
    });
}

//displays personal list of games
function handleMyShelfClick(){
    $('.my-games').on('click', event =>{
        $('.js-add-button').html("");
        $('.js-add-response').html("");
        displayGameShelf(localStorage.token);
    });
}

//logs user out of their account
function handleLogoutClick(){
    $('.log-out').on('click', event =>{
        localStorage.token = "";
        ADD_TO_SHELF_LIST = "";
        NEW_GAME = "";
        $('.js-add-button').html("");
        $('.js-add-response').html("");
        $('.js-game-list').html("Hello and welcome to Game Shelf, a great place to store your games! Click on My Games to get started.");
        $('.Login-Page').addClass("hidden");
        $('.Create-Account-Page').addClass("hidden");
        $('.Splash-Page').removeClass("hidden");
        $('.Welcome').removeClass("hidden");
        $('.nav-header').addClass("hidden");
        $('.My-Games').addClass("hidden");
    });
}

//fills in the game data for the master list display with radio buttons
function renderGameChoice(game) {
    return `
    <tr><td><input type="radio" name="game" value="${game.name}" />${game.name}</td><td>${game.minPlayers}</td><td>${game.maxPlayers}</td><td>${game.time}</td><td>${game.age}</td><td>${game.coop}</td><td>${game.dice}</td><td>${game.deckBuilding}</td><td>${game.bluffing}</td><td>${game.tokenMovement}</td><td>${game.tokenPlacement}</td><td>${game.setCollecting}</td><td>${game.party}</td><td>${game.trivia}</td><td>${game.expansion}</td></tr>
    `;
}

//returns user from the login page to the main page
function handleReturnFromLogin() {
	$('.login-to-main').on('click', event => {
		$('.Login-Page').addClass("hidden");
		$('.Welcome').removeClass("hidden");
		$('.Login-Error').empty();
	});
}

//switches to the account creation page from the main page
function handleCreateAccount() {
	$('.open-create-account').on('click', event => {
		$('.Welcome').addClass("hidden");
		$('.Create-Account-Page').removeClass("hidden");
	});
}

//submits information for account creation and displays the new users home page
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

//returns user from the account creation page to the main page
function handleReturnFromCreate() {
	$('.create-to-main').on('click', event => {
		$('.Create-Account-Page').addClass("hidden");
		$('.Welcome').removeClass("hidden");
	});
}

$(start);