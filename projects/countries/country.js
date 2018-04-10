(function() {

	// local variables and helper functions

	var width=960,height=670,padding=0;
	
	

	net={}
	net.button=0;
	net.nodes=[];
	net.edges=[];
	net.width=width;
	net.height=height;
	net.projection=d3.geo.mercator();
	net.colors={
		"Western Europe":"#7E9F5A",

		"United States":"#4E7395",
		"Mexico":"#4E7395",
		"Canada":"#4E7395",
		
		"Middle East":"#E8B859",
		
		"Latin America":"#E8B859",
		
		"Asia Pacific":"#DA854B",
		
		"Central & Eastern Europe":"#BF81A2",
		
		"Africa":"#54451F"
	}



	net.loaddata=function() {
				rScale=d3.scale.sqrt().domain([500000,313891588]).range([1,75]);

		d3.csv(net.nodefile,function(error,csv) {
			net.nodes=csv;
			net.nodes.forEach(function(d,i) {
				var xy=net.projection([d.lat,d.lon]);
				d.x=d.x0=xy[0];d.y=d.y0=xy[1];
				d.r=rScale(d.size);
				if(d.r<net.minrad) {d.r=net.minrad;}
				if(d.r>net.maxrad) {d.r=net.maxrad;}
			})
			d3.csv(net.edgefile,function(error,csv) {
				net.edges=[];
				csv.sort(function(a,b) {return b.strength-a.strength});
				var countryEdges={};

				csv.forEach(function(d,i) {
					if (d3.keys(countryEdges).indexOf(d.source)==-1) {
							countryEdges[d.source]=1;
							net.edges.push(d);
						}
						else {
							if(countryEdges[d.source]<50) {
								net.edges.push(d);
								countryEdges[d.source]=countryEdges[d.source]+1;
							}

						} 
				});
				var maxStrength=d3.max(net.edges,function(d) {return +d.strength;})
				net.edges.forEach(function(d) {d.source=+d.source;d.target=+d.target;d.strength=+d.strength;d.sStrength=d.strength/maxStrength;})
				net.draw();
			})	
		})
		
		
	}

	net.draw = function() {

		net.force.stop();
		net.nodes.forEach(function(d,i) {



			
		})

		net.nodes.sort(function(a,b) {return b.r-a.r;});
		
		var psb=net.svg.select("#back")
		psb.selectAll("*").remove();
		

		net.force
			.nodes(net.nodes)
			.links(net.edges)

		

		var edges=net.svg.selectAll(".edge")
			.data(net.edges.filter(function(d) {return d.sStrength>.007}))
			.enter()
			.append("line")
			.style({stroke:"#000","stroke-width":function(d) {return d.sStrength*20},"opacity":function(d) {return Math.pow(d.sStrength,.4);}})
			.attr({x1:function(d) {return net.nodes[d.source].x;},
				x2:function(d) {return net.nodes[d.target].x;},
				y1:function(d) {return net.nodes[d.source].y;},
				y2:function(d) {return net.nodes[d.target].y;},
				class:function(d) {return "edge "+net.nodes[d.source].name+" "+net.nodes[d.target].name}
			})


		var circles=net.svg.selectAll(".circles").data(net.nodes)
			.enter()
			.append("g")
			.attr({
			 transform:function(d) {return "translate("+d.x+","+d.y+")";},
					id:function(d) {return "c"+d.name},
				 class:function(d) {return "circles"}
			})
			.style({
				  fill:function(d) {return net.colors[d.region]}
				})
		circles.append("circle")
			.attr({r:function(d) {return d.r}})
			.style({stroke:function(d) {return d3.rgb(net.colors[d.region]).darker()},"stroke-width":function(d) {return (d.r>10)?2:1;}})

		circles.append("text")
			.text(function(d) {
				if(d.r>45) {return d["full name"];}
				if(d.r>10) {return d.name}
			})
			.style({"font-size":function(d) {
				if(d.r>45) {return "16px";}
				if(d.r>40) {return "36px";}
 				if(d.r>20) {return "24px";} 
				if(d<15) {return "10px"} 
				return "13px";},"fill":"black"})
			.attr({"text-anchor":"middle",y:function(d) {
				if(d.r>45) {return 7;}
				if(d.r>40) {return 14;}
 				if(d.r>20) {return 10;} 
				if(d<15) {return 4} 
				return 5;}})
		circles=net.svg.selectAll(".circles");
		circles.on("mouseover",function(d) {
			d3.select(this).select("text").text(d["full name"]).style({"font-size":"16px"}).attr({y:7})
			d3.selectAll(".edge").transition().style("opacity",0);
			d3.selectAll("."+d.name).transition().style({stroke:"darkorange",opacity:function(d) {return Math.pow(d.sStrength,.4)}})
		})
		circles.on("mouseout",function(d) {
			d3.selectAll(".edge").transition().style({stroke:"#000",opacity:function(d) {return Math.pow(d.sStrength,.4)}})
			d3.select(this).select("text")
			.text(function(d) {
				if(d.r>45&&(net.button==0)) {return d["full name"];}
				if(d.r>=10) {return d.name}
			})
			.style({"font-size":function(d) {
				if(d.r>45&&(net.button==0)) {return "16px";}
				if(d.r>40&&(net.button==0)) {return "36px";}
 				if(d.r>20&&(net.button==0)) {return "24px";} 
				if(d.r<15||(net.button==1)) {return "10px"} 
				return "13px";},"fill":"black"})
			.attr({"text-anchor":"middle",y:function(d) {
				if(d.r>45&&(net.button==0)) {return 7;}
				if(d.r>40&&(net.button==0)) {return 14;}
 				if(d.r>20&&(net.button==0)) {return 10;} 
				if(d.r<15||(net.button==0)) {return 4} 
				return 5;}})
		})
		
		
		
		
		// if the mode is not 3, we are using a force layout to complement the initial packing algorithm
	
		net.tick=0;
	
		function tick(e) {
			circles
				.each(gravity(e.alpha*net.gravity))
				.each(collide(net.collide));
			
			edges.attr({x1:function(d) {return d.source.x;},
						x2:function(d) {return d.target.x;},
						y1:function(d) {return d.source.y;},
						y2:function(d) {return d.target.y;}
			})
			circles.attr({transform:function(d) {return "translate("+d.x+","+d.y+")";}
			})
		}

		function gravity(k) {
			return function(d) {
				if (typeof(d.tx)!=="undefined") {
					d.x=d.x+((net.width/2)-d.x)*k;
					d.y=d.y+((net.height/2)-d.y)*k;
				}
			};
		}

		function collide(k) {
			var q=d3.geom.quadtree(net.nodes);
			return function(node) {
				var nr= node.r+padding,
					nx1=node.x -nr,
					nx2=node.x +nr,
					ny1=node.y -nr,
					ny2=node.y +nr;
				q.visit(function(quad,x1,y1,x2,y2) {
					if (quad.point && (quad.point !== node )) {
						var x=node.x-quad.point.x,
							y=node.y-quad.point.y,
							l=x*x+y*y,
							r=nr+quad.point.r;

						if (l<r*r) {
							l = ((l = Math.sqrt(l)) - r) / l * k;
				            node.x -= x *= l;
				            node.y -= y *= l;
				            
				            quad.point.x += x;
				            quad.point.y += y;
				           
						}
					}
					return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
				});
			};
		}
		

		
		net.force
			.linkStrength(function(d) {return d.sStrength;})
			.friction(net.friction)
			.charge(function(d) {return net.charge*Math.pow(d.r,2);})
			.on("tick",tick)
			.start();
		
		d3.select("#button").on("click",function() {
			net.button=1-net.button;
			if(net.button) {
				d3.select("#button").html("Friendship positions");
				net.force.stop();
				d3.selectAll(".circles").transition().duration(1000).
				attr("transform",function(d) {d.x=d.x0;d.y=d.y0;return "translate("+d.x+","+d.y+")";});
				d3.selectAll(".circles").select("circle").transition().duration(1000).attr("r",function(d) {return (d.r>10)?10:d.r});
				d3.selectAll(".circles").select("text").transition().duration(1000).text(function(d) {return (d.r>10)?d.name:""})
				.style("font-size","10px").attr("y",4);


				d3.selectAll(".edge").transition().duration(1000).attr({x1:function(d) {return d.source.x0;},
						x2:function(d) {return d.target.x0;},
						y1:function(d) {return d.source.y0;},
						y2:function(d) {return d.target.y0;}
				})
			} else {
				d3.select("#button").html("Geographic positions");
				d3.selectAll(".circles").select("circle").transition().attr("r",function(d) {return d.r});
				d3.selectAll(".circles").select("text").transition()
					.text(function(d) {
						if(d.r>45) {return d["full name"];}
						if(d.r>10) {return d.name}
					})
					.style({"font-size":function(d) {
						if(d.r>45) {return "16px";}
						if(d.r>40) {return "36px";}
		 				if(d.r>20) {return "24px";} 
						if(d<15) {return "10px"} 
						return "13px";},"fill":"black"})
					.attr({"text-anchor":"middle",y:function(d) {
						if(d.r>45) {return 7;}
						if(d.r>40) {return 14;}
		 				if(d.r>20) {return 10;} 
						if(d<15) {return 4} 
						return 5;}})
						net.force.start();

					}
		})

	

	}

	net.view = function(options) {
		if (!options) {options={}}
		net.id=options.id||"chart";
		net.nodefile=options.nodefile||"countrynodes.csv";
		net.edgefile=options.edgefile||"countryedges.csv";
		net.minrad=options.minrad||0;
		net.maxrad=options.maxrad||Infinity;
		net.gravity=options.gravity||.05;
		net.friction=options.friction||0.5;
		net.charge=options.charge||-3;
		net.collide=options.collide||0.1;


		net.svg=d3.select("#"+net.id).selectAll("svg").data([0]).enter()
			.append("svg").attr({width:net.width,height:net.height})
		net.svg.selectAll("*").remove();
		net.svg.append("g").attr("id","back");
		
		net.force = d3.layout.force()

			    .charge(-500)
			    .gravity(0.5)
			    .size([net.width, net.height]);
		
		net.loaddata();
		
	}
	


})();