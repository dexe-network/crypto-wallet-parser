"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserClient = void 0;
var tslib_1 = require("tslib");
var web3_service_1 = require("../services/helpers/web3.service");
var parsers_1 = require("./parsers");
var uniswap_browser_service_1 = require("../services/outgoing/uniswap/uniswap.browser.service");
var etherscan_service_browser_1 = require("../services/outgoing/etherscan/etherscan.service.browser");
var ParserClient = /** @class */ (function (_super) {
    tslib_1.__extends(ParserClient, _super);
    function ParserClient(config) {
        var _this = _super.call(this, {
            web3Service: new web3_service_1.default(config),
            uniswapService: new uniswap_browser_service_1.UniswapServiceClient(config),
            etherscanService: new etherscan_service_browser_1.EtherscanServiceClient(config),
        }) || this;
        _this.config = config;
        return _this;
    }
    return ParserClient;
}(parsers_1.ParserBase));
exports.ParserClient = ParserClient;
//# sourceMappingURL=parser.browser.js.map