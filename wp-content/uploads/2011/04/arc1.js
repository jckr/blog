partis=["EXG", "COM", "PG", "SOC", "RDG", "DVG", "VEC", "ECO", "REG", "AUT", "MODM", "M-NC", "M", "UMP", "DVD", "FN", "EXD", "NUL", "ABS"];
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
	ABS:{nom:"Abstention", color: "navajowhite"}};

partis16=partis.slice(0,16);
var matrixData={nodes:[],links:[]};

partis16.forEach(function(p1,i) {
    matrixData.nodes.push({nodeName:p1});
    partisDetails[p1].size=deuxieme.filter(function(v) {return v[p1]>0;}).length;
    partis16.forEach(function(p2,j) {
        var duels=deuxieme.filter(function(v) {return v[p1]>0 && v[p2]>0;}).length;
        if (duels&&(p1!=p2)) {matrixData.links.push({source:i, target:j, value: duels/50});};

    })
;})


var vis = new pv.Panel()
    .width(500)
    .height(500)
    .bottom(90);

var arc = vis.add(pv.Layout.Arc).width(300).height(300).top(100).left(100)
    .nodes(matrixData.nodes)
    .links(matrixData.links)
    .orient("radial")

arc.link.add(pv.Line).title(function(d,b) {return (b.value*50).toFixed(0)+" duels";})

arc.node.add(pv.Dot)
    .size(function(d) {return (partisDetails[d.nodeName].size/10);})
    .fillStyle(function(d) {return partisDetails[d.nodeName].color;})
    .title(function(d) {return "Présent dans "+partisDetails[d.nodeName].size+" duels";})
    .strokeStyle(function() {return this.fillStyle().darker();});

arc.label.add(pv.Label)

vis.render();