"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PowerSet=void 0;var PowerSet=function(){function e(){}return e.generate=function(e){for(var r=1<<e,t=[],o=0;o<r;o++){for(var n=[],u=0;u<e;u++)n.push(!!(o>>u&1));t.push(n)}return t},e}();exports.PowerSet=PowerSet;