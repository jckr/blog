(function() {
	vis={};
	var width,
    	height,
    	svg, defs, map, buttons,
 		size, happiness,
    	path;
    var blue = "#3b5998";
	var lightblue = "#7a94cc";
	function dist(x1,y1,x2,y2) {
		return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	}

	function d(r, h) { 
		h = h - 1 / 3;
		if(h<-1) {h=-1}; 
		if(h>1) {h=1}; 
		h = h / 2;
		var x0 = -r * (2/3) * Math.cos(Math.PI/3), y0 = -r / 3 , x1 = -x0, y1= y0;  
		var x2 = 0, y2 = h * r; return "M" + x0 + "," + y0 + " Q" + x2 + "," + y2 + " " + x1 + "," + y1;
	}


	function face(h) {
		var path = "M-30,";
		var mouthScale1 = d3.scale.linear().domain([-1,1]).range([40,20])(h);
		var mouthScale2 = d3.scale.linear().domain([-1,1]).range([10,50])(h);

		var eyeScaley1 = d3.scale.linear().domain([-1,0,1]).range([-5,-10,-5])(h);
		var eyeScaley2 = d3.scale.linear().domain([-1,0,1]).range([-15,-10,-15])(h);
		var eyeScaley3 = d3.scale.linear().domain([-1,0,1]).range([-15,-10,-5])(h);
		var eyeScalex1 = -40;
		var eyeScalex2 = d3.scale.linear().domain([-1,0,1]).range([-40,-30,-30])(h);
		var eyeScalex3 = d3.scale.linear().domain([-1,0,1]).range([-30,-20,-20])(h);


		path = path + mouthScale1 + " Q0," + mouthScale2 + " 30," + mouthScale1 + " ";

		path = path + "M" + eyeScalex1 + "," + eyeScaley1 + " Q" + eyeScalex2 + "," + eyeScaley2;
		path = path + " " + eyeScalex3 + "," + eyeScaley3

		path = path + "M" + -eyeScalex1 + "," + eyeScaley1 + " Q" + -eyeScalex2 + "," + eyeScaley2;
		path = path + " " + -eyeScalex3 + "," + eyeScaley3
		path = path + " M-30,-1 A1,1 0 1,1 -29.999,-0.999 M30,-1 A1,1 0 1,1 29.999,-0.999"
		
		return path;	
	}

	vis.init=function(params) {
		if (!params) {params={}}
		var chart=params.chart||"#chart";

		svg=d3.select(chart).style({width:(width=(params.width||960))+"px",height:(height=(params.height||480))+"px"})
			.append("svg").attr({width:width,height:height})
			;
		
		defs = svg.selectAll("defs").data([{}]).enter()
			.append("defs"); 
		var pattern = defs
			.append("pattern")
			.attr({id:"hashed",x:0,y:0,width:"5px",height:"5px",patternUnits:"userSpaceOnUse"});
		pattern.append("rect").attr({width: 5, height: 5}).style("fill", "#eee");
		pattern.append("path")
				.attr("d","M0,5L5,0")
				.style({stroke:blue,fill:"none"})
		defs
			.append("clipPath")
			.attr("id", "mapSection")
			.append("rect").attr({width: 960, height: 500})

		size = +d3.select("#size").property("value");
		happiness = +d3.select("#happiness").property("value");

		d3.select("#size").on("change", function() {
			size = d3.select(this).property("value");
			vis.draw();
		})

		d3.select("#happiness").on("change", function() {
			happiness = d3.select(this).property("value");
			vis.draw();
		})

		vis.draw();
	}

	
				
	vis.draw=function() {
		console.log("size",size,"happiness",happiness)
		

		var rScale = d3.scale.sqrt().domain([0, 100*1000*1000]).range([0, 50]);
		var sScale = d3.scale.linear().domain([-1,0,1]).range(["red", "#ffffef", "green"]);

		// initiate

		var newFace = svg.selectAll("g.face").data([size]).enter().append("g").classed("face", 1).attr("transform", "translate(500, 300)");
		newFace.append("circle").attr("r", 60).style("stroke", "#222").style("fill", sScale).style("stroke-width", 2)
		newFace.append("path").attr("d", face(happiness)).style("stroke", "#222").style("fill", "none").style("stroke-width", 2)

		// update

		svg.selectAll("g.face").transition().attr("transform", function() {return "translate(500, 300) scale(" + (size / 60) + ")";});
		svg.selectAll("g.face circle").style("fill", sScale(happiness));
		svg.selectAll("g.face path").attr("d", face(happiness))

		return 0;
	
	} 
})();