import { passwordConfirm } from './passwordConfirm.js';
import { accountConfirm } from './accountConfirm.js'
import { resetPassword } from './resetPassword.js';
import { newPassword } from './newPassword.js';
import { register } from './register.js';
import { gallery } from './gallery.js';
import { profil } from './profil.js';
import { login } from './login.js';
import { post } from './post.js';
import { home } from './home.js';

export function router() {
	const app = document.getElementById('app');
	const route = window.location.hash;

	if (route.startsWith('#accountConfirm')) {
		accountConfirm(app);
	} else if (route.startsWith('#newPassword')) {
		newPassword(app);
	} else if (route === '#passwordConfirm') {
		passwordConfirm(app);
	} else if (route === '#gallery') {
		gallery(app);
	} else if (route === '#register') {
		register(app);
	} else if (route === '#login') {
		login(app);
	} else if (route.startsWith('#profil')) {
		profil(app);
	} else if (route === '#resetPassword') {
		resetPassword(app);
	} else if (route === '#post') {
		post(app);
	} else if (route === '#home') {
		home(app);
	} else {
		app.innerHTML = '<h1>404 Not Found</h1>';
	}
}

