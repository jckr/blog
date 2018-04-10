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

public class simuRetraite extends PApplet {

Integrator[] windowsCoords;
int[][][] boxCoords = new int[4][2][2];
int titleHeight=20;
int[] boxMode = new int[4]; // the shape of the box of a certain id.
int[] boxLoc = new int[4];  // which box id is behind a certain pos.
int[] boxColor = new int[4];
int[] cbScale = new int[11];
int boxSelected=-1;
int boxTarget=-1;
int[][] borderMode = new int[3][4]; // this is the amount of padding in a box, depending on mode.

int[] boxAxisTop = new int[4];   // these are the scales for the boxes.
int[] boxAxisBottom = new int[4];
int[] boxAxisStep = new int[4];
String[] title = new String[4];
int modBox=0;
int calcBox=3;

FloatTable popByAge, retirementAge, employees, emplRate, mass, tauxCot, tauxRempl;

float[] popWorkingAge = new float[71];
float[] popRetired = new float[71];
float[] pop16Over= new float[71];
float[] avgSalary = new float[71];

float[] myEmployees = new float[71];

float[] myRetirementAge = new float[71];
float[] myTauxCot = new float[71];
float[] myTauxRempl = new float[71];
float[] myMass = new float[71];
float[] myReceipts = new float[71];
float[] mySpending = new float[71];
float[] myBalance = new float[71];

float[] myRetirementAgeMin = new float[71];
float[] myRetirementAgeMax = new float[71];
float[] myTauxCotMin = new float[71];
float[] myTauxCotMax = new float[71];
float[] myTauxRemplMin = new float[71];
float[] myTauxRemplMax = new float[71];
float[] myBalanceMin = new float[71];
float[] myBalanceMax = new float[71];

float retirementAgeMin = 16;
float retirementAgeMax = 100;
float tauxCotMin = 0;
float tauxCotMax = 1;
float tauxRemplMin=0;
float tauxRemplMax=0;
float balanceMin=-300000;
float balanceMax=300000;

int minI = 30;

PFont myFont;

float[][] data = new float[4][50];

public void setup() {
  myFont=loadFont("frutiger12.vlw");
  textFont(myFont);
  popByAge = new FloatTable("population.tsv");  
  retirementAge = new  FloatTable("retirementAge.tsv");
  employees = new FloatTable("employees.tsv");
  emplRate = new FloatTable("emplRate.tsv");
  mass = new FloatTable("mass.tsv");
  tauxCot = new FloatTable("tauxCot.tsv");
  tauxRempl = new FloatTable("tauxRempl.tsv");

  for(int i=minI;i<71;i++){

    for(int age=16;age<retirementAge.getFloat(0,i);age++){
      popWorkingAge[i]+=popByAge.getFloat(age,i);
    }

    for(int age=PApplet.parseInt(retirementAge.getFloat(0,i));age<101;age++){
      popRetired[i]+=popByAge.getFloat(age,i);
    }

    pop16Over[i]=popWorkingAge[i]+popRetired[i];
    myEmployees[i]=employees.getFloat(0,i);

    myMass[i]=mass.getFloat(0,i);
    avgSalary[i]=myMass[i]/myEmployees[i];
    

    myRetirementAge[i]=retirementAge.getFloat(0,i);

    myTauxCot[i] = tauxCot.getFloat(0,i);

    myTauxRempl[i] = tauxRempl.getFloat(0,i);
    myReceipts[i]= (myTauxCot[i]*mass.getFloat(0,i));
    mySpending[i]=(avgSalary[i]*myTauxRempl[i]*popRetired[i]);
    myBalance[i]= myReceipts[i]-mySpending[i];
    //println("year "+(1980+i));println("------------------------------------");
    //println("population of working age......"+popWorkingAge[i]);
    //println("population retired............."+popRetired[i]);
    //println("Employees......................"+myEmployees[i]);
    //println("masse salariale................"+mass.getFloat(0,i));
    //println("Average salary................."+avgSalary[i]);
    //println("Retirement age................."+myRetirementAge[i]);
    //println("Taux cotisations..............."+myTauxCot[i]);
    //println("Taux remplacement.............."+myTauxRempl[i]);
    //println("Income........................."+(myTauxCot[i]*myEmployees[i]));
    //println("Spending......................."+(avgSalary[i]*myTauxRempl[i]*popRetired[i]));
    //println("Balance........................"+myBalance[i]);

    println("year "+(1980+i)+": minimum age is "+calcValue(i,0,0,myTauxCot[i],myTauxRempl[i],balanceMin));
    println("year "+(1980+i)+": maximum age is "+calcValue(i,0,0,myTauxCot[i],myTauxRempl[i],balanceMax));
  }
  
  size(800,600);
  title[0]="\u00c2ge de la retraite";
  boxCoords[0][0][0]=20;
  boxCoords[0][0][1]=20;
  boxCoords[0][1][0]=580;
  boxCoords[0][1][1]=380;

  title[1]="Taux de cotisation";
  boxCoords[1][0][0]=600;
  boxCoords[1][0][1]=20;
  boxCoords[1][1][0]=780;
  boxCoords[1][1][1]=190;

  title[2]="Taux de remplacement";
  boxCoords[2][0][0]=600;
  boxCoords[2][0][1]=210;
  boxCoords[2][1][0]=780;
  boxCoords[2][1][1]=380;

  title[3]="Balance";
  boxCoords[3][0][0]=20;
  boxCoords[3][0][1]=400;
  boxCoords[3][1][0]=780;
  boxCoords[3][1][1]=580;

  boxMode[0]=0; // this means: box 0 is modifiable (0), boxes 1 and 2 are thumbnails (1) and box 3 is result (2)
  boxMode[1]=1;
  boxMode[2]=1;
  boxMode[3]=2;
  
  
  borderMode[0][0]=10; // this sets the padding around the boxes. 2nd parameter : 0=top,1=right,2=bottom,3=left.
  borderMode[0][1]=15;
  borderMode[0][2]=40;
  borderMode[0][3]=60;

  borderMode[1][0]=5;
  borderMode[1][1]=5;
  borderMode[1][2]=5;
  borderMode[1][3]=5;
  
  borderMode[2][0]=10; 
  borderMode[2][1]=15;
  borderMode[2][2]=40;
  borderMode[2][3]=60;

  
  boxAxisTop[0]=100;boxAxisBottom[0]=0;
  boxAxisTop[1]=1;boxAxisBottom[1]=0;
  boxAxisTop[2]=1;boxAxisBottom[2]=0;
  boxAxisTop[3]=300000;boxAxisBottom[3]=-300000;
  
  boxLoc[0]=0;
  boxLoc[1]=1;
  boxLoc[2]=2;
  boxLoc[3]=3;
  
 /* boxColor[0]=color(125,145,0);
  boxColor[1]=color(172,235,174);
  boxColor[2]=color(255,255,157);
  boxColor[3]=color(201,222,85);*/
  for (int i=0;i<4;i++){boxColor[i]=0xff4682B4;}
  
  cbScale[0]=0xffA50026;
  cbScale[1]=0xffD73027;
  cbScale[2]=0xffF46D43;
  cbScale[3]=0xffFDAE61;
  cbScale[4]=0xffFEE08B;
  cbScale[5]=0xffFFFFBF;
  cbScale[6]=0xffD9EF8B;
  cbScale[7]=0xffA6D96A;
  cbScale[8]=0xff66BD63;
  cbScale[9]=0xff1A9850;
  cbScale[10]=0xff006837;
  
  
  
  windowsCoords = new Integrator[16];
  
  for(int i=0;i<16;i++) {
    windowsCoords[i]= new Integrator(boxCoords[floor(i/4)][floor((i%4)/2)][i%2]);
  }
  rectMode(CORNERS);

  for(int i=0;i<4;i++){
    data[i][0]=random(100);
    for(int j=1;j<50;j++){
      data[i][j]=data[i][j-1]*(random(.95f,1.05f));
    }
  }
}
public void draw() {
  background(255);

  for (int i=0;i<16;i++) {
    windowsCoords[i].update();
  }

  for (int i=0;i<4;i++) {
    float drawWinX1, drawWinY1,  drawWinX2,  drawWinY2,
          drawAreaX1,drawAreaY1, drawAreaX2, drawAreaY2;    
    
    // drawWinXX & YY are the borders of the windows that are drawn.

    drawWinX1=windowsCoords[i*4].value+(boxSelected==i?10:0);
    drawWinY1=windowsCoords[i*4+1].value-(boxSelected==i?10:0);
    drawWinX2=windowsCoords[i*4+2].value+(boxSelected==i?10:0);
    drawWinY2=windowsCoords[i*4+3].value-(boxSelected==i?10:0);
    
    // drawAreaXX & YY are the borders of the drawing areas for the charts inside the windows.
    
    drawAreaX1=drawWinX1+borderMode[boxMode[i]][3];
    drawAreaY1=drawWinY1+titleHeight+borderMode[boxMode[i]][0]+((i==0&&boxMode[i]!=1)?20:0);
    drawAreaX2=drawWinX2-borderMode[boxMode[i]][1];
    drawAreaY2=drawWinY2-borderMode[boxMode[i]][2];
      
    // this is drawing the box proper.
    
    if(boxSelected==i){noStroke();
      fill(128,128);rect(drawWinX1-10,drawWinY1+10,drawWinX2-10,drawWinY2+10);}
    if(boxTarget!=i){
      fill(boxColor[i]);
    }else{fill(255);}
    stroke(0);rect(drawWinX1,drawWinY1,drawWinX2,drawWinY1+titleHeight);    

    // TO DO. write a title here. (DONE)
    fill(255);
    textAlign(LEFT);
    text(title[i],drawWinX1+5,drawWinY1+15);
    // only the modifiable box is white.

    fill(boxMode[i]==0?255:227);
    rect(drawWinX1,drawWinY1+titleHeight,drawWinX2,drawWinY2);

   // a legend for age chart
   if(i==0&&boxMode[i]==0){noStroke();
     for(int j=0;j<11;j++){
       float sX=map(.75f,0,1,drawAreaX1,drawAreaX2)+10*j;
       fill(cbScale[j]);
       rect(sX,drawAreaY1-13,sX+10,drawAreaY1-5);
       if(j==0){fill(0);text("1",sX+5,drawAreaY1+3);text("Employ\u00e9s / retrait\u00e9",sX,drawAreaY1-18);}
       if(j==5){fill(0);text("2",sX+5,drawAreaY1+3);}
       if(j==10){fill(0);text("4",sX+5,drawAreaY1+3);}
     }
   }

    // now the chart.
    noStroke();
    for (int y=minI;y<71;y++){ // y for year.
      float x01,x02,x1,x2,y1,y2;
      y1=0;
      x01=map(y,minI,71,drawAreaX1,drawAreaX2);
      x02=map(y+1,minI,71,drawAreaX1,drawAreaX2);
      if (boxMode[i]==1){x1=x01;x2=x02;}
      else
      {x1=map(0.1f,0,1,x01,x02);
       x2=map(0.9f,0,1,x01,x02);
      }
      if(i==0)      {y1=map(myRetirementAge[y],boxAxisBottom[0],boxAxisTop[0],drawAreaY2,drawAreaY1);}
      else if(i==1) {y1=map(myTauxCot[y],boxAxisBottom[1],boxAxisTop[1],drawAreaY2,drawAreaY1);}
      else if(i==2) {y1=map(myTauxRempl[y],boxAxisBottom[2],boxAxisTop[2],drawAreaY2,drawAreaY1);}
      else if(i==3) {y1=map(myBalance[y],boxAxisBottom[3],boxAxisTop[3],drawAreaY2,drawAreaY1);}
      y2=map(0,boxAxisBottom[i],boxAxisTop[i],drawAreaY2,drawAreaY1);
      if(y1<drawAreaY1){y1=drawAreaY1;}
      if(y1>drawAreaY2){y1=drawAreaY2;}
      if(i==0){
        float myRatio=myEmployees[y]/popRetired[y];println(myRatio);
        if(myRatio<=1){fill(cbScale[0]);}
        else if(myRatio>3.6f){fill(cbScale[10]);}
        else {fill(cbScale[PApplet.parseInt(5*log(myRatio)/log(1.8f))]);}
      } else {
      fill(boxColor[i]);
      }rect(x1,y1,x2,y2);
      if(mousePressed&&boxMode[i]==0&&mouseX>x1&&mouseX<x2&&boxSelected==-1){
        stroke(0);
        for (float dX=drawAreaX1;dX<drawAreaX2-5;dX+=10)
          {line(dX,mouseY,dX+5,mouseY);}
        noStroke();
      }
        
      if(mouseX>x1&&mouseX<x2&&mouseY>drawAreaY1&&mouseY<drawAreaY2&&boxMode[i]!=1){mouseOver(i,y,drawAreaX1,drawAreaX2,drawAreaY1,drawAreaY2);}

    }
    // axes.
    stroke(0);
    line(drawAreaX1,drawAreaY1,drawAreaX1,drawAreaY2);
    line(drawAreaX1,drawAreaY2,drawAreaX2,drawAreaY2);
    if(i==3){line(drawAreaX1,(drawAreaY1+drawAreaY2)/2,drawAreaX2,(drawAreaY1+drawAreaY2)/2);}
    
        fill(0);
   
        for(int st=0;st<11;st+=(boxMode[i]==0?1:2)){
          float myStepY=map(st,0,10,drawAreaY2,drawAreaY1);
          stroke(0);
          line(drawAreaX1,myStepY,drawAreaX1-2,myStepY);
          line(drawAreaX2,myStepY,drawAreaX2+2,myStepY);
          if(st<10){stroke(255,128);
          line(drawAreaX1,myStepY,drawAreaX2,myStepY);}
          if(boxMode[i]!=1){
          textAlign(RIGHT);
          text(nfs(map(st,0,10,boxAxisBottom[i],boxAxisTop[i])*(i==1?100:i==2?100:i==3?.001f:1),0,0),drawAreaX1-10,myStepY);}
        }
        for(int y=PApplet.parseInt(minI/10);y<8;y++){
          float myStepX=map(y,PApplet.parseInt(minI/10),7,drawAreaX1,drawAreaX2);
          stroke(0);
          line(myStepX,drawAreaY2,myStepX,drawAreaY2+2);
          if(boxMode[i]!=1){
            textAlign(CENTER);
            text(1980+10*y,myStepX,drawAreaY2+15);
        }
        }
  }

}


public void mousePressed() {
  if (boxSelected==-1) {
    for(int i=0;i<4;i++){
      if(mouseX>windowsCoords[i*4].value&&mouseX<windowsCoords[i*4+2].value&&mouseY>windowsCoords[i*4+1].value&&mouseY<windowsCoords[i*4+1].value+titleHeight) {
        boxSelected=i;cursor(MOVE);}
    }  
  }
  if(mouseX>windowsCoords[modBox*4].value+borderMode[0][3]&&mouseX<windowsCoords[modBox*4+2].value-borderMode[0][1]&&mouseY>windowsCoords[modBox*4+1].value+titleHeight+borderMode[0][0]&&mouseY<windowsCoords[modBox*4+3].value-borderMode[0][2]){
    cursor(ARROW);
    int y = PApplet.parseInt(map(mouseX,windowsCoords[modBox*4].value+borderMode[0][3],windowsCoords[modBox*4+2].value-borderMode[0][1]+1,minI,71));
    if (modBox==0){
      int retAge=PApplet.parseInt(map(mouseY,windowsCoords[modBox*4+1].value+titleHeight+20+borderMode[0][0],windowsCoords[modBox*4+3].value-borderMode[0][2],100,0));
      for(int ys=y;ys<71;ys++){
      myRetirementAge[ys]=retAge;
    }
    }
    
    if (modBox==1){
      float myCot=(map(mouseY,windowsCoords[modBox*4+1].value+borderMode[0][0]+titleHeight,windowsCoords[modBox*4+3].value-borderMode[0][2],1,0));
      for(int ys=y;ys<71;ys++){
      myTauxCot[ys]=myCot;
    }
    }
    
    if (modBox==2){
      float myRempl=(map(mouseY,windowsCoords[modBox*4+1].value+borderMode[0][0]+titleHeight,windowsCoords[modBox*4+3].value-borderMode[0][2],1,0));
      //println(y);
      for(int ys=y;ys<71;ys++){
      myTauxRempl[ys]=myRempl;
    }
    }
    
    if (modBox==3){
      float myBal=(map(mouseY,windowsCoords[modBox*4+1].value+borderMode[0][0]+titleHeight,windowsCoords[modBox*4+3].value-borderMode[0][2],300000,-300000));
      //println(y);
      for(int ys=y;ys<71;ys++){
      myBalance[ys]=myBal;
    }
    }
    
    updateValues(y);
    
  }
  //println(boxSelected);
}

public void mouseDragged() {
  if (boxSelected>-1) {
   // noFill();rect(mouseX,mouseY,mouseX+180,mouseY+170);
    if (mouseX>windowsCoords[0].value&&mouseX<windowsCoords[2].value&&mouseY>windowsCoords[1].value&&mouseY<windowsCoords[3].value) {
      boxTarget=0;
    }
    if (mouseX>windowsCoords[4].value&&mouseX<windowsCoords[6].value&&mouseY>windowsCoords[5].value&&mouseY<windowsCoords[7].value) {
      boxTarget=1;
    } 
    if (mouseX>windowsCoords[8].value&&mouseX<windowsCoords[10].value&&mouseY>windowsCoords[9].value&&mouseY<windowsCoords[11].value) {
      boxTarget=2;
    } 
    if (mouseX>windowsCoords[12].value&&mouseX<windowsCoords[14].value&&mouseY>windowsCoords[13].value&&mouseY<windowsCoords[15].value) {
      boxTarget=3;
    }
  }
}


public void mouseReleased() {
  float startX1,startX2,startY1,startY2;
  float endX1,endX2,endY1,endY2;
  int startMode,endMode,startLoc,endLoc;
  if(boxSelected>-1&&boxTarget>-1) {
    startX1=windowsCoords[boxSelected*4].value;
    startY1=windowsCoords[boxSelected*4+1].value;
    startX2=windowsCoords[boxSelected*4+2].value;
    startY2=windowsCoords[boxSelected*4+3].value;
    endX1=windowsCoords[boxTarget*4].value;
    endY1=windowsCoords[boxTarget*4+1].value;
    endX2=windowsCoords[boxTarget*4+2].value;
    endY2=windowsCoords[boxTarget*4+3].value;

    windowsCoords[boxSelected*4].target(endX1);
    windowsCoords[boxSelected*4+1].target(endY1);
    windowsCoords[boxSelected*4+2].target(endX2);
    windowsCoords[boxSelected*4+3].target(endY2);

    windowsCoords[boxTarget*4].target(startX1);
    windowsCoords[boxTarget*4+1].target(startY1);
    windowsCoords[boxTarget*4+2].target(startX2);
    windowsCoords[boxTarget*4+3].target(startY2);
    startMode=boxMode[boxTarget];
    endMode=boxMode[boxSelected];    boxMode[boxTarget]=endMode;
    boxMode[boxSelected]=startMode;
    
    for(int i=0;i<4;i++){if(boxMode[i]==0){modBox=i;}if(boxMode[i]==2){calcBox=i;}} 

  }
  boxSelected=-1;
  boxTarget=-1;
  cursor(ARROW);
}

public void updateValues(int y){
// HERE BE THE SOLVER. GOOD NIGHT.
// FOR THE WIN.

  for(int i=y;i<71;i++){

    if (calcBox!=0) { // ouf, on n'a pas \u00e0 calculer l'\u00e2ge de la retraite en fonction du reste
      int myCalcEmpl=0, myCalcRetr=0;
      for(int age=16;age<=myRetirementAge[i];age++){
        myCalcEmpl+=popByAge.getFloat(age,i);}
      myCalcEmpl*=emplRate.getFloat(0,i);
      for(int age=PApplet.parseInt(myRetirementAge[i]);age<101;age++){
        myCalcRetr+=popByAge.getFloat(age,i);}
    
      myEmployees[i]=myCalcEmpl;
      popRetired[i]=myCalcRetr;
      myMass[i]=myEmployees[i]*avgSalary[i];

      if (calcBox==3){ // on calcule la balance r\u00e9sultante des choix pris
        myReceipts[i]=myMass[i]*myTauxCot[i];
        mySpending[i]=avgSalary[i]*popRetired[i]*myTauxRempl[i];
        myBalance[i]=myReceipts[i]-mySpending[i];
      }
      
      else if(calcBox==1) { // on calcule le taux de cotisation n\u00e9cessaire
        mySpending[i]=avgSalary[i]*popRetired[i]*myTauxRempl[i];
        myReceipts[i]=myBalance[i]+mySpending[i];
        myTauxCot[i]=myReceipts[i]/myMass[i];
      }
      
      else if(calcBox==2) { // on calcule le taux de remplacement n\u00e9cessaire
        myReceipts[i]=myMass[i]*myTauxCot[i];
        mySpending[i]=-myBalance[i]+myReceipts[i];
        myTauxRempl[i]=mySpending[i]/(avgSalary[i]*popRetired[i]);
      }
    }  else { // aie, on doit calculer l'\u00e2ge de la retraite
      float targetPopWA=0,myPopWA=0;
  
      boolean stopCounting = false;
      int myCalcRetirementAge=16;
      targetPopWA=(myBalance[i]+pop16Over[i]*avgSalary[i]*myTauxRempl[i])/(emplRate.getFloat(0,i)*avgSalary[i]*myTauxCot[i]+avgSalary[i]*myTauxRempl[i]);
      for(int age=16;age<101;age++){
        if(!stopCounting){
          myPopWA+=popByAge.getFloat(age,i);
          if(myPopWA>targetPopWA){stopCounting=true;myCalcRetirementAge=age;}
        }
      }
      myRetirementAge[i]=myCalcRetirementAge;
      popWorkingAge[i]=myPopWA;
      popRetired[i]=pop16Over[i]-popWorkingAge[i];
      myEmployees[i]=popWorkingAge[i]*emplRate.getFloat(0,i);
      myMass[i]=myEmployees[i]*avgSalary[i];
      myReceipts[i]=myMass[i]*myTauxCot[i];
      mySpending[i]=avgSalary[i]*popRetired[i]*myTauxRempl[i];
      myBalance[i]=myReceipts[i]-mySpending[i];
    }
  }
}
  
public float calcValue(int i, int myBox,float calcRetAge, float calcTauxCot, float calcTauxRempl, float calcBalance) {
  
      // i : year, myBox : variable \u00e0 calculer
      float myCalcEmpl, myCalcRetr, myCalcMass, myCalcReceipts, myCalcSpending;
      
      if (myBox!=0) { // ouf, on n'a pas \u00e0 calculer l'\u00e2ge de la retraite en fonction du reste
      myCalcEmpl=0; myCalcRetr=0;
      for(int age=16;age<=calcRetAge;age++){
        myCalcEmpl+=popByAge.getFloat(age,i);}
      myCalcEmpl*=emplRate.getFloat(0,i);
      for(int age=PApplet.parseInt(calcRetAge);age<101;age++){
        myCalcRetr+=popByAge.getFloat(age,i);}
    
      myCalcMass=myCalcEmpl*avgSalary[i];

      if (myBox==3){ // on calcule la balance r\u00e9sultante des choix pris
        myCalcReceipts=myCalcMass*calcTauxCot;
        myCalcSpending=avgSalary[i]*myCalcRetr*calcTauxRempl;
        return myCalcReceipts-myCalcSpending;
      }
      
      else if(myBox==1) { // on calcule le taux de cotisation n\u00e9cessaire
        myCalcSpending=avgSalary[i]*myCalcRetr*calcTauxRempl;
        myCalcReceipts=calcBalance-myCalcSpending;
        return myCalcReceipts/myCalcMass;
      }
      
      else if(myBox==2) { // on calcule le taux de remplacement n\u00e9cessaire
        myCalcReceipts=myCalcMass*calcTauxCot;
        myCalcSpending=calcBalance-myCalcReceipts;
        return myCalcSpending/(avgSalary[i]*myCalcRetr);
      }
    }  else { // aie, on doit calculer l'\u00e2ge de la retraite
      float targetPopWA=0,myPopWA=0;
  
      boolean stopCounting = false;
      int myCalcRetirementAge=16;

      targetPopWA=(calcBalance+pop16Over[i]*avgSalary[i]*calcTauxRempl)/(emplRate.getFloat(0,i)*avgSalary[i]*calcTauxCot+avgSalary[i]*calcTauxRempl);
      //println("pop16Over["+i+"]="+pop16Over[i]/1000000);
      //println("avg salary="+avgSalary[i]);
      //println("taux rempl="+calcTauxRempl);
      //println("empl rate="+emplRate.getFloat(0,i));
      //println("taux cot="+calcTauxCot);
      //println("calcTauxRempl="+calcTauxRempl);
      //println("For a target balance of "+calcBalance+" we need a popWA of "+targetPopWA);
      for(int age=16;age<101;age++){
        if(!stopCounting){        
          myPopWA+=popByAge.getFloat(age,i);
          //println("if we add people aged "+age+", we get "+myPopWA+".");
          if(myPopWA>targetPopWA){
            //println("We have enough!");
            stopCounting=true;myCalcRetirementAge=age;
        }
        }
      }
      if (myPopWA<targetPopWA) {myCalcRetirementAge=100;}
      return PApplet.parseFloat(myCalcRetirementAge);
    }
    return -1.0f;
}

public void mouseOver(int i, int y, float x1,float x2,float y1, float y2){
  int boxX=0, boxY=0;
  fill(0);
  if (i==0){text((y+1980)+": \u00c2ge de la retraite: "+nfs(myRetirementAge[y],0,0)+", employ\u00e9s par retrait\u00e9: "+nfs(myEmployees[y]/popRetired[y],1,1),x1+5,y1+5-((boxMode[i]!=1)?20:0));}
  if (i==1){text((y+1980)+": Taux de cotisations: "+nfs(PApplet.parseInt(100*myTauxCot[y]),0,0)+"%, recettes totales: "+PApplet.parseInt(myReceipts[y]/1000)+" milliards d'euros",x1+5,y1+5);}
  if (i==2){text((y+1980)+": Taux de remplacement: "+nfs(PApplet.parseInt(100*myTauxRempl[y]),0,0)+"%, d\u00e9penses totales: "+PApplet.parseInt(mySpending[y]/1000)+" milliards d'euros",x1+5,y1+5);}
  if (i==3){text((y+1980)+": Balance des retraites: "+PApplet.parseInt(myBalance[y]/1000)+" milliards d'euros",x1+5,y1+5);}
}
// first line of the file should be the column headers
// first column should be the row titles
// all other values are expected to be floats
// getFloat(0, 0) returns the first data value in the upper lefthand corner
// files should be saved as "text, tab-delimited"
// empty rows are ignored
// extra whitespace is ignored


class FloatTable {
  int rowCount;
  int columnCount;
  float[][] data;
  String[] rowNames;
  String[] columnNames;
  
  
  FloatTable(String filename) {
    String[] rows = loadStrings(filename);
    
    String[] columns = split(rows[0], TAB);
    columnNames = subset(columns, 1); // upper-left corner ignored
    scrubQuotes(columnNames);
    columnCount = columnNames.length;

    rowNames = new String[rows.length-1];
    data = new float[rows.length-1][];

    // start reading at row 1, because the first row was only the column headers
    for (int i = 1; i < rows.length; i++) {
      if (trim(rows[i]).length() == 0) {
        continue; // skip empty rows
      }
      if (rows[i].startsWith("#")) {
        continue;  // skip comment lines
      }

      // split the row on the tabs
      String[] pieces = split(rows[i], TAB);
      scrubQuotes(pieces);
      
      // copy row title
      rowNames[rowCount] = pieces[0];
      // copy data into the table starting at pieces[1]
      data[rowCount] = parseFloat(subset(pieces, 1));

      // increment the number of valid rows found so far
      rowCount++;      
    }
    // resize the 'data' array as necessary
    data = (float[][]) subset(data, 0, rowCount);
  }
  
  
  public void scrubQuotes(String[] array) {
    for (int i = 0; i < array.length; i++) {
      if (array[i].length() > 2) {
        // remove quotes at start and end, if present
        if (array[i].startsWith("\"") && array[i].endsWith("\"")) {
          array[i] = array[i].substring(1, array[i].length() - 1);
        }
      }
      // make double quotes into single quotes
      array[i] = array[i].replaceAll("\"\"", "\"");
    }
  }
  
  
  public int getRowCount() {
    return rowCount;
  }
  
  
  public String getRowName(int rowIndex) {
    return rowNames[rowIndex];
  }
  
  
  public String[] getRowNames() {
    return rowNames;
  }

  
  // Find a row by its name, returns -1 if no row found. 
  // This will return the index of the first row with this name.
  // A more efficient version of this function would put row names
  // into a Hashtable (or HashMap) that would map to an integer for the row.
  public int getRowIndex(String name) {
    for (int i = 0; i < rowCount; i++) {
      if (rowNames[i].equals(name)) {
        return i;
      }
    }
    //println("No row named '" + name + "' was found");
    return -1;
  }
  
  
  // technically, this only returns the number of columns 
  // in the very first row (which will be most accurate)
  public int getColumnCount() {
    return columnCount;
  }
  
  
  public String getColumnName(int colIndex) {
    return columnNames[colIndex];
  }
  
  
  public String[] getColumnNames() {
    return columnNames;
  }


