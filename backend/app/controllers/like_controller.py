from app.models.like_model import LikeModel
from app.utils.utils import utils

import json
import http.cookies

class	likeCtrl:
	def get_all_likes(request):
		try:
			like_model = LikeModel()
			likes = like_model.get_all_likes()
			for like in likes:
				like['created_at'] = like['created_at'].strftime('%Y-%m-%d %H:%M:%S')
			response = {"likes": likes}
		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(response))
		return

	def sendLike(request):
		content_length = int(request.headers['Content-Length'])
		try:
			post_data = json.loads(request.rfile.read(content_length))
		except json.JSONDecodeError as e:
			utils.return_response(request, 400, json.dumps({"error": "like: Invalid JSON"}))
			return

		cookie_header = request.headers.get('Cookie')
		cookies = http.cookies.SimpleCookie(cookie_header)

		user_id = cookies.get('user_id').value if cookies.get('user_id') else None

		like_model = LikeModel()
		likes = like_model.get_one_like(post_data["post_id"])

		liked = False

		for like in likes:
			if like[1] == int(user_id):
				liked = True
				like_model.remove_like(like[0])
				utils.return_response(request, 201, json.dumps({"message": "Post disliked"}))
				return

		if liked == False:
			like_model.add_like(post_data["post_id"], user_id)
			utils.return_response(request, 200, json.dumps({"message": "Post liked"}))
		return

# PHP EQUIVALENT FOR http.cookies
# Super globale $_COOKIE
# $_COOKIE is an array containing the same method of http.Cookies.
# https://www.php.net/manual/en/reserved.variables.cookies.php

# PHP EQUIVALENT FOR json
# JSON Functions
# PHP natively include his own JSON library
# https://www.php.net/manual/en/ref.json.php
