(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('web3'), require('bottleneck'), require('lodash'), require('bignumber.js'), require('moment'), require('rxjs'), require('rxjs/operators'), require('graphql-request'), require('shorthash2'), require('axios'), require('qs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'web3', 'bottleneck', 'lodash', 'bignumber.js', 'moment', 'rxjs', 'rxjs/operators', 'graphql-request', 'shorthash2', 'axios', 'qs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['dexeCryptoWalletParser-browser'] = {}, global.Web3, global.Bottleneck, global.lodash, global.BigNumber, global.moment, global.rxjs, global.operators, global.graphqlRequest, global.shortHash, global.Axios, global.qs));
}(this, (function (exports, Web3, Bottleneck, lodash, BigNumber, moment, rxjs, operators, graphqlRequest, shortHash, Axios, qs) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Web3__default = /*#__PURE__*/_interopDefaultLegacy(Web3);
    var Bottleneck__default = /*#__PURE__*/_interopDefaultLegacy(Bottleneck);
    var lodash__default = /*#__PURE__*/_interopDefaultLegacy(lodash);
    var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);
    var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
    var shortHash__default = /*#__PURE__*/_interopDefaultLegacy(shortHash);
    var Axios__default = /*#__PURE__*/_interopDefaultLegacy(Axios);

    exports.TradeType = void 0;
    (function (TradeType) {
        TradeType["BUY"] = "BUY";
        TradeType["SELL"] = "SEll";
    })(exports.TradeType || (exports.TradeType = {}));
    exports.TradeStatus = void 0;
    (function (TradeStatus) {
        TradeStatus["OPEN"] = "OPEN";
        TradeStatus["CLOSE"] = "CLOSE";
    })(exports.TradeStatus || (exports.TradeStatus = {}));

    exports.PARSER_MODE = void 0;
    (function (PARSER_MODE) {
        PARSER_MODE[PARSER_MODE["Wallet"] = 0] = "Wallet";
        PARSER_MODE[PARSER_MODE["W2W"] = 1] = "W2W";
    })(exports.PARSER_MODE || (exports.PARSER_MODE = {}));

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    }

    var defaultConfig = {
        uniswap: {
            uniswapRouterAddress: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            uniswapGQLEndpointUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        },
        etherscanApiUrl: 'https://api.etherscan.io/api?module=',
        infuraUrl: 'https://mainnet.infura.io/v3',
    };

    var Web3Service = /** @class */ (function () {
        function Web3Service(config) {
            this.limiter = new Bottleneck__default['default']({
                minTime: 25,
            });
            this.web3js = new Web3__default['default'](new Web3__default['default'].providers.HttpProvider(defaultConfig.infuraUrl + "/" + config.env.infuraProjectId));
        }
        Web3Service.prototype.getTransactionReceipt = function (transactionHash) {
            // @ts-ignore
            return this.web3js.eth.getTransactionReceipt(transactionHash);
        };
        Web3Service.prototype.getTransactionReceiptLimiter = function (transactionHash) {
            var _this = this;
            return this.limiter.schedule(function () { return _this.getTransactionReceipt(transactionHash); });
        };
        Web3Service.prototype.getCurrentBlockNumberLimiter = function () {
            var _this = this;
            return this.limiter.schedule(function () { return _this.getCurrentBlockNumber(); });
        };
        Web3Service.prototype.getCurrentBlockNumber = function () {
            return this.web3js.eth.getBlockNumber();
        };
        return Web3Service;
    }());

    var GetTransaction = /** @class */ (function () {
        function GetTransaction(etherscanApi) {
            this.etherscanApi = etherscanApi;
        }
        GetTransaction.prototype.getAllTransactionByWalletAddress = function (wallet) {
            return __awaiter(this, void 0, void 0, function () {
                var normalTransactions, internalTransactions, erc20Transactions, erc721Transactions, hashes, arrOfHashes, result;
                var _this = this;
                return __generator(this, function (_a) {
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
                            hashes = lodash.uniq(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(Object.keys(normalTransactions))), __read(Object.keys(internalTransactions))), __read(Object.keys(erc20Transactions))), __read(Object.keys(erc721Transactions))));
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
            return __awaiter(this, void 0, void 0, function () {
                var result, resultCount, page, resultPart;
                return __generator(this, function (_a) {
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
                            result.push.apply(result, __spreadArray([], __read(resultPart)));
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
            return __awaiter(this, void 0, void 0, function () {
                var result, resultCount, page, resultPart;
                return __generator(this, function (_a) {
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
                            result.push.apply(result, __spreadArray([], __read(resultPart)));
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
            return __awaiter(this, void 0, void 0, function () {
                var result, resultCount, page, resultPart;
                return __generator(this, function (_a) {
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
                            result.push.apply(result, __spreadArray([], __read(resultPart)));
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
            return __awaiter(this, void 0, void 0, function () {
                var result, resultCount, page, resultPart;
                return __generator(this, function (_a) {
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
                            result.push.apply(result, __spreadArray([], __read(resultPart)));
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

    var buildBalanceTransformer = function (value, decimals) {
        if (!value || !(typeof decimals === 'number')) {
            return new BigNumber__default['default'](0);
        }
        var balance = value;
        var decimalsBN = new BigNumber__default['default'](decimals);
        var divisor = new BigNumber__default['default'](10).pow(decimalsBN);
        var beforeDecimal = balance.div(divisor);
        return beforeDecimal;
    };
    var parsedBalanceToRaw = function (value, decimals) {
        if (!value || !(typeof decimals === 'number')) {
            return new BigNumber__default['default'](0);
        }
        var balance = value;
        var decimalsBN = new BigNumber__default['default'](decimals);
        var divisor = new BigNumber__default['default'](10).pow(decimalsBN);
        var beforeDecimal = balance.multipliedBy(divisor);
        return beforeDecimal;
    };

    var generateTokenAdressPriceArr = function (data) {
        return lodash__default['default'].uniq(__spreadArray(__spreadArray([], __read(Object.keys(data.balancesBeforeTransaction).filter(function (token) {
            return data.balancesBeforeTransaction[token].amount.isGreaterThan(0);
        }))), __read(Object.keys(data.balances).filter(function (token) { return data.balances[token].amount.isGreaterThanOrEqualTo(0); }))));
    };

    var ParseTransaction = /** @class */ (function () {
        function ParseTransaction(uniswapService) {
            this.uniswapService = uniswapService;
        }
        ParseTransaction.prototype.parseTransactionBalancePrice = function (transactions, isVirtualTransactions) {
            if (isVirtualTransactions === void 0) { isVirtualTransactions = false; }
            return __awaiter(this, void 0, void 0, function () {
                var resultWithParsedBalance, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all(transactions.map(function (itemValue, index, array) { return __awaiter(_this, void 0, void 0, function () {
                                    var value, prices, _a, _b, key, uniswapResultFirst, _c, _d, key, uniswapResultSecond;
                                    var e_2, _e, e_3, _f;
                                    return __generator(this, function (_g) {
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
                                                    for (_a = __values(Object.keys(value.balance)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                        key = _b.value;
                                                        uniswapResultFirst = prices[value.balance[key].address];
                                                        value.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
                                                        value.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
                                                        value.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;
                                                        value.balance[key].amountInETH = buildBalanceTransformer(
                                                        // Catch less zero token balance (Fix minus Dep)
                                                        value.balance[key].amount.isLessThan(0) ? new BigNumber__default['default'](0) : value.balance[key].amount, +value.balance[key].decimals).multipliedBy(uniswapResultFirst.ethPer1Token);
                                                        value.balance[key].amountInUSD = buildBalanceTransformer(value.balance[key].amount.isLessThan(0) ? new BigNumber__default['default'](0) : value.balance[key].amount, +value.balance[key].decimals).multipliedBy(uniswapResultFirst.usdPer1Token);
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
                                                        for (_c = __values(Object.keys(value.balanceBeforeTransaction)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                            key = _d.value;
                                                            uniswapResultSecond = prices[value.balanceBeforeTransaction[key].address];
                                                            value.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
                                                            value.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
                                                            value.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;
                                                            value.balanceBeforeTransaction[key].amountInETH = buildBalanceTransformer(value.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                                ? new BigNumber__default['default'](0)
                                                                : value.balanceBeforeTransaction[key].amount, +value.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.ethPer1Token);
                                                            value.balanceBeforeTransaction[key].amountInUSD = buildBalanceTransformer(value.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                                ? new BigNumber__default['default'](0)
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
            return __awaiter(this, void 0, void 0, function () {
                var value_1, prices, _a, _b, key, uniswapResultFirst, _c, _d, key, uniswapResultSecond, e_4;
                var e_5, _e, e_6, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 2, , 3]);
                            value_1 = transaction;
                            return [4 /*yield*/, this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                                    tokens: parseBeforePrices
                                        ? // Important value - affect to generate cache id
                                            generateTokenAdressPriceArr({
                                                balances: value_1.balance,
                                                balancesBeforeTransaction: value_1.balanceBeforeTransaction,
                                            })
                                        : Object.keys(value_1.balance).filter(function (token) { return value_1.balance[token].amount.isGreaterThanOrEqualTo(0); }),
                                    blockNumber: value_1.blockNumber,
                                })];
                        case 1:
                            prices = _g.sent();
                            try {
                                for (_a = __values(Object.keys(value_1.balance)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    key = _b.value;
                                    uniswapResultFirst = prices[value_1.balance[key].address];
                                    if (value_1.balance[key].amount.isGreaterThanOrEqualTo(0)) {
                                        value_1.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
                                        value_1.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
                                        value_1.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;
                                        value_1.balance[key].amountInETH = buildBalanceTransformer(value_1.balance[key].amount, +value_1.balance[key].decimals).multipliedBy(uniswapResultFirst.ethPer1Token);
                                        value_1.balance[key].amountInUSD = buildBalanceTransformer(value_1.balance[key].amount, +value_1.balance[key].decimals).multipliedBy(uniswapResultFirst.usdPer1Token);
                                    }
                                    else {
                                        value_1.balance[key].ethPer1Token = new BigNumber__default['default'](0);
                                        value_1.balance[key].usdPer1Token = new BigNumber__default['default'](0);
                                        value_1.balance[key].usdPer1ETH = new BigNumber__default['default'](0);
                                        value_1.balance[key].amountInETH = new BigNumber__default['default'](0);
                                        value_1.balance[key].amountInUSD = new BigNumber__default['default'](0);
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
                                    for (_c = __values(Object.keys(value_1.balanceBeforeTransaction)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        key = _d.value;
                                        if (value_1.balanceBeforeTransaction[key].amount.isGreaterThan(0)) {
                                            uniswapResultSecond = prices[value_1.balanceBeforeTransaction[key].address];
                                            value_1.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
                                            value_1.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
                                            value_1.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;
                                            value_1.balanceBeforeTransaction[key].amountInETH = buildBalanceTransformer(value_1.balanceBeforeTransaction[key].amount, +value_1.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.ethPer1Token);
                                            value_1.balanceBeforeTransaction[key].amountInUSD = buildBalanceTransformer(value_1.balanceBeforeTransaction[key].amount, +value_1.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.usdPer1Token);
                                        }
                                        else {
                                            value_1.balanceBeforeTransaction[key].ethPer1Token = new BigNumber__default['default'](0);
                                            value_1.balanceBeforeTransaction[key].usdPer1Token = new BigNumber__default['default'](0);
                                            value_1.balanceBeforeTransaction[key].usdPer1ETH = new BigNumber__default['default'](0);
                                            value_1.balanceBeforeTransaction[key].amountInETH = new BigNumber__default['default'](0);
                                            value_1.balanceBeforeTransaction[key].amountInUSD = new BigNumber__default['default'](0);
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
            return __awaiter(this, void 0, void 0, function () {
                var firstTransaction, lastTransaction, e_7;
                var _this = this;
                return __generator(this, function (_a) {
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
                            return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray(__spreadArray([], __read(data.prebuildTrades.map(function (itemValue) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
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
                                }); }))), __read(data.uniswapTransactions.map(function (itemValue) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
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

    var FilterTransaction = /** @class */ (function () {
        function FilterTransaction() {
        }
        FilterTransaction.prototype.filterAfterRegistration = function (data, blockNumber) {
            return data.filter(function (item) { return item.blockNumber > blockNumber; });
        };
        return FilterTransaction;
    }());

    var TransformTransaction = /** @class */ (function () {
        function TransformTransaction() {
        }
        TransformTransaction.prototype.transformTokenTradeObjectToArr = function (data) {
            // Up all trades to single array
            return Object.values(data)
                .reduce(function (accum, item) {
                accum.push.apply(accum, __spreadArray([], __read(item.trades)));
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
                .filter(function (x) { var _a, _b; return x.normalTransactions && ((_b = (_a = x.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig.uniswap.uniswapRouterAddress; })
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
                accum.push.apply(accum, __spreadArray([], __read(item.trades)));
                return accum;
            }, new Array())
                .reduce(function (accum, item) {
                accum.push.apply(accum, __spreadArray([], __read(item.tradeEvents)));
                return accum;
            }, new Array())
                .map(function (item) {
                return {
                    hash: item.transactionHash,
                    // Important value - affect to generate cache id
                    tokens: generateTokenAdressPriceArr(item),
                    blockNumber: item.blockNumber,
                };
            });
        };
        return TransformTransaction;
    }());

    var X3POINTS = ['0xde4ee8057785a7e8e800db58f9784845a5c2cbd6'.toLowerCase()];
    var X2POINTS = [
        '0x0258f474786ddfd37abce6df6bbb1dd5dfc4434a'.toLowerCase(),
        '0x0c63cae5fcc2ca3dde60a35e50362220651ebec8'.toLowerCase(),
        '0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d'.toLowerCase(),
        '0x26ce25148832c04f3d7f26f32478a9fe55197166'.toLowerCase(),
    ];

    var CalculateTransaction = /** @class */ (function () {
        function CalculateTransaction() {
        }
        CalculateTransaction.prototype.points = function (profitLoss, tokenAddress) {
            var percentMultiply = this.pointsMultiply(tokenAddress);
            return profitLoss.multipliedBy(percentMultiply);
        };
        CalculateTransaction.prototype.pointsMultiply = function (walletAddress) {
            if (X3POINTS.includes(walletAddress)) {
                return 3;
            }
            if (X2POINTS.includes(walletAddress)) {
                return 2;
            }
            return 1;
        };
        CalculateTransaction.prototype.calculateProfitLossOnAnyPosition = function (data) {
            var buyEvents = data.tradeEvents.filter(function (x) { return x.tradeType === exports.TradeType.BUY; });
            var sellEvents = data.tradeEvents.filter(function (x) { return x.tradeType === exports.TradeType.SELL; });
            if (sellEvents.length === 0) {
                return {
                    profitLoss: { fromETH: new BigNumber__default['default'](0), fromUSD: new BigNumber__default['default'](0) },
                    profit: { fromETH: new BigNumber__default['default'](0), fromUSD: new BigNumber__default['default'](0) },
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
                    profitLoss: { eth: new BigNumber__default['default'](0), usd: new BigNumber__default['default'](0) },
                    profit: { eth: new BigNumber__default['default'](0), usd: new BigNumber__default['default'](0) },
                });
                accum.profitLoss.eth = accum.profitLoss.eth.plus(plFromValue.profitLoss.eth);
                accum.profitLoss.usd = accum.profitLoss.usd.plus(plFromValue.profitLoss.usd);
                accum.profit.eth = accum.profit.eth.plus(plFromValue.profit.eth);
                accum.profit.usd = accum.profit.usd.plus(plFromValue.profit.usd);
                return accum;
            }, {
                profitLoss: { eth: new BigNumber__default['default'](0), usd: new BigNumber__default['default'](0) },
                profit: { eth: new BigNumber__default['default'](0), usd: new BigNumber__default['default'](0) },
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
                profitLoss: { fromETH: new BigNumber__default['default'](0), fromUSD: new BigNumber__default['default'](0) },
                profit: { fromETH: new BigNumber__default['default'](0), fromUSD: new BigNumber__default['default'](0) },
            });
        };
        CalculateTransaction.prototype.totalPoints = function (data) {
            return data.reduce(function (accum, value) {
                accum = accum.plus(value.points);
                return accum;
            }, new BigNumber__default['default'](0));
        };
        CalculateTransaction.prototype.tradesCount = function (data) {
            return data.reduce(function (accum, value) {
                accum = accum + value.tradeEvents.length;
                return accum;
            }, 0);
        };
        CalculateTransaction.prototype.getCurrentWalletBalance = function (data) {
            return Object.values(((data === null || data === void 0 ? void 0 : data.balance) || [])).reduce(function (accum, currentValue) {
                accum['amountInETH'] = accum['amountInETH'].plus(currentValue.amountInETH);
                accum['amountInUSD'] = accum['amountInUSD'].plus(currentValue.amountInUSD);
                return accum;
            }, { amountInETH: new BigNumber__default['default'](0), amountInUSD: new BigNumber__default['default'](0) });
        };
        return CalculateTransaction;
    }());

    var stableCoinList = [
        {
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            symbol: 'ETH',
        },
        {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            symbol: 'USDT',
        },
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            symbol: 'USDC',
        },
        {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            symbol: 'DAI',
        },
    ];

    var generateIsTrustedProviderPattern = function (config) {
        if (config.parserMode === exports.PARSER_MODE.W2W) {
            return {
                first: true,
                second: false,
                third: true,
            };
        }
        else {
            return {
                first: true,
                second: false,
                third: false,
            };
        }
    };
    var generateBehaviourConfig = function (config) {
        return {
            isTrustedProviderPattern: generateIsTrustedProviderPattern(config),
        };
    };
    var virtualTradeBlockNumberOffset = 50;

    var ethDefaultInfo = {
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        decimals: '18',
        name: 'Ethereum',
        symbol: 'ETH',
    };
    var wethDefaultInfo = {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        decimals: '18',
        name: 'Wrapped Ether',
        symbol: 'WETH',
    };

    var TradesBuilderV2 = /** @class */ (function () {
        function TradesBuilderV2(services, config) {
            this.services = services;
            this.config = config;
            this.calculateTransaction = new CalculateTransaction();
            this.parseTransactionWallet = new ParseTransaction(this.services.uniswapService);
            this.behaviourConfig = generateBehaviourConfig(config);
        }
        TradesBuilderV2.prototype.buildTrades = function (data, currentBlockNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var rawResult, openTrades, withVirtualTrades, virtualTrade;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.behaviourIterator(data)];
                        case 1:
                            rawResult = _a.sent();
                            openTrades = Object.values(rawResult)
                                .map(function (x) { return x.trades[x.trades.length - 1]; })
                                .filter(function (x) { return x.tradeStatus === exports.TradeStatus.OPEN; });
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
        TradesBuilderV2.prototype.generateVirtualTrades = function (openTrades, lastGroupedTransaction, currentBlockNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
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
                    blockNumber: currentBlockNumber - virtualTradeBlockNumberOffset,
                    previousTransactionBlockNumber: lastGroupedTransaction.blockNumber,
                    feeInETH: new BigNumber__default['default'](0),
                    isVirtualTransaction: true,
                    hash: "AUTO_CLOSE_TRADE_TRANSACTION " + (index + 1),
                    timeStamp: moment__default['default']().unix().toString(),
                };
                accum.push(result);
                return accum;
            }, []);
        };
        TradesBuilderV2.prototype.generateBalanceDiffForVirtualTradePnl = function (trade, balance) {
            var _a;
            return __assign(__assign({}, Object.values(balance).reduce(function (accum, value) {
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
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // console.log('behaviourIterator', data.length);
                    return [2 /*return*/, data.reduce(function (accumulatorValuePromise, currentItem, index) { return __awaiter(_this, void 0, void 0, function () {
                            var accumulatorValue, stateBase, _a, _b, operation, e_1_1, _c, _d, operation, e_2_1;
                            var e_1, _e, e_2, _f;
                            return __generator(this, function (_g) {
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
                                        stateBase = _g.sent();
                                        if (!stateBase.isTrustedProvider) return [3 /*break*/, 13];
                                        _g.label = 3;
                                    case 3:
                                        _g.trys.push([3, 10, 11, 12]);
                                        _a = __values(stateBase.operations), _b = _a.next();
                                        _g.label = 4;
                                    case 4:
                                        if (!!_b.done) return [3 /*break*/, 9];
                                        operation = _b.value;
                                        if (!operation.amount.isGreaterThan(0)) return [3 /*break*/, 6];
                                        // Income event (Open trade or Rebuy open position)
                                        return [4 /*yield*/, this.calculateIncomeEvent(accumulatorValue, operation, stateBase, currentItem)];
                                    case 5:
                                        // Income event (Open trade or Rebuy open position)
                                        _g.sent();
                                        return [3 /*break*/, 8];
                                    case 6: return [4 /*yield*/, this.calculateOutgoingEvent(accumulatorValue, operation, stateBase, currentItem)];
                                    case 7:
                                        _g.sent();
                                        _g.label = 8;
                                    case 8:
                                        _b = _a.next();
                                        return [3 /*break*/, 4];
                                    case 9: return [3 /*break*/, 12];
                                    case 10:
                                        e_1_1 = _g.sent();
                                        e_1 = { error: e_1_1 };
                                        return [3 /*break*/, 12];
                                    case 11:
                                        try {
                                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                        }
                                        finally { if (e_1) throw e_1.error; }
                                        return [7 /*endfinally*/];
                                    case 12: return [3 /*break*/, 20];
                                    case 13:
                                        _g.trys.push([13, 18, 19, 20]);
                                        _c = __values(stateBase.operations), _d = _c.next();
                                        _g.label = 14;
                                    case 14:
                                        if (!!_d.done) return [3 /*break*/, 17];
                                        operation = _d.value;
                                        if (!operation.amount.isLessThanOrEqualTo(0)) return [3 /*break*/, 16];
                                        // Income event (Open trade or Rebuy open position)
                                        return [4 /*yield*/, this.calculateOutgoingEvent(accumulatorValue, operation, stateBase, currentItem)];
                                    case 15:
                                        // Income event (Open trade or Rebuy open position)
                                        _g.sent();
                                        _g.label = 16;
                                    case 16:
                                        _d = _c.next();
                                        return [3 /*break*/, 14];
                                    case 17: return [3 /*break*/, 20];
                                    case 18:
                                        e_2_1 = _g.sent();
                                        e_2 = { error: e_2_1 };
                                        return [3 /*break*/, 20];
                                    case 19:
                                        try {
                                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                        return [7 /*endfinally*/];
                                    case 20: return [2 /*return*/, accumulatorValue];
                                }
                            });
                        }); }, Promise.resolve(initValue))];
                });
            });
        };
        TradesBuilderV2.prototype.calculateOutgoingEvent = function (accumulatorValue, operation, stateBase, currentItem) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var openTradeIndex, currentItemParsed, stateParsed;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            openTradeIndex = (((_a = accumulatorValue[operation.address]) === null || _a === void 0 ? void 0 : _a.trades) || []).findIndex(function (x) { return x.tradeStatus === exports.TradeStatus.OPEN; });
                            if (!(openTradeIndex >= 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.parseTransactionWallet.parseTransactionBalancePriceSingle(currentItem, true)];
                        case 1:
                            currentItemParsed = _b.sent();
                            return [4 /*yield*/, this.getTokenOperationPrice(stateBase, currentItemParsed)];
                        case 2:
                            stateParsed = _b.sent();
                            this.calculateOperationWithOpenTrade(operation, stateParsed, accumulatorValue[operation.address], openTradeIndex, currentItemParsed.balanceBeforeTransaction);
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        TradesBuilderV2.prototype.calculateIncomeEvent = function (accumulatorValue, operation, stateBase, currentItem) {
            return __awaiter(this, void 0, void 0, function () {
                var currentItemParsed, stateParsed, openTradeIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.parseTransactionWallet.parseTransactionBalancePriceSingle(currentItem, true)];
                        case 1:
                            currentItemParsed = _a.sent();
                            return [4 /*yield*/, this.getTokenOperationPrice(stateBase, currentItemParsed)];
                        case 2:
                            stateParsed = _a.sent();
                            if (accumulatorValue[operation.address]) {
                                openTradeIndex = accumulatorValue[operation.address].trades.findIndex(function (x) { return x.tradeStatus === exports.TradeStatus.OPEN; });
                                if (openTradeIndex >= 0) {
                                    this.calculateOperationWithOpenTrade(operation, stateParsed, accumulatorValue[operation.address], openTradeIndex, currentItemParsed.balanceBeforeTransaction);
                                }
                                else {
                                    accumulatorValue[operation.address].trades.push(this.openNewTrade(stateParsed, operation, currentItemParsed.balanceBeforeTransaction));
                                }
                            }
                            else {
                                accumulatorValue[operation.address] = {
                                    tokenAddress: operation.address,
                                    trades: [this.openNewTrade(stateParsed, operation, currentItemParsed.balanceBeforeTransaction)],
                                };
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        TradesBuilderV2.prototype.calculateOperationWithOpenTrade = function (operation, state, data, openTradeIndex, balanceBeforeTransaction) {
            var tradeEvent = this.createNewTradeEvent(state, operation, balanceBeforeTransaction, data.trades[openTradeIndex]);
            data.trades[openTradeIndex].balance = data.trades[openTradeIndex].balance.plus(operation.amount);
            data.trades[openTradeIndex].tradeEvents.push(tradeEvent);
            if (tradeEvent.tradeType === exports.TradeType.SELL) {
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
                data.trades[openTradeIndex].tradeStatus = exports.TradeStatus.CLOSE;
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
            var e_3, _a;
            var sellOperationAmount = tradeEvent.amount.negated();
            try {
                // write sell event from buy
                for (var _b = __values(data.trades[openTradeIndex].tradeEvents.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), index = _d[0], value = _d[1];
                    if (value.tradeType === exports.TradeType.BUY && value.balance.isGreaterThan(0)) {
                        var amountResult = value.balance.minus(sellOperationAmount);
                        if (amountResult.isGreaterThanOrEqualTo(0)) {
                            var profitUSD = tradeEvent.price.withFee.usd
                                .minus(value.price.withFee.usd)
                                .multipliedBy(buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));
                            var profitETH = tradeEvent.price.withFee.eth
                                .minus(value.price.withFee.eth)
                                .multipliedBy(buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));
                            var profitLossUSD = profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100);
                            var profitLossETH = profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100);
                            value.balance = value.balance.minus(sellOperationAmount);
                            var operation = {
                                sellTransactionHash: tradeEvent.transactionHash,
                                amount: new BigNumber__default['default'](sellOperationAmount.toString()),
                                profit: {
                                    usd: profitUSD,
                                    eth: profitETH,
                                },
                                profitLoss: {
                                    usd: profitLossUSD.isFinite() ? profitLossUSD : new BigNumber__default['default'](0),
                                    eth: profitLossETH.isFinite() ? profitLossETH : new BigNumber__default['default'](0),
                                },
                                tokenInfo: tradeEvent.tokenInfo,
                            };
                            value.sellOperations.push(operation);
                            tradeEvent.sellOperations.push(operation);
                            sellOperationAmount = new BigNumber__default['default'](0);
                            break;
                        }
                        else {
                            if (value.balance.isGreaterThan(0)) {
                                var profitUSD = tradeEvent.price.withFee.usd
                                    .minus(value.price.withFee.usd)
                                    .multipliedBy(buildBalanceTransformer(value.balance, +tradeEvent.tokenInfo.decimals));
                                var profitETH = tradeEvent.price.withFee.eth
                                    .minus(value.price.withFee.eth)
                                    .multipliedBy(buildBalanceTransformer(value.balance, +tradeEvent.tokenInfo.decimals));
                                var profitLossUSD = profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100);
                                var profitLossETH = profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100);
                                var operation = {
                                    sellTransactionHash: tradeEvent.transactionHash,
                                    amount: new BigNumber__default['default'](value.balance.toString()),
                                    profit: {
                                        usd: profitUSD,
                                        eth: profitETH,
                                    },
                                    profitLoss: {
                                        usd: profitLossUSD.isFinite() ? profitLossUSD : new BigNumber__default['default'](0),
                                        eth: profitLossETH.isFinite() ? profitLossETH : new BigNumber__default['default'](0),
                                    },
                                    tokenInfo: tradeEvent.tokenInfo,
                                };
                                value.sellOperations.push(operation);
                                tradeEvent.sellOperations.push(operation);
                                sellOperationAmount = sellOperationAmount.minus(value.balance);
                                value.balance = new BigNumber__default['default'](0);
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
        TradesBuilderV2.prototype.openNewTrade = function (state, operation, balanceBeforeTransaction) {
            return {
                balance: new BigNumber__default['default'](operation.amount),
                startDep: this.getBalanceCost(balanceBeforeTransaction),
                tokenAddress: operation.address,
                spendingUSD: new BigNumber__default['default'](state.amount.withFee.USD),
                spendingETH: new BigNumber__default['default'](state.amount.withFee.ETH),
                incomeUSD: new BigNumber__default['default'](0),
                incomeETH: new BigNumber__default['default'](0),
                tradeStatus: exports.TradeStatus.OPEN,
                tradeEvents: [this.createNewTradeEvent(state, operation, balanceBeforeTransaction)],
                openTimeStamp: state.timeStamp,
                profitLossFromUSD: new BigNumber__default['default'](0),
                profitLossFromETH: new BigNumber__default['default'](0),
                profitFromUSD: new BigNumber__default['default'](0),
                profitFromETH: new BigNumber__default['default'](0),
                points: new BigNumber__default['default'](0),
            };
        };
        TradesBuilderV2.prototype.getBalanceCost = function (balance) {
            return Object.values(balance).reduce(function (accum, currentValue) {
                accum.amountInETH = accum.amountInETH.plus(currentValue.amountInETH);
                accum.amountInUSD = accum.amountInUSD.plus(currentValue.amountInUSD);
                return accum;
            }, { amountInETH: new BigNumber__default['default'](0), amountInUSD: new BigNumber__default['default'](0) });
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
                amount: new BigNumber__default['default'](operation.amount),
                balance: tradeType === exports.TradeType.BUY ? new BigNumber__default['default'](operation.amount) : new BigNumber__default['default'](0),
                averageStartDep: this.calculateAverageStartDep(trade, startDep, price, tradeType),
                tokenInfo: tokenInfo,
                sellOperations: [],
                isVirtualTransaction: state.isVirtualTransaction,
                transactionHash: state.transactionHash,
                timeStamp: state.timeStamp,
                costUSD: new BigNumber__default['default'](state.amount.raw.USD),
                costETH: new BigNumber__default['default'](state.amount.raw.ETH),
                transactionFeeETH: state.transactionFeeETH,
                transactionFeeUSD: state.transactionFeeUSD,
                price: price,
                startDep: startDep,
                operationInfo: state.operationInfo,
            };
        };
        TradesBuilderV2.prototype.calculateAverageStartDep = function (trade, startDep, price, tradeType) {
            if (tradeType === exports.TradeType.SELL) {
                return {
                    usd: new BigNumber__default['default'](0),
                    eth: new BigNumber__default['default'](0),
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
                .filter(function (value, index) { return value.tradeType === exports.TradeType.BUY; })
                .reduce(function (accum, value) {
                return accum.plus(buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth));
            }, new BigNumber__default['default'](0));
            var sellTotalCostETH = trade.tradeEvents
                .filter(function (value, index) { return value.tradeType === exports.TradeType.SELL; })
                .reduce(function (accum, value) {
                return accum.plus(buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth));
            }, new BigNumber__default['default'](0));
            var accumulatedTokens = trade.balance;
            var settlementBalance = trade.startDep.amountInETH
                .minus(buyTotalCostETH)
                .plus(sellTotalCostETH)
                .plus(buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(price.withFee.eth));
            return startDep.amountInETH.minus(settlementBalance).plus(trade.startDep.amountInETH);
        };
        TradesBuilderV2.prototype.averageStartDepUSD = function (trade, startDep, price) {
            var buyTotalCostUSD = trade.tradeEvents
                .filter(function (value, index) { return value.tradeType === exports.TradeType.BUY; })
                .reduce(function (accum, value) {
                return accum.plus(buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd));
            }, new BigNumber__default['default'](0));
            var sellTotalCostUSD = trade.tradeEvents
                .filter(function (value, index) { return value.tradeType === exports.TradeType.SELL; })
                .reduce(function (accum, value) {
                return accum.plus(buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd));
            }, new BigNumber__default['default'](0));
            var accumulatedTokens = trade.balance;
            var settlementBalance = trade.startDep.amountInUSD
                .minus(buyTotalCostUSD)
                .plus(sellTotalCostUSD)
                .plus(buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(price.withFee.usd));
            return startDep.amountInUSD.minus(settlementBalance).plus(trade.startDep.amountInUSD);
        };
        TradesBuilderV2.prototype.calculateTokenEventPrice = function (_a) {
            var amount = _a.amount, tokenInfo = _a.tokenInfo, state = _a.state, tradeType = _a.tradeType;
            var parsedAmount = amount.isGreaterThanOrEqualTo(0)
                ? buildBalanceTransformer(amount, +tokenInfo.decimals)
                : buildBalanceTransformer(amount.negated(), +tokenInfo.decimals);
            return {
                raw: {
                    usd: state.amount.raw.USD.dividedBy(parsedAmount),
                    eth: state.amount.raw.ETH.dividedBy(parsedAmount),
                },
                withFee: {
                    usd: tradeType === exports.TradeType.BUY
                        ? state.amount.withFee.USD.dividedBy(parsedAmount)
                        : state.amount.raw.USD.minus(state.transactionFeeUSD).dividedBy(parsedAmount),
                    eth: tradeType === exports.TradeType.BUY
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
                return exports.TradeType.BUY;
            }
            else {
                return exports.TradeType.SELL;
            }
        };
        TradesBuilderV2.prototype.isErrorTransaction = function (data) {
            if (__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read((data.normalTransactions || []))), __read((data.internalTransactions || []))), __read((data.erc20Transactions || []))), __read((data.erc721Transactions || []))).some(function (x) { return (x === null || x === void 0 ? void 0 : x.isError) === '1'; })) {
                return true;
            }
            return false;
        };
        TradesBuilderV2.prototype.getTokenOperationState = function (currentData) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var state, balancesDifferencesData, normalTransaction, uniswapTransactionData, e_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            state = void 0;
                            balancesDifferencesData = this.balanceDifferences(currentData.balance, currentData.balanceBeforeTransaction, currentData.feeInETH);
                            if (!(currentData.normalTransactions &&
                                ((_b = (_a = currentData.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig.uniswap.uniswapRouterAddress)) return [3 /*break*/, 2];
                            normalTransaction = currentData.normalTransactions[0];
                            return [4 /*yield*/, this.services.uniswapService.getUniswapTransactionByIdLimiter({
                                    transactionId: normalTransaction.hash,
                                    blockNumber: +normalTransaction.blockNumber,
                                })];
                        case 1:
                            uniswapTransactionData = _c.sent();
                            // Catch Only correct Uniswap Swaps (for trades) Exclude add or remove from liquidity
                            if (uniswapTransactionData) {
                                state = {
                                    isVirtualTransaction: currentData.isVirtualTransaction,
                                    operations: balancesDifferencesData.differences,
                                    operationInfo: balancesDifferencesData.operationInfo,
                                    isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.first,
                                    timeStamp: normalTransaction.timeStamp,
                                    transactionHash: normalTransaction.hash,
                                };
                            }
                            else {
                                // Catch add or remove from liquidity Uniswap
                                state = {
                                    isVirtualTransaction: currentData.isVirtualTransaction,
                                    operations: balancesDifferencesData.differences,
                                    operationInfo: balancesDifferencesData.operationInfo,
                                    isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.second,
                                    timeStamp: normalTransaction.timeStamp,
                                    transactionHash: normalTransaction.hash,
                                };
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            state = {
                                isVirtualTransaction: currentData.isVirtualTransaction,
                                operations: balancesDifferencesData.differences,
                                operationInfo: balancesDifferencesData.operationInfo,
                                isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.third,
                                timeStamp: currentData.timeStamp,
                                transactionHash: currentData.hash,
                            };
                            _c.label = 3;
                        case 3: return [2 /*return*/, state];
                        case 4:
                            e_4 = _c.sent();
                            throw e_4;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        TradesBuilderV2.prototype.getTokenOperationPrice = function (stateBase, currentData) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var stateWithPrices, normalTransaction, uniswapTransactionData, operationPriceUniRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, e_5;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            stateWithPrices = void 0;
                            if (!(currentData.normalTransactions &&
                                ((_b = (_a = currentData.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig.uniswap.uniswapRouterAddress)) return [3 /*break*/, 2];
                            normalTransaction = currentData.normalTransactions[0];
                            return [4 /*yield*/, this.services.uniswapService.getUniswapTransactionByIdLimiter({
                                    transactionId: normalTransaction.hash,
                                    blockNumber: +normalTransaction.blockNumber,
                                })];
                        case 1:
                            uniswapTransactionData = _c.sent();
                            // Catch Only correct Uniswap Swaps (for trades) Exclude add or remove from liquidity
                            if (uniswapTransactionData) {
                                operationPriceUniRaw = this.operationPriceFromUniswap(uniswapTransactionData);
                                transactionFeeETH = currentData.feeInETH;
                                transactionFeeUSD = currentData.feeInETH.multipliedBy(uniswapTransactionData.ethPrice);
                                operationPriceIncludeFee = this.operationPriceWithFee(operationPriceUniRaw, transactionFeeETH, transactionFeeUSD);
                                stateWithPrices = __assign(__assign({}, stateBase), { amount: {
                                        raw: {
                                            ETH: operationPriceUniRaw.amountInETH,
                                            USD: operationPriceUniRaw.amountInUSD,
                                        },
                                        withFee: {
                                            ETH: operationPriceIncludeFee.amountInETH,
                                            USD: operationPriceIncludeFee.amountInUSD,
                                        },
                                    }, transactionFeeETH: transactionFeeETH,
                                    transactionFeeUSD: transactionFeeUSD });
                            }
                            else {
                                operationPriceOtherRaw = this.operationPriceFromOtherSource(stateBase.operations, currentData.balance);
                                transactionFeeETH = currentData.feeInETH;
                                transactionFeeUSD = currentData.feeInETH.multipliedBy(operationPriceOtherRaw.usdPer1ETH);
                                operationPriceIncludeFee = this.operationPriceWithFee(operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD);
                                stateWithPrices = __assign(__assign({}, stateBase), { amount: {
                                        raw: {
                                            ETH: operationPriceOtherRaw.amountInETH,
                                            USD: operationPriceOtherRaw.amountInUSD,
                                        },
                                        withFee: {
                                            ETH: operationPriceIncludeFee.amountInETH,
                                            USD: operationPriceIncludeFee.amountInUSD,
                                        },
                                    }, transactionFeeETH: transactionFeeETH,
                                    transactionFeeUSD: transactionFeeUSD });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            operationPriceOtherRaw = this.operationPriceFromOtherSource(stateBase.operations, currentData.balance);
                            transactionFeeETH = currentData.feeInETH;
                            transactionFeeUSD = currentData.feeInETH.multipliedBy(operationPriceOtherRaw.usdPer1ETH);
                            operationPriceIncludeFee = this.operationPriceWithFee(operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD);
                            stateWithPrices = __assign(__assign({}, stateBase), { amount: {
                                    raw: {
                                        ETH: operationPriceOtherRaw.amountInETH,
                                        USD: operationPriceOtherRaw.amountInUSD,
                                    },
                                    withFee: {
                                        ETH: operationPriceIncludeFee.amountInETH,
                                        USD: operationPriceIncludeFee.amountInUSD,
                                    },
                                }, transactionFeeETH: transactionFeeETH,
                                transactionFeeUSD: transactionFeeUSD });
                            _c.label = 3;
                        case 3: return [2 /*return*/, stateWithPrices];
                        case 4:
                            e_5 = _c.sent();
                            throw e_5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        TradesBuilderV2.prototype.operationPriceWithFee = function (operationPrice, feeETH, feeUSD) {
            return __assign(__assign({}, operationPrice), { amountInUSD: operationPrice.amountInUSD.plus(feeUSD), amountInETH: operationPrice.amountInETH.plus(feeETH) });
        };
        TradesBuilderV2.prototype.balanceDifferences = function (currentBalance, beforeBalance, parsedFeeInETH) {
            var e_6, _a;
            var _b, _c, _d, _e;
            var tokensAddress = lodash__default['default'].uniq(__spreadArray(__spreadArray([], __read(Object.keys(currentBalance))), __read(Object.keys(beforeBalance))));
            var diffs = [];
            var operationInfo = {
                sent: [],
                received: [],
            };
            try {
                for (var tokensAddress_1 = __values(tokensAddress), tokensAddress_1_1 = tokensAddress_1.next(); !tokensAddress_1_1.done; tokensAddress_1_1 = tokensAddress_1.next()) {
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
                                : new BigNumber__default['default'](currentBalance[key].amount.toString()),
                        };
                        // Exclude Fee From Balance Differences
                        if (item.address === ethDefaultInfo.address) {
                            if (item.amount.isLessThan(0)) {
                                item.amount = item.amount.plus(parsedBalanceToRaw(parsedFeeInETH, +ethDefaultInfo.decimals));
                            }
                            if (item.amount.isGreaterThan(0)) {
                                item.amount = item.amount.minus(parsedBalanceToRaw(parsedFeeInETH, +ethDefaultInfo.decimals));
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
                differences: diffs.filter(function (x) { return !stableCoinList.some(function (y) { return y.address === x.address.toLowerCase(); }); }),
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
                    accum.amountInETH = accum.amountInETH.plus(buildBalanceTransformer(currentValue.amount.negated(), +currentValue.decimals).multipliedBy(balanceData[currentValue.address].ethPer1Token));
                    accum.amountInUSD = accum.amountInUSD.plus(buildBalanceTransformer(currentValue.amount.negated(), +currentValue.decimals).multipliedBy(balanceData[currentValue.address].usdPer1Token));
                    accum.usdPer1ETH = balanceData[currentValue.address].usdPer1ETH;
                }
                return accum;
            }, { amountInETH: new BigNumber__default['default'](0), amountInUSD: new BigNumber__default['default'](0), usdPer1ETH: new BigNumber__default['default'](0) });
            // Income operations
            var income = operations.reduce(function (accum, currentValue) {
                if (!balanceData[currentValue.address]) {
                    throw new Error('Wrong operationPriceFromOtherSource');
                }
                // Catch only outgoing operations
                if (currentValue.amount.isGreaterThan(0)) {
                    accum.amountInETH = accum.amountInETH.plus(buildBalanceTransformer(currentValue.amount, +currentValue.decimals).multipliedBy(balanceData[currentValue.address].ethPer1Token));
                    accum.amountInUSD = accum.amountInUSD.plus(buildBalanceTransformer(currentValue.amount, +currentValue.decimals).multipliedBy(balanceData[currentValue.address].usdPer1Token));
                    accum.usdPer1ETH = balanceData[currentValue.address].usdPer1ETH;
                }
                return accum;
            }, { amountInETH: new BigNumber__default['default'](0), amountInUSD: new BigNumber__default['default'](0), usdPer1ETH: new BigNumber__default['default'](0) });
            return outgoing.amountInETH.isGreaterThan(0) ? outgoing : income;
        };
        TradesBuilderV2.prototype.operationPriceFromUniswap = function (data) {
            return {
                amountInETH: new BigNumber__default['default'](data.amountETH),
                amountInUSD: new BigNumber__default['default'](data.amountUSD),
                usdPer1ETH: new BigNumber__default['default'](data.ethPrice),
            };
        };
        return TradesBuilderV2;
    }());

    var CalculateBalance = /** @class */ (function () {
        function CalculateBalance() {
        }
        CalculateBalance.prototype.buildBalance = function (data, wallet) {
            var _this = this;
            return data.reduce(function (accumulatorValue, currentItem, index, array) {
                var _a, _b, _c;
                var balanceLookupResult = _this.balanceLookup(currentItem, (_a = accumulatorValue[index - 1]) === null || _a === void 0 ? void 0 : _a.balance, wallet);
                var lookupResult = _this.tokenContractAddressMigrateHandler(balanceLookupResult);
                var result = __assign(__assign({}, currentItem), { balance: lookupResult.balance, feeInETH: buildBalanceTransformer(lookupResult.feeInETH, +ethDefaultInfo.decimals), blockNumber: lookupResult.blockNumber, previousTransactionBlockNumber: ((_b = accumulatorValue[index - 1]) === null || _b === void 0 ? void 0 : _b.blockNumber)
                        ? accumulatorValue[index - 1].blockNumber
                        : lookupResult.blockNumber, balanceBeforeTransaction: ((_c = accumulatorValue[index - 1]) === null || _c === void 0 ? void 0 : _c.balance)
                        ? accumulatorValue[index - 1].balance
                        : lookupResult.balance, hash: lookupResult.hash, isVirtualTransaction: false, timeStamp: lookupResult.timeStamp });
                accumulatorValue.push(result);
                return accumulatorValue;
            }, []);
            // Clean Zero Balances for decrease uni balance requests - if enable this crash logic when previous balance 7 current 0 (more info in notes)
            // .map((x) => {
            //   x.balance = pickBy(x.balance, this.filterTokenWIthZeroBalance);
            //   x.balanceBeforeTransaction = pickBy(x.balanceBeforeTransaction, this.filterTokenWIthZeroBalance);
            //   return x;
            // });
        };
        CalculateBalance.prototype.tokenContractAddressMigrateHandler = function (data) {
            var e_1, _a;
            var _loop_1 = function (token) {
                if (token.amount.isLessThan(0) && data.balance[token.address]) {
                    var oldContractToken = Object.values(data.balance).find(function (x) { return x.symbol === token.symbol && x.address !== token.address; });
                    if (oldContractToken) {
                        data.balance[token.address].amount = data.balance[token.address].amount.plus(oldContractToken.amount);
                        delete data.balance[oldContractToken.address];
                    }
                }
            };
            try {
                for (var _b = __values(Object.values(data.balance).reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var token = _c.value;
                    _loop_1(token);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return data;
        };
        CalculateBalance.prototype.filterTokenWIthZeroBalance = function (token) {
            if (token.amount.isLessThanOrEqualTo(0)) {
                return false;
            }
            else {
                return true;
            }
        };
        CalculateBalance.prototype.deepCloneBalance = function (balance) {
            return Object.values(balance).reduce(function (accum, value) {
                accum[value.address] = {
                    symbol: value.symbol,
                    name: value.name,
                    address: value.address,
                    decimals: value.decimals,
                    amount: value.amount.negated().negated(),
                };
                return accum;
            }, {});
        };
        CalculateBalance.prototype.balanceLookup = function (data, previousBalance, wallet) {
            var _this = this;
            var localPreviousBalance = this.deepCloneBalance(previousBalance || {});
            var result = Object.keys(data).reduce(function (accum, value) {
                if (value === 'normalTransactions' && data[value]) {
                    _this.balanceAndFeeFromNormal(data[value], accum, wallet, data);
                    return accum;
                }
                if (value === 'internalTransactions' && data[value]) {
                    _this.balanceInternal(data[value], accum, wallet, data);
                    return accum;
                }
                if (value === 'erc20Transactions' && data[value]) {
                    _this.erc20Balance(data[value], accum, wallet, data);
                    return accum;
                }
                if (value === 'erc721Transactions' && data[value]) {
                    return accum;
                }
                return accum;
            }, { balance: localPreviousBalance, feeInETH: new BigNumber__default['default'](0), blockNumber: 0, hash: '0', timeStamp: '0' });
            // Minus Fee Operation
            // MINUS Transaction FEE from main eth balance
            if (result.feeInETH.isGreaterThan(0)) {
                result.balance[ethDefaultInfo.address].amount = result.balance[ethDefaultInfo.address].amount.minus(result.feeInETH);
            }
            return result;
        };
        CalculateBalance.prototype.erc20Balance = function (data, accum, wallet, transactionGroup) {
            var e_2, _a;
            try {
                for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                    var item = data_1_1.value;
                    accum.blockNumber = +item.blockNumber;
                    accum.hash = item.hash;
                    accum.timeStamp = item.timeStamp;
                    var contractAddress = item.contractAddress.toLowerCase();
                    if (!accum.balance[contractAddress]) {
                        accum.balance[contractAddress] = {
                            address: contractAddress,
                            decimals: item.tokenDecimal,
                            name: item.tokenName,
                            symbol: item.tokenSymbol,
                            amount: new BigNumber__default['default'](0),
                        };
                    }
                    // OUT Operation
                    if (item.from.toLowerCase() === wallet) {
                        accum.balance[contractAddress] = __assign(__assign({}, accum.balance[contractAddress]), { amount: accum.balance[contractAddress].amount.minus(new BigNumber__default['default'](item.value)) });
                        accum.feeInETH = new BigNumber__default['default'](item.gasUsed).multipliedBy(new BigNumber__default['default'](item.gasPrice));
                        // Catch transaction from contract
                        // ( if transaction from contract and user as contract owner fee write from contract balance )
                        if (!transactionGroup['normalTransactions']) {
                            accum.feeInETH = new BigNumber__default['default'](0);
                        }
                    }
                    // In Operation
                    if (item.to.toLowerCase() === wallet) {
                        accum.balance[contractAddress] = __assign(__assign({}, accum.balance[contractAddress]), { amount: accum.balance[contractAddress].amount.plus(new BigNumber__default['default'](item.value)) });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        CalculateBalance.prototype.balanceInternal = function (data, accum, wallet, transactionGroup) {
            var e_3, _a;
            if (!accum.balance[ethDefaultInfo.address]) {
                accum.balance[ethDefaultInfo.address] = __assign(__assign({}, ethDefaultInfo), { amount: new BigNumber__default['default'](0) });
            }
            try {
                for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                    var item = data_2_1.value;
                    accum.blockNumber = +item.blockNumber;
                    accum.hash = item.hash;
                    accum.timeStamp = item.timeStamp;
                    // Catch Error Transactions and recalculate only fee
                    if (item.isError === '1') {
                        continue;
                    }
                    // OUT Operation
                    if (item.from.toLowerCase() === wallet) {
                        accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.minus(new BigNumber__default['default'](item.value)) });
                    }
                    // In Operation
                    if (item.to.toLowerCase() === wallet) {
                        accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.plus(new BigNumber__default['default'](item.value)) });
                        // Catch WETH Unwrap
                        if (!transactionGroup.erc20Transactions &&
                            item.from.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
                            accum.balance[item.from.toLowerCase()] = __assign(__assign({}, accum.balance[item.from.toLowerCase()]), { amount: accum.balance[item.from.toLowerCase()].amount.minus(new BigNumber__default['default'](item.value)) });
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        CalculateBalance.prototype.balanceAndFeeFromNormal = function (data, accum, wallet, transactionGroup) {
            var e_4, _a;
            if (!accum.balance[ethDefaultInfo.address]) {
                accum.balance[ethDefaultInfo.address] = __assign(__assign({}, ethDefaultInfo), { amount: new BigNumber__default['default'](0) });
            }
            try {
                for (var data_3 = __values(data), data_3_1 = data_3.next(); !data_3_1.done; data_3_1 = data_3.next()) {
                    var item = data_3_1.value;
                    accum.blockNumber = +item.blockNumber;
                    accum.hash = item.hash;
                    accum.timeStamp = item.timeStamp;
                    // Catch Error Transactions and recalculate only fee
                    if (item.isError === '1') {
                        accum.feeInETH = new BigNumber__default['default'](item.gasUsed).multipliedBy(new BigNumber__default['default'](item.gasPrice));
                        continue;
                    }
                    // OUT Operation
                    if (item.from.toLowerCase() === wallet) {
                        accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.minus(new BigNumber__default['default'](item.value)) });
                        accum.feeInETH = new BigNumber__default['default'](item.gasUsed).multipliedBy(new BigNumber__default['default'](item.gasPrice));
                        // Catch WETH for ETH->WETH transaction ETH WRAP to WETH
                        if (item.to.toLowerCase() === wethDefaultInfo.address) {
                            if (!accum.balance[wethDefaultInfo.address]) {
                                accum.balance[wethDefaultInfo.address] = __assign(__assign({}, wethDefaultInfo), { amount: new BigNumber__default['default'](0) });
                            }
                            accum.balance[wethDefaultInfo.address] = __assign(__assign({}, accum.balance[wethDefaultInfo.address]), { amount: accum.balance[wethDefaultInfo.address].amount.plus(new BigNumber__default['default'](item.value)) });
                        }
                    }
                    // In Operation
                    if (item.to.toLowerCase() === wallet) {
                        accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.plus(new BigNumber__default['default'](item.value)) });
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (data_3_1 && !data_3_1.done && (_a = data_3.return)) _a.call(data_3);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        return CalculateBalance;
    }());

    var TradesBuilderV2Prebuild = /** @class */ (function () {
        function TradesBuilderV2Prebuild(services, config) {
            this.services = services;
            this.config = config;
            this.behaviourConfig = generateBehaviourConfig(config);
        }
        TradesBuilderV2Prebuild.prototype.buildTrades = function (data, currentBlockNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var rawResult, openTrades, withVirtualTrades, virtualTrade;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.behaviourIterator(data)];
                        case 1:
                            rawResult = _a.sent();
                            openTrades = Object.values(rawResult)
                                .map(function (x) { return x.trades[x.trades.length - 1]; })
                                .filter(function (x) { return x.tradeStatus === exports.TradeStatus.OPEN; });
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
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
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
                    blockNumber: currentBlockNumber - virtualTradeBlockNumberOffset,
                    previousTransactionBlockNumber: lastGroupedTransaction.blockNumber,
                    feeInETH: new BigNumber__default['default'](0),
                    isVirtualTransaction: true,
                    hash: "AUTO_CLOSE_TRADE_TRANSACTION " + (index + 1),
                    timeStamp: moment__default['default']().unix().toString(),
                };
                accum.push(result);
                return accum;
            }, []);
        };
        TradesBuilderV2Prebuild.prototype.generateBalanceDiffForVirtualTradePnl = function (trade, balance) {
            var _a;
            return __assign(__assign({}, Object.values(balance).reduce(function (accum, value) {
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
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // console.log('behaviourIterator', data.length);
                    return [2 /*return*/, data.reduce(function (accumulatorValuePromise, currentItem, index) { return __awaiter(_this, void 0, void 0, function () {
                            var accumulatorValue, state, _a, _b, operation, _c, _d, operation;
                            var e_1, _e, e_2, _f;
                            return __generator(this, function (_g) {
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
                                                for (_a = __values(state.operations), _b = _a.next(); !_b.done; _b = _a.next()) {
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
                                                for (_c = __values(state.operations), _d = _c.next(); !_d.done; _d = _c.next()) {
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
            var openTradeIndex = (((_a = accumulatorValue[operation.address]) === null || _a === void 0 ? void 0 : _a.trades) || []).findIndex(function (x) { return x.tradeStatus === exports.TradeStatus.OPEN; });
            if (openTradeIndex >= 0) {
                this.calculateOperationWithOpenTrade(operation, state, accumulatorValue[operation.address], openTradeIndex, balanceBeforeTransaction);
            }
        };
        TradesBuilderV2Prebuild.prototype.calculateIncomeEvent = function (accumulatorValue, operation, state, balanceBeforeTransaction) {
            if (accumulatorValue[operation.address]) {
                var openTradeIndex = accumulatorValue[operation.address].trades.findIndex(function (x) { return x.tradeStatus === exports.TradeStatus.OPEN; });
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
            if (tradeEvent.tradeType === exports.TradeType.SELL) {
                this.createIterateSellEvents(tradeEvent, data, openTradeIndex);
            }
            if (data.trades[openTradeIndex].balance.isLessThanOrEqualTo(0)) {
                data.trades[openTradeIndex].tradeStatus = exports.TradeStatus.CLOSE;
                data.trades[openTradeIndex].closeTimeStamp = state.timeStamp;
            }
        };
        TradesBuilderV2Prebuild.prototype.createIterateSellEvents = function (tradeEvent, data, openTradeIndex) {
            var e_3, _a;
            var sellOperationAmount = tradeEvent.amount.negated();
            try {
                // write sell event from buy
                for (var _b = __values(data.trades[openTradeIndex].tradeEvents.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), index = _d[0], value = _d[1];
                    if (value.tradeType === exports.TradeType.BUY && value.balance.isGreaterThan(0)) {
                        var amountResult = value.balance.minus(sellOperationAmount);
                        if (amountResult.isGreaterThanOrEqualTo(0)) {
                            value.balance = value.balance.minus(sellOperationAmount);
                            var operation = {
                                sellTransactionHash: tradeEvent.transactionHash,
                                amount: new BigNumber__default['default'](sellOperationAmount.toString()),
                                profit: {
                                    usd: new BigNumber__default['default'](0),
                                    eth: new BigNumber__default['default'](0),
                                },
                                profitLoss: {
                                    usd: new BigNumber__default['default'](0),
                                    eth: new BigNumber__default['default'](0),
                                },
                                tokenInfo: tradeEvent.tokenInfo,
                            };
                            value.sellOperations.push(operation);
                            tradeEvent.sellOperations.push(operation);
                            sellOperationAmount = new BigNumber__default['default'](0);
                            break;
                        }
                        else {
                            if (value.balance.isGreaterThan(0)) {
                                var operation = {
                                    sellTransactionHash: tradeEvent.transactionHash,
                                    amount: new BigNumber__default['default'](value.balance.toString()),
                                    profit: {
                                        usd: new BigNumber__default['default'](0),
                                        eth: new BigNumber__default['default'](0),
                                    },
                                    profitLoss: {
                                        usd: new BigNumber__default['default'](0),
                                        eth: new BigNumber__default['default'](0),
                                    },
                                    tokenInfo: tradeEvent.tokenInfo,
                                };
                                value.sellOperations.push(operation);
                                tradeEvent.sellOperations.push(operation);
                                sellOperationAmount = sellOperationAmount.minus(value.balance);
                                value.balance = new BigNumber__default['default'](0);
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
                balance: new BigNumber__default['default'](operation.amount),
                startDep: { amountInETH: new BigNumber__default['default'](0), amountInUSD: new BigNumber__default['default'](0) },
                tokenAddress: operation.address,
                spendingUSD: new BigNumber__default['default'](0),
                spendingETH: new BigNumber__default['default'](0),
                incomeUSD: new BigNumber__default['default'](0),
                incomeETH: new BigNumber__default['default'](0),
                tradeStatus: exports.TradeStatus.OPEN,
                tradeEvents: [this.createNewTradeEvent(state, operation, balanceBeforeTransaction)],
                openTimeStamp: state.timeStamp,
                profitLossFromUSD: new BigNumber__default['default'](0),
                profitLossFromETH: new BigNumber__default['default'](0),
                profitFromUSD: new BigNumber__default['default'](0),
                profitFromETH: new BigNumber__default['default'](0),
                points: new BigNumber__default['default'](0),
            };
        };
        TradesBuilderV2Prebuild.prototype.createNewTradeEvent = function (state, operation, balanceBeforeTransaction, trade) {
            var startDep = { amountInETH: new BigNumber__default['default'](0), amountInUSD: new BigNumber__default['default'](0) };
            var tokenInfo = this.createTokenInfo(operation);
            var tradeType = this.tradeTypeSwitcher(operation.amount);
            var price = {
                raw: {
                    usd: new BigNumber__default['default'](0),
                    eth: new BigNumber__default['default'](0),
                },
                withFee: {
                    usd: new BigNumber__default['default'](0),
                    eth: new BigNumber__default['default'](0),
                },
            };
            return {
                tradeType: tradeType,
                amount: new BigNumber__default['default'](operation.amount),
                balance: tradeType === exports.TradeType.BUY ? new BigNumber__default['default'](operation.amount) : new BigNumber__default['default'](0),
                averageStartDep: {
                    usd: new BigNumber__default['default'](0),
                    eth: new BigNumber__default['default'](0),
                },
                tokenInfo: tokenInfo,
                sellOperations: [],
                isVirtualTransaction: state.isVirtualTransaction,
                transactionHash: state.transactionHash,
                timeStamp: state.timeStamp,
                costUSD: new BigNumber__default['default'](0),
                costETH: new BigNumber__default['default'](0),
                transactionFeeETH: new BigNumber__default['default'](0),
                transactionFeeUSD: new BigNumber__default['default'](0),
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
                return exports.TradeType.BUY;
            }
            else {
                return exports.TradeType.SELL;
            }
        };
        TradesBuilderV2Prebuild.prototype.isErrorTransaction = function (data) {
            if (__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read((data.normalTransactions || []))), __read((data.internalTransactions || []))), __read((data.erc20Transactions || []))), __read((data.erc721Transactions || []))).some(function (x) { return (x === null || x === void 0 ? void 0 : x.isError) === '1'; })) {
                return true;
            }
            return false;
        };
        TradesBuilderV2Prebuild.prototype.getTokenOperationState = function (currentData) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var state, balancesDifferencesData, normalTransaction;
                return __generator(this, function (_c) {
                    try {
                        state = void 0;
                        balancesDifferencesData = this.balanceDifferences(currentData.balance, currentData.balanceBeforeTransaction, currentData.feeInETH);
                        if (currentData.normalTransactions &&
                            ((_b = (_a = currentData.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig.uniswap.uniswapRouterAddress) {
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
            var tokensAddress = lodash__default['default'].uniq(__spreadArray(__spreadArray([], __read(Object.keys(currentBalance))), __read(Object.keys(beforeBalance))));
            var diffs = [];
            var operationInfo = {
                sent: [],
                received: [],
            };
            try {
                for (var tokensAddress_1 = __values(tokensAddress), tokensAddress_1_1 = tokensAddress_1.next(); !tokensAddress_1_1.done; tokensAddress_1_1 = tokensAddress_1.next()) {
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
                                : new BigNumber__default['default'](currentBalance[key].amount.toString()),
                        };
                        // Exclude Fee From Balance Differences
                        if (item.address === ethDefaultInfo.address) {
                            if (item.amount.isLessThan(0)) {
                                item.amount = item.amount.plus(parsedBalanceToRaw(parsedFeeInETH, +ethDefaultInfo.decimals));
                            }
                            if (item.amount.isGreaterThan(0)) {
                                item.amount = item.amount.minus(parsedBalanceToRaw(parsedFeeInETH, +ethDefaultInfo.decimals));
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
                differences: diffs.filter(function (x) { return !stableCoinList.some(function (y) { return y.address === x.address.toLowerCase(); }); }),
                operationInfo: operationInfo,
            };
        };
        return TradesBuilderV2Prebuild;
    }());

    var ParserBase = /** @class */ (function () {
        function ParserBase(services, config) {
            this.services = services;
            this.config = config;
            this.rawTransactions = [];
            this.parserProgress = new rxjs.BehaviorSubject(0);
            this.uniswapRequestCount = this.services.uniswapService.requestCounter.asObservable().pipe(operators.auditTime(1000));
            this.estimatedUniswapRequests = new rxjs.BehaviorSubject(0);
            this.getTransaction = new GetTransaction(this.services.etherscanService);
            this.parseTransaction = new ParseTransaction(this.services.uniswapService);
            this.filterTransaction = new FilterTransaction();
            this.transformTransaction = new TransformTransaction();
            this.tradesBuilderV2 = new TradesBuilderV2(this.services, this.config);
            this.tradesBuilderV2Prebuild = new TradesBuilderV2Prebuild(this.services, this.config);
            this.calculateBalance = new CalculateBalance();
            this.calculateTransaction = new CalculateTransaction();
        }
        ParserBase.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var initStep1, initStep2, e_1;
                return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                var rawTransactions, currentBlockNumber, preBuildTrades, cacheRequestData, transactionStep2, transactionStep3, currentDeposit, _b, _c, startDeposit, _d, _e, lastTransactionBlockNumber, transactionsCount, tradesCount, totalIndicators, totalPoints, e_2;
                return __generator(this, function (_f) {
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
                points: new BigNumber__default['default'](0),
                currentDeposit: {
                    amountInETH: new BigNumber__default['default'](0),
                    amountInUSD: new BigNumber__default['default'](0),
                },
                startDeposit: {
                    amountInETH: new BigNumber__default['default'](0),
                    amountInUSD: new BigNumber__default['default'](0),
                },
                transactionsCount: 0,
                tradesCount: 0,
                totalIndicators: {
                    profitLoss: { fromETH: new BigNumber__default['default'](0), fromUSD: new BigNumber__default['default'](0) },
                    profit: { fromETH: new BigNumber__default['default'](0), fromUSD: new BigNumber__default['default'](0) },
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

    var checkTokenArrPriceInUSDandETHByBlockNumber = graphqlRequest.gql(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(block: { number: $blockNumber }) {\n      ethPrice\n    }\n  }\n"], ["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(block: { number: $blockNumber }) {\n      ethPrice\n    }\n  }\n"])));
    var checkTokenArrPriceInUSDandETHCurrent = graphqlRequest.gql(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(where: { id: 1 }) {\n      ethPrice\n    }\n  }\n"], ["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(where: { id: 1 }) {\n      ethPrice\n    }\n  }\n"])));
    var templateObject_1$1, templateObject_2$1;

    var UniswapServiceBase = /** @class */ (function () {
        function UniswapServiceBase() {
            this.requestCounter = new rxjs.BehaviorSubject(0);
        }
        UniswapServiceBase.prototype.checkTokenPriceInUSDandETHLimiter = function (token, blockNumber) {
            var _this = this;
            return this.limiter.schedule(function () { return _this.checkTokenPriceInUSDandETH(token, blockNumber); });
        };
        UniswapServiceBase.prototype.checkTokenArrPriceInUSDandETHLimiter = function (argumentsData) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.uniswapCacheService.isExist(JSON.stringify(argumentsData))];
                        case 1:
                            if (_a.sent()) {
                                return [2 /*return*/, this.uniswapCacheService.getData(JSON.stringify(argumentsData))];
                            }
                            return [2 /*return*/, this.limiter.schedule(function () { return _this.checkTokenArrPriceInUSDandETH(argumentsData); })];
                    }
                });
            });
        };
        UniswapServiceBase.prototype.getUniswapTransactionByIdLimiter = function (argumentsData) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.uniswapCacheService.isExist(JSON.stringify(argumentsData))];
                        case 1:
                            if (_a.sent()) {
                                return [2 /*return*/, this.uniswapCacheService.getData(JSON.stringify(argumentsData))];
                            }
                            return [2 /*return*/, this.limiter.schedule(function () { return _this.getUniswapTransactionById(argumentsData); })];
                    }
                });
            });
        };
        UniswapServiceBase.prototype.checkTokenArrPriceInUSDandETH = function (argumentsData) {
            return __awaiter(this, void 0, void 0, function () {
                var PAIR_SEARCH, tokensArrs, totalResult_1, tokensArrs_1, tokensArrs_1_1, tokens, count, maxTries, _loop_1, this_1, state_1, e_1_1, dataResult, _a, e_2;
                var e_1, _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 14, , 15]);
                            PAIR_SEARCH = graphqlRequest.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n          usdc0: pairs(\n            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          usdc1: pairs(\n            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          weth0: pairs(\n            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          weth1: pairs(\n            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          ethPrice: bundles(block: { number: $blockNumber }) {\n            ethPrice\n          }\n        }\n      "], ["\n        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n          usdc0: pairs(\n            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          usdc1: pairs(\n            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          weth0: pairs(\n            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          weth1: pairs(\n            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          ethPrice: bundles(block: { number: $blockNumber }) {\n            ethPrice\n          }\n        }\n      "])));
                            tokensArrs = lodash.chunk(argumentsData.tokens.map(function (item) { return item.toLowerCase(); }), 5);
                            totalResult_1 = {
                                usdc0: [],
                                usdc1: [],
                                weth0: [],
                                weth1: [],
                                ethPrice: [],
                            };
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 7, 8, 9]);
                            tokensArrs_1 = __values(tokensArrs), tokensArrs_1_1 = tokensArrs_1.next();
                            _c.label = 2;
                        case 2:
                            if (!!tokensArrs_1_1.done) return [3 /*break*/, 6];
                            tokens = tokensArrs_1_1.value;
                            count = 0;
                            maxTries = 10;
                            _loop_1 = function () {
                                var localController, localClientGQ, variables, requestTimeLimit, result, e_3;
                                var _d, _e, _f, _g, _h;
                                return __generator(this, function (_j) {
                                    switch (_j.label) {
                                        case 0:
                                            localController = new AbortController();
                                            localClientGQ = new graphqlRequest.GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl, {
                                                signal: localController.signal,
                                            });
                                            variables = {
                                                tokens: tokens,
                                                tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                                tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                                                // UNISWAP NO DATA BEFORE 10009000 BLOCK
                                                blockNumber: argumentsData.blockNumber > 10009000 ? argumentsData.blockNumber : 10009000,
                                            };
                                            requestTimeLimit = setTimeout(function () {
                                                localController.abort();
                                            }, 10000);
                                            _j.label = 1;
                                        case 1:
                                            _j.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, localClientGQ.request(PAIR_SEARCH, variables)];
                                        case 2:
                                            result = _j.sent();
                                            clearTimeout(requestTimeLimit);
                                            this_1.requestCounter.next(this_1.requestCounter.value + 1);
                                            (_d = totalResult_1.ethPrice).push.apply(_d, __spreadArray([], __read(result.ethPrice)));
                                            (_e = totalResult_1.usdc0).push.apply(_e, __spreadArray([], __read(result.usdc0)));
                                            (_f = totalResult_1.usdc1).push.apply(_f, __spreadArray([], __read(result.usdc1)));
                                            (_g = totalResult_1.weth0).push.apply(_g, __spreadArray([], __read(result.weth0)));
                                            (_h = totalResult_1.weth1).push.apply(_h, __spreadArray([], __read(result.weth1)));
                                            return [2 /*return*/, "break"];
                                        case 3:
                                            e_3 = _j.sent();
                                            clearTimeout(requestTimeLimit);
                                            console.log('retry price request');
                                            if (++count === maxTries) {
                                                throw e_3;
                                            }
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _c.label = 3;
                        case 3:
                            return [5 /*yield**/, _loop_1()];
                        case 4:
                            state_1 = _c.sent();
                            if (state_1 === "break")
                                return [3 /*break*/, 5];
                            return [3 /*break*/, 3];
                        case 5:
                            tokensArrs_1_1 = tokensArrs_1.next();
                            return [3 /*break*/, 2];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_1_1 = _c.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (tokensArrs_1_1 && !tokensArrs_1_1.done && (_b = tokensArrs_1.return)) _b.call(tokensArrs_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 9:
                            dataResult = argumentsData.tokens.reduce(function (accum, value, index) {
                                var token = value.toLowerCase();
                                accum[value] = _this.tokenPriceSwitcher(token, totalResult_1);
                                return accum;
                            }, {});
                            _a = dataResult;
                            if (!_a) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.uniswapCacheService.isExist(JSON.stringify(argumentsData))];
                        case 10:
                            _a = !(_c.sent());
                            _c.label = 11;
                        case 11:
                            if (!_a) return [3 /*break*/, 13];
                            return [4 /*yield*/, this.uniswapCacheService.setData(JSON.stringify(argumentsData), dataResult)];
                        case 12:
                            _c.sent();
                            _c.label = 13;
                        case 13: return [2 /*return*/, dataResult];
                        case 14:
                            e_2 = _c.sent();
                            throw e_2;
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
        UniswapServiceBase.prototype.checkTokenPriceInUSDandETH = function (token, blockNumber) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __awaiter(this, void 0, void 0, function () {
                var count, maxTries, PAIR_SEARCH, variables, result, e_4;
                return __generator(this, function (_s) {
                    switch (_s.label) {
                        case 0:
                            count = 0;
                            maxTries = 10;
                            _s.label = 1;
                        case 1:
                            _s.label = 2;
                        case 2:
                            _s.trys.push([2, 4, , 5]);
                            PAIR_SEARCH = blockNumber
                                ? checkTokenArrPriceInUSDandETHByBlockNumber
                                : checkTokenArrPriceInUSDandETHCurrent;
                            variables = {
                                token: token.toLowerCase(),
                                tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                                blockNumber: blockNumber,
                            };
                            return [4 /*yield*/, this.clientGQ.request(PAIR_SEARCH, variables)];
                        case 3:
                            result = _s.sent();
                            this.requestCounter.next(this.requestCounter.value + 1);
                            // Catch WETH and ETH price check
                            if (token.toLowerCase() === ethDefaultInfo.address || token.toLowerCase() === wethDefaultInfo.address) {
                                return [2 /*return*/, {
                                        usdPer1Token: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                        ethPer1Token: new BigNumber__default['default'](1),
                                        usdPer1ETH: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                    }];
                            }
                            if ((_a = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _a === void 0 ? void 0 : _a.token1Price) {
                                return [2 /*return*/, {
                                        usdPer1Token: new BigNumber__default['default']((_b = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _b === void 0 ? void 0 : _b.token1Price).multipliedBy(new BigNumber__default['default']((_c = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _c === void 0 ? void 0 : _c.ethPrice)),
                                        ethPer1Token: new BigNumber__default['default']((_d = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _d === void 0 ? void 0 : _d.token1Price),
                                        usdPer1ETH: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                    }];
                            }
                            if ((_e = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _e === void 0 ? void 0 : _e.token0Price) {
                                return [2 /*return*/, {
                                        usdPer1Token: new BigNumber__default['default']((_f = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _f === void 0 ? void 0 : _f.token0Price).multipliedBy(new BigNumber__default['default']((_g = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _g === void 0 ? void 0 : _g.ethPrice)),
                                        ethPer1Token: new BigNumber__default['default']((_h = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _h === void 0 ? void 0 : _h.token0Price),
                                        usdPer1ETH: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                    }];
                            }
                            if ((_j = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _j === void 0 ? void 0 : _j.token1Price) {
                                return [2 /*return*/, {
                                        usdPer1Token: new BigNumber__default['default']((_k = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _k === void 0 ? void 0 : _k.token1Price),
                                        ethPer1Token: new BigNumber__default['default']((_l = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _l === void 0 ? void 0 : _l.token1Price).dividedBy((_m = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _m === void 0 ? void 0 : _m.ethPrice),
                                        usdPer1ETH: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                    }];
                            }
                            if ((_o = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _o === void 0 ? void 0 : _o.token0Price) {
                                return [2 /*return*/, {
                                        usdPer1Token: new BigNumber__default['default']((_p = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _p === void 0 ? void 0 : _p.token0Price),
                                        ethPer1Token: new BigNumber__default['default']((_q = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _q === void 0 ? void 0 : _q.token0Price).dividedBy((_r = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _r === void 0 ? void 0 : _r.ethPrice),
                                        usdPer1ETH: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                    }];
                            }
                            return [2 /*return*/, {
                                    usdPer1Token: new BigNumber__default['default'](0),
                                    ethPer1Token: new BigNumber__default['default'](0),
                                    usdPer1ETH: new BigNumber__default['default'](result.ethPrice[0].ethPrice),
                                }];
                        case 4:
                            e_4 = _s.sent();
                            console.log('retry price request');
                            if (++count === maxTries) {
                                throw e_4;
                            }
                            return [3 /*break*/, 5];
                        case 5: return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        UniswapServiceBase.prototype.getUniswapTransactionById = function (argumentsData) {
            return __awaiter(this, void 0, void 0, function () {
                var query, dataResult, _a, e_5;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            query = graphqlRequest.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      {\n        swaps(where: { transaction: \"", "\" }) {\n          id\n          transaction {\n            id\n            blockNumber\n            timestamp\n          }\n          timestamp\n          pair {\n            id\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            volumeUSD\n            untrackedVolumeUSD\n          }\n          sender\n          amount0In\n          amount1In\n          amount0Out\n          amount1Out\n          to\n          logIndex\n          amountUSD\n        }\n        ethPrice: bundles(block: { number: ", " }) {\n          ethPrice\n        }\n      }\n    "], ["\n      {\n        swaps(where: { transaction: \"", "\" }) {\n          id\n          transaction {\n            id\n            blockNumber\n            timestamp\n          }\n          timestamp\n          pair {\n            id\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            volumeUSD\n            untrackedVolumeUSD\n          }\n          sender\n          amount0In\n          amount1In\n          amount0Out\n          amount1Out\n          to\n          logIndex\n          amountUSD\n        }\n        ethPrice: bundles(block: { number: ", " }) {\n          ethPrice\n        }\n      }\n    "])), argumentsData.transactionId, argumentsData.blockNumber);
                            return [4 /*yield*/, this.clientGQ.request(query).then(function (res) {
                                    var _a;
                                    _this.requestCounter.next(_this.requestCounter.value + 1);
                                    if (!res.swaps[0]) {
                                        return undefined;
                                    }
                                    res.swaps[0].amountETH = new BigNumber__default['default'](res.swaps[0].amountUSD).dividedBy((_a = res === null || res === void 0 ? void 0 : res.ethPrice[0]) === null || _a === void 0 ? void 0 : _a.ethPrice).toString();
                                    res.swaps[0].ethPrice = res.ethPrice[0].ethPrice;
                                    return res.swaps[0];
                                })];
                        case 1:
                            dataResult = _b.sent();
                            _a = dataResult;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.uniswapCacheService.isExist(JSON.stringify(argumentsData))];
                        case 2:
                            _a = !(_b.sent());
                            _b.label = 3;
                        case 3:
                            if (!_a) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.uniswapCacheService.setData(JSON.stringify(argumentsData), dataResult)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/, dataResult];
                        case 6:
                            e_5 = _b.sent();
                            throw e_5;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        UniswapServiceBase.prototype.tokenPriceSwitcher = function (token, data) {
            var ethPrice = data.ethPrice[0].ethPrice;
            // Catch WETH and ETH price check
            if (token === ethDefaultInfo.address || token === wethDefaultInfo.address) {
                return {
                    usdPer1Token: new BigNumber__default['default'](ethPrice),
                    ethPer1Token: new BigNumber__default['default'](1),
                    usdPer1ETH: new BigNumber__default['default'](ethPrice),
                };
            }
            var weth0 = data.weth0.find(function (x) { return x.token0.id === token; });
            if (weth0 === null || weth0 === void 0 ? void 0 : weth0.token1Price) {
                return {
                    usdPer1Token: new BigNumber__default['default'](weth0.token1Price).multipliedBy(new BigNumber__default['default'](ethPrice)),
                    ethPer1Token: new BigNumber__default['default'](weth0.token1Price),
                    usdPer1ETH: new BigNumber__default['default'](ethPrice),
                };
            }
            var weth1 = data.weth1.find(function (x) { return x.token1.id === token; });
            if (weth1 === null || weth1 === void 0 ? void 0 : weth1.token0Price) {
                return {
                    usdPer1Token: new BigNumber__default['default'](weth1.token0Price).multipliedBy(new BigNumber__default['default'](ethPrice)),
                    ethPer1Token: new BigNumber__default['default'](weth1.token0Price),
                    usdPer1ETH: new BigNumber__default['default'](ethPrice),
                };
            }
            var usdc0 = data.usdc0.find(function (x) { return x.token0.id === token; });
            if (usdc0 === null || usdc0 === void 0 ? void 0 : usdc0.token1Price) {
                return {
                    usdPer1Token: new BigNumber__default['default'](usdc0.token1Price),
                    ethPer1Token: new BigNumber__default['default'](usdc0.token1Price).dividedBy(ethPrice),
                    usdPer1ETH: new BigNumber__default['default'](ethPrice),
                };
            }
            var usdc1 = data.usdc1.find(function (x) { return x.token1.id === token; });
            if (usdc1 === null || usdc1 === void 0 ? void 0 : usdc1.token0Price) {
                return {
                    usdPer1Token: new BigNumber__default['default'](usdc1.token0Price),
                    ethPer1Token: new BigNumber__default['default'](usdc1.token0Price).dividedBy(ethPrice),
                    usdPer1ETH: new BigNumber__default['default'](ethPrice),
                };
            }
            return {
                usdPer1Token: new BigNumber__default['default'](0),
                ethPer1Token: new BigNumber__default['default'](0),
                usdPer1ETH: new BigNumber__default['default'](ethPrice),
            };
        };
        return UniswapServiceBase;
    }());
    var templateObject_1, templateObject_2;

    var UniswapPrebuildCacheService = /** @class */ (function () {
        function UniswapPrebuildCacheService() {
            this.cache = new Map();
        }
        UniswapPrebuildCacheService.prototype.getData = function (keyValue) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = shortHash__default['default'](keyValue);
                    try {
                        if (this.cache.has(key)) {
                            return [2 /*return*/, this.getObjectFromCache(key)];
                        }
                        else {
                            throw new Error('Wrong Cache Service Behaviour');
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        UniswapPrebuildCacheService.prototype.setData = function (keyValue, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = shortHash__default['default'](keyValue);
                    this.setObjectToCache(key, data);
                    return [2 /*return*/];
                });
            });
        };
        UniswapPrebuildCacheService.prototype.isExist = function (keyValue) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = shortHash__default['default'](keyValue);
                    return [2 /*return*/, this.cache.has(key)];
                });
            });
        };
        UniswapPrebuildCacheService.prototype.getObjectFromCache = function (key) {
            try {
                return this.cache.get(key);
            }
            catch (e) {
                throw e;
            }
        };
        UniswapPrebuildCacheService.prototype.setObjectToCache = function (key, data) {
            try {
                this.cache.set(key, data);
            }
            catch (e) {
                throw e;
            }
        };
        return UniswapPrebuildCacheService;
    }());

    var UniswapServiceClient = /** @class */ (function (_super) {
        __extends(UniswapServiceClient, _super);
        function UniswapServiceClient(config) {
            var _this = _super.call(this) || this;
            _this.config = config;
            _this.limiter = new Bottleneck__default['default']({
                minTime: 100,
                maxConcurrent: 5,
            });
            _this.clientGQ = new graphqlRequest.GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl);
            _this.uniswapCacheService = new UniswapPrebuildCacheService();
            if (_this.config.cache) {
                _this.uniswapCacheService.cache = new Map(Object.entries(_this.config.cache));
            }
            return _this;
        }
        return UniswapServiceClient;
    }(UniswapServiceBase));

    function toQueryString(obj, addQueryPrefix) {
        if (addQueryPrefix === void 0) { addQueryPrefix = true; }
        return qs.stringify(obj, { addQueryPrefix: addQueryPrefix, strictNullHandling: true });
    }

    var EtherscanService = /** @class */ (function () {
        function EtherscanService() {
        }
        /// NORMAL
        EtherscanService.prototype.getNormalTransactions = function (walletAddress, paramsValues) {
            var _this = this;
            return this.limiter.schedule(function () {
                return _this.getNormalTransactionsRaw(walletAddress, paramsValues);
            });
        };
        EtherscanService.prototype.getNormalTransactionsRaw = function (walletAddress, paramsValues) {
            var baseValues = {
                address: walletAddress,
                apikey: this.config.env.etherscanApiKey,
                sort: 'asc',
            };
            var queryParams = toQueryString(__assign(__assign({}, baseValues), paramsValues), false);
            return Axios__default['default'].get(defaultConfig.etherscanApiUrl + "account&action=txlist&" + queryParams).then(function (res) { return res.data; });
        };
        /// INTERNAL
        EtherscanService.prototype.getInternalTransactions = function (walletAddress, paramsValues) {
            var _this = this;
            return this.limiter.schedule(function () {
                return _this.getInternalTransactionsRaw(walletAddress, paramsValues);
            });
        };
        EtherscanService.prototype.getInternalTransactionsRaw = function (walletAddress, paramsValues) {
            var baseValues = {
                address: walletAddress,
                apikey: this.config.env.etherscanApiKey,
                sort: 'asc',
            };
            var queryParams = toQueryString(__assign(__assign({}, baseValues), paramsValues), false);
            return Axios__default['default'].get(defaultConfig.etherscanApiUrl + "account&action=txlistinternal&" + queryParams).then(function (res) { return res.data; });
        };
        /// ERC20
        EtherscanService.prototype.getERC20Transactions = function (walletAddress, paramsValues) {
            var _this = this;
            return this.limiter.schedule(function () {
                return _this.getERC20TransactionsRaw(walletAddress, paramsValues);
            });
        };
        EtherscanService.prototype.getERC20TransactionsRaw = function (walletAddress, paramsValues) {
            var baseValues = {
                address: walletAddress,
                apikey: this.config.env.etherscanApiKey,
                sort: 'asc',
            };
            var queryParams = toQueryString(__assign(__assign({}, baseValues), paramsValues), false);
            return Axios__default['default'].get(defaultConfig.etherscanApiUrl + "account&action=tokentx&" + queryParams).then(function (res) { return res.data; });
        };
        /// ERC721
        EtherscanService.prototype.getERC721Transactions = function (walletAddress, paramsValues) {
            var _this = this;
            return this.limiter.schedule(function () {
                return _this.getERC721TransactionsRaw(walletAddress, paramsValues);
            });
        };
        EtherscanService.prototype.getERC721TransactionsRaw = function (walletAddress, paramsValues) {
            var baseValues = {
                address: walletAddress,
                apikey: this.config.env.etherscanApiKey,
                sort: 'asc',
            };
            var queryParams = toQueryString(__assign(__assign({}, baseValues), paramsValues), false);
            return Axios__default['default'].get(defaultConfig.etherscanApiUrl + "account&action=tokennfttx&" + queryParams).then(function (res) { return res.data; });
        };
        return EtherscanService;
    }());

    var EtherscanServiceClient = /** @class */ (function (_super) {
        __extends(EtherscanServiceClient, _super);
        function EtherscanServiceClient(config) {
            var _this = _super.call(this) || this;
            _this.config = config;
            _this.limiter = new Bottleneck__default['default']({
                minTime: 300,
            });
            return _this;
        }
        return EtherscanServiceClient;
    }(EtherscanService));

    var ParserClient = /** @class */ (function (_super) {
        __extends(ParserClient, _super);
        function ParserClient(config) {
            var _this = _super.call(this, {
                web3Service: new Web3Service(config),
                uniswapService: new UniswapServiceClient(config),
                etherscanService: new EtherscanServiceClient(config),
            }, config) || this;
            _this.config = config;
            return _this;
        }
        return ParserClient;
    }(ParserBase));

    exports.ParserClient = ParserClient;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dexe-crypto-wallet-parser-browser.umd.js.map
