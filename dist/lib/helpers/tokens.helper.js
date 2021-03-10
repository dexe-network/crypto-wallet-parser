"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsedBalanceToRaw = exports.buildBalanceTransformer = exports.tokenBalanceTransformer = void 0;
var bignumber_js_1 = require("bignumber.js");
var tokenBalanceTransformer = function (value, arg) {
    if (!value || !(typeof (arg === null || arg === void 0 ? void 0 : arg.decimals) === 'number')) {
        return new bignumber_js_1.default(0);
    }
    var balance = new bignumber_js_1.default(value);
    var decimals = arg.decimals;
    var decimalsBN = new bignumber_js_1.default(decimals);
    var divisor = new bignumber_js_1.default(10).pow(decimalsBN);
    var beforeDecimal = balance.div(divisor);
    return beforeDecimal;
};
exports.tokenBalanceTransformer = tokenBalanceTransformer;
var buildBalanceTransformer = function (value, decimals) {
    if (!value || !(typeof decimals === 'number')) {
        return new bignumber_js_1.default(0);
    }
    var balance = value;
    var decimalsBN = new bignumber_js_1.default(decimals);
    var divisor = new bignumber_js_1.default(10).pow(decimalsBN);
    var beforeDecimal = balance.div(divisor);
    return beforeDecimal;
};
exports.buildBalanceTransformer = buildBalanceTransformer;
var parsedBalanceToRaw = function (value, decimals) {
    if (!value || !(typeof decimals === 'number')) {
        return new bignumber_js_1.default(0);
    }
    var balance = value;
    var decimalsBN = new bignumber_js_1.default(decimals);
    var divisor = new bignumber_js_1.default(10).pow(decimalsBN);
    var beforeDecimal = balance.multipliedBy(divisor);
    return beforeDecimal;
};
exports.parsedBalanceToRaw = parsedBalanceToRaw;
//# sourceMappingURL=tokens.helper.js.map