"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.smellsLikeGVL=void 0;var chai_1=require("chai");exports.smellsLikeGVL=function(e){chai_1.expect(e,"maybe gvl?").to.include(["gvlSpecificationVersion","vendorListVersion","tcfPolicyVersion","lastUpdated","purposes","specialPurposes","features","specialFeatures","vendors","stacks"])};