#document info: this file is used to create databases, 
    # connect to API, and maybe for using the openAI api??

#imports
import sqlite3
from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS, cross_origin
import json


app= Flask(__name__)
CORS(app, origins=['http://localhost:3000'])


###DATABASE SECTION###:
    #to create: 
            # user db
            #quotes saved db (create later??)

    #create user data base    
def initialize_db():
    connect= sqlite3.connect('user.db')
    #DROP Table clears out the old table, so the data is never stored
    #connect.execute("DROP TABLE IF EXISTS USER")


    #create a table IF IT DOESN'T EXIST
    connect.execute('''CREATE TABLE IF NOT EXISTS USER
                (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USERNAME TEXT NOT NULL,
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
        connect.execute("INSERT INTO USER (USERNAME, PASSWORD) VALUES (?,?)", (username, password))
        connect.commit()
        connect.close()
        print(f"INSERTED USER: {username}") 


    return json.loads('{"success": true}')
    


if __name__ == "__main__":
    #initialize_db() --> we can initialize manually since we only have to do this once
    initialize_db()

    
    #makes sure flask runs in the background + specify the port
    app.run(debug=True, port=5001)





###API SECTION ###




###OPENAI SECTION###

