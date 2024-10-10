import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
import psycopg2
from flask_cors import CORS
from google.cloud import storage

app = Flask(__name__)

# enable CORS
CORS(app)

# set google credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', "application-credentials.json")

# set bucket name
BUCKET_NAME = 'bucket-appdb-1'

# set database credentials
DB_HOST = os.getenv('DB_HOST', '34.69.162.207')
DB_NAME = os.getenv('DB_NAME', 'myappdb')
DB_USER = os.getenv('DB_USER', 'myuser')
DB_PASS = os.getenv('DB_PASS', 'mypassword')
DB_PORT = os.getenv('DB_PORT', '5432')


# Database configuration
db_config = {
    'host': DB_HOST,
    'database': DB_NAME,
    'user': DB_USER,
    'password': DB_PASS,
    'port': DB_PORT
}

# Connect to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(**db_config)
        print("Connected to database")
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Function to create the 'users' table if it does not exist
def create_users_table():
    conn = get_db_connection()
    if conn is None:
        return
    cursor = conn.cursor()
    create_table_query = '''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL
    );
    '''
    try:
        cursor.execute(create_table_query)
        conn.commit()
        print("Table 'users' is created or already exists.")
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cursor.close()
        conn.close()


@app.route('/')
def index():
    return jsonify({'message': 'Hello World'})

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file:
        storage_client = storage.Client()
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(file.filename)
        blob.upload_from_file(file)
        return jsonify({'message':  'File uploaded', "url": blob.public_url}), 200
    return jsonify({'error': 'A File is required'}), 400
    


# Insert data into the database
@app.route('/insert', methods=['POST'])
def insert_data():
    name = request.json.get('name')
    age = request.json.get('age')
    
    if not name or not age:
        return jsonify({'error': 'Name and Age are required fields'}), 400
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, age) VALUES (%s, %s)", (name, age))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Data inserted successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Fetch data from the database
@app.route('/fetch', methods=['GET'])
def fetch_data():
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(users), 200        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# run the app.
if __name__ == "__main__":
    create_users_table()
    app.run(host="0.0.0.0", port=5000)