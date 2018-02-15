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
		var user = $('#user-create').val();
		console.log(user);
		var pass1 = $('#password-create').val();
		console.log(pass1);
		var pass2 = $('#password-confirm').val();
		console.log(pass2);
	});
}

function handleReturnFromCreate() {
	$('.create-to-main').on('click', event => {
		$('.Create-Account-Page').addClass("hidden");
		$('.Welcome').removeClass("hidden");
	});
}

$(start);