var serverHostName = window.location.hostname;
var serverProtocolName = window.location.protocol;
var portName = window.location.port;

const screenWidth = screen.availWidth;
const screenHeight = screen.availHeight;
var screenType = undefined;

var initHeight = undefined;
var initFontSize = undefined;

function getScreenType(){
    
}

function getProportionsClass(css_class){
    var sizes = [];
    switch(css_class){
        case "initial_currency":
            sizes['height'] = screenHeight / 20;
            sizes['width'] = screenWidth / 2;
            sizes['fontsize'] = screenWidth / 55;
            break;
    }
    initHeight = sizes.height;
    initFontSize = sizes.fontsize;
    return sizes;
}

function getPositions4Element(css_element){
    var position = [];
    switch(css_element){
        case "valutes":
            position['left'] = screenWidth / 4;
            position['top'] = screenHeight / 7;
            break;
            case "head":
            position['headerheight'] = screenHeight / 9;
            break;
    }
    return position;
}

function getSizeAtrr4Dialog(){
    var attr = [];
    attr['width'] = 3 * (screenWidth / 4);
    attr['height'] = screenHeight / 2;
    attr['position'] = 'absolute';
    attr['left'] = screenWidth / 9;
    
    return attr;
}

function getCoordinatesOfElement(el){
    //zaimplementowac ciało metody
}

if(portName.length == 0)
    portName = 80;

var serverPath = undefined;

if (serverHostName === "localhost") {
    serverPath = serverProtocolName + "//" + serverHostName + ":" + portName;
} else {
    serverPath = serverProtocolName + "//" + serverHostName;
}

function createDialogElement(valuteInfo, current){
    var modal = document.createElement('div');
    var modalContent = document.createElement('div');
    var close = document.createElement('span');
    $(modal).addClass('dialog');
    $(modalContent).addClass('dialog-content');
    $(close).addClass('close');
    $(close).text('x');
    
    var p_nodes = [];
    for(var i = 0; i < 3; i++) {
        p_nodes[i] = document.createElement('p');
    }
    
    var n_nodes = [];
    n_nodes[0] = document.createTextNode(valuteInfo.code.toString());
    n_nodes[1] = document.createTextNode(valuteInfo.name.toString());
    n_nodes[2] = document.createTextNode(valuteInfo.middleCourse.toString());
    
    $(modal).append(modalContent);
    $(modalContent).append(close);
    p_nodes.forEach(function(item, i){
        item.appendChild(n_nodes[i]);
        $(modalContent).append(item);
    });
    
    $(close).on('mouseover', function(){
        $(this).animate({fontSize: '35px'}, 200);
    });
    
    $(close).on('mouseleave', function(){
        $(this).animate({fontSize: '28px'}, 200);
    })
    
    $(close).on('click', function(){
        $(modal).css('display', 'none');
    });
    
    $('body').append(modal);
    $(modal).css('display', 'block');
}

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
                        
                        $('.initial_currency').css('width', sizes['width'].toString()+'px');
                        $('.initial_currency').css('height', sizes['height'].toString()+'px');
                        $('.initial_currency').css('font-size', sizes['fontsize'].toString()+'px');
                        
                        $("#valutes").append(el);
                        if ( i < valutesArr.length - 1) {
                            $("#valutes").append(br);
                        }
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
    var this_ = this;
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
                    this_.createDialogElement(valInfo, current);
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
        if(this_.getHeightDifference($(this).css('height'), this_.initHeight) == 0){
            $(this).css('box-shadow','0 4px 8px 0 grey, 0 6px 20px 0 grey');
            $(this).animate({height: '10vh'}, 400);
            $(this).animate({fontSize: '6vh'}, 400);
        }
    });
    $('html').on('mouseleave','.initial_currency',function(){
        $(this).animate({fontSize: this_.initFontSize.toString()+'px'}, 200);
        $(this).animate({height: this_.initHeight.toString()+'px'}, 400);
        $(this).css('box-shadow','none');
    });
}

function setOnClickEvents(){
    $('html').on('click','.initial_currency',function(){
        var valCode = $(this).attr('name');
        var jsonData = new Object();
        jsonData.valute = valCode;
        jsonData.command = 'get';
        getValuteInfo(serverPath, JSON.stringify(jsonData), this);
    });
}

function setHeaderHeight(){
    var fit = getPositions4Element('head');
    $('.head').css('height',fit.headerheight.toString()+'px');
}

window.onload = function(){
    getViewConf();
    setHeaderHeight();
    setInitialPosition();
    setInitialEvents();
    setOnClickEvents();
}

