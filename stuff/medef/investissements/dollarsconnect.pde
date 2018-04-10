/*created by Jen Lowe Feb 2012 for Captain Dash*/

//load fonts
/* @pjs font='Neutraface2Display-Bold.otf, Neutraface2Display-Light.otf', 'QuorumBookITC.otf' */

//initialize everything
int incountryTotal = 5;
int outcountryTotal = 110; 

incountry[] incountries = new incountry[incountryTotal]; //24 countries in euro data
outcountry[] outcountries = new outcountry[outcountryTotal]; //estimation

button[] thresholdButtons = new button[5];

HashMap cnames = new HashMap();
HashMap connect = new HashMap();
HashMap inCountryLoc = new HashMap();
HashMap outCountryLoc = new HashMap();

//center of the major circle
int centerx = 512;
int centery = 390;
//radius of the major circle
int circleRad = 180;
//starting the connection threshold at 0 so all connections are shown
int connectThreshold = 0;
//positioning the threshold buttons
int buttonx = 40;
int buttony = 260;

//setting up the allowed colors
//color backcol = color(201,255,237);
color backcol = color(255,248,206);
color pink = color(250, 104, 116);//color(#FA6874);
color medblue = color(110, 204, 189);//color(#6ECCBD);
color purple = color(95, 69, 148);//color(#FD838D);
color yellow = color(230, 225, 94);//color(#FFFCE8);// 
color lightpink = color(248, 246, 207);
color lightgrey = color(242, 242, 242);
color darkgrey = color(87, 87, 87);

//here is where to set the France color
color FranceColor = medblue;
color FocusFranceColor = pink;

//labels for the threshold buttons
String[] threshlabels = {"Tout afficher", "> 100 millions", "> 1 milliard", "> 10 milliards", "> 100 milliards"};

PFont nBfont;  
PFont nLfont;  
PFont qfont;

int onoff;

void setup() {
  frameRate(10);
  size(1024, 748);
  smooth();
  
  //reading in the data
  getcnames(); 
  getInCountries("incountries5.csv");
  getOutCountries("outcountriesordered5.csv");
  getConnections("connections5.csv");  
  
  setupButtons();
  
  updateLocHash();
  
  //finish loading fonts  
  nBfont = loadFont("Neutraface2Display-Bold.otf");
  nLfont = loadFont("Neutraface2Display-Light.otf"); 
  qfont = loadFont("QuorumBookITC.otf"); 
  onoff=0;
}

void draw() {
  
  //set background color  
  background(backcol);
  
  //title and subtitle
  fill(pink);
  textFont(nBfont, 32);
  text("LA FRANCE EST LA 4     DESTINATION", 30, 90);
  textFont(nBfont, 16);
  text("ÈME", 315, 80);
  fill(purple);
  textFont(nBfont, 32);
  text("DES INVESTISSEMENTS ÉTRANGERS AU MONDE", 30, 120);
  fill(darkgrey);
  textFont(nLfont, 20);
  text("STOCKS ENTRANTS D'INVESTISSEMENTS DIRECTS À L'ÉTRANGER, DOLLARS", 30, 150);
  
  //title for buttons  
  textFont(nBfont, 16);
  fill(purple);
  text("INVESTISSEMENTS", buttonx-11, buttony);
  
  renderButtons();

  onoff=0;
  for (int i = 0; i <incountries.length; i++) {
     if (incountries[i].toggleOn) {onoff=1;}
  }

  
  //render connections and large countries
  for (int i=0; i<incountries.length; i++) {  
    if (i != 3) {
     incountries[incountries.length-i-1].renderConnections();
     incountries[incountries.length-i-1].update();    
     incountries[incountries.length-i-1].render();
    }
  }
  
  //re-render France so it sits on top
  incountries[1].renderConnections();
  incountries[1].update();    
  incountries[1].render();
  
  //render tiny countries
  for (int i=0; i<outcountries.length; i++) {  
      outcountries[i].update();
      outcountries[i].render();
  } 
}

