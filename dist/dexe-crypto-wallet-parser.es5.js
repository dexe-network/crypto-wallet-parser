import Web3 from 'web3';
import Bottleneck from 'bottleneck';
import lodash, { uniq, chunk } from 'lodash';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { gql, GraphQLClient } from 'graphql-request';
import IORedis from 'ioredis';
import shortHash from 'shorthash2';
import Axios from 'axios';
import { stringify } from 'qs';

var TradeType;
(function (TradeType) {
    TradeType["BUY"] = "BUY";
    TradeType["SELL"] = "SEll";
})(TradeType || (TradeType = {}));
var TradeStatus;
(function (TradeStatus) {
    TradeStatus["OPEN"] = "OPEN";
    TradeStatus["CLOSE"] = "CLOSE";
})(TradeStatus || (TradeStatus = {}));

var PARSER_MODE;
(function (PARSER_MODE) {
    PARSER_MODE[PARSER_MODE["Wallet"] = 0] = "Wallet";
    PARSER_MODE[PARSER_MODE["W2W"] = 1] = "W2W";
})(PARSER_MODE || (PARSER_MODE = {}));

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
        this.limiter = new Bottleneck({
            minTime: 25,
        });
        this.web3js = new Web3(new Web3.providers.HttpProvider(defaultConfig.infuraUrl + "/" + config.env.infuraProjectId));
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
                        hashes = uniq(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(Object.keys(normalTransactions))), __read(Object.keys(internalTransactions))), __read(Object.keys(erc20Transactions))), __read(Object.keys(erc721Transactions))));
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
        return new BigNumber(0);
    }
    var balance = value;
    var decimalsBN = new BigNumber(decimals);
    var divisor = new BigNumber(10).pow(decimalsBN);
    var beforeDecimal = balance.div(divisor);
    return beforeDecimal;
};
var parsedBalanceToRaw = function (value, decimals) {
    if (!value || !(typeof decimals === 'number')) {
        return new BigNumber(0);
    }
    var balance = value;
    var decimalsBN = new BigNumber(decimals);
    var divisor = new BigNumber(10).pow(decimalsBN);
    var beforeDecimal = balance.multipliedBy(divisor);
    return beforeDecimal;
};

