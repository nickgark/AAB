/*\
title: $:/plugins/nickgark/AAB/lib/svg.js
type: application/javascript
tags: 
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Exports/exposes symbols that users of this library can later use
 * after require()'ing a reference to this library.
 */

function subclassof(baseClass, superClass) {
    baseClass.prototype = Object.create(superClass.prototype);
    baseClass.prototype.$super = superClass.prototype;
}

function unnull(/* children */) {
	return [].slice.call(arguments).reduce(function(sofar, x) { return sofar !== undefined ? sofar : x; });
}

/*
exports.SVG = function SVG(name, attrs, text) {
	attrs = attrs || {};
	text = text || '';
	var el = document.createElementNS("http://www.w3.org/2000/svg",name);
	for(var attr in attrs) {
		if(attr === 'xlink:href')
			el.setAttributeNS("http://www.w3.org/1999/xlink", 'href', attrs[attr]);
		else
			el.setAttribute(attr, attrs[attr]);
	}
	el.textContent = text;
	return el;
};
*/

// Element

function Element(tagName, attrs, text) {
    if (text) {
        this.children = text;
    } else {
        this.children = [];
	}
	this.tagName = tagName;
	this.attrs = unnull(attrs, {});
	return this;
};

Element.prototype.addTo = function(parent) {
	parent.children.push(this);
	return this;
};

Element.prototype.addAttrs = function(attrs) {
    for (var property in attrs) {
        this.attrs[property] = attrs[property];
    }
};

Element.prototype.toString = function() {
	var str = '<' + this.tagName;
    var group = this.tagName == "g" || this.tagName == "svg";
	for (var attr in this.attrs) {
		str += ' ' + attr + '="' + (this.attrs[attr]+'').replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
	}    
	if (group) str += "\n";
	if (typeof this.children == 'string') {
    	str += '>';
		str += this.children.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    	str += '</' + this.tagName + '>\n';
	} else if (this.children.length > 0) {
        str += '>';
		this.children.forEach(function(e) {
			str += e;
		});
    	str += '</' + this.tagName + '>\n';
	} else {
	    str += '/>\n';
	}
    
	return str;
};

exports.Element = Element;

// SVG element

function SVG(attrs) {
    if (!(this instanceof SVG)) return new SVG(attrs);
    Element.call(this,"svg", attrs);
    this.attrs.xmlns = "http://www.w3.org/2000/svg";
    this.attrs["xmlns:xlink"] = "http://www.w3.org/1999/xlink";
};

subclassof(SVG, Element);

exports.SVG = SVG;

// Path element

function Path(x, y, attrs) {
    if (!(this instanceof Path)) return new Path(x,y,attrs);
    Element.call(this, "path", attrs);
    this.attrs.d = "M" + x + " " + y + " ";
};

subclassof(Path, Element);

Path.prototype.M = function(x, y) {
    this.attrs.d += "M" + x + " " + y + " ";
    return this;
};

Path.prototype.m = function(dx, dy) {
    this.attrs.d += "m" + dx + " " + dy + " ";
    return this;
};

Path.prototype.L = function(x, y) {
    this.attrs.d += "L" + x + " " + y + " ";
    return this;
};

Path.prototype.l = function(dx, dy) {
    this.attrs.d += "l" + dx + " " + dy + " ";
    return this;
};

Path.prototype.H = function(x) {
    this.attrs.d += "H" + x + " ";
    return this;
};

Path.prototype.h = function(dx) {
    this.attrs.d += "h" + dx + " ";
    return this;
};

Path.prototype.V = function(y) {
    this.attrs.d += "V" + y + " ";
    return this;
};

Path.prototype.v = function(dy) {
    this.attrs.d += "v" + dy + " ";
    return this;
};

Path.prototype.z = function() {
    this.attrs.d += "z";
    return this;  
};

exports.Path = Path;

// Rect element

function Rect(x, y, width, height, attrs) {
    if (!(this instanceof Rect)) return new Rect(x, y, width, height, attrs);
    Element.call(this, "rect", attrs);
    this.attrs.x = x;
    this.attrs.y = y;
    this.attrs.width = width;
    this.attrs.height = height;
};

subclassof(Rect, Element);

exports.Rect = Rect;

// Circle element

function Circle(cx, cy, r, attrs) {
    if (!(this instanceof Circle)) return new Circle(cx, cy, r, attrs);
    Element.call(this, "circle", attrs);
    this.attrs.cx = cx;
    this.attrs.cy = cy;
    this.attrs.r = r;
};

subclassof(Circle, Element);

exports.Circle = Circle;

function G(attrs) {
    if (!(this instanceof G)) return new G(attrs);
    Element.call(this, "g", attrs);
    this.attrs.transform = "";
};

subclassof(G, Element);

G.prototype.translate = function(x, y) {
    this.attrs.transform += "translate(" + x + " " + y + ") ";
    return this;
};

G.prototype.scale = function(x, y) {
    this.attrs.transform += "scale(" + x + " " + y + ") ";
    return this;    
};

G.prototype.rotate = function(a, x, y) {
    this.attrs.transform += "rotate(" + a + " " + "x" + y + ") ";
    return this;    
};

G.prototype.skewX = function(a) {
    this.attrs.transform += "skewX(" + a + ") ";
    return this;    
};

G.prototype.skewY = function(a) {
    this.attrs.transform += "skewY(" + a + ") ";
    return this;    
};

exports.G = G;

// Text element

function Text(text, attrs) {
    if (!(this instanceof Text)) return new Text(text, attrs);
    Element.call(this, "text", attrs, text);    
};

subclassof(Text, Element);

exports.Text = Text;


// A element

function A(url, attrs) {
    if (!(this instanceof A)) return new A(url,attrs);
    Element.call(this, "a", attrs);    
    this.attrs["xlink:href"] = url.replace(/ /g, '%20');
};

subclassof(A, Element);

exports.A = A;

function Defs(attrs) {
    if (!(this instanceof Defs)) return new Defs(attrs);
    Element.call(this, "defs", attrs);    
};

subclassof(Defs, Element);

exports.Defs = Defs;

function ClipPath(attrs) {
    if (!(this instanceof ClipPath)) return new ClipPath(attrs);
    Element.call(this, "clipPath", attrs);    
};

subclassof(ClipPath, Element);

exports.ClipPath = ClipPath;

})();
