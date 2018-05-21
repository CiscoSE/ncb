**NetConf Browser**

This web tool allows you to run RPC calls to NetConf servers. 
It will show you the reply and is also able to generate the python code for that specific call.
 
Runs on top of a Flask Application and uses Javascript (Sijax) and other constructs to create a simple HTML
application that can be deployed in a production environment using Apache/NGINX with WSGI.

HTML user interface works better in Chrome and Firefox

Contacts:

* Santiago Flores ( sfloresk@cisco.com )

**Source Installation**

As this is a Flask application you will need to either integrate the application in your production environment or you can
get it operational in a virtual environment on your computer. In the distribution is a requirements.txt file that you can
use to get the package requirements that are needed. The requirements file is located in the root directory of the distribution.

It might make sense for you to create a Python Virtual Environment before installing the requirements file. For information on utilizing
a virtual environment please read http://docs.python-guide.org/en/latest/dev/virtualenvs/. Once you have a virtual environment active then
install the packages in the requirements file.

`(virtualenv) % pip install -r requirements.txt
`

For security reasons you should change the default flask secret key for this project:

Inside this project
Go to app -> __init__

Assign this variable:

app.secret_key = ''

This is a flask parameter, just choose a random string of no less than 40 characters.
E.g:
'A0Zr4FhJASD1LFmw0918jHH!jm84$#ssaWQsif!1'

Also, you should generate your own SSL certificates. This command will create them:

openssl req -x509 -newkey rsa:2048 -keyout NCBkey.pem -out NCBcert.pem -days 365 -nodes

After creation, replace the cert and key file within the project.

To run the the application just execute the run.py file.
E.g. for a linux machine will be sudo python run.py

If you need to make the application visible outside your computer, change the run.py file with your given
 IP. You can also change the port that the application will be listening and the protocol (http or https) from the same file.

