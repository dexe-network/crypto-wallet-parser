"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserApi = void 0;
var tslib_1 = require("tslib");
var web3_service_1 = require("../services/helpers/web3.service");
var parsers_1 = require("./parsers");
var uniswap_main_service_1 = require("../services/outgoing/uniswap/uniswap.main.service");
var etherscan_service_main_1 = require("../services/outgoing/etherscan/etherscan.service.main");
var ParserApi = /** @class */ (function (_super) {
    tslib_1.__extends(ParserApi, _super);
    function ParserApi(config) {
        var _this = _super.call(this, {
            web3Service: new web3_service_1.default(config),
            uniswapService: new uniswap_main_service_1.UniswapServiceApi(config),
            etherscanService: new etherscan_service_main_1.EtherscanServiceApi(config),
        }, config) || this;
        _this.config = config;
        return _this;
    }
    ParserApi.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var initStep3;
            return tslib_1.__generator(this, function (_a) {
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
}(parsers_1.ParserBase));
exports.ParserApi = ParserApi;
//# sourceMappingURL=parser.main.js.map