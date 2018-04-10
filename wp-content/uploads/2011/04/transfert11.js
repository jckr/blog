function reduce(c) {
	return {FN: c.FN, gauche: c.EXG+c.COM+c.PG+c.SOC+c.RDG+c.DVG+c.VEC, droite: c["M-NC"]+c.M+c.UMP+c.DVD, EXD: c.EXD, autres: c.AUT+c.REG+c.ECO+c.MODM, ABS:c.ABS, NUL:c.NUL};}

deuxFN=deuxieme.filter(function(v) {return v.FN>0;})
tours=deuxFN.map(function(c) {return {canId:c.canId, depId:c.depId, t1: reduce(votes.filter(function(d) {return d.canId==c.canId;})[0]), t2:reduce(c)};})

toursAvg=["FN","gauche", "droite", "EXD", "autres", "ABS","NUL"].map(function(p) {return {parti:p, t1: pv.sum(tours, function(t) {return t.t1[p];}), t2: pv.sum(tours, function(t) {return t.t2[p];})};})
var pan2=new pv.Panel().width(490).height(350);
var vis2=pan2.add(pv.Panel)
	.width(300).top(50)
	.height(300)
	;
pan2.add(pv.Label).top(14).left(245).textAlign("center").text("Transferts de voix entre les deux tours").font("bold 14px sans-serif")
pan2.add(pv.Label).top(30).left(110).textAlign("center").text("Duels droite-FN").font("bold 12px sans-serif")
pan2.add(pv.Label).top(43).left(60).textAlign("center").text("Voix en moins");
pan2.add(pv.Label).top(43).left(160).textAlign("center").text("Voix en plus");
pan2.add(pv.Label).top(30).left(380).textAlign("center").text("Duels gauche-FN").font("bold 12px sans-serif")
pan2.add(pv.Label).top(43).left(330).textAlign("center").text("Voix en moins");
pan2.add(pv.Label).top(43).left(430).textAlign("center").text("Voix en plus");

toursGauche=tours.filter(function(t) {return t.t2.droite==0&&t.t2.autres==0;})
toursDroite=tours.filter(function(t) {return t.t2.gauche==0&&t.t2.autres==0;})
toursDifG=["FN","gauche", "droite", "EXD", "autres", "ABS","NUL"].map(function(p) {return {parti:p, diff: pv.sum(toursGauche, function(t) {return t.t2[p];})- pv.sum(toursGauche, function(t) {return t.t1[p];})};})
toursDifD=["FN","gauche", "droite", "EXD", "autres", "ABS","NUL"].map(function(p) {return {parti:p, diff: pv.sum(toursDroite, function(t) {return t.t2[p];})- pv.sum(toursDroite, function(t) {return t.t1[p];})};})
toursAvgG=["FN","gauche", "droite", "EXD", "autres", "ABS","NUL"].map(function(p) {return {parti:p, t1: pv.sum(toursGauche, function(t) {return t.t1[p];}), t2: pv.sum(toursGauche, function(t) {return t.t2[p];})};})
toursAvgD=["FN","gauche", "droite", "EXD", "autres", "ABS","NUL"].map(function(p) {return {parti:p, t1: pv.sum(toursDroite, function(t) {return t.t1[p];}), t2: pv.sum(toursDroite, function(t) {return t.t2[p];})};})

totD = pv.sum(toursDifD.filter(function(d) {return d.diff>0;}), function(d) {return d.diff;})

vis2.add(pv.Panel).left(120).bottom(0).width(80).height(300*toursDifD[0].diff/totD).fillStyle(partisDetails.FN.color).title("FN - +"+toursDifD[0].diff+" voix").anchor("center").add(pv.Label).text("FN");
vis2.add(pv.Panel).left(120).bottom(300*toursDifD[0].diff/totD).width(80).height(300*toursDifD[6].diff/totD).fillStyle(partisDetails.NUL.color).title("Nul - +"+toursDifD[6].diff+" voix").anchor("center").add(pv.Label).text("Blanc ou nul");
vis2.add(pv.Panel).left(120).bottom(300*(toursDifD[0].diff+toursDifD[6].diff)/totD).width(80).height(300*toursDifD[2].diff/totD).fillStyle(partisDetails.UMP.color).title("Droite - +"+toursDifD[2].diff+" voix").anchor("center").add(pv.Label).text("Droite");

