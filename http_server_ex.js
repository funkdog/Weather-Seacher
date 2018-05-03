var http = require('http');
var url = require('url');
var qstring = require('querystring');
function sendresponse (weatherDate,res){
    var page = '<html><head><title>External Exmple</title></head>'+
                '<body>' +
                '<form method = "post">' +
                'City:<input name="city"><br>' + 
                '<input, type="submit" value="Get weather">' +
                '</form>';
    if (weatherDate){
        page += '<h1>Weather Info</h1><p>' + weatherDate + '</p>';
    }
    page += '</body></html>';
    res.end(page);
}
function parseWeaher(weatherResponse,res){
    var weatherData = '';
    weatherData = '';
    weatherResponse.on('data',function(chunk){
        weatherData += chunk;
    });
    weatherResponse.on('end',function(){
        sendresponse(weatherData,res)
    });
}
function getWeather(city,res){
    var options = {
        host:'api.openweathermap.org',
        path:'/data/2.5/weather?q='+city+'&appid=aeb0efd6a8af087da864e5b3b878d630'
    };
    http.request(options,function(weatherResponse){
        parseWeaher(weatherResponse,res);
        console.log(options);
    }).end();
}
http.createServer(function(req,res){
    console.log(req.method);
    if(req.method == "POST"){
        var reqData = '';
        req.on('data',function(chunk){
            reqData += chunk;
        });
    req.on('end',function(){
        var postParams = qstring.parse(reqData);
        console.log(postParams.city);    
        getWeather(postParams.city,res);
        });
    }else{
        sendresponse(null,res);
    }
}).listen(8080);