void getInCountries(String path) { 
  //Load the strings from the csv 
  String[] pArray = loadStrings(path);
  for (int i = 0; i < pArray.length; i++) {
    //read each line in and initialize a new incountry
    incountry ic = new incountry().fromCSV(split(pArray[i], ","));
    ic.rank=i;
    ic.init();    
    incountries[i] = ic;
  }
} 


void getOutCountries(String path) {  
  //Load the strings from the csv
  String[] pArray = loadStrings(path);
  for (int i = 0; i < pArray.length; i++) {
    //read each line in and initialize a new incountry
    outcountry oc = new outcountry().fromCSV(split(pArray[i], ","));;
    oc.rank=i;
    oc.init();
    outcountries[i] = oc;
  }
} 

void getConnections(String path) {
  String[] pArray = loadStrings(path);
  String[] inCode = new String[pArray.length];
  ArrayList breaks = new ArrayList();
  int count = 1;
  //find the number of in countries in the file
  for (int i = 0; i < pArray.length; i++) {
    String[] sa = split(pArray[i], ",");
    inCode[i] = sa[0];
    if (i > 0 && !inCode[i].equals(inCode[i-1])) {
      count++;
      breaks.add(i);
    }
  }
  
    //now read in the connections  
    for (int i = 0; i < count; i++) {
    HashMap theseOutCountries = new HashMap();
    String thisInCountry = new String();
    int startix;
    int endix;
    if (i == 0) {
      startix = 0;
    } else {
      startix = (Integer) breaks.get(i-1);
    }
    if (i == count-1) {
      endix = pArray.length;
    } else {
      endix = (Integer) breaks.get(i);
    }    
    for (int j = startix; j < endix; j++) {
      String[] sa = split(pArray[j], ",");
      if (j == startix) {
        thisInCountry = sa[0];
      }
      theseOutCountries.put(sa[1], sa[2]);
    }    
    
    connect.put(thisInCountry, theseOutCountries);  
  }

  for (int i = 0; i < incountries.length; i++) {
    if (connect.containsKey(incountries[i].Code)) {
      incountries[i].theseconnections = (HashMap) connect.get(incountries[i].Code);  
    }
  }  
}

void updateLocHash() {
  for (int i = 0; i < incountries.length; i++) {
    float[] inloc = {incountries[i].xloc, incountries[i].yloc};
    inCountryLoc.put(incountries[i].Code,inloc);
  }

  for (int i = 0; i < outcountries.length; i++) {
    float[] outloc = {outcountries[i].xloc, outcountries[i].yloc};
    outCountryLoc.put(outcountries[i].Code,outloc);
  }
}

void setupButtons() {
 for (int i = 0; i <  thresholdButtons.length; i++) {
   button b = new button().init(threshlabels[i], buttonx, buttony + 30 + 50*i);
   thresholdButtons[i] = b;
 }
 thresholdButtons[3].state = 1;
 connectThreshold = 10000;
}

void renderButtons() {
 for (int i = 0; i <  thresholdButtons.length; i++) {
   thresholdButtons[i].render();
 }  
}

void mousePressed() {
 for (int i = 0; i <  thresholdButtons.length; i++) {
   thresholdButtons[i].update();   
   thresholdButtons[i].onPress();
 }    
 for (int i = 0; i < incountries.length; i++) {
  incountries[i].onPress(); 
 }
 
}

