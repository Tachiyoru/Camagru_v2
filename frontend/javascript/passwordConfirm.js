import { reloadCSS } from './utils.js';

export function passwordConfirm(container) {
	container.innerHTML = `
	<div class="main-form-container">
		<div id="accountConfirm"> +
			<h1 id="logo">Camagru</h1> +
			<i class="fa-solid fa-circle-check"></i> +
			<p>Password successfully updated ! </p> +
			<p><a href="#login" class="website-access-form-link">Log in</a></p> +
		</div>
	</div> `

	reloadCSS();
}
