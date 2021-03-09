"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransaction = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var GetTransaction = /** @class */ (function () {
    function GetTransaction(etherscanApi) {
        this.etherscanApi = etherscanApi;
    }
    GetTransaction.prototype.getAllTransactionByWalletAddress = function (wallet) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var normalTransactions, internalTransactions, erc20Transactions, erc721Transactions, hashes, arrOfHashes, result;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNormalTransactions(wallet).then(function (res) {
                            return _this.arrayToObjectKeys(res);
                        })];
                    case 1:
                        normalTransactions = _a.sent();
                        return [4 /*yield*/, this.getInternalTransactions(wallet).then(function (res) {
                                return _this.arrayToObjectKeys(res);
                            })];
                    case 2:
                        internalTransactions = _a.sent();
                        return [4 /*yield*/, this.getERC20Transactions(wallet).then(function (res) {
                                return _this.arrayToObjectKeys(res);
                            })];
                    case 3:
                        erc20Transactions = _a.sent();
                        return [4 /*yield*/, this.getERC721Transactions(wallet).then(function (res) {
                                return _this.arrayToObjectKeys(res);
                            })];
                    case 4:
                        erc721Transactions = _a.sent();
                        hashes = lodash_1.uniq(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(Object.keys(normalTransactions))), tslib_1.__read(Object.keys(internalTransactions))), tslib_1.__read(Object.keys(erc20Transactions))), tslib_1.__read(Object.keys(erc721Transactions))));
                        arrOfHashes = hashes.reduce(function (accum, value) {
                            var data = {
                                normalTransactions: normalTransactions[value],
                                internalTransactions: internalTransactions[value],
                                erc20Transactions: erc20Transactions[value],
                                erc721Transactions: erc721Transactions[value],
                            };
                            accum.push(data);
                            return accum;
                        }, []);
                        result = arrOfHashes.sort(this.compareFunction);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    GetTransaction.prototype.compareFunction = function (a, b) {
        var actualA = a.normalTransactions || a.internalTransactions || a.erc20Transactions || a.erc721Transactions;
        var actualB = b.normalTransactions || b.internalTransactions || b.erc20Transactions || b.erc721Transactions;
        if (+actualA[0].blockNumber > +actualB[0].blockNumber) {
            return 1;
        }
        if (+actualA[0].blockNumber < +actualB[0].blockNumber) {
            return -1;
        }
        // @ts-ignore
        if ((+actualA[0].transactionIndex || 0) > (+actualB[0].transactionIndex || 0)) {
            return 1;
        }
        // @ts-ignore
        if ((+actualA[0].transactionIndex || 0) < (+actualB[0].transactionIndex || 0)) {
            return -1;
        }
        return 0;
    };
    GetTransaction.prototype.getNormalTransactions = function (wallet) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, resultCount, page, resultPart;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        resultCount = 0;
                        page = 1;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.etherscanApi
                            .getNormalTransactions(wallet, { sort: 'asc', offset: 10000, page: page })
                            .then(function (res) { return res.result; })
                            .then(function (res) {
                            if (Array.isArray(res)) {
                                return res;
                            }
                            else {
                                throw new Error('Etherscan Rate Limit');
                            }
                        })];
                    case 2:
                        resultPart = _a.sent();
                        resultCount = resultPart.length;
                        result.push.apply(result, tslib_1.__spreadArray([], tslib_1.__read(resultPart)));
                        page += 1;
                        _a.label = 3;
                    case 3:
                        if (resultCount >= 10000) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    GetTransaction.prototype.getInternalTransactions = function (wallet) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, resultCount, page, resultPart;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        resultCount = 0;
                        page = 1;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.etherscanApi
                            .getInternalTransactions(wallet, { sort: 'asc', offset: 10000, page: page })
                            .then(function (res) { return res.result; })
                            .then(function (res) {
                            if (Array.isArray(res)) {
                                return res;
                            }
                            else {
                                throw new Error('Etherscan Rate Limit');
                            }
                        })];
                    case 2:
                        resultPart = _a.sent();
                        resultCount = resultPart.length;
                        result.push.apply(result, tslib_1.__spreadArray([], tslib_1.__read(resultPart)));
                        page += 1;
                        _a.label = 3;
                    case 3:
                        if (resultCount >= 10000) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    GetTransaction.prototype.getERC20Transactions = function (wallet) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, resultCount, page, resultPart;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        resultCount = 0;
                        page = 1;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.etherscanApi
                            .getERC20Transactions(wallet, { sort: 'asc', offset: 10000, page: page })
                            .then(function (res) { return res.result; })
                            .then(function (res) {
                            if (Array.isArray(res)) {
                                return res;
                            }
                            else {
                                throw new Error('Etherscan Rate Limit');
                            }
                        })];
                    case 2:
                        resultPart = _a.sent();
                        resultCount = resultPart.length;
                        result.push.apply(result, tslib_1.__spreadArray([], tslib_1.__read(resultPart)));
                        page += 1;
                        _a.label = 3;
                    case 3:
                        if (resultCount >= 10000) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    GetTransaction.prototype.getERC721Transactions = function (wallet) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, resultCount, page, resultPart;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        resultCount = 0;
                        page = 1;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.etherscanApi
                            .getERC721Transactions(wallet, { sort: 'asc', offset: 10000, page: page })
                            .then(function (res) { return res.result; })
                            .then(function (res) {
                            if (Array.isArray(res)) {
                                return res;
                            }
                            else {
                                throw new Error('Etherscan Rate Limit');
                            }
                        })];
                    case 2:
                        resultPart = _a.sent();
                        resultCount = resultPart.length;
                        result.push.apply(result, tslib_1.__spreadArray([], tslib_1.__read(resultPart)));
                        page += 1;
                        _a.label = 3;
                    case 3:
                        if (resultCount >= 10000) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    GetTransaction.prototype.arrayToObjectKeys = function (data) {
        return data.reduce(function (accum, value) {
            if (accum[value.hash]) {
                accum[value.hash].push(value);
            }
            else {
                accum[value.hash] = [];
                accum[value.hash].push(value);
            }
            return accum;
        }, {});
    };
    return GetTransaction;
}());
exports.GetTransaction = GetTransaction;
//# sourceMappingURL=getTransaction.js.map