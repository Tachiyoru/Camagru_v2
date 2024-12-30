import mysql.connector
import os

class DatabaseModel:
	_instance = None

	def __new__(cls):
		if cls._instance is None:
			cls._instance = super(DatabaseModel, cls).__new__(cls)
			cls._instance._initialize_db_connection()
		return cls._instance

	def _initialize_db_connection(self):
		db_config = {
			'host': os.getenv('MYSQL_HOST'),
			'user': os.getenv('MYSQL_USER'),
			'password': os.getenv('MYSQL_PASSWORD'),
			'database': os.getenv('MYSQL_DATABASE')
		}

		try:
			self.db = mysql.connector.connect(
				host=db_config['host'],
				user=db_config['user'],
				password=db_config['password'],
				database=db_config['database']
			)
		except mysql.connector.Error as err:
			self.db = None

	def get_connection(self):
		return self.db

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
