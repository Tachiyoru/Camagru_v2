import { reloadCSS } from './utils.js';

export function accountConfirm(container) {
	const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
	const userToken = urlParams.get('token');

	if (!userToken) {
		console.error("Token non trouvé dans l'URL");
		return;
	}
	fetch(`http://localhost:8000/verify?token=${userToken}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	.then(response => response.json())
	.then(() => {
		container.innerHTML = `
		<div class="main-form-container">
			<div id="accountConfirm" class="form-container">
				<h1 id="logo">Camagru</h1>
				<i class="fa-solid fa-circle-check"></i>
				<p>Account succesfully confirmed ! </p>
				<p><a href="#login">Log in</a></p>
			</div>
		</div>`

		const app = document.getElementById('app');
		app.style.alignItems = "center";
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
