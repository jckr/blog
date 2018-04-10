var data2=[{"category":"2002","value0":38,"value1":5,"value2":0},{"category":"","value0":34,"value1":4.6,"value2":0},{"category":"","value0":34,"value1":3.95,"value2":0},{"category":"2003","value0":27,"value1":2.8,"value2":0},{"category":"","value0":25,"value1":2.4,"value2":0},{"category":"","value0":24,"value1":2,"value2":0},{"category":"2004","value0":22,"value1":1.7,"value2":0},{"category":"","value0":20,"value1":1.4,"value2":0},{"category":"","value0":25,"value1":1.3,"value2":0},{"category":"2005","value0":20,"value1":1.2,"value2":0},{"category":"","value0":17,"value1":0.9,"value2":0},{"category":"","value0":21,"value1":0.95,"value2":0},{"category":"2006","value0":18,"value1":1,"value2":0},{"category":"","value0":14,"value1":0.75,"value2":0},{"category":"","value0":18,"value1":0.95,"value2":0},{"category":"2007","value0":14,"value1":0.8,"value2":0},{"category":"","value0":12,"value1":0.6,"value2":0},{"category":"","value0":17,"value1":0.8,"value2":0},{"category":"2008","value0":13,"value1":0.65,"value2":0},{"category":"","value0":11,"value1":0.7,"value2":0},{"category":"","value0":12,"value1":0.69,"value2":0},{"category":"2009","value0":11,"value1":0.7,"value2":0},{"category":"","value0":9,"value1":0.4,"value2":0},{"category":"","value0":10,"value1":0.5,"value2":0}]; 



var x2=pv.Scale.linear(0,23).range(0,553); 
var y2=pv.Scale.linear(0, 50).range(0, 270); 

var v2=new pv.Panel().width(600).height(400).fillStyle("#fff").strokeStyle(undefined); 

var myChart2 = v2.add(pv.Panel).width(553).height(270).left(17).top(70); 
myChart2.add(pv.Rule).data(data2).visible(function() {return (this.index >= 0)&&((0==0)||!(this.index % 0));}).left(function(d) {return Math.round(x2(this.index)) - .5;}).strokeStyle("#eee").anchor("bottom").add(pv.Label).textMargin(5).font("10px 'Frutiger LT Std 45 Light', Arial, Helvetica, sans-serif").text(function(d) {return d.category;}).textAlign(function() {return (this.index>0?((this.index<data2.length-1)?"center":"right"):"left");}); 

myChart2.add(pv.Rule).data(y2.ticks(5)).bottom(function(d) {return Math.round(y2(d)) - .5;}).strokeStyle("#eee"); myChart2.add(pv.Rule).data(y2.ticks(5)).bottom(function(d) {return Math.round(y2(d))-.5;}).strokeStyle(function(d) {return d ? "rgba(255,255,255,.3)":"#000";}).add(pv.Rule).left(0).width(5).strokeStyle("#000").anchor("left").add(pv.Label).font("10px 'Frutiger LT Std 45 Light', Arial, Helvetica, sans-serif").text(function(d) {return d.toFixed(digits);}); 

myChart2.add(pv.Line).data(data2).left(function() {return x2(this.index);}).bottom(function(d) {return y2(d.value0);}).lineWidth(3).strokeStyle("#0078ba"); myChart2.add(pv.Line).data(data2).left(function() {return x2(this.index);}).bottom(function(d) {return y2(d.value1);}).lineWidth(3).strokeStyle("#b2b2b2"); v2.add(pv.Panel).left(0).top(0).height(65).fillStyle(undefined);
v2.add(pv.Label).data(["Taux de dépassements de vitesse", "Véhicules de tourisme"]).top(32.5).left(5).textAlign("left").textBaseline(function() {return this.index?"top":"bottom";}).textStyle("#000").font(function() {return this.index?"16px 'Frutiger LT Std 45 Light', Arial, Helvetica, sans-serif":"24px 'Frutiger LT Std 55 Roman', Arial, Helvetica, sans-serif";}).antialias(true); 

v2.add(pv.Panel).data(["> 10 km/h","> 30 km/h","undefined"]).width(30).height(20).bottom(20).left(function() {return 17+this.index*477;}).fillStyle(function() {return ["#0078ba","#b2b2b2"][this.index];}).strokeStyle(null).anchor("right").add(pv.Label).textAlign("left").font("10px 'Frutiger LT Std 45 Light', Arial, Helvetica, sans-serif"); v2.add(pv.Label).bottom(5).right(5).textAlign("right").textBaseline("bottom").font("10px 'Frutiger LT Std 45 Light', Arial, Helvetica, sans-serif").text("Source: ONISR"); 

v2.render();