var ParseTransaction = /** @class */ (function () {
    function ParseTransaction(uniswapService) {
        this.uniswapService = uniswapService;
    }
    ParseTransaction.prototype.parseTransactionBalancePrice = function (transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var resultWithParsedBalance, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all(transactions.map(function (value, index, array) { return __awaiter(_this, void 0, void 0, function () {
                                var valueCopy, prices, _a, _b, key, uniswapResultFirst, _c, _d, key, uniswapResultSecond;
                                var e_2, _e, e_3, _f;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            valueCopy = __assign({}, value);
                                            return [4 /*yield*/, this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
                                                    tokens: Object.keys(value.balance),
                                                    blockNumber: valueCopy.blockNumber,
                                                })];
                                        case 1:
                                            prices = _g.sent();
                                            try {
                                                for (_a = __values(Object.keys(value.balance)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                    key = _b.value;
                                                    uniswapResultFirst = prices[valueCopy.balance[key].address];
                                                    valueCopy.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
                                                    valueCopy.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
                                                    valueCopy.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;
                                                    valueCopy.balance[key].amountInETH = buildBalanceTransformer(
                                                    // Catch less zero token balance (Fix minus Dep)
                                                    valueCopy.balance[key].amount.isLessThan(0) ? new BigNumber(0) : valueCopy.balance[key].amount, +valueCopy.balance[key].decimals).multipliedBy(uniswapResultFirst.ethPer1Token);
                                                    valueCopy.balance[key].amountInUSD = buildBalanceTransformer(valueCopy.balance[key].amount.isLessThan(0) ? new BigNumber(0) : valueCopy.balance[key].amount, +valueCopy.balance[key].decimals).multipliedBy(uniswapResultFirst.usdPer1Token);
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
                                                    for (_c = __values(Object.keys(value.balanceBeforeTransaction)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                        key = _d.value;
                                                        uniswapResultSecond = prices[valueCopy.balanceBeforeTransaction[key].address];
                                                        valueCopy.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
                                                        valueCopy.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
                                                        valueCopy.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;
                                                        valueCopy.balanceBeforeTransaction[key].amountInETH = buildBalanceTransformer(valueCopy.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                            ? new BigNumber(0)
                                                            : valueCopy.balanceBeforeTransaction[key].amount, +valueCopy.balanceBeforeTransaction[key].decimals).multipliedBy(uniswapResultSecond.ethPer1Token);
                                                        valueCopy.balanceBeforeTransaction[key].amountInUSD = buildBalanceTransformer(valueCopy.balanceBeforeTransaction[key].amount.isLessThan(0)
                                                            ? new BigNumber(0)
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
                                var valueCopy = __assign({}, value);
                                if (index === 0) ;
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
        var buyEvents = data.tradeEvents.filter(function (x) { return x.tradeType === TradeType.BUY; });
        var sellEvents = data.tradeEvents.filter(function (x) { return x.tradeType === TradeType.SELL; });
        if (sellEvents.length === 0) {
            return {
                profitLoss: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
                profit: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
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
                profitLoss: { eth: new BigNumber(0), usd: new BigNumber(0) },
                profit: { eth: new BigNumber(0), usd: new BigNumber(0) },
            });
            accum.profitLoss.eth = accum.profitLoss.eth.plus(plFromValue.profitLoss.eth);
            accum.profitLoss.usd = accum.profitLoss.usd.plus(plFromValue.profitLoss.usd);
            accum.profit.eth = accum.profit.eth.plus(plFromValue.profit.eth);
            accum.profit.usd = accum.profit.usd.plus(plFromValue.profit.usd);
            return accum;
        }, {
            profitLoss: { eth: new BigNumber(0), usd: new BigNumber(0) },
            profit: { eth: new BigNumber(0), usd: new BigNumber(0) },
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
            profitLoss: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
            profit: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
        });
    };
    CalculateTransaction.prototype.totalPoints = function (data) {
        return data.reduce(function (accum, value) {
            accum = accum.plus(value.points);
            return accum;
        }, new BigNumber(0));
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
        }, { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0) });
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
    if (config.parserMode === PARSER_MODE.W2W) {
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
    TradesBuilderV2.prototype.buildTrades = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var rawResult, openTrades, withVirtualTrades, virtualTrade;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.behaviourIterator(data)];
                    case 1:
                        rawResult = _a.sent();
                        openTrades = Object.values(rawResult)
                            .map(function (x) { return x.trades[x.trades.length - 1]; })
                            .filter(function (x) { return x.tradeStatus === TradeStatus.OPEN; });
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
        return __awaiter(this, void 0, void 0, function () {
            var currentBlockNumber, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.services.web3Service.getCurrentBlockNumberLimiter()];
                    case 1:
                        currentBlockNumber = _a.sent();
                        return [4 /*yield*/, this.parseTransactionWallet.parseTransactionBalancePrice(this.generateVirtualTransactions(openTrades, lastGroupedTransaction, currentBlockNumber))];
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
            var balanceBeforeTransaction = index === 0 ? lastGroupedTransaction.balance : accum[index - 1].balance;
            var result = {
                normalTransactions: [],
                internalTransactions: [],
                erc20Transactions: [],
                erc721Transactions: [],
                balanceBeforeTransaction: balanceBeforeTransaction,
                balance: _this.generateBalanceDiffForVirtualTradePnl(value, balanceBeforeTransaction),
                blockNumber: currentBlockNumber - 10,
                previousTransactionBlockNumber: lastGroupedTransaction.blockNumber,
                feeInETH: new BigNumber(0),
                hash: "AUTO_CLOSE_TRADE_TRANSACTION " + (index + 1),
                timeStamp: moment().unix().toString(),
            };
            accum.push(result);
            return accum;
        }, []);
    };
    TradesBuilderV2.prototype.generateBalanceDiffForVirtualTradePnl = function (trade, balance) {
        var _a;
        return __assign(__assign({}, balance), (_a = {}, _a[trade.tokenAddress] = {
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
                console.log('behaviourIterator', data.length);
                return [2 /*return*/, data.reduce(function (accumulatorValuePromise, currentItem, index) { return __awaiter(_this, void 0, void 0, function () {
                        var accumulatorValue, state, _a, _b, operation, _c, _d, operation;
                        var e_2, _e, e_3, _f;
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
                                            for (_c = __values(state.operations), _d = _c.next(); !_d.done; _d = _c.next()) {
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
        var openTradeIndex = (((_a = accumulatorValue[operation.address]) === null || _a === void 0 ? void 0 : _a.trades) || []).findIndex(function (x) { return x.tradeStatus === TradeStatus.OPEN; });
        if (openTradeIndex >= 0) {
            this.calculateOperationWithOpenTrade(operation, state, accumulatorValue[operation.address], openTradeIndex, balanceBeforeTransaction);
        }
    };
    TradesBuilderV2.prototype.calculateIncomeEvent = function (accumulatorValue, operation, state, balanceBeforeTransaction) {
        if (accumulatorValue[operation.address]) {
            var openTradeIndex = accumulatorValue[operation.address].trades.findIndex(function (x) { return x.tradeStatus === TradeStatus.OPEN; });
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
        if (tradeEvent.tradeType === TradeType.SELL) {
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
            data.trades[openTradeIndex].tradeStatus = TradeStatus.CLOSE;
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
            for (var _b = __values(data.trades[openTradeIndex].tradeEvents.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), index = _d[0], value = _d[1];
                if (value.tradeType === TradeType.BUY && value.balance.isGreaterThan(0)) {
                    var amountResult = value.balance.minus(sellOperationAmount);
                    if (amountResult.isGreaterThanOrEqualTo(0)) {
                        var profitUSD = tradeEvent.price.withFee.usd
                            .minus(value.price.withFee.usd)
                            .multipliedBy(buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));
                        var profitETH = tradeEvent.price.withFee.eth
                            .minus(value.price.withFee.eth)
                            .multipliedBy(buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));
                        value.balance = value.balance.minus(sellOperationAmount);
                        value.sellOperations.push({
                            amount: new BigNumber(sellOperationAmount.toString()),
                            profit: {
                                usd: profitUSD,
                                eth: profitETH,
                            },
                            profitLoss: {
                                usd: profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100),
                                eth: profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100),
                            },
                            tokenInfo: tradeEvent.tokenInfo,
                        });
                        sellOperationAmount = new BigNumber(0);
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
                            value.sellOperations.push({
                                amount: new BigNumber(value.balance.toString()),
                                profit: {
                                    usd: profitUSD,
                                    eth: profitETH,
                                },
                                profitLoss: {
                                    usd: profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100),
                                    eth: profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100),
                                },
                                tokenInfo: tradeEvent.tokenInfo,
                            });
                            sellOperationAmount = sellOperationAmount.minus(value.balance);
                            value.balance = new BigNumber(0);
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
            balance: new BigNumber(operation.amount),
            startDep: this.getBalanceCost(balanceBeforeTransaction),
            tokenAddress: operation.address,
            spendingUSD: new BigNumber(state.amount.withFee.USD),
            spendingETH: new BigNumber(state.amount.withFee.ETH),
            incomeUSD: new BigNumber(0),
            incomeETH: new BigNumber(0),
            tradeStatus: TradeStatus.OPEN,
            tradeEvents: [this.createNewTradeEvent(state, operation, balanceBeforeTransaction)],
            openTimeStamp: state.timeStamp,
            profitLossFromUSD: new BigNumber(0),
            profitLossFromETH: new BigNumber(0),
            profitFromUSD: new BigNumber(0),
            profitFromETH: new BigNumber(0),
            points: new BigNumber(0),
        };
    };
    TradesBuilderV2.prototype.getBalanceCost = function (balance) {
        return Object.values(balance).reduce(function (accum, currentValue) {
            accum.amountInETH = accum.amountInETH.plus(currentValue.amountInETH);
            accum.amountInUSD = accum.amountInUSD.plus(currentValue.amountInUSD);
            return accum;
        }, { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0) });
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
            amount: new BigNumber(operation.amount),
            balance: tradeType === TradeType.BUY ? new BigNumber(operation.amount) : new BigNumber(0),
            averageStartDep: this.calculateAverageStartDep(trade, startDep, price, tradeType),
            tokenInfo: tokenInfo,
            sellOperations: [],
            transactionHash: state.transactionHash,
            timeStamp: state.timeStamp,
            costUSD: new BigNumber(state.amount.raw.USD),
            costETH: new BigNumber(state.amount.raw.ETH),
            transactionFeeETH: state.transactionFeeETH,
            transactionFeeUSD: state.transactionFeeUSD,
            price: price,
            startDep: startDep,
            operationInfo: state.operationInfo,
        };
    };
    TradesBuilderV2.prototype.calculateAverageStartDep = function (trade, startDep, price, tradeType) {
        if (tradeType === TradeType.SELL) {
            return {
                usd: new BigNumber(0),
                eth: new BigNumber(0),
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
            .filter(function (value, index) { return value.tradeType === TradeType.BUY; })
            .reduce(function (accum, value) {
            return accum.plus(buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth));
        }, new BigNumber(0));
        var sellTotalCostETH = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === TradeType.SELL; })
            .reduce(function (accum, value) {
            return accum.plus(buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth));
        }, new BigNumber(0));
        var accumulatedTokens = trade.balance;
        var settlementBalance = trade.startDep.amountInETH
            .minus(buyTotalCostETH)
            .plus(sellTotalCostETH)
            .plus(buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(price.withFee.eth));
        return startDep.amountInETH.minus(settlementBalance).plus(trade.startDep.amountInETH);
    };
    TradesBuilderV2.prototype.averageStartDepUSD = function (trade, startDep, price) {
        var buyTotalCostUSD = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === TradeType.BUY; })
            .reduce(function (accum, value) {
            return accum.plus(buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd));
        }, new BigNumber(0));
        var sellTotalCostUSD = trade.tradeEvents
            .filter(function (value, index) { return value.tradeType === TradeType.SELL; })
            .reduce(function (accum, value) {
            return accum.plus(buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd));
        }, new BigNumber(0));
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
                usd: tradeType === TradeType.BUY
                    ? state.amount.withFee.USD.dividedBy(parsedAmount)
                    : state.amount.raw.USD.minus(state.transactionFeeUSD).dividedBy(parsedAmount),
                eth: tradeType === TradeType.BUY
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
            return TradeType.BUY;
        }
        else {
            return TradeType.SELL;
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
            var state, balancesDifferencesData, normalTransaction, uniswapTransactionData, operationPriceUniRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, operationPriceOtherRaw, transactionFeeETH, transactionFeeUSD, operationPriceIncludeFee, e_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        state = void 0;
                        balancesDifferencesData = this.balanceDifferences(currentData.balance, currentData.balanceBeforeTransaction, currentData.feeInETH);
                        if (!(currentData.normalTransactions &&
                            ((_b = (_a = currentData.normalTransactions[0]) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === defaultConfig.uniswap.uniswapRouterAddress)) return [3 /*break*/, 2];
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
        return __assign(__assign({}, operationPrice), { amountInUSD: operationPrice.amountInUSD.plus(feeUSD), amountInETH: operationPrice.amountInETH.plus(feeETH) });
    };
    TradesBuilderV2.prototype.balanceDifferences = function (currentBalance, beforeBalance, parsedFeeInETH) {
        var e_6, _a;
        var _b, _c, _d;
        var tokensAddress = lodash.uniq(__spreadArray(__spreadArray([], __read(Object.keys(currentBalance))), __read(Object.keys(beforeBalance))));
        var diffs = [];
        var operationInfo = {
            sent: [],
            received: [],
        };
        try {
            for (var tokensAddress_1 = __values(tokensAddress), tokensAddress_1_1 = tokensAddress_1.next(); !tokensAddress_1_1.done; tokensAddress_1_1 = tokensAddress_1.next()) {
                var key = tokensAddress_1_1.value;
                if (!(currentBalance[key].amount.toString() === ((_c = (_b = beforeBalance[key]) === null || _b === void 0 ? void 0 : _b.amount) === null || _c === void 0 ? void 0 : _c.toString()))) {
                    var item = {
                        symbol: currentBalance[key].symbol,
                        name: currentBalance[key].name,
                        address: currentBalance[key].address.toLowerCase(),
                        decimals: currentBalance[key].decimals,
                        amount: ((_d = beforeBalance[key]) === null || _d === void 0 ? void 0 : _d.amount)
                            ? currentBalance[key].amount.minus(beforeBalance[key].amount)
                            : new BigNumber(currentBalance[key].amount.toString()),
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
                    if (item.amount.isLessThan(0) || item.amount.isGreaterThan(0)) {
                        operationInfo.sent.push(item);
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
        }, { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0), usdPer1ETH: new BigNumber(0) });
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
        }, { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0), usdPer1ETH: new BigNumber(0) });
        return outgoing.amountInETH.isGreaterThan(0) ? outgoing : income;
    };
    TradesBuilderV2.prototype.operationPriceFromUniswap = function (data) {
        return {
            amountInETH: new BigNumber(data.amountETH),
            amountInUSD: new BigNumber(data.amountUSD),
            usdPer1ETH: new BigNumber(data.ethPrice),
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
                    : lookupResult.balance, hash: lookupResult.hash, timeStamp: lookupResult.timeStamp });
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
    CalculateBalance.prototype.balanceLookup = function (data, previousBalance, wallet) {
        var _this = this;
        var localPreviousBalance = __assign({}, previousBalance) || {};
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
        }, { balance: __assign({}, localPreviousBalance), feeInETH: new BigNumber(0), blockNumber: 0, hash: '0', timeStamp: '0' });
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
                        amount: new BigNumber(0),
                    };
                }
                // OUT Operation
                if (item.from.toLowerCase() === wallet) {
                    accum.balance[contractAddress] = __assign(__assign({}, accum.balance[contractAddress]), { amount: accum.balance[contractAddress].amount.minus(new BigNumber(item.value)) });
                    accum.feeInETH = new BigNumber(item.gasUsed).multipliedBy(new BigNumber(item.gasPrice));
                    // Catch transaction from contract
                    // ( if transaction from contract and user as contract owner fee write from contract balance )
                    if (!transactionGroup['normalTransactions']) {
                        accum.feeInETH = new BigNumber(0);
                    }
                }
                // In Operation
                if (item.to.toLowerCase() === wallet) {
                    accum.balance[contractAddress] = __assign(__assign({}, accum.balance[contractAddress]), { amount: accum.balance[contractAddress].amount.plus(new BigNumber(item.value)) });
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
            accum.balance[ethDefaultInfo.address] = __assign(__assign({}, ethDefaultInfo), { amount: new BigNumber(0) });
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
                    accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.minus(new BigNumber(item.value)) });
                }
                // In Operation
                if (item.to.toLowerCase() === wallet) {
                    accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.plus(new BigNumber(item.value)) });
                    // Catch WETH Unwrap
                    if (!transactionGroup.erc20Transactions &&
                        item.from.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
                        accum.balance[item.from.toLowerCase()] = __assign(__assign({}, accum.balance[item.from.toLowerCase()]), { amount: accum.balance[item.from.toLowerCase()].amount.minus(new BigNumber(item.value)) });
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
            accum.balance[ethDefaultInfo.address] = __assign(__assign({}, ethDefaultInfo), { amount: new BigNumber(0) });
        }
        try {
            for (var data_3 = __values(data), data_3_1 = data_3.next(); !data_3_1.done; data_3_1 = data_3.next()) {
                var item = data_3_1.value;
                accum.blockNumber = +item.blockNumber;
                accum.hash = item.hash;
                accum.timeStamp = item.timeStamp;
                // Catch Error Transactions and recalculate only fee
                if (item.isError === '1') {
                    accum.feeInETH = new BigNumber(item.gasUsed).multipliedBy(new BigNumber(item.gasPrice));
                    continue;
                }
                // OUT Operation
                if (item.from.toLowerCase() === wallet) {
                    accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.minus(new BigNumber(item.value)) });
                    accum.feeInETH = new BigNumber(item.gasUsed).multipliedBy(new BigNumber(item.gasPrice));
                    // Catch WETH for ETH->WETH transaction ETH WRAP to WETH
                    if (item.to.toLowerCase() === wethDefaultInfo.address) {
                        if (!accum.balance[wethDefaultInfo.address]) {
                            accum.balance[wethDefaultInfo.address] = __assign(__assign({}, wethDefaultInfo), { amount: new BigNumber(0) });
                        }
                        accum.balance[wethDefaultInfo.address] = __assign(__assign({}, accum.balance[wethDefaultInfo.address]), { amount: accum.balance[wethDefaultInfo.address].amount.plus(new BigNumber(item.value)) });
                    }
                }
                // In Operation
                if (item.to.toLowerCase() === wallet) {
                    accum.balance[ethDefaultInfo.address] = __assign(__assign({}, accum.balance[ethDefaultInfo.address]), { amount: accum.balance[ethDefaultInfo.address].amount.plus(new BigNumber(item.value)) });
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

var ParserBase = /** @class */ (function () {
    function ParserBase(services, config) {
        this.services = services;
        this.config = config;
        this.rawTransactions = [];
        this.parserProgress = new BehaviorSubject(0);
        this.getTransaction = new GetTransaction(this.services.etherscanService);
        this.parseTransaction = new ParseTransaction(this.services.uniswapService);
        this.filterTransaction = new FilterTransaction();
        this.transformTransaction = new TransformTransaction();
        this.tradesBuilderV2 = new TradesBuilderV2(this.services, this.config);
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
                        this.parserProgress.complete();
                        console.log('🔥 error: %o', e_1);
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ParserBase.prototype.process = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawTransactions, transactionStep1, transactionStep2, transactionStep3, currentDeposit, startDeposit, lastTransactionBlockNumber, transactionsCount, tradesCount, totalIndicators, totalPoints, e_2;
            return __generator(this, function (_a) {
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

var UniswapCacheService = /** @class */ (function () {
    function UniswapCacheService(config) {
        this.redis = new IORedis(config.env.uniswapCacheRedisURL);
    }
    UniswapCacheService.prototype.getData = function (keyValue) {
        return __awaiter(this, void 0, void 0, function () {
            var key, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = shortHash(keyValue);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.redis.exists(key)];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, this.getObjectFromRedis(key)];
                        }
                        else {
                            throw new Error('Wrong Redis Cache Behaviour');
                        }
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UniswapCacheService.prototype.setData = function (keyValue, data) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = shortHash(keyValue);
                        return [4 /*yield*/, this.setObjectToRedis(key, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UniswapCacheService.prototype.isExist = function (keyValue) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = shortHash(keyValue);
                        return [4 /*yield*/, this.redis.exists(key)];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    UniswapCacheService.prototype.getObjectFromRedis = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.redis.get(key)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    case 2:
                        e_2 = _c.sent();
                        throw e_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UniswapCacheService.prototype.setObjectToRedis = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.redis.set(key, JSON.stringify(data))];
                }
                catch (e) {
                    throw e;
                }
                return [2 /*return*/];
            });
        });
    };
    return UniswapCacheService;
}());

var checkTokenArrPriceInUSDandETHByBlockNumber = gql(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(block: { number: $blockNumber }) {\n      ethPrice\n    }\n  }\n"], ["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(block: { number: $blockNumber }) {\n      ethPrice\n    }\n  }\n"])));
var checkTokenArrPriceInUSDandETHCurrent = gql(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(where: { id: 1 }) {\n      ethPrice\n    }\n  }\n"], ["\n  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!) {\n    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token1Price\n    }\n    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }) {\n      id\n      token0Price\n    }\n    ethPrice: bundles(where: { id: 1 }) {\n      ethPrice\n    }\n  }\n"])));
var templateObject_1$1, templateObject_2$1;

