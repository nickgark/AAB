/*\
type: application/javascript
title: $:/plugins/nickgark/AAB/macro/drawsubsector
module-type: macro
\*/
/*
title: $:/plugins/nickgark/AAB/macro/drawsubsector
type: application/javascript
module-type: macro
*/
(function(){
    /* jslint node: true, browser: true */
    /* global $tw: false */
    "use strict";

    var trav = require("$:/plugins/nickgark/AAB/lib/library.js");

    exports.name = "drawsubsector";

    exports.params = [];

    exports.run = function() {
        var ret = "";
        var tid = this.wiki.getTiddler(this.getVariable("currentTiddler"));
        var sec = tid.getFieldString("sector");
        var sub = tid.getFieldString("subsector");
        var subx = trav.offsetSubsectorX(sub);
        var suby = trav.offsetSubsectorY(sub);
        var width = 100;
        var x;
        var y;
        var hex;

        // print hex backgrounds
        for (x = 1; x <= 8; x++) {
            for (y = 1; y <= 10; y++) {
                hex = trav.padHex(x + subx) + trav.padHex(y + suby);

                ret += "<g transform=\"translate(" + 
                    trav.offsetX(x, y, width) + "," + 
                    trav.offsetY(x, y, width) + ")\">\n";

                ret += "<$list filter=\"[tag[System]sector[" + sec + 
                    "]hex[" + hex + 
                    "]]\" template=\"$:/plugins/nickgark/AAB/template/hex/large/background\"/>\n";

                ret += "</g>\n";
            }
        }

        // print hex outlines
        for (x = 1; x <= 8; x++) {
            for (y = 1; y <= 10; y++) {

                ret += "<g transform=\"translate(" + 
                    trav.offsetX(x, y, width) + "," + 
                    trav.offsetY(x, y, width) + ")\">\n";
                ret += "<$transclude tiddler=\"$:/plugins/nickgark/AAB/template/hex/large/blank\"/>\n";
                ret += "</g>\n";
            }
        }

        // print routes
        for (x = 1; x <= 8; x++) {
            for (y = 1; y <= 10; y++) {
                hex = trav.padHex(x + subx) + trav.padHex(y + suby);
ret += "<$list filter=\"[tag[System]sector[" + sec + "]hex[" + hex + "]]\">\n";
ret += "<$list filter=\"[list[!!routes]]\">\n";
ret += "<$macrocall $name=\"drawroute\" start=\"" + hex + "\" end=<<currentTiddler>> " + 
"subsector=\"" + sub + "\" hexwidth=\"100\"/>\n";
ret += "</$list>\n";
ret += "</$list>\n";
            }
        }

        // print hex details
        for (x = 1; x <= 8; x++) {
            for (y = 1; y <= 10; y++) {
                hex = trav.padHex(x + subx) + trav.padHex(y + suby);

                ret += "<g transform=\"translate(" + 
                    trav.offsetX(x, y, width) + "," + 
                    trav.offsetY(x, y, width) + ")\">\n";

                ret += "<$list filter=\"[tag[System]sector[" + sec + 
                    "]hex[" + hex + 
                    "]]\" template=\"$:/plugins/nickgark/AAB/template/hex/large/detail\"/>\n";

                ret += "</g>\n";
            }
        }

        return ret;
    };
})();
