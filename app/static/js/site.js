/*
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

    2016 - Cisco Systems inc.
*/

/*
 * NCB javascript functions. Uses sijax to made asynchronous requests to the server.
 * Note that some other scripts may be executed in the html files under /templates
 */

// Operations to control the progress bar values
var operations = {};
operations.send = 'SEND';
operations.response = 'RESPONSE';

// true when the credentials has been checked. False otherwise
var isConnected = false;

/**
 * Creates a notification
 */
function create_notification(title, message, type, delay) {
    $.notify({

        // options
        title: '<strong>' + title + '</strong>',
        message: '<p>' + message + '</p>'
    },{

        // settings
        type: type,
        placement: {
            from: "top",
            align: "right"
        },
        animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
        },
        delay: delay,
        // HTML to be shown as the notification
        template: '<div data-notify="container" class="col-xs-11 col-sm-4 alert alert-{0}" role="alert">' +
            '<button aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
	    '</div>'
    });
}

/**
 * Attempt to connect to the server and request its NetConf capabilities
 */
function get_capabilities() {

    // Add required fields for this function
    $('#server_ip').rules('add','required');
    $('#server_port').rules('add','required');
    $('#server_username').rules('add','required');
    $('#server_password').rules('add','required');

    // Check for required fields
    if($('#tool_form').valid()){

        // Send the request
        Sijax.request('get_capabilities', [Sijax.getFormValues('#tool_form')]);

        // Update the progress bar
        setProgressBar(operations.send)

        // Change text and disable get_capabilities button
        $('#btn_get_capabilities').html('Connecting..');
        $('#btn_get_capabilities').prop("disabled", true );
    }

    // Remove required rules for this function
    $('#server_ip').rules('remove','required');
    $('#server_port').rules('remove','required');
    $('#server_username').rules('remove','required');
    $('#server_password').rules('remove','required');
}

/**
 * Method to be executed when a successfully connection to the server has been done
 */
function connected(){

    // Change credential fields to readonly
    $('#server_ip').prop( "readonly", true );
    $('#server_port').prop( "readonly", true );
    $('#server_username').prop( "readonly", true );
    $('#server_password').prop( "readonly", true );

    // Change get_capabilities button text and behaviour
    $('#btn_get_capabilities').html('Disconnect');
    $('#btn_get_capabilities').attr('onclick','disconnect();');

    // Enable click events on get_capabilities button
    $('#btn_get_capabilities').prop("disabled", false);

    // Change credentials panel style
    $('#div_connection').removeClass('panel-default');
    $('#div_connection').addClass('panel-success');

    // Change credentials panel header text and color
    $('#div_connection_header').text('Connected');
    $('#div_connection_header').css('color', '#ffffff');

    // Display show_capabilities button
    $('#lnk_show_capabilities').fadeIn()

    // Send a click event to the connection header button to slide up the credential pannel
    $('#div_connection_header').click();

    // Set global connection variable to true
    isConnected = true
}

/**
 * Add a row to the capability table
 */
function add_capability(capability){

    // Append new capability to the table
    $('#div_capabilities_table').append( "<tr><td>" + capability + "</td></tr>" );
}

/**
 * Method to be executed when the user wants to disconnect from the NetConf server
 */
function disconnect(){

    // Remove readonly constrains from credential fields
    $('#server_ip').prop( "readonly", false );
    $('#server_port').prop( "readonly", false );
    $('#server_username').prop( "readonly", false );
    $('#server_password').prop( "readonly", false );

    // Reset password text
    $('#server_password').attr( "value", '' );

    // Change get_capabilities button text and behaviour
    $('#btn_get_capabilities').html('Connect');
    $('#btn_get_capabilities').attr('onclick','get_capabilities();');
    $('#btn_get_capabilities').prop("disabled", false);

    // Change credential panel styles
    $('#div_connection').removeClass('panel-success');
    $('#div_connection').addClass('panel-default');

    // Change credential panel header text and style
    $('#div_connection_header').text('Not connected');
    $('#div_connection_header').css('color', '#2c3e50');

    // Hide show_capabilities button
    $('#lnk_show_capabilities').fadeOut()

    // Set global connection variable to false
    isConnected = false
}

/**
 * Send a xml command to the NetConf server
 */
function send_command(){

    // Check if a connection has been established
    if(isConnected){

        // Add required rule to fields needed for this operation
        $('#xml_command').rules('add','required');

        // Check for required fields
        if($('#tool_form').valid()){

            // Send the request
            Sijax.request('send_command', [Sijax.getFormValues('#tool_form')]);

            // Update the progress bar
            setProgressBar(operations.send)
        }

        // Remove required rules for this function
        $('#xml_command').rules('remove','required');

        // Reset the response field
        $('#xml_response').text('');
    }
    else {

        // Create a notification to inform the error
        create_notification('Not connected','Please connect to a NETCONF server before sending requests','danger',0);

        // Focus cursor on server_ip field
        $('#server_ip').focus();
    }
}

/**
 * Method to be executed when a response from the server has been received
 # To avoid errors with javascript and xml, the response is coded in base64.
 */
function show_xml_response(base64_string){

    // Decode the response
    var xml = atob(base64_string);

    // Format the xml
    var format_xml = formatXml(xml);

    // Show the response in the xml_response field
    $('#xml_response').text(format_xml);

    // Add style to response
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

/*
 * Update the progress bar according if a request has been send or received from the web server
*/
function setProgressBar(operation){

    // If operation is 'send', set progress bar to the 50%
    if (operation == operations.send){
        $('#div_progress').css('width','50%');
    }

    // If operation is 'response', set progress bar to the 100% and after 2 seconds set it to 0%
    else if (operation == operations.response){
        $('#div_progress').css('width','100%');
        setTimeout(function(){$('#div_progress').css('width','0%')}, 2000);
    }
}

/*
 * Generate python code from a hidden template
*/
function generate_code(){

    // Get xml command written by user
    xml_command = document.getElementById("xml_command").value

    // Get the hidden code template text
    code_template = $('#div_code_template').text()

    // Replace the portion code that is related with the xml command
    code_generated = code_template.replace('xml = """"""', 'xml = """' + xml_command + '"""')

    // Update the user interface with the code
    $('#generated_code').text(code_generated)
}

/*
 * Set the previous and next actions for the helping dialog buttons
 */
function set_help_carousel_buttons(current_lnk){
    var next = '';
    var previous = '';
    switch(current_lnk){
        case 'lnk_help_connection':
            next = 'lnk_help_rpc';
            previous = '';
            break;
        case 'lnk_help_rpc':
            next = 'lnk_help_generate_code';
            previous = 'lnk_help_connection';
            break;
        case 'lnk_help_generate_code':
            next = 'lnk_help_questions';
            previous = 'lnk_help_rpc';
            break;
        case 'lnk_help_questions':
            next = '';
            previous = 'lnk_help_generate_code';
            break;
    }
    if (previous == ''){
        $('#btn_help_previous').css('display','none')
    }
    else{
        $('#btn_help_previous').css('display','')
    }
    if (next == ''){
        $('#btn_help_next').css('display','none')
    }
    else{
        $('#btn_help_next').css('display','')
    }
    $('#btn_help_previous').attr('onclick','$("#' + previous + '").click()')
    $('#btn_help_next').attr('onclick','$("#' + next + '").click()')
}



/*
 * Format a xml string to be readable for humans
*/
function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