var UniswapServiceBase = /** @class */ (function () {
    function UniswapServiceBase() {
    }
    UniswapServiceBase.prototype.checkTokenPriceInUSDandETHLimiter = function (token, blockNumber) {
        var _this = this;
        return this.limiter.schedule(function () { return _this.checkTokenPriceInUSDandETH(token, blockNumber); });
    };
    UniswapServiceBase.prototype.checkTokenArrPriceInUSDandETHLimiter = function (argumentsData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.limiter.schedule(function () { return _this.checkTokenArrPriceInUSDandETH(argumentsData); })];
            });
        });
    };
    UniswapServiceBase.prototype.getUniswapTransactionByIdLimiter = function (transactionId, blockNumber) {
        var _this = this;
        return this.limiter.schedule(function () {
            return _this.getUniswapTransactionById(transactionId, blockNumber);
        });
    };
    UniswapServiceBase.prototype.checkTokenArrPriceInUSDandETH = function (argumentsData) {
        return __awaiter(this, void 0, void 0, function () {
            var PAIR_SEARCH, tokensArrs, totalResult_1, tokensArrs_1, tokensArrs_1_1, tokens, count, maxTries, _loop_1, state_1, e_1_1, dataResult, e_2;
            var e_1, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        PAIR_SEARCH = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n          usdc0: pairs(\n            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          usdc1: pairs(\n            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          weth0: pairs(\n            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          weth1: pairs(\n            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          ethPrice: bundles(block: { number: $blockNumber }) {\n            ethPrice\n          }\n        }\n      "], ["\n        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n          usdc0: pairs(\n            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          usdc1: pairs(\n            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          weth0: pairs(\n            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          weth1: pairs(\n            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          ethPrice: bundles(block: { number: $blockNumber }) {\n            ethPrice\n          }\n        }\n      "])));
                        tokensArrs = chunk(argumentsData.tokens.map(function (item) { return item.toLowerCase(); }), 5);
                        totalResult_1 = {
                            usdc0: [],
                            usdc1: [],
                            weth0: [],
                            weth1: [],
                            ethPrice: [],
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 9]);
                        tokensArrs_1 = __values(tokensArrs), tokensArrs_1_1 = tokensArrs_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!tokensArrs_1_1.done) return [3 /*break*/, 6];
                        tokens = tokensArrs_1_1.value;
                        count = 0;
                        maxTries = 10;
                        _loop_1 = function () {
                            var localController, localClientGQ, variables, requestTimeLimit, result, e_3;
                            var _c, _d, _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        localController = new AbortController();
                                        localClientGQ = new GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl, {
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
                                        _h.label = 1;
                                    case 1:
                                        _h.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, localClientGQ.request(PAIR_SEARCH, variables)];
                                    case 2:
                                        result = _h.sent();
                                        clearTimeout(requestTimeLimit);
                                        (_c = totalResult_1.ethPrice).push.apply(_c, __spreadArray([], __read(result.ethPrice)));
                                        (_d = totalResult_1.usdc0).push.apply(_d, __spreadArray([], __read(result.usdc0)));
                                        (_e = totalResult_1.usdc1).push.apply(_e, __spreadArray([], __read(result.usdc1)));
                                        (_f = totalResult_1.weth0).push.apply(_f, __spreadArray([], __read(result.weth0)));
                                        (_g = totalResult_1.weth1).push.apply(_g, __spreadArray([], __read(result.weth1)));
                                        return [2 /*return*/, "break"];
                                    case 3:
                                        e_3 = _h.sent();
                                        clearTimeout(requestTimeLimit);
                                        console.log('retry');
                                        if (++count === maxTries) {
                                            throw e_3;
                                        }
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _b.label = 3;
                    case 3:
                        return [5 /*yield**/, _loop_1()];
                    case 4:
                        state_1 = _b.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 5];
                        return [3 /*break*/, 3];
                    case 5:
                        tokensArrs_1_1 = tokensArrs_1.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (tokensArrs_1_1 && !tokensArrs_1_1.done && (_a = tokensArrs_1.return)) _a.call(tokensArrs_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        dataResult = argumentsData.tokens.reduce(function (accum, value, index) {
                            var token = value.toLowerCase();
                            accum[value] = _this.tokenPriceSwitcher(token, totalResult_1);
                            return accum;
                        }, {});
                        return [2 /*return*/, dataResult];
                    case 10:
                        e_2 = _b.sent();
                        throw e_2;
                    case 11: return [2 /*return*/];
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
                        // Catch WETH and ETH price check
                        if (token.toLowerCase() === ethDefaultInfo.address || token.toLowerCase() === wethDefaultInfo.address) {
                            return [2 /*return*/, {
                                    usdPer1Token: new BigNumber(result.ethPrice[0].ethPrice),
                                    ethPer1Token: new BigNumber(1),
                                    usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_a = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _a === void 0 ? void 0 : _a.token1Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new BigNumber((_b = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _b === void 0 ? void 0 : _b.token1Price).multipliedBy(new BigNumber((_c = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _c === void 0 ? void 0 : _c.ethPrice)),
                                    ethPer1Token: new BigNumber((_d = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _d === void 0 ? void 0 : _d.token1Price),
                                    usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_e = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _e === void 0 ? void 0 : _e.token0Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new BigNumber((_f = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _f === void 0 ? void 0 : _f.token0Price).multipliedBy(new BigNumber((_g = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _g === void 0 ? void 0 : _g.ethPrice)),
                                    ethPer1Token: new BigNumber((_h = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _h === void 0 ? void 0 : _h.token0Price),
                                    usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_j = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _j === void 0 ? void 0 : _j.token1Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new BigNumber((_k = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _k === void 0 ? void 0 : _k.token1Price),
                                    ethPer1Token: new BigNumber((_l = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _l === void 0 ? void 0 : _l.token1Price).dividedBy((_m = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _m === void 0 ? void 0 : _m.ethPrice),
                                    usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_o = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _o === void 0 ? void 0 : _o.token0Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new BigNumber((_p = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _p === void 0 ? void 0 : _p.token0Price),
                                    ethPer1Token: new BigNumber((_q = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _q === void 0 ? void 0 : _q.token0Price).dividedBy((_r = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _r === void 0 ? void 0 : _r.ethPrice),
                                    usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
                                }];
                        }
                        return [2 /*return*/, {
                                usdPer1Token: new BigNumber(0),
                                ethPer1Token: new BigNumber(0),
                                usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
                            }];
                    case 4:
                        e_4 = _s.sent();
                        console.log('retry');
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
    UniswapServiceBase.prototype.getUniswapTransactionById = function (transactionId, blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                try {
                    query = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      {\n        swaps(where: { transaction: \"", "\" }) {\n          id\n          transaction {\n            id\n            blockNumber\n            timestamp\n          }\n          timestamp\n          pair {\n            id\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            volumeUSD\n            untrackedVolumeUSD\n          }\n          sender\n          amount0In\n          amount1In\n          amount0Out\n          amount1Out\n          to\n          logIndex\n          amountUSD\n        }\n        ethPrice: bundles(block: { number: ", " }) {\n          ethPrice\n        }\n      }\n    "], ["\n      {\n        swaps(where: { transaction: \"", "\" }) {\n          id\n          transaction {\n            id\n            blockNumber\n            timestamp\n          }\n          timestamp\n          pair {\n            id\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            volumeUSD\n            untrackedVolumeUSD\n          }\n          sender\n          amount0In\n          amount1In\n          amount0Out\n          amount1Out\n          to\n          logIndex\n          amountUSD\n        }\n        ethPrice: bundles(block: { number: ", " }) {\n          ethPrice\n        }\n      }\n    "])), transactionId, blockNumber);
                    return [2 /*return*/, this.clientGQ.request(query).then(function (res) {
                            var _a;
                            if (!res.swaps[0]) {
                                return undefined;
                            }
                            res.swaps[0].amountETH = new BigNumber(res.swaps[0].amountUSD).dividedBy((_a = res === null || res === void 0 ? void 0 : res.ethPrice[0]) === null || _a === void 0 ? void 0 : _a.ethPrice).toString();
                            res.swaps[0].ethPrice = res.ethPrice[0].ethPrice;
                            return res.swaps[0];
                        })];
                }
                catch (e) {
                    throw e;
                }
                return [2 /*return*/];
            });
        });
    };
    UniswapServiceBase.prototype.tokenPriceSwitcher = function (token, data) {
        var ethPrice = data.ethPrice[0].ethPrice;
        // Catch WETH and ETH price check
        if (token === ethDefaultInfo.address || token === wethDefaultInfo.address) {
            return {
                usdPer1Token: new BigNumber(ethPrice),
                ethPer1Token: new BigNumber(1),
                usdPer1ETH: new BigNumber(ethPrice),
            };
        }
        var weth0 = data.weth0.find(function (x) { return x.token0.id === token; });
        if (weth0 === null || weth0 === void 0 ? void 0 : weth0.token1Price) {
            return {
                usdPer1Token: new BigNumber(weth0.token1Price).multipliedBy(new BigNumber(ethPrice)),
                ethPer1Token: new BigNumber(weth0.token1Price),
                usdPer1ETH: new BigNumber(ethPrice),
            };
        }
        var weth1 = data.weth1.find(function (x) { return x.token1.id === token; });
        if (weth1 === null || weth1 === void 0 ? void 0 : weth1.token0Price) {
            return {
                usdPer1Token: new BigNumber(weth1.token0Price).multipliedBy(new BigNumber(ethPrice)),
                ethPer1Token: new BigNumber(weth1.token0Price),
                usdPer1ETH: new BigNumber(ethPrice),
            };
        }
        var usdc0 = data.usdc0.find(function (x) { return x.token0.id === token; });
        if (usdc0 === null || usdc0 === void 0 ? void 0 : usdc0.token1Price) {
            return {
                usdPer1Token: new BigNumber(usdc0.token1Price),
                ethPer1Token: new BigNumber(usdc0.token1Price).dividedBy(ethPrice),
                usdPer1ETH: new BigNumber(ethPrice),
            };
        }
        var usdc1 = data.usdc1.find(function (x) { return x.token1.id === token; });
        if (usdc1 === null || usdc1 === void 0 ? void 0 : usdc1.token0Price) {
            return {
                usdPer1Token: new BigNumber(usdc1.token0Price),
                ethPer1Token: new BigNumber(usdc1.token0Price).dividedBy(ethPrice),
                usdPer1ETH: new BigNumber(ethPrice),
            };
        }
        return {
            usdPer1Token: new BigNumber(0),
            ethPer1Token: new BigNumber(0),
            usdPer1ETH: new BigNumber(ethPrice),
        };
    };
    return UniswapServiceBase;
}());
var templateObject_1, templateObject_2;

var UniswapServiceApi = /** @class */ (function (_super) {
    __extends(UniswapServiceApi, _super);
    function UniswapServiceApi(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.redis = new IORedis(_this.config.env.bottleneckRedisURL);
        var connection = new Bottleneck.IORedisConnection({ client: _this.redis });
        _this.limiter = new Bottleneck({
            minTime: 25,
            id: 'uniswap',
            clearDatastore: false,
            datastore: 'ioredis',
            connection: connection,
            Redis: IORedis,
        });
        _this.clientGQ = new GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl);
        _this.uniswapCacheService = new UniswapCacheService(_this.config);
        return _this;
    }
    UniswapServiceApi.prototype.checkTokenArrPriceInUSDandETHLimiter = function (argumentsData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uniswapCacheService.isExist(JSON.stringify(argumentsData))];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.uniswapCacheService.getData(JSON.stringify(argumentsData))];
                        }
                        return [2 /*return*/, _super.prototype.checkTokenArrPriceInUSDandETHLimiter.call(this, argumentsData)];
                }
            });
        });
    };
    UniswapServiceApi.prototype.checkTokenArrPriceInUSDandETH = function (argumentsData) {
        return __awaiter(this, void 0, void 0, function () {
            var dataResult, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, _super.prototype.checkTokenArrPriceInUSDandETH.call(this, argumentsData)];
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
                }
            });
        });
    };
    return UniswapServiceApi;
}(UniswapServiceBase));

