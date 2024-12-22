from app.models.database_model import DatabaseModel

class	CommentModel:
	def __init__(self):
		self.db = DatabaseModel().db

	def get_all_comments(self):
		cursor = self.db.cursor(dictionary=True)
		try:
			cursor.execute("SELECT * FROM  comments")
			comments = cursor.fetchall()
		finally:
			cursor.close()
		return comments

	def add_comment(self, comment_data):
		cursor = self.db.cursor()

		try:
			cursor.execute(
				"INSERT INTO comments (user_id, post_id, comment) VALUES (%s, %s, %s)",
			(comment_data["user_id"], comment_data["post_id"], comment_data["comment"],))
			self.db.commit()
		finally:
			cursor.close()
		return True
