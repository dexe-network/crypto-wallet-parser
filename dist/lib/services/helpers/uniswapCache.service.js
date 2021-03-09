"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapCacheService = void 0;
var tslib_1 = require("tslib");
var ioredis_1 = require("ioredis");
var shorthash2_1 = require("shorthash2");
var UniswapCacheService = /** @class */ (function () {
    function UniswapCacheService(config) {
        this.redis = new ioredis_1.default(config.env.uniswapCacheRedisURL);
    }
    UniswapCacheService.prototype.getData = function (keyValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = shorthash2_1.default(keyValue);
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
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UniswapCacheService.prototype.setData = function (keyValue, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = shorthash2_1.default(keyValue);
                        return [4 /*yield*/, this.setObjectToRedis(key, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UniswapCacheService.prototype.isExist = function (keyValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = shorthash2_1.default(keyValue);
                        return [4 /*yield*/, this.redis.exists(key)];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    UniswapCacheService.prototype.getObjectFromRedis = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, e_2;
            return tslib_1.__generator(this, function (_c) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
exports.UniswapCacheService = UniswapCacheService;
//# sourceMappingURL=uniswapCache.service.js.map