function toQueryString(obj, addQueryPrefix) {
    if (addQueryPrefix === void 0) { addQueryPrefix = true; }
    return stringify(obj, { addQueryPrefix: addQueryPrefix, strictNullHandling: true });
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
        return Axios.get(defaultConfig.etherscanApiUrl + "account&action=txlist&" + queryParams).then(function (res) { return res.data; });
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
        return Axios.get(defaultConfig.etherscanApiUrl + "account&action=txlistinternal&" + queryParams).then(function (res) { return res.data; });
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
        return Axios.get(defaultConfig.etherscanApiUrl + "account&action=tokentx&" + queryParams).then(function (res) { return res.data; });
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
        return Axios.get(defaultConfig.etherscanApiUrl + "account&action=tokennfttx&" + queryParams).then(function (res) { return res.data; });
    };
    return EtherscanService;
}());

var EtherscanServiceApi = /** @class */ (function (_super) {
    __extends(EtherscanServiceApi, _super);
    function EtherscanServiceApi(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.redis = new IORedis(_this.config.env.bottleneckRedisURL);
        var connection = new Bottleneck.IORedisConnection({ client: _this.redis });
        _this.limiter = new Bottleneck({
            minTime: 450,
            id: 'etherscan',
            clearDatastore: true,
            datastore: 'ioredis',
            connection: connection,
            Redis: IORedis,
        });
        return _this;
    }
    return EtherscanServiceApi;
}(EtherscanService));

var ParserApi = /** @class */ (function (_super) {
    __extends(ParserApi, _super);
    function ParserApi(config) {
        var _this = _super.call(this, {
            web3Service: new Web3Service(config),
            uniswapService: new UniswapServiceApi(config),
            etherscanService: new EtherscanServiceApi(config),
        }, config) || this;
        _this.config = config;
        return _this;
    }
    ParserApi.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initStep3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.init.call(this)];
                    case 1:
                        _a.sent();
                        initStep3 = this.filterTransaction.filterAfterRegistration(this.rawTransactions, this.config.startCheckBlockNumber);
                        this.rawTransactions = initStep3;
                        return [2 /*return*/];
                }
            });
        });
    };
    ParserApi.prototype.hasNewTransactions = function () {
        var data = this.filterTransaction.filterAfterRegistration(this.rawTransactions, this.config.lastCheckBlockNumber);
        return data.length > 0;
    };
    return ParserApi;
}(ParserBase));

export { PARSER_MODE, ParserApi, TradeStatus, TradeType };
//# sourceMappingURL=dexe-crypto-wallet-parser.es5.js.map
