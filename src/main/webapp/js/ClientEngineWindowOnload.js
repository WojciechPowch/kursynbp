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

function getBoldText(text) {
    return '<b>'+text+'</b>';
}

function addEventOnAnimate(element, event, css, value, duration, func = undefined) {
    this_  = this;
    switch (css) {
        case "font-size":
            if (!func) { 
                $(element).on(event, function(){
                    $(this).animate({fontSize: value}, duration);
                });
            } else {
                func(element, event, value, duration, this_);
            }
        break;
    }
}

function getArrow(size) {
    var arr = document.createElement('i');
    $(arr).addClass("fa fa-angle-down");
    $(arr).css('font-size', size.toString()+'px');
    return arr;
}

var arrowFlag = true;

function methodBuilderOnOver() {
    var this_ = this;
    var onMouseOver = (element, event, value, duration, __this) => {
        $(element).on(event, function(){
            if(this_.arrowFlag){
                this_.arrowFlag = false;
                $(this).animate({fontSize: value}, duration);
                var arrowContainer = document.createElement('span');
                $(arrowContainer).css('float', 'inherit');
                $(arrowContainer).css('width', '30px');
                $(arrowContainer).append(__this.getArrow(28));
                $(arrowContainer).attr('id', 'arrow');
            
                $(this).append(arrowContainer);
            }
        });
    }
    return onMouseOver;
}

function methodBuilderOnLeave() {
    var this_ = this;
    var onMouseLeave = (element, event, value, duration, __this) => {
        $(element).on(event, function(){
            $(this).animate({fontSize: value}, duration);
            var parent = document.getElementById('o_history');
            var child = document.getElementById('arrow');
            parent.removeChild(child);
            this_.arrowFlag = true;
        });
    }
    
    return onMouseLeave;
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
    
    var text_nodes = [];
    text_nodes[0] = getBoldText("Kod waluty: ")+valuteInfo.code.toString();
    text_nodes[1] = getBoldText("Nazwa waluty: ")+valuteInfo.name.toString();
    text_nodes[2] = getBoldText("Kurs średni: ")+valuteInfo.valuteInfo.Mid.toString();
    
    var date = document.createElement('div');
    $(date).append(new Date().toDateString());

    $(modal).append(modalContent);
    $(modalContent).append(close);
    $(modalContent).append(date);
    p_nodes.forEach(function(item, i){
        $(item).append(text_nodes[i]);
        $(modalContent).append(item);
    });
    
    addEventOnAnimate(close, 'mouseover', 'font-size', '35px', 200);
    addEventOnAnimate(close, 'mouseleave', 'font-size', '28px', 200);
    
    $(close).on('click', function(){
        $(modal).css('display', 'none');
    });
    
    var openHistory = document.createElement('div');
    $(modalContent).append(openHistory);
    $(openHistory).append(getBoldText("pokaż historyczne")+'<br/>');
    $(openHistory).addClass('open_history');
    $(openHistory).attr('id', 'o_history');
    
    $('body').append(modal);
    $(modal).css('display', 'block');
    $(openHistory).css('width', $(modalContent).css('width'));
    
    $(date).css('width', $(modalContent).css('width'));
    $(date).css('text-align', 'center');
    
    var onMouseOver = methodBuilderOnOver();
    var onMouseLeave = methodBuilderOnLeave();
    
    addEventOnAnimate(openHistory, 'mouseover', 'font-size', '15px', 200, onMouseOver);
    addEventOnAnimate(openHistory, 'mouseleave', 'font-size', '10px', 200, onMouseLeave);
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
                        $('.initial_currency').css('cursor', 'pointer');
                        
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

