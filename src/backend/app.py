#document info: this file is used to create databases, 
    # connect to API, and maybe for using the openAI api??

#imports
import sqlite3

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
                EMAIL TEXT NOT NULL
                USERNAME TEXT NOT NULL
                PASSWORD TEXT NOT NULL);
''')

#figure out how to put the values in the table...

connect.close()

###API SECTION ###




###OPENAI SECTION###


