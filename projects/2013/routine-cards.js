var width = 960,
    height = 500,w=width,h=700;

var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
var svg = d3.select("#chart").append("svg")
    .attr("width", w)
    .attr("height", h);
var defs=svg.append("defs");
var vis=svg
    .append("g");
tick=0;
var maxTick,minTick;
var maxMove=0;
π=Math.PI;
var mydata;
d3.select("#how").on("click",function() {d3.select("#how").html("Magic.").style("border","none")})
var corr=location.hash.slice(1);
d3.select("#link").attr("href","./data/"+corr+".tsv")

d3.tsv("./data/"+corr+".tsv",function(error,data) {
	data.forEach(function(d) {
		d.correspondent=d.correspondent;
		d.length=+d.length;
		d.message=+d.message;
		d.thread=d.thread;
		d.date=new Date(+d.time*1000);
	})
	data=d3.nest().key(function(d) {return d.correspondent;}).key(function(d) {return d.thread;}).map(data);
	mydata=data;
	init(corr);
})
var myhue,mycolor,g,t,words,threads;
var hScale=d3.scale.linear().range([0,height]);
var rScale=d3.scale.sqrt().range([0,20])

var peak=300;
var delta=2;
var y0=100,y1=50;

var messages=[];
var mine={mails:0,tweets:0,words:0,text:""};
var yours={mails:0,tweets:0,words:0,text:""}
var tScale;
function init(corr) {
	tick=0;
	var dataCorr=mydata[corr];
	keys=d3.keys(dataCorr);
	threads=keys.map(function(k) {return {
		key:k,
		hue:Math.random()*360,
		values:dataCorr[k],
		time:+dataCorr[k][0].time,
		tick:Math.floor(d3.scale.linear().domain([1325286000,1356908400]).range([0,1000])(+dataCorr[k][0].time)),
		total:d3.sum(dataCorr[k],function(t) {return t.length;})
	};});

	var maxHeight=d3.max(threads, function(t) {return t.total;})
	var maxSize=d3.max(threads,function(t) {return d3.max(t.values,function(v) {return v.length;})})
	
	hScale.domain([0,maxHeight]);
	rScale.domain([0,maxSize]);


	threads.forEach(function(t) {
		l=t.values.length;
		t.values.forEach(function(v,i) {
			var delta=Math.random()*y1;
			v.hue=t.hue; // by convenience
			v.words=[[v.word1,v.hue,v.direction,rScale(v.length)],[v.word2,v.hue,v.direction,rScale(v.length)],[v.word3,v.hue,v.direction,rScale(v.length)]]; // easier also

			//v.y0=i*delta;
			v.y0=Math.random()*y0;
			v.h=v.y0+peak*Math.random();
			
			v.y1=y0+delta;
			//v.y1=(i+1)*delta;
			
			v.a=-2*(2*v.h-delta)/(width*width);
			v.b=(4*v.h-delta)/width;
			v.c=v.y0;

			//v.tick=t.tick+100*i;
			v.tick=Math.floor(d3.scale.linear().domain([1325286000,1356908400]).range([0,1000])(+v.time));
			v.endArcTick=v.tick+100;
		})
	})

	threads.forEach(function(t) {t.values.forEach(function(v) {messages.push(v);})})
	messages=d3.nest().key(function(d) {return d.tick;}).map(messages)

	minTick=d3.min(threads,function(t) {return d3.max(t.values,function(v) {return v.tick;})})
	maxTick=d3.max(threads,function(t) {return d3.max(t.values,function(v) {return v.tick;})})
	tScale=d3.scale.linear().domain([0,1000]).range([1325286000000,1356908400000]);
	
	myhue=Math.random()*360;
	mycolor=color(myhue,.25,.5);
	vis.append("text").text("In 2012").attr({y:55}).style({"font-size":"72px"})
	
	vis.append("text").text("You said").attr({x:width,y:55,"text-anchor":"end"}).style({fill:mycolor,opacity:.5,"font-size":"72px"})
	vis.append("text").text(yours.text).attr({
		x:width,"text-anchor":"end"
		//x:width-265
		,y:75,id:"yours"})
	vis.append("text").text("I said").attr({y:height+50}).style({fill:mycolor,opacity:.5,"font-size":"72px"})
	vis.append("text").text(mine.text).attr({y:height+70,id:"mine"})
	vis.append("text").text("").attr({y:height+50,x:width,"text-anchor":"end","id":"month"}).style({"font-size":"72px"})
		.on("click",function() {d3.select("#month").style("fill","white").transition().style("fill","black");if(running) {stop()} else {start()}})

	vis.append("text").text("").attr({y:height+90,id:"details"}).style({"font-size":"16px"});
	vis.selectAll(".arc").data(threads).enter().append("g").classed("arc",1);
	vis.selectAll(".arc").selectAll(".fireball").data(function(d) {return d.values;}).enter()
		.append("g").classed("fireball",1)
		.on("mouseover",function(d) {d3.select("#details").text(
			d.date.toDateString()+" "+d.subject+(d.tweet!=""?"(tweet)":"")
			)});
	vis.selectAll(".tracks")  .data(threads).enter().append("g").classed("tracks",1);
	vis.selectAll(".tracks")  .selectAll(".trail").data(function(d) {return d.values;}).enter().append("g").classed("trail",1).style({fill:function(d) {return color(d.hue);}});

	vis.selectAll(".fireball").attr("transform",function(d) {return d.direction=="to"?"translate(0,"+height+")":"translate("+width+","+height+")";})
		.style({fill:function(d) {return color(d.hue);},stroke:function(d) {return color(d.hue);}})
	//vis.selectAll(".fireball").append("circle").classed("core",1).attr({r:function(d) {return rScale(d.length);}}).style({stroke:"none"});
	//vis.selectAll(".fireball").append("circle").classed("rim",1).attr({r:function(d) {return rScale(d.length)+3;}}).style({fill:"none"});
	/*vis.selectAll(".fireball").append("path").classed("rim",1).attr("d",function(d) {
		var r=Math.floor(rScale(d.length)*100)/100+3;
		if(d.direction=="to") {return "M -100,0L0,-"+r+" A "+r+","+r+" 0 0,1 0,"+r+" Z"}
		else {return "M 100,0L0,"+r+" A "+r+","+r+" 0 0,1 0,-"+r+" Z";}
	}).style("opacity",.2)*/
	
	vis.selectAll(".fireball").selectAll(".trail").data(function(d) {return d.words;}).enter()
		.append("text")
			.classed("trails",1).text(function(d) {return d[0];}).style("stroke","none")
			.attr({
				"text-anchor":function(d) {return d[2]==="from"?"start":"end"},
				x:function(d) {return d[2]==="from"?50:-50;}})

	vis.selectAll(".fireball").selectAll(".rim").data(function(d) {return d.words;}).enter()
		.append("path")
			.classed("rim",1).attr("d","M 0,0L0,0 A 1,1 0 0,1 0,0 Z")
			.style("opacity",.2);

	
		
	//vis.selectAll(".trail").append("path").classed("curve",1).attr("d","M0,0Q0,0 0,0").style({fill:"none",stroke:color(myhue),opacity:.5})
	//vis.selectAll(".trail").append("path").classed("hard",1).attr("d","M0,0Q0,0 0,0").style({fill:"none",stroke:color(myhue),opacity:.5})



	vis.selectAll(".fireball").style("visibility","hidden");
	tick=minTick-1;
	start();
	//solve();

}

