var serverHostName = window.location.hostname;
var serverProtocolName = window.location.protocol;
var portName = window.location.port;

const screenWidth = screen.availWidth;
const screenHeight = screen.availHeight;
var screenType = undefined;

var initHeight = undefined;

function getScreenType(){
    
}

function getProportionsClass(css_class){
    var sizes = [];
    switch(css_class){
        case "initial_currency":
            sizes['height'] = screenHeight / 20;
            sizes['width'] = screenWidth / 2;
            break;
    }
    initHeight = sizes.height;
    return sizes;
}

function getPositions4Element(css_element){
    var position = [];
    switch(css_element){
        case "valutes":
            position['left'] = screenWidth / 4;
            position['top'] = screenHeight / 5;
            break;
    }
    return position;
}

if(portName.length == 0)
    portName = 80;

var serverPath = undefined;

if(serverHostName === "localhost")
    serverPath = serverProtocolName + "//" + serverHostName + ":" + portName;
else
    serverPath = serverProtocolName + "//" + serverHostName;

function getViewConfigConnection(url, jsonData){
    var this_ = this;
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
                    var sizes = this_.getProportionsClass('initial_currency');
                    
                    valutesArr.forEach(function(item, i, arr){
                        var el = document.createElement('div');
                        var br = document.createElement('br');
                        var node = document.createTextNode(item.toString());
                        el.appendChild(node);
                        $(el).addClass('initial_currency');
                        $(el).attr('name',item);
                        $(el).attr('id','cur$');
                        
                        $('.initial_currency').css('width',sizes['width'].toString()+'px');
                        $('.initial_currency').css('height',sizes['height'].toString()+'px');
                        
                        $("#valutes").append(el);
                        $("#valutes").append(br);
                    });
                }
            }
        },
        error: function(){
            alert("Server connection error")
        }
    });
}

function getValuteInfo(url, jsonData, current){
    $.ajax({
        url: url + '/redist',
        type: 'POST',
        data: jsonData,
        dataType: 'json',
        async: true,
        success: function(event){
            var response = event;
            if(response){
                if(response.valuteInfo){
                    var valInfo = response.valuteInfo;
                }
            }
        },
        error: function(){
            alert('Server connect error');
        }
    });
}

function getViewConf(){
    var jsonData = new Object();
    jsonData.command = "viewCfg";
    getViewConfigConnection(serverPath, JSON.stringify(jsonData));
}

function setInitialPosition(){
    var positions = getPositions4Element('valutes');
    
    var el = $('#valutes');
    el.css('left', positions['left'].toString()+'px');
    el.css('top', positions['top'].toString()+'px');
}

function getHeightDifference(hNow, h){
    //pseudo Semaphor
    hNow = hNow.replace('px','');
    
    h1 = parseInt(hNow);
    h2 = h;
    
    return Math.abs(h1 - h2);
}

function setInitialEvents(){
    var this_ = this;
    $('html').on('mouseover','.initial_currency',function(){
        if(this_.getHeightDifference($(this).css('height'), this_.initHeight) == 0)
            $(this).animate({height: '10vh'},400);
    });
    $('html').on('mouseleave','.initial_currency',function(){
        $(this).animate({height: this_.initHeight.toString()+'px'},400);
    });
}

function setOnClickEvents(){
    $('html').on('click','.initial_currency',function(){
        var valCode = $(this).attr('name');
        var jsonData = new Object();
        jsonData.valute = valCode;
        jsonData.command = 'get';
        getValuteInfo(serverPath, JSON.stringify(jsonData), $(this));
    });
}

window.onload = function(){
    getViewConf();
    setInitialPosition();
    setInitialEvents();
    setOnClickEvents();
}

