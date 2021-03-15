"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTransaction = void 0;
var tslib_1 = require("tslib");
var tokens_helper_1 = require("../../helpers/tokens.helper");
var bignumber_js_1 = require("bignumber.js");
var ParseTransaction = /** @class */ (function () {
    function ParseTransaction(uniswapService) {
        this.uniswapService = uniswapService;
    }
    ParseTransaction.prototype.parseTransactionBalancePrice = function (transactions, isVirtualTransactions) {
        if (isVirtualTransactions === void 0) { isVirtualTransactions = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resultWithParsedBalance, e_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all(transactions.map(function (itemValue, index, array) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var value, prices, _a, _b, key, uniswapResultFirst, _c, _d, key, uniswapResultSecond;
                                var e_2, _e, e_3, _f;
                                return tslib_1.__generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            value = itemValue;
                                            return [4 /*yield*/, this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                                                    tokens: Object.keys(value.balance),
                                                    blockNumber: value.blockNumber,
                                                })];
                                        case 1:
                                            prices = _g.sent();
                                            try {
                                                for (_a = tslib_1.__values(Object.keys(value.balance)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                    key = _b.value;
                                                    uniswapResultFirst = prices[value.balance[key].address];
                                                    value.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
                                                    value.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
                                                    value.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;
                                                    value.balance[key].amountInETH = tokens_helper_1.buildBalanceTransformer(
                                                    // Catch less zero token balance (Fix minus Dep)
                                                    value.balance[key].amount.isLessThan(0) ? new bignumber_js_1.default(0) : value.balance[key].amount, +value.balance[key].decimals).multipliedBy(uniswapResultFirst.ethPer1Token);
                                                    value.balance[key].amountInUSD = tokens_helper_1.buildBalanceTransformer(value.balance[key].amount.isLessThan(0) ? new bignumber_js_1.default(0) : value.balance[key].amount, +value.balance[key].decimals).multipliedBy(uniswapResultFirst.usdPer1Token);
                                                }
                                            }
                                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                            finally {
                                                try {
                                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                                }
                                                finally { if (e_2) throw e_2.error; }
                                            }
                                            if (index === 0 && !isVirtualTransactions) {
                                                try {
                                                    for (_c = tslib_1.__values(Object.keys(value.balanceBeforeTransaction)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                        key = _d.value;
                                                        uniswapResultSecond = prices[value.balanceBeforeTransaction[key].address];
                                                        value.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
                                                        value.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
                                                        value.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;
                                                        value.balanceBeforeTransaction[key].amountInETH = tokens_helper_1.buildBalanceTransformer(value.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                            ? new bignumber_js_1.default(0)
                                                            : value.balanceBeforeTransaction[key].amount, +value.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.ethPer1Token);
                                                        value.balanceBeforeTransaction[key].amountInUSD = tokens_helper_1.buildBalanceTransformer(value.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                            ? new bignumber_js_1.default(0)
                                                            : value.balanceBeforeTransaction[key].amount, +value.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.usdPer1Token);
                                                    }
                                                }
                                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                                finally {
                                                    try {
                                                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                                    }
                                                    finally { if (e_3) throw e_3.error; }
                                                }
                                            }
                                            return [2 /*return*/, value];
                                    }
                                });
                            }); }))];
                    case 1:
                        resultWithParsedBalance = _a.sent();
                        return [2 /*return*/, resultWithParsedBalance];
                    case 2:
                        e_1 = _a.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ParseTransaction;
}());
exports.ParseTransaction = ParseTransaction;
//# sourceMappingURL=parseTransaction.js.map