function color(hue) {return d3.hsl(hue,.75,.8);}


function play() {
		if(tick===maxTick+110) {tick=minTick-1;if(running) {stop();}}
		if(tick<maxTick+111){tick=tick+1;running=1;
		//d3.select("#stop").html("Pause&nbsp;<i class='icon-pause'>").on("click",stop);
	//	slider.property("value",day);
		
		update(tick);
	} else {stop();}	
	}

	function start() {
		timer=setInterval("play()", 50);
	}

	function stop() {
		clearInterval(timer);
		running=0;
	//	d3.select("#stop").html("Play&nbsp;<i class='icon-play'>").on("click",start);
	}

	function myangle(angle) {
		//return Math.sin(angle)/Math.sqrt((2*2+Math.sin(angle)*Math.sin(angle)))
		return Math.atan(Math.sin(angle)/2.5)
	}

	function update(n) {
		if(messages[n]) {
			messages[n].forEach(function(m) {
				if (m.direction=="to") {
					if (m.tweet!="") {mine.tweets=mine.tweets+1} else {mine.mails=mine.mails+1}
					mine.words=mine.words+m.length;
					mine.text="";
					if (mine.mails>0) {mine.text=mine.mails+" mail"+(mine.mails>1?"s":"")}
					if (mine.tweets>0) {
						{mine.text=mine.text+(mine.mails>0?", ":"")+mine.tweets+" tweet"+(mine.tweets>1?"s":"")}
					}
					mine.text=mine.text+", "+mine.words+" word"+(mine.words>0?"s":"")
					d3.select("#mine").text(mine.text)
				} else {
					if (m.tweet!="") {yours.tweets=yours.tweets+1} else {yours.mails=yours.mails+1}
					yours.words=yours.words+m.length;
					yours.text="";
					if (yours.mails>0) {yours.text=yours.mails+" mail"+(yours.mails>1?"s":"")}
					if (yours.tweets>0) {
						{yours.text=yours.text+(yours.mails>0?", ":"")+yours.tweets+" tweet"+(yours.tweets>1?"s":"")}
					}
					yours.text=yours.text+", "+yours.words+" word"+(yours.words>0?"s":"")
					d3.select("#yours").text(yours.text)
				}
			})
		}
		if(n<maxTick && n>minTick) {
		d3.select("#month").text(function() {var d=new Date(tScale(n));return months[d.getMonth()];})
		}
		var angle=(π*n/50)%(2*π); // in radians
		var α=myangle(angle); 
		var β=myangle(angle+π/3); 
		var ɣ=myangle(angle+2*π/3); 

		var angles=[
			[α,angle],
			[β,angle+π/3],
			[ɣ,angle+2*π/3]
		]

		var moving=vis.selectAll(".fireball").filter(function(d) {return (n>=d.tick && n<d.tick+110 
			//&&d.direction=="to"
			);});
		if (maxMove<moving[0].length) {maxMove=moving[0].length}
		var trailing= vis.selectAll(".trail").filter(function(d) {return (n>=d.tick && n<d.tick+110 
			//&&d.direction=="to"
			);});
		moving.style("visibility","visible");
		moving.attr("transform",function(d) {
			var x,y;
			if (d.direction=="to") {
				x=width*(n-d.tick)/100;
			}
			else {
				x=width-width*(n-d.tick)/100;
			}
			y=height-(d.a*x*x+d.b*x+d.c);
			rot=-Math.atan(2*d.a*x+d.b)*180/π; // we'll get to that;
			//console.log("translate("+x+","+y+") rotate("+rot+")")
			return "translate("+x+","+y+") rotate("+rot+")";
		})

		moving.selectAll(".rim")
			.attr("d",function(d,i) {
				var direction=d[2],r=d[3]+2+Math.random()*3;
				var l=50+10*(d[0].length);
				var x=Math.cos(angles[i][0])*l;y=Math.sin(angles[i][0])*l;
				if(direction=="to") {
					return "M "+(-x)+","+y+" L0,-"+r+" A "+r+","+r+" 0 0,1 0,"+r+" Z"
				} else {
					return "M "+x+","+y+" L0,"+r+" A "+r+","+r+" 0 0,1 0,"+(-r)+" Z"
				}
			})

		moving.selectAll("text")
			.attr("transform",function(d,i) {
				return "rotate ("+(angles[i][0]*180/π)+")";
			})
			.style("fill",function(d,i) {return d3.hsl(d[1],.25,Math.cos(angles[i][1])/4+.25)})
		vis.selectAll(".fireball").filter(function(d) {return n>d.tick+110}).remove();
		vis.selectAll(".trail").filter(function(d) {return n>d.endArcTick+10}).remove();

		trailing.filter(function(d) {return Math.random()>.25}).append("circle")
			.attr({cx:function(d) {
				if (d.direction=="to") {return Math.random()*5-2.5+width*(n-d.tick)/100;}
				else {return Math.random()*5-2.5+width-width*(n-d.tick)/100;}
			},cy:function(d) {var x;
				if (d.direction=="to") {x=width*(n-d.tick)/100;}
				else {x=width-width*(n-d.tick)/100;}
				return Math.random()*5-2.5+height-(d.a*x*x+d.b*x+d.c);
			},r:Math.random()*3
			,start:n})	

		trailing.selectAll("circle")
			.style("opacity",function() {return d3.max([.1,1-(n-d3.select(this).attr("start"))/50]);})
			.attr("cy",function() {return (+d3.select(this).attr("cy"))+(Math.random()>.5?1:0);})
		vis.selectAll(".trail").filter(function(d) {return (n>=d.tick+120);}).remove();
		
		var tracks=vis.selectAll(".tracks").filter(function(d) {return (n>=d.tick && n<d.tick+100);});
		// we'll see the end later
	}

