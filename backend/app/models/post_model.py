from app.models.database_model import DatabaseModel

class	PostModel:
	def __init__(self):
		self.db = DatabaseModel().db

	def get_all_posts(self):
		cursor = self.db.cursor(dictionary=True)
		try:
			cursor.execute("SELECT * FROM  posts")
			posts = cursor.fetchall()
		finally:
			cursor.close()
		return posts

	def get_all_post_of_user(self, user_id):
		cursor = self.db.cursor(dictionary=True)
		try:
			cursor.execute("SELECT * FROM posts WHERE user_id = %s", (user_id,))
			posts = cursor.fetchall()
		finally:
			cursor.close()
		return posts

	def add_post(self, post):
		cursor = self.db.cursor(dictionary=True)
		try:
			cursor.execute("INSERT INTO posts (user_id, post_path) VALUES (%s, %s)",
			(post["user_id"], post["post_path"]))
			self.db.commit()
		finally:
			cursor.close()
		return True
