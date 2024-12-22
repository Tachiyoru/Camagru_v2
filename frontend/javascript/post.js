import { checkSession, getUser } from "./utils.js";

export async function post(container) {
	const userSession = await checkSession();

	if (userSession.logged == false) {
		window.location.href = '/#login';
		return ;
	}

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

	const webcam = document.getElementById("webcam");
	const canvas = document.getElementById("canvas");
	const captureButton = document.getElementById("capture-button");
	const superposableImagesContainer = document.getElementById("superposable-images");
	const thumbnailsContainer = document.getElementById("thumbnails");
	const imageUpload = document.getElementById("image-upload");

	let selectedImage = null;

	const superposableImages = [
		"../assets/stickers/captain.png",
		"../assets/stickers/ironman.png",
		"../assets/stickers/thor.png",
		"../assets/stickers/loki.png",
		"../assets/stickers/spidey.png"
	];

	superposableImages.forEach((src) => {
		const img = document.createElement("img");
		img.src = src;
		img.classList.add("thumbnail");

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

						const moveAt = (clientX, clientY) => {
							const newLeft = clientX - containerRect.left - shiftX;
							const newTop = clientY - containerRect.top - shiftY;

							clone.style.left = `${newLeft}px`;
							clone.style.top = `${newTop}px`;
						};

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

	navigator.mediaDevices.getUserMedia({ video: true })
		.then((stream) => {
			webcam.srcObject = stream;
		})
		.catch(() => {
			alert("Webcam not accessible. Please use the upload feature.");
		});

	captureButton.addEventListener("click", () => {
		const context = canvas.getContext("2d");
		canvas.width = webcam.videoWidth;
		canvas.height = webcam.videoHeight;
		

		// Dessiner l'image du webcam sur le canvas
		context.drawImage(webcam, 0, 0, canvas.width, canvas.height);

		// Collecter les stickers et leurs positions
		const stickersData = [];
		const stickers = document.querySelectorAll('.draggable'); // Sélectionner tous les stickers déplacés
		stickers.forEach(sticker => {
			const rect = sticker.getBoundingClientRect();
			let stickerSource = sticker.src;
			stickerSource = stickerSource.split("assets/")[1]
			console.log(stickerSource)
			const stickerData = {
				src: stickerSource,
				left: rect.left - canvas.offsetLeft, // Position par rapport au canvas
				top: rect.top - canvas.offsetTop, // Position par rapport au canvas
			};
			console.log(stickerData)
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
		.then((data) => {
			console.log(data);
			const thumbnail = document.createElement("img");
			thumbnail.src = `http://localhost:8000${data.url}`;
			thumbnailsContainer.appendChild(thumbnail);
		})
		.catch((error) => console.error(error));
	});


	imageUpload.addEventListener("change", (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			fetch("http://localhost:8000/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: e.target.result,
					overlay: selectedImage,
				}),
				credentials: 'include'
			})
				.then((response) => response.json())
				.then((data) => {
					const thumbnail = document.createElement("img");
					thumbnail.src = data.url;
					thumbnailsContainer.appendChild(thumbnail);
				})
				.catch((error) => console.error(error));
		};
		reader.readAsDataURL(file);
	});
}

