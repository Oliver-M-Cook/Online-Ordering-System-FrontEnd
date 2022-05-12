let intervalID = null;

// This function is called when the window loads
window.onload = function () {
	getOrders();
	intervalID = setInterval(getOrders, 15000);
};

// Sends GET request to get orders from server
const getOrders = () => {
	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	let url = 'http://localhost:3000/restaurant/';
	url += restaurantID + '/order';

	$.ajax({
		type: 'GET',
		url: url,
		headers: { 'X-Authorization': authToken },
		success: getOrdersSuccess.bind(this),
	});
};

// This function is called when the get request is successful
const getOrdersSuccess = (response) => {
	// Clears the container for new data
	$('#orderContainer').children().remove();

	// Loops through response
	for (let i = 0; i < response.length; i++) {
		// Creates elements to hold the data
		const divOne = document.createElement('div');
		divOne.setAttribute('class', 'col-xs-3');

		const divTwo = document.createElement('div');
		divTwo.setAttribute('class', 'thumbnail');

		const divThree = document.createElement('div');
		divThree.setAttribute('class', 'caption');

		const title = document.createElement('h6');
		title.innerHTML = 'Table Number: ' + response[i].tableNumber;

		divThree.append(title);

		// Loops through orders to append each one to the div
		for (let j = 0; j < response[i].orders.length; j++) {
			const orders = response[i].orders;

			const orderTag = document.createElement('p');
			orderTag.innerHTML = orders[j].quantity + 'x ' + orders[j].itemName;

			divThree.append(orderTag);
		}

		const clearButton = document.createElement('button');
		clearButton.setAttribute('class', 'btn btn-danger');
		clearButton.innerHTML = 'Clear Table';
		$(clearButton).data('tableNumber', response[i].tableNumber);

		$(clearButton).click(function () {
			clearTable(this);
		});

		divThree.append(clearButton);

		// Adds the data to the webpage dynamically
		divTwo.append(divThree);
		divOne.append(divTwo);
		$('#orderContainer').append(divOne);
	}
};

// Calls DELETE request to the server to remove orders with specified table number
const clearTable = (event) => {
	const tableNumber = $(event).data('tableNumber');

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	let url = 'http://localhost:3000/restaurant/';
	url += restaurantID + '/table/' + tableNumber;

	$.ajax({
		type: 'DELETE',
		url: url,
		headers: { 'X-Authorization': authToken },
		success: clearTableSuccess.bind(this),
	});
};

// This function is called when the delete is successful
const clearTableSuccess = (response) => {
	getOrders();
};

// This function logs the user out
const handleLogout = () => {
	clearInterval(intervalID);
	logout();
};
