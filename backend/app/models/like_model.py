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

# PHP EQUIVALENT FOR mysql.connector
# Mysqli allows you to establish a connection to a database.
# https://www.php.net/manual/en/mysqli.quickstart.connections.php

# EQUIVALENT FOR OS / DOTENV IN PHP
# Super globale $_ENV
# An associative array of variables passed via the environment method.
# https://www.php.net/manual/en/reserved.variables.environment.php

# PHP EQUIVALENT FOR mysql.connector.cursor
# The mysqli_stmt class have many functions to interact with databases
# https://www.php.net/manual/en/class.mysqli-stmt.php
# https://www.php.net/manual/en/mysqli-stmt.execute.php
# https://www.php.net/manual/en/mysqli-stmt.fetch.php
