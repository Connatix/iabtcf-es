"use strict";var __extends=this&&this.__extends||function(){var t=function(e,s){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var s in e)e.hasOwnProperty(s)&&(t[s]=e[s])})(e,s)};return function(e,s){function r(){this.constructor=e}t(e,s),e.prototype=null===s?Object.create(s):(r.prototype=s.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0}),exports.Disabled=void 0;var Response_1=require("./Response"),status_1=require("../status"),Disabled=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.cmpStatus=status_1.CmpStatus.ERROR,e}return __extends(e,t),e}(Response_1.Response);exports.Disabled=Disabled;