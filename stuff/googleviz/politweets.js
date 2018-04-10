/////////////////////////////////////////////////////////////////////////////
//
//	Step 1: data
//
/////////////////////////////////////////////////////////////////////////////


var n=new Date(Date.now());
var formatTime = d3.time.format("%Y-%m-%d %H:%M:%S"); 
var n=formatTime.parse(d3.max(PT,function(t) {return t.date;}))

var oldDate=n-45*24*60*60*1000

var criteres=[
	{short:"promo",long:"Auto-promotion",color:"darkorange",abstract:"Le score d'auto-promo reflète la propension d'un candidat à parler de lui, de son équipe, de ses déplacements, de ses apparitions dans les médias."},
	{short:"social",long:"Social",color:"red", abstract:"Le score social correspond à des sujets tels que les inégalités de revenus, l'éducation ou la santé."},
	{short:"eco",long:"Économie",color:"blue", abstract:"Le score d'économie représente toutes les mentions à l'actualité économique, au budget, à la dette, aux finances publiques comme aux marchés financiers."},
	{short:"dem",long:"Démocratie",color:"silver", abstract:"Chaque fois qu'un candidat parle de liberté, de vote, de devoir civique, mais aussi de droits de l'homme et de relations internationales, il augmente son score de démocratie."},
	{short:"valeurs",long:"Valeurs",color:"purple", abstract:"Le score des valeurs correspond à toutes les mentions des convictions des candidats et à leur professions de foi."},
	{short:"peur",long:"Peur",color:"darkslategray", abstract:"Le score de peur provient de toutes les allusions à la sécurité, à la violence, à la criminalité et aux risques encourus par les Français."},
	{short:"egal",long:"Égalités", color:"pink", abstract: "Le score d'égalités est alimenté par toutes les mentions aux droits des femmes ou des minorités, ainsi qu'à l'égalité des droits pour tous."},
	{short:"env",long:"Environnement",color:"green", abstract: "Le score d'environnement représente la propension d'un candidat à parler d'environnement ou d'énergie."},
	{short:"culture", long:"Culture",color:"brown", abstract: "Et la culture? ce score comptabilise toutes les mentions de la culture ou du monde numérique."},
	{short:"critique",long:"Attaques",color:"darkkhaki", abstract: "Le score d'attaques mesure les piques lancées par un candidat envers les autres."}]

var month={1:"Janvier",2:"Février",3:"Mars",4:"Avril",5:"Mai",6:"Juin",7:"Juillet",8:"Août",9:"Septembre",10:"Octobre",11:"Novembre",12:"Décembre"};
	


barColor=["#BCBD22","#175ACF"]
//["brown","slateblue"];
var categories=[
	{short:"MLP",long:"Marine Le Pen",img:"MLP_small.jpg", abstract:"Marine Le Pen, candidate du Front National (@MLP_officiel)",media:0},
	{short:"FN",long:"Front National",img:"FN_small.jpg", abstract:"Ce compte regroupe les tweets de campagne du Front National. Les cadres du Front National s'expriment moins que dans d'autres partis, ce groupe comprend donc juste @FN_officiel et @FNJ_officiel." ,media:0},
	{short:"Sarkozy",long:"Nicolas Sarkozy",img:"sarkozy_small.jpg", abstract: "Ceci n'est pas le compte du <i>candidat</i> Sarkozy mais de son comité de soutien en vue de sa probable campagne présidentielle: @SARKOZY_2012",media:0},
	{short:"UMP",long:"UMP",img:"ump_small.jpg", abstract:"Ce compte regroupe les tweets des membres de l'UMP prenant une part active à la campagne via twitter : @ump, @jeunesump, @jf_cope, @FLevebvre_UMP, @vpecresse, @VRossoDebord, @DeputeTardy, @frankriester, et @lauredlr.",media:0},
	{short:"Bayrou",long:"François Bayrou",img:"bayrou_small.jpg", abstract: "Le compte de François Bayrou, candidat du Modem (@fbayrou)",media:0},
	{short:"Modem",long:"Modem",img:"MODEM_small.jpg", abstract:"Ce compte regroupe les tweets de différentes entités du Modem. Le choix des contributeurs est arbitraire. Sont représentés: @modem, @yannwehrling, @democrates, @jlbennahmias. ",media:0},
	{short:"Hollande",long:"François Hollande",img:"fhollande_small.png", abstract:"Le compte de François Hollande, candidat du Parti Socialiste (@fhollande)",media:0},
	{short:"PS",long:"Parti Socialiste",img:"PS_small.jpg", abstract:"Ce compte regroupe les tweets des responsables socialistes suivants: @partisocialiste, @pierremoscovici, @aurelifil, @vincent_peillon, @faureolivier, @frebsamen, @marisoltouraine, @najatvb, @delphinebatho et @vincentfeltesse.",media:0},
	{short:"Joly",long:"Eva Joly",img:"Joly_small.jpg", abstract:"Eva Joly, candidate d'EELV.",media:0},
	{short:"EELV",long:"EELV",img:"EELV_small.png", abstract:"Ce compte regroupe les tweets des membres d'EELV prenant une part active à la campagne. Le choix des contributeurs est nécessairement arbitraire et regroupe: @EELV, @CecileDuflot, @JVPlace, @DominiqueVoynet, @yjadot et @julienbayou",media:0},
	{short:"Melenchon",long:"Jean-Luc Mélenchon",img:"melenchon2012_small.png", abstract: "Le compte de Jean-Luc Mélenchon, candidat du Front de Gauche (@melenchon2012). Le candidat ne tweete pas en personne.",media:0},
	{short:"FDG",long:"Front de Gauche", img:"FrontDeGauche_small.jpg", abstract: "Ce compte regroupe les tweets de l'équipe de campagne du Front de Gauche. Le choix des contributeurs est nécessairement arbitraire et regroupe: @FrontDeGauche, @PlaceAuPeuple, @SauvageLaurence, @IanBrossat, @Dartigolles, et @leilachaibi.", media:0},
	{short:"France TV",long:"France télévisions",img:"francetelevisions_small.jpg",abstract:"Le compte de France Télévisions dédié à la campagne présidentielle 2012.",media:1},
	{short:"TF1",long:"TF1",img:"TF1_small.png", abstract:"Une sélection des tweets des chaînes d'information de TF1. Correspond à @TF1News_Select.",media:1},
	{short:"Libe",long:"Libération",img:"Libe_small.jpg", abstract: "Le fil de Libération dédié à la présidentielle (@Libe_2012)",media:1},
	{short:"LeMonde",long:"Le Monde",img:"lemonde_small.jpg", abstract: "Les actualités politiques du Monde: @lemondepol",media:1},
	{short:"Figaro",long:"Le Figaro",img:"Figaro_small.gif", abstract: "Le fil d'actualités du Figaro: @LeFigaro_news",media:1}
	];
		
categories.forEach(function(c,i) {c.id=i;})
categoriesHash={"MLP": 0,"FN": 1,"Sarkozy": 2,"UMP": 3,"Bayrou": 4,"Modem": 5,"Hollande": 6,"PS": 7,"Joly": 8,"EELV": 9,"Melenchon": 10,"FDG": 11,"France TV": 12,"TF1": 13,"Libe": 14,"LeMonde": 15,"Figaro": 16}

