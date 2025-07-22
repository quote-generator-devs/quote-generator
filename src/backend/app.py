#document info: this file is used to create databases, 
    # connect to API, and maybe for using the openAI api??

#imports
import sqlite3
from flask import Flask, render_template, request, redirect, url_for


app= Flask(__name__)

id=0

###DATABASE SECTION###:
    #to create: 
            # user db
            #quotes saved db (create later??)

    #create user data base    

connect= sqlite3.connect('user.db')
connect.execute("DROP TABLE IF EXISTS USER")

    #create a table
connect.execute('''CREATE TABLE USER
                (ID INT PRIMARY KEY NOT NULL
                USERNAME TEXT NOT NULL
                PASSWORD TEXT NOT NULL);
    ''')





@app.route("/user/db", methods=["POST"])

def receive_data():
    if request.is_json: 
        data=request.json
        username= data.get('username')
        password= data.get('password')
        id= id+1

    connect.execute("INSERT INTO USER (ID, USERNAME, PASSWORD) VALUES (id, username, password)")

    
connect.close()

#figure out how to put the values in the table...



###API SECTION ###




###OPENAI SECTION###


