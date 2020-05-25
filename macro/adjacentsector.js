/*\
created: 20180125151224451
title: $:/plugins/nickgark/AAB/macro/adjacentsector
tags: 
modified: 20200525194149725
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

    exports.name = "adjacentsector";

    exports.params = [
        { name: "offsetx", default: "0" },
        { name: "offsety", default: "0" },
    ];

    exports.run = function(offsetx, offsety) {
        var tid = this.wiki.getTiddler(this.getVariable("currentTiddler"));
        var sx = tid.getFieldString("sx");
        var sy = tid.getFieldString("sy");
        var x = Number(sx) + Number(offsetx);
        var y = Number(sy) + Number(offsety);
        return "[tag[Sector]sx[" + x + "]sy[" + y + "]]";
    };

})();