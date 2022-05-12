// This function calls the logout request to the server
const logout = () => {
	const authToken = sessionStorage.getItem('authToken');

	$.ajax({
		type: 'PUT',
		url: 'http://localhost:3000/logout',
		headers: { 'X-Authorization': authToken },
		success: logoutSuccess.bind(this),
	});
};

// This function is called on success of the PUT request
const logoutSuccess = (response) => {
	// This clears the session storage
	sessionStorage.clear();
	window.location.replace('../html/index.html');
};
