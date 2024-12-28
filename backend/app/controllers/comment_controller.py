from app.models.comment_model import CommentModel
from app.models.user_model import UserModel
from app.models.post_model import PostModel

from app.utils.utils import utils

import http.cookies
import json

class commentCtrl:
	def get_all_comments(request):
		try:
			comment_model = CommentModel()
			comments = comment_model.get_all_comments()
			for comment in comments:
				comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')
			response = {"comments": comments}
		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(response))
		return

	def add_comment(request):
		content_length = int(request.headers['Content-Length'])
		cookie_header = request.headers.get('Cookie')
		cookies = http.cookies.SimpleCookie(cookie_header)

		try:
			post_data = json.loads(request.rfile.read(content_length))

			user_id = cookies.get("user_id").value if cookies.get('user_id') else None

			post_model = PostModel()

			post = post_model.get_post_by_id(post_data.get('post_id'))

			user_model = UserModel()

			author_of_post = user_model.get_user_by_id(post["user_id"])

			if post_data["comment"] is None:
				utils.return_response(request, 400, json.dumps({"error": "Comment field can't be empty"}))

			comment_data = {
				"user_id": int(user_id),
				"post_id": post_data.get('post_id'),
				"comment": post_data.get('comment')
			}

			comment_model = CommentModel()

			comment_model.add_comment(comment_data)

			utils.send_notification_email(author_of_post["email"], post_data.get('post_id'))

			utils.return_response(request, 200, json.dumps({"message": "Comment succesfully send !"}))

		except Exception as error:
			utils.return_response(request, 400, json.dumps(str(error)))
		return
