function inscrits(d) {return d.EXG+d.SOC+d.UMP+d.AUT+d.ECO+d.DVD+d.DVG+d.M+d.EXD+d.MODM+d.RDG+d.ABS+d.PG+d["M-NC"]+d.NUL+d.COM+d.REG+d.FN+d.VEC;}
function gauche(d) {return d.EXG+d.SOC+d.DVG+d.RDG+d.PG+d.COM+d.VEC;}
function droite(d) {return d.M+d.UMP+d["M-NC"]+d.DVD;}
function ed(d) {return d.FN+d.EXD;}
function autres(d) {return d.NUL+d.AUT+d.MODM+d.REG;}

votes.forEach(function(d) {return d.inscrits=inscrits(d);})
votes.forEach(function(d) {return d.gauche=gauche(d);})
votes.forEach(function(d) {return d.droite=droite(d);})
votes.forEach(function(d) {return d.ed=ed(d);})
votes.forEach(function(d) {return d.autres=autres(d);})
var deptNames={"001":"Ain","002":"Aisne","003":"Allier","004":"Alpes-de-Haute-Provence","005":"Hautes-Alpes","006":"Alpes-Maritimes","007":"Ardèche","008":"Ardennes","009":"Ariège","010":"Aube","011":"Aude","012":"Aveyron","013":"Bouches-du-Rhône","014":"Calvados","015":"Cantal","016":"Charente","017":"Charente-Maritime","018":"Cher","019":"Corrèze","02A":"Corse-du-Sud","02B":"Haute-Corse","021":"Côte-d'Or","022":"Côtes-d'Armor","023":"Creuse","024":"Dordogne","025":"Doubs","026":"Drôme","027":"Eure","028":"Eure-et-Loir","029":"Finistère","030":"Gard","031":"Haute-Garonne","032":"Gers","033":"Gironde","034":"Hérault","035":"Ille-et-Vilaine","036":"Indre","037":"Indre-et-Loire","038":"Isère","039":"Jura","040":"Landes","041":"Loir-et-Cher","042":"Loire","043":"Haute-Loire","044":"Loire-Atlantique","045":"Loiret","046":"Lot","047":"Lot-et-Garonne","048":"Lozère","049":"Maine-et-Loire","050":"Manche","051":"Marne","052":"Haute-Marne","053":"Mayenne","054":"Meurthe-et-Moselle","055":"Meuse","056":"Morbihan","057":"Moselle","058":"Nièvre","059":"Nord","060":"Oise","061":"Orne","062":"Pas-de-Calais","063":"Puy-de-Dôme	64 Pyrénées-Atlantiques","065":"Hautes-Pyrénées","066":"Pyrénées-Orientales","067":"Bas-Rhin","068":"Haut-Rhin","069":"Rhône","070":"Haute-Saône","071":"Saône-et-Loire","072":"Sarthe","073":"Savoie","074":"Haute-Savoie","075":"Paris","076":"Seine-Maritime","077":"Seine-et-Marne","078":"Yvelines","079":"Deux-Sèvres","080":"Somme","081":"Tarn","082":"Tarn-et-Garonne","083":"Var","084":"Vaucluse","085":"Vendée","086":"Vienne","087":"Haute-Vienne","088":"Vosges","089":"Yonne","090":"Territoire de Belfort","091":"Essonne","092":"Hauts-de-Seine","093":"Seine-Saint-Denis","094":"Val-de-Marne","095":"Val-d'Oise","971":"Guadeloupe","972":"Martinique","973":"Guyane","974":"La Réunion","976":"Mayotte"};
partis=["EXG","COM","PG","SOC","RDG","DVG","VEC","ECO","REG","AUT","MODM","M-NC","M","UMP","DVD","FN","EXD","NUL","ABS"]
partisDetails={
	EXG:{nom:"Extrême gauche", color:"red"},
	COM:{nom:"Communistes", color:"firebrick"},
	PG:{nom:"Parti de Gauche", color:"crimson"},
	SOC:{nom:"Parti socialiste", color:"lightcoral"},
	RDG:{nom:"Radicaux de gauche", color:"yellow"},
	DVG:{nom:"Divers gauche", color:"pink"},
	VEC:{nom:"Verts, Europe écologie", color:"limegreen"},
	ECO:{nom:"Écologistes", color:"green"},
	REG:{nom:"Régionalistes", color: "saddlebrown"},
	AUT:{nom:"Autres", color: "grey"},
	MODM:{nom:"MODEM", color: "gold"},
	"M-NC":{nom:"Majorité présidentielle", color: "mediumblue"},
	M:{nom:"Autres candidats majorité présidentielle", color: "blue"},
	UMP:{nom:"Union pour un Mouvement Populaire", color:"royalblue"},
	DVD:{nom:"Divers droite", color:"steelblue"},
	FN:{nom:"Front National", color: "skyblue"},
	EXD:{nom:"Extrême droite", color: "sienna"},
	NUL:{nom:"Blanc ou nul", color: "gainsboro"},
	ABS:{nom:"Abstention", color: "navajowhite"}}


