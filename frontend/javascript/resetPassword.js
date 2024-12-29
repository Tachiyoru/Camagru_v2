import { reloadCSS } from './utils.js';

export function resetPassword(container) {
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
			window.location.href = '/#home';
		} else {
			container.innerHTML = `
			<div class="main-form-container">
				<div id="resetPassword" class="form-container">
					<h1 id="logo">Camagru</h1>
					<form id="resetPasswordForm" action="login" method="POST">
					<div id="textPosition">
						<p>Forgot your <strong><span>password</span></strong> ?</p>
						<p><strong><span>Enter</span></strong> your email to get your <strong><span>reset</span></strong> link</p>
					</div>
					<input id="email" type="email" name="email" placeholder="Email" required>
					<button type="submit">Send</button>
					<p id="error-message" style="color: red; display: none;"></p>
					</form>
				</div>
			</div> `


			const app = document.getElementById('app');
			app.style.alignItems = "center";

			document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const formData = {
					email: document.getElementById('email').value
				};

				fetch('http://localhost:8000/resetPassword', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify(formData)
				})
				.then(response => response.json())
				.then(data => {
					if (!data.error) {
						window.location.href = '/#login';
					} else {
						const errorMessageElement = document.getElementById("error-message");
						errorMessageElement.textContent = data.error;
						errorMessageElement.style.display = 'block';
					}
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			});
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