camp={
	"evajoly":1,
	"Francetv2012":-1,
	"UMP":4,
	"jeunesump":4,
	"jf_cope":4,
	"FLefebvre_UMP":4,
	"vpecresse":4,
	"VRossoDebord":4,
	"DeputeTardy":4,
	"franckriester":4,
	"lauredlr":4,
	"MLP_officiel":5,
	"modem":3,
	"yannwehrling":3,
	"democrates":3,
	"jlbennahmias":3,
	"TF1News_Select":-1,
	"FN_officiel":5,
	"FNJ_officiel":5,
	"partisocialiste":2,
	"pierremoscovici":2,
	"aurelifil":2,
	"vincent_peillon":2,
	"faureolivier":2,
	"frebsamen":2,
	"marisoltouraine":2,
	"najatvb":2,
	"delphinebatho":2,
	"vincentfeltesse":2,
	"EELV":1,
	"CecileDuflot":1,
	"JVPlace":1,
	"DominiqueVoynet":1,
	"yjadot":1,
	"julienbayou":1,
	"fhollande":2,
	"libe_2012":-1,
	"SARKOZY_2012":4,
	"bayrou":3,
	"lemonde_pol":-1,
	"LeFigaro_News":-1,
	"melenchon2012":0,
	"leilachaibi":0,
	"IanBrossat":0,
	"Dartigolles":0,
	"FrontDeGauche":0,
	"PlaceAuPeuple":0
}
var camps=["FDG","EELV","PS","Modem","UMP","FN"];
var accounts=[{name:"evajoly", img:"Joly_small.jpg", cat:"Joly"},
	      {name:"Francetv2012", img:"francetelevisions_small.jpg",cat:"France TV"}, 
	      {name:"UMP", img:"UMP_small.jpg", cat:"UMP"}, 
	      {name:"jeunesump", img:"jeunesump_small.png",cat:"UMP"}, 
	      {name:"jf_cope", img:"jf_cope_small.jpg",cat:"UMP"}, 
	      {name:"FLefebvre_UMP", img:"FLefebvre_UMP_small.jpg",cat:"UMP"}, 
	      {name:"vpecresse", img:"vpecresse_small.jpg",cat:"UMP"}, 
	      {name:"VRossoDebord", img:"VRossoDebord_small.jpg",cat:"UMP"}, 
	      {name:"DeputeTardy", img:"DeputeTardy_small.jpg",cat:"UMP"}, 
	      {name:"franckriester", img:"franckriester_small.jpg",cat:"UMP"}, 
	      {name:"lauredlr", img:"lauredlr_small.jpg",cat:"UMP"}, 
	      {name:"MLP_officiel", img:"MLP_small.jpg",cat:"MLP"}, 
	      {name:"modem", img:"MODEM_small.jpg",cat:"Modem"}, 
	      {name:"yannwehrling", img:"yannwehrling_small.jpg",cat:"Modem"}, 
	      {name:"democrates", img:"democrates_small.jpg",cat:"Modem"}, 
	      {name:"jlbennahmias", img:"jlbennahmias_small.jpg",cat:"Modem"}, 
	      {name:"TF1News_Select", img:"TF1_small.png",cat:"TF1"}, 
	      {name:"FN_officiel", img:"FN_small.jpg",cat:"FN"}, 
	      {name:"FNJ_officiel", img:"FNJ_officiel_small.jpg",cat:"FN"}, 
	      {name:"partisocialiste", img:"PS_small.jpg",cat:"PS"}, 
	      {name:"pierremoscovici", img:"pierremoscovici_small.png",cat:"PS"}, 
	      {name:"aurelifil", img:"aurelifil_small.jpg",cat:"PS"}, 
	      {name:"vincent_peillon", img:"vincent_peillon_small.jpg",cat:"PS"}, 
	      {name:"faureolivier", img:"faureolivier_small.jpg",cat:"PS"}, 
	      {name:"frebsamen", img:"frebsamen_small.jpg",cat:"PS"}, 
	      {name:"marisoltouraine", img:"marisoltouraine_small.jpg",cat:"PS"}, 
	      {name:"najatvb", img:"najatvb_small.jpg",cat:"PS"}, 
	      {name:"delphinebatho", img:"delphinebatho_small.jpg",cat:"PS"}, 
	      {name:"vincentfeltesse", img:"vincentfeltesse_small.jpg",cat:"PS"}, 
	      {name:"EELV", img:"EELV_small.png",cat:"EELV"}, 
	      {name:"CecileDuflot", img:"CecileDuflot_small.jpg",cat:"EELV"}, 
	      {name:"JVPlace", img:"JVPlace_small.jpg",cat:"EELV"}, 
	      {name:"DominiqueVoynet", img:"DominiqueVoynet_small.jpg",cat:"EELV"}, 
	      {name:"yjadot", img:"yjadot_small.jpg",cat:"EELV"}, 
	      {name:"julienbayou", img:"julienbayou_small.jpg",cat:"EELV"}, 
	      {name:"fhollande", img:"fhollande_small.png",cat:"Hollande"}, 
	      {name:"libe_2012", img:"Libe_small.jpg",cat:"Libe"}, 
	      {name:"SARKOZY_2012", img:"sarkozy_small.jpg",cat:"Sarkozy"}, 
	      {name:"bayrou", img:"bayrou_small.jpg",cat:"Bayrou"}, 
	      {name:"lemonde_pol", img:"lemonde_small.jpg",cat:"LeMonde"}, 
	      {name:"LeFigaro_News", img:"Figaro_small.gif",cat:"Figaro"}, 
	      {name:"Melenchon2012", img:"melenchon2012_small.png",cat:"Melenchon"}, 
	      {name:"leilachaibi", img:"leilachaibi_small.jpg",cat:"FDG"}, 
	      {name:"IanBrossat", img:"IanBrossat_small.jpg",cat:"FDG"}, 
	      {name:"Dartigolles", img:"Dartigolles_small.jpg",cat:"FDG"}, 
	      {name:"FrontDeGauche", img:"FrontDeGauche_small.jpg",cat:"FDG"}, 
	      {name:"PlaceAuPeuple", img:"PlaceAuPeuple_small.jpg",cat:"FDG"}
	      ];
      

categories.forEach(function(c,i) {accounts.filter(function(a) {return a.cat==c.short;}).forEach(function(a) {a.catId=i;})})
var hashaccount=d3.nest().key(function(d) {return d.name;}).map(accounts);

accounts.forEach(function(d,i) {hashaccount[d.name]=i;});

var days=d3.range(45).map(function(d) {var myDate=new Date(oldDate+24*60*60*1000*d);return myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();})

var tpd=d3.nest()
		.key(function(d) {return d.day;})
		.rollup(function(d) {return d.length;})
		.map(PT.filter(function(t) {return (n-formatTime.parse(t.date))<45*24*60*60*1000;}));
var dyScale=d3.scale.linear().range([0,-15]).domain([0,d3.max(d3.values(tpd))]);
tpd=days.map(function(d,i) {return {day:d,tweets:tpd[d]?tpd[d]:0};})

var areaD=d3.svg.area().interpolate("linear").x(function(d,i) {return 15*i;}).y1(function(d) {return dyScale(d.tweets);})

categories.forEach(function(cat) {
	cat.timeLine=PT.filter(function(t) {t.secs=n-formatTime.parse(t.date);return (t.category==cat.short)&&((n-formatTime.parse(t.date))<45*24*60*60*1000);});
	
	var timeLineD=[];
	cat.timeLineS=[];
	cat.timeLineSN=[];
	cat.timeLineAgg=[];
	criteres.forEach(function(c,i) {
		timeLineD[i]=d3.nest()
		.key(function(d) {return d.day;})
		.rollup(function(d) {return d3.sum(d, function(i) {return i.score[c.short];});})
		.map(cat.timeLine);
		cat.timeLineS.push([]);
		days.forEach(function(d) {
			if(!timeLineD[i][d]){
				cat.timeLineS[i].push(0);
			} else {
				cat.timeLineS[i].push(timeLineD[i][d]);
			};
		});
		if(d3.sum(cat.timeLineS[i])) {
			cat.timeLineSN.push(cat.timeLineS[i].map(function(d) {return d/d3.sum(cat.timeLineS[i]);}));
		} else {
			cat.timeLineSN.push(cat.timeLineS[i].map(function() {return 0;}));
		}
		cat.timeLineAgg.push(d3.sum(cat.timeLineS[i]));
	});
	cat.timeLineAgg=cat.timeLineAgg.map(function(d) {return d/d3.sum(cat.timeLineAgg);})
});

var cat1=7;var cat2=3;var cat3=7;
var critS=0;
var mode=2;
var pageIdx;

/////////////////////////////////////////////////////////////////////////////
//
//	Step 2: functions which are helpful throughout the vis
//
/////////////////////////////////////////////////////////////////////////////


var xTicks=d3.scale.linear().range([0,675]).domain([3888000000,0])


function useTweet(tweet,l) {
	if(!tweet) {
		// no tweet selected? cleaning the tweet
		d3.select(".tweet").selectAll("span").html("");
		d3.select(".tweet").select("img").style("display","none");
		
	} 
	else {
		d3.select(".tweetimg").attr("src","./profilepics/"+accounts[hashaccount[tweet.account]].img)
			.style("cursor","pointer")
			.style("display","block")
			.on("click", function() {cat3=accounts[hashaccount[tweet.account]].catId; initPage3();})
			;
		
		d3.select(".tweet .right .author").html(tweet.account);
		d3.select(".tweet .right .id").html("&nbsp("+l+" tweet"+(l>1?"s)":")"))
		.attr("title","Il y a eu "+l+" tweet"+(l>1?"s":"")+" ce jour-là sur ce sujet.");
		d3.select(".tweet .right .text").html(tweet.text.replace(new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi),'<a href="$1" target="_blank">$1</a>'));
		d3.select(".tweet .right .time").html(tweet.date);
	}
}


function useTweetr(range) {
	var l;
	if (l=range.length) {
		useTweet(range[~~(l*Math.random())],l);
	} else {
		useTweet();
	}
}




/////////////////////////////////////////////////////////////////////////////
//
//	Functions for page 1 - view over time
//
/////////////////////////////////////////////////////////////////////////////






