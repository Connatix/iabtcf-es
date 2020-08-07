"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.FixedVectorEncoder=void 0;var BooleanEncoder_1=require("./BooleanEncoder"),errors_1=require("../../errors"),model_1=require("../../model"),FixedVectorEncoder=function(){function e(){}return e.encode=function(e,o){for(var r="",n=1;n<=o;n++)r+=BooleanEncoder_1.BooleanEncoder.encode(e.has(n));return r},e.decode=function(e,o){if(e.length!==o)throw new errors_1.DecodingError("bitfield encoding length mismatch");for(var r=new model_1.Vector,n=1;n<=o;n++)BooleanEncoder_1.BooleanEncoder.decode(e[n-1])&&r.set(n);return r.bitLength=e.length,r},e}();exports.FixedVectorEncoder=FixedVectorEncoder;