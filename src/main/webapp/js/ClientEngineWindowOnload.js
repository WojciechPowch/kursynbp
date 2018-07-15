var serverHostName = window.location.hostname;
var serverProtocolName = window.location.protocol;
var portName = window.location.port;

var initHeight = undefined;

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
                        var br = document.createElement('br');
                        var node = document.createTextNode(item.toString());
                        el.appendChild(node);
                        $(el).addClass('initial_currency');
                        $(el).attr('name',item);
                        $("#valutes").append(el);
                        $("#valutes").append(br);
                        console.log($('initial_currency').css('height'));
                        if(initHeight == undefined)
                            initHeight = $('.initial_currency').css('height');
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
    var el = $('#valutes');
    var head = $('#head');
    el.css('left','30vh');
    el.css('top','10vh');
    
    head.css('left','50vh');
}

function getHeightDifference(hNow, h){
    //pseudo Semaphor
    hNow = hNow.replace('px','');
    h = h.replace('px','');
    
    h1 = parseInt(hNow);
    h2 = parseInt(h);
    
    return Math.abs(h1 - h2);
}

function setInitialEvents(){
    var this_ = this;
    $('html').on('mouseover','.initial_currency',function(){
        if(this_.getHeightDifference($(this).css('height'), this_.initHeight) <= 2)
            $(this).animate({height: '10vh'},400);
    });
    $('html').on('mouseleave','.initial_currency',function(){
        $(this).animate({height: '5vh'},400);
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

