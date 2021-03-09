"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherscanServiceClient = void 0;
var tslib_1 = require("tslib");
var bottleneck_1 = require("bottleneck");
var etherscan_service_1 = require("./etherscan.service");
var EtherscanServiceClient = /** @class */ (function (_super) {
    tslib_1.__extends(EtherscanServiceClient, _super);
    function EtherscanServiceClient(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.limiter = new bottleneck_1.default({
            minTime: 300,
        });
        return _this;
    }
    return EtherscanServiceClient;
}(etherscan_service_1.EtherscanService));
exports.EtherscanServiceClient = EtherscanServiceClient;
//# sourceMappingURL=etherscan.service.browser.js.map