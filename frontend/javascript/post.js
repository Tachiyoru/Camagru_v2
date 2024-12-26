import { checkSession, getAllPostsOfUser } from "./utils.js";

export async function post(container) {
	const userSession = await checkSession();

	if (userSession.logged == false) {
		window.location.href = '/#login';
		return ;
	}

	let userPosts = await getAllPostsOfUser();

	userPosts = userPosts.reverse();

	console.log(userPosts)

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
	let uploadImg;
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
			activateCaptureButton();

			// Calculer les coordonnées relatives au conteneur
			const containerRect = superposableImagesContainer.getBoundingClientRect();
			const offsetX = e.clientX - containerRect.left;
			const offsetY = e.clientY - containerRect.top;

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
						// Réinitialiser les mêmes étapes que lors du premier clic
						const shiftX = e.clientX - clone.getBoundingClientRect().left;
						const shiftY = e.clientY - clone.getBoundingClientRect().top;

						// const moveAt = (clientX, clientY) => {
						// 	const newLeft = clientX - containerRect.left - shiftX;
						// 	const newTop = clientY - containerRect.top - shiftY;

						// 	clone.style.left = `${newLeft}px`;
						// 	clone.style.top = `${newTop}px`;
						// };

						document.addEventListener("mousemove", onMouseMove);

						document.addEventListener("mouseup", () => {
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
				// Remplacer la webcam par l'image sélectionnée
				const preview = document.getElementById("preview");
				preview.innerHTML = `
					<img id="upload-img" src="${e.target.result}" style="width: 100%; height: auto;">
					<canvas id="canvas" style="display: none;"></canvas>
				`;

				// Désactiver le flux vidéo de la webcam
				if (webcam.srcObject) {
					const tracks = webcam.srcObject.getTracks();
					tracks.forEach((track) => track.stop());
					webcam.srcObject = null;
				}
			};
			reader.readAsDataURL(file);
			upload = 1;
		}
	});


	captureButton.addEventListener("click", () => {
		const context = canvas.getContext("2d");
		let styles = window.getComputedStyle(webcam)
		if (upload == 1) {
			uploadImg = document.getElementById('upload-img');
			if (uploadImg) {
				styles = window.getComputedStyle(uploadImg)
			}
		}

		console.log(styles)

		let webcamWidth = parseInt(styles.width);
		let webcamHeight = parseInt(styles.height);

		canvas.width = webcamWidth;
		canvas.height = webcamHeight;


		console.log(webcamWidth)
		console.log(webcamHeight)

		// Dessiner l'image du webcam sur le canvas
		if (upload == 0) {
			context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
		} else {
			context.drawImage(uploadImg, 0, 0, canvas.width, canvas.height);
		}


		// Collecter les stickers et leurs positions
		const stickersData = [];
		const stickers = document.querySelectorAll('.draggable'); // Sélectionner tous les stickers déplacés
		stickers.forEach(sticker => {
			const parent = webcam.getBoundingClientRect();
			const child = sticker.getBoundingClientRect();
			let stickerSource = sticker.src;
			stickerSource = stickerSource.split("assets/")[1]
			const stickerData = {
				src: stickerSource,
				left: parseInt(child.x) - parseInt(parent.x), // Position par rapport au canvas
				top: parseInt(child.y) - parseInt(parent.y), // Position par rapport au canvas
			};
			stickersData.push(stickerData);
		});

		// Envoyer l'image du canvas et les stickers avec leurs positions
		fetch("http://localhost:8000/upload", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				image: canvas.toDataURL(),
				stickers: stickersData, // Envoyer les stickers et leurs positions
			}),
			credentials: 'include'
		})
		.then((response) => response.json())
		.then(() => {
			post(container);
		})
		.catch((error) => console.error(error));
	});

}

