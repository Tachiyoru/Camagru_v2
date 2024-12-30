from app.models.post_model import PostModel
from app.models.like_model import LikeModel
from app.models.comment_model import CommentModel
from app.utils.utils import utils

from PIL import Image, ImageOps
from datetime import datetime

import http.cookies
import base64
import json
import io
import os

PHOTOS_DIR = os.path.join(os.path.dirname(__file__), "../../assets")

class postCtrl:
	def __init__(self):
		self.db = DatabaseModel().db

	def createPost(request):
		content_length = int(request.headers['Content-Length'])
		try:
			post_data = json.loads(request.rfile.read(content_length))

			image_data = post_data.get("image")
			stickers_data = post_data.get("stickers")  # Récupérer les données des stickers

			if not image_data or not stickers_data:
				return {"error": "Image data or stickers missing"}, 400

			# Décoder l'image principale (base64)
			image_bytes = base64.b64decode(image_data.split(",")[1])
			image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

			# Appliquer chaque sticker à l'image
			for sticker_data in stickers_data:
				sticker_path = sticker_data['src']
				sticker_left = sticker_data['left']
				sticker_top = sticker_data['top']

				print("LEFT", sticker_data['left'])
				print("TOP", sticker_data['top'])

				# Charger le sticker
				sticker = Image.open(os.path.join(PHOTOS_DIR, sticker_path)).convert("RGBA")

				# Redimensionner le sticker (optionnel, à adapter selon votre logique)
				sticker = sticker.resize((int(image.width * 0.37), int(image.height * 0.37)), Image.Resampling.LANCZOS)  # Exemple de redimensionnement

				# Positionner le sticker
				image.paste(sticker, (sticker_left, sticker_top), sticker.convert("RGBA"))  # Utiliser alpha pour transparence

			# Sauvegarder l'image fusionnée
			output_dir = os.path.join(PHOTOS_DIR)
			os.makedirs(output_dir, exist_ok=True)
			timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
			output_path = os.path.join(output_dir, f"post_{timestamp}.png")
			image.save(output_path, "PNG")

			user_id = utils.get_user_id(request)
			post = {
				"user_id": user_id,
				"post_path": f"http://localhost:8000/assets/post_{timestamp}.png"
			}

			post_model = PostModel()
			post_model.add_post(post)

			utils.return_response(request, 200, json.dumps({'url': f"/assets/post_{timestamp}.png"}))
			return

		except Exception as e:
			print(f"Error processing image: {e}")
			return {"error": "Internal Server Error"}, 500

	def get_all_posts(request):
		try:
			post_model = PostModel()
			like_model = LikeModel()
			comment_model = CommentModel()

			posts = post_model.get_all_posts()
			likes = like_model.get_all_likes()
			comments = comment_model.get_all_comments()

			for post in posts:
				post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			for like in likes:
				like['created_at'] = like['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			for comment in comments:
				comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			response = ({"posts": posts})

			for post in posts:
				post.update({"likes": []})
				post.update({"comments": []})
				for like in likes:
					if (like["post_id"] == post["id"]):
						post["likes"].append(like)
				for comment in comments:
					if (comment["post_id"] == post["id"]):
						post["comments"].append(comment)

		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(response))
		return

	def get_all_post_of_user(request):
		try:
			cookie_header = request.headers.get('Cookie')
			cookies = http.cookies.SimpleCookie(cookie_header)

			user_id = cookies.get('user_id').value if cookies.get('user_id') else None

			post_model = PostModel()
			like_model = LikeModel()
			comment_model = CommentModel()

			posts = post_model.get_all_posts()
			likes = like_model.get_all_likes()
			comments = comment_model.get_all_comments()

			for post in posts:
				post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			for like in likes:
				like['created_at'] = like['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			for comment in comments:
				comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			response = ({"posts": posts})

			for post in posts:
				post.update({"likes": []})
				post.update({"comments": []})
				for like in likes:
					if (like["post_id"] == post["id"]):
						post["likes"].append(like)
				for comment in comments:
					if (comment["post_id"] == post["id"]):
						post["comments"].append(comment)

			userPosts = []

			for post in posts:
				if (str(post['user_id']) == str(user_id)):
					userPosts.append(post)

		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(userPosts))
		return

	def get_post_by_id(request):
		try:
			cookie_header = request.headers.get('Cookie')
			cookies = http.cookies.SimpleCookie(cookie_header)

			user_id = cookies.get('user_id').value if cookies.get('user_id') else None

			post_model = PostModel()

			posts = post_model.get_all_posts()

			post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')

		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(post))
		return

	def delete_post(request):
		content_length = int(request.headers['Content-Length'])

		try:
			post_data = json.loads(request.rfile.read(content_length))

			cookie_header = request.headers.get('Cookie')
			cookies = http.cookies.SimpleCookie(cookie_header)

			user_id = cookies.get('user_id').value if cookies.get('user_id') else None

			post_model = PostModel()

			print("POST_DATA: ", post_data)

			post_model.delete_post(post_data)

			utils.return_response(request, 200, json.dumps({"message": "Post deleted successfully !"}))

		except Exception as error:
			utils.return_response(request, 200, json.dumps({"error": str(error)}))

# PHP EQUIVALENT FOR PIL
# Image Processing and GD
# https://www.php.net/manual/en/book.image.php

# PHP EQUIVALENT FOR BASE64
# base64_encode
# base64_encode — Encodes data with MIME base64
# base64_decode
# https://www.php.net/manual/en/function.base64-encode.php
# https://www.php.net/manual/en/function.base64-decode.php

#PHP EQUIVALENT FOR DATETIME
# The DateTime class
# https://www.php.net/manual/en/class.datetime.php

# PHP EQUIVALENT FOR http.cookies
# Super globale $_COOKIE
# $_COOKIE is an array containing the same method of http.Cookies.
# https://www.php.net/manual/en/reserved.variables.cookies.php

# EQUIVALENT FOR OS / DOTENV IN PHP
# Super globale $_ENV
# An associative array of variables passed via the environment method.
# https://www.php.net/manual/en/reserved.variables.environment.php

# PHP EQUIVALENT FOR json
# JSON Functions
# PHP natively include his own JSON library
# https://www.php.net/manual/en/ref.json.php
