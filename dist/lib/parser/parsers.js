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
var ParserBase = /** @class */ (function () {
    function ParserBase(services, config) {
        this.services = services;
        this.config = config;
        this.rawTransactions = [];
        this.parserProgress = new rxjs_1.BehaviorSubject(0);
        this.getTransaction = new getTransaction_1.GetTransaction(this.services.etherscanService);
        this.parseTransaction = new parseTransaction_1.ParseTransaction(this.services.uniswapService);
        this.filterTransaction = new filterTransaction_1.FilterTransaction();
        this.transformTransaction = new transformTransaction_1.TransformTransaction();
        this.tradesBuilderV2 = new tradesBuilderV2_1.TradesBuilderV2(this.services, this.config);
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
                        this.parserProgress.complete();
                        console.log('🔥 error: %o', e_1);
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ParserBase.prototype.process = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rawTransactions, transactionStep1, transactionStep2, transactionStep3, currentDeposit, startDeposit, lastTransactionBlockNumber, transactionsCount, tradesCount, totalIndicators, totalPoints, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        rawTransactions = this.rawTransactions;
                        if (!rawTransactions) {
                            throw new Error('Etherscan transaction download error');
                        }
                        // set progress
                        this.parserProgress.next(85);
                        return [4 /*yield*/, this.parseTransaction.parseTransactionBalancePrice(rawTransactions)];
                    case 1:
                        transactionStep1 = _a.sent();
                        // set progress
                        this.parserProgress.next(98);
                        return [4 /*yield*/, this.tradesBuilderV2.buildTrades(transactionStep1)];
                    case 2:
                        transactionStep2 = _a.sent();
                        transactionStep3 = this.transformTransaction.transformTokenTradeObjectToArr(transactionStep2);
                        currentDeposit = this.calculateTransaction.getCurrentWalletBalance(transactionStep1[transactionStep1.length - 1]);
                        startDeposit = this.calculateTransaction.getCurrentWalletBalance(transactionStep1[0]);
                        lastTransactionBlockNumber = transactionStep1[transactionStep1.length - 1].blockNumber;
                        transactionsCount = rawTransactions.length;
                        tradesCount = this.calculateTransaction.tradesCount(transactionStep3);
                        totalIndicators = this.calculateTransaction.totalProfitLoss(transactionStep3);
                        totalPoints = this.calculateTransaction.totalPoints(transactionStep3);
                        this.parserProgress.complete();
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
                    case 3:
                        e_2 = _a.sent();
                        this.parserProgress.complete();
                        console.log('🔥 error: %o', e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ParserBase;
}());
exports.ParserBase = ParserBase;
//# sourceMappingURL=parsers.js.map