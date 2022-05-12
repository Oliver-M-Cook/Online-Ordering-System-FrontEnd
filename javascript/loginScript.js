// This function gets the form data
const getFormData = () => {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const formData = {
		username: username,
		password: password,
	};

	sendLoginData(formData);
};

// Sends POST to server to login
const sendLoginData = (jsonData) => {
	const formattedData = JSON.stringify(jsonData);

	$.ajax({
		type: 'POST',
		url: 'http://localhost:3000/login',
		contentType: 'application/json',
		data: formattedData,
		success: loginSuccess.bind(this),
		error: loginFailure.bind(this),
	});
};

// This function is called if the login fails
const loginFailure = () => {
	const div = $('#incorrectLogin');
	div[0].removeAttribute('hidden');
};

// This function is called when the login is a success
const loginSuccess = (response) => {
	// Stores the authToken in session storage
	sessionStorage.setItem('authToken', response.authToken);

	// If statements load the right page for the role
	if (response.restaurantID) {
		sessionStorage.setItem('restaurantID', response.restaurantID);
	}
	if (response.roleID === 5) {
		window.location.replace('../html/admin.html');
	} else if (response.roleID === 4) {
		window.location.replace('../html/manager.html');
	} else if (response.roleID === 2) {
		window.location.replace('../html/menu.html');
	} else if (response.roleID === 1) {
		getRestaurants();
	} else if (response.roleID === 3) {
		window.location.replace('../html/kitchen.html');
	}
};

// Collects the data from the form
const handleSignUpData = () => {
	const username = $('#customerUsername').val();
	const password = $('#customerPassword').val();
	const firstName = $('#customerFirstName').val();
	const lastName = $('#customerLastName').val();

	if (
		username !== '' &&
		password !== '' &&
		firstName !== '' &&
		lastName !== ''
	) {
		const data = {
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
		};

		const formattedData = JSON.stringify(data);

		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/user/customer',
			contentType: 'application/json',
			data: formattedData,
			success: handleSignUpSuccess.bind(this),
		});
	} else {
		$('#missingData')[0].removeAttribute('hidden');
	}
};

// This function is called when the sign up is a success
const handleSignUpSuccess = (response) => {
	alert('Account Created');
	$('#signUp').modal('hide');
};

// This function sends GET request to the server
const getRestaurants = () => {
	const authToken = sessionStorage.getItem('authToken');

	$.ajax({
		type: 'GET',
		url: 'http://localhost:3000/restaurant',
		headers: { 'X-Authorization': authToken },
		success: handleRestaurantsSuccess.bind(this),
	});
};

// This function is called when the restaurants and returned
const handleRestaurantsSuccess = (response) => {
	$('#restaurantSelectBody').children().remove();

	// Creates the elements needed to show the data
	const formGroup = document.createElement('div');
	formGroup.setAttribute('class', 'form-group');

	const label = document.createElement('label');
	label.setAttribute('for', 'selectRestaurant');
	label.innerHTML = 'Restaurants';

	const select = document.createElement('select');
	select.setAttribute('class', 'form-control');
	select.setAttribute('id', 'selectRestaurant');

	// Loops through the data and creates elements needed to show the data
	for (let i = 0; i < response.length; i++) {
		const option = document.createElement('option');
		option.setAttribute('value', response[i].restaurantID);
		option.innerHTML = response[i].restaurantName;

		select.append(option);
	}

	formGroup.append(label, select);
	$('#restaurantSelectBody').append(formGroup);
	$('#restaurantSelectModal').modal('show');
};

// This function sets the data needed to view the menu
const handleSelectRestaurant = () => {
	const restaurantID = $('#selectRestaurant').val();

	sessionStorage.setItem('restaurantID', restaurantID);

	window.location.replace('../html/menu.html');
};
