// Calls this function when the window is loaded
window.onload = function () {
	getRestaurants();
};

// Gets restaurants using GET request
const getRestaurants = () => {
	const authToken = sessionStorage.getItem('authToken');

	$.ajax({
		type: 'GET',
		url: 'http://localhost:3000/restaurant',
		headers: {
			'X-Authorization': authToken,
		},
		success: handleRestaurants.bind(this),
	});
};

// Handles the restaurants from response
const handleRestaurants = (results) => {
	// Resets the drop down menu
	$('#restaurantDropDown').children().remove();
	for (let i = 0; i < results.length; i++) {
		const restaurantName = results[i].restaurantName;

		// Creates the elements needed to dynamically generate results
		const li = document.createElement('li');
		const link = document.createElement('a');
		const text = document.createTextNode(restaurantName);

		link.appendChild(text);
		link.href = '#';
		link.id = results[i].restaurantID;
		link.onclick = function (event) {
			getSingleRestaurant(event);
		}.bind(this);
		li.appendChild(link);
		$('#restaurantDropDown').append(li);
	}
};

// Sends post request to server to add new restaurant
const addRestaurant = () => {
	// Gets data from html forms
	const username = $('#managerUsername').val();
	const password = $('#managerPassword').val();
	const firstName = $('#managerFirstName').val();
	const lastName = $('#managerLastName').val();
	const restaurantName = $('#restaurantName').val();

	const authToken = sessionStorage.getItem('authToken');

	if (
		username !== '' &&
		password !== '' &&
		firstName !== '' &&
		lastName !== '' &&
		restaurantName !== ''
	) {
		$('#missingData')[0].setAttribute('hidden', true);
		const data = {
			restaurantName: restaurantName,
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
		};

		const formattedData = JSON.stringify(data);

		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/restaurant',
			contentType: 'application/json',
			headers: { 'X-Authorization': authToken },
			data: formattedData,
			success: addSuccess.bind(this),
		});
	} else {
		$('#missingData')[0].removeAttribute('hidden');
	}
};

// This is called when the restaurant is added successfully
const addSuccess = () => {
	getRestaurants();
	alert('Restaurant Added');
	$('#addRestaurant').modal('hide');
};

// Sends get request to server for a single restaurant
const getSingleRestaurant = (event) => {
	const restaurantID = event.toElement.id;

	const authToken = sessionStorage.getItem('authToken');

	$.ajax({
		type: 'GET',
		url: 'http://localhost:3000/restaurant/' + restaurantID,
		headers: { 'X-Authorization': authToken },
		success: handleSingleRestaurant.bind(this),
	});
};

// Shows the data on the webpage
const handleSingleRestaurant = (result) => {
	$('#updateRestaurantID').val(result.restaurantID);
	$('#updateRestaurantName').val(result.restaurantName);
	$('#updateRestaurant').modal('show');
};

// Sends PUT request to server
const updateRestaurant = () => {
	const restaurantID = $('#updateRestaurantID').val();
	const restaurantName = $('#updateRestaurantName').val();

	const authToken = sessionStorage.getItem('authToken');

	if (restaurantName !== '') {
		$('#missingName')[0].setAttribute('hidden', true);
		const data = {
			restaurantName: restaurantName,
		};

		const formattedData = JSON.stringify(data);

		$('#updateRestaurant').modal('hide');

		$.ajax({
			type: 'PUT',
			url: 'http://localhost:3000/restaurant/' + restaurantID,
			contentType: 'application/json',
			headers: { 'X-Authorization': authToken },
			data: formattedData,
			success: updateSuccess.bind(this),
		});
	} else {
		$('#missingName')[0].removeAttribute('hidden');
	}
};

// Called when update is a success
const updateSuccess = () => {
	getRestaurants();
	alert('Updated Restaurant');
};

// Sends DELETE Request to server
const removeRestaurant = () => {
	const restaurantID = $('#updateRestaurantID').val();

	const authToken = sessionStorage.getItem('authToken');

	$.ajax({
		type: 'DELETE',
		url: 'http://localhost:3000/restaurant/' + restaurantID,
		headers: { 'X-Authorization': authToken },
		success: removeSuccess.bind(this),
	});
};

// Function runs with successful delete
const removeSuccess = (response) => {
	getRestaurants();
	alert('Successfully Deleted Restaurant');
	$('#updateRestaurant').modal('hide');
};
