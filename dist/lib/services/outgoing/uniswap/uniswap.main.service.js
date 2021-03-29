"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapServiceApi = void 0;
var tslib_1 = require("tslib");
var bottleneck_1 = require("bottleneck");
var graphql_request_1 = require("graphql-request");
var uniswapCache_service_1 = require("../../helpers/uniswapCache.service");
var ioredis_1 = require("ioredis");
var defaultConfig_1 = require("../../../constants/defaultConfig");
var uniswap_service_1 = require("./uniswap.service");
var UniswapServiceApi = /** @class */ (function (_super) {
    tslib_1.__extends(UniswapServiceApi, _super);
    function UniswapServiceApi(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.redis = new ioredis_1.default(_this.config.env.bottleneckRedisURL);
        var connection = new bottleneck_1.default.IORedisConnection({ client: _this.redis });
        _this.limiter = new bottleneck_1.default({
            minTime: 25,
            id: 'uniswap',
            clearDatastore: false,
            datastore: 'ioredis',
            connection: connection,
            Redis: ioredis_1.default,
        });
        _this.clientGQ = new graphql_request_1.GraphQLClient(defaultConfig_1.default.uniswap.uniswapGQLEndpointUrl);
        _this.uniswapCacheService = new uniswapCache_service_1.UniswapCacheService(_this.config);
        return _this;
    }
    return UniswapServiceApi;
}(uniswap_service_1.UniswapServiceBase));
exports.UniswapServiceApi = UniswapServiceApi;
//# sourceMappingURL=uniswap.main.service.js.map