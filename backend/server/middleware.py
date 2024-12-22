from app.utils.utils import utils
from app.models.user_model import UserModel

import http.cookies
import json

class AuthMiddleware:
	def __init__(self, handler):
		self.handler = handler

	def __call__(self, request):
		try:
			cookie_header = request.headers.get('Cookie')
			cookies = http.cookies.SimpleCookie(cookie_header)

			user_id = cookies.get('user_id').value if cookies.get('user_id') else None

			user_model = UserModel()

			if not user_id or not user_model.get_user_by_id(user_id):
				return False
		except Exception as e:
			utils.return_response(request, 500, json.dumps({"error": "Internal Server Error"}))
			return

		return True

# PHP EQUIVALENT FOR http.cookies
# Super globale $_COOKIE
# $_COOKIE is an array containing the same method of http.Cookies.
# https://www.php.net/manual/en/reserved.variables.cookies.php

# PHP EQUIVALENT FOR json
# JSON Functions
# PHP natively include his own JSON library
# https://www.php.net/manual/en/ref.json.php
