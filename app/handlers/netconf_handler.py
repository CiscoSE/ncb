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
from traceback import print_exc
from ncclient import manager
from base_handler import BaseHandler
from app.ncclientextensions.operations import SendCommand
from lxml import etree
from base64 import b64encode


class NetConfHandler(BaseHandler):
    """
    Handler that manages the NetConf calls.
    If you would like to access to some of the scripts that are called via object_response.script() go to
    /static/js/site.js
    """
    __author__ = 'Santiago Flores Kanter (sfloresk@cisco.com)'

    def __init__(self):
        # Initiate super class
        BaseHandler.__init__(self)

        # Create a variable for NetConf client manager
        self.clientManager = None

    def get_capabilities(self, object_response, form_values):
        """
        Connect and return capabilities from the NetConf server
        :param object_response: sijax object that is used to interact with the HTML user interface
        :param form_values: values from the HTML form sent
        :return: None
        """
        try:

            # Create a new manager with the given parameters
            self.clientManager = manager.connect(host=form_values['server_ip'],
                                                 port=int(form_values['server_port']),
                                                 username=form_values['server_username'],
                                                 password=form_values['server_password'],
                                                 hostkey_verify=False,
                                                 device_params={},
                                                 look_for_keys=False, allow_agent=False)

            # If there is no exception, connection is successfully.
            # Execute connected() javascript function in the browser
            object_response.script("connected();")

            # Reset capabilities table executing the following javascript in the browser
            object_response.script("$('#div_capabilities_table').html('')")

            # For each capability reported by the server, execute the add_capability() function in the browser
            for cap in self.clientManager.server_capabilities:

                # Send the capability as a parameter
                object_response.script("add_capability('" + cap + "');")
        except Exception as e:

            # Update the GUI with a notification
            object_response.script("create_notification('Something went wrong', '" + str(e).replace("'", "").
                                   replace('"', '').replace("\n", "")[0:100] + "', 'danger', 0);")

            # Reset controls
            object_response.script("disconnect();")
            # Print in console the traceback error
            print print_exc()
        finally:

            # Close NetConf connection if it has been established
            if self.clientManager is not None:
                if self.clientManager.connected:
                    self.clientManager.close_session()

            # Update the progress bar. Executes the setProgressBar() javascript method in the browser
            object_response.script("setProgressBar(operations.response);")

    def send_command(self, object_response, form_values):
        """
        Send a NetConf XML request to the server
        :param object_response: sijax object that is used to interact with the HTML user interface
        :param form_values: values from the HTML form sent
        :return: None
        """
        try:

            # Create a new manager with the given parameters
            self.clientManager = manager.connect(host=form_values['server_ip'],
                                                 port=int(form_values['server_port']),
                                                 username=form_values['server_username'],
                                                 password=form_values['server_password'],
                                                 hostkey_verify=False,
                                                 device_params={},
                                                 look_for_keys=False, allow_agent=False)

            # Create a new SendCommand instance with the parameters of the NetConf client manager.
            rpc_call = SendCommand(self.clientManager._session,
                                   device_handler=self.clientManager._device_handler,
                                   async=self.clientManager._async_mode,
                                   timeout=self.clientManager._timeout,
                                   raise_mode=self.clientManager._raise_mode)

            # Increase the default timeout to 100 seconds
            rpc_call.timeout = 100

            # Do the request and save the response into a variable
            response = rpc_call.request(xml=etree.fromstring(form_values['xml_command']))

            # Update the HTML user interface executing the show_xml_response() javascript method.
            # Before send the response as a parameter, it is coded in base64 to avoid errors with xml code
            # when it is sent via json and executed in javascript. It is decoded to xml directly in the javascript
            # function. You can access to that function in /static/js/site.js
            object_response.script("show_xml_response('" + b64encode(str(response)) + "');")

        except Exception as e:

            # Update the HTML user interface executing the show_xml_response() javascript method.
            # Before send the exception as a parameter, it is coded in base64 to avoid errors with xml code that can
            # be returned directly from the NetConf server. It is decoded to xml/string directly in the javascript
            # function. You can access to that function in /static/js/site.js
            object_response.script("show_xml_response('" + b64encode(str(e)) + "');")

            # Print in console the traceback error
            print print_exc()
        finally:

            # Close NetConf connection if it has been established
            if self.clientManager is not None:
                if self.clientManager.connected:
                    self.clientManager.close_session()

            # Update the progress bar. Executes the setProgressBar() javascript method in the browser
            object_response.script("setProgressBar(operations.response);")