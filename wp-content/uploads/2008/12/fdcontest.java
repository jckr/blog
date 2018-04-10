import processing.core.*; 
import processing.xml.*; 

import java.applet.*; 
import java.awt.*; 
import java.awt.image.*; 
import java.awt.event.*; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class fdcontest extends PApplet {

float dataMin, dataMax, dataStep, dataMinorStep;
float Xmargin =5, Ymargin=5;
float plotX1, plotY1;
float plotX2, plotY2;
float labelX, labelY;
float titleX, titleY;
float subtitleX, subtitleY;

String titleFontName, subtitleFontName, plotFontName, smallFontName, axisFontName;
float titleFontSize, subtitleFontSize, plotFontSize, smallFontSize, axisFontSize;

int rowCount;
int columnCount;
int currentColumn = 0;

int yearMin, yearMax;
float bargapRatio;

String title, subtitle, axisText, caption, graphType;

float captionX, captionY;
boolean interactive=false;

int yearInterval = 3;
float volumeInterval = 0.1f;
float volumeIntervalMinor = 0.05f;

float tabTop, tabBottom;
float tabPad = 10;

String[] xLabels = new String[500]; 
float[][] yValues = new float[500][99];
int nbSeries = 1;

PFont plotFont;
PFont titleFont;
PFont axisFont;
PFont smallFont;
PFont subtitleFont;

int mainFill, mainBorder, softFill, lightGrey, Grey, White, Black, altFill, altBorder, Beige, Burgundy, gridLinesColor;
int[][] colors = new int[99][3];

int[] matrixDatamax = {
  1000000, 600000, 400000, 400000, 1200000};
int[] plotLeftX = {
  40,40,40,40,40};
int[] plotRightX = {
  440, 440, 440, 440, 440};
int[] plotTopY =  {
  40, 105, 150, 185, 220};
int[] plotBottomY = {
  90, 135,170,205,280};
String[] seriesNames = {
  "Europe",  "America", "Asia", "Others", "Total"};

public void setup() {
  size(450,300);
  int dataIndex = 0;
  titleFontName="";
  subtitleFontName="";
  axisFontName="";
  smallFontName="";
  plotFontName="";
  graphType="";
  title="";
  subtitle="";
  axisText="";
  caption="";

  String lines[] = loadStrings("params.txt");
  for (int i=0; i < lines.length; i++) {
    String pieces[]=split(lines[i],'\t') ;
    if (pieces[0].equals("data"))  {
      xLabels[dataIndex]=pieces[1];
      for (int j=2;j<pieces.length;j++)	{
        yValues[dataIndex][j-1]=PApplet.parseFloat(pieces[j]);
      }
      if (pieces.length-1>nbSeries) {
        nbSeries=pieces.length-1;
        println(nbSeries);
      }
      dataIndex++;
    }

    if (pieces[0].equals("type")) {
      graphType=pieces[1];
    }
 }
  
  rowCount=dataIndex;

  titleFontName="Frutiger Linotype Bold";
  subtitleFontName="Frutiger Linotype";
  axisFontName="Frutiger Linotype Bold";
  plotFontName="Frutiger Linotype";
  smallFontName="Frutiger Linotype";
  
  if (graphType.length()==0) {
    graphType="clustered";
  }

  axisFontSize=11;
  smallFontSize=9;
  plotFontSize=10;
  titleFontSize=14;
  subtitleFontSize=12;

  titleFont = createFont(titleFontName, titleFontSize, true);
  subtitleFont = createFont(subtitleFontName, subtitleFontSize, true);
  axisFont = createFont(axisFontName, axisFontSize, true);
  plotFont = createFont(plotFontName, plotFontSize, true);
  smallFont = createFont(smallFontName, smallFontSize, true);

  softFill = 0xff99C7EC;
  mainFill = 0xff008CC6;
  mainBorder =0xffDA2431;
  altFill = 0xfff97e23;
  altBorder = 0xffE48006;

  lightGrey = 0xffF9F9F9;
  Grey = 0xffE2E1D8;
  White = 0xffFFFFFF;
  Black = 0xff000000;
  Beige = 0xffEEEDE3; //#DDD9C3;
  Burgundy = 0xff632523;
  gridLinesColor= 0xffF3F4F9; 

  if (bargapRatio ==0) {
    bargapRatio=0.75f;
  }

  dataStep = 200000;
  plotX1=50;
  plotY1=40;
  plotX2=400;
  plotY2=280;

}

public void draw()	{
  smooth();
  strokeCap(ROUND);
  strokeJoin(BEVEL);
  rectMode(CORNERS);
  //noLoop();
  background (lightGrey);
  fill(Black);

  if (graphType.equals("matrix")) {
    textAlign(CENTER);
    textFont(titleFont);
    text("Immigration to the USA by continent",220,15);
    textFont(subtitleFont);
    text("Thousands per year, 1821-2006",220,35);

    noFill();
    stroke(Grey);
    rect(0,0,width-1, height-1);
    for (int i=0;i<5;i++) {
      //1. the plotting areas bkg.  
      fill(Beige);
      noStroke();
      rect(plotLeftX[i],plotTopY[i],plotRightX[i],plotBottomY[i]);
      fill(Black);
      textFont(axisFont);
      textAlign(LEFT);
      text(seriesNames[i],plotLeftX[i], plotTopY[i]-3);
      //1. a horizontal gridlines
      stroke(gridLinesColor);
      for (int j=plotTopY[i];j<=plotBottomY[i];j+=10) {
        line(plotRightX[i],j,plotLeftX[i],j);
      }
      //2. insert data here.
      fill(mainFill);
      noStroke();
      for (float j=0;j<186;j+=10) {
        float x=0;
        float y=0;
        x=plotLeftX[i]+(400*j)/186;
        y=plotBottomY[i]-(yValues[PApplet.parseInt(j)][i+1]/matrixDatamax[i])*(plotBottomY[i]-plotTopY[i]);
        rect(x, y, x+(4000/186)+1, plotBottomY[i]);
        // vertical gridlines
        /*stroke(gridLinesColor);
        line(x,plotBottomY[i],x,plotTopY[i]);
        noStroke();*/
      }
      // now let's clean the mess below. 
      fill(lightGrey);
      noStroke();
      rect(plotLeftX[i],plotBottomY[i],plotRightX[i],plotBottomY[i]+10);
      rect(plotLeftX[i]-5,plotTopY[i],plotLeftX[i],plotBottomY[i]);
      rect(plotRightX[i],plotTopY[i],width-1,plotBottomY[i]);

      //3. Axes.
      stroke(Black);
      fill(Black);
      textFont(smallFont);
      textAlign(RIGHT,CENTER);
      line(plotLeftX[i],plotTopY[i],plotLeftX[i],plotBottomY[i]);
      for (int j=plotTopY[i];j<=plotBottomY[i];j+=10) {
        line(plotLeftX[i],j,plotLeftX[i]+2,j);
        text((matrixDatamax[i]/1000)-(j-plotTopY[i])*20, plotLeftX[i]-5,j);
        //3.a insert Y axis labels here.
      }
      line(plotLeftX[i],plotBottomY[i],plotRightX[i],plotBottomY[i]);
      for (float j=0;j<10;j++) {
        float x = plotLeftX[i]+j*20*(plotRightX[i]-plotLeftX[i])/186;
        line(x,plotBottomY[i],x,plotBottomY[i]-2);
        if(i==4) {
          textAlign(CENTER); 

          text(PApplet.parseInt(1820+j*20), x, plotBottomY[i]+12);
        }//3.b insert X axis labels here (bottom chart).
      }

    }
  }
  else
  {         
    textAlign(CENTER);
    textFont(titleFont);
    text("History of immigration to the USA",220,15);
    textFont(subtitleFont);
    text("1821-2006",220,30);

    noFill();
    stroke(Grey);
    rectMode(CORNERS);
    rect(0,0,width-1, height-1);

    //1. the plotting areas bkg.  
    fill(Beige);
    noStroke();
    rect(plotX1,plotY1,plotX2,plotY2);
    fill(Grey);
    rect(plotX1+(1924-1821)*(plotX2-plotX1)/186,plotY1,plotX1+(1965-1821)*(plotX2-plotX1)/186,plotY2);

    //2. gridlines
    //2.a. horizontal lines
    stroke(gridLinesColor);
    strokeWeight(1);
    for (int i=0; i<=6;i++) {
      float y = plotY1+(plotY2-plotY1)*i/6;
      line(plotX1,y,plotX2,y);
    } 
    fill(White);
    textAlign(CENTER, CENTER);
    textFont(smallFont);
    text("Immigration Act", plotX1+(1924+1965-1821-1821)*.5f*(plotX2-plotX1)/186, plotY1+15);

    //3. data.
    //3.a) bars
    fill(mainFill);
    noStroke();
    beginShape();
    vertex(plotX1,plotY2);


    for (int i=0;i<186;i+=10) {
      vertex(plotX1+(i)*(plotX2-plotX1)/186,plotY2-(yValues[i][6]/1200000)*(plotY2-plotY1));
      vertex(plotX1+(i+(i<180?10:6))*(plotX2-plotX1)/186,plotY2-(yValues[i][6]/1200000)*(plotY2-plotY1));  
    }

    vertex(plotX2, plotY2);
    endShape(CLOSE);
    // 3.b) lines
    /// 3.b.1. border
    stroke(White);
    strokeWeight(2);
    noFill();
    beginShape();
    for (int i=4;i<186;i+=10) {  
      vertex(plotX1+i*(plotX2-plotX1)/186, plotY2-(yValues[i][7])*(plotY2-plotY1)+1);
    }
    endShape();

    /// 3.b.2 actual line
    stroke(mainBorder);
    strokeWeight(2);
    noFill();
    beginShape();
    for (int i=4;i<186;i+=10) {  
      vertex(plotX1+i*(plotX2-plotX1)/186, plotY2-(yValues[i][7])*(plotY2-plotY1));
    }
    endShape();

    // 4. Axes
    // 4.a Y-Axes
    // 4.a.1. Axes legends
    textFont(axisFont);
    fill(mainFill);
    textAlign(CENTER, CENTER);
    translate(10, (plotY1+plotY2)/2);
    rotate(radians(-90));
    text("Total naturalizations per year, OOOs", 0,0);
    resetMatrix();          
    fill(mainBorder);
    translate(430, (plotY1+plotY2)/2);
    rotate(radians(-90));
    text("Europeans as percentage of all immigrants", 0,0);
    resetMatrix();   
    // 4.a.2. Axes
    stroke(Black);
    strokeWeight(1); // wonder if it's a good choice. oh well.
    line(plotX1,plotY1,plotX1,plotY2);
    line(plotX1,plotY2,plotX2,plotY2);
    line(plotX2,plotY1,plotX2,plotY2);
    textFont(smallFont);
    fill(Black);
    for (int i=0; i<=6;i++) {
      float y = plotY1+(plotY2-plotY1)*i/6;
      line(plotX1,y,plotX1-2,y);
      line(plotX2,y,plotX2+2,y);

      textAlign(RIGHT,i==0?(i==6?TOP:CENTER):
      BOTTOM);
      text((6-i)*200,plotX1-5,y);
      textAlign(LEFT,i==0?(i==6?TOP:CENTER):
      BOTTOM);
      text((6-i)*100/6,plotX2+5,y);
    } 
    for (int i=0; i<=9;i++) {
      float x = plotX1+(plotX2-plotX1)*i*20/186;

      line(x,plotY2,x,plotY2+3);
      if (i<9) {
        line(x+10*(plotX2-plotX1)/186,plotY2,x+10*(plotX2-plotX1)/186,plotY2+1);
      }
      textAlign(i==0?LEFT:CENTER,TOP);
      text(1820+(i==0?1:0)+i*20,x,plotY2+5);
    }     
  }

}

public void keyPressed() {
  if(graphType.equals("matrix")) {
    graphType="";
  } 
  else {
    graphType="matrix";
  }
}
/*void mousePressed() {
  save("image" + (graphType.equals("matrix")?"_":"") + graphType + ".png");
}*/




  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#e0dfe3", "fdcontest" });
  }
}
