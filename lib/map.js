/*\
title: $:/plugins/nickgark/AAB/lib/map.js
type: application/javascript
tags: 
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var svg = require("$:/plugins/nickgark/AAB/lib/svg.js");
var trav = require("$:/plugins/nickgark/AAB/lib/library.js");

exports.renderDetails = function(system) {
    var g = svg.G();
    var style = system.allegiance;
    
    
    var clip = Math.random().toString(36).substr(2,5);
    var defs = svg.Defs().addTo(g);
    var clippath = svg.ClipPath({"id":clip}).addTo(defs);
    svg.Path(50,0).L(25,43.3).L(-25,43.3).L(-50,0)
                  .L(-25,-43.3).L(25,-43.3).z().addTo(clippath);        
    if (system.zone == "A") amberzone().addTo(g);
    if (system.zone == "R") redzone().addTo(g);

    coords(system).addTo(g);
    
    if (system.belt) {
        belt(system).addTo(g);
    } else if (system.dry) {
        dryworld(system).addTo(g);
    } else {
        wetworld(system).addTo(g);
    }

    starport(system).addTo(g);

    name(system,clip).addTo(g);
    
    if (system.bases.includes("S")) scout(system).addTo(g);
    if (system.bases.includes("N")) navy(system).addTo(g);
    
    if (system.allegiance.includes("Im")) {
        if (system.bases.includes("W")) way(system).addTo(g);
        if (system.bases.includes("D")) depot(system).addTo(g);
    } else if (system.allegiance.includes("Zh")) {
        if (system.bases.includes("W")) zhorelay(system).addTo(g);
        if (system.bases.includes("K")) zhonavy(system).addTo(g);
        if (system.bases.includes("D")) zhodepot(system).addTo(g);
    } else {
        if (system.bases.includes("K")) othernavy(system).addTo(g);
        if (system.bases.includes("D")) otherdepot(system).addTo(g);
        
    }
    if (system.bases.includes("M")) otherbase(system).addTo(g);
    if (system.bases.includes("e")) embassy(system).addTo(g);
    if (system.bases.includes("C")) corsairbase(system).addTo(g);
    if (system.bases.includes("R")) clanbase(system).addTo(g);
    if (system.bases.includes("T")) tlaukhubase(system).addTo(g);
    
    if (system.codes.includes("RsA")) research(system, "Α").addTo(g);
    if (system.codes.includes("RsB")) research(system, "Β").addTo(g);
    if (system.codes.includes("RsG")) research(system, "Γ").addTo(g);
    if (system.codes.includes("RsD")) research(system, "Δ").addTo(g);
    if (system.codes.includes("RsE")) research(system, "Ε").addTo(g);
    if (system.codes.includes("RsZ")) research(system, "Ζ").addTo(g);
    if (system.codes.includes("RsH")) research(system, "Η").addTo(g);
    if (system.codes.includes("RsT")) research(system, "Θ").addTo(g);
    if (system.codes.includes("Rs")) otherresearch(system).addTo(g);
    
    if (system.gasgiants) gasgiant(system).addTo(g);
    return g;
}

exports.renderBrief = function(system) {
    var g = svg.G();
    
}

exports.renderEmpty = function(hex) {
    return svg.Text(hex,{"x":0,"y":-32.5,"text-anchor":"middle",
                   "fill":"black","style":"font-family: sans-serif",
                   "font-size":8});
}

exports.renderHex = function() {
    return svg.Path(50,0,{"stroke":"black",
                          "stroke-width": 1, 
                          "fill": "none"})
              .L(25,43.3).L(-25,43.3).L(-50,0)
              .L(-25,-43.3).L(25,-43.3).z();   
}

exports.renderBackground = function(system) {
    var style = system.allegiance;
    return svg.Path(50,0,{"fill": "white",
                           "class":style})
               .L(25,43.3).L(-25,43.3).L(-50,0)
               .L(-25,-43.3).L(25,-43.3).z(); 
}

exports.renderFrame = function(thing, hexwidth, hexheight) {
    var g = svg.G();
    var width, height;
    var adj, link;
    
    if (thing instanceof trav.Sector) {
        width = hexwidth * 24.25;
        height = hexheight * 40.5;
    } else {
        width = (hexwidth * 6.25) ;
        height = hexheight * 10.5;
    }
    
    svg.Path(-4,-4,{"fill":"none",
                    "stroke":"black",
                    "stroke-width":8})
       .L(width+4,-4).L(width+4,height+4).L(-4,height+4).z().addTo(g);

    // top left
    svg.Path(width*0.25,-18,{"fill":"none",
                      "stroke":"black",
                      "stroke-width":8})
       .L(-18,-18).L(-18,height*0.25).addTo(g);

    // top right
    svg.Path(width*0.75,-18,{"fill":"none",
                      "stroke":"black",
                      "stroke-width":8})
       .L(width+18,-18).L(width+18,height*0.25).addTo(g);

    // bottom left
    svg.Path(width*0.25,height+18,{"fill":"none",
                      "stroke":"black",
                      "stroke-width":8})
       .L(-18,height+18).L(-18,height*0.75).addTo(g);

    // bottom right
    svg.Path(width*0.75,height+18,{"fill":"none",
                      "stroke":"black",
                      "stroke-width":8})
       .L(width+18,height+18).L(width+18,height*0.75).addTo(g);
    
    // top link
    adj = thing.adjacent(0,-1);
    if (adj === undefined) {
        svg.Text("Unknown",{"x":width/2,"y":-14,
                            "text-anchor":"middle","font-size":20,
                            "style":"font-weight:bold;text-transform:uppercase;"}).addTo(g);
    } else {
        link = svg.A("#" + adj.title,{}).addTo(g);
        svg.Text(adj.name,{"x":width/2,"y":-14,
                            "text-anchor":"middle","font-size":20,
                            "style":"font-weight:bold;text-transform:uppercase;"}).addTo(link);
    }
    
    // bottom link
    adj = thing.adjacent(0,1);
    if (adj === undefined) {
        svg.Text("Unknown",{"x":width/2,"y":height+30,
                    "text-anchor":"middle","font-size":20,
                    "style":"font-weight:bold;text-transform:uppercase;"}).addTo(g);
        
    } else {
        link = svg.A("#" + adj.title,{}).addTo(g);
        svg.Text(adj.name,{"x":width/2,"y":height+30,
                    "text-anchor":"middle","font-size":20,
                    "style":"font-weight:bold;text-transform:uppercase;"}).addTo(link);
        
    }
    
    // left link
    adj = thing.adjacent(-1,0);
    if (adj === undefined) {
        svg.Text("Unknown",{"x":-14,"y":height/2,
                    "text-anchor":"middle","font-size":20,
        "style":"font-weight:bold;text-transform:uppercase;",
        "transform": "rotate(-90," + -14 + "," + height/2 + ")"}).addTo(g)
    } else {
        link = svg.A("#" + adj.title,{}).addTo(g);
        svg.Text(adj.name,{"x":-14,"y":height/2,
                    "text-anchor":"middle","font-size":20,
        "style":"font-weight:bold;text-transform:uppercase;",
        "transform": "rotate(-90," + -14 + "," + height/2 + ")"}).addTo(link)
    }
    
    // right link
    adj = thing.adjacent(1,0);
    if (adj === undefined) {
        svg.Text("Unknown",{"x":width+15,"y":height/2,
                    "text-anchor":"middle","font-size":20,
        "style":"font-weight:bold;text-transform:uppercase;",
        "transform": "rotate(90," + (width+15) + "," + height/2 + ")"}).addTo(g)
    } else {
        link = svg.A("#" + adj.title,{}).addTo(g);
        svg.Text(adj.name,{"x":width+15,"y":height/2,
                    "text-anchor":"middle","font-size":20,
        "style":"font-weight:bold;text-transform:uppercase;",
        "transform": "rotate(90," + (width+15) + "," + height/2 + ")"}).addTo(link)
    }
    
    return g;
}

function coords(system) {
    var title = system.title;
    var style = system.allegiance;
    var hex = system.hex;
    
    var a = new svg.A("#" + title);
    svg.Text(hex,{"x":0,"y":-32.5,
                  "text-anchor":"middle","style":"font-family: sans-serif",
                  "stroke-width":4,"stroke-linejoin":"round","font-size":8,
                  "class":style}).addTo(a);
    svg.Text(hex, {"x":0,"y":-32.5,"text-anchor":"middle",
                   "fill":"black","style":"font-family: sans-serif",
                   "font-size":8}).addTo(a);
    return a;
}

exports.renderRoute = function(start, end, subsector, hexwidth) {
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
    
    return svg.Path(drawStartX,drawStartY,{"stroke":"grey","stroke-width":8})
              .L(drawEndX,drawEndY);
}

function amberzone() {
    
    var a = new svg.A("#Amber%20Zone");
    svg.Circle(0,0,35,{"fill":"none",
                                   "stroke":"orange",
                                   "stroke-width":3}).addTo(a);
                                   
    return a;
}

function redzone() {
    var a = new svg.A("#Red%20Zone");
    svg.Circle(0,0,35,{"fill":"none",
                                   "stroke":"red",
                                   "stroke-width":3}).addTo(a);
                                   
    return a;
}

function wetworld(system) {
    var title = system.title;
    var style = system.allegiance;
    
    var a = new svg.A("#" + title);
    svg.Circle(0,0,14,{"fill":"white","class":style}).addTo(a);
    svg.Circle(0,0,10,{"fill":"#1e90ff",
                                    "stroke":"black",
                                    "stroke-width":2}).addTo(a);
    return a;
}

function dryworld(system) {
    var title = system.title;
    var style = system.allegiance;

    var a = new svg.A("#" + title);
    svg.Circle(0,0,14,{"fill":"white","class":style}).addTo(a);
    svg.Circle(0,0,10,{"fill":"white",
                       "stroke":"black",
                       "stroke-width":2}).addTo(a);
    return a;
}

function belt(system) {
    var title = system.title;
    var style = system.allegiance;

    var a = new svg.A("#" + title);
    var g = new svg.G().addTo(a);
    svg.Circle(0,0,20,{"fill":"white","class":style}).addTo(g);
    svg.Circle(-12,9,2,{"fill":"black"}).addTo(g);
    svg.Circle(-6,-9,2,{"fill":"black"}).addTo(g);
    svg.Circle(-4,0,2,{"fill":"black"}).addTo(g);
    svg.Circle(-1,12,2,{"fill":"black"}).addTo(g);
    svg.Circle(2,-6,2,{"fill":"black"}).addTo(g);
    svg.Circle(5,2,2,{"fill":"black"}).addTo(g);
    svg.Circle(12,9,2,{"fill":"black"}).addTo(g);
    svg.Circle(14,-5,2,{"fill":"black"}).addTo(g);
    
    return a;
}

function starport(system) {
    var type = system.starport;
    var style = system.allegiance;
    
    var a = new svg.A("#Class%20" + type + "%20Starport");
    svg.Text(type,{"x":0,"y":-17.5,"text-anchor":"middle",
                   "style":"font-family:sans-serif",
                   "stroke":"white","stroke-width":3,
                   "stroke-linejoin":"round","class":style,
                   "font-size":15}).addTo(a);
    svg.Text(type,{"x":0,"y":-17.5,"text-anchor":"middle",
                   "style":"font-family:sans-serif",
                   "fill":"black",
                   "font-size":15}).addTo(a);
    return a;
}

function name(system, clip) {
    var title = system.title;
    var name = system.name;
    var style = system.allegiance;
    
    var a = new svg.A("#" + title);
    var bg = svg.Text(name, {"x":0,"y":30,"text-anchor":"middle",
                    "style":"font-family: sans-serif",
                    "font-weight": "bold",
    "clip-path":"url(#" + clip + ")",    
                    "stroke":"white","stroke-width":4,
                    "stroke-linejoin":"round","class":style,
                    "font-size":12}).addTo(a);
    var t = svg.Text(name, {"x":0,"y":30,"text-anchor":"middle",
                    "style":"font-family: sans-serif",
                    "font-weight": "bold",
                    "font-size":12}).addTo(a);
                    
    if (system.hipop) {
        t.addAttrs({"style":"font-family: sans-serif; text-transform: uppercase"});
        bg.addAttrs({"style":"font-family: sans-serif; text-transform: uppercase"});
    }
    
    if (system.capital) {
        t.addAttrs({"fill":"red"});
    }
    
    return a;
}

function scout(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Imperial%20Scout%20Base");
    var g = svg.G().translate(-17.5,-30.3).addTo(a);
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(4.3,2.5).L(-4.3,2.5).z().addTo(g);
    svg.Path(0,-5,{"fill":"black"}).L(4.3,2.5).L(-4.3,2.5).z().addTo(g);
    
    return a;
}

function way(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Imperial%20Way%20Station");
    var g = svg.G().translate(-17.5,-30.3).addTo(a);
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(4.3,2.5).L(-4.3,2.5).z().addTo(g);
    svg.Path(0,-5,{"fill":"red"}).L(4.3,2.5).L(-4.3,2.5).z().addTo(g);
    
    return a;
}

function navy(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Imperial%20Naval%20Base");
    var g = svg.G().translate(-30.3,-17.5).addTo(a);
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(2.9,4).L(-4.7, -1.5).L(4.7,-1.5).L(-2.9,4).z().addTo(g);
    svg.Path(0,-5,{"fill":"black"}).L(2.9,4).L(-4.7, -1.5)
                                   .L(4.7,-1.5).L(-2.9,4).z().addTo(g);
    
    return a;
}

function depot(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Imperial%20Naval%20Depot");
    var g = svg.G().translate(-30.3,-17.5).addTo(a);
    svg.Path(3.5,3.5,{"stroke":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style})
       .L(-3.5, 3.5).L(-3.5,-3.5).L(3.5,-3.5).z().addTo(g);
    svg.Path(3.5,3.5,{"fill":"black"}).L(-3.5, 3.5)
                                      .L(-3.5,-3.5).L(3.5,-3.5).z().addTo(g);

    return a;
}

function othernavy(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Naval%20Base");
    var g = svg.G().translate(-30.3,-17.5).addTo(a);
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(2.9,4).L(-4.7, -1.5).L(4.7,-1.5).L(-2.9,4).z().addTo(g);
    svg.Path(0,-5,{"fill":"red"}).L(2.9,4).L(-4.7, -1.5)
                                   .L(4.7,-1.5).L(-2.9,4).z().addTo(g);
    
    return a;
}

function tlaukhubase(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Aslan%20Tlaukhu%20Base");
    var g = svg.G().translate(-30.3,-17.5).addTo(a);
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(2.9,4).L(-4.7, -1.5).L(4.7,-1.5).L(-2.9,4).z().addTo(g);
    svg.Path(0,-5,{"fill":"red"}).L(2.9,4).L(-4.7, -1.5)
                                   .L(4.7,-1.5).L(-2.9,4).z().addTo(g);
    
    return a;
}

function clanbase(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Aslan%20Clan%20Base");
    var g = svg.G().translate(-35,0).addTo(a);
    
    svg.Circle(0,0,5,{"stroke":"white","fill":"white","stroke-width":3, 
                  "stroke-linejoin":"round","class":style}).addTo(g);   
    svg.Text("**",{"x":0,"y":8,"text-anchor":"middle", "fill": "black",
              "font-weight": "bold", "font-size": "15",
    "style": "font-family: sans-serif; text-transform: uppercase"}).addTo(g); 
       
    return a;
}

function embassy(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Hiver%20Embassy");
    var g = svg.G().translate(-35,0).addTo(a);
    
    svg.Circle(0,0,5,{"stroke":"white","fill":"white","stroke-width":3, 
                  "stroke-linejoin":"round","class":style}).addTo(g);   
    svg.Text("**",{"x":0,"y":8,"text-anchor":"middle", "fill": "black",
              "font-weight": "bold", "font-size": "15",
    "style": "font-family: sans-serif; text-transform: uppercase"}).addTo(g); 
       
    return a;
}

function corsairbase(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Vargr%20Corsair%20Base");
    var g = svg.G().translate(-35,0).addTo(a);
    
    svg.Circle(0,0,5,{"stroke":"white","fill":"white","stroke-width":3, 
                  "stroke-linejoin":"round","class":style}).addTo(g);   
    svg.Text("**",{"x":0,"y":8,"text-anchor":"middle", "fill": "black",
              "font-weight": "bold", "font-size": "15",
    "style": "font-family: sans-serif; text-transform: uppercase"}).addTo(g); 
       
    return a;
}


function otherdepot(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Naval%20Depot");
    var g = svg.G().translate(-30.3,-17.5).addTo(a);
    svg.Path(3.5,3.5,{"stroke":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style})
       .L(-3.5, 3.5).L(-3.5,-3.5).L(3.5,-3.5).z().addTo(g);
    svg.Path(3.5,3.5,{"fill":"red"}).L(-3.5, 3.5)
                                      .L(-3.5,-3.5).L(3.5,-3.5).z().addTo(g);

    return a;
}

function zhonavy(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Zhodani%20Naval%20Base");
    var g = svg.G().translate(-30.3, -17.5).addTo(a);
    
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(2.5,0).L(0,5).L(-2.5,0).z().addTo(g);
    svg.Path(0,-5,{"fill":"black"}).L(2.5,0).L(0,5).L(-2.5,0).z().addTo(g);
    
    return a;
}

function zhorelay(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Zhodani%20Relay%20Station");
    var g = svg.G().translate(-30.3, -17.5).addTo(a);
    
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(2.5,0).L(0,5).L(-2.5,0).z().addTo(g);
    svg.Path(0,-5,{"fill":"red"}).L(2.5,0).L(0,5).L(-2.5,0).z().addTo(g);
    
    return a;
}

function zhodepot(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Zhodani%20Naval%20Depot");
    var g = svg.G().translate(-30.3,-17.5).addTo(a);
    svg.Path(3.5,3.5,{"stroke":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style})
       .L(-3.5, 3.5).L(-3.5,-3.5).L(3.5,-3.5).z().addTo(g);
    svg.Path(3.5,3.5,{"fill":"red"}).L(-3.5, 3.5)
                                      .L(-3.5,-3.5).L(3.5,-3.5).z().addTo(g);

    return a;
}

/*
function otherbase(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Military%20Base");
    var g = svg.G().translate(-35, 0).addTo(a);

    svg.Circle(0,0,4,{"stroke":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style}).addTo(g);    
    svg.Circle(0,0,4,{"fill":"black"}).addTo(g);
    
    return a;
}
*/

