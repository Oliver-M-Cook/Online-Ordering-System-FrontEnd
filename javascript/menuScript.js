window.onload = function () {
	getItems();
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
		success: getItemsSuccess.bind(this),
	});
};

const getItemsSuccess = (response) => {
	const categories = [];
	const sortedItems = {};

	for (let i = 0; i < response.length; i++) {
		if (!categories.includes(response[i].category)) {
			categories.push(response[i].category);
		}
	}

	for (let i = 0; i < categories.length; i++) {
		const tempItems = [];
		for (let j = 0; j < response.length; j++) {
			if (categories[i] === response[j].category) {
				tempItems.push(response[j]);
			}
		}
		sortedItems[categories[i]] = tempItems;
	}

	for (let i = 0; i < categories.length; i++) {
		const li = document.createElement('li');

		if (i === 0) {
			li.setAttribute('class', 'active');
		}

		const link = document.createElement('a');
		link.setAttribute('data-toggle', 'tab');
		link.setAttribute('href', '#' + categories[i]);
		link.innerHTML = categories[i];

		li.append(link);

		createTabContent(categories[i], sortedItems, i);

		$('#categoryTabs').append(li);
	}
	console.log(sortedItems);
};

const createTabContent = (category, sortedItems, iteration) => {
	const divOne = document.createElement('div');
	divOne.setAttribute('id', category);

	if (iteration === 0) {
		divOne.setAttribute('class', 'tab-pane fade in active');
	} else {
		divOne.setAttribute('class', 'tab-pane fade');
	}

	const title = document.createElement('h4');
	title.innerHTML = category;

	const divTwo = document.createElement('div');
	divTwo.setAttribute('class', 'scrolling-wrapper');

	for (let i = 0; i < sortedItems[category].length; i++) {
		const divThree = document.createElement('div');
		divThree.setAttribute('class', 'card');

		const divFour = document.createElement('div');
		divFour.setAttribute('class', 'thumbnail');

		const img = document.createElement('img');
		img.setAttribute('src', '../images/placeholder.png');

		const divFive = document.createElement('div');
		divFive.setAttribute('class', 'caption');

		const thumbnailTitle = document.createElement('h5');
		thumbnailTitle.innerHTML = sortedItems[category][i].itemName;

		const priceTag = document.createElement('p');
		priceTag.innerHTML = '£' + sortedItems[category][i].price;

		const caloriesTag = document.createElement('p');
		caloriesTag.innerHTML = sortedItems[category][i].calories + ' kcals';

		const buttonP = document.createElement('p');

		const button = document.createElement('a');
		button.setAttribute('href', '#');
		button.setAttribute('class', 'btn btn-primary');
		button.setAttribute('role', 'button');
		button.setAttribute('id', sortedItems[category][i].itemID);
		$(button).data('itemName', sortedItems[category][i].itemName);
		$(button).data('price', sortedItems[category][i].price);

		$(button).click(function () {
			addToBasket(this);
		});

		// const addButton = document.createElement('button');
		// addButton.setAttribute('class', 'btn, btn-primary');

		const plusSymbol = document.createElement('span');
		plusSymbol.setAttribute('class', 'glyphicon glyphicon-plus-sign');

		button.append(plusSymbol);
		buttonP.append(button);
		divFive.append(thumbnailTitle, priceTag, caloriesTag, buttonP);
		divFour.append(img, divFive);
		divThree.append(divFour);
		divTwo.append(divThree);
	}
	divOne.append(title, divTwo);

	$('#tabContent').append(divOne);
};

const addToBasket = (event) => {
	const itemID = event.id;
	const itemName = $(event).data('itemName');
	const price = $(event).data('price');

	if (!sessionStorage.getItem('basket')) {
		sessionStorage.setItem('basket', JSON.stringify([]));
	}

	const basket = JSON.parse(sessionStorage.getItem('basket'));

	let existsInBasket = false;

	//{itemID: x, itemName: y, quantity: z, price: q}

	for (let i = 0; i < basket.length; i++) {
		if (basket[i].itemID === itemID) {
			existsInBasket = true;
			basket[i].quantity += 1;

			let tempPrice = basket[i].price;
			tempPrice += price;
			const roundedNum = Math.round((tempPrice + Number.EPSILON) * 100) / 100;

			basket[i].price = roundedNum;
		}
	}

	if (!existsInBasket) {
		const basketItem = {
			itemID: itemID,
			itemName: itemName,
			quantity: 1,
			price: price,
			priceOfOne: price,
		};

		basket.push(basketItem);
	}

	sessionStorage.setItem('basket', JSON.stringify(basket));
};

