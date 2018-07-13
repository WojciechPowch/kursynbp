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

function getViewConfigConnection(url, jsonData){
    $.ajax({
        url: url + "/redist",
        type: 'POST',
        data: jsonData,
        dataType: 'json',
        async: true,
        success: function(event){
            //metody budujące DOM
            var response  = event;
            if(response){
                if(response.valutes){
                    var valutesArr = response.valutes;
                    
                    valutesArr.forEach(function(item, i, arr){
                        var el = document.createElement('div');
                        var node = document.createTextNode(item.toString());
                        el.appendChild(node);
                        $("#valutes").append(el);
                    });
                }
            }
        },
        error: function(){
            alert("Server connection error")
        }
    });
}


function getViewConf(){
    var jsonData = new Object();
    jsonData.command = "viewCfg";
    getViewConfigConnection(serverPath, JSON.stringify(jsonData));
}

window.onload = function(){
    getViewConf();
}