function initPage1()	{

// some cleanup when the page is brought up. We remove what we don't want to create twice.

pageIdx=1;d3.select(".alwaysthere").selectAll("li").classed("selected",0);d3.select(".alwaysthere").selectAll("#li1").classed("selected",1);
d3.selectAll(".page").classed("invisible",1);
d3.select("#page1").classed("invisible",0);
d3.select("#page1").selectAll("svg").remove();
d3.select("#page1").selectAll(".labels").remove();
var svg=d3.select("#page1").append("svg:svg").attr("width",960).attr("height",765);

// Scales

var aggScale=d3.scale.linear().domain([0,.6]).range([0,100]);


cScale1=d3.scale.linear().domain([0,.3]).range(["white",barColor[0]]);
cScale2=d3.scale.linear().domain([0,.3]).range(["white",barColor[1]]);
var 
y1=d3.scale.linear().range([0,-15]).domain([0,.25]);
var 
y2=d3.scale.linear().range([0,15]).domain([0,.25]);
var area1=d3.svg.area().interpolate("basis").x(function(d,i) {return 15*i;}).y1(function(d) {return y1(d);})
var area2=d3.svg.area().interpolate("basis").x(function(d,i) {return 15*i;}).y1(function(d) {return y2(d);})

// This is the menu that helps changing representations

d3.select("#page1").select(".mode0").select("a").on("click",function() {
	mode=0;
	d3.selectAll("#page1").selectAll(".modedesc").html("Les <b>carrés</b> permettent de mesurer <b>l'intensité</b> des tweets sur chaque sujet.")
	d3.selectAll("#page1").selectAll(".selected").classed("selected",0);
	d3.select(this).classed("selected",1);
	changeCat();
});
d3.select("#page1").select(".mode1").select("a").on("click",function() {
	mode=1;
	d3.selectAll("#page1").selectAll(".modedesc").html("Les <b>coches</b> permettent de mieux voir <b>la fréquence</b> des tweets sur chaque sujet.")
	d3.selectAll("#page1").selectAll(".selected").classed("selected",0);
	d3.select(this).classed("selected",1);
	changeCat();
});
d3.select("#page1").select(".mode2").select("a").on("click",function() {
	mode=2;
	d3.selectAll("#page1").selectAll(".modedesc").html("Les <b>aires</b> mettent en valeur les <b>différences</b> entre deux comptes.")
	d3.selectAll("#page1").selectAll(".selected").classed("selected",0);
	d3.select(this).classed("selected",1);
	changeCat();
});

// This is the representation of tweet volumes per day

var xAxis=svg.append("svg:g").classed("xAxis",1).attr("transform","translate(260,180)").attr("height",50).attr("width",675);

xAxis.append("svg:path").attr("d",function() {return areaD(tpd);}).style("stroke","#ccc").style("fill","#ccc").style("opacity",.2);
xAxis.selectAll("line").data(days).enter().append("svg:line")
	.attr("x1",function(d,i) {return i*15;}).attr("x2",function(d,i) {return i*15;})
	.attr("y1",0).attr("y2",-20)
	.style("stroke",function(d) {return (d.split("-")[2]==1)?"black":"white";}).style("stroke-width",1).style("stroke-opacity",.5)

// This is a bit of a hack to represent separation between months in that view. Let's just say it does the trick 

var d0=days[0].split("-");if(d0[2]>15&&d0[2]<27){
	xAxis.append("svg:text").attr("x",0).attr("y",-5).text(function() {return month[d0[1]];}).classed("axismonth",1)
}
if(d0[2]<=15){
	xAxis.append("svg:text").attr("x",function() {return (d0[2]-15)*15;}).attr("y",-5).text(function() {return month[d0[1]];}).classed("axismonth",1)
}

var d2=days[44].split("-");if(d2[2]>4&&d2[2]<15){
	xAxis.append("svg:text").attr("x",660).attr("y",-5).text(function() {return month[d2[1]];}).attr("text-anchor","end").classed("axismonth",1);
}
if(d2[2]>=15){
	xAxis.append("svg:text").attr("x",function() {return (days.indexOf([d2[0],d2[1],15].join("-"))*15);}).attr("y",-5).text(function() {return month[d2[1]];}).classed("axismonth",1)
}
if(d2[1]-d0[1]==2){
	xAxis.append("svg:text").attr("x",function() {return (days.indexOf([d2[0],d2[1]-1,15].join("-"))*15);}).attr("y",-5).text(function() {return month[d2[1]-1];}).classed("axismonth",1)
}

// now let's make this clickable. we place almost transparent (but clicakble) rectangles over there so people can see all tweets of that day.
xAxis.selectAll("rect").data(days).enter().append("svg:rect")
	.attr("x",function(d,i) {return i*15;}).attr("y",-20).attr("width",15).attr("height",20)
	.style("stroke","none")
	.style("fill","white").style("opacity",0.01).style("cursor","pointer")
	.on("click",function(d) {useTweetr(PT.filter(function(t) {return t.day==d;}));})




// Now the main viz per se. 
// We are going to split the view in several horizontal bands, 
// then attach all the graphical representation in sequence: first areas, then ticks, then squares.
// Only one of them will be visible at a time. But they all exist at all times. 

// Bands are placed.

var grids=svg.selectAll(".grids").data(criteres).enter().append("svg:g").classed("grids",1).attr("width",675).attr("height",40);
grids.attr("transform",function(d,i) {return "translate(260,"+(200+i*40)+")";});

// Labels are placed next. These are not SVG elements, but HTML divs and links.

d3.select("#page1").selectAll(".labels").data(criteres).enter().append("div").classed("labels",1)
	.style("position","absolute")
		.style("top",function(d,i) {return (210+i*40)+"px";})
		.style("left",20)
	.style("width", "110px")
	.append("a")
		.style("float","right")
		.attr("href","#")
		.on("mouseover",function(d) {d3.select(this).style("text-decoration","underline")
				.style("color",function(d) {return d.color;})
		;})
		.on("mouseout",function() {d3.select(this).style("text-decoration","none")
			.style("color","steelblue");
		})
		.on("click",function(d,i) {critS=i;initPage2();})
		//.style("border-bottom",function(d) {return "1px solid " + d.color;})
		//.classed("labelLink",1).classed(function(d) {return d.short;},1) // might style it here instead
		.html(function(d) {return d.long;})

// These represent the total bars on the left side. For the time being they are non-clickable because of a bug which wasn't the main priority there.

var aggBar1=grids.append("svg:rect").attr("x",-120).attr("y",2).attr("width",0).attr("height",15).attr("fill",barColor[0])
	//.on("click", function(d,i) {useTweetr(PT.filter(function(t) {return (t.categories==categories[cat1].short)&&(t.score[criteres[i].short]);}));})
	//.style("cursor","pointer")
;
var aggBar2=grids.append("svg:rect").attr("x",-120).attr("y",19).attr("width",0).attr("height",15).attr("fill",barColor[1])
	//.on("click", function(d,i) {useTweetr(PT.filter(function(t) {return (t.categories==categories[cat2].short)&&(t.score[criteres[i].short]);}));})
	//.style("cursor","pointer")
;

// now the data charts proper. At first they are all initiated to a zero value: the area is a flat line, there are no ticks, the squares are white.
// area charts are one svg item per horizontal band.

var a1=grids
	.append("svg:path").attr("transform","translate(0,15)")	
	.attr("d", function() {return area1(d3.range(45).map(function() {return 0;}));}) // this is a flat line.
	.style("fill",function() {return barColor[0];}).style("opacity",.5).style("stroke-width",1).style("stroke",function() {return barColor[0];})
var a2=grids
	.append("svg:path").attr("transform","translate(0,15)")
	.attr("d", function() {return area2(d3.range(45).map(function() {return 0;}));})
	.style("fill",function() {return barColor[1];}).style("opacity",.5).style("stroke-width",1).style("stroke",function() {return barColor[1];})


// for ticks and squares, there are many items per horizontal band, so first we use another subgroup to accomodate them
var bars=grids.selectAll(".bars")
	.data(function(c,i) {return days.map(function(d) {return {day:d,critere:i};});})
	.enter().append("svg:g").classed("bars",1).attr("width",15).attr("height",40);
bars.attr("transform",function(d,i) {return "translate("+(i*15)+",0)";});

// where we can add the squares.


var rect1=bars.append("svg:rect").attr("width",15).attr("height",15).attr("x",0).attr("y",0)
	.style("stroke","white")//.style("stroke-opacity",.2)
	.style("fill","white").style("cursor","pointer")
	.attr("title",function(d,i) {return (categories[cat1].timeLineS[d.critere][i]);})
var rect2=bars.append("svg:rect").attr("width",15).attr("height",15).attr("x",0).attr("y",16)
	.style("stroke","white")//.style("stroke-opacity",.2)
	.style("fill","white").style("cursor","pointer")
	.attr("title",function(d,i) {return (categories[cat2].timeLineS[d.critere][i]);})

// finally we add the ticks. 

var ticks1=grids.selectAll(".ticks1").data(function(d) {return categories[cat1].timeLine.filter(function(t) {return t.score[d.short]>0;});})
	.enter().append("svg:line").classed("ticks1",1)
	.attr("x1",function(d) {return xTicks(d.secs);}).attr("x2",function(d) {return xTicks(d.secs);}).attr("y1",14).attr("y2",14)
	.style("stroke",barColor[0]).style("stroke-linecap","round").style("stroke-width","2px").style("visibility","hidden");
var ticks2=grids.selectAll(".ticks2").data(function(d) {return categories[cat2].timeLine.filter(function(t) {return t.score[d.short]>0;});})
	.enter().append("svg:line").classed("ticks1",1)
	.attr("x1",function(d) {return xTicks(d.secs);}).attr("x2",function(d) {return xTicks(d.secs);}).attr("y1",16).attr("y2",16)
	.style("stroke",barColor[1]).style("stroke-linecap","round").style("stroke-width","2px").style("visibility","hidden");

// and the axes.

var axes=grids.append("svg:line")
	.attr("x1",0).attr("x2",675).attr("y1",15).attr("y2",15)
	.style("stroke","black").style("stroke-width","0.5px");


// Now clicks are handled. 
// There can be 3 situations: 
// - areas are visible and there are transparent squares on top of them, so squares capture the clicks;
// - squares are visible and get the clicks
// - squares and areas are invisible, so ticks get the clicks.

rect1.on("click",function(d,i) {
	var relevantTweets=categories[cat1].timeLine.filter(function(t) {
	return (t.day==days[i])&&(t.score[criteres[d.critere].short]>0)});
	if (!(relevantTweets.length)) {useTweet();}
	else {var x=~~(Math.random()*relevantTweets.length);useTweet(relevantTweets[x],relevantTweets.length);}
});

	
rect2.on("click",function(d,i) {
	var relevantTweets=categories[cat2].timeLine.filter(function(t) {
	return (t.day==days[i])&&(t.score[criteres[d.critere].short]>0)});
	if (!(relevantTweets.length)) {useTweet();}
	else {var x=~~(Math.random()*relevantTweets.length);useTweet(relevantTweets[x],relevantTweets.length);}
});

ticks1.on("click",function(d,i) {
	useTweet(d,1);
});

	
ticks2.on("click",function(d,i) {
	useTweet(d,1);
});


// This function is called to "fill" this empty shell with data. We call it whenever there is a change to that view
// to reinitiate the data. We will use this mechanism throughout the vis.

changeCat();

// This section deals with the menus that select a candidate or a group of accounts.

var menuopen1=0,menuopen2=0;

d3.select(".dropdown.c1 dd ul").selectAll("li").data(categories).enter()
	.append("li").append("a").html(function(d) {return d.long;}).attr("href","#");
d3.select(".dropdown.c2 dd ul").selectAll("li").data(categories).enter()
	.append("li").append("a").html(function(d) {return d.long;}).attr("href","#");
d3.selectAll(".dropdown.c1 dt a span").html(categories[cat1].long);
d3.selectAll(".dropdown.c2 dt a span").html(categories[cat2].long);

d3.selectAll(".dropdown.c1 dt a").on("click",function(d) {
	menuopen1=1-menuopen1;menuopen2=0;
	d3.selectAll(".dropdown.c1 dd ul").style("display",function() {return menuopen1?"block":"none";})
	d3.selectAll(".dropdown.c2 dd ul").style("display","none");
})
d3.selectAll(".dropdown.c2 dt a").on("click",function(d) {
	menuopen2=1-menuopen2;menuopen1=0;
	d3.selectAll(".dropdown.c2 dd ul").style("display",function() {return menuopen2?"block":"none";})
	d3.selectAll(".dropdown.c1 dd ul").style("display","none");
})

d3.selectAll(".dropdown.c1 dd ul li a").on("click",function(d,i) {
	var text=d3.select(this).html();d3.selectAll(".dropdown.c1 dt a span").html(text);
	menuopen1=0;
	d3.selectAll(".dropdown.c1 dd ul ").style("display","none");
	cat1=i;
	d3.selectAll(".dropdown.c2 dd ul li").classed("invisible",function(d,j) {return ~~j==i;});// hide selected item in other list.
	console.log(cat1);
	changeCat();
})
d3.selectAll(".dropdown.c2 dd ul li a").on("click",function(d,i) {
	var text=d3.select(this).html();d3.selectAll(".dropdown.c2 dt a span").html(text);
	menuopen2=0;
	d3.selectAll(".dropdown.c2 dd ul").style("display","none");
	cat2=i;
	d3.selectAll(".dropdown.c1 dd ul li").classed("invisible",function(d,j) {return ~~j==i;});// hide selected item in other list.
	console.log(cat2);
	changeCat();
})

// These helper functions will reinitiate the squares, the ticks and the areas, and are especially helpful when 
// representation is changed from them to something else.

function initRect(){
	rect1.style("fill","white").style("visibility","hidden").style("opacity",1);
	rect2.style("fill","white").style("visibility","hidden").style("opacity",1);
}
function initTicks(){
	ticks1.remove();ticks2.remove();
	ticks1=grids.selectAll(".ticks1").data(function(d) {return categories[cat1].timeLine.filter(function(t) {return t.score[d.short]>0;});})
		.enter().append("svg:line").classed("ticks1",1)
		.attr("x1",function(d) {return xTicks(d.secs);}).attr("x2",function(d) {return xTicks(d.secs);}).attr("y1",14).attr("y2",14)
		.style("stroke",barColor[0]).style("stroke-linecap","round").style("stroke-width","2px")
		.style("cursor","pointer")
		.style("visibility","hidden");
	ticks2=grids.selectAll(".ticks2").data(function(d) {return categories[cat2].timeLine.filter(function(t) {return t.score[d.short]>0;});})
		.enter().append("svg:line").classed("ticks1",1)
		.attr("x1",function(d) {return xTicks(d.secs);}).attr("x2",function(d) {return xTicks(d.secs);}).attr("y1",16).attr("y2",16)
		.style("stroke",barColor[1]).style("stroke-linecap","round").style("stroke-width","2px")
		.style("cursor","pointer")
		.style("visibility","hidden");
	ticks1.on("click",function(d,i) {useTweet(d,1);});
	ticks2.on("click",function(d,i) {useTweet(d,1);});
	ticks1.attr("y2",16).style("visibility","hidden");
	ticks2.attr("y2",14).style("visibility","hidden");
}
function initAreas(){
	a1.attr("d", function() {return area2(d3.range(45).map(function() {return 0;}));}).style("visibility","hidden");
	a2.attr("d", function() {return area2(d3.range(45).map(function() {return 0;}));}).style("visibility","hidden");	
}

function changeCat() {
	// duration for all transitions can be managed centrally.
	
	var duration=1000;
	
	// this section manages the transitions that happen when the user changes categories or at init for this page.
	
	// updating images for candidates.
	
	d3.selectAll("img.cand1").attr("src",function() {return "./profilepics/"+categories[cat1].img;})
		.style("cursor","pointer")
		.on("click",function() {cat3=cat1;initPage3();})
	
	d3.selectAll("img.cand2").attr("src",function() {return "./profilepics/"+categories[cat2].img;})
		.style("cursor","pointer")
		.on("click",function() {cat3=cat2;initPage3();})
	
	if(mode==0){ // this means squares
		initRect();
		rect1.style("visibility","visible");
		rect2.style("visibility","visible");
		//axes.style("visibility","hidden");
		initTicks();
		initAreas();

		// this will "fill" our squares.
		
		rect1
			.transition()
			.style("fill",function(d,i) {return cScale1(categories[cat1].timeLineSN[d.critere][i]);})
			.delay(0).duration(duration);
		rect2
			.transition()
			.style("fill",function(d,i) {return cScale2(categories[cat2].timeLineSN[d.critere][i]);})
			.delay(0).duration(duration);
	}
	
	if(mode==1){ // this is ticks.
		axes.style("visibility","visible");
		initRect();
		initAreas();
		initTicks();

		ticks1.style("visibility","visible");ticks2.style("visibility","visible");

		// this will "grow" our ticks.
			
		ticks1
			.transition()
			.attr("y2",0)
			.delay(function(d,i) {return 5*i;}).duration(duration)
			;
		ticks2
			.transition()
			.attr("y2",30)
			.delay(function(d,i) {return 5*i;}).duration(duration)
			;
	}
	
	if(mode==2){ // this is areas.
		a1.style("visibility","visible");
		a2.style("visibility","visible");
		initRect();
		initTicks();
		
		// we keep squares around, but make them nearly invisible, so they still get the clicks.
		// there are one square per day so it is easy to redirect clicks on a specific place of the curve to 
		// tweets for one day.
		
		// conversely, there is only one area chart, so it would be cumbersome to handle clicks on different places of the curve
		// without keeping the squares.
		
		rect1.style("fill","white").style("visibility","visible").style("opacity",.01);
		rect2.style("fill","white").style("visibility","visible").style("opacity",.01);
		
		// we rescale. 
			
		/*var scaleMax = d3.max([
			d3.max(categories[cat1].timeLineSN.map(function(t) {return d3.max(t);})), 
			d3.max(categories[cat2].timeLineSN.map(function(t) {return d3.max(t);})), 
			]);
		scaleMax = d3.min([.15,scaleMax/2]);
		y1.domain([0,scaleMax])
		y2.domain([0,scaleMax])*/

		
		
		// and this "inflates" the curve.
		
		a1.transition()
			.attr("d",function(d,i) {return area1(categories[cat1].timeLineSN[i]);})
			.duration(duration)
			;
		a2.transition()
			.attr("d",function(d,i) {return area2(categories[cat2].timeLineSN[i]);})
			.duration(duration)
			;
	}	
	
	// finally, we grow the total bars, or move them from where they were to where they are.
	
	aggBar1
		.transition()
		.attr("width",function(d,i) {
			return aggScale
				(categories[cat1].timeLineAgg[i]);
		}).delay(0).duration(duration);
	aggBar2
		.transition()
		.attr("width",function(d,i) {
			return aggScale
				(categories[cat2].timeLineAgg[i]);
		}).delay(0).duration(duration);
}

}







