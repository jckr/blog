var re="", sp=-1;
partisDetails={
	EXG:{nom:"Extrême gauche", color:"red", order:0},
	COM:{nom:"Communistes", color:"firebrick",order:1},
	PG:{nom:"Parti de Gauche", color:"crimson",order:2},
	SOC:{nom:"Parti socialiste", color:"lightcoral",order:3},
	RDG:{nom:"Radicaux de gauche", color:"yellow",order:4},
	DVG:{nom:"Divers gauche", color:"pink",order:5},
	VEC:{nom:"Verts, Europe écologie", color:"limegreen",order:6},
	ECO:{nom:"Écologistes", color:"green",order:7},
	REG:{nom:"Régionalistes", color: "saddlebrown",order:8},
	AUT:{nom:"Autres", color: "grey",order:9},
	MODM:{nom:"MODEM", color: "gold",order:10},
	"M-NC":{nom:"Majorité présidentielle", color: "mediumblue",order:11},
	M:{nom:"Autres candidats majorité présidentielle", color: "blue",order:12},
	UMP:{nom:"Union pour un Mouvement Populaire", color:"royalblue",order:13},
	DVD:{nom:"Divers droite", color:"steelblue",order:14},
	FN:{nom:"Front National", color: "skyblue",order:15},
	EXD:{nom:"Extrême droite", color: "sienna",order:16}
};
partis=pv.keys(partisDetails);
partiScore={"EXG":-5, "COM":-5, "PG":-5, "SOC":-2, "RDG":-1, "DVG":-3, "VEC":-4, "ECO":-1, "REG":0, "AUT":0, "MODM":1, "M-NC":3, "M":3, "UMP":3, "DVD":3, "FN":5, "EXD":5}


candidats.forEach(function(c) {var n=c.name.split(" ");pre="";nom="";var inNom=false;n.forEach(function(s) {if(s.toUpperCase()==s){inNom=true;};if(inNom){nom+=s+" ";}else{pre+=s+" ";}});pre=pre.trim();nom=nom.trim();c["prenom"]=pre;c["nom"]=nom;})

//prenoms=pv.nest(candidats).key(function(c) {return c.prenom;}).rollup(function(prenom) {return pv.mean(prenom, function(d) {return partiScore[d.party];});})
prenoms=pv.values(pv.nest(candidats).key(function(c) {return c.prenom;}).rollup(function(prenom) {
return {prenom:prenom[0].prenom,
        score:pv.mean(prenom, function(d) {return partiScore[d.party];}),
        frequence:prenom.length}
;}))
prenoms.forEach(function(p) {p["partis"]=pv.nest(candidats.filter(function(c) {return c.prenom==p.prenom;})).key(function(d) {return d.party;}).rollup(function(d) {return d.length;});})

var prenomParti=[];

cScale=pv.Scale.linear(-5,0,5).range("red","#eee","blue")
//pf=prenoms.filter(function(p) {return p.frequence>1;}).sort(function(b,a) {return (a.frequence>b.frequence)-(b.frequence>a.frequence);});
pf=prenoms.sort(function(b,a) {return (a.frequence>b.frequence)-(b.frequence>a.frequence);});
pnode0=pv.nest(candidats).key(function(c) {return c.prenom;}).rollup(function(prenom) {return prenom.length;})
pnode={};pscore={};
//pv.keys(pnode0).forEach(function(p,i) {if(p!=""&&pv.values(pnode0)[i]>1) {pnode[p]=pv.values(pnode0)[i];}})
pv.keys(pnode0).forEach(function(p,i) {
	if(p!="") {
		pnode[p]=pv.values(pnode0)[i];
		pscore[p]=pf.filter(function(d) {return d.prenom==p;})[0].score;
	}})
pv.keys(pnode).forEach(function(p,i) {pscore[pv.values(pf)[i].prenom]=pv.values(pf)[i].score;})
vis=new pv.Panel().width(600).height(600);

vis2=vis.add(pv.Panel).width(450).height(450).event("click", function() {sp=-1;prenom="";vis.render();});
var pack = vis2.add(pv.Layout.Pack)
    .nodes(pv.dom(pnode).root("prenoms").nodes())
    .size(function(d) {return d.nodeValue;})
    //.order(null)
    ;
