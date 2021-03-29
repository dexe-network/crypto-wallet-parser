"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAdressPriceArr = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var generateTokenAdressPriceArr = function (data) {
    return lodash_1.default.uniq(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(Object.keys(data.balancesBeforeTransaction).filter(function (token) {
        return data.balancesBeforeTransaction[token].amount.isGreaterThan(0);
    }))), tslib_1.__read(Object.keys(data.balances).filter(function (token) { return data.balances[token].amount.isGreaterThanOrEqualTo(0); }))));
};
exports.generateTokenAdressPriceArr = generateTokenAdressPriceArr;
//# sourceMappingURL=logic.js.map