void getcnames() {
    cnames.put("USA", "États-Unis");
    cnames.put("FRA", "France");
    cnames.put("GBR", "Royaume-Uni");
    cnames.put("BEL", "Belgique");
    cnames.put("DEU", "Allemagne");
    cnames.put("NLD", "Pays-Bas");
    cnames.put("ESP", "Espagne");
    cnames.put("CAN", "Canada");
    cnames.put("CHE", "Suisse");
    cnames.put("AUS", "Australie");
    cnames.put("ITA", "Italie");
    cnames.put("SWE", "Suède");
    cnames.put("HUN", "Hongrie");
    cnames.put("IRL", "Irlande");
    cnames.put("MEX", "Mexique");
    cnames.put("JPN", "Japon");
    cnames.put("POL", "Pologne");
    cnames.put("AUT", "Autriche");
    cnames.put("DNK", "Danemark");
    cnames.put("NOR", "Norvège");
    cnames.put("TUR", "Turquie");
    cnames.put("CZE", "Rép. tchèque");
    cnames.put("CHL", "Chili");
    cnames.put("SKO", "Corée"); //need to check that these are both s. korea
    cnames.put("PRT", "Portugal");
    cnames.put("LUX", "Luxembourg");
    cnames.put("FIN", "Finlande");
    cnames.put("NZL", "Nouvelle-Zélande");
    cnames.put("ISR", "Israël");
    cnames.put("SVK", "Rép. slovaque"); //need to check that these are both slovakia
    cnames.put("GRC", "Grèce");
    cnames.put("EST", "Estonie");
    cnames.put("SVN", "Slovénie");
    cnames.put("ISL", "Islande");
    cnames.put("CYP", "Chypre");
    cnames.put("LIE", "Liechtenstein");
    cnames.put("MLT", "Malte");
    cnames.put("RUS", "Russie");
    cnames.put("ZAF", "Afrique du Sud");
    cnames.put("ARG", "Argentine");
    cnames.put("BRA", "Brésil");
    cnames.put("VEN", "Venezuela");
    cnames.put("CHN", "Chine");
    cnames.put("HKG", "Hong Kong");
    cnames.put("MYS", "Malaisie");
    cnames.put("SGP", "Singapour");
    cnames.put("TAI", "Taipei chinois");
    cnames.put("THA", "Thaïlande");
    cnames.put("GUE", "Guernesey");
    cnames.put("ROU", "Roumanie");
    cnames.put("TUN", "Tunisie");
    cnames.put("BMU", "Bermudes");
    cnames.put("NEA", "Antilles");
    cnames.put("USV", "Îles Vierges");
    cnames.put("COL", "Colombie");
    cnames.put("IDN", "Indonesie");
    cnames.put("KAZ", "Kazakhstan");
    cnames.put("PHL", "Philippines");
    cnames.put("BLR", "Biélorussie");
    cnames.put("BGR", "Bulgarie");
    cnames.put("HRV", "Croatie");
    cnames.put("GIB", "Gibraltar");
    cnames.put("IMN", "Île de Man");
    cnames.put("JER", "Jersey");
    cnames.put("MKD", "Macédoine");
    cnames.put("UKR", "Ukraine");
    cnames.put("GIN", "Guinée");
    cnames.put("MUS", "Maurice");
    cnames.put("BHS", "Bahamas");
    cnames.put("CYM", "Îles Cayman");
    cnames.put("IND", "India");
    cnames.put("PAN", "Panama");
    cnames.put("VCT", "St. Vincent et Grenadines");
    cnames.put("GUY", "Guyana");
    cnames.put("KGZ", "Kirghizistan");
    cnames.put("UZB", "Ouzbékistan");
    cnames.put("MHL", "Îles Marshall");
    cnames.put("FRO", "Îles Féroé");
    cnames.put("EGY", "Egypte");
    cnames.put("GRL", "Groenland");
    cnames.put("IRN", "Rép. islamique d'Iran");
    cnames.put("BGD", "Bangladesh");
    cnames.put("VNM", "Viet Nam");
    cnames.put("AND", "Andorre");
    cnames.put("VAT", "Saint - Siège  (Etat de la Cité du Vatican)");
    cnames.put("MDA", "Rép. de Moldavie");
    cnames.put("GNQ", "GIN Equatoriale");
    cnames.put("LBR", "Libéria");
    cnames.put("MWI", "Malawi");
    cnames.put("SYC", "Seychelles");
    cnames.put("BLZ", "Belize");
    cnames.put("DMA", "Dominique");
    cnames.put("KNA", "St. Kitts et Nevis");
    cnames.put("BOL", "Bolivie");
    cnames.put("TKM", "Turkménistan");
    cnames.put("SLB", "Îles Salomon");
    cnames.put("TTA", "Territoires des terres australes et antarctiques françaises");
    cnames.put("VUT", "Vanuatu");
    cnames.put("DRC", "Rép. du Congo");
    cnames.put("PER", "Pérou");
    cnames.put("DZA", "Algérie");
    cnames.put("LBY", "Libye");
    cnames.put("MAR", "Maroc");
    cnames.put("AGO", "Angola");
    cnames.put("CMR", "Cameroun");
    cnames.put("TCD", "Tchad");
    cnames.put("CIV", "Côte d'Ivoire");
    cnames.put("GAB", "Gabon");
    cnames.put("KEN", "Kenya");
    cnames.put("MLI", "Mali");
    cnames.put("NGA", "Nigeria");
    cnames.put("SEN", "Sénégal");
    cnames.put("BRB", "Barbade");
    cnames.put("TTO", "Trinité - et - Tobago");
    cnames.put("URY", "Uruguay");
    cnames.put("SRB", "Serbie");
    cnames.put("SWZ", "Swaziland");
    cnames.put("BIH", "Bosnie - Herzégovine");
    cnames.put("MNE", "Monténégro");
    cnames.put("CRI", "Costa Rica");
    cnames.put("DOM", "Rép. Dominicaine");
    cnames.put("SUR", "Suriname");
    cnames.put("BWA", "Botswana");
    cnames.put("BFA", "Burkina Faso");
    cnames.put("ETH", "Ethiopie");
    cnames.put("GHA", "Ghana");
    cnames.put("MRT", "Mauritanie");
    cnames.put("MOZ", "Mozambique");
    cnames.put("NAM", "Namibie");
    cnames.put("NER", "Niger");
    cnames.put("RWA", "Rwanda");
    cnames.put("SLE", "Sierra Leone");
    cnames.put("TZA", "Rép. - Unie de Tanzanie");
    cnames.put("TGO", "Togo");
    cnames.put("UGA", "Ouganda");
    cnames.put("ZMB", "Zambie");
    cnames.put("ZWE", "Zimbabwe");
    cnames.put("ABW", "Aruba");
    cnames.put("SLV", "El Salvador");
    cnames.put("GTM", "Guatemala");
    cnames.put("JAM", "Jamaïque");
    cnames.put("NIC", "Nicaragua");
    cnames.put("LCA", "Sainte - Lucie");
    cnames.put("ECU", "Equateur");
    cnames.put("BRN", "Brunéi Darussalam");
    cnames.put("KHM", "Cambodge");
    cnames.put("PRK", "Corée du Nord");
    cnames.put("LAO", "Rép. dém. populaire lao");
    cnames.put("MAC", "Macao");
    cnames.put("PAK", "Pakistan");
    cnames.put("LKA", "Sri Lanka");
    cnames.put("COO", "Îles Cook");
    cnames.put("NAU", "Nauru");
    cnames.put("CPV", "Cap Vert");
    cnames.put("USM", "Îles mineures éloignées des Etats - Unis");
    cnames.put("ALB", "Albanie");
    cnames.put("GNB", "Guinea-Bissau");
    cnames.put("STP", "Sao Tomé - et - Principe");
    cnames.put("ANG", "Anguilla");
    cnames.put("TCA", "Îles Turks et Caïcos");
    cnames.put("NAEUR", "Non attribué Europe");
    cnames.put("NAAPR", "Non attribué Autres Pays Africains");
    cnames.put("NAADN", "Non attribué Afrique du Nord");
    cnames.put("NAAFR", "Non attribué Afrique");
    cnames.put("NAAC", "Non attribué Amérique Centrale");
    cnames.put("NAAS", "Non attribué Amérique du Sud");
    cnames.put("NAAA", "Non attribué Amérique");
    cnames.put("NAPMO", "Non attribué Proche et Moyen Orient");
    cnames.put("NAAPA", "Non attribué Autres pays d' Asie");
    cnames.put("NAORP", "Non attribué Oceanie, Régions polaires");
    cnames.put("NATM", "Non attribué Total Monde");
    cnames.put("NAOCDE", "Non attribué OCDE");
    cnames.put("PCN", "Îles Pitcairn");
    cnames.put("ATG", "Antigua et Barbuda");
    cnames.put("GRD", "Grenade");
    cnames.put("AFG", "Afghanistan");
    cnames.put("PNG", "Papouasie Nouv. Guinée");
}


