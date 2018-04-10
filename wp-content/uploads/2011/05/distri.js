function normalcdf(mean, sigma, to)
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}



var w=400,h=300;
var vis=new pv.Panel()
	.width(w)
	.height(h).strokeStyle("silver")

;
var m=200,s=60,h=20000;

vis.add(pv.Line)
	.data(pv.range(400))
	.left(function(d) {return d;})
	.top(function(d) {return 200-h*(normalcdf(m,s,d)-normalcdf(m,s,d-1));})
	.strokeStyle("steelblue")

vis.add(pv.Bar)
	.data(pv.range(400))
	.left(function(d) {return d;})
	.width(1)
	.visible(function(d) {return d>300;})
	.fillStyle(pv.color("steelblue").alpha(.3))
	.bottom(100)
	.height(function(d) {return h*(normalcdf(m,s,d)-normalcdf(m,s,d-1));})

var control=vis.add(pv.Panel)
	.top(200)
	;

vis.add(pv.Label)
	.top(0)
	.left(200)
	.textBaseline("top")
	.textAlign("center")
	.text("Répartition des automobilistes par vitesse")
	.font("bold 12px Verdana")

vis.add(pv.Label)
	.top(50)
	.left(300)
	.textBaseline("top")
	.textAlign("left")
	.text("En infraction")
	.font("Verdana")

vis.add(pv.Label)
	.top(225)
	.left(200)
	.textBaseline("top")
	.textAlign("center")
	.text("Vitesse moyenne")
	.font("Verdana")


vis.add(pv.Rule)
	.top(200)
	.strokeStyle("silver")

vis.add(pv.Rule)
	.data(pv.range(17))
	.left(300)
	.top(function(d) {return 30+d*10;})
	.strokeStyle("silver")
	.height(5)

control.add(pv.Rule)
	.top(15)
	.strokeStyle("silver")
	.right(50)
	.left(50)

control.add(pv.Rule)
	.top(12)
	.left(200)
	.height(6)
	.strokeStyle("silver")

var cursor=control.add(pv.Dot)
	.data([{x:200, y:0}])
	.top(15)
	.left(function() {return m;})
	.size(11)
	.fillStyle("silver")
	.strokeStyle("black")
	.cursor("move")
	.event("mousedown", pv.Behavior.drag())
	.event("drag", function(d) {m=Math.max(50,Math.min(350,d.x));})
	.event("dragend", function() {vis.render();})
	.event("doubleclick", function(d) {m=200;d.x=200;})


vis.render();

