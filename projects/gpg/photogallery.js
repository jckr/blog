(function() {
	app = {};
	var container, grid, detail, svg, bck, header, height, maxHeight, width, mc;
	
	app.init=function(params) {
        // initialization of the app, creating one-off elements

        document.body.addEventListener('touchmove', function (e) { e.preventDefault(); });

		if (!params) {params = {}}
		container = d3.select(params.comtainer || "#container");
    	grid = container.select(".grid");
    	detail = container.select(".detail");
    	width = container.node().offsetWidth;
    	
    	// maxHeight is size of the containing viewport. height is total size of everything that can be shown.
    	maxHeight = container.node().offsetHeight;
    	height = (width == 640) ? 1032 : 1722; 

    	svg = container.select(".svg").attr("id", "svg").selectAll("svg").data([height]).enter().append("svg")
    	// when svg is of size "height", it can be scrolled. 
    		.attr({width: width, height: height});
    	
    	// creating various one-off elements. a background...
    	bck = svg.selectAll("rect.bck").data([{}]).enter().append("rect").classed("bck", 1)
    		.attr({width: width, height: height}).style("fill", "#fff");
    	
    	// the layer with the full-sized images
    	imgg = svg.selectAll("g.img").data([{}]).enter().append("g").classed("img", 1);

    	// the header which will be on top of images if they overlapped
    	header = svg.selectAll("g.header").data([{}]).enter().append("g").classed("header", 1).style("opacity", 0);
    	header.append("rect")
    		.attr({width: width, height: 120}).style("fill", "#333");
    	header.append("text")
    		.attr({"text-anchor": "middle", x: width / 2, y: 80})
    		.text("image title")
    		.style({"font-family": "Helvetica Neue", "font-size": "40", fill: "#ebebeb"})    

    	app.debug = false;

		// loading data    
		queue()
			.defer(d3.csv, params.data || 'data.csv') // description of the images
    		.await(app.loaddata);
	}
		
	app.loaddata = function(error, data) {
		console.log("data loaded.");
		app.data = data;
		svg.selectAll("image.thumbnail").data(app.data).enter()
			.append("image")
			.classed("thumbnail", 1)
			.attr({
				"xlink:href": function(d) {return './icons/' + d.thumbnail + '.png';},
				width: 282,
				height: 206,
				x: function(d, i) {
					if (width == 640) {
						return d.x = (i % 2) ? 324 : 30;
					} else {
						return d.x = width / 2 - 141;
					}
				},
				y: function(d, i) {
					if (width == 640) {
						return d.y = 120 + 16 + 224 * Math.floor(i/2);
					} else {
						return d.y = 120 + 16 + 224 * i;
					}
				}
			})	
		app.run(); // runtime code, listening to events, etc. 
	}

	app.run = function() {
			// main event: what happens when the user clicks / taps on a thumbnail image? 

		svg.selectAll("image.thumbnail").on("click", function(d, i) {
			
			// we are defining 3 numbers and 3 corresponding data points: 
			// i and d are the index of the current image and d the corresponding data point
			// prev and next are numbers before and after i (if i is 0, then prev refers to the last image)
			// p and n are the corresponding data points
			// p, d and n have properties like title, name of image file etc. 

			var prev = i ? i - 1 : app.data.length - 1;
			var next = (i < app.data.length - 1) ? i + 1 : 0;
			var p = app.data[prev];
			var n = app.data[next];
			
			// hammertime is used to listen to Hammer.js events such as panning / swiping. 

			var hammertime;	
			// ready indicates whether the image is ready to be swiped left or right.  
			var ready = true;


			// updating the title. 
			header.select("text").text(d.title);
			
			// grid view fading out. This is the HTML part (header only, really)
			grid.transition().duration(400)
				.style("opacity", 0);

			// all thumbnails fading out as well. 
			svg.selectAll("image.thumbnail").transition()
				.duration(400)
				.style("opacity", 0);
			
			// background of SVG transitioning from white to black. 
			bck.transition()
				.duration(400)//.ease("exp")
				.style("fill", "#000");

			// we are now loading the full image... 
			var imageFull = svg.selectAll("image.full").data([d]).enter().append("image")
				.classed("full", 1)
				// which we initialize on the thumbnail. same x, y and dimensions. 
				// the image will be distorted since its aspect ratio is different from thumbnail, 
				// but that's ok, because it will only stay in that state for an imperceptible period of time. 

				.attr({
					"xlink:href": function(d) {return './full/' + d.full + '.jpg';},
					x: d.x,
					y: d.y,
					width: 282,
					height: 206
				});

			imageFull
				.transition()
				.duration(400)
				// we move this image to the center of the screen and give it full dimensions. 
				.attr({
					// position and size depend on image orientation. There is one vertical image, the others are horizontal
					x: target(d).x,
					y: target(d).y,
					height: target(d).height,
					width: target(d).width
				})
				.each("end", function() {
					// what happens when the image is loaded: 
					grid.style("display", "none");
					// the grid HTML disappears completely (not just transparent). 
					detail.style("display", "block");
					// the detail HTML appears. (even though it is transparent).
					// after a small delay, a card that contains the header and footer will
					// appear as if from under the image. So image first, then details.  
					detail.selectAll(".footer").transition().delay(00).style("opacity", 1);
					header.transition().delay(00).style("opacity", 1).each("end", drawCross);
					// changing height of svg so it can no longer be scrolled. 
					svg.attr("height", maxHeight);
				});
				// we're adding the previous and next image. 
				addPrev();
				addNext();
			
			// and this will initiate the Hammer.js event listeners. 	
			setHammertime();


			function setHammertime(destroy) {
				// if an event listener already exists, we can remove it by passing true to that function like so: 
				if (destroy) {hammertime.destroy;}
				// creating the listener proper...
				hammertime = new Hammer(imageFull.node());
				// and adding the possibility of vertical panning. 
				
				// I'm using panning vs swiping because swiping is a case of panning, 
				// and that panning is easier to reproduce on desktop. 

				hammertime
					.get('pan').set({ direction: Hammer.DIRECTION_ALL });
				hammertime
					.get('pinch').set({ enable: true });
				hammertime.on("pinch", back);
				
				// panning up or down will nudge the image, then make it disappear. 
				hammertime.on("panup", function() {nudge(true);});
				hammertime.on("pandown", function() {nudge();});
				// panning left or right makes the images scroll accordingly. 
				hammertime.on("panleft", moveleft);
				hammertime.on("panright", moveright);

				// possibly: doubletap on image to display it at full size, then pan to explore the full size image, 
				// single tap to return to previous view?
			}
		
			
			function moveleft(event) {
				if(ready) { // testing if the images can move... 
					ready = false; // blocking further events while the animation is not complete
					
					// we remove the left image, move the center and right image one screen left... 
					svg.select("image.prev").remove();
					svg.selectAll("image.full").transition().attr("transform", "translate(-" + width + ")")
					svg.selectAll("image.next").transition().attr("transform", "translate(-" + width + ")")
					// and when the right image is now in the center position, we change its parameters...
						.each("end", function() {
							svg.select("image.full").attr({class: "prev", transform: null, x: target(d).x - width - 10});
							p = d;
							svg.select("image.next").attr({class: "full", transform: null, x: target(n).x});
							d = n; 
							prev = i;
							i = next;
							next = (i < 7) ? i + 1 : 0;
							n = app.data[next];
							console.log(prev, i, next);

							// prev, i, next, p, d, n updated 
							// we add another image to the right, to replace the one that moved to the center
							addNext();

							imageFull = svg.select("image.full");
							// update the title
							header.select("text").text(d.title);

							// create a new hammer listener, removing the first one...
							setHammertime(true);
							ready = true;
							// and unlock these events. 
						})
				}
			};


			function moveright(event) {
				if(ready){
					ready = false;

					svg.select("image.next").remove();
					svg.selectAll("image.prev").transition().attr("transform", "translate(" + width + ")");
					svg.selectAll("image.full").transition().attr("transform", "translate(" + width + ")")
						.each("end", function() {
							svg.select("image.full").attr({class: "next", transform: null, x: target(d).x + width + 10});
							n = d;
							svg.select("image.prev").attr({class: "full", transform: null, x: target(p).x});
							d = p; 
							next = i;
							i = prev;
							prev = prev = i ? i - 1 : 7;
							p = app.data[prev];

							addPrev();
							header.select("text").text(d.title);

							imageFull = svg.select("image.full");
							setHammertime(true);
							ready = true;
						})
				}
			};
			
			function addPrev() {
				// adding an image to the left of the main image
				svg.selectAll("image.prev").data([p]).enter().append("image")
					.classed("prev", 1)
					.attr({
						"xlink:href": './full/' + p.full + '.jpg',
						x: target(p).x - width - 10,
						y: target(p).y,
						width: target(p).width,
						height: target(p).height
				})
			}

			function addNext() {
				// adding an image to the right of the main image
				svg.selectAll("image.next").data([n]).enter().append("image")
					.classed("next", 1)
					.attr({
						"xlink:href": './full/' + n.full + '.jpg',
						x: target(n).x + width + 10,
						y: target(n).y,
						width: target(n).width,
						height: target(n).height
				})
			}
      
			function nudge(up) {
				// a nudge animation. the parameter defines if the image will be moved up or down
				if (ready) {
					var bump = (d.orientation === "vertical") ? 10 : 40;
					ready = false;
						svg.select("image.full").transition()
							// because the distance is very short the transition time is also short
							.duration(100)
							.attr("y", target(d).y - (up ? bump : -bump))
							// after nudging, we go back to the grid view
							.each("end", back)
				}
			}

			function drawCross() {
				// closing cross drawn programatically because why not
				var newCross = svg.selectAll("g.cross").data([{}]).enter().append("g").classed("cross", 1)
					.attr("transform", "translate(" + (width - 76) + ",49)")
					.style({stroke: "#ebebeb", "stroke-width": 3});
				// we add a rectangle, so user doesn't have to click / tap exactly on the lines 
				newCross.append("rect").attr({width: 28, height: 28}).style({fill: "#333", stroke: "none"});
				newCross.append("line").attr({x2:28, y2: 28});
				newCross.append("line").attr({y1:28, x2: 28});
				// tapping / clicking will send back to grid view
				svg.selectAll("g.cross").on("click", back);	

			}

			function target(d) {
				// convenience function to show where an image would be displayed full size, 
				// depending on its orientation (vertical / horizontal)
				return (d.orientation === "vertical") ? 
				{
					x: width * .130569458,
					y: 120,
					width: width * .73886108398,
					height: 710
				} : 
				{
					x: 0,
					y: 247,
					width: width,
					height: 427
				};
			}

			function back() {
				// takes user back to grid view
				ready = false;
				// remove Hammer.js event listener
				hammertime.destroy();
				// show grid HTML element (even if still transparent)
				grid.style("display", "block");
				// allow svg to scroll again
				svg.attr("height", height);
				// hides footer, header, cross (then actually remove cross)
				detail.select(".footer").transition().style("opacity", 0);
				svg.select("g.header").transition().style("opacity", 0);
				svg.select("g.cross").transition().style("opacity", 0).remove();
				// turns SVG background back to white
				bck.transition()
					.style("fill", "#fff");
				// remove full size images to the left or right
				svg.selectAll("image.prev, image.next").remove();
				// shrinks the image back to thumbnail
				svg.select("image.full").transition().duration(500)
					.attr({x: d.x, y: d.y, width: 282, height: 206})
					// we play on opacity too, because the full image is not going to be 
					// exactly like the thumbnail. if we didn't fade it, there would be
					// a very noticeable difference at the end of the animation. 
					.style("opacity", 0);
				
				// reveal grid element 
				grid.transition().style("opacity", 1);
				
				// and show all other thumnails
				d3.selectAll("image.thumbnail").transition().duration(300)
					.style("opacity", 1)
					.each("end", function() {
						// at the end: remove the full image and hide the detail HTML block
						// technically this is run 8 times but nothing happens beyond 1st time
						svg.select("image.full").remove();
						detail.style("display", "none");	
					})
			}
		}); 


	}

	
	function debug(d) {
		if (vis.debug) {console.log(d);}
	}
	
})();