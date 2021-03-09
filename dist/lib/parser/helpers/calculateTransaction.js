"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTransaction = void 0;
var bignumber_js_1 = require("bignumber.js");
var pointWalletAddress_1 = require("../../constants/pointWalletAddress");
var tradesBuilderV2_interface_1 = require("../../interfaces/parser/tradesBuilderV2.interface");
var CalculateTransaction = /** @class */ (function () {
    function CalculateTransaction() {
    }
    CalculateTransaction.prototype.points = function (profitLoss, tokenAddress) {
        var percentMultiply = this.pointsMultiply(tokenAddress);
        return profitLoss.multipliedBy(percentMultiply);
    };
    CalculateTransaction.prototype.pointsMultiply = function (walletAddress) {
        if (pointWalletAddress_1.X3POINTS.includes(walletAddress)) {
            return 3;
        }
        if (pointWalletAddress_1.X2POINTS.includes(walletAddress)) {
            return 2;
        }
        return 1;
    };
    CalculateTransaction.prototype.calculateProfitLossOnAnyPosition = function (data) {
        var buyEvents = data.tradeEvents.filter(function (x) { return x.tradeType === tradesBuilderV2_interface_1.TradeType.BUY; });
        var sellEvents = data.tradeEvents.filter(function (x) { return x.tradeType === tradesBuilderV2_interface_1.TradeType.SELL; });
        if (sellEvents.length === 0) {
            return {
                profitLoss: { fromETH: new bignumber_js_1.default(0), fromUSD: new bignumber_js_1.default(0) },
                profit: { fromETH: new bignumber_js_1.default(0), fromUSD: new bignumber_js_1.default(0) },
            };
        }
        var profit = buyEvents.reduce(function (accum, value) {
            var plFromValue = value.sellOperations.reduce(function (accumLocal, valueLocal) {
                accumLocal.profitLoss.eth = accumLocal.profitLoss.eth.plus(valueLocal.profitLoss.eth);
                accumLocal.profitLoss.usd = accumLocal.profitLoss.usd.plus(valueLocal.profitLoss.usd);
                accumLocal.profit.eth = accumLocal.profit.eth.plus(valueLocal.profit.eth);
                accumLocal.profit.usd = accumLocal.profit.usd.plus(valueLocal.profit.usd);
                return accumLocal;
            }, {
                profitLoss: { eth: new bignumber_js_1.default(0), usd: new bignumber_js_1.default(0) },
                profit: { eth: new bignumber_js_1.default(0), usd: new bignumber_js_1.default(0) },
            });
            accum.profitLoss.eth = accum.profitLoss.eth.plus(plFromValue.profitLoss.eth);
            accum.profitLoss.usd = accum.profitLoss.usd.plus(plFromValue.profitLoss.usd);
            accum.profit.eth = accum.profit.eth.plus(plFromValue.profit.eth);
            accum.profit.usd = accum.profit.usd.plus(plFromValue.profit.usd);
            return accum;
        }, {
            profitLoss: { eth: new bignumber_js_1.default(0), usd: new bignumber_js_1.default(0) },
            profit: { eth: new bignumber_js_1.default(0), usd: new bignumber_js_1.default(0) },
        });
        return {
            profitLoss: { fromETH: profit.profitLoss.eth, fromUSD: profit.profitLoss.usd },
            profit: { fromETH: profit.profit.eth, fromUSD: profit.profit.usd },
        };
    };
    CalculateTransaction.prototype.totalProfitLoss = function (data) {
        return data.reduce(function (accum, value) {
            accum.profitLoss.fromETH = accum.profitLoss.fromETH.plus(value.profitLossFromETH);
            accum.profitLoss.fromUSD = accum.profitLoss.fromUSD.plus(value.profitLossFromUSD);
            accum.profit.fromETH = accum.profit.fromETH.plus(value.profitFromETH);
            accum.profit.fromUSD = accum.profit.fromUSD.plus(value.profitFromUSD);
            return accum;
        }, {
            profitLoss: { fromETH: new bignumber_js_1.default(0), fromUSD: new bignumber_js_1.default(0) },
            profit: { fromETH: new bignumber_js_1.default(0), fromUSD: new bignumber_js_1.default(0) },
        });
    };
    CalculateTransaction.prototype.totalPoints = function (data) {
        return data.reduce(function (accum, value) {
            accum = accum.plus(value.points);
            return accum;
        }, new bignumber_js_1.default(0));
    };
    CalculateTransaction.prototype.tradesCount = function (data) {
        return data.reduce(function (accum, value) {
            accum = accum + value.tradeEvents.length;
            return accum;
        }, 0);
    };
    CalculateTransaction.prototype.getCurrentWalletBalance = function (data) {
        return Object.values(data.balance).reduce(function (accum, currentValue) {
            accum['amountInETH'] = accum['amountInETH'].plus(currentValue.amountInETH);
            accum['amountInUSD'] = accum['amountInUSD'].plus(currentValue.amountInUSD);
            return accum;
        }, { amountInETH: new bignumber_js_1.default(0), amountInUSD: new bignumber_js_1.default(0) });
    };
    return CalculateTransaction;
}());
exports.CalculateTransaction = CalculateTransaction;
//# sourceMappingURL=calculateTransaction.js.map