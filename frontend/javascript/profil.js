import { checkSession, getAllUsers, getAllPostsOfUser, getUser, sendLike, sendComment } from "./utils.js"

export async function profil(container, callback) {

	const urlParams = new URLSearchParams(window.location.hash.split('/')[1]);
    const postNotify = urlParams.get('id');

	const userSession = await checkSession();

	if (userSession.logged == false) {
		window.location.href = '/#login';
		return ;
	}

	const user = await getUser();

	let userPosts = await getAllPostsOfUser();

	userPosts = userPosts.sort((a, b) => b.id - a.id);

	let usersList = await getAllUsers()

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

				<div id="post-container"></div>

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

	const postsContainer = document.getElementById('post-container');

	let postGroup = null;

	userPosts.forEach((post, index) => {
		if (index % 3 == 0) {
			postGroup = document.createElement('div');
			postGroup.className = 'post-group';
			postsContainer.appendChild(postGroup)
		}

		const postElement = document.createElement('div');
		postElement.className = 'post';
		postElement.innerHTML = `
			<img id ="imgsrc" src="${post.post_path}" />`;
		postGroup.appendChild(postElement);
	});

	const editProfileButton = document.getElementById('edit-profile-button');
	const editProfileContainer = document.getElementById('edit-profile-container');

	editProfileButton.addEventListener('click', function(event) {
		event.preventDefault();

		editProfileButton.style.color = "#ff0059";
		editProfileContainer.style.display = "flex";
		postsContainer.style.display = "none";
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
		postsContainer.style.display = "flex";
	})

	const homeContainer = document.getElementById('home');
	const userContainer = document.getElementById('user-container');

	const focusPost = document.querySelectorAll('.post');
	let index = 0;
	for (let i = 0; focusPost[i]; i++) {
		focusPost[i].addEventListener('click', () => {
			const focusedElement = document.createElement('div')
			focusedElement.setAttribute("id", "focused-section");
			index = userPosts[i].id;
			focusedElement.innerHTML = `
			<i id="exit-focus-icon" class="fa-solid fa-xmark"></i>
			<div id="focused-post">
				<div id="focused-post-img">
					<img src="${userPosts[i].post_path}" alt="${userPosts[i].description}" />
				</div>
				<div id="focused-post-section">
					<div id="comment-display-section">

					</div>
					<div id="react-section">
						<p><strong>${userPosts[i].likes.length}</strong> likes</p>
						<div id="like-comment-section">
							<i id="post-like-icon" class="fa-solid fa-heart"></i>
							<form id="post-comment-form" action="post-comment" method="POST">
								<label for="comment-input-form"></label>
								<textarea type="text" id="comment-input-form" name="comment-input-form" placeholder="Add a comment..." required></textarea>
							</form>
							<p id="send-comment"><strong>Post</strong></p>
						</div>
					</div>
				</div>
			</div>
			<i id="delete-post-icon" class="fa-regular fa-trash-can"></i>
			`;
			userContainer.appendChild(focusedElement);
			homeContainer.setAttribute("style", "overflow: hidden;")

			const exitButton = document.getElementById("exit-focus-icon");
			const focusedSection = document.getElementById("focused-section");
			const sendLikeIcon = document.getElementById("post-like-icon");
			const commentDisplay = document.getElementById("comment-display-section");
			const sendCommentButton = document.getElementById("send-comment");

			for (let like = 0; userPosts[i].likes[like]; like++) {
				if (userPosts[i].likes[like].user_id == document.cookie.split('=')[1]) {
					sendLikeIcon.style.color = "rgb(255, 89, 89)";
				}
			}

			for (let c = 0; userPosts[i].comments[c]; c++) {
				const userComment = document.createElement('p');
				userComment.setAttribute("id", "userComment")
				userComment.innerHTML = `
				<strong>${usersList[userPosts[i].comments[c].user_id -1].username}:</strong> ${userPosts[i].comments[c].comment}
				`;
				commentDisplay.appendChild(userComment);
			}

			exitButton.addEventListener('click', () => {
				focusedSection.remove();
				homeContainer.setAttribute("style", "overflow: visible;")
			})

			sendLikeIcon.addEventListener('click', () => {
				sendLike(index);
				profil(container, () => {
					const focusPost = document.querySelectorAll('.post');
					focusPost[i].click();
				});
			})

			const form = document.getElementById('post-comment-form');
			const commentInput = document.getElementById('comment-input-form');

			sendCommentButton.addEventListener('click', () => {
				if (form.checkValidity()) {
					const commentValue = commentInput.value;
					const post_id = userPosts[i].id;
					sendComment(post_id, commentValue);

					profil(container, () => {
						const focusPost = document.querySelectorAll('.post');
						focusPost[i].click();
					});
				} else {
					form.reportValidity();
				}
			});

			const deletePostIcon = document.getElementById('delete-post-icon');

			deletePostIcon.addEventListener('click', (event) => {
				event.preventDefault()
				fetch('http://localhost:8000/deletePost', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: userPosts[i].id
				})
				.then(response => response.json)
				.then(() => {
					profil(container);
				})
				.catch((error) => {
					console.error('Error:', error);
				})
			});
		});
	}



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
			if (!data.error) {
				app.style.alignItems = "center";
				window.location.href = '/#login';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		})
	})

	if (postNotify != null) {
		const focusPost = document.querySelectorAll('.post');
		for (let i = 0; focusPost[i]; i++) {
			if (userPosts[i].id == postNotify)
				focusPost[i].click();
		}
	}

	if (callback && typeof callback === 'function') {
		callback();
	}

}
