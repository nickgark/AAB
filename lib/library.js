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
    }

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
