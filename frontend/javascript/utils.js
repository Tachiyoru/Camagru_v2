export function reloadCSS() {
	const preloadLink = document.createElement('link');
	preloadLink.rel = 'preload';
	preloadLink.href = '../css/styles.css';
	preloadLink.as = 'style';
	preloadLink.onload = () => {
		preloadLink.rel = 'stylesheet';
	};
	document.head.appendChild(preloadLink);
}

export async function checkSession() {
	const response = await fetch('http://localhost:8000/checkSession', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	return response.json()
}

export async function getAllPosts() {
	try {
		const response = await fetch('http://localhost:8000/posts', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		return response.json()
	}
	catch (error) {
		console.log(error)
	}
}

export async function getAllPostsOfUser() {
	try {
		const response = await fetch('http://localhost:8000/postsOfUser', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		return response.json()
	}
	catch (error) {
		console.log(error)
	}
}

export async function getAllUsers() {
	try {
		const response = await fetch('http://localhost:8000/users', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		return response.json()
	}
	catch (error) {
		console.log(error)
	}
}

export async function getUser() {
	try {
		const response = await fetch('http://localhost:8000/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		return response.json()
	}
	catch (error) {
		console.log(error)
	}
}

export async function sendLike(post_id) {
	try {
		const response = await fetch('http://localhost:8000/sendLike', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body:JSON.stringify({"post_id": post_id}),
		})
		return response.json()
	}
	catch (error) {
		console.log(error);
	}

}

export async function sendComment(post_id, comment) {
	try {
		const response = await fetch('http://localhost:8000/sendComment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body:JSON.stringify({"post_id": post_id, "comment": comment}),
		})
		return response.json()
	}
	catch (error) {
		console.log(error);
	}

}
