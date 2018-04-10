import processing.core.*; 
import processing.xml.*; 

import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class deficit extends PApplet {

float rec; // recettes
float dep; // depenses
float det = 82.9f;       // dette
float def = 7.7f;     // deficit
float sdd = 43.2f;       // service de la dette


float[][] depC = {{0,.5f},{.1f,.9f},{.12f,.95f},{.14f,.98f},{.16f,.99f},{.18f,1},{.2f,1.02f},{1,1.1f}};

float[][] recC = {{0,1.2f},{.1f,1.1f},{.14f,1},{.16f,.98f},{.2f,.95f},{.3f,.8f},{.4f,.6f},{1,0.001f}};

float pibY, recX,depX,sddX;
float pib;

PFont font0 = createFont("Frutiger Linotype", 10, true);
PFont font1 = createFont("Frutiger Linotype", 12, true);
PFont font2 = createFont("Frutiger Linotype Bold", 14, true);

float pib0; 

boolean dragDep = false;
boolean dragRec = false;

public void setup() {
  size(800,600);
  resetVis();
}

public void draw() {

  background(255);
  textFont(font2);
  textAlign(CENTER,TOP);
  fill(0);
  text("Recettes, d\u00e9penses, croissance et d\u00e9ficit",400,0);
   line(50,565,550,565);
  line(50,585,550,585);
  pibY = pib/5;
  recX = rec/pib;
  depX = dep/pib;
  sddX = sdd/pib;
  
  rectMode(CORNERS);

  noFill();
    stroke(211);
  rect(50,550-pib0/5,550,550-pibY); // Pib 2011
  stroke(0);
  rect(50,550,550,550-pib0/5); // Pib 2010
  fill(0);
  textFont(font1);
  textAlign(CENTER,CENTER);
  
  if(pib-pib0>20){
    translate(10, 550-pibY/2);
    rotate(radians(-90));
    text("PIB 2011",0,0);
    resetMatrix();
    
    translate(30, 550-pib0/10);
    rotate(radians(-90));
    text("PIB 2010",0,0);
    resetMatrix();
    stroke(211);
    
    line(20,550,20,550-pibY);
    line(20,550,25,550);
    line(20,550-pibY,25,550-pibY);
    
    line(40,550,40,550-pib0/5+2);
    line(40,550,45,550);
    line(40,550-pib0/5+2,45,550-pib0/5+2);
  
    line(40,550-pib0/5-2,40,550-pibY);
    line(40,550-pib0/5-2,45,550-pib0/5-2);
    line(40,550-pibY,45,550-pibY);

    translate(30, ((550-pib0/5)+(550-pibY))/2);
    rotate(radians(-90));
    fill(0,255,0);
    //text("croissance "+round(100*(pib/pib0)-100),0,0);
    text("croissance",0,0);
    fill(0);
    resetMatrix();
  } else if(pib0-pib>20) {
    translate(10,550-pib0/10);
    rotate(radians(-90));
    text("PIB 2010",0,0);
    resetMatrix();
    
    translate(30, min(530,550-pibY/2));
    rotate(radians(-90));
    text("PIB 2011",0,0);
    resetMatrix();
    stroke(211);
    
    line(20,550,20,550-pib0/5);
    line(20,550,25,550);
    line(20,550-pib0/5,25,550-pib0/5);
    
    line(40,550,40,550-pibY+2);
    line(40,550,45,550);
    line(40,550-pibY+2,45,550-pibY+2);
  
    line(40,550-pib0/5-2,40,550-pibY);
    line(40,550-pib0/5-2,45,550-pib0/5-2);
    line(40,550-pibY,45,550-pibY);

    translate(30, ((550-pib0/5)+(550-pibY))/2);
    rotate(radians(-90));
    fill(255,0,0);
    text("d\u00e9croissance",0,0);
    resetMatrix();
  } else {
    
    translate(30, 550-pib0/10);
    rotate(radians(-90));
    text("PIB 2010",0,0);
    resetMatrix();
    stroke(211);
    
    line(40,550,40,550-pib0/5);
    line(40,550,45,550);
    line(40,550-pib0/5,45,550-pib0/5);
  }
  
  
  stroke(0);
  fill(0xff98FB98,50);
  rect(50,550,50+recX*500,550-pibY); // recettes 2011
  if(dragRec){
    fill(0);
    if(recX<.92f){
      textAlign(LEFT);
      text(nfs(100*recX,0,0)+"%",50+recX*500,min(545,550-pibY+10));
    } else {
      textAlign(RIGHT);
      text(nfs(100*recX,0,0)+"%",45+recX*500,min(545,550-pibY+10));
    }
      
  }
  fill(0xff800000,50);
  rect(50,550,50+depX*500,550-(pib0/5));  // d\u00e9penses 2011
  if(dragDep){
    fill(0);
    if(depX<.85f){
      textAlign(LEFT);
      text(round(dep)+" milliards",55+depX*500,560-pib0/5);
    } else {textAlign(RIGHT);
            text(round(dep)+" milliards",45+depX*500,560-pib0/5);
    }
    
    
  }
  //rect(50,550,50+sddX*500,550-pibY);
  
  fill(0);textAlign(LEFT);
  textFont(font0);
  text("Recettes",2,565);
  text("D\u00e9penses",2, 585);
  
  fill(dragRec?222:128);
  rect(45+recX*500,558,55+recX*500,574);
  fill(dragDep?222:128);
  rect(45+depX*500,576,55+depX*500,594); 
  
  // graphique cascade
  
  textAlign(CENTER,TOP);
  fill(0);
  
  text("recettes",580,305);
  text("(base 2010)",580,317);
  text("variation",630,305);
  text("dues \u00e0 la",630,317);
  text("croissance",630,329);
  text("d\u00e9penses",680,305);
  text("solde",740,305);
  
  fill(0xff98FB98,50);
//  stroke(0);

  patternLine(560,300,760,300,0x5555,2);
  noStroke();
  rect(570,300,590,300-.8f*recX*pib0/5); 
//  println("300-recX*pib0/2: "+(300-recX*pib0/2)+" "+(300-recX*pibY/2));
  rect(620,300-.8f*recX*pib0/5,640,300-.8f*recX*pib/5);
  fill(0xff800000,50);
  rect(570,300,590,300-.8f*recX*pib0/5); 
  rect(670,300-.8f*recX*pib/5,690,300-.8f*recX*pib/5+.8f*depX*pib0/5);
  
  fill((rec*pib>dep*pib0?0xff98FB98:0xff800000),75);
  rect(730,300,750,300-.8f*recX*pib/5+.8f*depX*pib0/5);
  
  stroke(0);
  
  // bouton reset
  
  fill(211);rect(700,570,780,590);
  textAlign(CENTER,CENTER);fill(0);
  text("Recommencer",740,580);
  
  
  
}

public void resetVis() {
  rec = 271.3f;
  dep = 423.2f;
  pib0 = 1948.2f;
  pib = pib0 * modC(rec/pib,recC) * modC(dep/pib,depC)*1.02f;
}

public void mousePressed() {
  if ((mouseX>700)&&(mouseX<780)&&(mouseY>570)&&(mouseY<590)) {// mise \u00e0 z\u00e9ro
  resetVis();
  }
  if ((mouseX>44+recX*500)&&(mouseX<56+recX*500)&&(mouseY>557)&&(mouseY<575)) {
    dragRec = true;}
  if ((mouseX>44+depX*500)&&(mouseX<56+depX*500)&&(mouseY>575)&&(mouseY<595)) {
    dragDep = true;}
}

public void mouseReleased() {dragRec=false;dragDep=false;
println("PIB: "+pib+", PIB0: "+pib0);
println("recX:"+recX+", modC:"+modC(recX,recC));
println("depX:"+depX+", modC:"+modC(depX,depC));
println("croissance:"+modC(recX,recC)*modC(depX,depC)*1.02f);
}

public void mouseDragged() {
  if(dragRec){
    if(mouseX<50){recX=0;}
    else if(mouseX>550){recX=1;}
    else {recX=map(mouseX,50,550,0,1);println(mouseX);println(recX);}
    pib = pib0 * modC(recX,recC) * modC(depX,depC)*1.02f;
    rec=pib*recX;
    dep=pib*depX;
  }
  if(dragDep){
    if(mouseX<50){depX=0;}
    else if(mouseX>550){depX=1;}
    else {depX=map(mouseX,50,550,0,1);}
    pib = pib0 * modC(recX,recC) * modC(depX,depC)*1.02f;
    dep=pib*depX;
    rec=pib*recX;
  }
}

public float modC(float myVal, float[][] myArray){
  int i=0;float modC=-1;
  while((i+1)<myArray.length){
    if((myArray[i][0]<=myVal)&&(myArray[i+1][0]>=myVal)){
      modC= map(myVal,myArray[i][0],myArray[i+1][0],myArray[i][1],myArray[i+1][1]);
    }
    i++;
  }
  return modC;
}

public void patternLine(int xStart, int yStart, int xEnd, int yEnd, int linePattern, int lineScale) {
  int temp, yStep, x, y;
  int pattern = linePattern;
  int carry;
  int count = lineScale;
  
  boolean steep = (abs(yEnd - yStart) > abs(xEnd - xStart));
  if (steep == true) {
    temp = xStart;
    xStart = yStart;
    yStart = temp;
    temp = xEnd;
    xEnd = yEnd;
    yEnd = temp;
  }    
  if (xStart > xEnd) {
    temp = xStart;
    xStart = xEnd;
    xEnd = temp;
    temp = yStart;
    yStart = yEnd;
    yEnd = temp;
  }
  int deltaX = xEnd - xStart;
  int deltaY = abs(yEnd - yStart);
  int error = - (deltaX + 1) / 2;
  
  y = yStart;
  if (yStart < yEnd) {
    yStep = 1;
  } else {
    yStep = -1;
  }
  for (x = xStart; x <= xEnd; x++) {
    if ((pattern & 1) == 1) {
	if (steep == true) {
	  point(y, x);
	} else {
	  point(x, y);
	}
	carry = 0x8000;
    } else {
	carry = 0;
    }  
    count--;
    if (count <= 0) {
	pattern = (pattern >> 1) + carry;
	count = lineScale;
    }
	  
    error += deltaY;
    if (error >= 0) {
	y += yStep;
	error -= deltaX;
    }
  }
}
  static public void main(String args[]) {
    PApplet.main(new String[] { "--present", "--bgcolor=#666666", "--stop-color=#cccccc", "deficit" });
  }
}
