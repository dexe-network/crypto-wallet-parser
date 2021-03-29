"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapPrebuildCacheService = void 0;
var tslib_1 = require("tslib");
var shorthash2_1 = require("shorthash2");
var UniswapPrebuildCacheService = /** @class */ (function () {
    function UniswapPrebuildCacheService() {
        this.cache = new Map();
    }
    UniswapPrebuildCacheService.prototype.getData = function (keyValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key;
            return tslib_1.__generator(this, function (_a) {
                key = shorthash2_1.default(keyValue);
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key;
            return tslib_1.__generator(this, function (_a) {
                key = shorthash2_1.default(keyValue);
                this.setObjectToCache(key, data);
                return [2 /*return*/];
            });
        });
    };
    UniswapPrebuildCacheService.prototype.isExist = function (keyValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key;
            return tslib_1.__generator(this, function (_a) {
                key = shorthash2_1.default(keyValue);
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
exports.UniswapPrebuildCacheService = UniswapPrebuildCacheService;
//# sourceMappingURL=uniswapPrebuildCache.service.js.map