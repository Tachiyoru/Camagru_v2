import { checkSession, getAllPostsOfUser, getUser } from "./utils.js"

export async function profil(container, callback) {
	const userSession = await checkSession();

	if (userSession.logged == false) {
		window.location.href = '/#login';
		return ;
	}

	const user = await getUser();

	console.log(user)

	const posts = await getAllPostsOfUser();

	console.log(posts);

	container.innerHTML =
		`<div id="home">
			<div id="logo-block">
				<h1 id="nav-logo">Camagru</h1>
			</div>
			<nav id="navbar">
				<ul id="nav-links" class="nav-links">
					<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
					<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
					<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>
					<li><a href="#profil"><i style="color: #ff0059" class="fa-solid fa-user"></i></a></li>
					<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
				</ul>
			</nav>
			<div id="user-container">
				<div id="user-infos" class="user-infos">
					<div class="user-icon">
						<i style="color: #ff0059" class="fa-solid fa-user"></i>
					</div>
					<div class="stats">
						<p><strong>120</strong><br> Likes</p>
						<p><strong>10</strong><br> Posts</p>
						<p><strong>42</strong><br> Comments</p>
					</div>
					<p id="edit-profile-button"><strong>Edit profile</strong></p>
				</div>

				<div id="edit-profile-container" class="edit-profile-container">
					<p><strong>My infos</strong></p>
						<form id="edit-profile-form" action="submit" method="PUT">
							<input id="username" type="text" name="username" placeholder="${user.username}">
							<input id="email" type="email" name="email" placeholder="${user.email}">
							<input id="password" type="password" name="password" placeholder="Password">
							<p id="error-message" style="color: red; display: none;"></p>
							<button type="submit">Update</button>
							<div id="notifications-container"></div>
						</form>

					<i id="exit-edit" class="exit-edit fa-regular fa-circle-xmark"></i>
				</div>
			</div>
		</div>`;

	const app = document.getElementById('app');
	app.style.alignItems = "center";

	const editProfileButton = document.getElementById('edit-profile-button');
	const editProfileContainer = document.getElementById('edit-profile-container');

	editProfileButton.addEventListener('click', function(event) {
		event.preventDefault();

		editProfileButton.style.color = "#ff0059";
		editProfileContainer.style.display = "flex";
	})


	document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
		event.preventDefault();

		const formData = {
			username: document.getElementById('username').value,
			email: document.getElementById('email').value,
			password: document.getElementById('password').value
		};

		try {
			fetch('http://localhost:8000/updateUser', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(formData)
			})
			.then(response => response.json())
			.then(data => {
				profil(container, () => {
					const editProfileButton = document.getElementById('edit-profile-button');
					console.log(editProfileButton);
					editProfileButton.click();
					if (data.error) {
						const errorMessageElement = document.getElementById("error-message");
						errorMessageElement.textContent = data.error;
						errorMessageElement.style.display = 'block';
					}
				})
			})
		}
		catch (error) {
			console.log(error);
		}
	})


	const toggleNotification = document.getElementById("notifications-container");

	if (user.notify == 1) {
		toggleNotification.innerHTML = `
			<p><strong>Turn off</strong> notifications</p><i id="notifyButton" style="color: rgba(252, 176, 69, 1)" class="fa-solid fa-bell"></i>
		`
	} else {
		toggleNotification.innerHTML = `
			<p><strong>Turn on</strong> notifications</p><i id="notifyButton" class="fa-solid fa-bell"></i>
		`
	}

	document.getElementById("notifyButton").addEventListener('click', function(event) {
		event.preventDefault();

		try {
			fetch('http://localhost:8000/toggleNotification', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			})
			.then(() => {
				profil(container, () => {
					const editProfileButton = document.getElementById('edit-profile-button');
					console.log(editProfileButton);
					editProfileButton.click();
				})
			})
		}
		catch (error) {
			console.log(error);
		}

	})

	document.getElementById("exit-edit").addEventListener('click', function(event) {
		event.preventDefault();

		editProfileButton.style.color = "unset";
		editProfileContainer.style.display = "none";
	})

	document.getElementById('logoutButton').addEventListener('click', function(event) {
		event.preventDefault();
		fetch('http://localhost:8000/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
		})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			if (!data.error) {
				app.style.alignItems = "center";
				window.location.href = '/#login';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		})
	})

	if (callback && typeof callback === 'function') {
		callback();
	}

}
