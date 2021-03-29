"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformTransaction = void 0;
var tslib_1 = require("tslib");
var defaultConfig_1 = require("../../constants/defaultConfig");
var logic_1 = require("../shared/logic");
var TransformTransaction = /** @class */ (function () {
    function TransformTransaction() {
    }
    TransformTransaction.prototype.transformTokenTradeObjectToArr = function (data) {
        // Up all trades to single array
        return Object.values(data)
            .reduce(function (accum, item) {
            accum.push.apply(accum, tslib_1.__spreadArray([], tslib_1.__read(item.trades)));
            return accum;
        }, new Array())
            .sort(function (a, b) {
            if (a.openTimeStamp < b.openTimeStamp) {
                return -1;
            }
            if (a.openTimeStamp > b.openTimeStamp) {
                return 1;
            }
            return 0;
        });
    };
    TransformTransaction.prototype.buildCacheRequestData = function (prebuildTradesData, rawTransactions) {
        var prebuildTrades = this.transformPrebuildTokenTradeObjectToArr(prebuildTradesData);
        var firstTransactionRaw = rawTransactions[0];
        var firstTransaction = {
            tokens: Object.keys(firstTransactionRaw.balance).filter(function (token) {
                return firstTransactionRaw.balance[token].amount.isGreaterThanOrEqualTo(0);
            }),
            blockNumber: firstTransactionRaw.blockNumber,
            hash: firstTransactionRaw.hash,
        };
        var lastTransactionRaw = rawTransactions[rawTransactions.length - 1];
        var lastTransaction = {
            tokens: Object.keys(lastTransactionRaw.balance).filter(function (token) {
                return lastTransactionRaw.balance[token].amount.isGreaterThanOrEqualTo(0);
            }),
            blockNumber: lastTransactionRaw.blockNumber,
            hash: lastTransactionRaw.hash,
        };
        var uniswapTransactions = rawTransactions
            .filter(function (x) { var _a, _b; return x.normalTransactions && ((_b = (_a = x.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig_1.default.uniswap.uniswapRouterAddress; })
            .map(function (x) {
            return {
                hash: x.hash,
                blockNumber: x.blockNumber,
                tokens: [],
            };
        });
        return {
            prebuildTrades: prebuildTrades,
            firstTransaction: firstTransaction,
            lastTransaction: lastTransaction,
            uniswapTransactions: uniswapTransactions,
            requestsCount: +(firstTransaction.tokens.length / 4.5 +
                lastTransaction.tokens.length / 4.5 +
                this.calculateTokensLength(prebuildTrades) / 4.5 +
                uniswapTransactions.length).toFixed(),
        };
    };
    TransformTransaction.prototype.calculateTokensLength = function (data) {
        return data.reduce(function (accum, value) {
            accum += value.tokens.length;
            return accum;
        }, 0);
    };
    TransformTransaction.prototype.transformPrebuildTokenTradeObjectToArr = function (data) {
        // Up all trades to single array
        return Object.values(data)
            .reduce(function (accum, item) {
            accum.push.apply(accum, tslib_1.__spreadArray([], tslib_1.__read(item.trades)));
            return accum;
        }, new Array())
            .reduce(function (accum, item) {
            accum.push.apply(accum, tslib_1.__spreadArray([], tslib_1.__read(item.tradeEvents)));
            return accum;
        }, new Array())
            .map(function (item) {
            return {
                hash: item.transactionHash,
                // Important value - affect to generate cache id
                tokens: logic_1.generateTokenAdressPriceArr(item),
                blockNumber: item.blockNumber,
            };
        });
    };
    return TransformTransaction;
}());
exports.TransformTransaction = TransformTransaction;
//# sourceMappingURL=transformTransaction.js.map