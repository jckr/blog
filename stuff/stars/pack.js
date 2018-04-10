//var svg=d3.selectAll("#chart").append("svg:svg").attr("width","800px").attr("height","600px");
var stars=new Array;
var starsNb=644;
var structNb=4;
var storyTypes=22;
var myColors=d3.scale.category20c();


var k=.5;


var x=d3.scale.linear().domain([0,100]).range([0,800]).clamp([true]);
var y=d3.scale.log().domain([1,10000]).range([600,0]).clamp([true]);


var c1=Math.cos(.2*Math.PI),c2=Math.cos(.4*Math.PI),
    s1=Math.sin(.2*Math.PI),s2=Math.sin(.4*Math.PI),
    r=1,r1=r*c2/c1,
    star=[[0,-r],[r1*s1,-r1*c1],[r*s2,-r*c2],[r1*s2,r1*c2],[r*s1,r*c1],[0,r1],[-r*s1,r*c1],[-r1*s2,r1*c2],[-r*s2,-r*c2],[-r1*s1,-r1*c1],[0,-r]];
    
lineStar=function(k) {
	var line=d3.svg.line()
		.x(function(d) {return d[0]*k;})
		.y(function(d) {return d[1]*k;});
	return line(star)+"Z";
}
		
translate=function(d) {return "translate("+d.x+","+d.y+") rotate("+(10*(d.x+d.y)%360)+")";} // helper function to make transform attributes easier to type.


/*stars=d3.range(starsNb).map(function(d,i) {
	var x=Math.random()*800;
	var y=Math.random()*600;
	var story=~~(Math.random()*10);
	return {x:x,y:y,story:story};
})

stories=d3.range(storyTypes).map(function(d,i) {
	var myStars=stars.filter(function(s) {return s.story==d;});
	var x=d3.mean(myStars,function(s) {return s.x;});
	var y=d3.mean(myStars,function(s) {return s.y;});
	var size=myStars.length;
	var struct=storyStruct[d];
	return {x:x,y:y,size:size,struct:struct,story:i};
})

structs=d3.range(structNb).map(function(d,i) {
	var myStories=stories.filter(function(s) {return s.struct==d;});
	var x=d3.mean(myStories,function(s) {return s.x;});
	var y=d3.mean(myStories,function(s) {return s.y;});
	var size=d3.max([10,d3.sum(myStories, function(s) {return s.size;})]);
	return {x:x,y:y,size:size,struct:i};
})*/

