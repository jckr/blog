var vis = {};
vis.svg = d3.select("#chart").append("svg").attr({width: 600, height:600})

vis.defs = vis.svg.append("defs");
vis.defs.append("pattern").attr({id: "p1", width:50, height:50, patternUnits: "userSpaceOnUse"})
d3.select("#p1")
  .append("rect").attr({width: 50, height: 50}).style("fill", "black")
d3.select("#p1").selectAll("line").data(d3.range(11)).enter().append("line")
  .each(function(d) {
  d3.select(this).attr({x1: -2, y1: 10 * d + 2, x2: 10 * d + 2, y2: -2}).style({"stroke-width":4, "stroke-linecap":"round", stroke: "red"})
})

vis.defs.append("pattern").attr({id: "p2", width:50, height:50, patternUnits: "userSpaceOnUse"})
d3.select("#p2")
  .append("rect").attr({width: 50, height: 50}).style("fill", "black")

d3.select("#p2").selectAll("line").data(d3.range(11)).enter().append("line")
  .each(function(d) {
  d3.select(this).attr({x1: -2, y1: 50 - (10 * d + 2), x2: 10 * d + 2, y2: 52}).style({"stroke-width":3, "stroke-linecap":"round", stroke: "green"})
})




vis.svg.append("rect").attr({width: 600, height: 600}).style("fill", "#88c");
vis.svg.append("rect").attr({width: 400, height: 400}).style("fill", "url(#p1)").classed("r", 1)
vis.svg.append("rect").attr({width: 400, height: 400, x: 200, y: 200}).style("fill", "url(#p2)").classed("r", 1);

d3.selectAll(".r").style("opacity", .8)
vis.options = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];



vis.select = d3.select("#select");
vis.select.selectAll("options").data(vis.options).enter().append("option").html(String);
vis.select.on("change", function() {
  var d = d3.select(this).property("value");
  d3.selectAll(".r").style("mix-blend-mode", d);

})
