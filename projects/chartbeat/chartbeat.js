(function() {
	vis={};
	var width,height;
	var chart,svg;
	var defs, style;
	var slider, step, maxStep, running;
	var button;
	var voronoi;

	
	vis.init=function(params) {
		if (!params) {params = {}}
		chart = d3.select(params.chart||"#chart"); // placeholder div for svg
		width = params.width || 960;
		height = params.height || 1000;
		svg = chart.selectAll("svg")
			.data([{width:width,height:height}]).enter()
			.append("svg").attr({width:width,height:height})
	
    	vis.debug = false;
    
		queue()
			.defer(d3.csv, params.data || 'data.csv') // my data
			
    		.await(vis.loaddata);
	}
		
	vis.loaddata = function(error, data) {
		console.log("data loaded.");

		vis.data = data;
		var start = 1413259200;
		data.forEach(function(d, i) {
			d3.keys(d).forEach(function(k) {
				if (d[k] == "") {d[k] = null;} else {
					d[k] = +d[k];
				}
			})
			var ts = start + i * 300; // 5 minute increments
			var m = moment.unix(ts);
			d.m = m;
			d.dow = m.day();


			d.date = m.format('M/D');
			d.time = m.format('HH:mm');
		})

		var lastDay = vis.data[vis.data.length - 1].date;

		vis.lastDay = vis.data.filter(function(d) {return d.date == lastDay;})

		vis.avg = d3.nest()
			.key(function(d) {return d.time;})
			.sortKeys(d3.ascending)
			.rollup(function(d) {
				return d3.mean(d, function(v) {return v.people;})
			})
			.entries(vis.data)



		vis.avgbyday = d3.nest()
			.key(function(d) {return d.dow;})
			.sortKeys(d3.ascending)
			.key(function(d) {return d.time;})
			.sortKeys(d3.ascending)
			.rollup(function(d) {
				return d3.mean(d, function(v) {return v.people;})
			})
			.entries(vis.data)

		vis.avgbyday.forEach(function (d) {d.avg = d3.sum(d.values, function(v) {return v.values}) / 288})
		vis.draw();
	}

	vis.draw = function() {
	
		var xScale = d3.scale.linear().domain([0, 287]).range([0, 490]);
		var yScale = d3.scale.linear().domain([0, 30000]).range([250, 0]);
		var yBarScale = d3.scale.linear().domain([0, 20000]).range([0, 100]);

		var daysofweek = create(svg, "g", [{}], "daysofweek")
		daysofweek.attr("transform", translate(200, 400));
		
		var dowGL = create(daysofweek, "g", [5000, 10000, 15000, 20000], "gl")
			.attr("transform", function(d) {return translatey(yBarScale(d))})

		dowGL.append("line").attr({x2: 495}).style("stroke", "#d2d2d3");
		dowGL.append("text").attr({x: 500}).text(String).style({fill: "#d2d2d3", "font-size": "10px"})

		var daysofweek_bars = create(daysofweek, "g", vis.avgbyday, "bar")
		daysofweek_bars.attr("transform", function(d, i) {return "translate(" + (70 * i) + ")"})
		daysofweek_bars.attr("class", function(d, i) {return "bar b" + i});
		daysofweek_bars.append("rect").attr({x: 10, y: 100, width: 50, height: 0})
		.style("fill", function(d, i){
			return "#354d60"
			//return ["#568493","#C24D3B","#C958C9","#619D48","#AE537A","#A47B33","#7672C0"][i]
		})
		daysofweek_bars.append("text").attr({x: 35, "text-anchor": "middle", y: 120})
		daysofweek.selectAll("rect").data(vis.avgbyday).transition()
			.attr({
				height: function(d) {return yBarScale(d.avg);}, 
				 	 y: function(d) {return 100 - yBarScale(d.avg);} 
			})
		daysofweek.selectAll(".bar text").data(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
			.text(String)
			.style("font-size", "10px");


		daysofweek.append("text").text("Visitors by day of week").style({"font-size": "24px", "font-weight": "bold"})
		//	.attr({y: })
		

		daysofweekXaxis = create(daysofweek, "path",0, "xaxis")
			.attr("d", "M0,100H490")
			.style({fill: "none", "stroke": "#888"});




		daysofweekYText = create(daysofweek, "text", ["Avg number of visitors"], "yaxistext")
			.attr({x: 0, y: -10, transform: "rotate(-90)", "text-anchor": "end"})
			.style({fill: "#888", "font-size": "10px"})
			.text(String);
		


		var curveBlock = create(svg, "g", [{}], "curve").attr("transform", translate(200, 600))

		curveBlockXaxis = create(curveBlock, "path",0, "xaxis")
			.attr("d", "M0,250H495")
			.style({fill: "none", "stroke": "#888"});


		curveBlockTicks = create(curveBlock, "g", d3.range(13), "tick")
			.attr("transform", function(d) {return "translate(" + xScale(d * 24) + ",250)";})

		curveBlockTicks.append("line").attr("y2", 3).style("stroke", "#d2d2d3");
		curveBlockTicks.append("text").attr({y:15, "text-anchor": "middle"}).style({fill: "#d2d2d3", "font-size": "10px"})
			.text(function(d) {return (2 * d) + ":00";})

		curveBlockYText = create(curveBlock, "text", ["Avg number of visitors"], "yaxistext")
			.attr({x: -150, y: -10, transform: "rotate(-90)", "text-anchor": "end"})
			.style({fill: "#888", "font-size": "10px"})
			.text(String);

		var curveGL = create(curveBlock, "g", [10000, 20000, 30000], "gl")
			.attr("transform", function(d) {return translatey(yScale(d))})

		curveGL.append("line").attr({x2: 495}).style("stroke", "#d2d2d3");
		curveGL.append("text").attr({x: 500}).text(String).style({fill: "#d2d2d3", "font-size": "10px"})


		var avgCurve = curveBlock.selectAll("path.avg").data([vis.avg]).enter().append("path").classed("avg", 1);
		var path = "";
		avgCurve.attr("d", function(d) {
			d.forEach(function(v, i) {
				path = path + (i ? "L" : "M");
				path = path + xScale(i) + ","
				path = path + yScale(v.values);
			})
			return path;
		})
		.style({stroke: "#222", "stroke-width": 2, fill: "none"})

		var dayCurves = curveBlock.selectAll("path.avgbyday").data(vis.avgbyday).enter().append("path").classed("avgbyday", 1);
		dayCurves.attr("d", path)
		.attr("class", function(d, i) {return "avgbyday c" + i;})
			.style({stroke: function(d, i) {
							return "#354d60"
//				return ["#568493","#C24D3B","#C958C9","#619D48","#AE537A","#A47B33","#7672C0"][i]
			}, fill: "none", opacity: 0})
			.transition()
			.duration(1000)
			.attr("d", function(d) {var path = "";
			d.values.forEach(function(v, i) {
				path = path + (i ? "L" : "M");
				path = path + xScale(i) + ","
				path = path + yScale(v.values);
			})
			d.path = path;
			return path;
		})	


		curveBlock.append("text").text("Visitors by time of day").style({"font-size": "24px", "font-weight": "bold"})
			.attr({y: -10})
		

		// read write visitors

		var rwvBlock = create(svg, "g", [{}], "rwv").attr("transform", translate(200, 50))

		rwvBlockXaxis = create(rwvBlock, "path",0, "xaxis")
			.attr("d", "M0,250H495")
			.style({fill: "none", "stroke": "#888"});

		rwvBlockTicks = create(rwvBlock, "g", d3.range(13), "tick")
			.attr("transform", function(d) {return "translate(" + xScale(d * 24) + ",250)";})

		rwvBlockTicks.append("line").attr("y2", 3).style("stroke", "#d2d2d3");
		rwvBlockTicks.append("text").attr({y:15, "text-anchor": "middle"}).style({fill: "#d2d2d3", "font-size": "10px"})
			.text(function(d) {return (2 * d) + ":00";})

		rwvBlockYText = create(rwvBlock, "text", ["Avg number of visitors"], "yaxistext")
			.attr({x: -150, y: -10, transform: "rotate(-90)", "text-anchor": "end"})
			.style({fill: "#888", "font-size": "10px"})
			.text(String);

		var curveGL = create(rwvBlock, "g", [10000, 20000, 30000], "gl")
			.attr("transform", function(d) {return translatey(yScale(d))})

		curveGL.append("line").attr({x2: 495}).style("stroke", "#d2d2d3");
		curveGL.append("text").attr({x: 500}).text(String).style({fill: "#d2d2d3", "font-size": "10px"})


		var rwvCurves = create(rwvBlock, "path", ["people", "read"], "curve")
		.attr("d", function(k) {
			d = vis.lastDay.map(function(v) {return (isNaN(v[k]) ? 0 : v[k]);}).filter(function(v) {return v !== null;})
			var path = "M" + xScale(d.length - 1) + ",250H0";

			console.log(d);
			d.forEach(function(v, i) {
				path = path + "L";
				path = path + d3.round(xScale(i),1) + ","
				path = path + d3.round(yScale(v),1);
			})
			path = path + "Z"
			return path;
		})
		.style({stroke: "none", fill: function(d, i) {return ["aliceblue", "yellow", "pink"][i];}})


		rwvBlock.append("text").text("Visitors today").style({"font-size": "24px", "font-weight": "bold"})
			.attr({y: -10})

		rwvBlock.append("rect").attr({x:250,y:-30,height:20,width:20,rx:2,ry:2}).style({fill: "aliceblue"})
		rwvBlock.append("text").attr({x:280,y:-15}).text("Visitors").style({ "font-size": "12px"})
		
		rwvBlock.append("rect").attr({x:350,y:-30,height:20,width:20,rx:2,ry:2}).style({fill: "yellow"})
		rwvBlock.append("text").attr({x:380,y:-15}).text("of which readers").style({ "font-size": "12px"})


	 // interaction

	 svg.selectAll("g.bar").on("mouseover", function(d, i) {
	 	svg.selectAll("g.bar rect").transition().style("opacity", .5);
	 	d3.select(this).select("rect").transition().style("opacity", null);

	 	svg.select("path.c" + i).transition()
	 		.style("opacity", 1)
	 		.attr("d", function(d) {return vis.avgbyday[i].path});
	 })

	  svg.selectAll("g.bar").on("mouseout", function(d, i) {
	 	svg.selectAll("g.bar rect").transition().style("opacity", null);

	 	svg.selectAll("path.avgbyday").transition()
	 		.style("opacity", 0)
	 		.attr("d", path);
	 })

	}

	
	function debug(d) {
		if (vis.debug) {console.log(d);}
	}

	function create(parent, item, data, c) {
		var selection = [item, c].join(".");
		if (!data) {data = [{}];}
		parent.selectAll(selection).data(data).exit().remove();
		if (c) {
			return parent.selectAll(selection).data(data).enter().append(item).classed(c, 1);
		} else {
			return parent.selectAll(selection).data(data).enter().append(item);
		}
	}

	function translatey(y) {return "translate(0," + y + ")";}
	function translate(x,y) {return "translate(" + x + "," + y + ")";}
	
})();