class button {

  PVector pos = new PVector();

  float butrad = 22; 
  String label;
  
  int state = 0;
  
  boolean buttonOver = false; 
 
  //Constructor function
  button() {};
    
  button init(String s, int thisx, int thisy) {
      label = s;
      pos.x = thisx;
      pos.y = thisy;
      
      return(this);
  }

  button update() {
        
      float disX = pos.x - mouseX;
      float disY = pos.y - mouseY;
      if(sqrt(sq(disX) + sq(disY)) < butrad/2 ) {
        buttonOver = true;
      } else {
        buttonOver = false;
      }  
  }

  void render() {
    
    //could use for hover over
    if (!buttonOver) {
    } else {
    }     
        
    pushMatrix(); //taking us to the BUTTON AREA
    
      translate(pos.x, pos.y);
    
      stroke(purple);
      strokeWeight(3);
      textFont(nBfont,16);
        
      if (state == 0) {
        noFill();
        ellipse(0, 0, butrad, butrad);
        fill(darkgrey);
        text(label, butrad/2 + 10, 3);                   
      } 
      else { //state == 1
        fill(purple);
        ellipse(0, 0, butrad, butrad);        
        fill(darkgrey);
        text(label, butrad/2 + 10, 3);        
      }
    
    popMatrix(); //ending BUTTON AREA push    
  }

