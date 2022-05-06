let intervalID = null;

window.onload = function () {
	getOrders();
	intervalID = setInterval(getOrders, 15000);
};

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

const getOrdersSuccess = (response) => {
	console.log(response);

	$('#orderContainer').children().remove();

	for (let i = 0; i < response.length; i++) {
		const divOne = document.createElement('div');
		divOne.setAttribute('class', 'col-xs-3');

		const divTwo = document.createElement('div');
		divTwo.setAttribute('class', 'thumbnail');

		const divThree = document.createElement('div');
		divThree.setAttribute('class', 'caption');

		const title = document.createElement('h6');
		title.innerHTML = 'Table Number: ' + response[i].tableNumber;

		divThree.append(title);

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

		divTwo.append(divThree);
		divOne.append(divTwo);
		$('#orderContainer').append(divOne);
	}
};

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

const clearTableSuccess = (response) => {
	getOrders();
};

const handleLogout = () => {
	clearInterval(intervalID);
	logout();
};
