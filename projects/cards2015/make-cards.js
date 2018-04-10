(function() {
	vis={};
	var height = 1080, width = 600, margin = 16, backwidth = 576, backlabelx = 624, backfromy = 240, backtoy = 408;
	var chart, svg;
	var defs, style;
	var frontsvg, backsvg, front, back;
	var data;

 var done = false;
	ltn = function(c, max, min) {
		min = min || 0;
		max = max || 25;
		return d3.scale.linear().domain([0,25]).range([min, max])(c.toLowerCase().charCodeAt(0) - 97);
	}

	vis.init=function(params) {
		if (!params) {params = {}}
		
			frontsvg = d3.select("#front").selectAll("svg")
			.data([{width: width, height: height}]).enter()
			.append("svg").attr({width: width, height: height})
			.attr("version", 1.1)
        	.attr("xmlns", "http://www.w3.org/2000/svg");

		defs = frontsvg.append("defs");

		front = frontsvg.append("g").classed("front", 1);
		front.append("rect")
			.attr({width: width, height: height})
			.style("stroke", "#222")
			.classed("bkg", 1);

		front.append("g").classed("layers", 1);
		front.append("g").classed("happy", 1)
			.selectAll("text").data([{text: "HAPPY", y: 200}, {text: "2015", y: 288}]).enter().append("text")
			.text(function(d) {return d.text})
			.attr({x: 100, y: function(d) {return d.y}})
			.style({"font-family": "HelveticaNeue-Bold", "font-size": 100, opacity: .8, fill: "#fff"});

		defs.append("clipPath")
			.attr({id: "frontMask"})
			.append("rect").attr({width: width, height: height})


		defs.append("clipPath")
			.attr({id: "pattern"})
			.append("rect").attr(({width: 100, height: 100}))

		front.style("clip-path", "url(#frontMask)")

		params.names = params.names || ["a", "a"];
		params.rawnames = params.rawnames || ["a", "a"];
		params.fullname = params.rawnames[0] + " " + params.rawnames[1];
	  	
		d3.selectAll("input, select").on("change", function() {
			var d = d3.select(this);
			var key = d.property("name");
			var keyval = d.property("value");

			if (key == "fn") {
				params.rawnames[0] = keyval;
				params.names[0] = keyval.replace("-", "").replace(".", "");
				params.fullname = keyval + " " + params.rawnames[1];
			}

			if (key == "ln") {
				params.rawnames[1] = keyval;
				params.names[1] = keyval.replace("-", "").replace(".", "");
				params.fullname  = params.rawnames[0] + " " + keyval;
			}
			vis.loaddata(params);
		})


		d3.select(".downloadf").on("click", function() {
			var mode = "png";
			frontsvg = d3.select("#front").select("svg");
			front = frontsvg.select("g.front");

			var htmlFront = frontsvg
	        .node().parentNode.innerHTML;
		 	front.attr({transform: null});
			var imgsrc = 'data:image/svg+xml;base64,'+ btoa(htmlFront);

	 		var canvas = document.querySelector("canvas"),
		  	context = canvas.getContext("2d");
	 
	  		var image = new Image;
	  		image.src = imgsrc;
	  		image.onload = function() {
		  		context.drawImage(image, 0, 0);
		  		console.log("image drawn on canvas");
		  		var canvasdata = canvas.toDataURL("image/png");
		  		if (canvasdata.length > 2560000) {
		  			console.warn("warning - image too large. going for webp")
		  			mode = "webp"
		  			canvasdata = vis.canvasdata = canvas.toDataURL("image/webp");
		  		}		  		
		  	
			var a = document.createElement("a");
		  	a.download = params.names[0] + "-" + params.names[1] + "." + mode;
		  	a.href = canvasdata;
			console.log("href set");

		  	a.click();

		  	a.remove();
		  }
		});

    	vis.debug = false;
    
		vis.loaddata(params);
	}
		
	vis.loaddata = function(params) {
		data = params.names.map(function(n, i) {
			var d = {};
			var l = n.length;
			d.id = (i + 1);
			d.name = n;
			d.pattern = d3.round(ltn(n[0 % l]),0);
			d.maincolor = d3.hsl(ltn(n[1 % l], 360), .2, .8);
			d.accentcolor = d3.hsl(ltn(n[2 % l], 360), .6, .5);
			d.size = ltn(n[3 % l], 200, 50);
			d.M = (width + 400) / d.size;
			d.N = (height + 400) / d.size;
			d.angle = ltn(n[4 % l], 10, -10);
			return d;



		})

	

		vis.data = data.reverse();
		vis.draw();
	}

	vis.draw = function() {
		bkg = d3.select(".bkg").style("fill", 
			d3.hsl(d3.scale.linear().domain([0, 20]).range([0, 360])(params.fullname.length % 20), .3, .3) 
		)

		var front = d3.select("g.front g.layers");

		front.selectAll("g.layer").data(data).exit().remove();
		front.selectAll("g.layer").data(data).enter().append("g").classed("layer", 1);

		layers = front.selectAll("g.layer").data(data);
		layers.selectAll("*").remove();
		layers.attr("transform", function(d) {return "rotate(" + d.angle + ")";})
		layers.attr("class", function(d, i) {return "layer l" + i;})

		layers.selectAll("g.row").data(function(d) {
			return d3.range(d.N).map(function(r) {
			return d})}).enter().append("g")
		.attr("transform", function(d, i) {return "translate(0, " + (i * d.size - 200) + ")";})
		.attr("class", function(d, i) {return "row r" + i;})
			.selectAll("g.cell").data(function(d) {
			return d3.range(d.M).map(function(r) {
			return d})}).enter().append("g").classed("cell", 1)
		.attr("transform", function(d, i) {return "translate(" + (i * d.size - 200) + ")";})
		.attr("class", function(d, i) {return "cell c" + i;})

		vis.data.forEach(function(d, l) {
			d3.range(d.N).forEach(function(r) {
				d3.range(d.M).forEach(function(c) {
					vis.createPattern(d3.select(".l" + l + " .r" + r + " .c" + c), d);
				})
			})
		})

		

	}

	vis.createPattern = function(cell, d) {
		var a = d.size / 100;
		var main = d.maincolor;
		var accent = d.accentcolor;
		var pattern = cell.append("g").style("clip-path", "url(#pattern)").attr("transform", "scale(" + a + ")");
		var s2 = Math.sqrt(2), s3 = Math.sqrt(3), s32 = s3/2;
		
		var patternId = d3.round(d.pattern, 0);
		switch(patternId) {
			case 0: // a
				pattern.append("circle").attr({cx: 65, cy: 65, r: 10 * s2}).style("fill", accent);
				pattern.append("circle").attr({cx: 65, cy: 65, r: 10}).style("fill", main);
				pattern.append("circle").attr({cx: 15, cy: 15, r: 10 * s2}).style("fill", accent);
				pattern.append("circle").attr({cx: 15, cy: 15, r: 10}).style("fill", main);
				break;
			case 1: // b
				pattern.append("path").attr("d", "M0,50 25,0 50,50Z").style("fill", main);
				pattern.append("path").attr("d", "M50,50 75,0 100,50Z").style("fill", accent);
				pattern.append("path").attr("d", "M25,100 50,50 75,100Z").style("fill", main);
				pattern.append("path").attr("d", "M0,50 25,100 0,100Z").style("fill", accent);
				pattern.append("path").attr("d", "M100,50 75,100 100,100Z").style("fill", accent);
				break;
			case 2: // c
				var hexpath = "M14.64,14.64L35.36,14.64L50,0L64.64,14.64L85.36,14.64L85.36,35.36L100,50L85.36,64.64L85.36,85.36L64.64,85.36L50,100L35.36,85.36L14.64,85.36L14.64,64.64L0,50L14.64,35.36L14.64,14.64";
				pattern.append("path").attr("d", hexpath).style({fill: "none", stroke: accent, "stroke-width": 5});
				pattern.append("path").attr("d", hexpath).style({fill: "none", stroke: main, "stroke-width": 2});

				break;
			case 3: // d
				var leftStar = "M25,41.6666 L12.5,50 L12.5,33.3333 L0,25 L12.5,16.6667 V0 L25,8.3333 Z"; 
				var rightStar = "M0,8.3333 L12.5,0 v16.6667 L25,25 L12.5,33.3333 V50 L0,41.6666 Z";

				pattern.append("path").attr("d", rightStar).style("fill", main)
				pattern.append("path").attr({d: leftStar, transform: "translate(25)"}).style("fill", accent)
				pattern.append("path").attr({d: rightStar, transform: "translate(50)"}).style("fill", accent)
				pattern.append("path").attr({d: leftStar, transform: "translate(75)"}).style("fill", main)
				pattern.append("path").attr({d: leftStar, transform: "translate(0,50)"}).style("fill", main)
				pattern.append("path").attr({d: rightStar, transform: "translate(25,50)"}).style("fill", main)
				pattern.append("path").attr({d: leftStar, transform: "translate(50,50)"}).style("fill", main)
				pattern.append("path").attr({d: rightStar, transform: "translate(75,50)"}).style("fill", main)
				

				break;
			case 4: // e
				pattern.append("circle").attr({cx:100, cy:100, r:50}).style({fill: "none", stroke: accent, "stroke-width": 10});
				pattern.append("circle").attr({cx:100, cy:100, r:50}).style({fill: "none", stroke: main, "stroke-width": 5});
				
				pattern.append("circle").attr({cx:0, cy:0, r:50}).style({fill: "none", stroke: accent, "stroke-width": 10});
				pattern.append("circle").attr({cx:0, cy:0, r:50}).style({fill: "none", stroke: main, "stroke-width": 5});
			

				break;
			case 5: // f
				pattern.append("path").attr("d", "M25,0 L50,0 v25 L25,12.5Z").style("fill", accent);
				pattern.append("path").attr("d", "M75,0 L100,0 v25 L75,12.5Z").style("fill", accent);
				pattern.append("path").attr("d", "M0,25 L25,37.5 v37.5 L0,62.5Z").style("fill", accent);
				pattern.append("path").attr("d", "M50,25 L75,37.5 v37.5 L50,62.5Z").style("fill", accent);
				pattern.append("path").attr("d", "M25,75 L50,87.5 V100 h-25 Z").style("fill", accent);
				pattern.append("path").attr("d", "M75,75 L100,87.5 V100 h-25 Z").style("fill", accent);

				pattern.append("path").attr("d", "M0,25 L25,12.5 L50,25 L25,37.5 Z").style("fill", main);
				pattern.append("path").attr("d", "M50,25 L75,12.5 L100,25 L75,37.5 Z").style("fill", main);
				pattern.append("path").attr("d", "M0,62.5 L25,75 L0,87.5 Z").style("fill", main);
				pattern.append("path").attr("d", "M100,62.5 L75,75 L100,87.5 Z").style("fill", main);
				pattern.append("path").attr("d", "M25,75 L50,62.5 L75,75 L50,87.5 Z").style("fill", main);

				break;
			case 6: // g
				pattern.append("circle").attr({cx: 70, cy: 15, r: 10}).style("fill", accent);
				pattern.append("circle").attr({cx: 65, cy: 20, r: 10}).style("fill", main);
				pattern.append("circle").attr({cx: 20, cy: 65, r: 10}).style("fill", accent);
				pattern.append("circle").attr({cx: 15, cy: 70, r: 10}).style("fill", main);
				break;
			case 7: // h
				var centers = [[0, 25], [100, 25], [0, 75], [50, 50], [100, 75], [0, 125], [50, 100], [100, 125], [50, 150]];
				
				var arcs = [
					{steps: 7, r: 20, span: 1.5},
					{steps: 11, r: 30, span: 1.5}, 
					{steps: 15, r: 40, span: 1.8}, 
					{steps: 23, r: 50, span: 1.8}]
				centers.forEach(function(c, i) {
					var group = pattern.append("g").attr("transform", "translate(" + c[0] + "," + c[1] + ")");
					arcs.forEach(function(a) {
						d3.range(a.steps).forEach(function(j) {
							if (j % 2) {
								var start = (Math.PI - a.span) / 2;
								var angle = start + a.span  * j / a.steps;
								var x = Math.cos(angle) * a.r;
								var y = -Math.sin(angle) * a.r;
								var xx = c[0] + x, yy = c[1] + y;
								if (xx < 102 && xx > -2 && yy < 102 && yy > -2) {
									group.append("circle").attr({cx:x, cy:y, r:2})
									.style({fill: (c[0] == 50) ? accent : main}) 
								}
							}	
						})
	
					})
				})


				break;
			case 8: // i
				pattern.append("line").attr({x1:50,x2:50,y2:100}).style({"stroke-width": 10, stroke: accent});
				pattern.append("line").attr({x1:50,x2:50,y2:100}).style({"stroke-width": 5, stroke: main});

				break;
			case 9: // j
				var p1 = "M10,20L30,10L40,30L20,40Z M60,70L80,60L90,80L70,90Z";
				var p2 = "M0,0L20,40 M10,20L50,0 M0,50L40,30 M30,10L70,90 M50,100L90,80 M60,70L100,50 M80,60L100,100"
				pattern.append("path").attr("d", p2).style({stroke:accent, fill: "none", "stroke-width": 1});
				pattern.append("path").attr("d", p1).style({fill:main, stroke: "none"});
				pattern.append("rect").attr({width:100,height:100, stroke: accent, fill: "none"})
				break;
			case 10: // k
				var beanShape = "M0,25 C0,25 -0.664841257,0 13,0 L45,0 C45,0 45,25 31,25 C17.7296185,25 0,25 0,25 Z";
				var pos = ["(0,0)", "(50,0)", "(5,33.3333)", "(55,33.3333)", "(0,66.6667)", "(50,66.6667)"];
				pattern.selectAll("path").data(pos).enter().append("path")
					.attr("d", beanShape)
					.attr("transform", function(d) {return "translate" + d;})
					.style("fill", function(d, i) {return (i == 3) ? accent : main})
				break;
			case 11: // l
			var lpath = "M0,60 C40,60 60,34 60,24 C60,14.2 54,10 50,10 C46.4,10 40,13.7 40,24 C40,34.4 60,60 100,60";
			 	pattern.append("path").attr("d", lpath).style({fill: "none", stroke: accent, "stroke-width": 10});
				pattern.append("path").attr("d", lpath).style({fill: "none", stroke: main, "stroke-width": 5});
				break;
			case 12: // m
				var step = 100 * s2 / 16;
				var centers = ["(0,0)", "(100,0)", "(50,50)", "(0,100)", "(100,100)"];
				pattern.selectAll("g").data(centers).enter().append("g")
					.attr("transform", function(d) {return "translate" + d;})
					.style("stroke", function(d, i) {return (i == 2) ? main : accent})
					.style({"stroke-width": 2, fill: "none", "stroke-linecap": "butt", "stroke-linejoin": "miter"})
					.selectAll("path").data(d3.range(5)).enter().append("path")
					.attr("d", function(d) {
						var y0 = 50 -   d * step;
						var x0 = -   d * step;
						var y1 = 50 - 2 * d * step;
						var x1 =  d * step; 
						return "M " + x0 + "," + y0 + "L0," + y1 + "L" + x1 + "," + y0; 
					})

				break;
				 	
			case 13: // n

				var npath = "M0,41.05L16.9,24.15L50,40.09L83.1,24.15L100,41.05 M0,58.95L16.9,75.85L50,59.91L83.1,75.85L100,58.95 M41.05,100L24.15,83.1L40.09,50L24.15,16.9L41.05,0 M58.95,100L75.85,83.1L59.91,50L75.85,16.9L58.95,0 M18.32,0L14.64,14.64L0,18.32L12.63,22.68L7.16,44.46L42.99,57.01L55.54,92.84L77.32,87.37L81.68,100L85.36,85.36L100,81.68L87.37,77.32L92.84,55.54L57.01,42.99L44.46,7.16L22.68,12.63L18.32,0 M0,81.68L14.64,85.36L18.32,100L22.68,87.37L44.46,92.84L57.01,57.01L92.84,44.46L87.37,22.68L100,18.32L85.36,14.64L81.68,0L77.32,12.63L55.54,7.16L42.99,42.99L7.16,55.54L12.63,77.32L0,81.68"
				pattern.append("path").attr("d", npath).style({fill: "none", stroke: accent, "stroke-width": 5});
				pattern.append("path").attr("d", npath).style({fill: "none", stroke: main, "stroke-width": 2});

				break;
			case 14: // o
			pattern.append("circle").attr({cx: 50, cy: 50, r: 20}).attr({fill: accent});
			pattern.append("circle").attr({cx: 50, cy: 50, r: 20/s2}).attr({fill: main});

				break;
			case 15: // p

				var lines = [
				{x:0,y:[[0,100]]},
				{x:5,y:[[0,100]]},
				{x:10,y:[[0,100]]},
				{x:15,accent:true,y:[[0,50]]},
				{x:20,accent:true,y:[[0,31.9722436226801]]},
				{x:25,accent:true,y:[[0,25.5051025721682]]},
				{x:30,accent:true,y:[[0,21.2771867673099]]},
				{x:35,y:[[0,18.3772233983162],[63.228756555323,36.771243444677],[81.6227766016838,100]]},
				{x:40,y:[[0,16.4589803375032],[67.3205080756888,32.6794919243112],[83.5410196624968,100]]},
				{x:45,y:[[0,15.3589838486224],[69.3649167310371,30.6350832689629],[84.6410161513776,100]]},
				{x:50,y:[[0,15],[70,30],[85,100]]},
				{x:55,y:[[0,15.3589838486224],[69.3649167310371,30.6350832689629],[84.6410161513776,100]]},
				{x:60,y:[[0,16.4589803375032],[67.3205080756888,32.6794919243112],[83.5410196624968,100]]},
				{x:65,y:[[0,18.3772233983162],[63.228756555323,36.771243444677],[81.6227766016838,100]]},
				{x:70,accent:true,y:[[78.7228132326901,100]]},
				{x:75,accent:true,y:[[74.4948974278318,100]]},
				{x:80,accent:true,y:[[68.0277563773199,100]]},
				{x:85,accent:true,y:[[50,100]]},
				{x:90,y:[[0,100]]},
				{x:95,y:[[0,100]]},
				{x:100,y:[[0,100]]}
				]

				pattern.selectAll("g.line").data(lines).enter().append("g").classed("line", 1)
					.attr("transform", function(d) {return "translate(" + d.x + ")"})
						.style({stroke: function(d) {return d.accent ? accent : main}})
						
					.selectAll("line").data(function(d) {return d.y}).enter().append("line")
						.attr({
							y1: function(d) {return d[0]}, 
							y2: function(d) {return d[1]}}
						)

				var arcs = [
					{r:20, sweep:1, x0:30, y0:50, x1:70,y1: 50}, 
					{r:25, sweep:1, x0:25, y0:50, x1:70,y1: 35},
					{r:30, sweep:1, x0:20, y0:50, x1:70,y1: 27.6393},
					{r:35, sweep:1, x0:15, y0:50, x1:70,y1: 21.2772},

					{r:20, sweep:0, x0:30, y0:50, x1:70,y1: 50}, 
					{r:25, sweep:0, x0:30, y0:65, x1:75,y1: 50},
					{r:30, sweep:0, x0:30, y0:72.3607, x1:80,y1: 50},
					{r:35, sweep:0, x0:30, y0:78.7228, x1:85,y1: 50}
					]

				pattern.selectAll("path").data(arcs).enter().append("path")
					.style({stroke: accent, fill: "none"})
					.attr("d", function(d) {
						var path = "";
						if (d.sweep) {
							path = "M" + d.x0 + ",100 V50 A "
						} else {
							path = "M" + d.x0 + "," + d.y0 + " A "
						}
						path = path + d.r + "," + d.r + " 0 0," + d.sweep + " " + d.x1 + "," + d.y1

						if (!d.sweep) {
							path = path + " V0";
						} 
						return path;
					})

				break;
			case 16: // q

				// nope! lol
				break;
			case 17: // r
				var rects = [[10,10],[60,10],[10,60],[60,60]]
				pattern.selectAll("rect").data(rects).enter()
				.append("rect").attr({x:function(d) {return d[0];}, y:function(d) {return d[1];}, width: 20, height: 20}).style("fill", function(d,i) {return i ? main : accent});

				break;
			case 18: // s 
				sPath = "M0,50 C11.5704441,49.5327743 31,17 31,17 C31,17 33.9275866,13.1480791 34,10 C33.4898769,6.93648348 31.5815112,4.20539567 30,4 C29.1974322,3.81388182 28.3822933,6.63621902 28,9 C28.3822933,11.6989263 72,92 72,92 L71,96 C71,96 65.6757665,96.250169 66,91 C65.6757665,84.7880101 89.2808764,49.813547 100,50"

 				pattern.append("path").attr("d", sPath).style({fill: "none", stroke: accent, "stroke-width": 5});
				pattern.append("path").attr("d", sPath).style({fill: "none", stroke: main, "stroke-width": 2});
			
				break;
			case 19: // t
				pattern.selectAll("line").data([40, 45, 50, 55, 60]).enter().append("line").attr({
					x1: String, x2: String, y2: 100}).style("stroke", accent);
				pattern.append("rect").attr({y:40, height: 20, width: 100}).style({fill: main});
				break;
			case 20: // u

				// no need for now :)
				break;
			case 21: // v
				pattern.append("line").attr({x1:90, x2: 10, y2: 100}).style("stroke", accent);
				pattern.append("path").attr("d", "M0,0H20L100,100H80Z").style("fill", main);
				pattern.append("line").attr({x1:80,  y2: 100}).style("stroke", accent);
				pattern.append("line").attr({x1:100, x2: 20, y2: 100}).style("stroke", accent);
				break;
			case 22: // w
				pattern.selectAll("path").data(d3.range(11)).enter().append("path")
					.attr("transform", function(d) {return "translate(0," + (10 * d) +")";})
					.style({fill: "none", "stroke-width": 3, "stroke-linejoin": "round", stroke: function(d) {return (d % 5) ? main : accent}})
					.attr("d", function(d) {
						var path = "M"; 
						d3.range(21).forEach(function(i) {
							var x = i * 5;
							path = path + (i ? "L" : "") + x + "," + ((i % 2) ? "5" : "0");
						})
						return path;

					})
				break;
			case 23: // x
				break;
			case 24: // y
				var π = Math.PI;
				var p = d3.range(10).map(function(d) {var a = d * .2 * π  + π/2; return [Math.cos(a), Math.sin(a), a]});
				vis.p = p;
				var star = function(r, x, y) {
					var path = "";
					p.forEach(function(d, i) {
						var rr = (i % 2) ? (.385 * r) : (r);
						path = path + (i ? "L" : "M") + (rr * d[0] + x) + "," + (rr * d[1] + y)
					})
					path = path + "Z";
					return path;
				}

				pattern.selectAll("path").data([[50, 25], [25, 50], [75, 50], [50, 75]]).enter().append("path")
				.attr("d", function(d) {return star(10, d[0], d[1])})
				.style("fill", function(d, i) {return i % 2 ? main : accent})
				break;
			case 25: // z
				var zpath = "M13.4,0L17.27,6.7 M0,13.4L6.7,17.27 M86.6,0L82.74,6.7 M100,13.4L93.3,17.27 M100,86.6L93.3,82.74 M86.6,100L82.74,93.3 M13.4,100L17.27,93.3 M0,86.6L6.7,82.74 M0,13.4L8.2,8.2L13.4,0 M17.27,6.7L48.21,6.7 M51.79,6.7L82.74,6.7 M86.6,0L91.8,8.2L100,13.4 M93.3,17.27L93.3,48.21 M93.3,51.79L93.3,82.74 M100,86.6L91.8,91.8L86.6,100 M82.74,93.3L51.79,93.3 M48.21,93.3L17.27,93.3 M13.4,100L8.2,91.8L0,86.6 M6.7,82.74L6.7,51.79 M6.7,48.21L6.7,17.27 M28.87,0L13.4,26.79 M0,28.87L26.79,13.4 M86.6,26.79L86.6,26.79L71.13,0 M100,28.87L73.21,13.4 M100,71.13L73.21,86.6 M71.13,100L86.6,73.21 M28.87,100L13.4,73.21 M0,71.13L26.79,86.6 M26.79,86.6L50,63.4L73.21,86.6 M29.9,88.4L38.4,56.7L6.7,48.21 M6.7,51.79L38.4,43.3L29.9,11.6 M26.79,13.4L50,36.6L73.21,13.4 M13.4,73.21L36.6,50L13.4,26.79 M29.9,11.6L50,0L70.1,11.6 M48.21,6.7L56.7,38.4L88.4,29.9 M88.4,29.9L100,50L88.4,70.1 M11.6,70.1L0,50L11.6,29.9 M11.6,70.1L43.3,61.6L51.79,93.3 M48.21,93.3L56.7,61.6L88.4,70.1 M86.6,73.21L63.4,50L86.6,26.79 M51.79,6.7L43.3,38.4L11.6,29.9 M70.1,11.6L61.6,43.3L93.3,51.79 M93.3,48.21L61.6,56.7L70.1,88.4 M70.1,88.4L50,100L29.9,88.4";
				pattern.append("path").attr("d", zpath).style({fill: "none", stroke: accent, "stroke-width": 3});
				pattern.append("path").attr("d", zpath).style({fill: "none", stroke: main, "stroke-width": 1});
			
				break;

		}
		

	}


	function debug(d) {
		if (vis.debug) {console.log(d);}
	}
	
})();