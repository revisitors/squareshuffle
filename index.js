//Code heavily inspired by kid_icarus: revisitors/glitch-api-example/
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer');
var express = require('express');
var app = express();
var Canvas = require('canvas');
var Image = Canvas.Image;

app.use(bodyParser.json({limit: '2mb'}));
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/service', function(req, res) {
    var imgBuff = dataUriToBuffer(req.body.content.data);
    var img = new Image();
    img.src = imgBuff;
    var canvas = new Canvas(img.width,img.height);
    var ctx = canvas.getContext('2d');
    var xSpace = getSqSpace(img.width);
    var ySpace = getSqSpace(img.height);
    var squares = buildArr(xSpace,ySpace,img.width/xSpace,img.height/ySpace,img.width,img.height);
    for (i = 0; i < squares.length; i++) {
	var rand = Math.floor(Math.random()*(squares.length-i));
	ctx.drawImage(img,squares[rand].x,squares[rand].y,xSpace,ySpace,squares[i].x,squares[i].y,xSpace,ySpace);
    }
    canvas.toDataURL(function(err, str) {
	if(err) {
	    console.log("ERROR WRITING TO DATA URL: " + err);
	} else {
	    req.body.content.data = str;
	    req.body.content.type = imgBuff.type;
	    res.json(req.body);
	}
    });
});

function getSqSpace(dim) {
    if (dim > 99) {
	for(i = 25; i <= 40; i++) {
	    if((dim/i)%1 === 0) {
		return i;
	    }
	}
    }
    if (dim > 19) {
	for(i = 10; i <= 24; i++) {
	    if((dim/i)%1 === 0) {
                return i;
            }
	}
    }
    if (dim > 9) {
	for(i = 2; i <= 10; i++) {
            if((dim/i)%1 === 0) {
                return i;
            }
        }
    }
    return 1;
}

function buildArr(xSpace,ySpace,numX,numY,w,h) {
    var x = 0;
    var y = 0;
    var square;
    var arr = [];
    for (i = 0; i < numX*numY; i++) {
	square = {};
	square.x = x;
	square.y = y;
	arr.push(square);
	x += xSpace;
	if(x >= w) {
	    x = 0;
	    y = y+ySpace;
	}
    }
    return arr;
}
app.listen(8000);
console.log('Server running on port 8000');