vis2.add(pv.Panel).left(20).top(0).width(80).height(-300*toursDifD[1].diff/totD).fillStyle(partisDetails.SOC.color).title("Gauche - "+toursDifD[1].diff+" voix").anchor("center").add(pv.Label).text("Gauche");
vis2.add(pv.Panel).left(20).top(-300*toursDifD[1].diff/totD).width(80).height(-300*toursDifD[5].diff/totD).fillStyle(partisDetails.ABS.color).title("Absentions - "+toursDifD[5].diff+" voix").anchor("center").add(pv.Label).text("Abstentionnistes");
vis2.add(pv.Panel).left(20).top(-300*(toursDifD[1].diff+toursDifD[5].diff)/totD).width(80).height(-300*toursDifD[4].diff/totD).fillStyle(partisDetails.AUT.color).title("Autres - "+toursDifD[4].diff+" voix").anchor("center").add(pv.Label).text("autres");
vis2.add(pv.Panel).left(20).top(-300*(toursDifD[1].diff+toursDifD[5].diff+toursDifD[4].diff)/totD).width(80).height(-300*toursDifD[3].diff/totD).fillStyle(partisDetails.EXD.color).title("Extrême droite - "+toursDifD[3].diff+" voix");

var vis3=pan2.add(pv.Panel).top(50).left(270).width(300).height(300)

totG = pv.sum(toursDifG.filter(function(d) {return d.diff>0;}), function(d) {return d.diff;})

vis3.add(pv.Panel).left(120).bottom(0).width(80).height(300*toursDifG[0].diff/totG).fillStyle(partisDetails.FN.color).title("FN - +"+toursDifG[0].diff+" voix").anchor("center").add(pv.Label).text("FN");
vis3.add(pv.Panel).left(120).bottom(300*toursDifG[0].diff/totG).width(80).height(300*toursDifG[6].diff/totG).fillStyle(partisDetails.NUL.color).title("Nul - +"+toursDifG[6].diff+" voix").anchor("center").add(pv.Label).text("Blanc ou nul");
vis3.add(pv.Panel).left(120).bottom(300*(toursDifG[0].diff+toursDifG[6].diff)/totG).width(80).height(300*toursDifG[1].diff/totG).fillStyle(partisDetails.SOC.color).title("Gauche - +"+toursDifG[1].diff+" voix").anchor("center").add(pv.Label).text("Gauche");

vis3.add(pv.Panel).left(20).top(0).width(80).height(-300*toursDifG[2].diff/totG).fillStyle(partisDetails.UMP.color).title("Droite - "+toursDifG[2].diff+" voix").anchor("center").add(pv.Label).text("Droite");
vis3.add(pv.Panel).left(20).top(-300*toursDifG[2].diff/totG).width(80).height(-300*toursDifG[5].diff/totG).fillStyle(partisDetails.ABS.color).title("Absentions - "+toursDifG[5].diff+" voix").anchor("center").add(pv.Label).text("Abstentionnistes");
vis3.add(pv.Panel).left(20).top(-300*(toursDifG[2].diff+toursDifG[5].diff)/totG).width(80).height(-300*toursDifG[4].diff/totG).fillStyle(partisDetails.AUT.color).title("Autres - "+toursDifG[4].diff+" voix").anchor("center").add(pv.Label).text("autres");
vis3.add(pv.Panel).left(20).top(-300*(toursDifG[2].diff+toursDifG[5].diff+toursDifG[4].diff)/totG).width(80).height(-300*toursDifG[3].diff/totG).fillStyle(partisDetails.EXD.color).title("Extrême droite - "+toursDifG[3].diff+" voix");

pan2.render();