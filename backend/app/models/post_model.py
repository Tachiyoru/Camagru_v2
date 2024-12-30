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

	def get_post_by_id(self, id):
		cursor = self.db.cursor(dictionary=True)
		try:
			cursor.execute("SELECT * FROM posts WHERE id = %s", (id,))
			post = cursor.fetchone()
		finally:
			cursor.close()
		return post

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

	def delete_post(self, post_id):
		cursor = self.db.cursor()
		try:
			cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
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
