const logout = () => {
	const authToken = sessionStorage.getItem('authToken');

	$.ajax({
		type: 'PUT',
		url: 'http://localhost:3000/logout',
		headers: { 'X-Authorization': authToken },
		success: logoutSuccess.bind(this),
	});
};

const logoutSuccess = (response) => {
	sessionStorage.clear();
	window.location.replace('../html/index.html');
};
