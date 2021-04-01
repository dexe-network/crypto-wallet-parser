"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesBuilderV2Prebuild = void 0;
var tslib_1 = require("tslib");
var bignumber_js_1 = require("bignumber.js");
var moment_1 = require("moment");
var defaultConfig_1 = require("../../constants/defaultConfig");
var lodash_1 = require("lodash");
var tradesBuilderV2_interface_1 = require("../../interfaces/parser/tradesBuilderV2.interface");
var tokens_helper_1 = require("../../helpers/tokens.helper");
var stableCoins_1 = require("../../constants/stableCoins");
var tradesBuilderV2_configs_1 = require("../configs/tradesBuilderV2.configs");
var tokenInfo_1 = require("../../constants/tokenInfo");
var TradesBuilderV2Prebuild = /** @class */ (function () {
    function TradesBuilderV2Prebuild(services, config) {
        this.services = services;
        this.config = config;
        this.behaviourConfig = tradesBuilderV2_configs_1.generateBehaviourConfig(config);
    }
    TradesBuilderV2Prebuild.prototype.buildTrades = function (data, currentBlockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rawResult, openTrades, withVirtualTrades, virtualTrade;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.behaviourIterator(data)];
                    case 1:
                        rawResult = _a.sent();
                        openTrades = Object.values(rawResult)
                            .map(function (x) { return x.trades[x.trades.length - 1]; })
                            .filter(function (x) { return x.tradeStatus === tradesBuilderV2_interface_1.TradeStatus.OPEN; });
                        if (!(openTrades.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.generateVirtualTrades(openTrades, data[data.length - 1], currentBlockNumber)];
                    case 2:
                        virtualTrade = _a.sent();
                        return [4 /*yield*/, this.behaviourIterator(virtualTrade, rawResult)];
                    case 3:
                        withVirtualTrades = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, withVirtualTrades ? withVirtualTrades : rawResult];
                }
            });
        });
    };
    TradesBuilderV2Prebuild.prototype.generateVirtualTrades = function (openTrades, lastGroupedTransaction, currentBlockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.generateVirtualTransactions(openTrades, lastGroupedTransaction, currentBlockNumber)];
                }
                catch (e) {
                    throw e;
                }
                return [2 /*return*/];
            });
        });
    };
    TradesBuilderV2Prebuild.prototype.generateVirtualTransactions = function (openTrades, lastGroupedTransaction, currentBlockNumber) {
        var _this = this;
        return openTrades.reduce(function (accum, value, index) {
            var balanceBeforeTransaction = lastGroupedTransaction.balance;
            var result = {
                normalTransactions: [],
                internalTransactions: [],
                erc20Transactions: [],
                erc721Transactions: [],
                balanceBeforeTransaction: balanceBeforeTransaction,
                balance: _this.generateBalanceDiffForVirtualTradePnl(value, balanceBeforeTransaction),
                blockNumber: currentBlockNumber - tradesBuilderV2_configs_1.virtualTradeBlockNumberOffset,
                previousTransactionBlockNumber: lastGroupedTransaction.blockNumber,
                feeInETH: new bignumber_js_1.default(0),
                isVirtualTransaction: true,
                hash: "AUTO_CLOSE_TRADE_TRANSACTION " + (index + 1),
                timeStamp: moment_1.default().unix().toString(),
            };
            accum.push(result);
            return accum;
        }, []);
    };
    TradesBuilderV2Prebuild.prototype.generateBalanceDiffForVirtualTradePnl = function (trade, balance) {
        var _a;
        return tslib_1.__assign(tslib_1.__assign({}, Object.values(balance).reduce(function (accum, value) {
            accum[value.address] = {
                symbol: value.symbol,
                name: value.name,
                address: value.address,
                decimals: value.decimals,
                amount: value.amount.negated().negated(),
            };
            return accum;
        }, {})), (_a = {}, _a[trade.tokenAddress] = {
            symbol: balance[trade.tokenAddress].symbol,
            name: balance[trade.tokenAddress].name,
            address: balance[trade.tokenAddress].address,
            decimals: balance[trade.tokenAddress].decimals,
            amount: balance[trade.tokenAddress].amount.minus(trade.balance),
        }, _a));
    };
    TradesBuilderV2Prebuild.prototype.behaviourIterator = function (data, initValue) {
        if (initValue === void 0) { initValue = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                // console.log('behaviourIterator', data.length);
                return [2 /*return*/, data.reduce(function (accumulatorValuePromise, currentItem, index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var accumulatorValue, state, _a, _b, operation, _c, _d, operation;
                        var e_1, _e, e_2, _f;
                        return tslib_1.__generator(this, function (_g) {
                            switch (_g.label) {
                                case 0: return [4 /*yield*/, accumulatorValuePromise];
                                case 1:
                                    accumulatorValue = _g.sent();
                                    // Catch and Skip Error transaction
                                    if (this.isErrorTransaction(currentItem)) {
                                        return [2 /*return*/, accumulatorValue];
                                    }
                                    return [4 /*yield*/, this.getTokenOperationState(currentItem)];
                                case 2:
                                    state = _g.sent();
                                    if (state.isTrustedProvider) {
                                        try {
                                            // Uniswap transaction
                                            for (_a = tslib_1.__values(state.operations), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                operation = _b.value;
                                                if (operation.amount.isGreaterThan(0)) {
                                                    // Income event (Open trade or Rebuy open position)
                                                    this.calculateIncomeEvent(accumulatorValue, operation, state, currentItem.balanceBeforeTransaction);
                                                }
                                                else {
                                                    this.calculateOutgoingEvent(accumulatorValue, operation, state, currentItem.balanceBeforeTransaction);
                                                }
                                            }
                                        }
                                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                        finally {
                                            try {
                                                if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                            }
                                            finally { if (e_1) throw e_1.error; }
                                        }
                                    }
                                    else {
                                        try {
                                            // Other transaction
                                            for (_c = tslib_1.__values(state.operations), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                operation = _d.value;
                                                if (operation.amount.isLessThanOrEqualTo(0)) {
                                                    // Income event (Open trade or Rebuy open position)
                                                    this.calculateOutgoingEvent(accumulatorValue, operation, state, currentItem.balanceBeforeTransaction);
                                                }
                                            }
                                        }
                                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                        finally {
                                            try {
                                                if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                            }
                                            finally { if (e_2) throw e_2.error; }
                                        }
                                    }
                                    return [2 /*return*/, accumulatorValue];
                            }
                        });
                    }); }, Promise.resolve(initValue))];
            });
        });
    };
    TradesBuilderV2Prebuild.prototype.calculateOutgoingEvent = function (accumulatorValue, operation, state, balanceBeforeTransaction) {
        var _a;
        var openTradeIndex = (((_a = accumulatorValue[operation.address]) === null || _a === void 0 ? void 0 : _a.trades) || []).findIndex(function (x) { return x.tradeStatus === tradesBuilderV2_interface_1.TradeStatus.OPEN; });
        if (openTradeIndex >= 0) {
            this.calculateOperationWithOpenTrade(operation, state, accumulatorValue[operation.address], openTradeIndex, balanceBeforeTransaction);
        }
    };
    TradesBuilderV2Prebuild.prototype.calculateIncomeEvent = function (accumulatorValue, operation, state, balanceBeforeTransaction) {
        if (accumulatorValue[operation.address]) {
            var openTradeIndex = accumulatorValue[operation.address].trades.findIndex(function (x) { return x.tradeStatus === tradesBuilderV2_interface_1.TradeStatus.OPEN; });
            if (openTradeIndex >= 0) {
                this.calculateOperationWithOpenTrade(operation, state, accumulatorValue[operation.address], openTradeIndex, balanceBeforeTransaction);
            }
            else {
                accumulatorValue[operation.address].trades.push(this.openNewTrade(state, operation, balanceBeforeTransaction));
            }
        }
        else {
            accumulatorValue[operation.address] = {
                tokenAddress: operation.address,
                trades: [this.openNewTrade(state, operation, balanceBeforeTransaction)],
            };
        }
    };
    TradesBuilderV2Prebuild.prototype.calculateOperationWithOpenTrade = function (operation, state, data, openTradeIndex, balanceBeforeTransaction) {
        var tradeEvent = this.createNewTradeEvent(state, operation, balanceBeforeTransaction, data.trades[openTradeIndex]);
        data.trades[openTradeIndex].balance = data.trades[openTradeIndex].balance.plus(operation.amount);
        data.trades[openTradeIndex].tradeEvents.push(tradeEvent);
        if (tradeEvent.tradeType === tradesBuilderV2_interface_1.TradeType.SELL) {
            this.createIterateSellEvents(tradeEvent, data, openTradeIndex);
        }
        if (data.trades[openTradeIndex].balance.isLessThanOrEqualTo(0)) {
            data.trades[openTradeIndex].tradeStatus = tradesBuilderV2_interface_1.TradeStatus.CLOSE;
            data.trades[openTradeIndex].closeTimeStamp = state.timeStamp;
        }
    };
    TradesBuilderV2Prebuild.prototype.createIterateSellEvents = function (tradeEvent, data, openTradeIndex) {
        var e_3, _a;
        var sellOperationAmount = tradeEvent.amount.negated();
        try {
            // write sell event from buy
            for (var _b = tslib_1.__values(data.trades[openTradeIndex].tradeEvents.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), index = _d[0], value = _d[1];
                if (value.tradeType === tradesBuilderV2_interface_1.TradeType.BUY && value.balance.isGreaterThan(0)) {
                    var amountResult = value.balance.minus(sellOperationAmount);
                    if (amountResult.isGreaterThanOrEqualTo(0)) {
                        value.balance = value.balance.minus(sellOperationAmount);
                        var operation = {
                            sellTransactionHash: tradeEvent.transactionHash,
                            amount: new bignumber_js_1.default(sellOperationAmount.toString()),
                            profit: {
                                usd: new bignumber_js_1.default(0),
                                eth: new bignumber_js_1.default(0),
                            },
                            profitLoss: {
                                usd: new bignumber_js_1.default(0),
                                eth: new bignumber_js_1.default(0),
                            },
                            tokenInfo: tradeEvent.tokenInfo,
                        };
                        value.sellOperations.push(operation);
                        tradeEvent.sellOperations.push(operation);
                        sellOperationAmount = new bignumber_js_1.default(0);
                        break;
                    }
                    else {
                        if (value.balance.isGreaterThan(0)) {
                            var operation = {
                                sellTransactionHash: tradeEvent.transactionHash,
                                amount: new bignumber_js_1.default(value.balance.toString()),
                                profit: {
                                    usd: new bignumber_js_1.default(0),
                                    eth: new bignumber_js_1.default(0),
                                },
                                profitLoss: {
                                    usd: new bignumber_js_1.default(0),
                                    eth: new bignumber_js_1.default(0),
                                },
                                tokenInfo: tradeEvent.tokenInfo,
                            };
                            value.sellOperations.push(operation);
                            tradeEvent.sellOperations.push(operation);
                            sellOperationAmount = sellOperationAmount.minus(value.balance);
                            value.balance = new bignumber_js_1.default(0);
                        }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    TradesBuilderV2Prebuild.prototype.openNewTrade = function (state, operation, balanceBeforeTransaction) {
        return {
            balance: new bignumber_js_1.default(operation.amount),
            startDep: { amountInETH: new bignumber_js_1.default(0), amountInUSD: new bignumber_js_1.default(0) },
            tokenAddress: operation.address,
            spendingUSD: new bignumber_js_1.default(0),
            spendingETH: new bignumber_js_1.default(0),
            incomeUSD: new bignumber_js_1.default(0),
            incomeETH: new bignumber_js_1.default(0),
            tradeStatus: tradesBuilderV2_interface_1.TradeStatus.OPEN,
            tradeEvents: [this.createNewTradeEvent(state, operation, balanceBeforeTransaction)],
            openTimeStamp: state.timeStamp,
            profitLossFromUSD: new bignumber_js_1.default(0),
            profitLossFromETH: new bignumber_js_1.default(0),
            profitFromUSD: new bignumber_js_1.default(0),
            profitFromETH: new bignumber_js_1.default(0),
            points: new bignumber_js_1.default(0),
        };
    };
    TradesBuilderV2Prebuild.prototype.createNewTradeEvent = function (state, operation, balanceBeforeTransaction, trade) {
        var startDep = { amountInETH: new bignumber_js_1.default(0), amountInUSD: new bignumber_js_1.default(0) };
        var tokenInfo = this.createTokenInfo(operation);
        var tradeType = this.tradeTypeSwitcher(operation.amount);
        var price = {
            raw: {
                usd: new bignumber_js_1.default(0),
                eth: new bignumber_js_1.default(0),
            },
            withFee: {
                usd: new bignumber_js_1.default(0),
                eth: new bignumber_js_1.default(0),
            },
        };
        return {
            tradeType: tradeType,
            amount: new bignumber_js_1.default(operation.amount),
            balance: tradeType === tradesBuilderV2_interface_1.TradeType.BUY ? new bignumber_js_1.default(operation.amount) : new bignumber_js_1.default(0),
            averageStartDep: {
                usd: new bignumber_js_1.default(0),
                eth: new bignumber_js_1.default(0),
            },
            tokenInfo: tokenInfo,
            sellOperations: [],
            isVirtualTransaction: state.isVirtualTransaction,
            transactionHash: state.transactionHash,
            timeStamp: state.timeStamp,
            costUSD: new bignumber_js_1.default(0),
            costETH: new bignumber_js_1.default(0),
            transactionFeeETH: new bignumber_js_1.default(0),
            transactionFeeUSD: new bignumber_js_1.default(0),
            price: price,
            startDep: startDep,
            operationInfo: state.operationInfo,
            balances: state.balances,
            balancesBeforeTransaction: state.balancesBeforeTransaction,
            blockNumber: state.blockNumber,
        };
    };
    TradesBuilderV2Prebuild.prototype.createTokenInfo = function (operation) {
        return {
            symbol: operation.symbol,
            name: operation.name,
            address: operation.address,
            decimals: operation.decimals,
        };
    };
    TradesBuilderV2Prebuild.prototype.tradeTypeSwitcher = function (amount) {
        if (amount.isGreaterThan(0)) {
            return tradesBuilderV2_interface_1.TradeType.BUY;
        }
        else {
            return tradesBuilderV2_interface_1.TradeType.SELL;
        }
    };
    TradesBuilderV2Prebuild.prototype.isErrorTransaction = function (data) {
        if (tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read((data.normalTransactions || []))), tslib_1.__read((data.internalTransactions || []))), tslib_1.__read((data.erc20Transactions || []))), tslib_1.__read((data.erc721Transactions || []))).some(function (x) { return (x === null || x === void 0 ? void 0 : x.isError) === '1'; })) {
            return true;
        }
        return false;
    };
    TradesBuilderV2Prebuild.prototype.getTokenOperationState = function (currentData) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var state, balancesDifferencesData, normalTransaction;
            return tslib_1.__generator(this, function (_c) {
                try {
                    state = void 0;
                    balancesDifferencesData = this.balanceDifferences(currentData.balance, currentData.balanceBeforeTransaction, currentData.feeInETH);
                    if (currentData.normalTransactions &&
                        ((_b = (_a = currentData.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig_1.default.uniswap.uniswapRouterAddress) {
                        normalTransaction = currentData.normalTransactions[0];
                        // Catch Only correct Uniswap Swaps (for trades) Exclude add or remove from liquidity
                        // Catch add or remove from liquidity Uniswap
                        // !!! Prebuild trades in some cases can incorrect build pre trades, because
                        // we can't detect remove liqudity and add to liquidity without request for uni transaction info
                        state = {
                            isVirtualTransaction: currentData.isVirtualTransaction,
                            operations: balancesDifferencesData.differences,
                            operationInfo: balancesDifferencesData.operationInfo,
                            isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.first,
                            timeStamp: normalTransaction.timeStamp,
                            transactionHash: normalTransaction.hash,
                            balances: currentData.balance,
                            balancesBeforeTransaction: currentData.balanceBeforeTransaction,
                            blockNumber: currentData.blockNumber,
                        };
                    }
                    else {
                        state = {
                            isVirtualTransaction: currentData.isVirtualTransaction,
                            operations: balancesDifferencesData.differences,
                            operationInfo: balancesDifferencesData.operationInfo,
                            isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.third,
                            timeStamp: currentData.timeStamp,
                            transactionHash: currentData.hash,
                            balances: currentData.balance,
                            balancesBeforeTransaction: currentData.balanceBeforeTransaction,
                            blockNumber: currentData.blockNumber,
                        };
                    }
                    return [2 /*return*/, state];
                }
                catch (e) {
                    throw e;
                }
                return [2 /*return*/];
            });
        });
    };
    TradesBuilderV2Prebuild.prototype.balanceDifferences = function (currentBalance, beforeBalance, parsedFeeInETH) {
        var e_4, _a;
        var _b, _c, _d, _e;
        var tokensAddress = lodash_1.default.uniq(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(Object.keys(currentBalance))), tslib_1.__read(Object.keys(beforeBalance))));
        var diffs = [];
        var operationInfo = {
            sent: [],
            received: [],
        };
        try {
            for (var tokensAddress_1 = tslib_1.__values(tokensAddress), tokensAddress_1_1 = tokensAddress_1.next(); !tokensAddress_1_1.done; tokensAddress_1_1 = tokensAddress_1.next()) {
                var key = tokensAddress_1_1.value;
                if (((_b = currentBalance[key]) === null || _b === void 0 ? void 0 : _b.amount) &&
                    !(currentBalance[key].amount.toString() === ((_d = (_c = beforeBalance[key]) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.toString()))) {
                    var item = {
                        symbol: currentBalance[key].symbol,
                        name: currentBalance[key].name,
                        address: currentBalance[key].address.toLowerCase(),
                        decimals: currentBalance[key].decimals,
                        amount: ((_e = beforeBalance[key]) === null || _e === void 0 ? void 0 : _e.amount)
                            ? currentBalance[key].amount.minus(beforeBalance[key].amount)
                            : new bignumber_js_1.default(currentBalance[key].amount.toString()),
                    };
                    // Exclude Fee From Balance Differences
                    if (item.address === tokenInfo_1.ethDefaultInfo.address) {
                        if (item.amount.isLessThan(0)) {
                            item.amount = item.amount.plus(tokens_helper_1.parsedBalanceToRaw(parsedFeeInETH, +tokenInfo_1.ethDefaultInfo.decimals));
                        }
                        if (item.amount.isGreaterThan(0)) {
                            item.amount = item.amount.minus(tokens_helper_1.parsedBalanceToRaw(parsedFeeInETH, +tokenInfo_1.ethDefaultInfo.decimals));
                        }
                    }
                    // set operationInfo
                    if (item.amount.isLessThan(0)) {
                        operationInfo.sent.push(item);
                    }
                    if (item.amount.isGreaterThan(0)) {
                        operationInfo.received.push(item);
                    }
                    diffs.push(item);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (tokensAddress_1_1 && !tokensAddress_1_1.done && (_a = tokensAddress_1.return)) _a.call(tokensAddress_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return {
            differences: diffs.filter(function (x) { return !stableCoins_1.stableCoinList.some(function (y) { return y.address === x.address.toLowerCase(); }); }),
            operationInfo: operationInfo,
        };
    };
    return TradesBuilderV2Prebuild;
}());
exports.TradesBuilderV2Prebuild = TradesBuilderV2Prebuild;
//# sourceMappingURL=tradesBuilderV2-prebuild.js.map