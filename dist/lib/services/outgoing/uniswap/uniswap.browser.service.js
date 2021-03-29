"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapServiceClient = void 0;
var tslib_1 = require("tslib");
var bottleneck_1 = require("bottleneck");
var graphql_request_1 = require("graphql-request");
var defaultConfig_1 = require("../../../constants/defaultConfig");
var uniswap_service_1 = require("./uniswap.service");
var uniswapPrebuildCache_service_1 = require("../../helpers/uniswapPrebuildCache.service");
var UniswapServiceClient = /** @class */ (function (_super) {
    tslib_1.__extends(UniswapServiceClient, _super);
    function UniswapServiceClient(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.limiter = new bottleneck_1.default({
            minTime: 200,
            maxConcurrent: 5,
        });
        _this.clientGQ = new graphql_request_1.GraphQLClient(defaultConfig_1.default.uniswap.uniswapGQLEndpointUrl);
        _this.uniswapCacheService = new uniswapPrebuildCache_service_1.UniswapPrebuildCacheService();
        return _this;
    }
    return UniswapServiceClient;
}(uniswap_service_1.UniswapServiceBase));
exports.UniswapServiceClient = UniswapServiceClient;
//# sourceMappingURL=uniswap.browser.service.js.map