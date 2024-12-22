import { reloadCSS } from './utils.js';

export function newPassword(container) {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const userToken = urlParams.get('token');

    if (!userToken) {
        console.error("Token non trouvé dans l'URL");
        return;
    }
	fetch('http://localhost:8000/checkSession', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (data.logged) {
			console.log('Response:', data);
			window.location.href = '/#home';
		} else {
			console.log('Response:', data);
			container.innerHTML = `
			<div class="main-form-container">
				<div id="newPassword" class="form-container">
					<h1 id="logo">Camagru</h1>
					<form id="newPasswordForm" action="newPassword" method="POST">
						<p><strong><span>Please</span></strong> enter your new <strong><span>password</span></strong></p>
						<input id="password" type="password" name="password" placeholder="New Password" required>
						<input id="confirm-password" type="password" name="confirm-password" placeholder="Confirm Password" required>
						<button type="submit">Send</button>
						<p id="error-message" style="color: red; display: none;"></p>
					</form>
				</div>
			</div> `

			const app = document.getElementById('app');
			console.log("register :", app);
			app.style.alignItems = "center";

			document.getElementById('newPasswordForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const newPassword = document.getElementById('password');
				const confirmedPassword = document.getElementById('confirm-password');

				if (newPassword.value === confirmedPassword.value) {
					const formData = {
						password: confirmedPassword.value,
						token: userToken
					};

					fetch('http://localhost:8000/newPassword', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						credentials: 'include',
						body: JSON.stringify(formData)
					})
					.then(response => response.json())
					.then(data => {
						console.log('Response:', data);
						if (!data.error) {
							window.location.href = '/#passwordConfirm';
						} else {
							const errorMessageElement = document.getElementById("error-message");
							errorMessageElement.textContent = data.error;
							errorMessageElement.style.display = 'block';
						}
					})
					.catch((error) => {
						console.error('Error:', error);
					});
				} else {
					const errorMessageElement = document.getElementById("error-message");
					errorMessageElement.textContent = "Passwords don't match";
					errorMessageElement.style.display = 'block';
				}
			});
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
