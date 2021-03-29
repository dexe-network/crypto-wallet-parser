"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapServiceBase = void 0;
var tslib_1 = require("tslib");
var graphql_request_1 = require("graphql-request");
var bignumber_js_1 = require("bignumber.js");
var tokenInfo_1 = require("../../../constants/tokenInfo");
var uniswap_gqlRequests_1 = require("./uniswap.gqlRequests");
var lodash_1 = require("lodash");
var defaultConfig_1 = require("../../../constants/defaultConfig");
var rxjs_1 = require("rxjs");
var UniswapServiceBase = /** @class */ (function () {
    function UniswapServiceBase() {
        this.requestCounter = new rxjs_1.BehaviorSubject(0);
    }
    UniswapServiceBase.prototype.checkTokenPriceInUSDandETHLimiter = function (token, blockNumber) {
        var _this = this;
        return this.limiter.schedule(function () { return _this.checkTokenPriceInUSDandETH(token, blockNumber); });
    };
    UniswapServiceBase.prototype.checkTokenArrPriceInUSDandETHLimiter = function (argumentsData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var PAIR_SEARCH, tokensArrs, totalResult_1, tokensArrs_1, tokensArrs_1_1, tokens, count, maxTries, _loop_1, this_1, state_1, e_1_1, dataResult, _a, e_2;
            var e_1, _b;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 14, , 15]);
                        PAIR_SEARCH = graphql_request_1.gql(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n          usdc0: pairs(\n            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          usdc1: pairs(\n            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          weth0: pairs(\n            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          weth1: pairs(\n            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          ethPrice: bundles(block: { number: $blockNumber }) {\n            ethPrice\n          }\n        }\n      "], ["\n        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {\n          usdc0: pairs(\n            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          usdc1: pairs(\n            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          weth0: pairs(\n            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token1Price\n            token0 {\n              id\n              symbol\n            }\n          }\n          weth1: pairs(\n            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }\n            block: { number: $blockNumber }\n          ) {\n            id\n            token0Price\n            token1 {\n              id\n              symbol\n            }\n          }\n          ethPrice: bundles(block: { number: $blockNumber }) {\n            ethPrice\n          }\n        }\n      "])));
                        tokensArrs = lodash_1.chunk(argumentsData.tokens.map(function (item) { return item.toLowerCase(); }), 5);
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
                        tokensArrs_1 = tslib_1.__values(tokensArrs), tokensArrs_1_1 = tokensArrs_1.next();
                        _c.label = 2;
                    case 2:
                        if (!!tokensArrs_1_1.done) return [3 /*break*/, 6];
                        tokens = tokensArrs_1_1.value;
                        count = 0;
                        maxTries = 10;
                        _loop_1 = function () {
                            var localController, localClientGQ, variables, requestTimeLimit, result, e_3;
                            var _d, _e, _f, _g, _h;
                            return tslib_1.__generator(this, function (_j) {
                                switch (_j.label) {
                                    case 0:
                                        localController = new AbortController();
                                        localClientGQ = new graphql_request_1.GraphQLClient(defaultConfig_1.default.uniswap.uniswapGQLEndpointUrl, {
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
                                        (_d = totalResult_1.ethPrice).push.apply(_d, tslib_1.__spreadArray([], tslib_1.__read(result.ethPrice)));
                                        (_e = totalResult_1.usdc0).push.apply(_e, tslib_1.__spreadArray([], tslib_1.__read(result.usdc0)));
                                        (_f = totalResult_1.usdc1).push.apply(_f, tslib_1.__spreadArray([], tslib_1.__read(result.usdc1)));
                                        (_g = totalResult_1.weth0).push.apply(_g, tslib_1.__spreadArray([], tslib_1.__read(result.weth0)));
                                        (_h = totalResult_1.weth1).push.apply(_h, tslib_1.__spreadArray([], tslib_1.__read(result.weth1)));
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
                        if (!true) return [3 /*break*/, 5];
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var count, maxTries, PAIR_SEARCH, variables, result, e_4;
            return tslib_1.__generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        count = 0;
                        maxTries = 10;
                        _s.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        _s.label = 2;
                    case 2:
                        _s.trys.push([2, 4, , 5]);
                        PAIR_SEARCH = blockNumber
                            ? uniswap_gqlRequests_1.checkTokenArrPriceInUSDandETHByBlockNumber
                            : uniswap_gqlRequests_1.checkTokenArrPriceInUSDandETHCurrent;
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
                        if (token.toLowerCase() === tokenInfo_1.ethDefaultInfo.address || token.toLowerCase() === tokenInfo_1.wethDefaultInfo.address) {
                            return [2 /*return*/, {
                                    usdPer1Token: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
                                    ethPer1Token: new bignumber_js_1.default(1),
                                    usdPer1ETH: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_a = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _a === void 0 ? void 0 : _a.token1Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new bignumber_js_1.default((_b = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _b === void 0 ? void 0 : _b.token1Price).multipliedBy(new bignumber_js_1.default((_c = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _c === void 0 ? void 0 : _c.ethPrice)),
                                    ethPer1Token: new bignumber_js_1.default((_d = result === null || result === void 0 ? void 0 : result.weth0[0]) === null || _d === void 0 ? void 0 : _d.token1Price),
                                    usdPer1ETH: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_e = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _e === void 0 ? void 0 : _e.token0Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new bignumber_js_1.default((_f = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _f === void 0 ? void 0 : _f.token0Price).multipliedBy(new bignumber_js_1.default((_g = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _g === void 0 ? void 0 : _g.ethPrice)),
                                    ethPer1Token: new bignumber_js_1.default((_h = result === null || result === void 0 ? void 0 : result.weth1[0]) === null || _h === void 0 ? void 0 : _h.token0Price),
                                    usdPer1ETH: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_j = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _j === void 0 ? void 0 : _j.token1Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new bignumber_js_1.default((_k = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _k === void 0 ? void 0 : _k.token1Price),
                                    ethPer1Token: new bignumber_js_1.default((_l = result === null || result === void 0 ? void 0 : result.usdc0[0]) === null || _l === void 0 ? void 0 : _l.token1Price).dividedBy((_m = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _m === void 0 ? void 0 : _m.ethPrice),
                                    usdPer1ETH: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
                                }];
                        }
                        if ((_o = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _o === void 0 ? void 0 : _o.token0Price) {
                            return [2 /*return*/, {
                                    usdPer1Token: new bignumber_js_1.default((_p = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _p === void 0 ? void 0 : _p.token0Price),
                                    ethPer1Token: new bignumber_js_1.default((_q = result === null || result === void 0 ? void 0 : result.usdc1[0]) === null || _q === void 0 ? void 0 : _q.token0Price).dividedBy((_r = result === null || result === void 0 ? void 0 : result.ethPrice[0]) === null || _r === void 0 ? void 0 : _r.ethPrice),
                                    usdPer1ETH: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
                                }];
                        }
                        return [2 /*return*/, {
                                usdPer1Token: new bignumber_js_1.default(0),
                                ethPer1Token: new bignumber_js_1.default(0),
                                usdPer1ETH: new bignumber_js_1.default(result.ethPrice[0].ethPrice),
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, dataResult, _a, e_5;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        query = graphql_request_1.gql(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n      {\n        swaps(where: { transaction: \"", "\" }) {\n          id\n          transaction {\n            id\n            blockNumber\n            timestamp\n          }\n          timestamp\n          pair {\n            id\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            volumeUSD\n            untrackedVolumeUSD\n          }\n          sender\n          amount0In\n          amount1In\n          amount0Out\n          amount1Out\n          to\n          logIndex\n          amountUSD\n        }\n        ethPrice: bundles(block: { number: ", " }) {\n          ethPrice\n        }\n      }\n    "], ["\n      {\n        swaps(where: { transaction: \"", "\" }) {\n          id\n          transaction {\n            id\n            blockNumber\n            timestamp\n          }\n          timestamp\n          pair {\n            id\n            token0 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            token1 {\n              id\n              symbol\n              name\n              decimals\n              totalSupply\n              tradeVolume\n              tradeVolumeUSD\n              untrackedVolumeUSD\n              txCount\n              totalLiquidity\n              derivedETH\n            }\n            volumeUSD\n            untrackedVolumeUSD\n          }\n          sender\n          amount0In\n          amount1In\n          amount0Out\n          amount1Out\n          to\n          logIndex\n          amountUSD\n        }\n        ethPrice: bundles(block: { number: ", " }) {\n          ethPrice\n        }\n      }\n    "])), argumentsData.transactionId, argumentsData.blockNumber);
                        return [4 /*yield*/, this.clientGQ.request(query).then(function (res) {
                                var _a;
                                _this.requestCounter.next(_this.requestCounter.value + 1);
                                if (!res.swaps[0]) {
                                    return undefined;
                                }
                                res.swaps[0].amountETH = new bignumber_js_1.default(res.swaps[0].amountUSD).dividedBy((_a = res === null || res === void 0 ? void 0 : res.ethPrice[0]) === null || _a === void 0 ? void 0 : _a.ethPrice).toString();
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
        if (token === tokenInfo_1.ethDefaultInfo.address || token === tokenInfo_1.wethDefaultInfo.address) {
            return {
                usdPer1Token: new bignumber_js_1.default(ethPrice),
                ethPer1Token: new bignumber_js_1.default(1),
                usdPer1ETH: new bignumber_js_1.default(ethPrice),
            };
        }
        var weth0 = data.weth0.find(function (x) { return x.token0.id === token; });
        if (weth0 === null || weth0 === void 0 ? void 0 : weth0.token1Price) {
            return {
                usdPer1Token: new bignumber_js_1.default(weth0.token1Price).multipliedBy(new bignumber_js_1.default(ethPrice)),
                ethPer1Token: new bignumber_js_1.default(weth0.token1Price),
                usdPer1ETH: new bignumber_js_1.default(ethPrice),
            };
        }
        var weth1 = data.weth1.find(function (x) { return x.token1.id === token; });
        if (weth1 === null || weth1 === void 0 ? void 0 : weth1.token0Price) {
            return {
                usdPer1Token: new bignumber_js_1.default(weth1.token0Price).multipliedBy(new bignumber_js_1.default(ethPrice)),
                ethPer1Token: new bignumber_js_1.default(weth1.token0Price),
                usdPer1ETH: new bignumber_js_1.default(ethPrice),
            };
        }
        var usdc0 = data.usdc0.find(function (x) { return x.token0.id === token; });
        if (usdc0 === null || usdc0 === void 0 ? void 0 : usdc0.token1Price) {
            return {
                usdPer1Token: new bignumber_js_1.default(usdc0.token1Price),
                ethPer1Token: new bignumber_js_1.default(usdc0.token1Price).dividedBy(ethPrice),
                usdPer1ETH: new bignumber_js_1.default(ethPrice),
            };
        }
        var usdc1 = data.usdc1.find(function (x) { return x.token1.id === token; });
        if (usdc1 === null || usdc1 === void 0 ? void 0 : usdc1.token0Price) {
            return {
                usdPer1Token: new bignumber_js_1.default(usdc1.token0Price),
                ethPer1Token: new bignumber_js_1.default(usdc1.token0Price).dividedBy(ethPrice),
                usdPer1ETH: new bignumber_js_1.default(ethPrice),
            };
        }
        return {
            usdPer1Token: new bignumber_js_1.default(0),
            ethPer1Token: new bignumber_js_1.default(0),
            usdPer1ETH: new bignumber_js_1.default(ethPrice),
        };
    };
    return UniswapServiceBase;
}());
exports.UniswapServiceBase = UniswapServiceBase;
var templateObject_1, templateObject_2;
//# sourceMappingURL=uniswap.service.js.map