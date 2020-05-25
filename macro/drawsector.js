/*\
created: 20180124105011895
title: $:/plugins/nickgark/AAB/macro/drawsector
tags: 
modified: 20200525193733284
type: application/javascript
module-type: macro
\*/
/*
title: $:/plugins/nickgark/AAB/macro/drawsector
type: application/javascript
module-type: macro
*/
(function(){
    /* jslint node: true, browser: true */
    /* global $tw: false */
    "use strict";

    var trav = require("$:/plugins/nickgark/AAB/lib/library.js");

    exports.name = "drawsector";

    exports.params = [];

    exports.run = function() {
        var ret = "";
        var tid = this.wiki.getTiddler(this.getVariable("currentTiddler"));
        var sec = tid.getFieldString("title");
        var width = 25;
        var x;
        var y;
        var hex;

        for (x = 1; x <= 32; x++) {
            for (y = 1; y <= 40; y++) {
                hex = trav.padHex(x) + trav.padHex(y);

                ret += "<g transform=\"translate(" + 
                    trav.offsetHexX(x, y, width) + "," + 
                    trav.offsetHexY(x, y, width) + ")\">\n";

                ret += "<$list filter=\"[tag[System]sector[" + sec + 
                    "]hex[" + hex + 
                    "]]\" template=\"$:/plugins/nickgark/AAB/template/hex/small\"/>\n";

                ret += "</g>\n";
            }
        }
        return ret;
    };
})();