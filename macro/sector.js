/*\
title: $:/plugins/nickgark/AAB/macro/sector
type: application/javascript
tags: 
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Tells TiddlyWiki the name of our macro through the export mechanism. */
exports.name = "sector";

/* Lists of macro parameters; leave this array empty if you need none, or
 * want all supplied macro call parameters to be passed to the run() method.
 */
exports.params = [
    {}
];

var trav = require("$:/plugins/nickgark/AAB/lib/library.js");
var svg = require("$:/plugins/nickgark/AAB/lib/svg.js");
var map = require("$:/plugins/nickgark/AAB/lib/map.js");

/* Executes (runs) our macro when it requires evaluation; returns a string
 * value.
 */
exports.run = function() {
    var sector = new trav.Sector(this.getVariable("currentTiddler"), this.wiki);
    var hexwidth = 25;
    var width = hexwidth * 24.25;
    var hexheight = 21.5;
    var height = hexheight * 40.5;
    var x,y,link;

    // create SVG root
    var mapsvg = svg.SVG({"viewBox":"-30 -30 " + (width+60) + 
                                           " " + (height+60)});

    // create clippath
    var defs = svg.Defs().addTo(mapsvg);
    var clip = Math.random();
    var clippath = svg.ClipPath({"id":clip}).addTo(defs);
    svg.Rect(0,0,width,height).addTo(clippath);
    
    // create frame          
    map.renderFrame(sector,hexwidth,hexheight).addTo(mapsvg);

    // create subsector grid  
    svg.Path(width*0.25,0,{"stroke":"black","stroke-width":2}).L(width*0.25, height).addTo(mapsvg);
    svg.Path(width*0.5,0,{"stroke":"black","stroke-width":2}).L(width*0.5, height).addTo(mapsvg);
    svg.Path(width*0.75,0,{"stroke":"black","stroke-width":2}).L(width*0.75, height).addTo(mapsvg);
    svg.Path(0,height*0.25,{"stroke":"black","stroke-width":2}).L(width, height*0.25).addTo(mapsvg);
    svg.Path(0,height*0.5,{"stroke":"black","stroke-width":2}).L(width, height*0.5).addTo(mapsvg);
    svg.Path(0,height*0.75,{"stroke":"black","stroke-width":2}).L(width, height*0.75).addTo(mapsvg);
  
    // get the subsectors that are to be displayed 
    var subsectors = sector.getSubsectors();

    subsectors.forEach(function(e) {
        x = ((e.ssx * 0.25) + 0.125) * width;
        y = ((e.ssy * 0.25) + 0.125) * height;
        link = svg.A("#" + e.title).addTo(mapsvg);
        svg.Text(e.name,{"x":x,"y":y,
                         "transform":"rotate(-60 " + x + " " + y + ")",
                         "text-anchor":"middle",
                         "font-size":30,
                         "fill":"grey"}).addTo(link);
    });
 
    return mapsvg.toString();
};

})();
