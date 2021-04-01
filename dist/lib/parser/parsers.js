"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserBase = void 0;
var tslib_1 = require("tslib");
var getTransaction_1 = require("./helpers/getTransaction");
var parseTransaction_1 = require("./helpers/parseTransaction");
var filterTransaction_1 = require("./helpers/filterTransaction");
var transformTransaction_1 = require("./helpers/transformTransaction");
var tradesBuilderV2_1 = require("./helpers/tradesBuilderV2");
var calculateBalance_1 = require("./helpers/calculateBalance");
var calculateTransaction_1 = require("./helpers/calculateTransaction");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var tradesBuilderV2_prebuild_1 = require("./helpers/tradesBuilderV2-prebuild");
var bignumber_js_1 = require("bignumber.js");
var ParserBase = /** @class */ (function () {
    function ParserBase(services, config) {
        this.services = services;
        this.config = config;
        this.rawTransactions = [];
        this.parserProgress = new rxjs_1.BehaviorSubject(0);
        this.uniswapRequestCount = this.services.uniswapService.requestCounter.asObservable().pipe(operators_1.auditTime(1000));
        this.estimatedUniswapRequests = new rxjs_1.BehaviorSubject(0);
        this.getTransaction = new getTransaction_1.GetTransaction(this.services.etherscanService);
        this.parseTransaction = new parseTransaction_1.ParseTransaction(this.services.uniswapService);
        this.filterTransaction = new filterTransaction_1.FilterTransaction();
        this.transformTransaction = new transformTransaction_1.TransformTransaction();
        this.tradesBuilderV2 = new tradesBuilderV2_1.TradesBuilderV2(this.services, this.config);
        this.tradesBuilderV2Prebuild = new tradesBuilderV2_prebuild_1.TradesBuilderV2Prebuild(this.services, this.config);
        this.calculateBalance = new calculateBalance_1.CalculateBalance();
        this.calculateTransaction = new calculateTransaction_1.CalculateTransaction();
    }
    ParserBase.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var initStep1, initStep2, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // set progress
                        this.parserProgress.next(10);
                        return [4 /*yield*/, this.getTransaction.getAllTransactionByWalletAddress(this.config.correctWallet)];
                    case 1:
                        initStep1 = _a.sent();
                        initStep2 = this.calculateBalance.buildBalance(initStep1, this.config.correctWallet);
                        this.rawTransactions = initStep2;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.completeStreams();
                        console.log('🔥 error: %o', e_1);
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ParserBase.prototype.process = function () {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rawTransactions, currentBlockNumber, preBuildTrades, cacheRequestData, transactionStep2, transactionStep3, currentDeposit, _b, _c, startDeposit, _d, _e, lastTransactionBlockNumber, transactionsCount, tradesCount, totalIndicators, totalPoints, e_2;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 7, , 8]);
                        rawTransactions = this.rawTransactions;
                        if (!rawTransactions || rawTransactions.length <= 0) {
                            this.completeStreams();
                            return [2 /*return*/, this.noTransactionsResult()];
                        }
                        return [4 /*yield*/, this.services.web3Service.getCurrentBlockNumberLimiter()];
                    case 1:
                        currentBlockNumber = _f.sent();
                        return [4 /*yield*/, this.tradesBuilderV2Prebuild.buildTrades(rawTransactions, currentBlockNumber)];
                    case 2:
                        preBuildTrades = _f.sent();
                        cacheRequestData = this.transformTransaction.buildCacheRequestData(preBuildTrades, rawTransactions);
                        this.estimatedUniswapRequests.next(cacheRequestData.requestsCount);
                        // set progress
                        this.parserProgress.next(85);
                        return [4 /*yield*/, this.parseTransaction.parsePriceAndStoreToCache(cacheRequestData)];
                    case 3:
                        _f.sent();
                        // const transactionStep1 = await this.parseTransaction.parseTransactionBalancePrice(rawTransactions);
                        // set progress
                        this.parserProgress.next(98);
                        return [4 /*yield*/, this.tradesBuilderV2.buildTrades(rawTransactions, currentBlockNumber)];
                    case 4:
                        transactionStep2 = _f.sent();
                        transactionStep3 = this.transformTransaction.transformTokenTradeObjectToArr(transactionStep2);
                        _c = (_b = this.calculateTransaction).getCurrentWalletBalance;
                        return [4 /*yield*/, this.parseTransaction.parseTransactionBalancePriceSingle(rawTransactions[rawTransactions.length - 1])];
                    case 5:
                        currentDeposit = _c.apply(_b, [_f.sent()]);
                        _e = (_d = this.calculateTransaction).getCurrentWalletBalance;
                        return [4 /*yield*/, this.parseTransaction.parseTransactionBalancePriceSingle(rawTransactions[0])];
                    case 6:
                        startDeposit = _e.apply(_d, [_f.sent()]);
                        lastTransactionBlockNumber = ((_a = rawTransactions[rawTransactions.length - 1]) === null || _a === void 0 ? void 0 : _a.blockNumber) || 0;
                        transactionsCount = rawTransactions.length;
                        tradesCount = this.calculateTransaction.tradesCount(transactionStep3);
                        totalIndicators = this.calculateTransaction.totalProfitLoss(transactionStep3);
                        totalPoints = this.calculateTransaction.totalPoints(transactionStep3);
                        this.completeStreams();
                        return [2 /*return*/, {
                                points: totalPoints,
                                currentDeposit: currentDeposit,
                                startDeposit: startDeposit,
                                transactionsCount: transactionsCount,
                                tradesCount: tradesCount,
                                totalIndicators: totalIndicators,
                                lastCheckBlockNumber: lastTransactionBlockNumber,
                                trades: transactionStep3,
                            }];
                    case 7:
                        e_2 = _f.sent();
                        this.completeStreams();
                        console.log('🔥 error: %o', e_2);
                        throw e_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ParserBase.prototype.noTransactionsResult = function () {
        return {
            points: new bignumber_js_1.default(0),
            currentDeposit: {
                amountInETH: new bignumber_js_1.default(0),
                amountInUSD: new bignumber_js_1.default(0),
            },
            startDeposit: {
                amountInETH: new bignumber_js_1.default(0),
                amountInUSD: new bignumber_js_1.default(0),
            },
            transactionsCount: 0,
            tradesCount: 0,
            totalIndicators: {
                profitLoss: { fromETH: new bignumber_js_1.default(0), fromUSD: new bignumber_js_1.default(0) },
                profit: { fromETH: new bignumber_js_1.default(0), fromUSD: new bignumber_js_1.default(0) },
            },
            lastCheckBlockNumber: 0,
            trades: [],
        };
    };
    ParserBase.prototype.completeStreams = function () {
        this.parserProgress.complete();
        this.services.uniswapService.requestCounter.complete();
        this.estimatedUniswapRequests.complete();
    };
    return ParserBase;
}());
exports.ParserBase = ParserBase;
//# sourceMappingURL=parsers.js.map