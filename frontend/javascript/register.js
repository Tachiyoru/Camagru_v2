import { reloadCSS } from './utils.js';

export function register(container) {
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
				<div id="register" class="form-container">
					<h1 id="logo">Camagru</h1>
					<h2 id="slogan"><span class="slogan">Connect</span> and <span class="slogan">share</span> with <span class="slogan">people</span> from all over the <span class="slogan">world</span></h1>
					<form id="registerForm" action="register" method="POST">
						<input id="username" type="text" name="username" placeholder="Username" required>
						<input id="email" type="email" name="email" placeholder="Email" required>
						<input id="password" type="password" name="password" placeholder="Password" required>
						<button type="submit">Sign up</button>
					</form>
					<div>
						<p id="error-message" style="color: red; display: none;"></p>
						<p>Have an account? <a href="#login">Log in</a></p>
					</div>
				</div>
			</div> `


			reloadCSS();

			const app = document.getElementById('app');
			console.log("register :", app);
			app.style.alignItems = "center";

			document.getElementById('registerForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const formData = {
					username: document.getElementById('username').value,
					email: document.getElementById('email').value,
					password: document.getElementById('password').value
				};

				fetch('http://localhost:8000/register', {
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
						window.location.href = '/#login';
					} else {
						const errorMessageElement = document.getElementById('error-message');
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
