#!/usr/bin/env node
"use strict";
/* eslint no-console: 0 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@iabtcf/core");
var args = process.argv;
var encoded = '';
try {
    for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
        var arg = args_1_1.value;
        if (arg.charAt(0) === 'C' || arg.charAt(0) === 'B') {
            encoded = arg;
            break;
        }
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
    }
    finally { if (e_1) throw e_1.error; }
}
var print = function (key, value, indent) {
    if (indent === void 0) { indent = 0; }
    var indentString = '  '.repeat(indent);
    key = '\x1b[33m' + key + '\x1b[0m';
    switch (typeof value) {
        case 'string':
            console.log("" + indentString + key + ": \u001B[32m\"" + value + "\"\u001B[0m");
            break;
        case 'boolean':
            console.log("" + indentString + key + ": \u001B[35m\u001B[1m" + value + "\u001B[0m");
            break;
        case 'object':
            if (value instanceof Date) {
                console.log("" + indentString + key + ": \u001B[36m" + value.toString() + "\u001B[0m");
            }
            else if (value === null) {
                console.log("" + indentString + key + ": \u001B[1m" + value + "\u001B[0m");
            }
            else if (value instanceof core_1.Vector) {
                console.log("\u001B[1m" + indentString + key + "\u001B[0m");
                value.forEach(function (bool, id) {
                    print(id, bool, indent + 1);
                });
            }
            else {
                console.log("\u001B[1m" + indentString + key + "\u001B[0m");
                Object.keys(value).forEach(function (key) {
                    print(key, value[key], indent + 1);
                });
            }
            break;
        case 'number':
            console.log("" + indentString + key + ": " + value + "\u001B[0m");
            break;
    }
};
if (encoded) {
    print('encoded', encoded);
    try {
        var tcModel = core_1.TCString.decode(encoded);
        var version = tcModel.version;
        print('version', version);
        print('cmpId', tcModel.cmpId);
        print('cmpVersion', tcModel.cmpVersion);
        print('consentScreen', tcModel.consentScreen);
        print('consentLanguage', tcModel.consentLanguage);
        print('created', tcModel.created);
        print('lastUpdated', tcModel.lastUpdated);
        if (version !== 1) {
            print('policyVersion', tcModel.policyVersion);
            print('isServiceSpecific', tcModel.isServiceSpecific);
            print('useNonStandardStacks', tcModel.useNonStandardStacks);
            print('purposeOneTreatment', tcModel.purposeOneTreatment);
            print('publisherCountryCode', tcModel.publisherCountryCode);
        }
        print('vendorListVersion', tcModel.vendorListVersion);
        print('purposeConsents', tcModel.purposeConsents);
        if (version !== 1) {
            print('purposeLegitimateInterests', tcModel.purposeLegitimateInterests);
            print('specialFeatureOptins', tcModel.specialFeatureOptins);
            print('publisherLegitimateInterests', tcModel.publisherLegitimateInterests);
            print('publisherCustomConsents', tcModel.publisherCustomConsents);
            print('publisherConsents', tcModel.publisherConsents);
            print('publisherCustomLegitimateInterests', tcModel.publisherCustomLegitimateInterests);
        }
        print('vendorConsents', tcModel.vendorConsents);
        if (version !== 1) {
            print('vendorLegitimateInterests', tcModel.vendorLegitimateInterests);
            print('vendorsDisclosed', tcModel.vendorsDisclosed);
            print('vendorsAllowed', tcModel.vendorsAllowed);
        }
    }
    catch (err) {
        console.error("Unable to decode TC string: " + err.message);
    }
}
else {
    console.error('Please pass a TC string');
}