function otherbase(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Military%20Base");
    var g = svg.G().translate(-35,0).addTo(a);
    
    svg.Path(0,-5,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(1.5,-1.5).L(5,0).L(1.5,1.5).L(0,5)
       .L(-1.5,1.5).L(-5,0).L(-1.5,-1.5).z().addTo(g);
    svg.Path(0,-5,{"fill":"black"})
       .L(1.5,-1.5).L(5,0).L(1.5,1.5).L(0,5)
       .L(-1.5,1.5).L(-5,0).L(-1.5,-1.5).z().addTo(g);
       
    return a;
}

function research(system, letter) {
    var style = system.allegiance;
    
    var a = new svg.A("#Imperial%20Research%20Station");
    var g = svg.G().translate(30.3,-17.5).addTo(a);
    
    svg.Circle(0,0,5,{"stroke":"white","fill":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style}).addTo(g);   
    svg.Text(letter,{"x":0,"y":5,"text-anchor":"middle", "fill": "black",
                     "font-weight": "bold", "font-size": "10",
        "style": "font-family: sans-serif; text-transform: uppercase"}).addTo(g);
        
    return a;
}

function otherresearch(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Research%20Station");
    var g = svg.G().translate(30.3,-17.5).addTo(a);
    
    svg.Circle(0,0,5,{"stroke":"white","fill":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style}).addTo(g);   
    svg.Text("R",{"x":0,"y":5,"text-anchor":"middle", "fill": "black",
                  "font-weight": "bold", "font-size": "10",
        "style": "font-family: sans-serif; text-transform: uppercase"}).addTo(g);

    return a;
}

function gasgiant(system) {
    var style = system.allegiance;
    
    var a = new svg.A("#Gas%20Giant");
    var g = svg.G().translate(17.5,-30.3).addTo(a);
    svg.Circle(0,0,4,{"stroke":"white","stroke-width":3, 
                      "stroke-linejoin":"round","class":style}).addTo(g);
    svg.Path(-5,4,{"stroke":"white","stroke-width":3, 
                   "stroke-linejoin":"round","class":style})
       .L(4,-5).L(5,-4).L(-4,5).z().addTo(g);
    svg.Circle(0,0,4,{"fill":"black"}).addTo(g);
    svg.Path(-5,4,{"fill":"black"}).L(4,-5).L(5,-4).L(-4,5).z().addTo(g);
    
    return a;
}

})();
