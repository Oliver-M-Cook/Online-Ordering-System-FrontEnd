const addStaff = () => {
	const username = $('#username').val();
	const password = $('#password').val();
	const firstName = $('#firstName').val();
	const lastName = $('#lastName').val();

	const role = $('#roleSelect').val();

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	if (
		username !== '' &&
		password !== '' &&
		firstName !== '' &&
		lastName !== ''
	) {
		$('#missingStaffData')[0].setAttribute('hidden', true);

		const data = {
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
		};

		const formattedData = JSON.stringify(data);

		$('#addStaff').modal('hide');

		if (role === 'waiter') {
			let url = 'http://localhost:3000/restaurant/';
			url += restaurantID + '/waiter';

			$.ajax({
				type: 'POST',
				url: url,
				contentType: 'application/json',
				headers: { 'X-Authorization': authToken },
				data: formattedData,
				success: addSuccess.bind(this),
			});
		} else if (role === 'kitchen') {
			let url = 'http://localhost:3000/restaurant/';
			url += restaurantID + '/kitchen';

			$.ajax({
				type: 'POST',
				url: url,
				contentType: 'application/json',
				headers: { 'X-Authorization': authToken },
				data: formattedData,
				success: addSuccess.bind(this),
			});
		}
	} else {
		$('#missingStaffData')[0].removeAttribute('hidden');
	}
};

const addSuccess = (response) => {
	alert(response);
};

const getStaff = () => {
	const role = $('#searchRole').val();

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	if (role === 'waiter') {
		let url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/waiter';

		$.ajax({
			type: 'GET',
			url: url,
			headers: { 'X-Authorization': authToken },
			success: getSuccess.bind(this),
		});
	} else if (role === 'kitchen') {
		let url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/kitchen';

		$.ajax({
			type: 'GET',
			url: url,
			headers: { 'X-Authorization': authToken },
			success: getSuccess.bind(this),
		});
	}
};

const getSuccess = (response) => {
	$('#viewStaffBody').children().remove();

	const table = document.createElement('table');
	table.setAttribute('class', 'table table-striped');

	const thead = document.createElement('thead');
	const tr = document.createElement('tr');

	const headOne = document.createElement('th');
	headOne.innerHTML = 'First Name';

	const headTwo = document.createElement('th');
	headTwo.innerHTML = 'Last Name';

	const headThree = document.createElement('th');
	headThree.innerHTML = 'Username';

	const headFour = document.createElement('th');
	headFour.innerHTML = 'Remove';

	tr.append(headOne, headTwo, headThree, headFour);
	thead.append(tr);
	table.append(thead);

	const tableBody = document.createElement('tbody');

	for (let i = 0; i < response.length; i++) {
		const tr = document.createElement('tr');
		$(tr).data('userID', response[i].userID);
		$(tr).data('roleID', response[i].roleID);

		const columnOne = document.createElement('td');
		columnOne.innerHTML = response[i].firstName;

		const columnTwo = document.createElement('td');
		columnTwo.innerHTML = response[i].lastName;

		const columnThree = document.createElement('td');
		columnThree.innerHTML = response[i].username;

		const columnFour = document.createElement('td');
		const button = document.createElement('button');
		button.setAttribute('type', 'button');
		button.setAttribute('class', 'btn btn-danger');
		button.innerHTML = 'Remove';
		$(button).click(function () {
			handleRemoveStaff(this);
		});
		columnFour.append(button);

		tr.append(columnOne, columnTwo, columnThree, columnFour);
		tableBody.append(tr);
	}

	table.append(tableBody);

	$('#viewStaffBody').append(table);

	$('#viewStaff').modal('show');
};

const handleRemoveStaff = (event) => {
	const userID = $(event).closest('tr').data('userID');
	const roleID = $(event).closest('tr').data('roleID');

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	let url = null;

	if (roleID === 2) {
		console.log('waiter');
		url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/waiter/' + userID;
	} else if (roleID === 3) {
		console.log('Kitchen');
		url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/kitchen/' + userID;
	}

	$(event).closest('tr').remove();

	$.ajax({
		type: 'DELETE',
		url: url,
		headers: { 'X-Authorization': authToken },
		success: removeStaffSuccess.bind(this),
	});
};

const removeStaffSuccess = (response) => {
	alert(response);
};

const addItem = () => {
	const itemName = $('#itemName').val();
	const price = $('#price').val();
	const calories = $('#calories').val();
	const category = $('#category').val();

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	if (itemName !== '' && price !== '' && calories !== '' && category !== '') {
		$('#missingDataAdd')[0].setAttribute('hidden', true);
		const data = {
			itemName: itemName,
			price: price,
			calories: calories,
			category: category,
		};

		console.log(data);

		const formattedData = JSON.stringify(data);

		let url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/item';

		$.ajax({
			type: 'POST',
			url: url,
			contentType: 'application/json',
			headers: { 'X-Authorization': authToken },
			data: formattedData,
			success: addItemSuccess.bind(this),
		});
	} else {
		$('#missingDataAdd')[0].removeAttribute('hidden');
	}
};

