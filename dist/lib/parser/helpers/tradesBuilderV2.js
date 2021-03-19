"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesBuilderV2 = void 0;
var tslib_1 = require("tslib");
var bignumber_js_1 = require("bignumber.js");
var moment_1 = require("moment");
var defaultConfig_1 = require("../../constants/defaultConfig");
var lodash_1 = require("lodash");
var tradesBuilderV2_interface_1 = require("../../interfaces/parser/tradesBuilderV2.interface");
var tokens_helper_1 = require("../../helpers/tokens.helper");
var calculateTransaction_1 = require("./calculateTransaction");
var stableCoins_1 = require("../../constants/stableCoins");
var parseTransaction_1 = require("./parseTransaction");
var tradesBuilderV2_configs_1 = require("../configs/tradesBuilderV2.configs");
var tokenInfo_1 = require("../../constants/tokenInfo");
var TradesBuilderV2 = /** @class */ (function () {
    function TradesBuilderV2(services, config) {
        this.services = services;
        this.config = config;
        this.calculateTransaction = new calculateTransaction_1.CalculateTransaction();
        this.parseTransactionWallet = new parseTransaction_1.ParseTransaction(this.services.uniswapService);
        this.behaviourConfig = tradesBuilderV2_configs_1.generateBehaviourConfig(config);
    }
    TradesBuilderV2.prototype.buildTrades = function (data) {
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
                        return [4 /*yield*/, this.generateVirtualTrades(openTrades, data[data.length - 1])];
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
    TradesBuilderV2.prototype.generateVirtualTrades = function (openTrades, lastGroupedTransaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentBlockNumber, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.services.web3Service.getCurrentBlockNumberLimiter()];
                    case 1:
                        currentBlockNumber = _a.sent();
                        return [4 /*yield*/, this.parseTransactionWallet.parseTransactionBalancePrice(this.generateVirtualTransactions(openTrades, lastGroupedTransaction, currentBlockNumber), true)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TradesBuilderV2.prototype.generateVirtualTransactions = function (openTrades, lastGroupedTransaction, currentBlockNumber) {
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
                blockNumber: currentBlockNumber - 10,
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
    TradesBuilderV2.prototype.generateBalanceDiffForVirtualTradePnl = function (trade, balance) {
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
    TradesBuilderV2.prototype.behaviourIterator = function (data, initValue) {
        if (initValue === void 0) { initValue = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                // console.log('behaviourIterator', data.length);
                return [2 /*return*/, data.reduce(function (accumulatorValuePromise, currentItem, index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var accumulatorValue, state, _a, _b, operation, _c, _d, operation;
                        var e_2, _e, e_3, _f;
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
                                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                        finally {
                                            try {
                                                if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                            }
                                            finally { if (e_2) throw e_2.error; }
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
                                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                        finally {
                                            try {
                                                if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                            }
                                            finally { if (e_3) throw e_3.error; }
                                        }
                                    }
                                    return [2 /*return*/, accumulatorValue];
                            }
                        });
                    }); }, Promise.resolve(initValue))];
            });
        });
    };
    TradesBuilderV2.prototype.calculateOutgoingEvent = function (accumulatorValue, operation, state, balanceBeforeTransaction) {
        var _a;
        var openTradeIndex = (((_a = accumulatorValue[operation.address]) === null || _a === void 0 ? void 0 : _a.trades) || []).findIndex(function (x) { return x.tradeStatus === tradesBuilderV2_interface_1.TradeStatus.OPEN; });
        if (openTradeIndex >= 0) {
            this.calculateOperationWithOpenTrade(operation, state, accumulatorValue[operation.address], openTradeIndex, balanceBeforeTransaction);
        }
    };
    TradesBuilderV2.prototype.calculateIncomeEvent = function (accumulatorValue, operation, state, balanceBeforeTransaction) {
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
    TradesBuilderV2.prototype.calculateOperationWithOpenTrade = function (operation, state, data, openTradeIndex, balanceBeforeTransaction) {
        var tradeEvent = this.createNewTradeEvent(state, operation, balanceBeforeTransaction, data.trades[openTradeIndex]);
        data.trades[openTradeIndex].balance = data.trades[openTradeIndex].balance.plus(operation.amount);
        data.trades[openTradeIndex].tradeEvents.push(tradeEvent);
        if (tradeEvent.tradeType === tradesBuilderV2_interface_1.TradeType.SELL) {
            data.trades[openTradeIndex].incomeETH = data.trades[openTradeIndex].incomeETH.plus(state.amount.raw.ETH);
            data.trades[openTradeIndex].incomeUSD = data.trades[openTradeIndex].incomeUSD.plus(state.amount.raw.USD);
            // Write fee from sell to spending
            data.trades[openTradeIndex].spendingETH = data.trades[openTradeIndex].spendingETH.plus(state.transactionFeeETH);
            data.trades[openTradeIndex].spendingUSD = data.trades[openTradeIndex].spendingUSD.plus(state.transactionFeeUSD);
            this.createIterateSellEvents(tradeEvent, data, openTradeIndex);
        }
        else {
            data.trades[openTradeIndex].spendingETH = data.trades[openTradeIndex].spendingETH.plus(state.amount.withFee.ETH);
            data.trades[openTradeIndex].spendingUSD = data.trades[openTradeIndex].spendingUSD.plus(state.amount.withFee.USD);
        }
        var profit = this.calculateTransaction.calculateProfitLossOnAnyPosition(data.trades[openTradeIndex]);
        if (data.trades[openTradeIndex].balance.isLessThanOrEqualTo(0)) {
            data.trades[openTradeIndex].tradeStatus = tradesBuilderV2_interface_1.TradeStatus.CLOSE;
            data.trades[openTradeIndex].closeTimeStamp = state.timeStamp;
            data.trades[openTradeIndex].profitLossFromUSD = profit.profitLoss.fromUSD;
            data.trades[openTradeIndex].profitLossFromETH = profit.profitLoss.fromETH;
            data.trades[openTradeIndex].profitFromUSD = profit.profit.fromUSD;
            data.trades[openTradeIndex].profitFromETH = profit.profit.fromETH;
            data.trades[openTradeIndex].points = this.calculateTransaction.points(data.trades[openTradeIndex].profitLossFromETH, data.trades[openTradeIndex].tokenAddress);
        }
        else {
            data.trades[openTradeIndex].profitLossFromUSD = profit.profitLoss.fromUSD;
            data.trades[openTradeIndex].profitLossFromETH = profit.profitLoss.fromETH;
            data.trades[openTradeIndex].profitFromUSD = profit.profit.fromUSD;
            data.trades[openTradeIndex].profitFromETH = profit.profit.fromETH;
            data.trades[openTradeIndex].points = this.calculateTransaction.points(data.trades[openTradeIndex].profitLossFromETH, data.trades[openTradeIndex].tokenAddress);
        }
    };
    TradesBuilderV2.prototype.createIterateSellEvents = function (tradeEvent, data, openTradeIndex) {
        var e_4, _a;
        var sellOperationAmount = tradeEvent.amount.negated();
        try {
            // write sell event from buy
            for (var _b = tslib_1.__values(data.trades[openTradeIndex].tradeEvents.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), index = _d[0], value = _d[1];
                if (value.tradeType === tradesBuilderV2_interface_1.TradeType.BUY && value.balance.isGreaterThan(0)) {
                    var amountResult = value.balance.minus(sellOperationAmount);
                    if (amountResult.isGreaterThanOrEqualTo(0)) {
                        var profitUSD = tradeEvent.price.withFee.usd
                            .minus(value.price.withFee.usd)
                            .multipliedBy(tokens_helper_1.buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));
                        var profitETH = tradeEvent.price.withFee.eth
                            .minus(value.price.withFee.eth)
                            .multipliedBy(tokens_helper_1.buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));
                        var profitLossUSD = profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100);
                        var profitLossETH = profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100);
                        value.balance = value.balance.minus(sellOperationAmount);
                        var operation = {
                            sellTransactionHash: tradeEvent.transactionHash,
                            amount: new bignumber_js_1.default(sellOperationAmount.toString()),
                            profit: {
                                usd: profitUSD,
                                eth: profitETH,
                            },
                            profitLoss: {
                                usd: profitLossUSD.isFinite() ? profitLossUSD : new bignumber_js_1.default(0),
                                eth: profitLossETH.isFinite() ? profitLossETH : new bignumber_js_1.default(0),
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
                            var profitUSD = tradeEvent.price.withFee.usd
                                .minus(value.price.withFee.usd)
                                .multipliedBy(tokens_helper_1.buildBalanceTransformer(value.balance, +tradeEvent.tokenInfo.decimals));
                            var profitETH = tradeEvent.price.withFee.eth
                                .minus(value.price.withFee.eth)
                                .multipliedBy(tokens_helper_1.buildBalanceTransformer(value.balance, +tradeEvent.tokenInfo.decimals));
                            var profitLossUSD = profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100);
                            var profitLossETH = profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100);
                            var operation = {
                                sellTransactionHash: tradeEvent.transactionHash,
                                amount: new bignumber_js_1.default(value.balance.toString()),
                                profit: {
                                    usd: profitUSD,
                                    eth: profitETH,
                                },
                                profitLoss: {
                                    usd: profitLossUSD.isFinite() ? profitLossUSD : new bignumber_js_1.default(0),
                                    eth: profitLossETH.isFinite() ? profitLossETH : new bignumber_js_1.default(0),
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
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    TradesBuilderV2.prototype.openNewTrade = function (state, operation, balanceBeforeTransaction) {
        return {
            balance: new bignumber_js_1.default(operation.amount),
            startDep: this.getBalanceCost(balanceBeforeTransaction),
            tokenAddress: operation.address,
            spendingUSD: new bignumber_js_1.default(state.amount.withFee.USD),
            spendingETH: new bignumber_js_1.default(state.amount.withFee.ETH),
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
    TradesBuilderV2.prototype.getBalanceCost = function (balance) {
        return Object.values(balance).reduce(function (accum, currentValue) {
            accum.amountInETH = accum.amountInETH.plus(currentValue.amountInETH);
            accum.amountInUSD = accum.amountInUSD.plus(currentValue.amountInUSD);
            return accum;
        }, { amountInETH: new bignumber_js_1.default(0), amountInUSD: new bignumber_js_1.default(0) });
    };
    TradesBuilderV2.prototype.createNewTradeEvent = function (state, operation, balanceBeforeTransaction, trade) {
        var startDep = this.getBalanceCost(balanceBeforeTransaction);
        var tokenInfo = this.createTokenInfo(operation);
        var tradeType = this.tradeTypeSwitcher(operation.amount);
        var price = this.calculateTokenEventPrice({
            amount: operation.amount,
            tokenInfo: tokenInfo,
            state: state,
            tradeType: tradeType,
        });
        return {
            tradeType: tradeType,
            amount: new bignumber_js_1.default(operation.amount),
            balance: tradeType === tradesBuilderV2_interface_1.TradeType.BUY ? new bignumber_js_1.default(operation.amount) : new bignumber_js_1.default(0),
            averageStartDep: this.calculateAverageStartDep(trade, startDep, price, tradeType),
            tokenInfo: tokenInfo,
            sellOperations: [],
            isVirtualTransaction: state.isVirtualTransaction,
            transactionHash: state.transactionHash,
            timeStamp: state.timeStamp,
            costUSD: new bignumber_js_1.default(state.amount.raw.USD),
            costETH: new bignumber_js_1.default(state.amount.raw.ETH),
            transactionFeeETH: state.transactionFeeETH,
            transactionFeeUSD: state.transactionFeeUSD,
            price: price,
            startDep: startDep,
            operationInfo: state.operationInfo,
        };
    };
    TradesBuilderV2.prototype.calculateAverageStartDep = function (trade, startDep, price, tradeType) {
        if (tradeType === tradesBuilderV2_interface_1.TradeType.SELL) {
            return {
                usd: new bignumber_js_1.default(0),
                eth: new bignumber_js_1.default(0),
            };
        }
        if (!trade) {
            return {
                usd: startDep.amountInUSD,
                eth: startDep.amountInETH,
            };
        }
        return {
            usd: this.averageStartDepUSD(trade, startDep, price),
            eth: this.averageStartDepETH(trade, startDep, price),
        };
    };
    TradesBuilderV2.prototype.averageStartDepETH = function (trade, startDep, price) {
        var buyTotalCostETH = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === tradesBuilderV2_interface_1.TradeType.BUY; })
            .reduce(function (accum, value) {
            return accum.plus(tokens_helper_1.buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth));
        }, new bignumber_js_1.default(0));
        var sellTotalCostETH = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === tradesBuilderV2_interface_1.TradeType.SELL; })
            .reduce(function (accum, value) {
            return accum.plus(tokens_helper_1.buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth));
        }, new bignumber_js_1.default(0));
        var accumulatedTokens = trade.balance;
        var settlementBalance = trade.startDep.amountInETH
            .minus(buyTotalCostETH)
            .plus(sellTotalCostETH)
            .plus(tokens_helper_1.buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(price.withFee.eth));
        return startDep.amountInETH.minus(settlementBalance).plus(trade.startDep.amountInETH);
    };
    TradesBuilderV2.prototype.averageStartDepUSD = function (trade, startDep, price) {
        var buyTotalCostUSD = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === tradesBuilderV2_interface_1.TradeType.BUY; })
            .reduce(function (accum, value) {
            return accum.plus(tokens_helper_1.buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd));
        }, new bignumber_js_1.default(0));
        var sellTotalCostUSD = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === tradesBuilderV2_interface_1.TradeType.SELL; })
            .reduce(function (accum, value) {
            return accum.plus(tokens_helper_1.buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd));
        }, new bignumber_js_1.default(0));
        var accumulatedTokens = trade.balance;
        var settlementBalance = trade.startDep.amountInUSD
            .minus(buyTotalCostUSD)
            .plus(sellTotalCostUSD)
            .plus(tokens_helper_1.buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(price.withFee.usd));
        return startDep.amountInUSD.minus(settlementBalance).plus(trade.startDep.amountInUSD);
    };
    TradesBuilderV2.prototype.calculateTokenEventPrice = function (_a) {
        var amount = _a.amount, tokenInfo = _a.tokenInfo, state = _a.state, tradeType = _a.tradeType;
        var parsedAmount = amount.isGreaterThanOrEqualTo(0)
            ? tokens_helper_1.buildBalanceTransformer(amount, +tokenInfo.decimals)
            : tokens_helper_1.buildBalanceTransformer(amount.negated(), +tokenInfo.decimals);
        return {
            raw: {
                usd: state.amount.raw.USD.dividedBy(parsedAmount),
                eth: state.amount.raw.ETH.dividedBy(parsedAmount),
            },
            withFee: {
                usd: tradeType === tradesBuilderV2_interface_1.TradeType.BUY
                    ? state.amount.withFee.USD.dividedBy(parsedAmount)
                    : state.amount.raw.USD.minus(state.transactionFeeUSD).dividedBy(parsedAmount),
                eth: tradeType === tradesBuilderV2_interface_1.TradeType.BUY
                    ? state.amount.withFee.ETH.dividedBy(parsedAmount)
                    : state.amount.raw.ETH.minus(state.transactionFeeETH).dividedBy(parsedAmount),
            },
        };
    };
    TradesBuilderV2.prototype.createTokenInfo = function (operation) {
        return {
            symbol: operation.symbol,
            name: operation.name,
            address: operation.address,
            decimals: operation.decimals,
        };
    };
    TradesBuilderV2.prototype.tradeTypeSwitcher = function (amount) {
        if (amount.isGreaterThan(0)) {
            return tradesBuilderV2_interface_1.TradeType.BUY;
        }
        else {
            return tradesBuilderV2_interface_1.TradeType.SELL;
        }
    };
    TradesBuilderV2.prototype.isErrorTransaction = function (data) {
        if (tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read((data.normalTransactions || []))), tslib_1.__read((data.internalTransactions || []))), tslib_1.__read((data.erc20Transactions || []))), tslib_1.__read((data.erc721Transactions || []))).some(function (x) { return (x === null || x === void 0 ? void 0 : x.isError) === '1'; })) {
            return true;
        }
        return false;
    };
    TradesBuilderV2.prototype.getTokenOperationState = function (currentData) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var state, balancesDifferencesData, normalTransaction, uniswapTransactionData, operationPriceUniRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, e_5;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        state = void 0;
                        balancesDifferencesData = this.balanceDifferences(currentData.balance, currentData.balanceBeforeTransaction, currentData.feeInETH);
                        if (!(currentData.normalTransactions &&
                            ((_b = (_a = currentData.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig_1.default.uniswap.uniswapRouterAddress)) return [3 /*break*/, 2];
                        normalTransaction = currentData.normalTransactions[0];
                        return [4 /*yield*/, this.services.uniswapService.getUniswapTransactionByIdLimiter(normalTransaction.hash, +normalTransaction.blockNumber)];
                    case 1:
                        uniswapTransactionData = _c.sent();
                        // Catch Only correct Uniswap Swaps (for trades) Exclude add or remove from liquidity
                        if (uniswapTransactionData) {
                            operationPriceUniRaw = this.operationPriceFromUniswap(uniswapTransactionData);
                            transactionFeeETH = currentData.feeInETH;
                            transactionFeeUSD = currentData.feeInETH.multipliedBy(uniswapTransactionData.ethPrice);
                            operationPriceIncludeFee = this.operationPriceWithFee(operationPriceUniRaw, transactionFeeETH, transactionFeeUSD);
                            state = {
                                isVirtualTransaction: currentData.isVirtualTransaction,
                                operations: balancesDifferencesData.differences,
                                operationInfo: balancesDifferencesData.operationInfo,
                                amount: {
                                    raw: {
                                        ETH: operationPriceUniRaw.amountInETH,
                                        USD: operationPriceUniRaw.amountInUSD,
                                    },
                                    withFee: {
                                        ETH: operationPriceIncludeFee.amountInETH,
                                        USD: operationPriceIncludeFee.amountInUSD,
                                    },
                                },
                                isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.first,
                                timeStamp: normalTransaction.timeStamp,
                                transactionHash: normalTransaction.hash,
                                transactionFeeETH: transactionFeeETH,
                                transactionFeeUSD: transactionFeeUSD,
                            };
                        }
                        else {
                            operationPriceOtherRaw = this.operationPriceFromOtherSource(balancesDifferencesData.differences, currentData.balance);
                            transactionFeeETH = currentData.feeInETH;
                            transactionFeeUSD = currentData.feeInETH.multipliedBy(operationPriceOtherRaw.usdPer1ETH);
                            operationPriceIncludeFee = this.operationPriceWithFee(operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD);
                            state = {
                                isVirtualTransaction: currentData.isVirtualTransaction,
                                operations: balancesDifferencesData.differences,
                                operationInfo: balancesDifferencesData.operationInfo,
                                amount: {
                                    raw: {
                                        ETH: operationPriceOtherRaw.amountInETH,
                                        USD: operationPriceOtherRaw.amountInUSD,
                                    },
                                    withFee: {
                                        ETH: operationPriceIncludeFee.amountInETH,
                                        USD: operationPriceIncludeFee.amountInUSD,
                                    },
                                },
                                isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.second,
                                timeStamp: normalTransaction.timeStamp,
                                transactionHash: normalTransaction.hash,
                                transactionFeeETH: transactionFeeETH,
                                transactionFeeUSD: transactionFeeUSD,
                            };
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        operationPriceOtherRaw = this.operationPriceFromOtherSource(balancesDifferencesData.differences, currentData.balance);
                        transactionFeeETH = currentData.feeInETH;
                        transactionFeeUSD = currentData.feeInETH.multipliedBy(operationPriceOtherRaw.usdPer1ETH);
                        operationPriceIncludeFee = this.operationPriceWithFee(operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD);
                        state = {
                            isVirtualTransaction: currentData.isVirtualTransaction,
                            operations: balancesDifferencesData.differences,
                            operationInfo: balancesDifferencesData.operationInfo,
                            amount: {
                                raw: {
                                    ETH: operationPriceOtherRaw.amountInETH,
                                    USD: operationPriceOtherRaw.amountInUSD,
                                },
                                withFee: {
                                    ETH: operationPriceIncludeFee.amountInETH,
                                    USD: operationPriceIncludeFee.amountInUSD,
                                },
                            },
                            isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.third,
                            timeStamp: currentData.timeStamp,
                            transactionHash: currentData.hash,
                            transactionFeeETH: transactionFeeETH,
                            transactionFeeUSD: transactionFeeUSD,
                        };
                        _c.label = 3;
                    case 3: return [2 /*return*/, state];
                    case 4:
                        e_5 = _c.sent();
                        throw e_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TradesBuilderV2.prototype.operationPriceWithFee = function (operationPrice, feeETH, feeUSD) {
        return tslib_1.__assign(tslib_1.__assign({}, operationPrice), { amountInUSD: operationPrice.amountInUSD.plus(feeUSD), amountInETH: operationPrice.amountInETH.plus(feeETH) });
    };
    TradesBuilderV2.prototype.balanceDifferences = function (currentBalance, beforeBalance, parsedFeeInETH) {
        var e_6, _a;
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (tokensAddress_1_1 && !tokensAddress_1_1.done && (_a = tokensAddress_1.return)) _a.call(tokensAddress_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return {
            differences: diffs.filter(function (x) { return !stableCoins_1.stableCoinList.some(function (y) { return y.address === x.address.toLowerCase(); }); }),
            operationInfo: operationInfo,
        };
    };
    TradesBuilderV2.prototype.operationPriceFromOtherSource = function (operations, balanceData) {
        // Outgoing operations
        var outgoing = operations.reduce(function (accum, currentValue) {
            if (!balanceData[currentValue.address]) {
                throw new Error('Wrong operationPriceFromOtherSource');
            }
            // Catch only outgoing operations
            if (currentValue.amount.isLessThan(0)) {
                accum.amountInETH = accum.amountInETH.plus(tokens_helper_1.buildBalanceTransformer(currentValue.amount.negated(), +currentValue.decimals).multipliedBy(balanceData[currentValue.address].ethPer1Token));
                accum.amountInUSD = accum.amountInUSD.plus(tokens_helper_1.buildBalanceTransformer(currentValue.amount.negated(), +currentValue.decimals).multipliedBy(balanceData[currentValue.address].usdPer1Token));
                accum.usdPer1ETH = balanceData[currentValue.address].usdPer1ETH;
            }
            return accum;
        }, { amountInETH: new bignumber_js_1.default(0), amountInUSD: new bignumber_js_1.default(0), usdPer1ETH: new bignumber_js_1.default(0) });
        // Income operations
        var income = operations.reduce(function (accum, currentValue) {
            if (!balanceData[currentValue.address]) {
                throw new Error('Wrong operationPriceFromOtherSource');
            }
            // Catch only outgoing operations
            if (currentValue.amount.isGreaterThan(0)) {
                accum.amountInETH = accum.amountInETH.plus(tokens_helper_1.buildBalanceTransformer(currentValue.amount, +currentValue.decimals).multipliedBy(balanceData[currentValue.address].ethPer1Token));
                accum.amountInUSD = accum.amountInUSD.plus(tokens_helper_1.buildBalanceTransformer(currentValue.amount, +currentValue.decimals).multipliedBy(balanceData[currentValue.address].usdPer1Token));
                accum.usdPer1ETH = balanceData[currentValue.address].usdPer1ETH;
            }
            return accum;
        }, { amountInETH: new bignumber_js_1.default(0), amountInUSD: new bignumber_js_1.default(0), usdPer1ETH: new bignumber_js_1.default(0) });
        return outgoing.amountInETH.isGreaterThan(0) ? outgoing : income;
    };
    TradesBuilderV2.prototype.operationPriceFromUniswap = function (data) {
        return {
            amountInETH: new bignumber_js_1.default(data.amountETH),
            amountInUSD: new bignumber_js_1.default(data.amountUSD),
            usdPer1ETH: new bignumber_js_1.default(data.ethPrice),
        };
    };
    return TradesBuilderV2;
}());
exports.TradesBuilderV2 = TradesBuilderV2;
//# sourceMappingURL=tradesBuilderV2.js.map