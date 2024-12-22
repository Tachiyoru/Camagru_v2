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
			print("Connexion à la base de données réussie.")
		except mysql.connector.Error as err:
			print(f"Erreur de connexion à la base de données : {err}")
			self.db = None

	def get_connection(self):
		return self.db
