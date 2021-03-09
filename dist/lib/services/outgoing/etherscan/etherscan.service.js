"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherscanService = void 0;
var tslib_1 = require("tslib");
var axios_1 = require("axios");
var http_helper_1 = require("../../../helpers/http.helper");
var defaultConfig_1 = require("../../../constants/defaultConfig");
var EtherscanService = /** @class */ (function () {
    function EtherscanService() {
    }
    /// NORMAL
    EtherscanService.prototype.getNormalTransactions = function (walletAddress, paramsValues) {
        var _this = this;
        return this.limiter.schedule(function () {
            return _this.getNormalTransactionsRaw(walletAddress, paramsValues);
        });
    };
    EtherscanService.prototype.getNormalTransactionsRaw = function (walletAddress, paramsValues) {
        var baseValues = {
            address: walletAddress,
            apikey: this.config.env.etherscanApiKey,
            sort: 'asc',
        };
        var queryParams = http_helper_1.toQueryString(tslib_1.__assign(tslib_1.__assign({}, baseValues), paramsValues), false);
        return axios_1.default.get(defaultConfig_1.default.etherscanApiUrl + "account&action=txlist&" + queryParams).then(function (res) { return res.data; });
    };
    /// INTERNAL
    EtherscanService.prototype.getInternalTransactions = function (walletAddress, paramsValues) {
        var _this = this;
        return this.limiter.schedule(function () {
            return _this.getInternalTransactionsRaw(walletAddress, paramsValues);
        });
    };
    EtherscanService.prototype.getInternalTransactionsRaw = function (walletAddress, paramsValues) {
        var baseValues = {
            address: walletAddress,
            apikey: this.config.env.etherscanApiKey,
            sort: 'asc',
        };
        var queryParams = http_helper_1.toQueryString(tslib_1.__assign(tslib_1.__assign({}, baseValues), paramsValues), false);
        return axios_1.default.get(defaultConfig_1.default.etherscanApiUrl + "account&action=txlistinternal&" + queryParams).then(function (res) { return res.data; });
    };
    /// ERC20
    EtherscanService.prototype.getERC20Transactions = function (walletAddress, paramsValues) {
        var _this = this;
        return this.limiter.schedule(function () {
            return _this.getERC20TransactionsRaw(walletAddress, paramsValues);
        });
    };
    EtherscanService.prototype.getERC20TransactionsRaw = function (walletAddress, paramsValues) {
        var baseValues = {
            address: walletAddress,
            apikey: this.config.env.etherscanApiKey,
            sort: 'asc',
        };
        var queryParams = http_helper_1.toQueryString(tslib_1.__assign(tslib_1.__assign({}, baseValues), paramsValues), false);
        return axios_1.default.get(defaultConfig_1.default.etherscanApiUrl + "account&action=tokentx&" + queryParams).then(function (res) { return res.data; });
    };
    /// ERC721
    EtherscanService.prototype.getERC721Transactions = function (walletAddress, paramsValues) {
        var _this = this;
        return this.limiter.schedule(function () {
            return _this.getERC721TransactionsRaw(walletAddress, paramsValues);
        });
    };
    EtherscanService.prototype.getERC721TransactionsRaw = function (walletAddress, paramsValues) {
        var baseValues = {
            address: walletAddress,
            apikey: this.config.env.etherscanApiKey,
            sort: 'asc',
        };
        var queryParams = http_helper_1.toQueryString(tslib_1.__assign(tslib_1.__assign({}, baseValues), paramsValues), false);
        return axios_1.default.get(defaultConfig_1.default.etherscanApiUrl + "account&action=tokennfttx&" + queryParams).then(function (res) { return res.data; });
    };
    return EtherscanService;
}());
exports.EtherscanService = EtherscanService;
//# sourceMappingURL=etherscan.service.js.map