const showBasket = () => {
	const basket = JSON.parse(sessionStorage.getItem('basket'));

	$('#viewBasketBody').children().remove();

	const table = document.createElement('table');
	table.setAttribute('class', 'table table-striped table-hover');

	const thead = document.createElement('thead');
	const tr = document.createElement('tr');

	const headOne = document.createElement('th');
	headOne.innerHTML = 'Item Name';

	const headTwo = document.createElement('th');
	headTwo.innerHTML = 'Quantity';

	const headThree = document.createElement('th');
	headThree.innerHTML = 'Price';

	tr.append(headOne, headTwo, headThree);
	thead.append(tr);
	table.append(thead);

	const tableBody = document.createElement('tbody');

	for (let i = 0; i < basket.length; i++) {
		const tr = document.createElement('tr');
		$(tr).data('itemID', basket[i].itemID);
		$(tr).data('priceOfOne', basket[i].priceOfOne);

		const columnOne = document.createElement('td');
		columnOne.innerHTML = basket[i].itemName;

		const columnTwo = document.createElement('td');
		columnTwo.innerHTML = basket[i].quantity;

		const columnThree = document.createElement('td');
		columnThree.innerHTML = basket[i].price;

		const columnFour = document.createElement('td');

		const columnFive = document.createElement('td');

		const minuesButton = document.createElement('button');
		minuesButton.setAttribute('class', 'btn btn-danger');
		$(minuesButton).click(function () {
			removeFromBasket(this);
		});

		const minuesSymbol = document.createElement('span');
		minuesSymbol.setAttribute('class', 'glyphicon glyphicon-minus-sign');

		const plusButton = document.createElement('button');
		plusButton.setAttribute('class', 'btn btn-primary');
		$(plusButton).click(function () {
			addToBasketFromModal(this);
		});

		const plusSymbol = document.createElement('span');
		plusSymbol.setAttribute('class', 'glyphicon glyphicon-plus-sign');

		minuesButton.append(minuesSymbol);
		plusButton.append(plusSymbol);
		columnFour.append(minuesButton);
		columnFive.append(plusButton);
		tr.append(columnOne, columnTwo, columnThree, columnFour, columnFive);
		tableBody.append(tr);
	}

	table.append(tableBody);

	let total = 0;

	for (let i = 0; i < basket.length; i++) {
		let tempTotal = total;
		tempTotal += basket[i].price;
		const roundedTotal = Math.round((tempTotal + Number.EPSILON) * 100) / 100;

		total = roundedTotal;
	}

	const p = document.createElement('p');
	const boldText = document.createElement('strong');
	boldText.innerHTML = 'Total: £' + total;

	p.append(boldText);

	$('#viewBasketBody').append(table, p);
	$('#viewBasket').modal('show');
};

const addToBasketFromModal = (event) => {
	const itemID = $(event).closest('tr').data('itemID');
	const priceOfOne = $(event).closest('tr').data('priceOfOne');

	const basket = JSON.parse(sessionStorage.getItem('basket'));

	for (let i = 0; i < basket.length; i++) {
		if (basket[i].itemID === itemID) {
			basket[i].quantity += 1;

			let tempPrice = basket[i].price;
			tempPrice += priceOfOne;
			const roundedNum = Math.round((tempPrice + Number.EPSILON) * 100) / 100;

			basket[i].price = roundedNum;
		}
	}

	sessionStorage.setItem('basket', JSON.stringify(basket));
	showBasket();
};

const removeFromBasket = (event) => {
	const itemID = $(event).closest('tr').data('itemID');
	const priceOfOne = $(event).closest('tr').data('priceOfOne');

	const basket = JSON.parse(sessionStorage.getItem('basket'));

	for (let i = 0; i < basket.length; i++) {
		if (basket[i].itemID === itemID) {
			basket[i].quantity -= 1;

			let tempPrice = basket[i].price;
			tempPrice -= priceOfOne;
			const roundedNum = Math.round((tempPrice + Number.EPSILON) * 100) / 100;

			basket[i].price = roundedNum;

			if (basket[i].quantity === 0) {
				basket.splice(i, 1);
			}
		}
	}
	sessionStorage.setItem('basket', JSON.stringify(basket));
	showBasket();
};

const sendOrder = () => {
	const basket = JSON.parse(sessionStorage.getItem('basket'));

	const tableNumber = $('#tableNumber').val();

	const authToken = sessionStorage.getItem('authToken');
	const restaurantID = sessionStorage.getItem('restaurantID');

	if (tableNumber !== '') {
		$('#missingNumber')[0].setAttribute('hidden', true);
		for (let i = 0; i < basket.length; i++) {
			basket[i].tableNumber = tableNumber;
		}

		const formattedData = JSON.stringify(basket);

		let url = 'http://localhost:3000/restaurant/';
		url += restaurantID + '/order';

		$.ajax({
			type: 'POST',
			url: url,
			contentType: 'application/json',
			headers: { 'X-Authorization': authToken },
			data: formattedData,
			success: orderSuccess.bind(this),
		});
	} else {
		$('#missingNumber')[0].removeAttribute('hidden');
	}
};

const orderSuccess = (response) => {
	alert(response);
	$('#viewBasket').modal('hide');
	sessionStorage.removeItem('basket');
};
