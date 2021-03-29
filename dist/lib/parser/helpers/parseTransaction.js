"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTransaction = void 0;
var tslib_1 = require("tslib");
var tokens_helper_1 = require("../../helpers/tokens.helper");
var bignumber_js_1 = require("bignumber.js");
var logic_1 = require("../shared/logic");
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
    ParseTransaction.prototype.parseTransactionBalancePriceSingle = function (transaction, parseBeforePrices) {
        if (parseBeforePrices === void 0) { parseBeforePrices = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value_1, prices, _a, _b, key, uniswapResultFirst, _c, _d, key, uniswapResultSecond, e_4;
            var e_5, _e, e_6, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 2, , 3]);
                        value_1 = transaction;
                        return [4 /*yield*/, this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                                tokens: parseBeforePrices
                                    ? // Important value - affect to generate cache id
                                        logic_1.generateTokenAdressPriceArr({
                                            balances: value_1.balance,
                                            balancesBeforeTransaction: value_1.balanceBeforeTransaction,
                                        })
                                    : Object.keys(value_1.balance).filter(function (token) { return value_1.balance[token].amount.isGreaterThanOrEqualTo(0); }),
                                blockNumber: value_1.blockNumber,
                            })];
                    case 1:
                        prices = _g.sent();
                        try {
                            for (_a = tslib_1.__values(Object.keys(value_1.balance)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                key = _b.value;
                                uniswapResultFirst = prices[value_1.balance[key].address];
                                if (value_1.balance[key].amount.isGreaterThanOrEqualTo(0)) {
                                    value_1.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
                                    value_1.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
                                    value_1.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;
                                    value_1.balance[key].amountInETH = tokens_helper_1.buildBalanceTransformer(value_1.balance[key].amount, +value_1.balance[key].decimals).multipliedBy(uniswapResultFirst.ethPer1Token);
                                    value_1.balance[key].amountInUSD = tokens_helper_1.buildBalanceTransformer(value_1.balance[key].amount, +value_1.balance[key].decimals).multipliedBy(uniswapResultFirst.usdPer1Token);
                                }
                                else {
                                    value_1.balance[key].ethPer1Token = new bignumber_js_1.default(0);
                                    value_1.balance[key].usdPer1Token = new bignumber_js_1.default(0);
                                    value_1.balance[key].usdPer1ETH = new bignumber_js_1.default(0);
                                    value_1.balance[key].amountInETH = new bignumber_js_1.default(0);
                                    value_1.balance[key].amountInUSD = new bignumber_js_1.default(0);
                                }
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        if (parseBeforePrices) {
                            try {
                                for (_c = tslib_1.__values(Object.keys(value_1.balanceBeforeTransaction)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    key = _d.value;
                                    if (value_1.balanceBeforeTransaction[key].amount.isGreaterThan(0)) {
                                        uniswapResultSecond = prices[value_1.balanceBeforeTransaction[key].address];
                                        value_1.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
                                        value_1.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
                                        value_1.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;
                                        value_1.balanceBeforeTransaction[key].amountInETH = tokens_helper_1.buildBalanceTransformer(value_1.balanceBeforeTransaction[key].amount, +value_1.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.ethPer1Token);
                                        value_1.balanceBeforeTransaction[key].amountInUSD = tokens_helper_1.buildBalanceTransformer(value_1.balanceBeforeTransaction[key].amount, +value_1.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.usdPer1Token);
                                    }
                                    else {
                                        value_1.balanceBeforeTransaction[key].ethPer1Token = new bignumber_js_1.default(0);
                                        value_1.balanceBeforeTransaction[key].usdPer1Token = new bignumber_js_1.default(0);
                                        value_1.balanceBeforeTransaction[key].usdPer1ETH = new bignumber_js_1.default(0);
                                        value_1.balanceBeforeTransaction[key].amountInETH = new bignumber_js_1.default(0);
                                        value_1.balanceBeforeTransaction[key].amountInUSD = new bignumber_js_1.default(0);
                                    }
                                }
                            }
                            catch (e_6_1) { e_6 = { error: e_6_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                }
                                finally { if (e_6) throw e_6.error; }
                            }
                        }
                        return [2 /*return*/, value_1];
                    case 2:
                        e_4 = _g.sent();
                        throw e_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ParseTransaction.prototype.parsePriceAndStoreToCache = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var firstTransaction, lastTransaction, e_7;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        firstTransaction = this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                            tokens: data.firstTransaction.tokens,
                            blockNumber: data.firstTransaction.blockNumber,
                        });
                        lastTransaction = this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                            tokens: data.lastTransaction.tokens,
                            blockNumber: data.lastTransaction.blockNumber,
                        });
                        // Parse Price
                        return [4 /*yield*/, Promise.all(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(data.prebuildTrades.map(function (itemValue) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                                                tokens: itemValue.tokens,
                                                blockNumber: itemValue.blockNumber,
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, true];
                                    }
                                });
                            }); }))), tslib_1.__read(data.uniswapTransactions.map(function (itemValue) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.uniswapService.getUniswapTransactionByIdLimiter({
                                                transactionId: itemValue.hash,
                                                blockNumber: itemValue.blockNumber,
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, true];
                                    }
                                });
                            }); }))), [
                                // Parse Start and Current Dep
                                firstTransaction,
                                lastTransaction,
                            ]))];
                    case 1:
                        // Parse Price
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_7 = _a.sent();
                        throw e_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ParseTransaction;
}());
exports.ParseTransaction = ParseTransaction;
//# sourceMappingURL=parseTransaction.js.map