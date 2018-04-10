(function() {
	couples={};
	var width,height;
	var keys;
	couples.init=function(params) {
		if (!params) {params={}}
		var chart=params.chart||"#chart";
		couples.svg=d3.select(chart).append("svg")
			.attr({width:width=(params.width||960),height:height=(params.height||600)});
		
		couples.s_gender1=d3.select(params.selector1||"#partner1");
		couples.s_gender2=d3.select(params.selector2||"#partner2");
		couples.s_status=d3.select(params.selector3||"#status");
		couples.flip=d3.select(params.flip||"#flip").style("display","none");

		couples.gender1="total";
		couples.gender2="total";
		couples.status="total";
		rels=["total",2,3,4,5,6,10,11];
		genders=["total","F","M"]
		
		couples.s_gender1.on("change",function() {
			couples.gender1=d3.select(this).property("value");
			couples.flip.style("display",(couples.gender1==couples.gender2)?"none":"block");
			couples.draw();

		})
		couples.s_gender2.on("change",function() {couples.gender2=d3.select(this).property("value");couples.flip.style("display",(couples.gender1==couples.gender2)?"none":"block");couples.draw();})
		couples.s_status.on("change",function()  {couples.status =d3.select(this).property("value");couples.draw();})

		couples.flip.on("click",function() {
			var swap=couples.gender1;
			couples.gender1=couples.gender2;
			couples.gender2=swap;
			couples.s_gender1.property("value",couples.gender1);couples.s_gender2.property("value",couples.gender2);
			couples.draw()})
		couples.loaddata(params.data);

		couples.infotip=d3.select("body").append("div").classed("infotip",1).style("display","none")



	}

	couples.loaddata= function(params) {
		if(!params) {params={}}
		d3.csv(params.datafile||"couples.csv",function(error,csv) {
      		couples.data=d3.range(0,61).map(
      			function(age1) {return d3.range(0,61).map(
      				function(age2) {
						var record={}
      					genders.forEach(
      					function(gender1) {genders.forEach(
      						function(gender2) {rels.forEach(
      							function(status) {
      								if(!record[gender1]) {
      									record[gender1]={}
      								}
      								if(!record[gender1][gender2]) {
      									record[gender1][gender2]={}
      								}
      								record[gender1][gender2][status]={number:0,ratio:0}
      							})
      					})
      				})
      				return record
      			})
      		})
      		couples.total=d3.range(0,61).map(function(age1) {
      			var record={}
				genders.forEach(function(gender1) {genders.forEach(
					function(gender2) {rels.forEach(
						function(status) {
							if(!record[gender1]) {
								record[gender1]={}
							}
							if(!record[gender1][gender2]) {
								record[gender1][gender2]={}
							}
							record[gender1][gender2][status]=0
						})
					})
				})
				return record
			})
	
      		csv.forEach(function(d) {
      			if(d.age1>=16&&d.age1<=60&&d.age2>=16&&d.age2<=60) {
      				//console.log(d.couples)
      				d.couples=+d.couples
      				couples.total[d.age1][d.gender1][d.gender2][d.status]=couples.total[d.age1][d.gender1][d.gender2][d.status]+d.couples;
      				couples.total[d.age1][d.gender1][d.gender2]["total"]=couples.total[d.age1][d.gender1][d.gender2]["total"]+d.couples;
      				couples.total[d.age1][d.gender1]["total"][d.status]=couples.total[d.age1][d.gender1]["total"][d.status]+d.couples;
      				couples.total[d.age1][d.gender1]["total"]["total"]=couples.total[d.age1][d.gender1]["total"]["total"]+d.couples;
      				couples.total[d.age1]["total"][d.gender2][d.status]=couples.total[d.age1]["total"][d.gender2][d.status]+d.couples;
      				couples.total[d.age1]["total"][d.gender2]["total"]=couples.total[d.age1]["total"][d.gender2]["total"]+d.couples;
      				couples.total[d.age1]["total"]["total"][d.status]=couples.total[d.age1]["total"]["total"][d.status]+d.couples;
      				couples.total[d.age1]["total"]["total"]["total"]=couples.total[d.age1]["total"]["total"]["total"]+d.couples;
      				

					couples.data[d.age1][d.age2][d.gender1][d.gender2][d.status].number=couples.data[d.age1][d.age2][d.gender1][d.gender2][d.status].number+d.couples;
					couples.data[d.age1][d.age2][d.gender1][d.gender2]["total"].number=couples.data[d.age1][d.age2][d.gender1][d.gender2]["total"].number+d.couples;
					couples.data[d.age1][d.age2][d.gender1]["total"][d.status].number=couples.data[d.age1][d.age2][d.gender1]["total"][d.status].number+d.couples;
					couples.data[d.age1][d.age2][d.gender1]["total"]["total"].number=couples.data[d.age1][d.age2][d.gender1]["total"]["total"].number+d.couples;
					couples.data[d.age1][d.age2]["total"][d.gender2][d.status].number=couples.data[d.age1][d.age2]["total"][d.gender2][d.status].number+d.couples;
					couples.data[d.age1][d.age2]["total"][d.gender2]["total"].number=couples.data[d.age1][d.age2]["total"][d.gender2]["total"].number+d.couples;
					couples.data[d.age1][d.age2]["total"]["total"][d.status].number=couples.data[d.age1][d.age2]["total"]["total"][d.status].number+d.couples;
					couples.data[d.age1][d.age2]["total"]["total"]["total"].number=couples.data[d.age1][d.age2]["total"]["total"]["total"].number+d.couples;
					
      			}
      		})

      		couples.data.forEach(function(age1,i) {
      			age1.forEach(function(age2,j) {
      				genders.forEach(function(gender1) {
      					genders.forEach(function(gender2) {
      						rels.forEach(function(status) {
      							var total=couples.total[i][gender1][gender2][status];
      							var number=couples.data[i][j][gender1][gender2][status].number;
      							if(number!=0) {couples.data[i][j][gender1][gender2][status].ratio=number/total}; // if number is not null total can't be null
      						})
      					})
      				})
      			})
      		})


      		couples.draw();
		
	})}

	couples.draw=function() {

		var scale=d3.scale.linear().domain([0,.009999,.01,.05]).range(["white","white","pink","magenta"]).clamp([true])
		var cells;

		couples.svg.selectAll(".col").data(couples.data).enter().append("g").classed("col",1).attr("transform",function(d,i) {return "translate("+(60+(i-16)*12)+",0)"})
			.selectAll(".row").data(function(d) {return d}).enter().append("g").classed("row",1).attr("transform",function(d,i) {return "translate(0,"+(540-(i-16)*12)+")"})
			.append("rect").classed("cell",1).style({fill:"white"}).attr({width:12,height:12})


		couples.svg.selectAll(".eqline").data([{}]).enter().append("line").style({"stroke-dash-array":"2 2",stroke:"#888"}).attr({y2:552,x2:60,x1:600,y1:12})

		couples.svg.selectAll(".axis").data([{}]).enter().append("path").style({stroke:"#eee",fill:"none"}).attr("d","m60,0v552h552")
		var ticks=[16,20,25,30,35,40,45,50,55,60]
		couples.svg.selectAll(".hticks").data(ticks).enter().append("text").text(String)
			.attr({y:575,x:function(d) {return (60+(d-16)*12)}}).style("fill","#ccc")
		couples.svg.selectAll(".vticks").data(ticks).enter().append("text").text(String)
			.attr({y:function(d) {return (540-(d-16)*12+8)},x:50,"text-anchor":"end"}).style("fill","#ccc")
		var totalbyage=couples.total.map(function(d) {return d[couples.gender1][couples.gender2][couples.status]});
		var avgline="M"
		var avgbyage=couples.data.map(function(age1,i) {
			var tba=totalbyage[i];
			if(tba==0) {return 0;}
			var avg=d3.sum(age1,function(age2,j) {return j*age2[couples.gender1][couples.gender2][couples.status].number/tba})
			avgline=avgline+(i>16?",":"")+(((i-16)*12)+66)+","+(540-(avg-16)*12)+" ";
			return avg;
		})

		couples.svg.selectAll(".avgline").data([avgline]).enter().append("path").classed("avgline",1).attr("d",avgline).style({stroke:"black",fill:"none"})
		d3.select(".avgline").transition().duration(1000).attr("d",avgline)
		var cells=d3.selectAll(".cell");
		cells.transition().duration(1000).style({fill:function(d) {
			if (d[couples.gender1]) {
				if(d[couples.gender1][couples.gender2]) {
					if(d[couples.gender1][couples.gender2][couples.status]) {
						if(d[couples.gender1][couples.gender2][couples.status].number<10) {return "white"}
						return scale(d[couples.gender1][couples.gender2][couples.status].ratio)
					}
				}
			}
			console.log("undefined?",d)
			return "white";
		}})

		//cells.on("mouseover")






			
		

	}

})();