/////////////////////////////////////////////////////////////////////////////
//
//	Functions for page 2 - view by subject
//
/////////////////////////////////////////////////////////////////////////////





function initPage2() {

// for subsequent pages we keep the same philosophy.
// first we clean up what there was. We also turn all other parts of the vis invisible.
// then we create an empty shell of a vis. 
// then, we pour data into this shell. whenever we change the settings the charts will move to match the selection.


pageIdx=2;d3.select(".alwaysthere").selectAll("li").classed("selected",0);d3.select(".alwaysthere").selectAll("#li2").classed("selected",1);
d3.selectAll(".page").classed("invisible",1);
d3.select("#page2").classed("invisible",0);
var page2=d3.select("#page2");
d3.select("#page2").selectAll("svg").remove();
var svg=d3.select("#page2").append("svg:svg").attr("width",960).attr("height",765);
var scalemode=0;

// like on the previous view we also have a way to toggle between representations, here between two scales.

d3.select("#page2").select(".mode0").select("a").on("click",function() {
	d3.selectAll("#page2").selectAll(".modedesc").html("Avec l'échelle <b>relative</b>, la valeur maximale occupe toute la largeur de l'écran.")
	d3.selectAll("#page2").selectAll(".selected").classed("selected",0);
	d3.select(this).classed("selected",1);
	scalemode=0;
	updateC();
});
d3.select("#page2").select(".mode1").select("a").on("click",function() {
	d3.selectAll("#page2").selectAll(".modedesc").html("Avec l'échelle <b>absolue</b>, la longueur des barres est indépendente du thème.")
	d3.selectAll("#page2").selectAll(".selected").classed("selected",0);
	d3.select(this).classed("selected",1);
	scalemode=1;
	updateC();
});

// we also have a dropdown menu.
// and yes there could have been one function to handle all menus with parameters. But this works. 

var menuopen3=0;

d3.select(".dropdown.c3 dd ul").selectAll("li").data(criteres).enter()
	.append("li").append("a").html(function(d) {return d.long;}).attr("href","#");
d3.selectAll(".dropdown.c3 dt a span").html(criteres[critS].long);

d3.selectAll(".dropdown.c3 dt a").on("click",function(d) {
	menuopen3=1-menuopen3;
	d3.selectAll(".dropdown.c3 dd ul").style("display",function() {return menuopen3?"block":"none";})
})

d3.selectAll(".dropdown.c3 dd ul li a").on("click",function(d,i) {
	var text=d3.select(this).html();d3.selectAll(".dropdown.c3 dt a span").html(text);
	menuopen3=0;
	d3.selectAll(".dropdown.c3 dd ul ").style("display","none");
	critS=i;
	updateC();
})

// this will be the scale of the bar chart.
var bScale=d3.scale.linear().domain([0,.6]).range([0,675])

// this *Pos variable is an interesting concept.
// the data for the chart is in its original order. But the _position_ of each bar doesn't correspond to the position of the corresponding
// data element in the dataset. The chart is sorted by value and will be reorganized each time the selection is updated.
// so here catPos captures the position of the bar corresponding to each data point so they can effectively move from their current
// location to the next, and not have to move instantly, or disappear in the meantime.

var catPos=categories.map(function(d,i) {return i;})

// this adds behavior to some links on the page. could have been done in the HTML section but hey.

page2.select(".l1").select("a").on("click",initPage3);
page2.select(".l2").select("a").on("click",initPage1);

// first we remove all labels

d3.select("#page2").selectAll(".labels").remove();

// now we are going to derive the data we are going to use for the bars and set up that catPos variable as described above.

var barData=categories.map(function(cat,i) {return {id:i,long:cat.long,short:cat.short,score:cat.timeLineAgg[critS]};media:cat.media});
barData.sort(function(a,b) {return b.score-a.score;});
barData.forEach(function(d,i) {catPos[d.id]=i;});
barData.sort(function(a,b) {return a.id-b.id;});

bScale.domain([0,d3.max(barData,function(d) {return d.score;})]);

// We will create a dynamic x-axis with ticks, which will change if there is a change to how the scale works.

var xAxis=svg.append("svg:g").attr("width",675).attr("height",30).classed("xAxis",1).attr("transform","translate(260,180)");
xAxis.append("svg:line").attr("x1",0).attr("x2",675).attr("y1",0).attr("y2",0).style("stroke","#000");
var ticks=xAxis.selectAll(".ticks").data(d3.range(10).map(function(d) {return d/10;})).enter().append("svg:g").classed("ticks",1);
ticks.attr("transform", function(d) {return "translate("+bScale(d)+",0)";});
ticks.append("svg:line").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",5).style("stroke","#000");
ticks.append("svg:text").attr("x",0).attr("y",20).attr("text-anchor","middle").text(function(d) {return (d*100)+"%";})
	.style("fill","#ccc");

// We add a legend too.

xAxis.append("svg:text").attr("y",-10).attr("x",-4).text("Mentions de mots-clé de ce sujet, en pourcentage de toutes les mentions de mots-clés").style("font-style","italic").style("fill","#ccc");

// then the main chart.

var chart=svg.append("svg:g").classed("chart",1).attr("transform", "translate(260,220)").attr("width",680);
var bars=chart.selectAll(".bars").data(barData).enter().append("svg:rect")
	.attr("transform", function(d,i) {return "translate(0,"+30*catPos[i]+")";})
	.style("fill",function(d,i) {return categories[i].media?d3.hsl("darkorange").darker():"darkorange";})// criteres[critS].color;})
	.attr("height","20px").attr("width","0px")
	.on("click", function(d,i) {useTweetr(PT.filter(function(t) {return (t.score[criteres[critS].short])&&(t.category==categories[i].short);}));})
	// yes: with click action.
	;

// we add sparklines. It can be used to go back to the original view since it's time-based, so it makes sense.

var slyScale=d3.scale.linear().range([0,-15]).domain([0,d3.max(categories, function(c) {return d3.max(c.timeLineSN[critS]);})]);
var areaSL=d3.svg.area().interpolate("linear").x(function(d,i) {return 2*i;}).y1(function(d) {return slyScale(d);})
var sparkRect=chart.selectAll(".sr").data(categories).enter().append("svg:rect").classed("sr",1)
	.attr("width","88").attr("height",15).style("fill","#eee").attr("y",-15)
	.attr("transform", function(d,i) {return "translate(-110,"+(17+30*catPos[i])+")";}).style("cursor","pointer");
var sparklines=chart.selectAll(".sl").data(categories).enter().append("svg:path").classed("sl",1)
	.attr("d",function() {return areaSL(days.map(function() {return 0;}));})
	.attr("transform", function(d,i) {return "translate(-110,"+(17+30*catPos[i])+")";})
	.style("stroke","black")
	.style("fill","none")
	.style("fill","#ccc")//.style("opacity",.2);
	.style("stroke-width","1px").style("cursor","pointer");

// and indeed, clicking on the sparklines takes the user to the time page. we will compare the account corresponding to the clicked sparkline
// with whatever there was.

sparklines.on("click",function(d,i) {cat1=i;initPage1();})
sparkRect.on("click",function(d,i) {cat1=i;initPage1();})

// now we add those labels. Labels too will move with the *Pos system.

var labels=page2.selectAll(".labels").data(categories).enter().append("div").classed("labels",1);
labels.style("position","absolute")
		.style("top",function(d,i) {return (221+catPos[i]*30)+"px";})
		.style("left","30px")
	.append("a")
		.attr("href","#")
		.on("mouseover",function(d) {d3.select(this).style("text-decoration","underline")
			.style("color",function() {return d3.hsl("steelblue").brighter();})
		;})
		.on("mouseout",function() {d3.select(this).style("text-decoration","none")
			.style("color","steelblue");
		})
		.on("click",function(d,i) {cat3=i;initPage3();})
		.html(function(d) {return d.long;})

	page2.select(".nomCritere").html(criteres[critS].long);
	page2.select(".abstractCritere").html(
	criteres[critS].abstract
	)

// finally this function will update the "shell" we created with data.

updateC();

function updateC() {
	var duration=1000;
	page2.select(".nomCritere").html(criteres[critS].long);
	page2.select(".abstractCritere").html(
	criteres[critS].abstract
	)
	
	// This will change the data if needs be, so it can be resorted.
	
	barData=categories.map(function(cat,i) {return {id:i,long:cat.long,short:cat.short,score:cat.timeLineAgg[critS]};});
	barData.sort(function(a,b) {return b.score-a.score;});
	barData.forEach(function(d,i) {catPos[d.id]=i;})
	barData.sort(function(a,b) {return a.id-b.id;});
	bScale.domain([0,scalemode?1:d3.max([0.1,d3.max(barData,function(d) {return d.score;})])]);
	
	// and now we move everything, either growing from scratch, or transitioning from where they were.
	
	bars.data(barData).transition()
		.attr("width", function(d) {return bScale(d.score)+"px";})
		.attr("transform", function(d,i) {return "translate(0,"+25*catPos[i]+")";})
		.duration(duration);
	labels.transition().style("top", function(d,i) {return (221+catPos[i]*25)+"px";}).duration(1000);
	slyScale=d3.scale.linear().range([0,-15]).domain([0,d3.max(categories, function(c) {return d3.max(c.timeLineSN[critS]);})]);
	sparklines.transition()
		.attr("d",function(d) {return areaSL(d.timeLineSN[critS]);})
		.attr("transform", function(d,i) {return "translate(-110,"+(17+25*catPos[i])+")";}).duration(duration);
	sparkRect.transition()
		.attr("transform", function(d,i) {return "translate(-110,"+(17+25*catPos[i])+")";}).duration(duration);
	
	// ticks move too, if the axis changed.
	
	ticks.transition()
		.attr("transform", function(d) {return "translate("+bScale(d)+",0)";}).duration(duration);
}



}






