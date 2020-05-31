/*\
type: application/javascript
title: $:/plugins/nickgark/AAB/macro/subsector
tags: 
module-type: macro
\*/
(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    /* Tells TiddlyWiki the name of our macro through the export mechanism. */
    exports.name = "subsector";

    /* Lists of macro parameters; leave this array empty if you need none, or
     * want all supplied macro call parameters to be passed to the run() method.
     */
    exports.params = [{
    }];

    var trav = require("$:/plugins/nickgark/AAB/lib/library.js");
    var svg = require("$:/plugins/nickgark/AAB/lib/svg.js");
    var map = require("$:/plugins/nickgark/AAB/lib/map.js");

    /* Executes (runs) our macro when it requires evaluation; returns a string
     * value.
     */
    exports.run = function() {
        try {
            var subsector = new trav.Subsector(this.getVariable("currentTiddler"), this.wiki);
            
            var hexwidth = 100;
            var width = hexwidth * 6.25;
            var hexheight = 86;
            var height = hexheight * 10.5;
            var x,y,hex,g;

            // create SVG root
            var mapsvg = svg.SVG({"viewBox":"-30 -30 " + (width+60) + 
                                                   " " + (height+60)});

            // create clippath
            var defs = svg.Defs().addTo(mapsvg);
            var clip = Math.random().toString(36).substr(2,5);
            var clippath = svg.ClipPath({"id":clip}).addTo(defs);
            svg.Rect(0,0,width,height).addTo(clippath);
            
            // create frame          
            map.renderFrame(subsector,hexwidth,hexheight).addTo(mapsvg);

            // get the systems that are to be displayed 
            var systems = subsector.getSystems();

            // build dictionary of systems by hex
            var byHex = {};
            systems.forEach(function(e) {
                byHex[e.hex] = e;
            });

            for (x = 1; x <= 8; x++) {
                for (y = 1; y <= 10; y++) {
                    hex = trav.getHex(x + subsector.offsetx, 
                                      y + subsector.offsety);
                    g = svg.G().translate(trav.offsetXCentre(x, y, hexwidth),
                                          trav.offsetYCentre(x, y, hexwidth))
                               .addTo(mapsvg);
                    if (byHex[hex] !== undefined) {
                        map.renderBackground(byHex[hex]).addTo(g);
                    } 
                    map.renderHex().addTo(g);                  
                }
            }

            // iterate over all systems in subsector
            
            g = svg.G({"clip-path":"url(#" + clip + ")"}).addTo(mapsvg);
            
            systems.forEach(function(start) {
                if (start.routes != "") {
                    start.routes.split(" ").forEach(function(end) {
                        map.renderRoute(start.hex,end,
                                    subsector.letter,hexwidth).addTo(g);
                    });
                }
            });

            // iterate over all hexes in subsector
            for (x = 1; x <= 8; x++) {
                for (y = 1; y <= 10; y++) {       
                    hex = trav.getHex(x + subsector.offsetx, 
                                      y + subsector.offsety);
                    g = svg.G().translate(trav.offsetXCentre(x, y, hexwidth),
                                          trav.offsetYCentre(x, y, hexwidth))
                               .addTo(mapsvg);
                    // look for the current hex in the dictionary              
                    if (byHex[hex] === undefined) {
                        // if it doesn't exist, render an empty hex
                        map.renderEmpty(hex).addTo(g);                     
                    } else {
                        // if it does, render the system details                   
                        map.renderDetails(byHex[hex]).addTo(g);
                    }
                }
            }
             
            return mapsvg.toString();
             
        } catch(e) {
            console.error(e);
            
            return e;
        }
    };

})();
