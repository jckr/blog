(function() {
	vis={};
	var width = 550, height = 550;
	var w;
	var chart, svg, construction, pointLayer, toplayer;
	var defs, style;
	var frontsvg, backsvg, front, back;
	var data;


	var dist = vis.dist = function(p0, p1) {
		return Math.sqrt((p0[0] - p1[0]) * (p0[0] - p1[0]) + (p0[1] - p1[1]) * (p0[1] - p1[1]));
	} 

	var cross = vis.cross = function(p0, p1, p2, p3) {
		// tells where the lines (p0p1) and (p2p3) will cross
		var a, b, c, d, e, f, g, x, y;

		a = p0[0] * p1[1] - p0[1] * p1[0];
		b = p2[0] * p3[1] - p2[1] * p3[0];
		c = p0[0] - p1[0];
		d = p2[0] - p3[0];
		e = p0[1] - p1[1];
		f = p2[1] - p3[1];
		g = (c * f - d * e);
		if (g == 0) {
			// parallel lines
			return -1;
		} 

		x = (a * d - b * c) / g;
		y = (a * f - b * e) / g;
		return [x, y];
	}

	var crossCircles = vis.crossCircles = function(p0, r0, p1, r1) {
		// return the intersection of two circles
		var a, b, c, h, x, y;
		var d = dist(p0, p1);
		
		if (d > (r0 + r1) || d < Math.abs(r0 - r1) || (d == 0 && r0 == r1)) {
			return [];
		}

		a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
		h = Math.sqrt(r0 * r0 - a * a);
		
		b = (p1[0] - p0[0]) / d;
		c = (p1[1] - p0[1]) / d;
		x = p0[0] + a * b;
		y = p0[1] + a * c;
		
		if (h == 0) {
			// circles touch
			return [[x, y]];
		}

		return [[x + h * c, y - h * b], [x - h * c, y + h * b]];  
	}

	var line = vis.line = function(p0, p1) {
		// returns equation of a line that goes through 2 points if not vertical
		var a, b;
		if (p0[0] == p1[0]) {
			return -1;
		}
		b = (p1[0] * p0[1] - p0[0] * p1[1]) / (p1[0] - p0[0]);
		if (p0[0] == 0) {
			a = (p1[1] - b) / p1[0];
		}  else {
			a = (p0[1] - b) / p0[0];
		}
		return [a, b];
	}

	var crossLineCircle = vis.crossLineCircle = function(p0, p1, p2, r) {
		// return the intersections between  (p0p1) and the circle of center p2 and radius r
		var a, b, A, B, C, d, l;
		if(p0[0] != p1[0]) {
			l = vis.line(p0, p1);
			a = l[0];
			b = l[1];

			A = (1 + a * a);
			B = (-2 * p2[0] + 2 * a * b - 2 * a * p2[0]);
			C = (p2[0] * p2[0] + b * b + p2[1] * p2[1] - 2 * b * p2[1] - r * r);

			d = B * B - 4 * A * C;

			if (d > 0) {
				// two points of contact
				var x0, x1, y0, y1;
				x0 = (-B + Math.sqrt(d)) / (2 * A);
				x1 = (-B - Math.sqrt(d)) / (2 * A);
				if (x0 > x1) {
					var x2 = x0;
					x0 = x1; x1 = x2; // x0,y0 will be the leftmost point
				}
				y0 = a * x0 + b;
				y1 = a * x1 + b;
				return [[x0, y0], [x1, y1]];
			}

			if (d == 0) {
				// one point of contact
				var x = -B / (2 * A);
				var y = a * x + b;
				return [[x, y]]; 
			}

			if (d < 0) {
				// circles and line don't cross
				return [];
			}
		} else {
			// vertical line
			var b = p0[0];
			A = 1;
			B = -2 * p2[1];
			C = b * b + p2[0] * p2[0] - 2 * b * p2[0] + p2[1] * p2[1] - r * r;

			d = B * B - 4 * A * C;
			
			if (d > 0) {
				// two points of contact
				var y0, y1;
				y0 = (-B + Math.sqrt(d)) / (2 * A);
				y1 = (-B - Math.sqrt(d)) / (2 * A);
				if (y0 > y1) {
					// x0, y0 will be the topmost point
					var y2 = y0;
					y0 = y1; y1 = y2;
				}
				return [[b, y0], [b, y1]];
			}

			if (d == 0) {
				// one point of contact
				return [[b, -B / (2 * A)]]; 
			}

			if (d < 0) {
				// circle and line don't cross
				return [];
			}
		}
	}

	var polygon = vis.polygon = function(p0, r, n, startAngle) {
		// returns n points corresponding to a regular polygon with n sides around
		// p0 with radius r

		return d3.range(n).map(function(d) {
			var angle = (2 * Math.PI * d / n) + (startAngle || 0);
			return [p0[0] + r * Math.cos(angle), p0[1] + r * Math.sin(angle)];
		})
	}

	var pathPolygon = vis.pathPolygon = function(points, open) {
		// points are the xy coordinates of the polygon. 
		// open flag leaves the polygon open or not. 
		var open = open || 0;

		var path = "M";
		points.forEach(function(d, i) {
			path = path + (i ? "L" : "") + d[0] + "," + d[1];
		})
		path = path + (open ? "" : "Z");
		return path;
	}

	var input = vis.input = function() {
		var p0x, p0y, p1x, p1y, r;
		p0x = d3.select("input#p0x").property("value");
		p0y = d3.select("input#p0y").property("value");
		p1x = d3.select("input#p1x").property("value");
		p1y = d3.select("input#p1y").property("value");
		console.log("args:",vis.mode,p0x,p0y,p1x,p1y,r);
		r = d3.select("input#r").property("value");
		if (p0x !== "" && p0y !== "") {
			p0x = +p0x; p0y = +p0y;
			if (vis.mode == "addCircle" && r !== "") {
				r = +r;
				d3.select("button.confirm.ok").classed("disabled", 0).on("click", function() {
					vis.validate();
					vis.addCircle([p0x, p0y], r, vis.currentStep);
					d3.select("button.newstep").classed("disabled", 0);
				});
				d3.select("button.confirm.cancel").classed("disabled", 0).on("click", function() {
					d3.selectAll("input").property("value", "");
					vis.selected = [];
					d3.selectAll("button.confirm").classed("disabled", 1).on("click", null);
				})
			}
			if (p1x !== "" && p1y !== "") {
				p1x = +p1x; p1y = +p1y;
				if (vis.mode == "addLine") {
					d3.select("button.confirm.ok").classed("disabled", 0).on("click", function() {
					vis.validate();
					vis.addLine([p0x, p0y], [p1x, p1y], vis.currentStep);
					d3.select("button.newstep").classed("disabled", 0);
					});
					d3.select("button.confirm.cancel").classed("disabled", 0).on("click", function() {
						d3.selectAll("input").property("value", "");
						vis.selected = [];
						d3.selectAll("button.confirm").classed("disabled", 1).on("click", null);
					})
				}
				if (vis.mode == "drawshape" && vis.selected.length > 1) {
						d3.select("button.confirm.ok").classed("disabled", 0).on("click", function() {
						vis.drawPathByNumber(vis.selected, 1);
						vis.selected = [];
						d3.selectAll("input#p0x, input#p0y, input#p1x, input#p1y").property("value", "");
						d3.selectAll("button.confirm").classed("disabled", 1);
					});
					d3.select("button.confirm.cancel").classed("disabled", 0).on("click", function() {
						d3.selectAll("input").property("value", "");
						vis.selected = [];
						d3.selectAll("button.confirm").classed("disabled", 1).on("click", null);
					})
				}
			}
		}
	}

	vis.init=function(params) {
		if (!params) {params = {}}
		
			svg = d3.select("#chart").selectAll("svg")
			.data([{width: width, height: height}]).enter()
			.append("svg").attr({width: width, height: height})
			.attr("version", 1.1)
        	.attr("xmlns", "http://www.w3.org/2000/svg");
		vis.debug = true;
		vis.id = 0;
		w = 500;
		defs = svg.append("defs");
		defs.append("clipPath")
			.attr({id: "mask"})
			.append("rect").attr({width: w + 40, height: w + 40, x: -w / 2 - 20, y: -w / 2 - 20});

		svg = svg.append("g").attr("transform", "translate(270,270)").style("clip-path", "url(#mask)");

		vis.instructions = d3.select(".export").html();

		vis.mode = "addLine";
		vis.selected = [];
		vis.currentStep = 0;
		vis.geo = {lines:[], circles:[], points:[], pointsHash:{}, linesNb:0, circlesNb: 0, pointsNb:0, segments:[], segmentsNb:0, layers:0};

		d3.select("button.square4").on("click", function() {
			vis.currentStep = 0;
			vis.geo = {lines:[], circles:[], points:[], pointsHash:{}, linesNb:0, circlesNb: 0, pointsNb:0, segments:[], segmentsNb:0, layers:0};
			vis.draw();
			vis.addLine([-250,-250],[-250,250],0);
			vis.addLine([-250,250],[250,250],0);
			vis.addLine([250,250],[250,-250],0);
			vis.addLine([250,-250],[-250,-250],0);
			vis.addLine([0,0],[250,250],0);
			vis.addLine([0,0],[250,-250],0);
			vis.addCircle([0,0], 250, 0);
			vis.checkIntersections(0);
			vis.currentStep = 1;
			d3.select(".export").html(vis.instructions);
		})

		d3.select("button.square6").on("click", function() {
			vis.currentStep = 0;
			vis.geo = {lines:[], circles:[], points:[], pointsHash:{}, linesNb:0, circlesNb: 0, pointsNb:0, segments:[], segmentsNb:0, layers:0};
			vis.draw();
			vis.addLine([-250,-250],[-250,250],0);
			vis.addLine([-250,250],[250,250],0);
			vis.addLine([250,250],[250,-250],0);
			vis.addLine([250,-250],[-250,-250],0);
			vis.addLine([0,0],[0,250],0);
			vis.addLine([0,0],[-216.5064,-125],0);
			vis.addLine([0,0],[-216.5064,125],0);
			vis.addLine([0,0],[250,0],0);
			vis.addLine([0,0],[-125,216.5064],0);
			vis.addLine([0,0],[125,216.5064],0);
			vis.addCircle([0,0], 250, 0);
			vis.checkIntersections(0);
			vis.currentStep = 1;
			d3.select(".export").html(vis.instructions);

		})

		d3.select("button.square8").on("click", function() {
			vis.currentStep = 0;
			vis.geo = {lines:[], circles:[], points:[], pointsHash:{}, linesNb:0, circlesNb: 0, pointsNb:0, segments:[], segmentsNb:0, layers:0};
			vis.draw();
			vis.addLine([-250,-250],[-250,250],0);
			vis.addLine([-250,250],[250,250],0);
			vis.addLine([250,250],[250,-250],0);
			vis.addLine([250,-250],[-250,-250],0);
			vis.addLine([0,0],[250,250],0);
			vis.addLine([0,0],[125,250],0);
			vis.addLine([0,0],[-125,250],0);
			vis.addLine([0,0],[250,-125],0);
			vis.addLine([0,0],[250,125],0);
			vis.addLine([0,0],[250,-250],0);
			vis.addCircle([0,0], 250, 0);
			vis.checkIntersections(0);
			vis.currentStep = 1;
			d3.select(".export").html(vis.instructions);
		})

		d3.select("button.hex3").on("click", function() {
			vis.currentStep = 0;
			vis.geo = {lines:[], circles:[], points:[], pointsHash:{}, linesNb:0, circlesNb: 0, pointsNb:0, segments:[], segmentsNb:0, layers:0};
			vis.draw();
			vis.addCircle([0,0],250,0);
			vis.addLine([0,0],[0,250],0);
			vis.addLine([0,0],[-216.5064,-125],0);
			vis.addLine([0,0],[-216.5064,125],0);


			vis.addLine([0,-250],[-216.5064,-125],0);
			vis.addLine([-216.5064,125],[-216.5064,-125],0);
			vis.addLine([-216.5064,125],[0,250],0);
			vis.addLine([216.5064,125],[0,250],0);
			vis.addLine([216.5064,-125],[216.5064,125],0);
			vis.addLine([216.5064,-125],[0,-250],0);

			vis.checkIntersections(0);


			vis.currentStep = 1;
			d3.select(".export").html(vis.instructions);
			

		})

		d3.select("button.hex6").on("click", function() {
		vis.currentStep = 0;
			vis.geo = {lines:[], circles:[], points:[], pointsHash:{}, linesNb:0, circlesNb: 0, pointsNb:0, segments:[], segmentsNb:0, layers:0};
			vis.draw();
			vis.addCircle([0,0],250,0);
			vis.addLine([0,0],[0,250],0);
			vis.addLine([0,0],[-216.5064,-125],0);
			vis.addLine([0,0],[-216.5064,125],0);
		
			vis.addLine([0,0],[250,0],0);
			vis.addLine([0,0],[-125,216.5064],0);
			vis.addLine([0,0],[125,216.5064],0);


			vis.addLine([0,-250],[-216.5064,-125],0);
			vis.addLine([-216.5064,125],[-216.5064,-125],0);
			vis.addLine([-216.5064,125],[0,250],0);
			vis.addLine([216.5064,125],[0,250],0);
			vis.addLine([216.5064,-125],[216.5064,125],0);
			vis.addLine([216.5064,-125],[0,-250],0);

			vis.checkIntersections(0);


			vis.currentStep = 1;
			d3.select(".export").html(vis.instructions);
			
		})

		d3.select("button.addline").on("click", function() {
			vis.mode = "addLine";
			vis.selected = [];
			d3.select(this).classed("active", 1);
			d3.selectAll("button.addcircle, button.drawshape").classed("active", 0);
		})

		d3.select("button.addcircle").on("click", function() {
			vis.mode = "addCircle";
			vis.selected = [];
			d3.select(this).classed("active", 1);
			d3.selectAll("button.addline, button.drawshape").classed("active", 0);
		})

		d3.select("button.drawshape").on("click", function() {
			vis.mode = "drawshape";
			vis.selected = [];
			d3.select(this).classed("active", 1);
			d3.selectAll("button.addline, button.addcircle").classed("active", 0);
		})

		d3.select("button.newstep").on("click", function() {
			vis.checkIntersections(vis.currentStep);
			vis.currentStep = vis.currentStep + 1;
			d3.select("button.newstep").classed("disabled", 1);
		})
		d3.selectAll("input").on("change", input)
		d3.select("button.save").on("click", vis.save);
		d3.select("button.clear").on("click", function() {d3.select(".export").html("")});

		vis.loaddata(params);
	}
	vis.validate = function() {
		if (vis.selected.length > 1) { 
			var id1 = vis.selected[vis.selected.length - 1];
			var id0 = vis.selected[vis.selected.length - 2];
			vis.geo.points[id0].used = true;
			vis.geo.points[id1].used = true;
			vis.selected = [id1];
		};
	}

	vis.loaddata = function(params) {
		vis.draw();
	}

	
	vis.draw = function() {
		svg.selectAll("*").remove();
		templayer = svg.append("g").classed("temp", 1).style("stroke-dasharray", "2 2");
		construction = svg.append("g").classed("construction", 1);
		toplayer = svg.append("g").classed("final", 1);
		pointLayer = svg.append("g").classed("pointLayer", 1);
	}
	var addLineByNumber = vis.addLineByNumber = function(id0, id1, step) {
		// convenience function to add lines using points id rather than coordinates
		var step = step || 0;
		var P0 = vis.geo.points[id0];
		var P1 = vis.geo.points[id1];
		var p0 = [P0.x, P0.y];
		var p1 = [P1.x, P1.y];
		addLine(p0, p1, step);
	}

	var addCircleByNumber = vis.addCircleByNumber = function(id0, r, step) {
		// convenience function to add circles using points id rather than coordinates
		var P0 = vis.geo.points[id0];
		addCircle([P0.x, P0.y], r, step);
	}

	var addCircleByNumbers = vis.addCircleByNumbers = function(id0, id1, step) {
		// convenience function to add circles using points id rather than coordinates
		var P0 = vis.geo.points[id0];
		var P1 = vis.geo.points[id1];
		var r = vis.dist([P0.x, P0.y], [P1.x, P1.y]);
		addCircle([P0.x, P0.y], r, step);
	}

	var drawPathByNumber = vis.drawPathByNumber = function(points, mode) {
		// this draws the final paths. 
		console.log(points, mode)
		var g;
		var pxy = points.map(function(d) {
			p = vis.geo.points[d];
			return [p.x, p.y];});
		var path = pathPolygon(pxy, 1);
		if (mode == -1) {
			g = templayer;
			g.selectAll("*").remove();
		} else {
			points.forEach(function(d) {
				vis.geo.points[d].used = true;
			})
			g = toplayer;
			vis.geo.segments.push({id: vis.geo.segmentsNb, pointsId: points, path: path});
			vis.geo.segmentsNb = vis.geo.segmentsNb + 1;
		}
		g.append("path").attr("d", path).classed("final", 1);
	}

	var addLine = vis.addLine = function(p0, p1, step) {
		var g;
		if(p0[0] == p1[0] && p0[1] == p1[1]) {return -1;}
		var step = step || 0;
		var line;
		var points = [];
		var a = vis.cross(p0, p1, [-w/2, -w/2], [-w/2, w/2]);
		var b = vis.cross(p0, p1, [-w/2, w/2], [w/2, w/2]);
		var c = vis.cross(p0, p1, [w/2, w/2], [w/2, -w/2]);
		var d = vis.cross(p0, p1, [-w/2, -w/2], [w/2, -w/2]);

		if (a != -1 && Math.abs(a[1]) <= w/2) {points.push(a);}
		if (b != -1 && Math.abs(b[0]) <= w/2 && !(a[0]==b[0]&&a[1]==b[1])) {points.push(b);}
		if (c != -1 && Math.abs(c[1]) <= w/2) {points.push(c);}
		if (d != -1 && Math.abs(d[0]) <= w/2) {points.push(d);}
		console.log(a,b,c,d,points);
		line = {id: vis.geo.linesNb, p0: points[0], p1: points[1], order: step};
		if (step > -1) {
			vis.geo.lines.push(line);
			vis.geo.linesNb = vis.geo.linesNb + 1;
			construction.selectAll("g.o" + step).data([{}]).enter().append("g").classed("o" + step + " current", 1);
			g = construction.select("g.o" + step);
			if (vis.geo.layers < step) {vis.geo.layers = step;}	
		} else {
			g = templayer;
			g.selectAll("*").remove();
		}
		g.append("line")
			.attr({
				x1: points[0][0], 
				x2: points[1][0], 
				y1: points[0][1], 
				y2: points[1][1]
			})
			.classed("construction", 1);	

		
	}

	var addCircle = vis.addCircle = function(p0, r, step) {
		var g;
		if (step > -1) {
			vis.geo.circles.push({id: vis.geo.circlesNb, p0: p0, r: r, order: step});
			vis.geo.circlesNb = vis.geo.circlesNb + 1;
			construction.selectAll("g.o" + step).data([{}]).enter().append("g").classed("o" + step + " current", 1);
			g = construction.select("g.o" + step);
			if (vis.geo.layers < step) {vis.geo.layers = step;}
		} else {
			templayer.selectAll("*").remove();
			g = templayer;
		}
		g.append("circle")
			.attr({cx: p0[0], cy: p0[1], r:r})
			.classed("construction", 1);

	}
	var clickDot = vis.clickDot = function(P) {
		vis.selected.push(P.id);
		debug(vis.selected);
		if (vis.selected.length > 1) {
			var P0 = vis.geo.points[vis.selected[vis.selected.length - 2]];
			debug(P0);
			debug(P);
			d3.select("input.p0x").property("value", P0.x);
			d3.select("input.p0y").property("value", P0.y);
			d3.select("input.p1x").property("value", P.x);
			d3.select("input.p1y").property("value", P.y);
			d3.select("input.r").property("value", vis.dist([P0.x, P0.y], [P.x, P.y]));
			d3.selectAll("button.confirm").classed("disabled", 0);
			if (vis.mode == "addLine") {
				vis.addLine([P0.x, P0.y], [P.x, P.y], -1); // -1 means on temp layer
			}
			if (vis.mode == "addCircle") {
				vis.addCircle([P0.x, P0.y], vis.dist([P0.x, P0.y], [P.x, P.y], -1)); 
			}  
			if (vis.mode == "drawshape") {
				vis.drawPathByNumber(vis.selected, -1)
			}
			input(); // reinitializes the ok and cancel button

		} else {
			d3.select("input.p0x").property("value", P.x);
			d3.select("input.p0y").property("value", P.y);
		}
		console.log(P.id);
	}

	vis.checkIntersections = function(step) {
		var linesStep, lineOld, circlesStep, circlesOld, pointsStep, g;
		linesStep = vis.geo.lines.filter(function(d) {return d.order == step;})
		linesOld = vis.geo.lines.filter(function(d) {return d.order <= step;})
		circlesStep = vis.geo.circles.filter(function(d) {return d.order == step;})
		circlesOld = vis.geo.circles.filter(function(d) {return d.order <= step;})

		linesStep.forEach(function(l) {
			linesOld.forEach(function(o) {
				// checking intersections between new lines and old lines
				// 0 or 1 intersections
				var P = vis.cross(l.p0, l.p1, o.p0, o.p1);
				var p;
				if (P != -1) {
					var x = d3.round(P[0], 4);
					var y = d3.round(P[1], 4);

					if (x in vis.geo.pointsHash) {
						if (y in vis.geo.pointsHash[x]) {
								p = vis.geo.pointsHash[x][y];
							} else {
								vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
								vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
								vis.geo.pointsNb = vis.geo.pointsNb + 1;
							}
						} else {
							vis.geo.pointsHash[x] = {};
							vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
							vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
							vis.geo.pointsNb = vis.geo.pointsNb + 1;
						}

					if (vis.geo.points[p].lines.indexOf(l.id) == -1) {
						vis.geo.points[p].lines.push(l.id);
					}
					if (vis.geo.points[p].lines.indexOf(o.id) == -1) {
						vis.geo.points[p].lines.push(o.id);
					}
				}
			})

			circlesOld.forEach(function(o) {
				// checking intersections between new lines and old circles
				// 0, 1 or 2 intersections
				vis.crossLineCircle(l.p0, l.p1, o.p0, o.r).forEach(function(P) {
					var p;
					var x = d3.round(P[0], 4);
					var y = d3.round(P[1], 4);

					if (x in vis.geo.pointsHash) {
						if (y in vis.geo.pointsHash[x]) {
								p = vis.geo.pointsHash[x][y];
							} else {
								vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
								vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
								vis.geo.pointsNb = vis.geo.pointsNb + 1;
							}
						} else {
							vis.geo.pointsHash[x] = {};
							vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
							vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
							vis.geo.pointsNb = vis.geo.pointsNb + 1;
						}

					if (vis.geo.points[p].lines.indexOf(l.id) == -1) {
						vis.geo.points[p].lines.push(l.id);
					}
					if (vis.geo.points[p].circles.indexOf(o.id) == -1) {
						vis.geo.points[p].circles.push(o.id);
					}
				});
			})
		})

		circlesStep.forEach(function(c) {
			linesOld.forEach(function(o) {
				// checking intersections between new circles and old lines
				// 0, 1 or 2 intersections
				vis.crossLineCircle(o.p0, o.p1, c.p0, c.r).forEach(function(P) {
					var p;
					var x = d3.round(P[0], 4);
					var y = d3.round(P[1], 4);

					if (x in vis.geo.pointsHash) {
						if (y in vis.geo.pointsHash[x]) {
								p = vis.geo.pointsHash[x][y];
							} else {
								vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
								vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
								vis.geo.pointsNb = vis.geo.pointsNb + 1;
							}
						} else {
							vis.geo.pointsHash[x] = {};
							vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
							vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
							vis.geo.pointsNb = vis.geo.pointsNb + 1;
						}

					if (vis.geo.points[p].lines.indexOf(o.id) == -1) {
						vis.geo.points[p].lines.push(o.id);
					}
					if (vis.geo.points[p].circles.indexOf(c.id) == -1) {
						vis.geo.points[p].circles.push(c.id);
					}
				});
			})

			circlesOld.forEach(function(o) {
				// checking intersections between new circles and old ones
				// 0, 1 or 2 intersections
				vis.crossCircles(c.p0, c.r, o.p0, o.r).forEach(function(P) {
					var p;
					var x = d3.round(P[0], 4);
					var y = d3.round(P[1], 4);

					if (x in vis.geo.pointsHash) {
						if (y in vis.geo.pointsHash[x]) {
								p = vis.geo.pointsHash[x][y];
							} else {
								vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
								vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
								vis.geo.pointsNb = vis.geo.pointsNb + 1;
							}
						} else {
							vis.geo.pointsHash[x] = {};
							vis.geo.pointsHash[x][y] = p = vis.geo.pointsNb;
							vis.geo.points.push({id:p, x:x, y:y, lines:[], circles:[], order: step})
							vis.geo.pointsNb = vis.geo.pointsNb + 1;
						}

					if (vis.geo.points[p].circles.indexOf(c.id) == -1) {
						vis.geo.points[p].circles.push(c.id);
					}
					if (vis.geo.points[p].circles.indexOf(o.id) == -1) {
						vis.geo.points[p].circles.push(o.id);
					}
				})
			})
		})
		construction.selectAll("g").classed("current", 0).on("mouseover", function() {
			d3.select(this).selectAll("*").
			style("stroke", "#88c");
		});
		if (vis.r) {vis.r = 3;}
		if (vis.geo.pointsNb > 100) {vis.r = 1.5;}
		construction.selectAll("g").on("mouseout", function() {d3.select(this).selectAll("*").style("stroke", null)})
		pointLayer.selectAll("g.o" + step).data([{}]).enter().append("g").classed("o" + step, 1);
		g = pointLayer.select("g.o" + step);
		pointsStep = vis.geo.points.filter(function(d) {return d.order <= step;});
		pointLayer.selectAll(".dots").classed("last", 0).attr("r", vis.r || 3);
		pointsStep.forEach(function(P) {
			g.append("circle").classed("dots last", 1).datum(P).attr({cx: P.x, cy: P.y, r: vis.r || 3})
		});
		d3.selectAll(".dots").on("click", function(d) {clickDot(d);})
	}
	

	var save = vis.save = function() {
		var id = +d3.select("#patternid").property("value") || 0;
		d3.select("#patternid").property("value", id + 1);
		var html = "";
		d3.range(vis.geo.layers + 1).forEach(function(l) {
			vis.geo.lines.filter(function(d) {return d.order == l}).forEach(function(d) {
				html = html + (id + ";" + l + ";" + "line" + ";" + d.id + ";" + d.p0[0] + ";" + d.p0[1] + ";" + d.p1[0] + ";" + d.p1[1] + ";;</br>"); 
			})
			vis.geo.circles.filter(function(d) {return d.order == l}).forEach(function(d) {
				html = html + (id + ";" + l + ";" + "circle" + ";" + d.id + ";" + d.p0[0] + ";" + d.p0[1] + ";;" + d.r + ";;</br>")
			})
			vis.geo.points.filter(function(d) {return d.order == l && d.used}).forEach(function(d) {
				html = html + (id + ";" + l + ";" + "point" + ";" + d.id + ";" + d.x + ";" + d.y + ";;;;</br>")
			})
		})
		vis.geo.segments.forEach(function(d) {
			html = html + (id + ";top;segment;" + d.id + ";;;;;;" + d.path + "</br>")
		})
		d3.select(".export").html(html);
	}


	function debug(d) {
		if (vis.debug) {console.log(d);}
	}
	
})();