  void onPress() {
    if (buttonOver) {
      buttonPress();
    }
  }

  void buttonPress() {
     for (int i = 0; i <  thresholdButtons.length; i++) {
       thresholdButtons[i].state = 0; //set all buttons to 0
     }        
     state = 1; //set this button to 1
     
     //change the connection threshold
     if (label == "Tout afficher") {connectThreshold = 0;}
     else if (label == "> 100 millions") {connectThreshold = 100;}
     else if (label == "> 1 milliard") {connectThreshold = 1000;}
     else if (label == "> 10 milliards") {connectThreshold = 10000;}
     else if (label == "> 100 milliards") {connectThreshold = 100000;}
  }  
}

/*
Name     :  [1]
TotalIn  :  [2]
*/

class incountry {
  
  color col;
  color focuscol; 
  color fadecol;
  
  String Code;
  String Name;
  String DollarText;
  
  int TotalIn;
  int rank;
  
  float xloc;
  float yloc;
  float diam;
  float rotateRad;
  
  boolean toggleOn = false;

  HashMap theseconnections = new HashMap();
 
  //Constructor function
  incountry() {};
 
  //Load country data from a comma-delimited string
  incountry fromCSV(String[] sa) {
    Code = sa[0];
    //println(Name);
    TotalIn = int(sa[1]);
    
    return(this);
  } 
  