/////////////////////////////////////////////////////////////////////////////
//
//	Functions for page 3 - candidate profile view
//
/////////////////////////////////////////////////////////////////////////////







function initPage3() {

// same as before. Clean, build, fill.

pageIdx=3;d3.select(".alwaysthere").selectAll("li").classed("selected",0);d3.select(".alwaysthere").selectAll("#li3").classed("selected",1);
d3.selectAll(".page").classed("invisible",1);
d3.select("#page3").classed("invisible",0);
var page3=d3.select("#page3");
d3.select("#page3").selectAll("svg").remove();
var svg=d3.select("#page3").append("svg:svg").attr("width",960).attr("height",765);

// menu handling.

var myCat=categories[cat3];

var menuopen4=0;

d3.select(".dropdown.c4 dd ul").selectAll("li").data(categories).enter()
	.append("li").append("a").html(function(d) {return d.long;}).attr("href","#");
d3.selectAll(".dropdown.c4 dt a span").html(categories[cat3].long);

d3.selectAll(".dropdown.c4 dt a").on("click",function(d) {
	menuopen4=1-menuopen4;
	d3.selectAll(".dropdown.c4 dd ul").style("display",function() {return menuopen4?"block":"none";})
})

d3.selectAll(".dropdown.c4 dd ul li a").on("click",function(d,i) {
	var text=d3.select(this).html();d3.selectAll(".dropdown.c4 dt a span").html(text);
	menuopen4=0;
	d3.selectAll(".dropdown.c4 dd ul ").style("display","none");
	cat3=i;
	updateC();
})

// this creates the representation of the tweets in volume of the account we look at. This is the same principle as in the 1st view (and much of 
// the same code, too :) )

var cTweets=d3.nest().key(function(d) {return d.day;}).rollup(function(d) {return d.length;}).map(categories[cat3].timeLine);
cTweets=days.map(function(d) {return cTweets[d]||0;})

var tlScale=d3.scale.linear().range([0,-35]).domain([0,d3.max(d3.values(cTweets))]);

var areaTl=d3.svg.area().interpolate("linear").x(function(d,i) {return 15*i;}).y1(function(d) {return tlScale(d);})

var tl=svg.append("svg:g").classed("tl",1).attr("transform","translate(260,190)").attr("height",40).attr("width",675);
tl.append("svg:rect").attr("x",0).attr("y",-40).attr("height",40).attr("width",675).style("fill","#eee").on("click",function() {cat1=cat3;initPage1();}).style("cursor","pointer");

var tlP=tl.append("svg:path").attr("d",function() {return areaTl(cTweets);}).style("stroke","#000").style("fill","#ccc").on("click",function() {cat1=cat3;initPage1();}).style("cursor","pointer");
tl.selectAll("line").data(days).enter().append("svg:line")
	.attr("x1",function(d,i) {return i*15;}).attr("x2",function(d,i) {return i*15;})
	.attr("y1",0).attr("y2",-40)
	.style("stroke",function(d) {return (d.split("-")[2]==1)?"black":"white";}).style("stroke-width",1).style("stroke-opacity",.5)


var d0=days[0].split("-");if(d0[2]>15&&d0[2]<27){
	tl.append("svg:text").attr("x",0).attr("y",-5).text(function() {return month[d0[1]];}).classed("axismonth",1)
}
if(d0[2]<=15){
	tl.append("svg:text").attr("x",function() {return (d0[2]-15)*15;}).attr("y",-5).text(function() {return month[d0[1]];}).classed("axismonth",1)
}

var d2=days[44].split("-");if(d2[2]>4&&d2[2]<15){
	tl.append("svg:text").attr("x",660).attr("y",-5).text(function() {return month[d2[1]];}).attr("text-anchor","end").classed("axismonth",1);
}
if(d2[2]>=15){
	tl.append("svg:text").attr("x",function() {return (days.indexOf([d2[0],d2[1],15].join("-"))*15);}).attr("y",-5).text(function() {return month[d2[1]];}).classed("axismonth",1)
}
if(d2[1]-d0[1]==2){
	tl.append("svg:text").attr("x",function() {return (days.indexOf([d2[0],d2[1]-1,15].join("-"))*15);}).attr("y",-5).text(function() {return month[d2[1]-1];}).classed("axismonth",1)
}

// we are going to use the same *Pos approach as in the previous view to reorder categories if needs be.

var critPos=criteres.map(function(d,i) {return i;})
var critData=criteres.map(function(d,i) {return {id:i,val:categories[cat3].timeLineAgg[i]};})

var rScale=d3.scale.linear().range([0,380]).domain([0,d3.max(categories[cat3].timeLineAgg)]);
var chart=svg.append("svg:g").classed("chart",1).attr("transform", "translate(530,250)").attr("width",430).attr("height",400);

var xAxis=svg.append("svg:g").attr("width",430).attr("height",30).classed("xAxis",1).attr("transform","translate(530,225)");
xAxis.append("svg:line").attr("x1",0).attr("x2",380).attr("y1",0).attr("y2",0).style("stroke","#000");
var ticks=xAxis.selectAll(".ticks").data(d3.range(10).map(function(d) {return d/10;})).enter().append("svg:g").classed("ticks",1);
ticks.attr("transform", function(d) {return "translate("+rScale(d)+",0)";});
ticks.append("svg:line").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",5).style("stroke","#000");
ticks.append("svg:text").attr("x",0).attr("y",20).attr("text-anchor","middle").text(function(d) {return (d*100)+"%";})
	.style("fill","#ccc");


var bars=chart.selectAll(".bars").data(critData).enter().append("svg:rect").classed("bars",1)
	.attr("transform", function(d,i) {return "translate(0,"+30*critPos[i]+")";})
	.style("fill",
	//function(d) {return d.color;}
	"darkorange"
	)
	.style("stroke",
	"none"
	//function(d) {return d3.hsl(d.color).darker();}
	)
	.attr("height","20").attr("width","0")
	.on("click", function(d,i) {useTweetr(PT.filter(function(t) {return (t.score[criteres[i].short])&&(t.category==categories[cat3].short);}));})
;
	
var bars2=chart.selectAll(".bars2").data(critData).enter().append("svg:rect").classed("bars2",1)
	.attr("transform", function(d,i) {return "translate(0,"+(16+30*critPos[i])+")";})
	.style("fill","#000")//.style("opacity",.5)
	.style("stroke","none")
	//.style("stroke","#fff").style("stroke-opacity",.2)
	.attr("height","4").attr("width","0");
var legend=chart.append("svg:g").attr("transform","translate(0,320)")
	legend.append("svg:rect").attr("x",0).attr("y",0).attr("width",20).attr("height",20).style("fill","darkorange");
var textL=legend.append("svg:text").attr("x",25).attr("y",15).text(function() {return categories[cat3].long;})
	legend.append("svg:line").attr("x1",200).attr("x2",220).attr("y1",18).attr("y2",18).style("stroke-width",4).style("stroke","black")
	legend.append("svg:text").attr("x",225).attr("y",15).text("Moyenne")
	
// labels creation and management identical to previous view (with different data of course).

var labels=page3.selectAll(".labels").data(criteres).enter().append("div").classed("labels",1);
labels.style("position","absolute")
		.style("top",function(d,i) {return (251+critPos[i]*30)+"px";})
		.style("left","410px")
	.style("width", "110px")
	.append("a")
		.style("float","right")
		.attr("href","#")
		.on("mouseover",function(d) {d3.select(this).style("text-decoration","underline")
			.style("color",function(d) {return d.color;})
		;})
		.on("mouseout",function() {d3.select(this).style("text-decoration","none")
			.style("color","steelblue");
		})
		.on("click",function(d,i) {critS=i;initPage2();})
		.html(function(d) {return d.long;})

// and we initiate the data.
	
updateC();	

function updateC() {
	// duration managed centrally for all transitions.
	var duration=1000;
	
	// some data is recomputed, scales can be updated too.
	var avgScores=criteres.map(function(d,i) {return d3.mean(categories, function(c) {return c.timeLineAgg[i];});})
	rScale=d3.scale.linear().range([0,380]).domain([0,d3.max([d3.max(avgScores),d3.max(categories[cat3].timeLineAgg)])]);
	
	// re-sorting of bar chart data so that it can appear sorted.
	
	critData=criteres.map(function(d,i) {return {id:i,val:categories[cat3].timeLineAgg[i]};});
	critData.sort(function(a,b) {return b.val-a.val;})
	critData.forEach(function(d,i) {critPos[d.id]=i;})
	critData.sort(function(a,b) {return a.id-b.id;})

	// account information updated.
	
	page3.select(".cand3").attr("src",function() {return "./profilepics/"+categories[cat3].img;})
	page3.select(".nomCat").html(function() {return categories[cat3].long;})
	page3.select(".abstractCat").html(function() {return categories[cat3].abstract;})
	
	// text analytics pages filled.
	
	/*page3.select(".most").html(
			"<strong>Mots seuls :</strong></br>"+
			NLP[categories[cat3].short].mostf+
			"</br><strong>Bigrammes :</strong></br>"+
			NLP[categories[cat3].short].bigrams
		)*/
		
	var most=page3.select(".most")
	most.html("")
	most.append("span").html("<strong>Mots seuls :</strong>")
	most.selectAll(".seuls").data(NLP[categories[cat3].short].mostf.split(", ")).enter().append("a").classed("kw",1).classed("seuls",1)
		.html(function(d,i) {return d+((i)<NLP[categories[cat3].short].mostf.length?", ":"");})
		.style("cursor","pointer")
	most.append("span").html("</br><strong>Bigrammes :</strong>")
	most.selectAll(".bigrammes").data(NLP[categories[cat3].short].bigrams.split(", ")).enter().append("a").classed("kw",1).classed("bigrammes",1)
		.html(function(d,i) {return d+((i)<NLP[categories[cat3].short].mostf.length?", ":"");})
		.style("cursor","pointer")
	most.selectAll(".kw").on("click", function(d) {useTweetr (PT.filter(function(t) {return t.category==categories[cat3].short&&t.text.toLowerCase().indexOf(d.toLowerCase())>-1;}));})
		
		
	var unique=page3.select(".unique")
	unique.html("")
	//unique.append("span").html("<strong>Mots uniques :</strong>")
	unique.selectAll(".uniques").data(NLP[categories[cat3].short].unique.split(" ")).enter().append("a").classed("kw",1).classed("uniques",1)
		.html(function(d,i) {return d+((i)<NLP[categories[cat3].short].unique.length?", ":"");})
		.style("cursor","pointer")
	unique.selectAll(".kw").on("click", function(d) {console.log(d);useTweetr (PT.filter(function(t) {return t.category==categories[cat3].short&&t.text.toLowerCase().indexOf(d.toLowerCase())>-1;}));})

	
	// tweet volume chart filled.
	
	cTweets=d3.nest().key(function(d) {return d.day;}).rollup(function(d) {return d.length;}).map(categories[cat3].timeLine);
	cTweets=days.map(function(d) {return cTweets[d]||0;})
	tlScale=d3.scale.linear().range([0,-35]).domain([0,d3.max(d3.values(cTweets))]);
	tlP.transition()
		.attr("d",function() {return areaTl(cTweets);})
		.duration(duration);
	
	// bar chart transitions
	
	bars.transition()
		.attr("width",function(d,i) {return rScale(categories[cat3].timeLineAgg[i])})
		.attr("transform", function(d,i) {return "translate(0,"+30*critPos[i]+")";})
		.duration(duration);
	bars2.transition()
		.attr("width",function(d,i) {return rScale(avgScores[i])})
		.attr("transform", function(d,i) {return "translate(0,"+(16+30*critPos[i])+")";})
		.duration(duration);
	labels.transition()
		.style("top",function(d,i) {return (251+critPos[i]*30)+"px";})
		.duration(duration);
	
	// and axis...
	
	ticks.transition()
		.attr("transform", function(d) {return "translate("+rScale(d)+",0)";})
		.style("visibility",function(d) {return rScale(d)>400?"hidden":"visible";})
		.duration(duration);
	
	// and legend.
	
	textL.text(categories[cat3].long);
}


}






