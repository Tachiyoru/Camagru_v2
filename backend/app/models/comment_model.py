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
