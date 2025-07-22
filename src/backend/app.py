#document info: this file is used to create databases, 
    # connect to API, and maybe for using the openAI api??

#imports
import sqlite3
from flask import Flask, render_template, request, redirect, url_for


app= Flask(__name__)



###DATABASE SECTION###:
    #to create: 
            # user db
            #quotes saved db (create later??)

    #create user data base    

def initialize_db():
    connect= sqlite3.connect('user.db')
    connect.execute("DROP TABLE IF EXISTS USER")

    #create a table
    connect.execute('''CREATE TABLE USER
                (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USERNAME TEXT NOT NULL,
                PASSWORD TEXT NOT NULL);
    ''')

    connect.close()


@app.route("/user/db", methods=["POST"])
def receive_data():
    if request.is_json: 
        data=request.json
        username= data.get('username')
        password= data.get('password')
       
    connect=sqlite3.connect('user.db')
    connect.execute("INSERT INTO USER (USERNAME, PASSWORD) VALUES (?,?)", (username, password))
    connect.commit()
    connect.close()
    


if __name__ == "__main__":
    initialize_db()

    #makes sure flask runs in the background
    app.run(debug=True)

#figure out how to put the values in the table...



###API SECTION ###




###OPENAI SECTION###