deptInscrits=pv.nest(votes).key(function(d) {return d.depId;}).rollup(function(d) {return pv.sum(d, function(x) {return x.inscrits;});})
deptGauche=pv.nest(votes).key(function(d) {return d.depId;}).rollup(function(d) {return pv.sum(d, function(x) {return x.gauche;});})
deptDroite=pv.nest(votes).key(function(d) {return d.depId;}).rollup(function(d) {return pv.sum(d, function(x) {return x.droite;});})
deptEd=pv.nest(votes).key(function(d) {return d.depId;}).rollup(function(d) {return pv.sum(d, function(x) {return x.ed;});})
deptAutres=pv.nest(votes).key(function(d) {return d.depId;}).rollup(function(d) {return pv.sum(d, function(x) {return x.autres;});})
deptAbs=pv.nest(votes).key(function(d) {return d.depId;}).rollup(function(d) {return pv.sum(d, function(x) {return x.ABS;});})

deptPartis=partis.map(
	function(p) {
		return pv.nest(votes)
			.key(function(d) {return d.depId;})
			.rollup(function(d) {return pv.sum(d, function(x) {return x[p];});})
		;});


departements=codes.map(function(d) {return {code:d, centroid: centroids[d], borders: borders[d],
	inscrits: deptInscrits[right3(d)],
	gauche: deptGauche[right3(d)],
	droite: deptDroite[right3(d)],
	ed: deptEd[right3(d)],
	autres: deptAutres[right3(d)],
	abs: deptAbs[right3(d)]
	}
	;})

var w=600,h=600;
var sd=-1;
//var pan=new pv.Panel().width(w).height(h);
var vis=new pv.Panel()
	.width(h)
	.height(h)
	.fillStyle("white")
	.canvas("protovis")
;
var i=0;
var mapMargin = 30;

var scale = pv.Geo.scale()
    .domain({lng: 60, lat: -10}, {lng: 30, lat: 20})
    .range({x: mapMargin, y: mapMargin}, {x: w-mapMargin, y: h-mapMargin});

var legendMargin = 20,
    ease = null;

var numToRad = function(n) {
  return Math.sqrt(n)/45;//45;
};

var nodes = [],
    codeToNode = [],
    links = []
    nodesInit=[];


// nodes - sizing & positioning
departements.forEach(function(d) {
  var x = scale(d.centroid).x,
      y = scale(d.centroid).y,
      n = {x: x, y: y, p: {x: x, y: y}, r: numToRad(d.inscrits), code:d.code};
    nodes.push(n);
    nodesInit.push(n);
    codeToNode[d.code] = n;
});


// links
departements.forEach(function(d) {
    d.borders.forEach(function(b) {
      if (codeToNode[d.code] && codeToNode[b] && d.code < b) {
        var nodeA = codeToNode[d.code];
        var nodeB = codeToNode[b];
        links.push({sourceNode:nodeA, targetNode:nodeB, length:(nodeA.r + nodeB.r + 2)});
      }
    });
});
var sc=0;

function reinit() {
nodes.forEach(function(n,i) {n.x=nodesInit[i].x;n.y=nodesInit[i].y;n.p=nodesInit[i].p;});
i=0;
}

var collisionConstraint = pv.Constraint.collision(function(d) {return d.r + 1;}),
    positionConstraint = pv.Constraint.position(function(d) {return d.p;}),
    linkConstraint = pv.Force.spring(100).links(links);

var sim= pv.simulation(nodes)
    .constraint(collisionConstraint)
    .constraint(positionConstraint)
    .constraint(linkConstraint)
    .force(pv.Force.drag());

function right3(string) {var myString="00"+string;return myString.slice(myString.length-3,myString.length);}


