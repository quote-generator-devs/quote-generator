#document info: this file is used to create databases, 
    # connect to API, and maybe for using the openAI api??

#imports
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, jsonify, make_response
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
import json
from dotenv import load_dotenv
import os
from google import genai
from google.genai import types


load_dotenv() # load variables from .env file

app= Flask(__name__)
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
bcrypt = Bcrypt(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

gemini_api_key = os.getenv('GEMINI_API_KEY')

app.config['SECRET_KEY'] = 'we-are-awesome-quotegeneratorsAI'


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
        user_id = user_row['ID']
        access_token = create_access_token(identity=str(user_id))
        return jsonify(access_token=access_token, message="Login successful!", id="success")
    else:
        # AUTHENTICATION FAILED
        return jsonify(error="Invalid username or password", id="failure"), 401


@app.route('/api/profile', methods=['GET'])
@jwt_required() # This decorator protects the route
def get_profile():
    """Protected route that returns the logged-in user's data."""
    # get_jwt_identity() returns the identity we set in create_access_token()
    current_user_id = get_jwt_identity()
    
    conn = get_db_connection()
    user_row = conn.execute('SELECT ID, USERNAME FROM user WHERE ID = ?', (current_user_id,)).fetchone()
    conn.close()

    if not user_row:
        return jsonify({"error": "User not found"}), 404
        
    # Return the user's data (without the password hash!)
    return jsonify(id=user_row['ID'], username=user_row['USERNAME'])


@app.route('/search/response', methods=['GET','POST'])
def response():
    try:
        #obtain the user response
        data=request.get_json()
        message= data["message"]

        client = genai.Client(api_key=gemini_api_key)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction="""You are a helpful quote generator. The user will provide a word or phrase and you must generate 10 quotes based on the mood requested by the user. Format your quotes in JSON (without adding "```json" tags) with randomized IDs and the name "Gemini", following the given format:
                                    {
                                        "quotes": [
                                            {
                                                "id": "7OPFznDBHv",
                                                "content": "This world, after all our science and sciences, is still a miracle; wonderful, inscrutable, magical and more, to whosoever will think of it.",
                                                "author": {
                                                    "name": "Thomas Carlyle"
                                                }
                                            },
                                            {
                                                "id": "F8cSGcIyVr",
                                                "content": "Any sufficiently advanced technology is equivalent to magic.",
                                                "author": {
                                                    "name": "Arthur C. Clarke"
                                                }
                                            },
                                            {
                                                "id": "XdHXArQe1E",
                                                "content": "Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish.",
                                                "author": {
                                                    "name": "John Adams"
                                                }
                                            },
                                            {
                                                "id": "voQP5QM0kA",
                                                "content": "Real magic in relationships means an absence of judgement of others.",
                                                "author": {
                                                    "name": "Wayne Dyer"
                                                }
                                            },
                                            {
                                                "id": "8UxpbEi4hD",
                                                "content": "The universe is full of magical things, patiently waiting for our wits to grow sharper.",
                                                "author": {
                                                    "name": "Eden Phillpotts"
                                                }
                                            }
                                        ]
                                    }"""),
            contents=message,
        )

        # modify response into JSON for easy handling in JS
        print(response)

        #converts the response into a Python dictionary
        data_dict = json.loads(response.text)

        #converts the Python dictionary back to a JSON String to be used
        return jsonify(data_dict)
    
    except Exception as e:
        print("error:", e)
        return jsonify({"error": str(e)}), 500
            

if __name__ == "__main__":
    #initialize_db() --> we can initialize manually since we only have to do this once
    initialize_db()

    
    #makes sure flask runs in the background + specify the port
    app.run(debug=True, port=5001)





###API SECTION ###

