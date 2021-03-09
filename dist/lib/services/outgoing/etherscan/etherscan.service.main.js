"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherscanServiceApi = void 0;
var tslib_1 = require("tslib");
var ioredis_1 = require("ioredis");
var bottleneck_1 = require("bottleneck");
var etherscan_service_1 = require("./etherscan.service");
var EtherscanServiceApi = /** @class */ (function (_super) {
    tslib_1.__extends(EtherscanServiceApi, _super);
    function EtherscanServiceApi(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.redis = new ioredis_1.default(_this.config.env.bottleneckRedisURL);
        var connection = new bottleneck_1.default.IORedisConnection({ client: _this.redis });
        _this.limiter = new bottleneck_1.default({
            minTime: 450,
            id: 'etherscan',
            clearDatastore: true,
            datastore: 'ioredis',
            connection: connection,
            Redis: ioredis_1.default,
        });
        return _this;
    }
    return EtherscanServiceApi;
}(etherscan_service_1.EtherscanService));
exports.EtherscanServiceApi = EtherscanServiceApi;
//# sourceMappingURL=etherscan.service.main.js.map