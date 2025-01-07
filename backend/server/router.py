from app.utils.utils import utils

from http.server import BaseHTTPRequestHandler
from middleware import AuthMiddleware
import json

class   Router:
	def __init__(self):
		self.routes = {"GET": {}, "POST": {}, "PUT": {}, "DELETE": {}}

	def get(self, path, handler):
		self.routes["GET"][path] = handler

	def post(self, path, handler):
		self.routes["POST"][path] = handler

	def put(self, path, handler):
		self.routes["PUT"][path] = handler

	def delete(self, path, handler):
		self.routes["DELETE"][path] = handler

	def handle_request(self, request: BaseHTTPRequestHandler):
		method = request.command
		path = request.path

		if path.startswith("/verify"):
			handler = self.routes.get(method, {}).get("/verify", None)
			if handler:
				handler(request)
				return
		else:
			handler = self.routes.get(method, {}).get(path, None)

		if handler and path not in ["/register", "/login", "/resetPassword", "/newPassword", "/posts"]:
			session_middleware = AuthMiddleware(handler)
			auth_status = session_middleware(request)
			if auth_status is False:
				utils.return_response(request, 401, json.dumps({
					'logged': False,
					'message': 'router: Unauthorized'
				}))
				return
			handler(request)
		elif handler:
			handler(request)
		else:
			utils.return_response(request, 404, json.dumps({"error": "Route not found"}))

# PHP EQUIVALENT FOR BaseHTTPRequestHandler
# Super globale $_SERVER
# $_SERVER is an array containing request infos such as headers, paths etc.
# https://www.php.net/manual/en/reserved.variables.server.php

# PHP EQUIVALENT FOR json
# JSON Functions
# PHP natively include his own JSON library
# https://www.php.net/manual/en/ref.json.php
