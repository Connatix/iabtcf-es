"use strict";var __extends=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function i(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(i.prototype=r.prototype,new i)}}();Object.defineProperty(exports,"__esModule",{value:!0}),exports.PurposeRestrictionVector=void 0;var PurposeRestriction_1=require("./PurposeRestriction"),BinarySearchTree_1=require("./BinarySearchTree"),RestrictionType_1=require("./RestrictionType"),Cloneable_1=require("../Cloneable"),PurposeRestrictionVector=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.bitLength=0,t.map=new Map,t}return __extends(t,e),t.prototype.has=function(e){return this.map.has(e)},t.prototype.isOkToHave=function(e,t,r){var i,o=r.toString(),s=!0;if(null===(i=this.gvl)||void 0===i?void 0:i.vendors)if(this.gvl.vendors[o]){var n=this.gvl.vendors[o];if(e===RestrictionType_1.RestrictionType.NOT_ALLOWED)s=n.legIntPurposes.includes(t)||n.purposes.includes(t);else if(n.flexiblePurposes.length)switch(e){case RestrictionType_1.RestrictionType.REQUIRE_CONSENT:s=n.flexiblePurposes.includes(t)&&n.legIntPurposes.includes(t);case RestrictionType_1.RestrictionType.REQUIRE_LI:s=n.flexiblePurposes.includes(t)&&n.purposes.includes(t)}}else s=!1;return s},t.prototype.add=function(e,t){var r=this;if(this.isOkToHave(t.restrictionType,t.purposeId,e)){var i=t.hash;this.has(i)||(this.map.set(i,new BinarySearchTree_1.BinarySearchTree),this.bitLength=0),this.getRestrictions(e).forEach((function(i){i.purposeId===t.purposeId&&r.remove(e,i)})),this.map.get(i).add(e)}},t.prototype.getRestrictions=function(e){var t=[];return this.map.forEach((function(r,i){e?r.contains(e)&&t.push(PurposeRestriction_1.PurposeRestriction.unHash(i)):t.push(PurposeRestriction_1.PurposeRestriction.unHash(i))})),t},t.prototype.remove=function(e,t){var r=t.hash,i=this.map.get(r);i&&(i.remove(e),i.isEmpty()&&(this.map.delete(r),this.bitLength=0))},Object.defineProperty(t.prototype,"gvl",{get:function(){return this.gvl_},set:function(e){var t=this;this.gvl_||(this.gvl_=e,this.map.forEach((function(e,r){var i=PurposeRestriction_1.PurposeRestriction.unHash(r);e.get().forEach((function(r){t.isOkToHave(i.restrictionType,i.purposeId,r)||e.remove(r)}))})))},enumerable:!1,configurable:!0}),t.prototype.isEmpty=function(){return 0===this.map.size},t}(Cloneable_1.Cloneable);exports.PurposeRestrictionVector=PurposeRestrictionVector;