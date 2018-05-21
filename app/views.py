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

import flask_sijax
from flask import render_template, g
from app import app
from handlers.netconf_handler import NetConfHandler

"""
Map web URL to templates
"""


@flask_sijax.route(app, '/')
def main():
    # Check if is a sijax request
    if g.sijax.is_sijax_request:

        # Create a new handler
        g.sijax.register_object(NetConfHandler())

        # Process the request
        return g.sijax.process_request()

    # Return index page
    return render_template('main.html')