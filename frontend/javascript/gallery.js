import { reloadCSS, checkSession, getAllPosts, getAllUsers, sendLike, sendComment} from './utils.js'

export async function gallery(container, callback) {

	const userSession = await checkSession()

	let usersPosts = null;
	let usersList = null;
	let posts = null;

	usersPosts = await getAllPosts()

	if (userSession.logged == true) {
		usersList = await getAllUsers()
	}

	console.log(usersList)

	posts = usersPosts.posts.reverse();

	const postsPerPage = 12;
	let currentPage = 1;

	container.innerHTML =
			`<div id="gallery">
				<div id="logo-block">
					<h1 id="nav-logo">Camagru</h1>
				</div>
				<nav id="navbar">
					<ul id="nav-links" class="nav-links">
						<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
						<li><a href="#gallery"><i style="color: #ff0059" class="fa-solid fa-magnifying-glass"></i></a></li>
						<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>
						<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>
						<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
					</ul>
				</nav>
				<div id="gallery-container">
					<div id="gallery-posts">
					</div>
				</div>
				<div id="pagination-controls">
						<p id="prev-page" disabled>Back</p>
						<p id="next-page">Next</p>
				</div>
			</div>`

	if (userSession.logged == false) {
		const navElement = document.getElementById('nav-links');
		navElement.innerHTML = `
			<li><a href="#login"><i class="fa-solid fa-house"></i></a></li>
			<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
			<li><a href="#login"><i class="fa-regular fa-square-plus"></i></a></li>
			<li><a href="#login"><i class="fa-solid fa-user"></i></a></li>
			<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
			`
	}

	const homeContainer = document.getElementById('gallery');
	const galleryContainer = document.getElementById('gallery-container');
	const postsContainer = document.getElementById('gallery-posts');
	const prevButton = document.getElementById('prev-page');
	const nextButton = document.getElementById('next-page');

	function renderPage(page) {
		postsContainer.innerHTML = '';
		const start = (page - 1) * postsPerPage;
		const end = page * postsPerPage;
		const postsToShow = posts.slice(start, end);

		postsToShow.forEach((post) => {
			const postElement = document.createElement('div');
			postElement.className = 'post';
			postElement.innerHTML = `
				<img id ="imgsrc" src="${post.post_path}" alt="${post.description}" />`;
			postsContainer.appendChild(postElement);
		});

		prevButton.disabled = page === 1;
		nextButton.disabled = end >= posts.length;

		const userPosts = document.querySelectorAll('.post');
		let index = 0;
		for (let i = 0; userPosts[i]; i++) {
			userPosts[i].addEventListener('click', () => {
				if (userSession.logged == false)
					window.location.href = '/#login';
				else {
					let totalLikes = null;
					posts[i].likes.forEach(like => {
						if (posts[i].id === like.post_id)
							totalLikes++;
					});
					let textLike = totalLikes === 1 ? "like" : "likes";
					const focusedElement = document.createElement('div')
					focusedElement.setAttribute("id", "focused-section");
					index = postsToShow[i].id;
					focusedElement.innerHTML = `
					<i id="exit-focus-icon" class="fa-solid fa-xmark"></i>
					<div id="focused-post">
						<div id="focused-post-img">
							<img src="${postsToShow[i].post_path}" alt="${postsToShow[i].description}" />
						</div>
						<div id="focused-post-section">
							<div id="comment-display-section">

							</div>
							<div id="react-section">
								<p><strong>${postsToShow[i].likes.length}</strong> ${textLike}</p>
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
					`;
					galleryContainer.appendChild(focusedElement);
					homeContainer.setAttribute("style", "overflow: hidden;")

					const exitButton = document.getElementById("exit-focus-icon");
					const focusedSection = document.getElementById("focused-section");
					const sendLikeIcon = document.getElementById("post-like-icon");
					const commentDisplay = document.getElementById("comment-display-section");
					const sendCommentButton = document.getElementById("send-comment");

					for (let like = 0; postsToShow[i].likes[like]; like++) {
						if (postsToShow[i].likes[like].user_id == document.cookie.split('=')[1]) {
							sendLikeIcon.style.color = "rgb(255, 89, 89)";
						}
					}

					for (let c = 0; postsToShow[i].comments[c]; c++) {
						const userComment = document.createElement('p');
						userComment.setAttribute("id", "userComment")
						console.log(postsToShow[i].comments[c])
						userComment.innerHTML = `
						<strong>${usersList[postsToShow[i].comments[c].user_id - 1].username}:</strong> ${postsToShow[i].comments[c].comment}
						`;
						commentDisplay.appendChild(userComment);
					}

					exitButton.addEventListener('click', () => {
						focusedSection.remove();
						homeContainer.setAttribute("style", "overflow: visible;")
					})

					sendLikeIcon.addEventListener('click', () => {
						sendLike(index);
						gallery(container, () => {
							const userPosts = document.querySelectorAll('.post');
							userPosts[i].click();
						});
					})

					const form = document.getElementById('post-comment-form');
					const commentInput = document.getElementById('comment-input-form');

					sendCommentButton.addEventListener('click', () => {
						if (form.checkValidity()) {
							const commentValue = commentInput.value;
							const post_id = postsToShow[i].id;
							sendComment(post_id, commentValue);

							gallery(container, () => {
								const userPosts = document.querySelectorAll('.post');
								userPosts[i].click();
							});
						} else {
							form.reportValidity();
						}
					});


				}
			})
		}
	}

	renderPage(currentPage);

	if (callback && typeof callback === 'function') {
		callback();
	}

	prevButton.addEventListener('click', () => {
		if (currentPage > 1) {
			currentPage--;
			renderPage(currentPage);
		}
	});

	nextButton.addEventListener('click', () => {
		if (currentPage * postsPerPage < posts.length) {
			currentPage++;
			renderPage(currentPage);
		}
	});

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
				window.location.href = '/#login';
				return ;
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		})
	})
}