function solve() 
{height=500;
	t=threads[0];
	v=t.values[0];
	a=v.a;
	b=v.b;
	c=v.c;
	y0=v.y0;
	y1=v.y1;
	function f(x) {
		return height-(a*x*x+b*x+c);
	}
	function fprime(x) {
		return -(2*a*x+b);
	}



	var p1="M 0,"+f(0)+" Q "+(width/2)+","+f(width/2)+" "+width+","+f(width)
	var P1="M "+width+","+f(0)+" Q"+(width/2)+","+f(width/2)+" "+0+","+f(width)

console.log(p1)
	//vis.append("path").attr("d",p1).style({stroke:"black",fill:"none"})
	vis.append("path").attr("d",P1).style({stroke:"black",fill:"none"})	
	//vis.append("path").attr("d","M0,"+(height-y0)+" "+width+","+(height-y1)).style({stroke:"black","stroke-dasharray":"4 4"})
	vis.append("path").attr("d","M0,"+(height-y1)+" "+width+","+(height-y0)).style({stroke:"black","stroke-dasharray":"4 4"})


	//vis.append("path").attr("d","M0,"+(height-y0)+" "+width+","+(height-(b*width+y1))).style({stroke:"#ccc",fill:"none"});
	vis.append("path").attr("d","M"+width+","+(height-y0)+" 0,"+(height-(b*width+y1))).style({stroke:"#ccc",fill:"none"});
	

	//vis.append("path").attr("d","M"+width+","+(height-y1)+" 0,"+(height-(b*width+y0))).style({stroke:"#ccc",fill:"none"});
	vis.append("path").attr("d","M0,"+(height-y1)+" "+width+","+(height-(b*width+y0))).style({stroke:"#ccc",fill:"none"});
	
	/*vis.append("path").attr("d",function() {
		var aprime=fprime(width/2);var y2=f(width/2);
		return "M0,"+(aprime*(-width/2)+y2)+" "+width+","+(aprime*(width/2)+y2);})
	.style({stroke:"#ccc",fill:"none"});
*/


}

