var serverHostName = window.location.hostname;
var serverProtocolName = window.location.protocol;
var portName = window.location.port;

if(portName.length == 0)
    portName = 80;

var serverPath = undefined;

if(serverHostName === "localhost")
    serverPath = serverProtocolName + "//" + serverHostName + ":" + portName;
else
    serverPath = serverProtocolName + "//" + serverHostName;

function getVieiwConfigConnection(url, jsonData, operation){
    $.ajax({
        url: url + "/connect",
        type: 'POST',
        data: jsonData,
        dataType: 'json',
        async: true,
        success: function(event){
            
        },
        error: function(){
            
        }
    });
}