  //initialize Name, color, diameter, and position
  incountry init() {
    
    if (cnames.containsKey(Code)) Name = (String) cnames.get(Code);
    
    Name = Name.toUpperCase();
       
    diam = map(sqrt(TotalIn), 0, sqrt(2114501), 0, 90); //90 for just 10 countries; 2114501 is max (US) 
 
    //doing the final positioning of the destination countries
    //by hand based on the actual sized of the circles
    if (rank == 0) {   
      rotateRad = (incountryTotal-rank)*PI/(incountryTotal+2.5)+25*PI/16+0.04;
    } else if (rank == 1) {
      rotateRad = (incountryTotal-rank)*PI/(incountryTotal+2.5)+25*PI/16-0.07;
    } else if (rank == 2) {
      rotateRad = (incountryTotal-rank)*PI/(incountryTotal+2.5)+25*PI/16-0.09;
    } else if (rank == 3) {
      rotateRad = (incountryTotal-rank)*PI/(incountryTotal+2.5)+25*PI/16-0.08;
    } else if (rank == 4) {
      rotateRad = (incountryTotal-rank)*PI/(incountryTotal+2.5)+25*PI/16-0.03;
    }      
    
    xloc = centerx + circleRad*cos(rotateRad);
    yloc = centery - circleRad*sin(rotateRad);
    
  /*
  Hello, 

Pour moi, il a trop de couleurs et d'états différents.
Les cercles doivent toujours être de la même couleur que les traits associés.
Pour simplifier la compréhension, il faut 2 états :

1. éteint : #FFFCE8 (cercle + traits)
1. éteint-France : #6ECCBD (cercle + traits)

2. sélectionné : #FD838D (cercle + traits)
2. sélectionné-France : #FA6874 (cercle + traits)

La typo est ok pour moi.
Par contre, il faudrait écrire les stocks d'investissement sous les pays de la même manière que dans la légende (même taille, même couleur).
Attention au format qui doit être 1024x748.
Il faut une marge suffisante au-dessus du titre : la même qu'à gauche du titre.

*/

    //set France color separately
    if (Name == "FRANCE") {
      col = color(#6ECCBD);//FranceColor;
      focuscol = color(#FA6874);FocusFranceColor;
    }
    else {
      col = color(#FFFCE8);//yellow;
      focuscol = color(#FA6874);//FocusFranceColor;// purple;
    }
    
    if (Name == "ÉTATS-UNIS") {
      DollarText = "2 114 milliards";
    } else if (Name == "FRANCE") {
      DollarText = "1 086 milliards";
    } else if (Name == "ROYAUME-UNI") {
      DollarText = "1 058 milliards";
    } else if (Name == "ALLEMAGNE") {
      DollarText = "937 milliards"; //? should this be millions or million
    } else if (Name == "JAPON") {
      DollarText = "200 milliards";
    }   
    
    return(this);
  }

  //update
  void update() {
    //not doing anything with this
  }

  //Draw
  void render() {

      if (toggleOn) { 
        fill(focuscol);
        noStroke(); 
      }
      else {
        //if(onoff>0) {fill(purple);} else {
          fill(col);
        //}
        noStroke();
        //fill(col);
        //stroke(purple); no stroke
        //strokeWeight(4);  
      }    
      ellipse(xloc, yloc, diam, diam);
      //not changing text color on toggle as per art directors 
      //if (toggleOn) { fill(focuscol); }
      //else {fill(purple);}
      fill(purple); //text always purple
      textFont(nBfont,20);
      text(Name, xloc+diam/2+15, yloc+8);
      if (toggleOn) {
        fill(color(#575757));
        textFont(nBfont,16);
        text(DollarText, xloc+diam/2+17, yloc+30);
      }
    
    
//    pushMatrix();
//      translate(centerx, centery);
//      rotate(rotateRad);
//      translate(-circleRad, 0);
//      //if (mouseOver()) { fill(focuscol); }
//      if (toggleOn) { fill(focuscol); }
//      else {fill(col);}
//      stroke(purple);
//      strokeWeight(4);
//      ellipse(0, 0, diam, diam);
//      //if (mouseOver()) { fill(focuscol); }
//      if (toggleOn) { fill(focuscol); }
//      else {fill(purple);}
//      textFont(nLfont,20);
//      text(Name, -diam/2-textWidth(Name)-15, 5);
//      if (toggleOn) {
//        text(TotalIn, -diam/2-textWidth(Name)-15, 23);
//      }
//    popMatrix();




  }
  
  void renderConnections() {
    HashMap connectionInfo = (HashMap) connect.get(Code);
    Iterator i = theseconnections.entrySet().iterator();  // Get an iterator
    while (i.hasNext()) {
      Map.Entry me = (Map.Entry)i.next();
      String outcode = (String) me.getKey();
      if (outCountryLoc.containsKey(outcode) && connectionInfo.get(outcode) > connectThreshold) {
        float[] outloc = (float[]) outCountryLoc.get(outcode); //this is an array with {xloc, yloc}
        
        if (connectionInfo.get(outcode) > 100000) {
          strokeWeight(5);
        } else if (connectionInfo.get(outcode) > 10000) {
          strokeWeight(4);
        } else if (connectionInfo.get(outcode) > 1000) {
          strokeWeight(3);
        } else if (connectionInfo.get(outcode) > 100) {
          strokeWeight(2);
        } else { 
          strokeWeight(1);
        }
        colorMode(HSB);
        if (toggleOn) { 
          stroke(hue(focuscol), saturation(focuscol), brightness(focuscol), 150);
        }
        else {
          stroke(hue(col), saturation(col), brightness(col), 150);
        }
        colorMode(RGB);
        noFill();   
        bezier(xloc, yloc, xloc, yloc, centerx, centery, outloc[0], outloc[1]);
      }    
    }      
  }

  void mouseOver() {
      float disX = xloc - mouseX;
      float disY = yloc - mouseY;
      if(sqrt(sq(disX) + sq(disY)) < diam/2 ) {
        return true;
      } else {
        return false;
      }  
  }

  void onPress() {
    if (mouseOver()) {
     toggleOn = !toggleOn;

    } 
  }  
}
/*
Name     :  [1]
TotalOut  :  [2]
*/

class outcountry {
  
  String Code;
  String Name;
  
  int TotalOut;
  int rank;
  
  float xloc = 0;
  float yloc = 0;
  float smalldiam = 4;
  float diam = 0;
  float rotateRad = 0;
 
  //Constructor function
  outcountry() {};
 
  //Load country data from a comma-delimited string
  outcountry fromCSV(String[] sa) {
    Code = sa[0];
    TotalOut = int(sa[1]);
    
    return(this);
  } 
  
  //initialize radius, and position
  outcountry init() {
 
    if (cnames.containsKey(Code)) Name = (String) cnames.get(Code);
    
    diam = map(sqrt(TotalOut), 0, sqrt(2114501), 0, 90); //90 for just 10 countries; 2114501 is max (US) 
  
    //shifting a little for each region break  
    if (rank < 35) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8; //adding 0.2 to shift a little
    } else if (rank < 40) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.04; //adding 0.2 to shift a little
    } else if (rank < 55) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.08; //adding 0.2 to shift a little
    } else if (rank < 58) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.12; //adding 0.2 to shift a little
    } else if (rank < 62) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.16; //adding 0.2 to shift a little
    } else if (rank < 77) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.20; //adding 0.2 to shift a little
    } else if (rank < 87) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.24; //adding 0.2 to shift a little
    } else if (rank < 105) {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.28; //adding 0.2 to shift a little
    } else {
      rotateRad = rank*PI/(outcountryTotal-15)+3*PI/8 + 0.32; //adding 0.2 to shift a little
    }      
    
    xloc = centerx + circleRad*cos(rotateRad);
    yloc = centery - circleRad*sin(rotateRad);

    return(this);
  }

  //update
  void update() {
  }

  //Draw
  void render() {
      fill(darkgrey);
      noStroke();
      ellipse(xloc, yloc, smalldiam, smalldiam);
      fill(87,87,87,60); //bad- hardcoding the dark grey here
      ellipse(xloc, yloc, diam, diam);
      fill(darkgrey);
        
      pushMatrix();  
        textFont(qfont,7);
        translate(centerx, centery);
        rotate(-rotateRad);
        translate(circleRad, 0);
        rotate(PI);
        text(Name, -smalldiam/2-7-textWidth(Name), 2);
      popMatrix();
  }
}

