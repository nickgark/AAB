/*\
title: $:/plugins/nickgark/AAB/lib/library.js
type: application/javascript
module-type: library
\*/
(function(){

    var subsectorX = { 
        A: 0, B: 1, C: 2, D: 3, 
        E: 0, F: 1, G: 2, H: 3,
        I: 0, J: 1, K: 2, L: 3,
        M: 0, N: 1, O: 2, P: 3
    };

    var subsectorY = { 
        A: 0, B: 0, C: 0, D: 0, 
        E: 1, F: 1, G: 1, H: 1,
        I: 2, J: 2, K: 2, L: 2,
        M: 3, N: 3, O: 3, P: 3
    };

    var subsectors = [
        ["A", "E", "I", "M"],
        ["B", "F", "J", "N"],
        ["C", "G", "K", "O"],
        ["D", "H", "L", "P"]
    ];

/*
 * Subsector class   
 */

    function Subsector(subsector, wiki) {
        if (!(this instanceof Subsector)) return new Subsector(subsector, wiki);

        this.wiki = wiki;
    
        if (subsector instanceof $tw.Tiddler) {
            this.tiddler = subsector;
        } else {
            this.tiddler = this.wiki.getTiddler(subsector);
        }
                
        this.title = this.tiddler.getFieldString("title");
        this.name = this.tiddler.getFieldString("name");
        this.sector = this.tiddler.getFieldString("sector");
        this.letter = this.tiddler.getFieldString("subsector");
        this.ssx = this.subsectorX[this.letter];
        this.ssy = this.subsectorY[this.letter];
        this.offsetx = this.ssx * 8;
        this.offsety = this.ssy * 10;

        var sector = this.wiki.getTiddler(this.sector);
        
        this.sx = Number(sector.getFieldString("sx"));
        this.sy = Number(sector.getFieldString("sy"));

        return this;
    }
    
    Subsector.prototype.subsectorX = { 
        A: 0, B: 1, C: 2, D: 3, 
        E: 0, F: 1, G: 2, H: 3,
        I: 0, J: 1, K: 2, L: 3,
        M: 0, N: 1, O: 2, P: 3
    };

    Subsector.prototype.subsectorY = { 
        A: 0, B: 0, C: 0, D: 0, 
        E: 1, F: 1, G: 1, H: 1,
        I: 2, J: 2, K: 2, L: 2,
        M: 3, N: 3, O: 3, P: 3
    };

    Subsector.prototype.subsectors = [
        ["A", "E", "I", "M"],
        ["B", "F", "J", "N"],
        ["C", "G", "K", "O"],
        ["D", "H", "L", "P"]
    ];
    
    Subsector.prototype.adjacent = function(dssx,dssy) {
        try {
            var newssx = (((this.ssx + dssx) % 4) + 4) % 4;
            var newssy = (((this.ssy + dssy) % 4) + 4) % 4;
            var newletter = this.subsectors[newssx][newssy];

            var newsx = this.sx;
            if ((this.ssx + dssx) < 0) {
                newsx--;
            } else if ((this.ssx + dssx) > 3) {
                newsx++;
            }
        
            var newsy = this.sy;
            if ((this.ssy + dssy) < 0) {
                newsy--;
            } else if ((this.ssy + dssy) > 3) {
                newsy++;
            }
            
            var sectors = this.wiki.filterTiddlers("[tag[Sector]sx[" + 
                                                   newsx + "]sy[" + newsy + "]]");
        
            if (sectors.length == 0) throw "No adjacent sector";

            var subsectors = this.wiki.filterTiddlers("[tag[Subsector]sector[" +     
                                  sectors[0] + "]subsector[" + newletter + "]]");
            
            if (subsectors.length == 0) throw "No adjacent subsector";
            
            return new Subsector(this.wiki.getTiddler(subsectors[0]), this.wiki);
        } catch (e) {
            console.error(e);
            
            return undefined;
        }
    };
        
    Subsector.prototype.getSystems = function() {
        var titles = this.wiki.filterTiddlers("[tag[System]sector[" + 
                                              this.sector + "]subsector[" + 
                                              this.letter + "]]");
                                              
        var systems = titles.map(function (x) {
            return new System(x, this.wiki);
        }, this);

        return systems;
    };
    
    exports.Subsector = Subsector;

    function Sector(sector, wiki) {
        if (!(this instanceof Sector)) return new Sector(sector, wiki);

        this.wiki = wiki;
    
        if (sector instanceof $tw.Tiddler) {
            this.tiddler = sector;
        } else {
            this.tiddler = this.wiki.getTiddler(sector);
        }
  
        this.wiki = wiki;
  
        this.title = this.tiddler.getFieldString("title");
        this.name = this.tiddler.getFieldString("title");
        this.sx = Number(this.tiddler.getFieldString("sx"));
        this.sy = Number(this.tiddler.getFieldString("sy"));
        
        return this;
    };
    
    Sector.prototype.adjacent = function (dsx, dsy) {
        try {
            var newsx = this.sx + dsx;
            var newsy = this.sy + dsy;
            
            var sectors = this.wiki.filterTiddlers("[tag[Sector]sx[" + newsx +"]sy[" + newsy +"]]");
            
            if (sectors.length == 0) throw "No adjacent sector";
            
            return new Sector(this.wiki.getTiddler(sectors[0]));
            
        } catch(e) {
            console.error(e);
            
            return undefined;
        }
    };
    
    Sector.prototype.getSystems = function() {
        var titles = this.wiki.filterTiddlers("[tag[System]sector[" + 
                                              this.sector + "]]");
                                              
        var systems = titles.map(function(x) {
            return new System(x, this.wiki);
        }, this);

        return systems;
    };

    Sector.prototype.getSubsectors = function() {
        var titles = this.wiki.filterTiddlers("[tag[Subsector]sector[" + 
                                              this.title + "]]");
                                              
        var subsectors = titles.map(function(x) {
            return new Subsector(x, this.wiki)
        },this);
        
        return subsectors;
    };

    exports.Sector = Sector;

    function System(system, wiki) {
        if (!(this instanceof System)) return new System(system, wiki);
        
        this.wiki = wiki;
                                
        if (system instanceof $tw.Tiddler) {
            this.tiddler = system;
        } else {
            this.tiddler = this.wiki.getTiddler(system);
        }
                
        this.title = this.tiddler.getFieldString("title");
        this.name = this.tiddler.getFieldString("name");
        this.hex = this.tiddler.getFieldString("hex");
        this.allegiance = this.tiddler.getFieldString("allegiance");
        this.starport = this.tiddler.getFieldString("starport");
        this.zone = this.tiddler.getFieldString("zone");
        this.hex = this.tiddler.getFieldString("hex");
        this.dry = this.tiddler.getFieldString("hydrographics") == "0";
        this.wet = !this.dry;
        this.belt = this.tiddler.getFieldString("diameter") == "0";
        this.bases = this.tiddler.getFieldString("bases").split(" ");
        this.codes = this.tiddler.getFieldString("tradecodes").split(" ");
        this.hipop = this.codes.includes("Hi");
        this.gasgiants = this.tiddler.getFieldString("gasgiants") != "0";
        this.capital = this.codes.includes("Cx") ||
                       this.codes.includes("Cs") ||
                       this.codes.includes("Cp");
        this.routes = this.tiddler.getFieldString("routes");
        
        return this;
    };

    exports.System = System;


    exports.getHex = function(x, y) {
        return ('00' + x).substr(-2) + 
               ('00' + y).substr(-2);
    };

    exports.padHex = function (num) {
        return ('00' + num).substr(-2);
    };

    // convert between lettered subsectors and subsector coordinates
    exports.getSubsectorX = function (sub) {
        return subsectorX[sub];
    };

    exports.getSubsectorY = function (sub) {
        return subsectorY[sub];
    };

    // convert between subsector coordinates and lettered subsectors
    exports.getSubsector = function (x, y) {
        return subsectors[x][y];
    };

    // calculate offset of lettered subsector within sector
    exports.offsetSubsectorX = function (sub) {
        return subsectorX[sub] * 8;
    };

    exports.offsetSubsectorY = function (sub) {
        return subsectorY[sub] * 10;
    };

    // calculate offset of hex top left within subsector or sector
    exports.offsetX = function (x, y, hexwidth) {
        return ((x - 1) * 0.75 * hexwidth);
    };
    
    exports.offsetY = function (x, y, hexwidth) {
        if (x % 2 == 0) {
            return ((y - 0.5) * 0.86 * hexwidth);
        } else {
            return ((y -1) * 0.86 * hexwidth);
        }
    };

    // calculate offset of hex centre within subsector or sector
    exports.offsetXCentre = function (x, y, hexwidth) {
        return ((x - 1) * 0.75 * hexwidth) + (hexwidth * 0.5);
    };

    exports.offsetYCentre = function (x, y, hexwidth) {
        if (x % 2 == 0) {
            return ((y - 0.5) * 0.86 * hexwidth) + (hexwidth * 0.43);
        } else {
            return ((y -1) * 0.86 * hexwidth) + (hexwidth * 0.43);
        }
    };

    // convert hex location string to x and y numerical components

    exports.hexToX = function (hex) {
        return parseInt(hex.substring(0,2), 10);
    };

    exports.hexToY = function (hex) {
        return parseInt(hex.substring(2,4), 10);
    };

})();
