/*\
created: 20181121104109374
type: application/javascript
title: $:/plugins/nickgark/AAB/macro/subsectormap
tags: 
modified: 20200525193624524
module-type: macro
\*/
/*
title: $:/plugins/nickgark/AAB/macro/subsectormap
type: application/javascript
module-type: macro
*/
(function(){
    /* jslint node: true, browser: true */
    /* global $tw: false */
    "use strict";

    exports.name = "subsectormap";

    exports.params = [];

    exports.run = function() {
      var ret = "";
      var tid = this.wiki.getTiddler(this.getVariable("currentTiddler"));
      var sec = tid.getFieldString("sector");
      var sub = tid.getFieldString("subsector");
      var titles = this.wiki.filterTiddlers("[tag[System]sector[" + sec + "]subsector[" + sub + "]sort[hex]]");
      var systems = titles.map(x => this.wiki.getTiddler(x));

      for (var i = 0; i < systems.length; i++) {
        ret += systems[i].getFieldString("title") + ": " + systems[i].getFieldString("starport") + "\n\n";
      }

      return ret;
    };

})();