  public float getFloat(int rowIndex, int col) {
    // Remove the 'training wheels' section for greater efficiency
    // It's included here to provide more useful error messages
    
    // begin training wheels
    if ((rowIndex < 0) || (rowIndex >= data.length)) {
      throw new RuntimeException("There is no row " + rowIndex);
    }
    if ((col < 0) || (col >= data[rowIndex].length)) {
      throw new RuntimeException("Row " + rowIndex + " does not have a column " + col);
    }
    // end training wheels
    
    return data[rowIndex][col];
  }
  
  
  public boolean isValid(int row, int col) {
    if (row < 0) return false;
    if (row >= rowCount) return false;
    //if (col >= columnCount) return false;
    if (col >= data[row].length) return false;
    if (col < 0) return false;
    return !Float.isNaN(data[row][col]);
  }


  public float getColumnMin(int col) {
    float m = Float.MAX_VALUE;
    for (int row = 0; row < rowCount; row++) {
      if (isValid(row, col)) {
        if (data[row][col] < m) {
          m = data[row][col];
        }
      }
    }
    return m;
  }


  public float getColumnMax(int col) {
    float m = -Float.MAX_VALUE;
    for (int row = 0; row < rowCount; row++) {
      if (isValid(row, col)) {
        if (data[row][col] > m) {
          m = data[row][col];
        }
      }
    }
    return m;
  }

  
  public float getRowMin(int row) {
    float m = Float.MAX_VALUE;
    for (int col = 0; col < columnCount; col++) {
      if (isValid(row, col)) {
        if (data[row][col] < m) {
          m = data[row][col];
        }
      }
    }
    return m;
  } 


