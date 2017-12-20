#!/usr/bin/env python2.7

"""
Columbia's COMS W4111.001 Introduction to Databases
Example Webserver

To run locally:

    python server.py

Go to http://localhost:8111 in your browser.

A debugger such as "pdb" may be helpful for debugging.
Read about it online.
"""

import os
from sqlalchemy import *
from sqlalchemy.pool import NullPool
from flask import Flask, request, render_template, g, redirect, Response,session
import json
tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=tmpl_dir)

from urllib.parse import urlparse
import mysql.connector
import pymysql
from sklearn.externals import joblib
#joblib.dump(model,'lgb.pkl')
#model = joblib.load('lgb.pkl')
import pandas as pd



pymysql.install_as_MySQLdb()
connect = pymysql.Connect(host = 'localhost', port = 3306, user =  "root", passwd = 'jun941106', db = 'KKBox', charset = 'utf8')


@app.route('/')
def index():
    return render_template('index.html')




@app.route('/top')
def top():
    return render_template('top.html')
@app.route('/getmusic')
def getmusic():
    song_name = request.args.get('song_name')
    cursor = connect.cursor()
    sql = "SELECT name, artist_name, composer, lyricist FROM KKBox.song_extra_info, KKBox.songs where KKBox.song_extra_info.name = '%s' and KKBox.songs.song_id = KKBox.song_extra_info.song_id"
    cursor.execute(sql % (song_name))
    print(sql)
    row = cursor.fetchall()
    res = []
    for result in row:
        print(result)
        tmp = {}
        tmp['name'] = result[0]
        tmp['artist_name'] = result[1]
        tmp['composer'] = result[2]
        tmp['lyricist'] = result[3]
        res.append(tmp)
    cursor.close()
    return json.dumps(res)
@app.route('/damnit2',methods=['POST'])
def damnit2():
    user = request.form.get('user')
    song  = request.form.get('song')
    
    sql = "Insert into KKBox.favourite values('%s',(select song_id from KKBox.song_extra_info where name = '%s'))"
    print(sql % (user, song))
    cursor = connect.cursor()
    cursor.execute(sql % (user, song))
    connect.commit()
    return json.dumps({'status':True})



@app.route('/recommend')
def recommend():
    return render_template('recommend.html')

@app.route('/getrecommend', methods=['POST'])
def getrecommend():
    username = request.form.get('username')
    cursor = connect.cursor()
    sql = "SELECT age, gender, city FROM KKBox.users where KKBox.users.username = '%s'"
    cursor.execute(sql % (username))
    row = cursor.fetchall()
    age = row[0][0]
    gender = row[0][1]
    city = row[0][2]
    print(age, gender, city)
    result = get_result(age,gender,city)
    res = []
    for i in range(10): 
        tmp = result[i]
        cursor = connect.cursor()
        sql = "SELECT name, artist_name, composer, lyricist FROM KKBox.song_extra_info, KKBox.songs where KKBox.songs.song_id = '%s' and KKBox.songs.song_id = KKBox.song_extra_info.song_id"
        cursor.execute(sql % (tmp))
        row = cursor.fetchall()
        cursor.close()
        tmp1 = {}
        tmp1['name'] = row[0][0]
        tmp1['artist_name'] = row[0][1]
        tmp1['composer'] = row[0][2]
        tmp1['lyricist'] = row[0][3]
        res.append(tmp1)
    return json.dumps(res)
    

def get_result(bd,city,gender): 
    model = joblib.load('lgb.pkl')
    test = pd.read_csv('test.csv')
    bd = [bd]*test.shape[0]
    
    test['bd'] = bd
    test['city'] = [city]*test.shape[0]
    if(gender == 1):
        test['female'] = [1]*test.shape[0]
        test['male'] = [0]*test.shape[0]
    else:
        test['male'] = [1]*test.shape[0]
        test['female'] = [0]*test.shape[0]
    songid = test['song_id']
    
    preds = model.predict(test.drop(['Unnamed: 0','msno','target','song_id'],axis = 1).values)
    song_prob = [(preds[i], songid[i]) for i in range(len(preds))]
    sorted_song = sorted(song_prob)
    table = {}
    for i in range(len(sorted_song)-1,-1,-1):
        if sorted_song[i][1] not in table:
            table[sorted_song[i][1]] = 1
        if len(table.keys()) == 10:
            break
    return list(table.keys())
    

    
    

@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/getabout', methods=['POST'])
def getabout():
    username = request.form.get('username')
    cursor = connect.cursor()
    sql = "SELECT age, gender, city FROM KKBox.users where KKBox.users.username = '%s'"
    cursor.execute(sql % (username))
    row = cursor.fetchall()
    age = row[0][0]
    gender = row[0][1]
    city = row[0][2]
    result = get_result(age,gender,city)
    count = []
    tmp1 = {'139':0, '352':0, '359':0, '458':0, '465':0, '726':0, '1609':0, '2022':0}
    for i in range(10):
        tmp = result[i]
    
        sql = "SELECT genre_ids FROM KKBox.songs where KKBox.songs.song_id = '%s'"
        cursor.execute(sql % (tmp))
        row = cursor.fetchall()
        tmp1[str(row[0][0])] = tmp1[str(row[0][0])] + 1
    print(tmp1)
#    print(res)
    count.append(tmp1)
    return json.dumps(count)
    
      
    
@app.route('/cart')
def cart():
    return render_template('cart.html')
@app.route('/getfavourite', methods=['POST'])

def getfavourite():
    username = request.form.get('username')
    cursor = connect.cursor()
    
    sql = "SELECT name, artist_name, composer, lyricist FROM KKBox.song_extra_info, KKBox.songs, KKBox.favourite where KKBox.songs.song_id = KKBox.favourite.song_id and KKBox.songs.song_id = KKBox.song_extra_info.song_id and KKBox.favourite.username = '%s'"

    cursor.execute(sql % (username))
    row = cursor.fetchall()
    print(row)
    res = []
    for i in range(len(row)): 
        tmp = row[i]
        tmp1 = {}
        tmp1['name'] = tmp[0]
        tmp1['artist_name'] = tmp[1]
        tmp1['composer'] = tmp[2]
        tmp1['lyricist'] = tmp[3]
        res.append(tmp1)
    print(res)
    return json.dumps(res)



@app.route('/regist/', methods=['GET', 'POST'])
def regist():
    if request.method == 'GET':
        return render_template('regist.html')
    else:
        cursor = connect.cursor()
        username = request.form.get('username')
        password = request.form.get('password')
        gender = request.form.get('gender')
        age = request.form.get('age')
        city = request.form.get('city')
        
        sql = 'INSERT INTO users values("%s","%s",%d,%d,%d)' % (username, password, int(age), int(gender), int(city))
        print(sql)
        cursor.execute(sql)
        connect.commit()                
        return json.dumps({'isvalid':True,'result':None})



@app.route('/login/', methods = ['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        cursor = connect.cursor()
        username = request.form.get('username')
        password = request.form.get('password')
        print(username, password)
        sql = "select * from KKBox.users where username = '%s' and password = '%s'"
        print(sql % (username,password))
        row = cursor.execute(sql % (username,password))
        
        if(row == 0):
            return json.dumps({'status':False})
        else:
            return json.dumps({'status':True})

        
        
@app.route('/add', methods=['POST'])
def add():
  name = request.form['name']
  g.conn.execute('INSERT INTO test VALUES (NULL, ?)', name)
  return redirect('/')



if __name__ == "__main__":
  import click
  app.run()

