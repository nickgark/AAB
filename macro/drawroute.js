/*\
title: $:/plugins/nickgark/AAB/macro/drawroute
type: application/javascript
module-type: macro
\*/
/*
title: $:/plugins/nickgark/AAB/macro/drawroute
type: application/javascript
module-type: macro

Macro to generate an SVG path that represents an X-boat route
for use in subsector maps.

Parameters:
    start   - string containing hex location of start
    end     - string containing hex location of end
*/
(function(){
    /* jslint node: true, browser: true */
    /* global $tw: false */
    "use strict";

    var trav = require("$:/plugins/nickgark/AAB/lib/library.js");

    exports.name = "drawroute";

    exports.params = [
        { name: "start" },
        { name: "end" },
        { name: "subsector" },
        { name: "hexwidth" }
    ];

    exports.run = function(start, end, subsector, hexwidth) {
        hexwidth = parseInt(hexwidth);
        var subx = trav.offsetSubsectorX(subsector);
        var suby = trav.offsetSubsectorY(subsector);
        var startX = trav.hexToX(start) - subx;
        var startY = trav.hexToY(start) - suby;
        var endX = trav.hexToX(end) - subx;
        var endY = trav.hexToY(end) - suby;
 
        var drawStartX = trav.offsetXCentre(startX, startY, hexwidth);
        var drawStartY = trav.offsetYCentre(startX, startY, hexwidth);
        var drawEndX = trav.offsetXCentre(endX, endY, hexwidth);
        var drawEndY = trav.offsetYCentre(endX, endY, hexwidth);
 
        var ret= "<path d=\"M " + drawStartX + " " + drawStartY + 
            " L " + drawEndX + " " + drawEndY + "\" stroke=\"grey\" stroke-width=\"8\"/>";

        return ret;
    };

})();
