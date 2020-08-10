"use strict";var __extends=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(exports,"__esModule",{value:!0}),exports.PurposeRestrictionVector=void 0;var PurposeRestriction_1=require("./PurposeRestriction"),BinarySearchTree_1=require("./BinarySearchTree"),RestrictionType_1=require("./RestrictionType"),Cloneable_1=require("../Cloneable"),PurposeRestrictionVector=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.bitLength=0,t.map=new Map,t}return __extends(t,e),t.prototype.has=function(e){return this.map.has(e)},t.prototype.isOkToHave=function(e,t,r){var o,i=r.toString(),n=!0;if(null===(o=this.gvl)||void 0===o?void 0:o.vendors)if(this.gvl.vendors[i]){var s=this.gvl.vendors[i];if(e===RestrictionType_1.RestrictionType.NOT_ALLOWED)n=s.legIntPurposes.includes(t)||s.purposes.includes(t);else if(s.flexiblePurposes.length)switch(e){case RestrictionType_1.RestrictionType.REQUIRE_CONSENT:n=s.flexiblePurposes.includes(t)&&s.legIntPurposes.includes(t);case RestrictionType_1.RestrictionType.REQUIRE_LI:n=s.flexiblePurposes.includes(t)&&s.purposes.includes(t)}}else n=!1;return n},t.prototype.add=function(e,t){var r=this;if(this.isOkToHave(t.restrictionType,t.purposeId,e)){var o=t.hash;this.has(o)||(this.map.set(o,new BinarySearchTree_1.BinarySearchTree),this.bitLength=0),this.getRestrictions(e).forEach((function(o){o.purposeId===t.purposeId&&r.remove(e,o)})),this.map.get(o).add(e)}},t.prototype.getVendors=function(e){var t=[];if(e){var r=e.hash;this.has(r)&&(t=this.map.get(r).get())}else{var o=new Set;this.map.forEach((function(e){e.get().forEach((function(e){o.add(e)}))})),t=Array.from(o)}return t},t.prototype.getRestrictionType=function(e,t){var r;return this.getRestrictions(e).forEach((function(e){e.purposeId===t&&(void 0===r||r>e.restrictionType)&&(r=e.restrictionType)})),r},t.prototype.vendorHasRestriction=function(e,t){for(var r=!1,o=this.getRestrictions(e),i=0;i<o.length&&!r;i++)r=t.isSameAs(o[i]);return r},t.prototype.getMaxVendorId=function(){var e=0;return this.map.forEach((function(t){e=Math.max(t.max(),e)})),e},t.prototype.getRestrictions=function(e){var t=[];return this.map.forEach((function(r,o){e?r.contains(e)&&t.push(PurposeRestriction_1.PurposeRestriction.unHash(o)):t.push(PurposeRestriction_1.PurposeRestriction.unHash(o))})),t},t.prototype.getPurposes=function(){var e=new Set;return this.map.forEach((function(t,r){e.add(PurposeRestriction_1.PurposeRestriction.unHash(r).purposeId)})),Array.from(e)},t.prototype.remove=function(e,t){var r=t.hash,o=this.map.get(r);o&&(o.remove(e),o.isEmpty()&&(this.map.delete(r),this.bitLength=0))},Object.defineProperty(t.prototype,"gvl",{get:function(){return this.gvl_},set:function(e){var t=this;this.gvl_||(this.gvl_=e,this.map.forEach((function(e,r){var o=PurposeRestriction_1.PurposeRestriction.unHash(r);e.get().forEach((function(r){t.isOkToHave(o.restrictionType,o.purposeId,r)||e.remove(r)}))})))},enumerable:!1,configurable:!0}),t.prototype.isEmpty=function(){return 0===this.map.size},Object.defineProperty(t.prototype,"numRestrictions",{get:function(){return this.map.size},enumerable:!1,configurable:!0}),t}(Cloneable_1.Cloneable);exports.PurposeRestrictionVector=PurposeRestrictionVector;