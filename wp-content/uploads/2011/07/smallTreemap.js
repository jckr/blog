var access = {
	  'datavis': 3880,
	    'shared': {
	        '2':2124,
	        '3':661,
	        '4':285,
	        '5':143,
	        '6':77,
	        '7':52,
	        '8':22},
	  'filwd': 161,
	  'infosthetics': 5518,
	  'janwillemtulp': 414,
	  'jcukier': 213,
	  'moritz_stefaner': 957,
	  'visualisingdata': 914,
	  'wiederkehr': 236};

	  var info={
	  datavis: {color: "#1f77b4", label: "datavis", title: "followers unique to datavis"},
	  filwd: {color: "#aec7e8", label: "filwd", title: "followers unique to filwd"},
	  infosthetics: {color: "#ff7f0e", label: "infosthetics", title: "followers unique to infosthetics"},
	  janwillemtulp: {color: "#ffbb78", label: "janwillemtulp", title: "followers unique to janwillemtulp"},
	  jcukier: {color: "#2ca02c", label: "jcukier", title: "followers unique to jcukier"},
	  moritz_stefaner: {color: "#98df8a", label: "moritz_stefaner", title: "followers unique to moritz_stefaner"},
	  2: {color: "rgba(148,103,188,.25)", label: "shared by 2 accounts", title: "followers shared by 2 accounts"},
	  3: {color: "rgba(148,103,188,.375)", label: "3 accounts", title: "followers shared by 3 accounts"},
	  4: {color: "rgba(148,103,188,.5)", label: "4 accounts", title: "followers shared by 4 accounts"},
	  5: {color: "rgba(148,103,188,.625)", label: "5", title: "followers shared by 5 accounts"},
	  6: {color: "rgba(148,103,188,.75)", label: "6", title: "followers shared by 6 accounts"},
	  7: {color: "rgba(148,103,188,.875)", label: "7", title: "followers shared by 7 accounts"},
	  8: {color: "rgb(148,103,188)", label: "8", title: "followers shared by all 8 accounts"},
	  visualisingdata: {color: "#d62728", label: "visualisingdata", title: "followers unique to visualisingdata"},
	  wiederkehr: {color: "#ff9896", label: "wiederkehr", title: "followers unique to wiederkehr"}};
	var stdFont="Frutiger, Arial, Sans-Serif";
	vis=new pv.Panel()
		.height(500)
		.width(500);

var pack = vis.add(pv.Layout.Treemap)
    .nodes(pv.dom(access).root("followers").nodes())
    .round(true).strokeStyle("#222")
;

myLeaf=pack.leaf.add(pv.Panel)
	.visible(function(d) {return !d.firstChild;})

    .fillStyle(function(d) {return info[d.nodeName].color;})
    .strokeStyle(function(d) {return this.fillStyle().darker();})
    .lineWidth(1)
    .antialias(false)

    .title(function(d) {return info[d.nodeName].title+": "+d.nodeValue;})
    ;

mylabels=pack.label.add(pv.Label)

	.text(function(d) {return (info[d.nodeName].label);})
	.textStyle("white")
	.textShadow("-0.1em 0.1em 0.2em #000")
	.font(function(d) {return (Math.max(10,.1*Math.sqrt(d.dx*d.dy))).toFixed(0)+"px "+stdFont;})
	.visible(function(d) {
		var text;
		text=info[d.nodeName]
		if (typeof(text)==='undefined') {return false;} else
		{return (!d.firstChild)
			  
			   &&(Math.min(d.dx,d.dy)>10)&&(d.nodeValue>1)
	;}})




;

vis.render();