var gauchedroite = pv.Scale.linear()
    .domain(0, 0.5, 1)
    .range("palevioletred", "snow", "mediumblue");

var extremedroite = pv.Scale.linear()
	.domain(0,0.2,0.5)
	.range("snow","darkkhaki","saddlebrown")

var abstention = pv.Scale.linear()
	.domain(0,0.5,1)
	.range("red","snow","springgreen")

vis.event("click", function() {sd=-1;vis.render();})

vis.add(pv.Dot)
    .data(nodes)
    .right(function(d) {return d.y;})
    .bottom(function(d) {return d.x;})
    .radius(function(d) {return d.r;})
    .fillStyle(function(d) {
    	depId=departements.filter(function(dep) {return dep.code==d.code;})[0];
    	if(sc==0){return gauchedroite(depId.droite/(depId.droite+depId.gauche));}
    	if(sc==1){return extremedroite(depId.ed/(depId.inscrits-depId.abs));}
    	if(sc==2){return abstention(depId.abs/depId.inscrits);}
    })
    .strokeStyle(null)
    .title(function(d) {
    	var text=deptNames[right3(d.code)]+" : ";
    	depId=departements.filter(function(dep) {return dep.code==d.code;})[0];
		if(sc==0){text+=(100*(depId.droite/(depId.droite+depId.gauche))).toFixed(1);}
		if(sc==1){text+=(100*(depId.ed/(depId.inscrits-depId.abs))).toFixed(1);}
    	if(sc==2){text+=(100*(depId.abs/depId.inscrits)).toFixed(1);}
    	text+="%";
    	return text;
    	}
    )
	.event("click", function(d) {sd=right3(d.code);vis.render();})

   .add(pv.Label)
    .text(function(d) {return d.code;})
    .visible(function(d) {return d.code!="75";})
    //.textStyle("#fee")
    .font(function(d) {return "bold " + (4*Math.log(d.r)).toFixed(0) + "px sans-serif";})
    .textAlign("center")
    .textBaseline("middle");

vis.add(pv.Panel)
	.data(pv.range(100))
	.top(550)
	.height(20).width(2)
	.left(function(d) {return 20+2*d;})
	.fillStyle(function(d) {
		if(sc==0) {return gauchedroite(d/100);} else
		if(sc==1) {return extremedroite(d/100);} else
		if(sc==2) {return abstention(d/100);}
	});

vis.add(pv.Label)
	.top(530)
	.textBaseline("top")
	.left(20)
	.text(function() {return ["Voix de droite en % des voix gauche-droite","Voix de l'extrême-droite", "Abstention"][sc];})
	;

vis.add(pv.Label)
	.top(570)
	.textBaseline("top")
	.left(20)
	.text("0%").textAlign("left");

vis.add(pv.Label)
	.top(570).textBaseline("top")
	.left(220)
	.text("100%").textAlign("right");

var partiScale=pv.Scale.linear()
	.domain(0,1)
	.range(0,100);

var smallP=vis.add(pv.Panel)
	.top(376)
	.left(450)
	.visible(function() {return sd!=-1;})
	.height(224).width(150)
	.fillStyle("#ccc");
smallP.add(pv.Label).top(1).left(5).textBaseline("top").text(function() {return sd.slice(1,3)+" "+deptNames[sd];})

var partyBars=smallP.add(pv.Panel).top(15).left(5).height(204).width(140).fillStyle("white")
		.add(pv.Bar)
			.data(partis.slice(0,17))
			.top(function() {return this.index*12;})
			.left(40)
			.height(10)
			.width(function(d) {return partiScale(deptPartis[this.index][""+sd]/(deptInscrits[sd]-deptAbs[sd]));})
			.fillStyle(function(d) {return partisDetails[d].color;})
			.title(function(d) {return partisDetails[d].nom;});

partyBars.anchor("left").add(pv.Label)
				.textAlign("right");
partyBars.anchor("right").add(pv.Label)
				.textAlign("left")
				.text(function(d) {return (100*deptPartis[this.index][""+sd]/(deptInscrits[sd]-deptAbs[sd])).toFixed(1);})
				.textStyle("#ccc")


ease = setInterval(function() {
  if (i++ > 140) {
    clearInterval(ease);
    ease = null;
  }
  sim.step();
  positionConstraint.alpha(Math.pow(.7, i + 2) + .03);
  linkConstraint.damping(Math.pow(.7, i + 2) + .03);
  vis.render();
}, 42);

vis.render();