  public float getRowMax(int row) {
    float m = -Float.MAX_VALUE;
    for (int col = 0; col < columnCount; col++) {
      if (isValid(row, col)) {
        if (data[row][col] > m) {
          m = data[row][col];
        }
      }
    }
    return m;
  }


  public float getTableMin() {
    float m = Float.MAX_VALUE;
    for (int row = 0; row < rowCount; row++) {
      for (int col = 0; col < columnCount; col++) {
        if (isValid(row, col)) {
          if (data[row][col] < m) {
            m = data[row][col];
          }
        }
      }
    }
    return m;
  }


  public float getTableMax() {
    float m = -Float.MAX_VALUE;
    for (int row = 0; row < rowCount; row++) {
      for (int col = 0; col < columnCount; col++) {
        if (isValid(row, col)) {
          if (data[row][col] > m) {
            m = data[row][col];
          }
        }
      }
    }
    return m;
  }
}
class Integrator {

  final float DAMPING = 0.5f;
  final float ATTRACTION = 0.2f;

  float value;
  float vel;
  float accel;
  float force;
  float mass = 1;

  float damping = DAMPING;
  float attraction = ATTRACTION;
  boolean targeting;
  float target;


  Integrator() { }


  Integrator(float value) {
    this.value = value;
  }


  Integrator(float value, float damping, float attraction) {
    this.value = value;
    this.damping = damping;
    this.attraction = attraction;
  }


  public void set(float v) {
    value = v;
  }


  public void update() {
    if (targeting) {
      force += attraction * (target - value);      
    }

    accel = force / mass;
    vel = (vel + accel) * damping;
    value += vel;

    force = 0;
  }


  public void target(float t) {
    targeting = true;
    target = t;
  }


  public void noTarget() {
    targeting = false;
  }
}
  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#e0dfe3", "simuRetraite" });
  }
}
