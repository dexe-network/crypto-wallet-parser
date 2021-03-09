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
    ParseTransaction.prototype.parseTransactionBalancePrice = function (transactions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resultWithParsedBalance, e_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all(transactions.map(function (value, index, array) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var valueCopy, prices, _a, _b, key, uniswapResultFirst, _c, _d, key, uniswapResultSecond;
                                var e_2, _e, e_3, _f;
                                return tslib_1.__generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            valueCopy = tslib_1.__assign({}, value);
                                            return [4 /*yield*/, this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                                                    tokens: Object.keys(value.balance),
                                                    blockNumber: valueCopy.blockNumber,
                                                })];
                                        case 1:
                                            prices = _g.sent();
                                            try {
                                                for (_a = tslib_1.__values(Object.keys(value.balance)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                    key = _b.value;
                                                    uniswapResultFirst = prices[valueCopy.balance[key].address];
                                                    valueCopy.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
                                                    valueCopy.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
                                                    valueCopy.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;
                                                    valueCopy.balance[key].amountInETH = tokens_helper_1.buildBalanceTransformer(
                                                    // Catch less zero token balance (Fix minus Dep)
                                                    valueCopy.balance[key].amount.isLessThan(0) ? new bignumber_js_1.default(0) : valueCopy.balance[key].amount, +valueCopy.balance[key].decimals).multipliedBy(uniswapResultFirst.ethPer1Token);
                                                    valueCopy.balance[key].amountInUSD = tokens_helper_1.buildBalanceTransformer(valueCopy.balance[key].amount.isLessThan(0) ? new bignumber_js_1.default(0) : valueCopy.balance[key].amount, +valueCopy.balance[key].decimals).multipliedBy(uniswapResultFirst.usdPer1Token);
                                                }
                                            }
                                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                            finally {
                                                try {
                                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                                }
                                                finally { if (e_2) throw e_2.error; }
                                            }
                                            if (index === 0) {
                                                try {
                                                    for (_c = tslib_1.__values(Object.keys(value.balanceBeforeTransaction)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                        key = _d.value;
                                                        uniswapResultSecond = prices[valueCopy.balanceBeforeTransaction[key].address];
                                                        valueCopy.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
                                                        valueCopy.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
                                                        valueCopy.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;
                                                        valueCopy.balanceBeforeTransaction[key].amountInETH = tokens_helper_1.buildBalanceTransformer(valueCopy.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                            ? new bignumber_js_1.default(0)
                                                            : valueCopy.balanceBeforeTransaction[key].amount, +valueCopy.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.ethPer1Token);
                                                        valueCopy.balanceBeforeTransaction[key].amountInUSD = tokens_helper_1.buildBalanceTransformer(valueCopy.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                            ? new bignumber_js_1.default(0)
                                                            : valueCopy.balanceBeforeTransaction[key].amount, +valueCopy.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.usdPer1Token);
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
                                            return [2 /*return*/, valueCopy];
                                    }
                                });
                            }); }))];
                    case 1:
                        resultWithParsedBalance = _a.sent();
                        return [2 /*return*/, resultWithParsedBalance.map(function (value, index, array) {
                                var valueCopy = tslib_1.__assign({}, value);
                                if (index === 0) {
                                }
                                else {
                                    valueCopy.balanceBeforeTransaction = array[index - 1].balance;
                                }
                                return valueCopy;
                            })];
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