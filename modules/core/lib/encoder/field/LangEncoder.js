"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LangEncoder=void 0;var IntEncoder_1=require("./IntEncoder"),errors_1=require("../../errors"),LangEncoder=function(){function e(){}return e.encode=function(e,r){var n=(e=e.toUpperCase()).charCodeAt(0)-65,o=e.charCodeAt(1)-65;if(n<0||n>25||o<0||o>25)throw new errors_1.EncodingError("invalid language code: "+e);if(r%2==1)throw new errors_1.EncodingError("numBits must be even, "+r+" is not valid");return r/=2,IntEncoder_1.IntEncoder.encode(n,r)+IntEncoder_1.IntEncoder.encode(o,r)},e.decode=function(e,r){if(r!==e.length||e.length%2)throw new errors_1.DecodingError("invalid bit length for language");var n=e.length/2,o=IntEncoder_1.IntEncoder.decode(e.slice(0,n),n)+65,t=IntEncoder_1.IntEncoder.decode(e.slice(n),n)+65;return String.fromCharCode(o)+String.fromCharCode(t)},e}();exports.LangEncoder=LangEncoder;