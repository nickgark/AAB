/*\
type: application/javascript
title: $:/plugins/nickgark/AAB/macro/adjacentsubsector
module-type: macro
\*/
/*
title: $:/plugins/nickgark/AAB/macro/adjacentsubsector
type: application/javascript
module-type: macro
*/
(function(){
    /* jslint node: true, browser: true */
    /* global $tw: false */
    "use strict";

    var trav = require("$:/plugins/nickgark/AAB/lib/library.js");

    exports.name = "adjacentsubsector";

    exports.params = [
        { name: "offsetx", default: "0" },
        { name: "offsety", default: "0" },
    ];

    exports.run = function(offsetx, offsety) {
        try {
            var tid = this.wiki.getTiddler(this.getVariable("currentTiddler"));
            var sub = tid.getFieldString("subsector");
            var ssx = Number(trav.getSubsectorX(sub));
            var ssy = Number(trav.getSubsectorY(sub));
            var sec = tid.getFieldString("sector");

            var sectid = this.wiki.getTiddler(sec);
            var sx = Number(sectid.getFieldString("sx"));
            var sy = Number(sectid.getFieldString("sy"));

            offsetx = Number(offsetx);
            offsety = Number(offsety);

            var newssx = (((ssx + offsetx) % 4) + 4) % 4;
            var newssy = (((ssy + offsety) % 4) + 4) % 4;

            var newsx = sx; 
            if ((ssx + offsetx) < 0) {
                newsx--;
            } else if ((ssx + offsetx) > 3) {
                newsx++;
            }

            var newsy = sy; 
            if ((ssy + offsety) < 0) {
                newsy--;
            } else if ((ssy + offsety) > 3) {
                newsy++;
            }

            var newsectids = this.wiki.filterTiddlers("[tag[Sector]sx[" + newsx + "]sy[" + newsy + "]]");
   
            if (newsectids.length > 0) {
                return "[tag[Subsector]sector[" + newsectids[0] + 
                    "]subsector[" + trav.getSubsector(newssx, newssy) + "]]";
             } else {
                return "";
            }
        } catch (e) {
            return "";
        }
    };
})();
