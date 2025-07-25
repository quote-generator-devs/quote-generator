#document info: this file is used to create databases, 
    # connect to API, and maybe for using the openAI api??

#imports
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
import json
import sqlite3


app= Flask(__name__)
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
bcrypt = Bcrypt(app)


###DATABASE SECTION###:
    #to create: 
            # user db
            #quotes saved db (create later??)

def get_db_connection():
    """Establishes a connection to the database."""
    conn = sqlite3.connect('user.db')
    # This allows you to access columns by name (like a dictionary)
    conn.row_factory = sqlite3.Row 
    return conn

    #create user data base    
def initialize_db():
    connect= sqlite3.connect('user.db')
    #DROP Table clears out the old table, so the data is never stored
    #connect.execute("DROP TABLE IF EXISTS USER")


    #create a table IF IT DOESN'T EXIST
    connect.execute('''CREATE TABLE IF NOT EXISTS USER
                (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USERNAME TEXT NOT NULL UNIQUE,
                PASSWORD TEXT NOT NULL);
    ''')

    connect.close()


@app.route("/user/db", methods=['POST', 'OPTIONS'])

def receive_data():
    if request.is_json: 
        data=request.json
        print("RECEIVED JSON:", data) 
        username= data['Username']
        password= data['Password']
       

        connect=sqlite3.connect('user.db')
        existingUser = connect.execute("SELECT * FROM USER WHERE USERNAME = ?", (username,)).fetchone()
        if existingUser:
            connect.close()
            return{"error": "Username Already Taken"}, 409
        
        connect.execute("INSERT INTO USER (USERNAME, PASSWORD) VALUES (?,?)", (username, password))
        connect.commit()
        connect.close()
        print(f"INSERTED USER: {username}") 


    return json.loads('{"success": true}')
    
@app.route('/user/validate', methods=['POST'])

def login():
    """Receives login credentials and verifies them against the stored hash."""
    data = request.get_json()
    username = data['Username']
    password = data['Password']

    conn = get_db_connection()
    user_row = conn.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
    conn.close()

    # Check if user exists and if the submitted password matches the stored hash
    if user_row and bcrypt.check_password_hash(user_row['password'], password):
        # login handling
        return jsonify(message="Login successful!", id="success")
    else:
        # AUTHENTICATION FAILED
        return jsonify(error="Invalid username or password", id="failure"), 401

if __name__ == "__main__":
    #initialize_db() --> we can initialize manually since we only have to do this once
    initialize_db()

    
    #makes sure flask runs in the background + specify the port
    app.run(debug=True, port=5001)





###API SECTION ###




###OPENAI SECTION###