const addItemSuccess = (response) => {
	$('#addMenuItem').modal('hide');
	alert(response);
};

const getItems = () => {
	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	let url = 'http://localhost:3000/restaurant/';
	url += restaurantID + '/item';

	$.ajax({
		type: 'GET',
		url: url,
		headers: { 'X-Authorization': authToken },
		success: getItemSuccess.bind(this),
	});
};

const getItemSuccess = (response) => {
	$('#viewItemsBody').children().remove();

	const table = document.createElement('table');
	table.setAttribute('class', 'table table-striped table-hover');

	const thead = document.createElement('thead');
	const tr = document.createElement('tr');

	const headOne = document.createElement('th');
	headOne.innerHTML = 'Item Name';

	const headTwo = document.createElement('th');
	headTwo.innerHTML = 'Price';

	const headThree = document.createElement('th');
	headThree.innerHTML = 'Calories';

	const headFour = document.createElement('th');
	headFour.innerHTML = 'Category';

	tr.append(headOne, headTwo, headThree, headFour);
	thead.append(tr);
	table.append(thead);

	const tableBody = document.createElement('tbody');

	for (let i = 0; i < response.length; i++) {
		const tr = document.createElement('tr');
		$(tr).data('itemID', response[i].itemID);
		$(tr).click(function () {
			getSingleItem(this);
		});

		const columnOne = document.createElement('td');
		columnOne.innerHTML = response[i].itemName;

		const columnTwo = document.createElement('td');
		columnTwo.innerHTML = response[i].price;

		const columnThree = document.createElement('td');
		columnThree.innerHTML = response[i].calories;

		const columnFour = document.createElement('td');
		columnFour.innerHTML = response[i].category;

		tr.append(columnOne, columnTwo, columnThree, columnFour);
		tableBody.append(tr);
	}

	table.append(tableBody);

	$('#viewItemsBody').append(table);

	$('#viewItems').modal('show');
};

const getSingleItem = (event) => {
	const itemID = $(event).data('itemID');

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	let url = 'http://localhost:3000/restaurant/';
	url += restaurantID + '/item/' + itemID;

	$.ajax({
		type: 'GET',
		url: url,
		headers: { 'X-Authorization': authToken },
		success: getSingleItemSuccess.bind(this),
	});
};

const getSingleItemSuccess = (response) => {
	const itemID = $('#singleItemID').val(response.itemID);
	const itemName = $('#singleItemName').val(response.itemName);
	const itemPrice = $('#singleItemPrice').val(response.price);
	const itemCalories = $('#singleItemCalories').val(response.calories);
	const itemCategory = $('#singleItemCategory').val(response.category);

	$('#viewItems').modal('hide');
	$('#viewSingleItem').modal('show');
};

const removeItem = () => {
	const itemID = $('#singleItemID').val();

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	let url = 'http://localhost:3000/restaurant/';
	url += restaurantID + '/item/' + itemID;

	$.ajax({
		type: 'DELETE',
		url: url,
		headers: { 'X-Authorization': authToken },
		success: removeItemSuccess.bind(this),
	});
};

const removeItemSuccess = (response) => {
	alert(response);
	$('#viewSingleItem').modal('hide');
};

const updateItem = () => {
	const itemID = $('#singleItemID').val();
	const itemName = $('#singleItemName').val();
	const itemPrice = $('#singleItemPrice').val();
	const itemCalories = $('#singleItemCalories').val();
	const itemCategory = $('#singleItemCategory').val();

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	if (
		itemName !== '' &&
		itemName !== '' &&
		itemCalories !== '' &&
		itemCategory !== ''
	) {
		$('#missingDataUpdate')[0].setAttribute('hidden', true);
		const data = {
			itemName: itemName,
			price: itemPrice,
			calories: itemCalories,
			category: itemCategory,
		};

		const formattedData = JSON.stringify(data);

		let url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/item/' + itemID;

		$.ajax({
			type: 'PUT',
			url: url,
			contentType: 'application/json',
			headers: { 'X-Authorization': authToken },
			data: formattedData,
			success: updateItemSucess.bind(this),
		});
	} else {
		$('#missingDataUpdate')[0].removeAttribute('hidden');
	}
};

const updateItemSucess = (response) => {
	alert(response);
	$('#viewSingleItem').modal('hide');
};
