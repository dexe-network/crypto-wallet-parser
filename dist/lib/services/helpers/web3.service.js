"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = require("web3");
var bottleneck_1 = require("bottleneck");
var defaultConfig_1 = require("../../constants/defaultConfig");
var Web3Service = /** @class */ (function () {
    function Web3Service(config) {
        this.limiter = new bottleneck_1.default({
            minTime: 25,
        });
        this.web3js = new web3_1.default(new web3_1.default.providers.HttpProvider(defaultConfig_1.default.infuraUrl + "/" + config.env.infuraProjectId));
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
exports.default = Web3Service;
//# sourceMappingURL=web3.service.js.map