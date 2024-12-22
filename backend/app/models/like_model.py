from app.models.database_model import DatabaseModel

class	LikeModel:
	def __init__(self):
		self.db = DatabaseModel().db

	def get_all_likes(self):
		cursor = self.db.cursor(dictionary=True)
		try:
			cursor.execute("SELECT * FROM  likes")
			likes = cursor.fetchall()
		finally:
			cursor.close()
		return likes

	def get_one_like(self, post_id):
		cursor = self.db.cursor()
		try:
			cursor.execute("SELECT * FROM likes WHERE post_id = %s", (post_id,))
			like = cursor.fetchall()
		finally:
			cursor.close()
		return like

	def add_like(self, post_id, user_id):
		cursor = self.db.cursor()
		try:
			cursor.execute(
			"INSERT INTO likes (post_id, user_id) VALUES (%s, %s)",
			(post_id, user_id))
			self.db.commit()
		finally:
			cursor.close()
		return True

	def remove_like(self, like_id):
		cursor = self.db.cursor()
		try:
			cursor.execute("DELETE FROM likes WHERE id = %s", (like_id,))
			self.db.commit()
		finally:
			cursor.close()
		return True