/*stars=movies.map(function(d,i) {return {x:x(d.c),y:y(d.p),c:d.c,p:d.p,story:d.s};})
stories=d3.range(storyTypes).map(function(d,i) {
	var myStars=stars.filter(function(s) {return s.story==d;});
	var myC=d3.mean(myStars,function(s) {return s.c;});
	var myP=d3.mean(myStars,function(s) {return s.p;});
	var size=d3.max([10,myStars.length]);
	var struct=storyStruct[d];
	return {c:myC,p:myP,x:x(myC),y:y(myP),size:size,struct:struct,story:i};
})

structs=d3.range(structNb).map(function(d,i) {
	var myStories=stories.filter(function(s) {return s.struct==d;});
	var myP=d3.mean(myStories,function(s) {return s.p;});
	var myC=d3.mean(myStories,function(s) {return s.c;});
	var size=d3.sum(myStories, function(s) {return s.size;})
	return {c:myC,p:myP,x:x(myC),y:y(myP),size:size,struct:i};})



gStars=svg.append("svg:g").classed("stars",1);
gStories=svg.append("svg:g").classed("stories",1);
gStructs=svg.append("svg:g").classed("structs",1);

var cStructs=gStructs.selectAll("circle").data(structs).enter().append("svg:path")
	.attr("transform",translate)
	.attr("d",function(d) {return lineStar(k*d.size);})
	.style("fill","blue").style("stroke","black").style("opacity",.75);
cStructs.append("svg:title").text(function(d,i) {return structData[i];})


var cStories=gStories.selectAll("path").data(stories).enter().append("svg:path")
	.attr("transform",function(d) {return translate(structs[d.struct]);})
	.attr("d",function(d) {return lineStar(k*d.size);})
	.style("title",function(d,i) {return storyData[i].name;})
	.style("fill",function(d,i) {return storyData[i].color;})
	.style("visibility","hidden")
	;
cStories.append("svg:title").text(function(d,i) {return storyData[i].name;})
	
var cStars=gStars.selectAll("path").data(stars).enter().append("svg:path")
	.attr("d",lineStar(5))
	.attr("transform",function(d) {return translate(stories[d.story]);})
	.style("fill",function(d) {return storyData[d.story].color;})
	.style("visibility","hidden")
	;
cStars.append("svg:title").text(function(d,i) {return movies[i].name;})

cStructs.on("click", function(d,i) {
	console.log("you clicked on struct #"+i);
	myStories=cStories.filter(function(s) {return s.struct==i;});
	myStories.style("visibility","visible");
	myStories.each(function(s,i) {
			var starlets=~~Math.random(40)+20;starlets=d3.range(starlets).map(function(d) {
				var starletX=d3.scale.linear().range([structs[s.struct].x-25+50*Math.random(),s.x]);
				var starletY=d3.scale.linear().range([structs[s.struct].y-25+50*Math.random(),s.y]);
				var k=Math.random();
				return [d,starletX(k),starletY(k)]});
			
			
			gStories.selectAll(".starlets"+i)
				.data(starlets)
				.enter()
				.append("svg:circle")
				.classed("starlets"+i,1)
				.attr("cx",stories[s.struct].x).attr("cy",stories[s.struct].y).attr("r",2).style("fill","gold").style("opacity",".5")
				.transition().duration(200)
					.attr("cx",function(d) {return d[1];})
					.attr("cy",function(d) {return d[2];})
					.each("end",function() {d3.select(this).remove();})
		});
	
	
	myStories.transition()
		.duration(1000)
		.ease("elastic")
		.attr("transform",translate);
	d3.select(this).transition().style("opacity",0).each("end",function() {d3.select(this).style("opacity",1).style("visibility","hidden");})
		
})

cStories.on("click", function(d,i) {
	console.log("you clicked on story #"+i);
	myStars=cStars.filter(function(s) {return s.story==i;});
	myStars.style("visibility","visible");
	gStories.append("svg:path").style("stroke","white").style("fill","none")
		.attr("d",lineStar(k*d.size))
		.attr("transform",translate(d))
		.transition().attr("d",lineStar(1000)).style("opacity",0).each("end",function() {d3.select(this).remove();})
	myStars.each(function(s,i) {
		var starlets=~~Math.random(10)+10;starlets=d3.range(starlets).map(function(d) {
			var starletX=d3.scale.linear().range([stories[s.story].x-10+20*Math.random(),s.x]);
			var starletY=d3.scale.linear().range([stories[s.story].y-10+20*Math.random(),s.y]);
			var k=Math.random();
			return [d,starletX(k),starletY(k)]});
		
		
		gStars.selectAll(".starlets"+i)
			.data(starlets)
			.enter()
			.append("svg:circle")
			.classed("starlets"+i,1)
			.attr("cx",stories[s.story].x).attr("cy",stories[s.story].y).attr("r",2).style("fill","gold").style("opacity",".5")
			.transition().duration(200)
				.attr("cx",function(d) {return d[1];})
				.attr("cy",function(d) {return d[2];})
				.each("end",function() {d3.select(this).remove();})
	});
	myStars.transition()
		.duration(1000)
		.ease("elastic")
		.attr("transform",translate)
		;
	d3.select(this).transition().style("opacity",0).each("end",function() {d3.select(this).style("opacity",1).style("visibility","hidden");});
		
})
	
cStories.on("dblClick",function(d,i) {
	console.log("dblClick");
	myStories=cStories.filter(function(s) {return s.struct==d.struct;})
	myStars=cStars.filter(function(s) {return storyStruct[s.story]==d.struct;})
	myStars.style("visibility","hidden");
	myStories.style("visibility","visible");
	myStories.transition()
		.duration(1000)
		.attr("cx",function(d) {return structs[d.struct].x;})
		.attr("cy",function(d) {return structs[d.struct].y;})
		.each("end",function() {d3.select(this).style("visibility","visible");})
})

cStars.on("click",function(d,i) {
	console.log("dblClick");
	myStory=cStories.filter(function(s,i) {return i==d.story;})
	myStars=cStars.filter(function(s) {return s.story==d.story;})
	myStars.transition()
		.duration(500)
		.style("opacity",.5)
		.attr("transform",function(d) {return translate(stories[d.story]);})
		.each("end",function() {d3.select(this).style("opacity",1).style("visibility","hidden");})
	myStory.attr("d",lineStar(0)).style("visibility","visible").transition().delay(500).duration(500).attr("d",function(d) {return lineStar(k*d.size);});
	gStories.append("svg:path").style("stroke","white").style("fill","none")
		.attr("d",lineStar(1000))
		.attr("transform",translate(stories[d.story]))
		.style("opacity",0)
		.transition().attr("d",lineStar(k*stories[d.story].size)).style("opacity",1).each("end",function() {d3.select(this).remove();})
	
	
})
*/

svg2=d3.select("#chart").append("svg:svg");
var format = d3.format(",d");
var pack = d3.layout.pack()
	.size([800, 600])
	.value(function(d) { return d.size; });
var node = svg2.data([json]).selectAll("g.node")
	.data(pack.nodes)
	.enter().append("g")
	.attr("class", function(d) { return d.children ? "parent node" : "leaf node"; })
	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	
node.append("svg:title")
	.text(function(d) { if(d.depth==1) {return structData[d.name];}
			    if(d.depth==2) {return storyData[d.name].name;}
			    if(d.depth==3) {return movies[d.name].name;}
			    return "";});

node.filter(function(d) {return d.children}).append("circle").attr("r", function(d) { return d.r;})
	.style("fill",function(d) {
		if(d.depth==2) {return storyData[d.name].color;}
		else {return "blue";}}
	)
	.style("opacity",function(d) {
		if(d.depth==2) {return 1;} else {return .1;}}).style("stroke","white");

node.filter(function(d) {return !d.children}).append("path").attr("d", function(d) { return lineStar(d.r);})
	.style("fill",function(d) {var myScale=d3.scale.linear().domain([0,1000]).range(["black","gold"]).clamp([true]);return myScale(movies[d.name].p);})
	