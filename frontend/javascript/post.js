import { checkSession, getAllPostsOfUser } from "./utils.js";

export async function post(container) {
	const userSession = await checkSession();

	if (userSession.logged == false) {
		window.location.href = '/#login';
		return ;
	}

	let userPosts = await getAllPostsOfUser();

	userPosts = userPosts.reverse();

	container.innerHTML =
		`<div id="postPage">
			<div id="logo-block">
				<h1 id="nav-logo">Camagru</h1>
			</div>
			<nav id="navbar">
				<ul id="nav-links" class="nav-links">
					<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
					<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
					<li><a href="#post"><i style="color: #ff0059" class="fa-regular fa-square-plus"></i></a></li>
					<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>
					<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
				</ul>
			</nav>
			<div id="post-section">
				<div id="main-section">
					<div id="preview">
						<video id="webcam" autoplay playsinline></video>
						<canvas id="canvas" style="display: none;"></canvas>
					</div>
					<div id="superposable-images"></div>
					<button id="capture-button" disabled>Capture</button>
					<input type="file" id="image-upload" accept="image/*">
				</div>
				<div id="side-section">
					<h3>Previous Pictures</h3>
					<div id="thumbnails"></div>
				</div>
			</div>
		</div>`;

	const app = document.getElementById('app');
	app.style.alignItems = "center";

	let upload = 0;
	const webcam = document.getElementById("webcam");
	const canvas = document.getElementById("canvas");
	const captureButton = document.getElementById("capture-button");
	const superposableImagesContainer = document.getElementById("superposable-images");
	const thumbnailsContainer = document.getElementById("thumbnails");
	const imageUpload = document.getElementById("image-upload");

	const superposableImages = [
		"../assets/stickers/captain.png",
		"../assets/stickers/ironman.png",
		"../assets/stickers/thor.png",
		"../assets/stickers/loki.png",
		"../assets/stickers/spidey.png"
	];

	userPosts.forEach((post) => {
		const previousPost = document.createElement('img');
		previousPost.src = post.post_path;
		previousPost.classList.add("previous-post");
		thumbnailsContainer.appendChild(previousPost);
	})


	superposableImages.forEach((src) => {
		const img = document.createElement("img");
		img.src = src;
		img.classList.add("sticker");

		img.addEventListener("mousedown", (e) => {
			// Créer une copie du sticker
			const clone = img.cloneNode(true);
			clone.classList.add("draggable");
			clone.style.position = "absolute";
			clone.style.width = "150px";
			activateCaptureButton();

			// Calculer les coordonnées relatives au conteneur
			const containerRect = superposableImagesContainer.getBoundingClientRect();
			const offsetX = e.clientX - containerRect.left - parseInt(clone.style.width) / 2;
			const offsetY = e.clientY - containerRect.top - parseInt(clone.style.width) / 2;

			clone.style.left = `${offsetX}px`;
			clone.style.top = `${offsetY}px`;

			// Ajouter le clone au conteneur
			superposableImagesContainer.appendChild(clone);

			// Initialiser le déplacement
			const shiftX = e.clientX - clone.getBoundingClientRect().left;
			const shiftY = e.clientY - clone.getBoundingClientRect().top;

			// Déplacer le sticker
			const moveAt = (clientX, clientY) => {
				const newLeft = clientX - containerRect.left - shiftX;
				const newTop = clientY - containerRect.top - shiftY;

				clone.style.left = `${newLeft}px`;
				clone.style.top = `${newTop}px`;
			};

			// Suivre les mouvements de la souris
			const onMouseMove = (moveEvent) => {
				moveAt(moveEvent.clientX, moveEvent.clientY);
			};

			document.addEventListener("mousemove", onMouseMove);

			// Fixer la position finale au relâchement
			document.addEventListener("mouseup", () => {
					document.removeEventListener("mousemove", onMouseMove);

					// Après avoir relâché, rendre le clone déplaçable à nouveau
					clone.addEventListener("mousedown", (e) => {
						document.addEventListener("mousemove", onMouseMove);

						document.addEventListener("mouseup", (ev) => {
								document.removeEventListener("mousemove", onMouseMove);
							},
							{ once: true }
						);
						e.preventDefault();
					});
				},
				{ once: true }
			);

			// Empêcher tout autre comportement par défaut
			e.preventDefault();
		});

		superposableImagesContainer.appendChild(img);
	});

	function activateCaptureButton() {
		captureButton.disabled = false;
		captureButton.classList.add("active");
	}

	navigator.mediaDevices.getUserMedia({ video:
		{width: { ideal: 400 },
		height: { ideal: 400 }}
	 })
		.then((stream) => {
			webcam.srcObject = stream;
		})
		.catch(() => {
			alert("Webcam not accessible. Please use the upload feature.");
		});

	imageUpload.addEventListener("change", (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				// Désactiver le flux vidéo de la webcam
				if (webcam.srcObject) {
					const tracks = webcam.srcObject.getTracks();
					tracks.forEach((track) => track.stop());
					webcam.srcObject = null;
					webcam.style.backgroundImage = `url(${e.target.result})`;
					webcam.style.backgroundSize = 'contain';
				}
			};
			reader.readAsDataURL(file);
			upload = 1;
		}
	});

	captureButton.addEventListener("click", () => {
		const context = canvas.getContext("2d");

		let backgroundImage = null;
		let styles = window.getComputedStyle(webcam);
		let webcamWidth = parseInt(styles.width);
		let webcamHeight = parseInt(styles.height);

		canvas.width = webcamWidth;
		canvas.height = webcamHeight;

		// Fonction pour collecter les stickers et envoyer les données
		const processAndSendData = () => {

			// Collecter les stickers et leurs positions
			const stickersData = [];
			const stickers = document.querySelectorAll('.draggable');
			stickers.forEach(sticker => {
				const parent = webcam.getBoundingClientRect();
				const child = sticker.getBoundingClientRect();
				let stickerSource = sticker.src;
				stickerSource = stickerSource.split("assets/")[1];

				const stickerData = {
					src: stickerSource,
					left: parseInt(child.x) - parseInt(parent.x),
					top: parseInt(child.y) - parseInt(parent.y),
				};
				stickersData.push(stickerData);
			});

			// Envoyer les données au serveur
			fetch("http://localhost:8000/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: canvas.toDataURL(),
					stickers: stickersData,
				}),
				credentials: 'include'
			})
			.then((response) => response.json())
			.then(() => {
				post(container);
			})
			.catch((error) => console.error(error));
		};

		if (upload == 1) {
			backgroundImage = new Image();
			backgroundImage.src = styles.backgroundImage.slice(5, -2);
			backgroundImage.onload = () => {
				context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
				processAndSendData();
			};
		} else {
			// Dessiner l'image du webcam directement
			context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
			processAndSendData();
		}
	});
}

