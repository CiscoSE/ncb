"""
Copyright (c) 2018 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.0 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
"""
import os
from flask import Flask
import flask_sijax


app = Flask(__name__)

app.config["SIJAX_STATIC_PATH"] = os.path.join('.', os.path.dirname(__file__), 'static/js/sijax/')
app.config["SIJAX_JSON_URI"] = '/static/js/sijax/json2.js'
app.config['BOOTSTRAP_SERVE_LOCAL'] = True
app.config['BOOTSTRAP_USE_MINIFIED'] = True
app.secret_key = 'A0Zr4FcD2K3LjmwS918jHH!jm84$#ssaWQsif!1'
from app import views

flask_sijax.Sijax(app)

