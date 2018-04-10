var n=new Date(Date.now());
var oldDate=n-45*24*60*60*1000

var pScale=d3.scale.linear().domain([0,10]).range(["white","#31A354"]);

var days=d3.range(45).map(function(d) {var myDate=new Date(oldDate+24*60*60*1000*d);return myDate.getFullYear()+"-"+myDate.getMonth()+"-"+myDate.getDate();})

var fh=PT.filter(function(t) {return (t.account=="fhollande")&&((n-new Date(t.date))<45*24*60*60*1000);});
var mlp=PT.filter(function(t) {return (t.account=="MLP_officiel")&&((n-new Date(t.date))<45*24*60*60*1000);});
var fhd=[];mlpd=[];
var fhS=[];mlpS=[];
criteres=["promo", "social", "eco", "dem", "valeurs", "peur", "egal", "env", "culture", "critique"];
criteres.forEach(function(c,i) {
	fhd[i]=d3.nest()
		.key(function(d) {return d.day;})
		.rollup(function(d) {return d3.sum(d, function(i) {return i.score[c];});})
		.map(fh);
	
	mlpd[i]=d3.nest()
		.key(function(d) {return d.day;})
		.rollup(function(d) {return d3.sum(d, function(i) {return i.score[c];});})
		.map(mlp);
	fhS.push([]);
	mlpS.push([]);
	days.forEach(function(d) {
		if(!fhd[i][d]) {
			fhS[i].push(0);
		} else {
			fhS[i].push(fhd[i][d]);
		};
		if(!mlpd[i][d]) {
			mlpS[i].push(0);
		} else {
			mlpS[i].push(mlpd[i][d]);
		};
	});
});
var svg=d3.select("#chart").append("svg:svg");
var grids=svg.selectAll(".grids").data(criteres).enter().append("svg:g").classed("grids",1);
grids.attr("transform",function(d,i) {return "translate(200,"+(150+i*40)+")";});

var bars=grids.selectAll(".bars").data(days).enter().append("svg:g").classed("bars",1);
bars.attr("transform",function(d,i) {return "translate("+(i*15)+",0)";});
var fhR=bars.append("svg:rect").attr("width",13).attr("height",13).attr("x",1).attr("y",1)
	.style("stroke","none")
	.style("fill",function(d) {return pScale(fhd[0][d]);})
	