/////////////////////////////////////////////////////////////////////////////
//
//	Functions for page 4 - who bashes who?
//
/////////////////////////////////////////////////////////////////////////////







function initPage4() {
pageIdx=4;d3.select(".alwaysthere").selectAll("li").classed("selected",0);d3.select(".alwaysthere").selectAll("#li4").classed("selected",1);
d3.selectAll(".page").classed("invisible",1);
d3.select("#page4").classed("invisible",0);
var page4=d3.select("#page4");
d3.select("#page4").selectAll("svg").remove();
var svg=d3.select("#page4").append("svg:svg").attr("width",960).attr("height",765);



var PTA=PT.filter(function(t) {return t.attacks;})
PTA=PTA.filter(function(t) {return d3.max(t.attacks);})
PTA=PTA.filter(function(t) {return !t.attacks[camp[t.account]];})

var matrix=d3.range(6).map(function(c) {return d3.range(6).map(function(r) {return PTA.filter(function(t) {return (camp[t.account]==c)&&(t.attacks[r]);}).length;});})

var maxMatrix=d3.max(matrix,function(c) {return d3.max(c);})

var  acScale=d3.scale.linear().domain([0,maxMatrix]).range(["white","red"]);
var  arScale=d3.scale.linear().domain([0,maxMatrix^2]).range([0,25]);

var  axScale=d3.scale.linear().domain([0,5]).range([0,300]);
var ayScale=d3.scale.linear().domain([0,5]).range([0,250]);

var attackers=d3.range(6).map(function(i) {return {key: String(i), values:[]};})
PTA.forEach(function(t) {attackers[camp[t.account]].values.push(t);})


var victims=d3.range(6).map(function(i) {return {key: String(i), values:[]};})
PTA.forEach(function(t) {t.attacks.forEach(function(a,i) {if (a) {victims[i].values.push(t);}});})

c23xScale=d3.scale.linear().domain([0,d3.max([d3.max(attackers,function(d) {return d.values.length;}),d3.max(victims,function(d) {return d.values.length;})])]).range([0,180])
c23yScale=d3.scale.linear().domain([0,5]).range([0,150])

// This creates a matrix where the color of each square corresponds to the intensity of the attacks by one candidate on another one.

var chart=svg.append("svg:g").classed("chart",1).attr("transform", "translate(260,220)").attr("width",680);
chart.append("svg:rect").attr("width",360).attr("height",300).style("fill","none").style("stroke","white").transition().duration(1000).style("stroke","#ccc");
var column=chart.selectAll(".column").data(d3.range(6)).enter().append("svg:g")
	.attr("transform", function(d) {return "translate("+axScale(d)+",0)";})
	.classed("column",1)
var row=column.selectAll(".row").data(function(c) {return d3.range(6).map(function(r) {return [c,r];});}).enter().append("svg:g")
	.attr("transform", function(d) {return "translate(0,"+ayScale(d[1])+")";})
	.classed("row",1)

// that can be unselected to use circles instead of squares in the matrix, but squares do work better.

//var circle=row.append("svg:circle").attr("cx",25).attr("cy",25).attr("r",function(d) {return arScale(matrix[d[0]][d[1]]^2);})
//	.style("fill",function(d) {return acScale(matrix[d[0]][d[1]]);})
//	.style("cursor","pointer")

//var circle=row.append("svg:circle").attr("cx",25).attr("cy",25).attr("r",function(d) {return arScale(matrix[d[0]][d[1]]);}).attr("stroke","red")
var rect=row.append("svg:rect").attr("x",1).attr("y",1).attr("width",(300/5)-2).attr("height",(250/5)-2).attr("stroke","none")
	.on("click", function(d) {useTweetr(PTA.filter(function(t) {return (camp[t.account]==d[0])&&(t.attacks[d[1]]);}));})
	.attr("fill","white").transition().duration(1000)
	.attr("fill",function(d) {return acScale(matrix[d[0]][d[1]]);})
	

// this is for the 2 bar charts on the right. Nothing new. Those are left unsorted.

var chart2=svg.append("svg:g").classed("chart2",1).attr("transform", "translate(740,78)").attr("width",200);
var gridAttack=chart2.selectAll(".gridA").data(attackers).enter().append("svg:g").classed(".gridA",1)
	.attr("transform",function(d,i) {return "translate(0,"+c23yScale(i)+")";})
	var rectAttack=gridAttack.append("svg:rect").attr("x",0).attr("y",0).attr("height",20)
		.style("fill","darkorange")
		.style("cursor","pointer")
		.on("click", function(d,i) {useTweetr(PTA.filter(function(t) {return camp[t.account]==i;}));})
		.attr("width",0)
		.transition().duration(1000)
		.attr("width",function(d) {return c23xScale(d.values.length);})
		
gridAttack.append("svg:text").attr("x",-20).attr("y",15).attr("text-anchor","end").text(function(d,i) {return camps[i];})
chart2.append("svg:text").attr("y",-20).text("Attaques envoyées par :").style("font-weight","bold").style("font-size","14px")
var chart3=svg.append("svg:g").classed("chart3",1).attr("transform", "translate(740,350)").attr("width",200);
	var gridVictim=chart3.selectAll(".gridV").data(victims).enter().append("svg:g").classed(".gridV",1)
	.attr("transform",function(d,i) {return "translate(0,"+c23yScale(i)+")";})
	var rectVictim=gridVictim.append("svg:rect").attr("x",0).attr("y",0).attr("height",20)
		.style("fill","darkorange")
		.style("cursor","pointer")
		.on("click", function(d,i) {useTweetr(PTA.filter(function(t) {return t.attacks[i];}));})
		.attr("width",0)
		.transition().duration(1000)
		.attr("width",function(d) {return c23xScale(d.values.length);})
	gridVictim.append("svg:text").attr("x",-20).attr("y",15).attr("text-anchor","end").text(function(d,i) {return camps[i];})
chart3.append("svg:text").attr("y",-20).text("Attaques contre :").style("font-weight","bold").style("font-size","14px")


}