pack.node.strokeStyle(null);
pack.node.add(pv.Dot)
    .fillStyle(function(d) {if(d.index) {return cScale(pscore[d.nodeName]);} else {return "white";}})
    .title(function(d) {if (d.index) {return d.nodeName;} else {return null;}})

    .event("click", function(d) {if(this.index) {
    	console.log(d.nodeName);
    	select(d.nodeName);
    } else {sp=-1;prenom="";vis.render();}
    smallP.render();})


    //.title(function(d) {if (d.index) {return d.nodeName+" "+pscore[d.nodeName];} else {return null;}})
    .strokeStyle(function(d) {return ((d.nodeName).match(re)&&re!="") ? "#000" : null;})
    ;

function update(query) {
	if (query != re) {
	    re = new RegExp(query, "i");
	    vis2.render();
	}
}

var nameList, nameSlice, nameLength;
function select(prenom) {
	console.log(prenom);
	sp=1;
	prenomParti=prenoms.filter(function(p) {return p.prenom==prenom;})[0];
	nameList=candidats.filter(function(c) {return c.prenom==prenom;});
	nameSlice=0;
	nameLength=nameList.length;
	vis.render();
}

var partiScale=pv.Scale.linear()
	.domain(0,80)
	.range(0,100);

var smallP=vis.add(pv.Panel)
	.left(440).height(600)
	.visible(function() {return sp!=-1;});
var box=smallP.add(pv.Panel)
	.height(function() {return 30+12*pv.keys(prenomParti.partis).length;}).width(160)
	.fillStyle("#ddd");
box.add(pv.Label).top(1).left(5).textBaseline("top").text(function() {return prenomParti.prenom+" ("+prenomParti.frequence+")";})

var partyBars=box.add(pv.Panel).top(15).left(1).height(function() {return this.parent.height()-16;}).width(158).fillStyle("white")
		.add(pv.Bar)
			.data(function() {return pv.keys(prenomParti.partis)
				.sort(function(a,b) {return (partisDetails[a].order>partisDetails[b].order)-(partisDetails[a].order<partisDetails[b].order);})
			;})
			.top(function() {return 10+this.index*12;})
			.left(40)
			.height(10)
			.width(function(d) {return partiScale(prenomParti.partis[d]);})
			.fillStyle(function(d) {return partisDetails[d].color;})
			.title(function(d) {return partisDetails[d].nom;});

partyBars.anchor("left").add(pv.Label)
				.textAlign("right")
partyBars.anchor("right").add(pv.Label)
				.textAlign("left")
				.text(function(d) {return prenomParti.partis[d];})
				.textStyle("#ccc")

var box2=smallP.add(pv.Panel).top(270).height(330).fillStyle("#ddd");
var nameListing=box2.add(pv.Panel)
	.top(1)
	.height(328)
	.left(1)
	.width(158)
	.fillStyle("#fff")
	.add(pv.Panel)
		.data(function() {return nameList.slice(nameSlice,nameSlice+24);})
		.top(function() {return 5+this.index*12;})
		.left(10).height(10)
		.fillStyle("rgba(255,255,255,.01)")
		.title(function(d) {return d.name+" ("+((d.depId[0]==0)?"":d.depId[0])+d.depId.slice(1,3)+")";})
		.add(pv.Panel)
			.top(3).left(-8).width(7).height(7).fillStyle(function(d) {return partisDetails[d.party].color;})
			.title(function(d) {return partisDetails[d.party].nom;})
			.parent
		.add(pv.Label)
			.textBaseline("top").textAlign("left")
			.text(function(d) {return d.name+" ("+((d.depId[0]==0)?"":d.depId[0])+d.depId.slice(1,3)+")";})
	;

box2.add(pv.Panel).left(158).top(5).height(320).width(1).fillStyle("#fff");
box2.add(pv.Panel).left(159).top(5).height(320).width(1).fillStyle("#ddd");

var moreBox = smallP.add(pv.Panel)
	.fillStyle("#eee")
	.height(20)
	.left(90)
	.width(60)
	.top(570)
	.visible(function() {return nameSlice+24<=nameLength;})
	.event("click", function() {nameSlice+=24;box2.render();moreBox.render();lessBox.render();});
moreBox.anchor("center").add(pv.Label).text("suivants")
	;

var lessBox = smallP.add(pv.Panel)
	.fillStyle("#eee")
	.height(20)
	.left(10)
	.width(60)
	.top(570)
	.visible(function() {return nameSlice>=24;})
	.event("click", function() {nameSlice-=24;box2.render();moreBox.render();lessBox.render();});
lessBox.anchor("center").add(pv.Label).text("précédents")
	;


    vis.render();
