var n=new Date(Date.now());
var oldDate=n-45*24*60*60*1000

var criteres=[
	{short:"promo",long:"Auto-promotion",color:"gold"},
	{short:"social",long:"Social",color:"red"},
	{short:"eco",long:"Économie",color:"blue"},
	{short:"dem",long:"Démocratie",color:"silver"},
	{short:"valeurs",long:"Valeurs",color:"purple"},
	{short:"peur",long:"Peur",color:"#ccc"},
	{short:"egal",long:"Égalités", color:"pink"},
	{short:"env",long:"Environnement",color:"green"},
	{short:"culture", long:"Culture",color:"brown"},
	{short:"critique",long:"Attaques",color:"#002"}]
	
criteres.forEach(function(c) {c.cScale=d3.scale.linear().domain([0,10]).range(["white",c.color]);});

categories=[
	{short:"Joly",long:"Eva Joly"},
	{short:"France TV",long:"France télévisions"},
	{short:"UMP",long:"UMP"},
	{short:"MLP",long:"Marine Le Pen"},
	{short:"Modem",long:"Modem"},
	{short:"TF1",long:"TF1"},
	{short:"FN",long:"Front National"},
	{short:"PS",long:"Parti Socialiste"},
	{short:"EELV",long:"EELV"},
	{short:"Hollande",long:"François Hollande"},
	{short:"Libe",long:"Libération"},
	{short:"Sarkozy",long:"Nicolas Sarkozy"},
	{short:"Bayrou",long:"François Bayrou"},
	{short:"LeMonde",long:"Le Monde"},
	{short:"Figaro",long:"Le Figaro"}];


var days=d3.range(45).map(function(d) {var myDate=new Date(oldDate+24*60*60*1000*d);return myDate.getFullYear()+"-"+myDate.getMonth()+"-"+myDate.getDate();})

var cat1=9;var cat2=4;

categories.forEach(function(cat) {
	var timeLine=PT.filter(function(t) {return (t.category==cat.short)&&((n-new Date(t.date))<45*24*60*60*1000);});
	var timeLineD=[];
	cat.timeLineS=[];
	criteres.forEach(function(c,i) {
		timeLineD[i]=d3.nest()
		.key(function(d) {return d.day;})
		.rollup(function(d) {return d3.sum(d, function(i) {return i.score[c];});})
		.map(timeline);
		cat.timeLineS.push([]);
		days.forEach(function(d) {
			if(!timeLineD[i][d]){
				cat.timeLineS[i].push(0);
			} else {
				cat.timeLineS[i].push(timeLineD[i][d]);
			};
		});
	});
	
});

var svg=d3.select("#chart").append("svg:svg");

var grids=svg.selectAll(".grids").data(criteres).enter().append("svg:g").classed("grids",1);

grids.attr("transform",function(d,i) {return "translate(200,"+(150+i*40)+")";});


var bars=grids.selectAll(".bars")
	.data(function(c,i) {return days.map(function(d) {return {day:d,critere:i};});})
	.enter().append("svg:g").classed("bars",1);
bars.attr("transform",function(d,i) {return "translate("+(i*15)+",0)";});
var rect1=bars.append("svg:rect").attr("width",13).attr("height",13).attr("x",1).attr("y",1)
	.style("stroke","none")
	.style("fill",function(d,i) {return criteres.cScale(categories[cat1].timeLineS[i]);})
	.attr("title",function(d,i) {return (categories[cat1].timeLineS[i]);})
var rect2=bars.append("svg:rect").attr("width",13).attr("height",13).attr("x",1).attr("y",16)
	.style("stroke","none")
	.style("fill",function(d,i) {return criteres.cScale(categories[cat2].timeLineS[i]);})
	.attr("title",function(d,i) {return (categories[cat2].timeLineS[i]);})
//$('rect').tipsy({html: true, gravity: 's'});