/////////////////////////////////////////////////////////////////////////////
//
//	Functions for page 5 - who said what?
//
/////////////////////////////////////////////////////////////////////////////







function initPage5() {
pageIdx=5;d3.select(".alwaysthere").selectAll("li").classed("selected",0);d3.select(".alwaysthere").selectAll("#li5").classed("selected",1);
d3.selectAll(".page").classed("invisible",1);
d3.select("#page5").classed("invisible",0);
var page5=d3.select("#page5");
d3.select("#page5").selectAll("svg").remove();
var svg=d3.select("#page5").append("svg:svg").attr("width",960).attr("height",765);


// This is the representation of tweet volumes per day. Same as on page 1.

var xAxis=svg.append("svg:g").classed("xAxis",1).attr("transform","translate(260,180)").attr("height",50).attr("width",675);
	xAxis.append("svg:rect").style("fill","#eee").attr("x",0).attr("y",-50).attr("height",50).attr("width",675);

xAxis.append("svg:path").attr("d",function() {return areaD(tpd);}).style("stroke","#000").style("fill","#ccc").style("opacity",.2);
xAxis.selectAll("line").data(days).enter().append("svg:line")
	.attr("x1",function(d,i) {return i*15;}).attr("x2",function(d,i) {return i*15;})
	.attr("y1",0).attr("y2",-50)
	.style("stroke",function(d) {return (d.split("-")[2]==1)?"black":"white";}).style("stroke-width",1).style("stroke-opacity",.5)

// This is a bit of a hack to represent separation between months in that view. Let's just say it does the trick 

var d0=days[0].split("-");if(d0[2]>15&&d0[2]<27){
	xAxis.append("svg:text").attr("x",0).attr("y",-5).text(function() {return month[d0[1]];}).classed("axismonth",1)
}
if(d0[2]<=15){
	xAxis.append("svg:text").attr("x",function() {return (d0[2]-15)*15;}).attr("y",-5).text(function() {return month[d0[1]];}).classed("axismonth",1)
}

var d2=days[44].split("-");if(d2[2]>4&&d2[2]<15){
	xAxis.append("svg:text").attr("x",660).attr("y",-5).text(function() {return month[d2[1]];}).attr("text-anchor","end").classed("axismonth",1);
}
if(d2[2]>=15){
	xAxis.append("svg:text").attr("x",function() {return (days.indexOf([d2[0],d2[1],15].join("-"))*15);}).attr("y",-5).text(function() {return month[d2[1]];}).classed("axismonth",1)
}
if(d2[1]-d0[1]==2){
	xAxis.append("svg:text").attr("x",function() {return (days.indexOf([d2[0],d2[1]-1,15].join("-"))*15);}).attr("y",-5).text(function() {return month[d2[1]-1];}).classed("axismonth",1)
}

// now let's make this clickable. we place almost transparent (but clicakble) rectangles over there so people can see all tweets of that day.
xAxis.selectAll(".days").data(days).enter().append("svg:rect").classed("days",1)
	.attr("x",function(d,i) {return i*15;}).attr("y",-50).attr("width",15).attr("height",50)
	.style("stroke","none")
	.style("fill","white").style("opacity",0.01).style("cursor","pointer")
	.on("click",function(d) {
		xAxis.selectAll(".days").transition().style("fill","white").style("opacity",0.01);
		d3.select(this).transition().style("fill","darkorange").style("opacity",".5");
		useTweetr(PT.filter(function(t) {return t.day==d;}));})





var labels=page5.selectAll(".labels").data(categories).enter().append("div").classed("labels",1);
labels.style("position","absolute")
		.style("top",function(d,i) {return (221+i*25)+"px";})
		.style("left","100px")
		.style("width","150px")
		
	.append("a")
		.attr("href","#")
		.style("float","right")
		.on("mouseover",function(d) {d3.select(this).style("text-decoration","underline")
			.style("color",function() {return d3.hsl("steelblue").brighter();})
		;})
		.on("mouseout",function() {d3.select(this).style("text-decoration","none")
			.style("color","steelblue");
		})
		.on("click",function(d,i) {cat3=i;initPage3();})
		.html(function(d) {return d.long;})

var grey=svg.selectAll(".grey").data(categories).enter().append("svg:rect").classed("grey",1)
	.attr("x",260).attr("y",function(d,i) {return 221+i*25;})
	.attr("width",675).attr("height",20)
	.style("fill","#ccc").style("stroke","none");
	
var ticks;
var button=d3.selectAll(".searchb");
button.on("click",search)

function search() {
	var duration=1000;
	var searchTerm=d3.selectAll(".search").property("value").toLowerCase();
	if (searchTerm=="") {svg.selectAll("line").remove();}
	else {	svg.selectAll("line").remove();
		var searchPT=PT.filter(function(t) {return t.text.toLowerCase().indexOf(searchTerm)>-1&&t.secs<3888000000;})
		ticks=svg.selectAll("line").data(searchPT).enter().append("svg:line")
			.style("stroke","darkorange").style("stroke-width",2).style("cursor","pointer")
			.attr("x1",function(d) {return 260+xTicks(d.secs);}) // and why 305 and not 260, your guess is as good as mine.
			.attr("x2",function(d) {return 260+xTicks(d.secs);})
			.attr("y1",function(d) {return 241+categoriesHash[d.category]*25;})
			.attr("y2",function(d) {return 241+categoriesHash[d.category]*25;});
		ticks.on("click", function(d) {
			xAxis.selectAll(".days").transition().style("fill","white").style("opacity",0.01);
			useTweet(d,1);
		});
		ticks.transition().duration(duration).attr("y1",function(d) {return 221+categoriesHash[d.category]*25;});
	}
}




}









// this is for controlling that the scores are ok, they are not used directly in the code but useful to keep around for troubleshooting

//matrix=categories.map(function(cat) {return criteres.map(function(c,i) {return d3.sum(cat.timeLineS[i]);});})
//matrix=matrix.map(function(cat) {return cat.map(function(d) {return d/d3.sum(cat);});})

