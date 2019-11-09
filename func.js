var speed = 4;		// speed of cat multiplier]
var step = 5;
var teta;

let c;				// canvas pointer
let ctx;			// 2D context of canvas
var cW, cH;			// canvas width and height

var Xc, Yc, R;		// field center coords
var Xp, Yp;			// player coords
var Xcat, Ycat;		// cat coords
var shiftp;			// is left shift pressed
var tipped = 0;

document.addEventListener('keydown', function (e) {
    var code = e.keyCode;
	
	if (code == 16) shiftp = 1;
    else if (code == 13) moveShortest();
	else if (code == 37) {			// left
		if (shiftp) moveArc(false);
        else moveLine(-step, 0);
	}
	else if (code == 38) {			// up
		if (shiftp) moveArc(false);
		else moveLine(0, -step);	
	}
	else if (code == 39) {			// right
		if (shiftp) moveArc(true);
		else moveLine(step, 0);		
	}
	else if (code == 40) {			// down
		if (shiftp) moveArc(true);
		else moveLine(0, step);		
	}	
    else if (code == 46) ClearFun();
}, false);

document.addEventListener('keyup', function (e) {
    var code = e.keyCode;
	if (code == 16) shiftp = 0;
}, false);
  
function ClearFun()
{
	ctx.clearRect(0, 0, cW, cH);
	//shiftp = 0;
    tipped = 0;
	DrawInitField();
}

function DrawInitField()
{
	Xc = cW/2.;
	Yc = cH/2.;
	R = cH/3.;
	
	Xcat = Xc;
	Ycat = Yc-R;
	Xp = Xc;
	Yp = Yc;
	
	teta = step*speed/R;
	
	drawCat();
	drawPlayer();
}

function Init()
{
    c = document.getElementById("myC0");

	c.width = window.innerWidth*0.835;     // equals window dimension
	c.height = window.innerHeight*0.85;
	ctx = c.getContext("2d");
	ctx.lineWidth = 2;
	
    cW = c.width;
    cH = c.height;
	
	ClearFun();
}

function checkEndGame()
{
	if (Dist(Xp, Yp, Xc, Yc) < R-1) return 0;
	else if (Dist(Xp, Yp, Xcat, Ycat) < 6.1) return -1;
	else return 1;
}

function moveLine(dx, dy)
{
	ctx.clearRect(0, 0, cW, cH);
	
	Xp += dx;
	Yp += dy;
	drawPlayer();
    
    if (checkEndGame()) {
		alert(checkEndGame() == 1 ? "You win!" : "You lose.");
		ClearFun();
        return
	}
	
    calcCat();
    if (tipped) showTip();
}

function calcCat()
{
	var fi1 = angleP(Xp, Yp);
	var fi2 = angleP(Xcat, Ycat);
	
	var dfi = fi1-fi2;
	if (dfi > Math.PI)  dfi -= 2*Math.PI;
	if (dfi < -Math.PI) dfi += 2*Math.PI;
	
	if (Math.abs(dfi) < teta) {
		Xcat = Xc + R*Math.cos(fi1);
		Ycat = Yc + R*Math.sin(fi1);
	}
	else {
		var dir = Math.sign(dfi);
		Xcat = Xc + R*Math.cos(fi2 + dir*teta);
		Ycat = Yc + R*Math.sin(fi2 + dir*teta);
	}
	drawCat();    
}

// true = clockwise, false = anticlockwise
function moveArc(cw)
{
	ctx.clearRect(0, 0, cW, cH);
    
    var r = Dist(Xp, Yp, Xc, Yc);
    var fi1 = angleP(Xp, Yp);
    var dir = cw ? 1 : -1;
    var teta0 = step/r;
    
    Xp = Xc + r*Math.cos(fi1 + dir*teta0);
	Yp = Yc + r*Math.sin(fi1 + dir*teta0);
    drawPlayer();
    
    calcCat();
    if (tipped) showTip();
}

function moveShortest()
{    
    ctx.clearRect(0, 0, cW, cH);
    var fi1 = angleP(Xp, Yp);
    
    Xp += step*Math.cos(fi1);
	Yp += step*Math.sin(fi1);
    drawPlayer();
    
    if (checkEndGame()) {
		alert(checkEndGame() == 1 ? "You win!" : "You lose.");
		ClearFun();
        return
	}     
    
    calcCat();
    if (tipped) showTip();    
}

function angleP(X, Y)
{
	return Math.atan2(Y-Yc, X-Xc);
}

function Dist(a, b, c, d)
{
	return Math.sqrt((a-c)*(a-c) + (b-d)*(b-d));
}

function drawCat()
{
	ctx.beginPath();	
	ctx.arc(Xcat, Ycat, 5, 0, 2*Math.PI);	
    	ctx.setLineDash([]);	
	ctx.stroke();
	
	ctx.beginPath();
	ctx.MoveTo(Xcat-5, Ycat);
	ctx.LineTo(Xcat-4, Ycat-7);
	ctx.LineTo(Xcat-3, Ycat);
	
	ctx.MoveTo(Xcat+5, Ycat);
	ctx.LineTo(Xcat+4, Ycat-7);
	ctx.LineTo(Xcat+3, Ycat);
	
	ctx.fillStyle = "#ff2626";
	ctx.fill();		
}

function drawPlayer()
{
	ctx.beginPath();	
	ctx.arc(Xp, Yp, 3, 0, 2*Math.PI);		
    	ctx.setLineDash([]);
	ctx.stroke();
	ctx.fillStyle = "#2626ff";
	ctx.fill();	
}

function clickTip()
{
    tipped ^= 1;
    if (tipped) showTip();
}

function showTip()
{
 	ctx.beginPath();	
    ctx.setLineDash([6, 16]);
	ctx.arc(Xc, Yc, R/4., 0, 2*Math.PI);		
	ctx.stroke();   
}

function sleep(ms) 
{
  return new Promise(resolve => setTimeout(resolve, ms));
}


