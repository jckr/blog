var drawtext={};

drawtext.alphabet={"A":{"nodes":[[0,3],[1.5,0],[3,3],[0.75,1.5],[2.25,1.5]],"links":[[0,1],[1,2],[3,4]],"width":3},
"a":{"nodes":[[0,1],[1,1],[1,3],[0,3],[0,2],[1,2]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":1},

"B":{"nodes":[[0,0],[2,0],[2.5,0.75],[2,1.5],[2.5,2.25],[2,3],[0,3],[0,1.5]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[3,7]],"width":3},
"b":{"nodes":[[0,0],[0,3],[1,3],[1,1],[0,1]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":1},

"C":{"nodes":[[3,0],[1,0],[0,1],[0,2],[1,3],[3,3]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":3},
"c":{"nodes":[[1,1],[0,1],[0,3],[1,3]],"links":[[0,1],[1,2],[2,3]],"width":1},

"D":{"nodes":[[0,0],[0,3],[2,3],[3,2],[3,2],[2,0]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],"width":3},
"d":{"nodes":[[1,1],[1,3],[0,3],[0,2],[1,2]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":1},

"E":{"nodes":[[3,0],[0,0],[0,3],[3,3],[1.5,1],[0,1]],"links":[[0,1],[1,2],[2,3],[4,5]],"width":3},
"e":{"nodes":[[1,3],[0,3],[0,1],[1,1],[1,2],[0,2]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":1},

"F":{"nodes":[[3,0],[0,0],[0,3],[1.5,1],[0,1]],"links":[[0,1],[1,2],[3,4]],"width":3},
"f":{"nodes":[[1,0],[0,0],[0,3],[1,1],[0,1]],"links":[[0,1],[1,2],[3,4]],"width":1},

"G":{"nodes":[[3,0],[1,0],[0,2],[1,3],[3,3],[3,2],[2,2]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],"width":3},
"g":{"nodes":[[1,3],[0,3],[0,1],[1,1],[1,4],[0,4]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":1},

"H":{"nodes":[[0,0],[0,3],[3,0],[3,3],[0,1],[3,1]],"links":[[0,1],[2,3],[4,5]],"width":3},
"h":{"nodes":[[0,0],[0,3],[0,1],[1,1],[1,3]],"links":[[0,1],[2,3],[3,4]],"width":1},

"I":{"nodes":[[0,0],[0,3]],"links":[[0,1]],"width":1},
"i":{"nodes":[[0,1],[0,3]],"links":[[0,1]],"width":1},

"J":{"nodes":[[0,0],[3,0],[2,0],[2,2],[1,3],[0,2],[0,1]],"links":[[0,1],[2,3],[3,4],[4,5],[5,6]],"width":3},
"j":{"nodes":[[1,1],[1,3],[0,4]],"links":[[0,1],[1,2]],"width":1},

"K":{"nodes":[[0,0],[0,3],[3,0],[0,1.5],[3,3]],"links":[[0,1],[2,3],[3,4]],"width":3},
"k":{"nodes":[[0,0],[0,3],[1,3],[0,2],[1,2],[1,1],[0,1]],"links":[[0,1],[2,3],[3,4],[4,5],[5,6]],"width":1},

"L":{"nodes":[[0,0],[0,3],[3,3]],"links":[[0,1],[1,2]],"width":3},
"l":{"nodes":[[0,0],[0,3],[1,3]],"links":[[0,1],[1,2]],"width":1},

"M":{"nodes":[[0,3],[0,0],[1.5,1],[3,0],[3,3]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":3},
"m":{"nodes":[[0,3],[0,1],[2,1],[2,3],[1,3],[1,1]],"links":[[0,1],[1,2],[2,3],[4,5]],"width":2},

"N":{"nodes":[[0,3],[0,0],[3,3],[3,0]],"links":[[0,1],[1,2],[2,3]],"width":3},
"n":{"nodes":[[0,3],[0,1],[1,1],[1,3]],"links":[[0,1],[1,2],[2,3]],"width":1},

"O":{"nodes":[[1,0],[2,0],[3,1],[3,2],[2,3],[1,3],[0,2],[0,1]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]],"width":3},
"o":{"nodes":[[0,1],[1,1],[1,3],[0,3]],"links":[[0,1],[1,2],[2,3],[3,0]],"width":1},

"P":{"nodes":[[0,3],[0,0],[2,0],[3,1],[2,2],[0,2]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":3},
"p":{"nodes":[[0,4],[0,1],[1,1],[1,3],[0,3]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":1},

"Q":{"nodes":[[1,0],[2,0],[3,1],[3,2],[2,3],[1,3],[0,2],[0,1],[3,3],[2,2]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[8,9]],"width":3},
"q":{"nodes":[[1,4],[1,1],[0,1],[0,3],[1,3]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":1},

"R":{"nodes":[[0,3],[0,0],[2,0],[3,0.75],[2,1.5],[0,1.5],[1.5,1.5],[3,3]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5],[6,7]],"width":3},
"r":{"nodes":[[0,3],[0,1],[1,1]],"links":[[0,1],[1,2]],"width":1},

"S":{"nodes":[[3,0],[1,0],[0,1],[3,2],[2,3],[0,3]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":3},
"s":{"nodes":[[1,1],[0,1],[0,2],[1,2],[1,3],[0,3]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":1},

"T":{"nodes":[[0,0],[3,0],[1.5,0],[1.5,3]],"links":[[0,1],[2,3]],"width":3},
"t":{"nodes":[[0,0],[0,3],[1,3],[1,1],[0,1]],"links":[[0,1],[1,2],[3,4]],"width":1},

"U":{"nodes":[[0,0],[0,2],[1,3],[2,3],[3,2],[3,0]],"links":[[0,1],[1,2],[2,3],[3,4],[4,5]],"width":3},
"u":{"nodes":[[0,1],[0,3],[1,3],[1,1]],"links":[[0,1],[1,2],[2,3]],"width":1},

"V":{"nodes":[[0,0],[1.5,3],[3,0]],"links":[[0,1],[1,2]],"width":3},
"v":{"nodes":[[0,1],[0.5,3],[1,1]],"links":[[0,1],[1,2]],"width":1},

"W":{"nodes":[[0,0],[0.75,3],[1.5,0],[2.25,3],[3,0]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":3},
"w":{"nodes":[[0,0],[0,3],[1,1],[2,3],[2,1]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":2},

"X":{"nodes":[[0,0],[3,3],[0,3],[3,0]],"links":[[0,1],[2,3]],"width":3},
"x":{"nodes":[[0,1],[1,3],[0,3],[1,1]],"links":[[0,1],[2,3]],"width":1},

"Y":{"nodes":[[0,0],[1,5,1.5],[3,0],[0,3]],"links":[[0,1],[2,3]],"width":3},
"y":{"nodes":[[0,1],[0,3],[1,3],[1,1],[1,4],[0,4]],"links":[[0,1],[1,2],[3,4],[4,5]],"width":1},

"Z":{"nodes":[[0,0],[3,0],[0,3],[3,3]],"links":[[0,1],[1,2],[2,3]],"width":3},
"z":{"nodes":[[0,1],[1,1],[0,3],[1,3]],"links":[[0,1],[1,2],[2,3]],"width":1},

" ":{"nodes":[],"links":[],"width":1},
"-":{"nodes":[[0,1.5],[1,1.5]],"links":[[0,1]],"width":1},
"'":{"nodes":[[0,.5],[.5,0]],"links":[[0,1]],"width":1},
",":{"nodes":[[.5,3],[0,3.5]],"links":[[0,1]],"width":1},
".":{"nodes":[[.4,2.9],[.6,2.9],[.6,3.1],[.4,3.1]],"links":[[0,1],[1,2],[2,3],[3,4]],"width":1},



}


drawtext.removeDiacritics = function (str) {
	var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
	];    
    for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }
    return str;
}


drawtext.init = function(args) {
    var keys=d3.keys(args);
    var size // pixel size
    if (keys.indexOf("jitterx")<0) {drawtext.jitterx=.5} else {drawtext.jitterx=args.jitterx}
    if (keys.indexOf("jittery")<0) {drawtext.jittery=.5} else {drawtext.jittery=args.jittery}
 
    if (keys.indexOf("w")<0) {drawtext.w=window.innerWidth} else {drawtext.w=args.w}
    if (keys.indexOf("h")<0) {drawtext.h=window.innerHeight} else {drawtext.h=args.h}
 
    size=drawtext.w*drawtext.h;

    if (keys.indexOf("extranodes")<0) {drawtext.extranodes=500} else {drawtext.extranodes=args.extranodes}
    if (keys.indexOf("scale")<0) {drawtext.scale=size/50000} else {drawtext.scale=args.scale}
    if (keys.indexOf("min")<0) {drawtext.min=1} else {drawtext.min=args.min}
    if (keys.indexOf("close")<0) {drawtext.close=7} else {drawtext.close=args.close}
 



drawtext.w=window.innerWidth;drawtext.h=window.innerHeight;



    drawtext.set=true;
    drawtext.quadx=Math.ceil(drawtext.w/(drawtext.min*drawtext.scale)),drawtext.quady=Math.ceil(drawtext.h/(drawtext.min*drawtext.scale));
    drawtext.svg=d3.select("#chart").selectAll("svg").data([{width:drawtext.w,height:drawtext.h}]).enter().append("svg").attr({width:function(d) {return d.width;},height:function(d) {return d.height;}})
}




drawtext.dist = function (x1,x2,y1,y2) {return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));}
drawtext.vector = function (x1,x2,y1,y2) {
    var d=drawtext.dist(x1,x2,y1,y2);
    var a;
    if (d) {a=Math.acos((x1-x2)/d)} else {a=Math.random()*2*Math.PI}
    return [Math.cos(a),Math.sin(a)];
}
drawtext.addNodes = function() {
    console.log("staring addnodes");

    var addNode = function () {
        var attempts=0;
        var success=false;
        while (attempts<10&&(!success)) {
            var pass=true;
            var x=Math.random()*randx,y=Math.random()*randy;

            nx=~~((drawtext.w/(drawtext.min*drawtext.scale))*x/(drawtext.w/drawtext.scale));
            ny=~~((drawtext.h/(drawtext.min*drawtext.scale))*y/(drawtext.h/drawtext.scale));

            drawtext.data.quadhash[nx+"-"+ny].some(function(node) { // we'll only do the comparison between this nodes and others in the neighboring quadrants
                if (drawtext.dist(node.x,x,node.y,y)<drawtext.min) {    // MUCH faster
                    pass=false;
                    return -1;
                }
            })
            if (pass) {
                success=true;
                lastid=lastid+1;
                drawtext.data.nodes.push({x:x,y:y,core:false,d:drawtext.dist(x,drawtext.data.centerx,y,drawtext.data.centery),v:drawtext.vector(x,drawtext.data.centerx,y,drawtext.data.centery)});

                var idx=[-1,0,1]

                idx.forEach(function(sx) { // we'll also push the new node into the quadrant hash. 
                    idx.forEach(function(sy) {
                        var coords=(nx+sx)+"-"+(ny+sy)
                        if (coords in drawtext.data.quadhash) {
                            drawtext.data.quadhash[coords].push(lastid);
                        }
                    })    
                })
            } else {
                attempts=attempts+1;
            }
        }   
    }

	var minx=d3.min(drawtext.data.nodes,function(d) {return d.x;})
	var maxx=d3.max(drawtext.data.nodes,function(d) {return d.x;})
	
	var miny=d3.min(drawtext.data.nodes,function(d) {return d.y;})
	var maxy=d3.max(drawtext.data.nodes,function(d) {return d.y;})
	
	var extentx=maxx-minx;
	var extenty=maxy-miny;

    var offsetx=Math.random()*(drawtext.w/drawtext.scale-extentx);
    var offsety=Math.random()*(drawtext.h/drawtext.scale-extenty);

    var lastid;

    drawtext.data.centerx=offsetx+extentx/2;
    drawtext.data.centery=offsety+extenty/2;

	drawtext.data.nodes.forEach(function(node,id) { // recentering + storing nodes in hash for easy dist calculation
        var nx,ny;
        node.x=node.x+offsetx;
        node.y=node.y+offsety;
        node.d=drawtext.dist(node.x,drawtext.data.centerx,node.y,drawtext.data.centery);
        node.v=drawtext.vector(node.x,drawtext.data.centerx,node.y,drawtext.data.centery);
        lastid=node.id=id; // useful

        nx=~~((drawtext.w/(drawtext.min*drawtext.scale))*node.x/(drawtext.w/drawtext.scale));
        ny=~~((drawtext.h/(drawtext.min*drawtext.scale))*node.y/(drawtext.h/drawtext.scale));

        [-1,0,1].forEach(function(sx) { // the quadhash stores nodes in one quadrant, plus 8 quadrants around it if possible. 
            [-1,0,1].forEach(function(sy) {
                var coords=(nx+sx)+"-"+(ny+sy)
                if (coords in drawtext.data.quadhash) {
                    drawtext.data.quadhash[coords].push(id);
                }
            })    
        })
    }) 


	var randx=drawtext.w/drawtext.scale;//d3.max([30,2*extentx]);console.log(randx)
	var randy=drawtext.h/drawtext.scale;

	d3.range(drawtext.extranodes).forEach(addNode);

}
var lastSource,lastDest;
drawtext.arrangeLinks = function() {
    console.log("starting arrangelinks")
	drawtext.data.indexLinks={}
	drawtext.data.links.forEach(function(link) {
		var source=link.source,dest=link.dest;
		if (d3.keys(drawtext.data.indexLinks).indexOf(source)>-1) {
			if (drawtext.data.indexLinks[source].indexOf(dest)<0) {
				drawtext.data.indexLinks[source].push(dest);
			}
		} 	else {
			drawtext.data.indexLinks[source]=[dest];
		}
		if (d3.keys(drawtext.data.indexLinks).indexOf(dest)>-1) {
			if (drawtext.data.indexLinks[dest].indexOf(source)<0) {
				drawtext.data.indexLinks[dest].push(source);
			}
		}	else {
			drawtext.data.indexLinks[dest]=[source];
		}
        if (drawtext.data.nodes[source].d>drawtext.data.nodes[dest].d) { // here we are making sure that the source link is always the inner link
                                                                        // there may be other ways to arrange links we should imagine.
            link.source=dest;
            link.dest=source;
        }
        link.v1=drawtext.data.nodes[source].v;
        link.v2=drawtext.data.nodes[dest].v;
	})
}


drawtext.findCloseNodes = function () {
    console.log("starting findclosenodes");
	drawtext.data.nodes.forEach(function(thisNode,i) {
		thisNode.close=[];
		drawtext.data.nodes.forEach(function(node,j) {
			if(i<j) {var thisDist;
				if (thisDist=drawtext.dist(thisNode.x,node.x,thisNode.y,node.y)<drawtext.close) {
						thisNode.close.push({node:j,dist:thisDist});
				}
			}
		})
	})
}
drawtext.addLinks = function() {
    console.log("starting addlinks");

	drawtext.data.nodes.forEach(function(thisNode,i) {
		thisNode.close.forEach(function(node,j) {
			if (Math.random()<.05) { // we'll improve that later
				drawtext.data.links.push({source:i,dest:node.node,weight:false})
			}
		})
	})
}

drawtext.draw = function() {
    console.log("starting draw")
    var scale=drawtext.scale;
	var liveNodes=drawtext.data.nodes.filter(function(d,i) {return i in drawtext.data.indexLinks});
	var minx=d3.min(liveNodes,function(d) {return d.x;})
	var maxx=d3.max(liveNodes,function(d) {return d.x;})
	
	var miny=d3.min(liveNodes,function(d) {return d.y;})
	var maxy=d3.max(liveNodes,function(d) {return d.y;})
	
	var extentx=maxx-minx;
	var extenty=maxy-miny;

	var startx=Math.random()*(drawtext.w-scale*extentx);
	var starty=Math.random()*(drawtext.h-scale*extenty);
	startx=0
	starty=0
    var myhue=Math.random()*360;
    var mycolor=d3.hsl(myhue,.6,.4);
    var mybck=d3.hsl((myhue+180)%360,.3,.4);
    var stardist=drawtext.dist(0,drawtext.w,0,drawtext.h);
	//console.log(minx,maxx,miny,maxy,extentx,extenty,startx,starty)
	
    d3.selectAll(".links").transition().duration(1000)
        .attr({ x1:function(d) {return stardist*d.v1[0];},
                x2:function(d) {return stardist*d.v2[0];},
                y1:function(d) {return stardist*d.v1[1];},
                y2:function(d) {return stardist*d.v2[1];}})
        .each("end",function(d) {d3.select(this).remove()})
    d3.selectAll(".nodes").transition().duration(1000)
        .attr({"transform":function(d) {return "translate("+drawtext.w*d.v[0]+","+drawtext.h*d.v[1]+")";}})
        .each("end",function(d) {d3.select(this).remove()})

    drawtext.data.g=drawtext.svg.append("g");

    drawtext.data.g.append("rect").style("fill",function() {drawtext.mybck?drawtext.mybck:mybck})
        .attr({width:drawtext.w,height:drawtext.h})
        .transition().style("fill",drawtext.mybck=mybck)
    
    var drawNodes=drawtext.data.g.selectAll("g").data(liveNodes);
	drawNodes.enter().append("g").attr({"transform":function(d) {return "translate("+scale*d.x+","+scale*d.y+")"},id:function(d,i) {return "c-"+i;}})
    .classed("nodes",1)
    .classed("core",function(d) {return d.core})
    .classed("noise",function(d) {return !d.core});
    drawtext.data.g.selectAll(".nodes").append("circle").attr("r",0).style("fill","white").classed("inner",1);
    drawtext.data.g.selectAll(".nodes.core").append("circle").attr("r",0).style("fill","white").classed("outer",1);
    
	//drawNodes.transition().attr({cx:function(d) {return scale*d.x},cy:function(d) {return scale*d.y},r:1+1.5*Math.random()})
	drawtext.data.links.forEach(function(link) {
		link.delay=250+40*drawtext.data.nodes[link.source].d;
	})


    var drawLinks=drawtext.data.g.selectAll("line").data(drawtext.data.links);
	drawLinks.enter().append("line")
	.attr({
		x1:function(d) {//console.log(d);
			return scale*drawtext.data.nodes[d.source].x},
		y1:function(d) {return scale*drawtext.data.nodes[d.source].y},
		x2:function(d) {return scale*drawtext.data.nodes[d.source].x},
		y2:function(d) {return scale*drawtext.data.nodes[d.source].y}
	}).style("stroke","white")
    .classed("links",1)
    .classed("core",function(d) {return d.weight})
    .classed("noise",function(d) {return !d.weight});

    drawtext.data.g.selectAll(".links.noise")
        .transition()
        .delay(function(d) {return d.delay})
        .attr({x2:function(d) {return scale*drawtext.data.nodes[d.dest].x},
               y2:function(d) {return scale*drawtext.data.nodes[d.dest].y}})
        .style({stroke:"white","stroke-width":.5,"stroke-opacity":.5})
        .each("end",function() {
            d3.select(this).transition().delay(250).style("stroke-opacity",.4)
        })

    drawtext.data.g.selectAll(".nodes.noise").select("circle")
        .transition()
        .delay(function(d) {return 250+40*d.d})
        .attr({r:1+1.5*Math.random()})
        .each("end",function() {
            d3.select(this).transition().delay(250).style("opacity",.4)
        })

    drawtext.data.g.selectAll(".links.core")
        .transition()
        .delay(function(d) {return d.delay})
        .attr({x2:function(d) {return scale*drawtext.data.nodes[d.dest].x},
               y2:function(d) {return scale*drawtext.data.nodes[d.dest].y}})
        .style({stroke:"white","stroke-width":.5,"stroke-opacity":.5})
        .each("end",function(d,i) {
            d3.select(this).transition().delay(500+10*i).style({stroke:mycolor,"stroke-opacity":1,"stroke-width":4})
            d3.selectAll("#c-"+d.source,"#c-"+d.dest).select(".inner")
            .transition().delay(500+10*i)
                .attr({r:5})
                .style({fill:mycolor,opacity:1})
            d3.selectAll("#c-"+d.source,"#c-"+d.dest).select(".outer")
            .transition().delay(500+10*i)
                .attr({r:7})
                .style({fill:"none",stroke:mycolor,"stroke-opacity":1})
        })

   /* drawtext.data.g.selectAll(".nodes.core")
        .transition()
        .delay(function(d) {return 250+40*d.d})
        .attr({cx:function(d) {return scale*d.x},cy:function(d) {return scale*d.y},r:function(d) {return d.r=1+1.5*Math.random()}})
    */    
}

drawtext.read=function (text) {
    console.log("starting read",text)
    drawtext.data={nodes:[],links:[]}

    drawtext.data={};

    drawtext.data.l=0;

    drawtext.data.text=text;
    drawtext.data.nodes=[]
    drawtext.data.links=[]
    drawtext.data.indexLinks={}
    drawtext.data.quadhash={};
    d3.range(drawtext.quadx).forEach(function(x) {
        d3.range(drawtext.quady).forEach(function(y) {
            drawtext.data.quadhash[x+"-"+y]=[]
        })
    })

    var cursorx=0,cursory=0;
    var maxX=Math.floor(drawtext.w/drawtext.scale);
    var cursornodes=0;

    text.split("").forEach(function(letter) {
        if(letter==="\n") {
            cursorx=0;
            cursory=cursory+4;
        } else {
            console.log(letter);
        	var glyph=drawtext.alphabet[letter];
        	glyph.nodes.forEach(function(node) {
        		var jx=(Math.random()*.5)*drawtext.jitterx,jy=(Math.random()*.5)*drawtext.jittery
        		drawtext.data.nodes.push({x:node[0]+cursorx+jx,y:node[1]+cursory+jy,core:true});
        	})
        	glyph.links.forEach(function(link) {
        		var myLink={source:+link[0]+cursornodes,dest:+link[1]+cursornodes,weight:true}
        		//console.log(glyph,myLink)
        		drawtext.data.links.push(myLink)
        	})
        	cursornodes=cursornodes+glyph.nodes.length
        	cursorx=cursorx+glyph.width+1
            if (maxX-cursorx<3) {
                cursorx=0;
                cursory=cursory+4;
            }
        }
    })

    drawtext.addNodes();
    drawtext.findCloseNodes();
    drawtext.addLinks();
    drawtext.arrangeLinks(); // creates a hash of links so that we can tell the connections of each node
    //dropDeadNodes();

    drawtext.draw();

}

drawtext.loadText = function (array) {
    var advance=function() {drawtext.index=(drawtext.index+1)%array.length;drawtext.read(array[drawtext.index])}
    if (!drawtext.set) {drawtext.init()} 
    array=array.map(drawtext.removeDiacritics)
    drawtext.index=0;
    drawtext.read(array[drawtext.index]);
    d3.select(window).on("keydown",advance) 
    drawtext.svg.on("click",advance)
}




