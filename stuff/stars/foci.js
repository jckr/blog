var w = 1280,
    h = 600,
	//k=.5;
 
	color = d3.scale.category20();

var c1=Math.cos(.2*Math.PI),c2=Math.cos(.4*Math.PI),
    s1=Math.sin(.2*Math.PI),s2=Math.sin(.4*Math.PI),
    r=1,r1=r*c2/c1,
    star=[[0,-r],[r1*s1,-r1*c1],[r*s2,-r*c2],[r1*s2,r1*c2],[r*s1,r*c1],[0,r1],[-r*s1,r*c1],[-r1*s2,r1*c2],[-r*s2,-r*c2],[-r1*s1,-r1*c1],[0,-r]]//;
    
lineStar=function(k) {
	var line=d3.svg.line()
		.x(function(d) {return d[0]*k;})
		.y(function(d) {return d[1]*k;});
	return line(star)+"Z";
}
var translate=function(d) {return "translate("+d.x+","+d.y+") rotate("+(10*(d.x+d.y)%360)+")";} // helper function to make transform attributes easier to type.
	
var x1=d3.scale.linear().domain([0,6]).range([0,w]);
var x2=d3.scale.linear().domain([0,7]).range([0,w]);
var y=d3.scale.linear().domain([0,5]).range([0,h]);

var gs=d3.scale.linear().domain([0,1000]).range([0,12]).clamp([true]); // resizes radius of star by earnings. $100m-> 10px, $1b -> 100px. 


var svg = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

// this creates 22 groups (one per story type) positioned throughout the screen.


// reshaping data. 
// from the movies data we create pack which can easily be turned into a circle packing layout
// only there are now 22 layouts, not just 1.

var sizes=storyData.map(function() {return 0;});
pack=storyData.map(function(d,i) {return {"name":i, "children": []};})			// pack is an array of objects.
movies.forEach(function(d,i) {pack[d.s].children.push({name:i,size:gs(d.gross)});
	sizes[d.s]+=d.gross/50;
})	// the children key of each pack is populated
											// by the movies of the corresponding type
var packLayout=pack.map(function(d) {var mySize=d3.sum(d,function(s) {return s.size;})*3;
return d3.layout.pack().size([mySize,mySize]).value(function(d) {return d.size;});})


var treemapNodes={"name":"treemap","children":[]};
sizes.forEach(function(s,i) {treemapNodes.children.push({"name":i,"size":s});})

var treemap = d3.layout.treemap()
	.size([w-200, h-200])
	.sticky(true)
	.value(function(d) { return d.size; });
var node=svg.data([treemapNodes]).selectAll(".g")
       .data(treemap.nodes);	// we are not drawing this treemap. We're just doing that to position groups.




var gData=[];

var g=storyData.map(function(i,d) {
	var myNode=treemapNodes.children[d];
	var posx=100+myNode["x"]+myNode["dx"]/2;
	var posy=100+myNode["y"]+myNode["dy"]/2
	//var posx,posy;
	if     (d<5)  {posx=x1(d+1);posy=y(1);}
	else if(d<11) {posx=x2(d-4);posy=y(2);}
	else if(d<16) {posx=x1(d-10);posy=y(3);}
	else          {posx=x2(d-15);posy=y(4);}
	posx-=75;posy-=75;
	//
	gData.push({x:posx,y:posy});
	return svg.append("svg:g").attr("transform","translate("+posx+","+posy+")");
});






var starsPos=new Object;

// at this stage the nodes are populated (into pack) but not yet positioned.

var packLayout = d3.layout.pack()
	.size([150, 150])
	.value(function(d) {return d.size;});

pack.forEach(function(d,i) {
	var node=g[i].data([d]).selectAll(".node")
	.data(packLayout.size([sizes[i],sizes[i]]).nodes)
	.enter().append("svg:g")
	
	.attr("transform", function(d) {
		if(d.depth){
		var pos=new Object;
		pos["x"]=d.x+gData[i].x;
		pos["y"]=d.y+gData[i].y;
		pos["r"]=d.r;
		pos["s"]=i;
		starsPos[d.name]=pos;}
	return "translate(" + d.x + "," + d.y + ")"; 
	
	});
	
	
//	node.filter(function(d) {return !d.children}).append("path").attr("d", function(d) { return lineStar(d.r);})
//	.style("fill",storyData[i].color);
});
	

var j=0;

var random=movies.map(function(d,i) {return [i,Math.random()];})
random.sort(function(a,b) {return a[1]>b[1];})

var adder=setInterval(addNode, 50);



function addNode() {
	function initX() {return w/2-50+100*Math.random();}
	
	var i=random[j][0];
	var movie=movies[i];
	var starPos=starsPos[i];//console.log(starPos);
	var starX=initX();
	var starDist=Math.sqrt((starPos.x-starX)*(starPos.x-starX)+starPos.y*starPos.y);
	//console.log(starPos.x+" "+starX+" "+starPos.y+" "+starDist);
	var myStar=svg.append("svg:path").data([{x:starX,y:0}])
		.attr("d",lineStar(starPos["r"]))
		.attr("transform",translate)
		.style("fill",storyData[movie.s].color);
		
	myStar.data([starPos]).transition().ease("elastic").duration(starDist*3).attr("transform",translate)
		.each("end",function() {
		svg.append("svg:path").style("stroke","white").style("fill","none")
				.attr("d",lineStar(0))
				.attr("transform",translate(starPos))
				.style("opacity",1)
				.transition().attr("d",lineStar(100)).style("stroke","black").duration(1000).style("opacity",0).each("end",function() {d3.select(this).remove();})
		
		})
	
	var starlets=~~Math.random(10)+10;
	starlets=d3.range(starlets).map(function(d) {
		var myX=initX();
		var starletX=d3.scale.linear().range([myX,starPos.x]);
		var starletY=d3.scale.linear().range([0,starPos.y]);
		var k=Math.random();
		return [d,myX,starletX(k),starletY(k)]});

	svg.selectAll(".starlets"+j)
		.data(starlets)
		.enter()
		.append("svg:circle")
		.classed("starlets"+j,1)
		.attr("cx",function(d) {return d[1];}).attr("cy",0).attr("r",2).style("fill","white").style("opacity",".5")
			.transition().duration(200)
			.style("fill","gold")//.style("opacity","0")
			.attr("cx",function(d) {return d[2];})
			.attr("cy",function(d) {return d[3];})
			.each("end",function() {d3.select(this).remove();})
	
	j++;
	if(j>=movies.length){clearInterval(adder);}
}
